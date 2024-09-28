import React from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { Text } from "../../../components";
import { Linking } from "react-native";

const PrivacyAndTnC = () => {
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../SettingsBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            po="absolute"
            l={16}>
              <Icons.BackArrow width={32} height={32}/>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Privacy Policy and Terms of Use
          </Text>
        </View>
        <View f={1} ph={16}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://www.mapout.com/privacyPolicy").catch(
                err => console.error("An error occurred", err),
              );
            }}
            pv={16}
            ai="center"
            bgc={"rgba(255, 255, 255, 0.65)"}
            br={12}
            fd="row">
            <Text ph={16} ftsz={16} weight="600" c={"#333333"} f={1}>
              Privacy Policy
            </Text>
            <View mh={12}>
              <Icons.ChevronLeft
                width={24}
                height={24}
                fill={"#000"}
                style={{
                  transform: [{ rotate: "180deg" }],
                }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://www.mapout.com/termsOfUse").catch(err =>
                console.error("An error occurred", err),
              );
            }}
            mt={16}
            pv={16}
            ai="center"
            bgc={"rgba(255, 255, 255, 0.65)"}
            br={12}
            fd="row">
            <Text ph={16} ftsz={16} weight="600" c={"#333333"} f={1}>
              Terms of Use
            </Text>
            <View mh={12}>
              <Icons.ChevronLeft
                width={24}
                height={24}
                fill={"#000"}
                style={{
                  transform: [{ rotate: "180deg" }],
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default PrivacyAndTnC;
