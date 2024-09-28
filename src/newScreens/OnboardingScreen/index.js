import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../components";
import MainLayout from "../../components/MainLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, BackHandler, Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { navigate } from "../../utils/navigationService";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { Linking } from "react-native";
import DeepLinkNavigation from "../../utils/deepLinkNavigation";
import NativeIntentAndroid from 'react-native/Libraries/Linking/NativeIntentAndroid';
import {URL} from '@env';

const OnboardingScreen =(props)=>{
    const navigation = props?.navigation;
    const isFocused = navigation?.isFocused;
    

    React.useLayoutEffect(() => {
      navigation.setOptions({
        gestureEnabled: false, // Disable swipe back gesture
      });
    }, [navigation]);

    const _handleOpenUrl=(event)=>{
      event?.url?.length>0 && event?.url.includes('mapout.com') && DeepLinkNavigation(event?.url);
    }

      useEffect(()=>{
        const linking = Linking.addEventListener('url', _handleOpenUrl);

    
        async function handleDeepLink(){
          const NativeLinking = Platform.OS === 'android' ? NativeIntentAndroid : Linking
          const url = await NativeLinking.getInitialURL();
          url?.includes('mapout.com') && DeepLinkNavigation(url);
        } 
        handleDeepLink();

        return ()=>{
          linking.remove();
        }
      },[])

    const backPressHandler = ()=>{
        if(isFocused()){
          Alert.alert('Alert!', 'Are you sure you want to exit?',[
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: () => {
                BackHandler.exitApp();
              }
            }
          ])
          return true;
        }else{
          return false;
        }
      }

    useEffect(() => {
        const setFirstTimeAppOpen = async()=>{
          await AsyncStorage.setItem('FirstTimeAppOpen', "false");
        }
        AsyncStorage.getItem('FirstTimeAppOpen').then((val)=>{
          if(val != "false"){
            setFirstTimeAppOpen();
          }
        })
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backPressHandler);
    
        return ()=>{
          backHandler.remove();
        };
      }, []);

    return(
        <MainLayout bgColor="#F5F5F5" statusBar_bg="#F5F5F5" statusBar_bs="dc">
            <View f={1} jc="center" mv={40}>
                <Image f={1} w={'100%'} source={require("./OnBoardingLogo.png")} resizeMode="stretch"/>
            </View>
            <TouchableOpacity onPress={()=>{
              logAnalyticsEvents('get_started_button',{});
              navigate('SignUp', {type: "SignUp"});
            }} mv={8} bw={1} pv={14} jc="center" ai="center" mh={24} bgc={'#000'} br={16}>
                <View>
                    <Text ftsz={14} weight="600" c={'#FFF'}>
                        Get started
                    </Text>
                </View>
            </TouchableOpacity>
            <View fd="row" mh={24} jc="center" mv={4}>
                <Text c={'#17171F'} ftsz={14} weight="400">Already have an account? </Text>
                <TouchableOpacity hitSlop={10} onPress={()=>{
                  logAnalyticsEvents('sign_in_button',{});
                navigate('SignUp', {type: "SignIn"});
              }}>
                    <Text c={'#000000'} ftsz={14} weight="600">
                    Sign in
                    </Text>
                </TouchableOpacity>
            </View>
        </MainLayout>
    )
}

export default OnboardingScreen;