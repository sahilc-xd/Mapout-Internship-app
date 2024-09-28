import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { useAppSelector } from "../../../redux";
import { Dimensions } from "react-native";
import Video from "react-native-video";
import { api } from "../../../redux/api";
import { Text } from "../../../components";

const windowWidth = Dimensions.get("window").width;

const TalentBoardProject = ({ route }) => {
  const isTalentBoard = route?.params?.isTalentBoard;
  const [data, setData] = useState(route?.params?.data);
  const talentBoardID = route?.params?.talentBoardID;
  const hideButtons = route?.params?.hideButtons || false;
  // console.log("hide button isss -----", hideButtons)
  const user = useAppSelector(state => state.user);
  const coverImg = data?.coverImgUrls?.[0]?.url;
  const [deleteProject, { isSuccess, isLoading, isError }] =
    api.useDeleteTalentBoardProjectMutation();
  const [
    getTalentBoardData,
    {
      data: talentBoardData,
      isSuccess: isTalentBoardDataSuccess,
      isFetching: isTalentBoardDataFetching,
      isLoading: isTalentBoardDataLoading,
    },
  ] = api.useLazyFetchTalentBoardsQuery(); 
  
  const [imageHeight, setImageHeight] = useState(null);
 
  const onImageLoad = (event) => {
    const { height } = event.nativeEvent.source;
    setImageHeight(height);
  };

  // data.link = "https://bootcamp.uxdesign.cc/designing-a-delivery-app-for-my-favourite-bakery-theobroma-a-ux-case-study-design-fc79ee55509dsss";

  useEffect(() => {
    if (isTalentBoard) {
      getTalentBoardData({
        userId: user?._id,
        talentBoardID: route?.params?.talentBoardID,
        projectID: route?.params?.projectId,
      });
    }
  }, []);

  useEffect(() => {
    if (isTalentBoardDataSuccess) {
      setData(talentBoardData?.projects[0]);
    }
  }, [isTalentBoardDataSuccess]);

  useEffect(() => {
    if (isSuccess) {
      navigate("Profile");
    }
  }, [isSuccess]);

  const handleDeleteClicked = () => {
    deleteProject({
      talentBoardID: talentBoardID,
      projectID: data?._id,
    });
  };

  const handleUpdateClicked = () => {
    navigate("EditProjectStep1", { data, talentBoardID });
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View mh={16} mv={16}>
          <View fd="row">
            <TouchableOpacity
              onPress={() => popNavigation()}
              bgc={"#000"}
              br={100}
              asf="flex-start"
              style={{ marginRight: 16 }}>
              <Icons.ChevronLeft width={30} height={30} fill={"#FFF"} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center", paddingRight: 33 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  textAlign: "center",
                  width: '100%',
                }}
              >
                {data?.name}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>
                By {data?.username}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {data?.tags?.map((tag, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#D8E3FC",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      marginHorizontal: 4,
                      marginTop: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "400" }}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {isTalentBoardDataFetching || isTalentBoardDataLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
              <Image
                source={{ uri: coverImg }}
                style={{ width: 410, height: 200 }}
                resizeMode="contain"
                onLoad={onImageLoad}
              />
            </View>

            <View style={{ marginTop: 15, paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>
                DESCRIPTION
              </Text>
              <Text style={{ marginTop: 5, fontSize: 12, fontWeight: "300", lineHeight: 20 }}>
                {data?.description}
              </Text>
            </View>

            {data?.link && (
              <>
                <View style={{ marginTop: 15, paddingHorizontal: 18 }}>
                  <Text style={{ fontSize: 12, fontWeight: "500", textAlign: 'left' }}>
                    FIND THE PROJECT HERE
                  </Text>
                  <Text style={{ marginTop: 5, fontSize: 12, fontWeight: "300", lineHeight: 20, textAlign: 'left', color: "#4772F4", textDecorationLine: 'underline' }}>
                    {data?.link}
                  </Text>
                </View>
              </>
            )}

            <View style={{ flex: 1, alignItems: "center" }}>
              {data?.imageUrls &&
                data?.imageUrls.map((image, index) => (
                  <TouchableOpacity
                    onPress={()=>navigate('ImageCarousel', {images: data?.imageUrls?.map((item)=>{
                      return item?.url
                    }), index: index})}
                    key={index}
                    style={{
                      height: 330,
                      marginTop: 20,
                      width: windowWidth - 35,
                      alignItems: "center",
                    }}>
                    <Image
                      source={{ uri: image?.url }}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        resizeMode: 'contain',
                        height: '100%',
                      }}
                    />
                  </TouchableOpacity>
                ))}
            </View>

            {!hideButtons && (
              <View style={{ flexDirection: "row", marginTop: 20, paddingHorizontal: 24 }}>
                <TouchableOpacity
                  onPress={handleDeleteClicked}
                  style={{
                    backgroundColor: "#D8E3FC",
                    flex: 1,
                    paddingVertical: 20,
                    alignItems: "center",
                    borderRadius: 12,
                    marginHorizontal: 5,
                    marginBottom: 20,
                  }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateClicked}
                  style={{
                    backgroundColor: "#000000",
                    flex: 1,
                    paddingVertical: 20,
                    alignItems: "center",
                    borderRadius: 12,
                    marginHorizontal: 5,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#FFFFFF",
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </MainLayout>
  );
};

export default TalentBoardProject;
