import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ImageBackground,
  ScrollView,
  View,
} from "react-native-style-shorthand";
import TodaysTask from "./TodaysTask";
import MonthlyStreak from "./MonthlyStreak";
import ExploreSection from "./ExploreSection";
import Header from "./Header";
import SuccessMentors from "./SuccessMentors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, BackHandler, Linking, Platform } from "react-native";
import WelcomeToMapout from "./WelcomeMapout";
import WelcomePopup from "./WelcomePopUp";
import { useAppSelector } from "../../redux";
import DeepLinkNavigation from "../../utils/deepLinkNavigation";
import NativeIntentAndroid from 'react-native/Libraries/Linking/NativeIntentAndroid'
import ResumeATSCard from "./ExploreSection/resumeATS";


const DashboardScreen = props => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(
    props?.route?.params?.showWelcomePopup || false,
  );
  const navigation = props?.navigation;
  const isFocused = navigation?.isFocused;
  const insets = useSafeAreaInsets();
  const user = useAppSelector(state => state.user);
  const streak = user?.taskDetails?.dailyStreakCount;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Disable swipe back gesture
    });
  }, [navigation]);

  const backPressHandler = () => {
    if (isFocused()) {
      Alert.alert("Alert!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    } else {
      return false;
    }
  };

  useEffect(()=>{
    async function handleDeepLink(){
      const NativeLinking = Platform.OS === 'android' ? NativeIntentAndroid : Linking
      const url = await NativeLinking.getInitialURL();
      url?.includes('mapout.com') && DeepLinkNavigation(url);
    } 
    handleDeepLink();
  },[])

  const closePopup = () => {
    setShowWelcomePopup(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backPressHandler,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ScrollView w={"100%"} f={1} showsVerticalScrollIndicator={false}>
        <ImageBackground
          f={1}
          source={require("./DashboardBackground.png")}
          resizeMode="stretch">
          <WelcomePopup showPopup={showWelcomePopup} closePopup={closePopup} />
          <View pb={insets.bottom + 32}>
            <Header />
            <View mv={16}>
              {streak === -1 ? (
                <>
                  <WelcomeToMapout />
                </>
              ) : (
                <>
                  <TodaysTask />
                  {/* <MonthlyStreak /> */}
                </>
              )}
            </View>
            <SuccessMentors />
            <ExploreSection />
            <ResumeATSCard/>
          </View>
        </ImageBackground>
      </ScrollView>
    </MainLayout>
  );
};

export default DashboardScreen;