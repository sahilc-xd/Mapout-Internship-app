import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity, View } from "react-native-style-shorthand";
import Video from "react-native-video";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useIsFocused } from "@react-navigation/native";
import { popNavigation } from "../../utils/navigationService";
import Icon from "react-native-vector-icons/AntDesign";
import Icons from "../../constants/icons";

const PlayVideoLink = props => {
  const handleVideoWatched = props?.route?.params?.handleVideoWatched || false;
  const handleVideoOpened = props?.route?.params?.handleVideoOpened || false;
  const url =
    props?.route?.params?.url ||
    "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/video65cb6afe69cf83498af32a9b.mp4";
  const [buffering, setBuffering] = useState(false);
  const insets = useSafeAreaInsets();

  const isFocused = useIsFocused();
  useStatusBar("#000", "lc", isFocused);

  useEffect(() => {
    handleVideoOpened && handleVideoOpened();
  }, []);

  const handleVideoEnd = () => {
    handleVideoWatched && handleVideoWatched();
    popNavigation();
  };

  const onBuffer = ({ isBuffering }) => {
    setBuffering(isBuffering);
  };

  return (
    <View
      f={1}
      bgc={"#000"}
      w={"100%"}
      h={"100%"}
      pt={Platform.OS === "ios" ? 0 : insets.top}
      mb={insets.bottom}>
      {Platform.OS === "ios" && <View bgc={"#000"} h={insets.top}></View>}
      <View ph={16} mv={8}>
        <TouchableOpacity
          asf="flex-start"
          br={100}
          bgc={"#FFF"}
          onPress={() => {
            popNavigation();
          }}>
          <Icons.BackArrow width={32} height={32} />
        </TouchableOpacity>
      </View>
      <View f={1} w={"100%"} h={"100%"}>
        <Video
          source={{ uri: url }}
          resizeMode={"contain"}
          controls={true}
          paused={false}
          repeat={false}
          style={{ flex: 1 }}
          onEnd={handleVideoEnd}
          onBuffer={onBuffer}
          // onProgress={(prg)=>{
          //     if(prg?.playableDuration - prg?.currentTime <= 5){
          //       console.log("--->>>", prg)
          //         // handleVideoWatched && handleVideoWatched();
          //     }
          // }}
        />
        {buffering && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              zIndex: 10,
            }}>
            <ActivityIndicator size={"large"} />
          </View>
        )}
      </View>
    </View>
  );
};

export default PlayVideoLink;
