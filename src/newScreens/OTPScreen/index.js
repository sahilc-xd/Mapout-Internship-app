import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { ActivityIndicator, Image, ImageBackground, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text, TextInput } from '../../components';
import { Linking, Platform } from 'react-native';
import Icons from '../../constants/icons';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import { api } from '../../redux/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isOTPValid } from '../../utils/isEmailValid';
import { navigate } from '../../utils/navigationService';
import useKeyboard from '../../hooks/useKeyboard';
import { useWindowDimensions } from 'react-native';
import { getFcmToken } from '../../utils/notification';
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';

const OTPScreen = (props)=>{
    const isEmail = props?.route?.params?.type === "email";
    const isSignUp = props?.route?.params?.isSignUp;
    const email = props?.route?.params?.email || false;
    const phone = props?.route?.params?.phone || false;
    const countryCode = props?.route?.params?.country_code || false;
    const [OTP, setOTP] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const onTimerEnds = () => setResendDisabled(false);
    const { formattedTime, restartTimer } = useCountdownTimer(onTimerEnds, 1);
    const [sendOtp, { data, isLoading, error: otpError, isSuccess }] = api.useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifying, error, isError, isSuccessOTPVerify }] = api.useVerifyOtpMutation();
    const [errorMsg, setErrorMsg] = useState(false);
    const {keyboardOpen} = useKeyboard();

   const { width: windowWidth } = useWindowDimensions();
  const logoRatio = 182 / 41; 
  const maxLogoWidth = windowWidth * 2; 
  const newLogoWidth = Math.min(maxLogoWidth, windowWidth * 0.4); 
  const newLogoHeight = newLogoWidth / logoRatio;

  useEffect(()=>{
    if(isSuccessOTPVerify){
        logAnalyticsEvents('otp_verify_success', isEmail ? {email: email} : {phone: phone})
    }
  },[isSuccessOTPVerify])


    const maskEmail=(email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
        const maskedDomain = domain.charAt(0) + '*'.repeat(domain.length - 2) + domain.charAt(domain.length - 1);
        const maskedEmail = `${maskedLocalPart}@${maskedDomain}`;
        return maskedEmail;
      }
      
      const maskPhoneNumber=(phoneNumber) => {
        const phoneNumberStr = phoneNumber.toString();
        const firstDigit = phoneNumberStr.charAt(0);
        const lastSecondDigit = phoneNumberStr.charAt(phoneNumberStr.length - 2);
        const lastDigit = phoneNumberStr.charAt(phoneNumberStr.length - 1);
        const middleDigits = '*'.repeat(phoneNumberStr.length - 3);
        const maskedPhoneNumber = `${firstDigit}${middleDigits}${lastSecondDigit}${lastDigit}`;
        return maskedPhoneNumber;
      }

    useEffect(()=>{
        if(isError){
            setErrorMsg(error?.data?.message);
        }
    },[isError])

    useEffect(()=>{
        if(isSuccess){
            logAnalyticsEvents('resend_otp', isEmail ? {email: email} : {phone : phone});
            restartTimer();
            setResendDisabled(true);
        }
    },[isSuccess])

    const handleResendOTP = ()=>{
        sendOtp({email: email, phoneNumber: phone, country_code: countryCode});
    }

    const retrieveNotificationToken = async () => {
        try {
          let token = await AsyncStorage.getItem("notificationToken");
          return token 
        } catch (error) {
          console.error("Error retrieving notification token:", error);
          return null;
        }
      };

    const handleVerifyOTP = async () => {
        if(isOTPValid(OTP, type= isEmail ? "email" : "phone")){
            try {
            await getFcmToken();
            const deviceToken = await retrieveNotificationToken();
            verifyOtp({ email, otp: OTP, deviceToken: deviceToken !== null ? deviceToken : "", phoneNumber: phone, country_code: countryCode });
            } catch (error) {
            console.error("Error verifying OTP:", error);
            }
        }
        else{
            setErrorMsg("Error: OTP must be of 6 digits.")
        }
      };


    return(
        <MainLayout bgColor='#FFF' statusBar_bg='#FFF' statusBar_bs='dc'>
            <ImageBackground ai='center' f={1} source={require('../SignUpScreen/SignUpBackground.png')} resizeMode="cover">
                <Image source={require('../SignUpScreen/SignUpLogo.png')} style={{ width: newLogoWidth, height: newLogoHeight, marginTop: 30,marginBottom:30 }}/>
                <View f={1} w={'100%'} ai='center' jc='space-between'>
                    <View  w={'100%'}>
                        <View mh={24}>
                            <Text ftsz={18} weight='500'>
                            Enter OTP sent to your {isEmail ? `email` : `phone`}
                            </Text>
                            <Text c={'#7F8A8E'} mv={8} ftsz={14} weight='500'>
                            We sent it to {isEmail ? maskEmail(email) : maskPhoneNumber(phone)}
                            </Text>
                            <View fd='row'>
                            <TextInput autoFocus c={'#000'} placeholderTextColor={'#7F8A8E'} maxLength={6} f={1} value={OTP} keyboardType='number-pad' pv={12} onChangeText={(text)=>{
                                setOTP(text)
                                setErrorMsg(false);
                            }} ftf='RedHatDisplay-SemiBold' ftsz={15} bw={0.4} bc={'#7F8A8E'} br={12} bgc={'#FFF'} ta='center' placeholder={'000000'}/>
                            </View>
                            {errorMsg && <Text mt={12} ta='center' ftsz={14} weight='600' c={'red'}>{errorMsg}</Text>}
                            {keyboardOpen && <View w={'100%'} mt={16}>
                                <TouchableOpacity activeOpacity={resendDisabled ? 1 : 0} disabled={isLoading} onPress={()=>{
                                    if(!resendDisabled){
                                        handleResendOTP();
                                    }
                                }}>
                                    {resendDisabled ? <Text ftsz={14} weight='500' c={'#7F8A8E'} ta='center' mb={8}>Resend OTP in <Text c={'#4772F4'}>{formattedTime()}</Text></Text> :
                                    <Text ftsz={14} weight='700' c={'#7F8A8E'} ta='center' mb={8}>Resend OTP</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleVerifyOTP} mb={8} br={12} bgc={'#000000'} jc='center' ai='center' bw={1} pv={12} fd='row'>
                                    {isVerifying ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ml={8} ftsz={16} weight='600' c={'#FFF'}>
                                        {isSignUp ? `Sign Up` : `Sign In`}
                                    </Text>}
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </View>
                    {!keyboardOpen && <View mh={24} w={'100%'}>
                        <TouchableOpacity activeOpacity={resendDisabled ? 1 : 0} disabled={isLoading} onPress={()=>{
                            if(!resendDisabled){
                                handleResendOTP();
                            }
                        }}>
                            {resendDisabled ? <Text ftsz={14} weight='500' c={'#7F8A8E'} ta='center' mb={8}>Resend OTP in <Text c={'#4772F4'}>{formattedTime()}</Text></Text> :
                            <Text ftsz={14} weight='700' c={'#7F8A8E'} ta='center' mb={8}>Resend OTP</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleVerifyOTP} mb={8} br={12} bgc={'#000000'} jc='center' ai='center' bw={1} mh={24} pv={12} fd='row'>
                            {isVerifying ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ml={8} ftsz={16} weight='600' c={'#FFF'}>
                                {isSignUp ? `Sign Up` : `Sign In`}
                            </Text>}
                        </TouchableOpacity>
                    </View>}
                </View>
                <View mv={8} ph={64}>
                    <Text ftsz={12} weight='300' ta='center'>By continuing you agree to our <Text onPress={()=>{
                        Linking.openURL('https://www.mapout.com/privacyPolicy').catch(err => console.error('An error occurred', err));
                    }} ftsz={12} weight='500'>Privacy Policy</Text> and <Text onPress={()=>{
                        Linking.openURL('https://www.mapout.com/termsOfUse').catch(err => console.error('An error occurred', err));
                    }} ftsz={12} weight='500'>Terms of Service.</Text></Text>
                </View>
            </ImageBackground>
        </MainLayout>
    )
}

export default OTPScreen;