import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native-style-shorthand";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";
import { api } from "../../redux/api";
import ICONS from "../../constants/icons";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import NotificationModal from "./NotificationModal";
import { navigate } from "../../utils/navigationService";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import usePagination from "../../hooks/usePagination";
import { useDispatch } from "react-redux";
import { homeActions } from "../../redux/homeSlice";
import { Image, ImageBackground } from "react-native-style-shorthand";
import MainLayout from "../../components/MainLayout";
import { RFValue } from "react-native-responsive-fontsize";
import timeDiff from "../../utils/timeDiff";
import { profilePicturePlaceholder } from "../../utils/constants";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const NotificationRow = ({ item, showModal, setModalData }: any) => {
  const deviceHeight = useWindowDimensions().height;
  const user = useAppSelector((state) => state.user);
  const [
    markAsSeen,
    { isSuccess, data },
  ] = api.useMarkNotificationAsReadMutation();
  const [seen, setSeen] = React.useState(item.seen);
  const dispatch = useDispatch();

  const navigationHandling = () => {
    const showPopup = () => {
      setModalData(item);
      showModal();
    };
    item?.popup?.buttonText?.length > 0
      ? showPopup()
      : item?.navigateTo?.length > 0 && navigate(item?.navigateTo, {...item.params});
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        homeActions.updateShowNotificationIcon(
          data?.data?.isRedDotShown || false
        )
      );
      navigationHandling();
    }
  }, [isSuccess]);

  const onPress = () => {
    logAnalyticsEvents('clicked_notification', {notificationId: item._id});
    if (!seen) {
      setSeen(true);
      markAsSeen({ notificationId: item._id, userid: user?.user_id });
    } else {
      navigationHandling();
    }
  };

  return (
    <TouchableOpacity
      bgc={seen ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.2)"}
      ph={16}
      pv={16}
      br={12}
      onPress={onPress}
      blw={!seen ? 4 : 0}
      bc={seen ? "#FFF" : "#6691FF"}
      blc={!seen ? "#6691FF" : "#000"}
    >
      <View
        fd="row"
        pr={50}
        pl={6}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          h={34}
          w={34}
          br={34}
          bgc={item?.profile_img?.length > 0 ? "#D8E3FC" : ""}
          jc="center"
          ai="center"
        >
          <Image
            source={{
              uri:
                item?.profile_img?.length > 0
                  ? item?.profile_img
                  : profilePicturePlaceholder,
            }}
            h={34}
            w={34}
            br={12}
          />
        </View>
        <View f={1}>
          {item?.isHTML ? (
            <View pl={13}>
              <RenderHTML
                systemFonts={["Manrope-Regular"]}
                contentWidth={useWindowDimensions().width - 45}
                source={{ html: item?.text }}
                tagsStyles={{
                  body: {
                    whiteSpace: "normal",
                    fontSize: RFValue(12, (deviceHeight-100)),
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                    color: "#333",
                  },
                }}
              />
            </View>
          ) : (
            <Text ftsz={12} pl={13} weight="400" c={"#333"}>
              {item.text}
            </Text>
          )}
          <Text ftsz={12} pl={13} weight="500" mt={4} c={"#666"}>
            {timeDiff(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const user = useAppSelector((state) => state.user);
  const [
    getNotifications,
    { data, isError, error, isFetching, isSuccess },
  ] = api.useLazyGetNotificationsQuery();
  const [notificationList, setNotificationList] = useState([]);
  const {
    data: notificationData,
    page: notificationPage,
    onReachedEnd: onReachedNotificationsEnd,
    loadingMoreData: loadMoreNotificationsData,
    reset,
  } = usePagination("", notificationList, 20, 1);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const dispatch = useDispatch();

  const [
    markAllNotificationsAsRead,
    { isSuccess: isNotificationSuccess, isError: isNotificationError },
  ] = api.useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    if (isNotificationSuccess) {
      getNotifications({ userId: user?.user_id, currentPage: 1 });
    }
  }, [isNotificationSuccess, notificationPage]);

  const handleMarkAllClicked = () => {
    markAllNotificationsAsRead({ userid: user?._id })
      .then(() => {
        logAnalyticsEvents('mark_all_as_read', {});
        // After marking all notifications as read, update state and refetch notifications
        setNotificationList([]); // Clear the current notifications list
        getNotifications({
          userId: user?.user_id,
          currentPage: notificationPage,
        }); // Refetch notifications
      })
      .catch((error) => {
        console.error(
          "Error marking all notifications as read:",
          error.message
        );
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to mark all notifications as read",
        });
      });
  };

  useEffect(() => {
    if (!isFetching && isSuccess) {
      dispatch(
        homeActions.updateShowNotificationIcon(
          data?.data?.isRedDotShown || false
        )
      );
      if (data?.data?.results) {
        setNotificationList(data?.data?.results);
      }
    }
  }, [isFetching, isSuccess]);

  useEffect(() => {
    getNotifications({ userId: user?.user_id, currentPage: notificationPage });
  }, [notificationPage]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(false);
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    }
  }, [isError, error]);

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF">
      <View bgc="#FFF" f={1}>
        <ImageBackground
          f={1}
          source={require("./ProfileBackground.png")}
          resizeMode="cover"
        >
          <SafeAreaView f={1}>
            <View fd="row" ai="center" asf="stretch" ph={16} pv={12}>
              <View f={1}>
                <TouchableOpacity
                  h={32}
                  w={32}
                  br={32}
                  bgc="#fff"
                  jc="center"
                  ai="center"
                  onPress={onPressBack}
                  asf="flex-start"
                >
                  <ICONS.BackArrow width={32} height={32} />
                </TouchableOpacity>
              </View>
              <Text ftsz={16} weight="600" ta="center">
              Notifications
              </Text>
              <View f={1} />
            </View>
            {/* "Mark all as Read" button */}
            <TouchableOpacity
              ph={16}
              onPress={handleMarkAllClicked}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <ICONS.Frame height={16} width={16} />
              <Text ftsz={12} lh={18} c="#000" pv={10} ph={4} ftw="600">
                Mark all as Read
              </Text>
            </TouchableOpacity>
            <View f={1} ph={16}>
              {isFetching && notificationPage === 1  && (
                <View f={1} jc="center" ai="center">
                  <ActivityIndicator color="#000" />
                </View>
              )}
              {notificationData?.length > 0 && (
                <FlatList
                  data={notificationData}
                  showsVerticalScrollIndicator={false}
                  onEndReached={onReachedNotificationsEnd}
                  ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                  ListFooterComponent={() => (
                    <View>
                      <View bc="#FFF" btw={StyleSheet.hairlineWidth} />
                      {loadMoreNotificationsData && (
                        <View z={50} mt={20}>
                          <ActivityIndicator color="#000" />
                        </View>
                      )}
                      <View mb={120} />
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <NotificationRow
                      item={item}
                      showModal={openModal}
                      setModalData={setModalData}
                    />
                  )}
                />
              )}
            </View>
          </SafeAreaView>
        </ImageBackground>
        <NotificationModal
          showModal={showModal}
          closeModal={closeModal}
          data={modalData}
        />
      </View>
    </MainLayout>
  );
};

export default Notifications;
