import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import RNFetchBlob from "rn-fetch-blob";
import Share from 'react-native-share';
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const DownloadProfileModal = props => {
  const { showPopup, closePopup } = props;
  const user = useAppSelector(state => state?.user);
  const [downloadProfile, { data, isSuccess, isFetching }] =
    api.useLazyDownloadProfileQuery();

  const downloadPdf = async (pdf) => {
    try {
      const { config, fs } = RNFetchBlob;
      const { DownloadDir, CacheDir } = fs.dirs;
      const date = new Date();
      const isAndroid = Platform.OS === "android";

      let path;
      if (isAndroid) {
        path = `${DownloadDir}/me_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.pdf`;
      } else {
        path = `${CacheDir}/me_${Math.floor( // Use shared directory
        date.getTime() + date.getSeconds() / 2,
      )}.pdf`;
      }
      const options = {
        fileCache: true,
        path,
        useDownloadManager: isAndroid, // Use DownloadManager on Android only
        notification: true,
        description: 'File downloaded by download manager.',
      };

      config(options)
        .fetch("GET", pdf)
        .then(res => {
          !isAndroid && setTimeout(()=>{
            RNFetchBlob.ios.openDocument(path)
          },2000)
          Toast.show({
            type: "success",
            text1: "Download success!",
            text2: "Your Cv is downloaded successfully.",
          });
          closePopup();
        });
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (isSuccess && !isFetching) {
      logAnalyticsEvents('download_profile_success',{})
      downloadPdf(data?.profilePdfLink);
    }
  }, [isSuccess, isFetching]);

  const onPressDownload = () => {
    downloadProfile({ userId: user?.user_id });
  };

  const shareProfile=()=>{
    logAnalyticsEvents('share_profile',{})
    const options = {
      message: `https://mapout.com/profile/${user?.share_id}`,
    };
    Share.open(options).then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
  }

  return (
    <Modal onRequestClose={closePopup} visible={showPopup} transparent>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
      <TouchableOpacity
      activeOpacity={1}
        f={1}
        onPress={closePopup}
      />
      <View btrr={30} btlr={30} pv={16} bgc={"#FFF"}>
        <TouchableOpacity ph={24} onPress={closePopup} asf="flex-end" t={0}>
          <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <Text ftsz={16} weight="500" ta="center">
          Profile
        </Text>
        <View btw={0.4} bgc={"#000"} mt={32} />
        <TouchableOpacity
          mv={16}
          onPress={onPressDownload}
          disabled={isFetching}>
          {isFetching ? (
            <ActivityIndicator asf="center" size={"small"} color={"#000"} />
          ) : (
            <Text ftsz={12} weight="400" ta="center">
              Download as CV
            </Text>
          )}
        </TouchableOpacity>
        <View btw={0.4} bgc={"#000"} mb={16} />
        <TouchableOpacity onPress={shareProfile}>
          <Text ftsz={12} weight="400" ta="center">
            Share Profile
          </Text>
        </TouchableOpacity>
        <View btw={0.4} bgc={"#000"} mv={16} />
        <View />
      </View>
      </View>
    </Modal>
  );
};

export default DownloadProfileModal;
