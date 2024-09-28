import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import { Linking } from "react-native";
import Icons from "../../constants/icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import appleAuth from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFcmToken } from "../../utils/notification";

import { useWindowDimensions } from 'react-native';
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { API_URL } from "@env";

const SignUpScreen = props => {
  const isSignUp = props?.route?.params?.type === "SignUp";
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  const [googleSignIn] = api.useGoogleSignInMutation();
  const [appleSignIn] = api.useAppleSignInMutation();

   const { width: windowWidth } = useWindowDimensions();

  const logoRatio = 182 / 41; 
  const maxLogoWidth = windowWidth * 2; 
  const newLogoWidth = Math.min(maxLogoWidth, windowWidth * 0.4); 
  const newLogoHeight = newLogoWidth / logoRatio;


  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await getFcmToken();
      let deviceToken = await AsyncStorage.getItem("notificationToken");
      await googleSignIn({ token: userInfo?.idToken, deviceToken });
      logAnalyticsEvents("continue_with_google",{});
      setIsLoading(false);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Some error occurred. Please try again later",
      });
      setIsLoading(false);
    }
  };

  const onAppleButtonPress = async () => {
    try {
      setIsLoadingApple(true);
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        await getFcmToken();
        let deviceToken = await AsyncStorage.getItem("notificationToken");
        const res = await appleSignIn({
          provider: "apple",
          deviceToken,
          appleAuthRequestResponse: {
            user: appleAuthRequestResponse.user,
            identityToken: appleAuthRequestResponse.identityToken,
          },
          firstName: appleAuthRequestResponse?.fullName?.givenName || "",
          lastName: appleAuthRequestResponse?.fullName?.familyName || ""
        });
        if(res.error){
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
        }
        logAnalyticsEvents("continue_with_apple", {});
        setIsLoadingApple(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Some error occurred. Please try again later",
      });
      setIsLoadingApple(false);
      // if (error.code === AppleAuthError.CANCELED) {
      //   // user cancelled Apple Sign-in

      // } else {
      //   // other unknown error
      // }
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        ai="center"
        f={1}
        source={require("./SignUpBackground.png")}
        resizeMode="cover">
       
       <Image
      source={require("./SignUpLogo.png")}
      style={{ width: newLogoWidth, height: newLogoHeight, marginTop: 20 }}
    />
        
        <View f={1} w={"100%"} ai="center" jc="center">
          <View behavior={"padding"} w={"100%"}>
            <View mh={24}>
              <Text ftsz={18} weight="500">
                Enter your Mobile Number
              </Text>
              <Text c={"#7F8A8E"} mv={8} ftsz={14} weight="500">
                We will send you an OTP to confirm
              </Text>
              <TouchableOpacity
                onPress={() => {
                  logAnalyticsEvents('enter_login_info',{type: "mobile"})
                  navigate("EnterLoginInfo", {
                    type: "phone",
                    isSignUp: isSignUp,
                  });
                }}
                fd="row">
                {/* <TextInput
                  editable={false}
                  mr={8}
                  ph={16}
                  value={"+91"}
                  maxLength={3}
                  keyboardType="phone-pad"
                  pv={12}
                  ftf="RedHatDisplay-SemiBold"
                  ftsz={18}
                  bw={0.4}
                  bc={"#7F8A8E"}
                  br={12}
                  bgc={"#FFF"}
                  ta="center"
                  placeholder="+91"
                /> */}
                <View br={12} bgc={'#FFF'} ph={16} pv={16} bw={0.4}
                  bc={"#7F8A8E"}>
                  <Text ftsz={15} weight="600" c={'#7F8A8E'}>
                    +91
                  </Text>
                </View>
                <View ml={8} jc="center" ai="center" br={12} bgc={'#FFF'} f={1} bw={0.4}
                  bc={"#7F8A8E"}>
                  <Text ftsz={15} weight="600" c={'#7F8A8E'}>
                    9999999999
                  </Text>
                </View>
                {/* <TextInput
                  editable={false}
                  maxLength={10}
                  f={1}
                  value={"9999999999"}
                  keyboardType="phone-pad"
                  pv={12}
                  ftf="RedHatDisplay-SemiBold"
                  ftsz={18}
                  bw={0.4}
                  bc={"#7F8A8E"}
                  br={12}
                  bgc={"#FFF"}
                  ta="center"
                  placeholder="9999999999"
                /> */}
              </TouchableOpacity>
            </View>
          </View>
          <Text mv={32} ftsz={18} weight="400">
            Or
          </Text>
          <View mh={24} w={"100%"}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleGoogleSignIn}
              mb={8}
              br={12}
              bgc={"#000000"}
              jc="center"
              ai="center"
              bw={1}
              mh={24}
              pv={12}
              fd="row">
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icons.GoogleIcon width={20} height={20} />
                  <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {Platform.OS=='ios' && <TouchableOpacity
              onPress={onAppleButtonPress}
              disabled={isLoadingApple}
              mv={8}
              br={12}
              bgc={"#000000"}
              jc="center"
              ai="center"
              bw={1}
              mh={24}
              pv={12}
              fd="row">
              {isLoadingApple ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icons.AppleIcon width={22} height={20} />
                  <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                    Continue with Apple
                  </Text>
                </>
              )}
            </TouchableOpacity>}
            {!isSignUp && API_URL?.includes('dev') && (
              <TouchableOpacity
                onPress={() => {
                  logAnalyticsEvents('enter_login_info',{type: "email"})
                  navigate("EnterLoginInfo", {
                    type: "email",
                    isSignUp: isSignUp,
                  });
                }}
                mt={8}
                br={12}
                bgc={"#000000"}
                jc="center"
                ai="center"
                bw={1}
                mh={24}
                pv={12}
                fd="row">
                <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                  Continue with Email
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View mv={8} ph={64}>
          <Text ftsz={12} weight="300" ta="center">
            By continuing you agree to our{" "}
            <Text
              onPress={() => {
                Linking.openURL("https://www.mapout.com/privacyPolicy").catch(
                  err => console.error("An error occurred", err),
                );
              }}
              ftsz={12}
              weight="500">
              Privacy Policy
            </Text>{" "}
            and{" "}
            <Text
              onPress={() => {
                Linking.openURL("https://www.mapout.com/termsOfUse").catch(
                  err => console.error("An error occurred", err),
                );
              }}
              ftsz={12}
              weight="500">
              Terms of Service.
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default SignUpScreen;
