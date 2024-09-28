import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { navigate, popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux";
import { logout } from "../../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import {
  codepush_version,
  version_code,
  version_name,
} from "../../utils/config";
import { Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Clipboard from "@react-native-clipboard/clipboard";
import { SvgUri } from "react-native-svg";
import Share from 'react-native-share';

const Settings = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state?.user);
  const [copied, setCopied] = useState(false);

  const onPressLogOut = async () => {
    logAnalyticsEvents("logout", {});
    dispatch(logout());
    await GoogleSignin.signOut();
    await AsyncStorage.setItem("notificationToken", "");
  };

  const copyToClipboard = () => {
    if (user?.referral_code?.length > 0) {
      Clipboard.setString(user?.referral_code);
      setCopied(true);
    }
  };

  const shareReferralCode = ()=>{
      const options = {
        message: `Please share this with your friend https://mapout.com/refer/${user?.referral_code}`,
      };
      Share.open(options).then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./SettingsBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            po="absolute"
            l={16}>
            <Icons.BackArrow width={32} height={32} />
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Settings
          </Text>
        </View>
        <View f={1}>
          <ScrollView showsVerticalScrollIndicator={false} f={1} contentContainerStyle={{ paddingBottom: 100 }}>
            <LinearGradient
              colors={["#5980FF", "#A968FD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              useAngle={true}
              angle={-125}
              angleCenter={{ x: 1, y: 0.7 }}
              style={{
                borderRadius: 8,
                marginHorizontal: 16,
              }}>
              <View po="absolute" w={"100%"} h={"100%"} br={8}>
                <View
                  h={80}
                  w={80}
                  bgc={"rgba(255, 255, 255, 0.3)"}
                  br={80}
                  po="absolute"
                  l={140}
                  t={-25}
                />
                <View
                  h={80}
                  w={80}
                  bgc={"rgba(255, 255, 255, 0.3)"}
                  br={80}
                  po="absolute"
                  l={180}
                  t={-35}
                />
                <View
                  h={80}
                  w={80}
                  bgc={"rgba(255, 255, 255, 0.3)"}
                  br={80}
                  po="absolute"
                  r={-25}
                  t={40}
                />
                <View
                  h={80}
                  w={80}
                  bgc={"rgba(255, 255, 255, 0.3)"}
                  br={80}
                  po="absolute"
                  l={-25}
                  b={30}
                />
                <View
                  h={80}
                  w={80}
                  bgc={"rgba(255, 255, 255, 0.3)"}
                  br={80}
                  po="absolute"
                  r={20}
                  b={-10}
                />
              </View>
              <View f={1} ph={16} pv={16}>
                <View fd="row" w={"100%"} ai="center">
                  <View f={1} mr={12}>
                    <Text ftsz={20} weight="700" c={"#FFF"}>
                      INVITE A FRIEND
                    </Text>
                    <Text mt={8} ftsz={12} weight="400" c={"#FFF"}>
                      Help your friends embark on their career exploration
                      journey with MapOut! Share your unique code to invite them
                      to join the MapOut community.
                    </Text>
                  </View>
                  <Image w={110} h={110} resizeMode="contain" source={{uri: "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Untitled%20design%20%2837%29.png"}}/>
                </View>
                <View fd="row" ai="center" mt={16} gap={16}>
                  <TouchableOpacity
                    f={1}
                    h={60}
                    onPress={copyToClipboard}
                    br={12}
                    jc="center"
                    ai="center"
                    bgc={"rgba(255, 255, 255, 0.9)"}>
                    {copied ? (
                      <Text c={"#C566FF"} ftsz={12} weight="500">
                        Copied!
                      </Text>
                    ) : (
                      <>
                        <Text ftsz={16} weight="600">
                          {user?.referral_code}
                        </Text>
                        <Text c={"#C566FF"} ftsz={12} weight="500">
                          Tap to copy!
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={shareReferralCode} ph={12} br={8} bgc={"rgba(255, 255, 255, 0.9)"} h={60} jc="center" ai="center">
                    <View w={35} h={35} ai="center" jc="center">
                      <SvgUri width={28} height={28} uri={'https://s3.ap-south-1.amazonaws.com/s3.mapout.com/share.svg'}/>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            <View
              mt={16}
              mh={16}
              bgc={"rgba(255, 255, 255, 0.65)"}
              ph={8}
              pt={16}
              pb={8}
              br={12}>
              <Text c={"#333333"} ftsz={15} weight="600">
                General
              </Text>
              <TouchableOpacity
                onPress={() => navigate("AccountManagement")}
                ph={16}
                mt={8}
                pv={16}>
                <Text c={"#333333"} ftsz={14} weight="500">
                  Account management
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("PaymentHistory")}
                ph={16}
                pv={16}>
                <Text c={"#333333"} ftsz={14} weight="500">
                  Payment history
                </Text>
              </TouchableOpacity>
            </View>
            <View
              mt={16}
              mh={16}
              bgc={"rgba(255, 255, 255, 0.65)"}
              ph={8}
              pt={16}
              pb={8}
              br={12}>
              <Text c={"#333333"} ftsz={15} weight="600">
                Support
              </Text>
              <TouchableOpacity
                onPress={() => navigate("ContactUs")}
                ph={16}
                mt={8}
                pv={16}>
                <Text c={"#333333"} ftsz={14} weight="500">
                  Contact us
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("FAQs")}
                ph={16}
                pv={16}>
                <Text c={"#333333"} ftsz={14} weight="500">
                  FAQs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("PrivacyAndTnC")}
                ph={16}
                pv={16}>
                <Text c={"#333333"} ftsz={14} weight="500">
                  Privacy policy and terms of use
                </Text>
              </TouchableOpacity>
            </View>
            <View ph={16} mt={16}>
              {Platform?.OS == "ios" ? (
                <Text ftsz={12} ta="right">
                  v{version_name}.{codepush_version}
                </Text>
              ) : (
                <Text ftsz={12} ta="right">
                  v{version_name}.{codepush_version} ({version_code})
                </Text>
              )}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={onPressLogOut}
            bgc={"#D8E3FC"}
            mh={24}
            jc="center"
            ai="center"
            pv={16}
            br={12}>
            <Text c={"#000000"} ftsz={14} weight="500">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default Settings;
