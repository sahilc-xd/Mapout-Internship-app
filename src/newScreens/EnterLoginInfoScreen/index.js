import React, { useEffect, useState } from "react";
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
import { SelectInput, Text, TextInput } from "../../components";
import { Keyboard, Linking, Platform } from "react-native";
import Icons from "../../constants/icons";
import { navigate } from "../../utils/navigationService";
import { isEmailValid } from "../../utils/isEmailValid";
import { api } from "../../redux/api";
import useKeyboard from "../../hooks/useKeyboard";
import { useWindowDimensions } from 'react-native';
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const EnterLoginInfoScreen = props => {
  const isEmail = props?.route?.params?.type === "email";
  const isSignUp = props?.route?.params?.isSignUp;
  const [email, setEmail] = useState(false);
  const [phone, setPhone] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState(false);
  const [sendOtp, { data, isLoading, error: otpError, isSuccess }] =
    api.useSendOtpMutation();
  const { keyboardOpen } = useKeyboard();
  const [allCountryCodes, setAllCountryCodes]= useState([]);
  const [getCountryCode, {data: countryCodeData, isSuccess: isSuccessCountryCode}] = api.useLazyGetCountryCodeQuery();
  const [showCountryCode, setShowCountryCode]= useState([]);

  const { width: windowWidth } = useWindowDimensions();
  const logoRatio = 182 / 41; 
  const maxLogoWidth = windowWidth * 2; 
  const newLogoWidth = Math.min(maxLogoWidth, windowWidth * 0.4); 
  const newLogoHeight = newLogoWidth / logoRatio;

  useEffect(()=>{
    getCountryCode();
  },[])

  useEffect(()=>{
    if(isSuccessCountryCode){
      setCountryCode(countryCodeData?.data?.userCountryDetails?.code || "+91");
        const data = countryCodeData?.data?.allCountryDetails?.map((item)=>{
            return `${item?.flag} ${item?.name} ${item?.code}`
        })
        setAllCountryCodes(data);
        setShowCountryCode(data);
    }
  },[isSuccessCountryCode])

  useEffect(() => {
    if (isSuccess) {
      if (data?.validUser) {
        navigate("VerifyOTP", {
          isSignUp: isSignUp,
          type: isEmail ? "email" : "phone",
          email: email,
          phone: phone?.length>0 ? `${phone}` : false,
          country_code: countryCode
        });
        isEmail ? logAnalyticsEvents("get_otp_email", {email: email}) : logAnalyticsEvents("get_otp_phone", {phone: phone})
      }
    }
  }, [isSuccess, navigate]);

  const handleGetOTP = () => {
    if (isEmail) {
      if (isEmailValid(email)) {
        //hit API and redirect to OTP Screen
        sendOtp({ email: email });
        // navigate('VerifyOTP', {isSignUp: isSignUp, type: "email"})
      } else {
        setError("Invalid email");
      }
    } else {
      if (phone?.length>0) {
        sendOtp({ phoneNumber: `${phone}`, country_code: `${countryCode}`  });
      } else {
        setError("Invalid Phone");
      }
    }
  };

  const onSearchCountryCode = (val)=>{
    const searchKey = val?.trim()?.toLowerCase();
    if(searchKey?.length===0){
      setShowCountryCode(allCountryCodes);
    }
    else{
      const arr = allCountryCodes?.filter((item)=>{
        if(item?.trim()?.toLowerCase().includes(searchKey)){
          return item;
        }
      })
      setShowCountryCode(arr);
    }
  }

  return (
    // compare page 
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        ai="center"
        f={1}
        source={require("../SignUpScreen/SignUpBackground.png")}
        resizeMode="cover">
        <Image
          source={require("../SignUpScreen/SignUpLogo.png")}
           style={{ width: newLogoWidth, height: newLogoHeight, marginTop: 30,marginBottom:30 }}
        />
        <View f={1} w={"100%"} ai="center" jc="space-between">
          <View w={"100%"}>
            <View mh={24}>
              <Text ftsz={18} weight="500">
                Enter your {isEmail ? `Email ID` : `Mobile Number`}
              </Text>
              <Text c={"#7F8A8E"} mv={8} ftsz={14} weight="500">
                We will send you an OTP to confirm
              </Text>
              <View fd="row">
                {!isEmail ? (
                  <>
                    <SelectInput
                      onSearch={(val)=>{
                        onSearchCountryCode(val);
                      }}
                      searchPlaceholder="Search country or code ..."
                      align="left"
                      snapPoints={["80%"]}
                      value={countryCode}
                      onSelect={index => {
                        const countryC = index.split("+");
                        setCountryCode(`+${countryC[1]}`);
                      }}
                      options={[...showCountryCode]}
                      label="Country Code*"
                      renderInput={({ onPressSelect }) => (
                        <TouchableOpacity
                          onPress={()=>{onPressSelect();
                            Keyboard.dismiss();
                        }}
                          br={12}
                          bgc={"#FFF"}
                          ph={16}
                          bw={0.4}
                          bc={"#7F8A8E"}
                          jc="center"
                          ai="center"
                          mr={8}
                          pv={12}>
                          <Text ftsz={15} weight="600" color="#000">
                            {countryCode}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TextInput
                      placeholderTextColor={"#7F8A8E"}
                      c={"#000"}
                      f={1}
                      ai='center'
                      jc='center'
                      value={phone}
                      textAlign='center'
                      keyboardType="number-pad"
                      pv={12}
                      numberOfLines={1} 
                      onChangeText={text => {
                        setPhone(text);
                        error && setError(false);
                      }}
                      ftf="RedHatDisplay-SemiBold"
                      ftsz={15}
                      bw={0.4}
                      bc={"#7F8A8E"}
                      br={12}
                      bgc={"#FFF"}
                      ta="center"
                      placeholder="9999999999"
                      autoFocus={true}
                    />
                  </>
                ) : (
                  <TextInput
                    placeholderTextColor={"#7F8A8E"}
                    c={"#000"}
                    autoFocus
                    f={1}
                    value={email}
                    keyboardType="email-address"
                    pv={12}
                    onChangeText={text => {
                      setEmail(text);
                      error && setError(false);
                    }}
                    ftf="RedHatDisplay-SemiBold"
                    ftsz={15}
                    bw={0.4}
                    bc={"#7F8A8E"}
                    br={12}
                    bgc={"#FFF"}
                    ta="center"
                    placeholder="example@email.com"
                  />
                )}
              </View>
              {error && (
                <Text mt={16} ta="center" c={"red"} ftsz={14} weight="600">
                  {error}
                </Text>
              )}
              {keyboardOpen && (
                <View mv={16} w={"100%"} pb={8}>
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={handleGetOTP}
                    br={12}
                    bgc={"#000000"}
                    jc="center"
                    ai="center"
                    bw={1}
                    pv={12}
                    fd="row">
                    {isLoading ? (
                      <ActivityIndicator size={"small"} color={"#FFF"} />
                    ) : (
                      <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                        Get OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          {!keyboardOpen && (
            <View mh={24} w={"100%"} pb={8}>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleGetOTP}
                br={12}
                bgc={"#000000"}
                jc="center"
                ai="center"
                bw={1}
                mh={24}
                pv={12}
                fd="row">
                {isLoading ? (
                  <ActivityIndicator size={"small"} color={"#FFF"} />
                ) : (
                  <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                    Get OTP
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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

export default EnterLoginInfoScreen;
