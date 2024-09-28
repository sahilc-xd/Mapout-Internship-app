import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../components";
import Video from "react-native-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useIsFocused } from "@react-navigation/native";
import { BackHandler, Platform } from "react-native";
import { popNavigation } from "../../utils/navigationService";

const PlayVideoScreen = props => {
  const insets = useSafeAreaInsets();
  const [showVideo, setShowVideo] = useState(true);

  const isFocused = useIsFocused();
  useStatusBar("#000", "dc", isFocused);

  const handleUpload = ()=>{
      props?.route?.params?.closeAllModals && props?.route?.params?.closeAllModals();
      props?.route?.params?.uploadVideo && props?.route?.params?.uploadVideo({uri: props?.route?.params?.res?.assets?.[0]?.uri, fileName: props?.route?.params?.res?.assets?.[0]?.fileName, type:props?.route?.params?.res?.assets?.[0]?.type });
      popNavigation();
  }

  return (
    <View
      f={1}
      bgc={"#000"}
      w={"100%"}
      h={"100%"}
      pt={Platform.OS === "ios" ? 0 : insets.top}
      mb={insets.bottom}>
      {Platform.OS === "ios" && <View bgc={"#000"} h={insets.top}></View>}
      <View f={1} w={"100%"}>
        {showVideo && (
          <Video
            source={{ uri: props?.route?.params?.res?.assets?.[0]?.uri }}
            resizeMode={"contain"}
            controls={true}
            paused={false}
            repeat={true}
            style={{ flex: 1 }}
          />
        )}
      </View>
      <View fd="row" mh={24} jc="space-between">
        <TouchableOpacity
          onPress={() => {
            popNavigation();
          }}>
          <Text c={"#fff"} ftsz={18} weight="600">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          handleUpload();
        }}>
          <Text c={"#fff"} ftsz={18} weight="600">
            Upload
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayVideoScreen;
