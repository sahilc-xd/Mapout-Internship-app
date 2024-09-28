import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../../constants/icons";
import { popNavigation } from "../../../utils/navigationService";
import { Text, TextInput } from "../../../components";
import { Alert, Platform } from "react-native";
import { api } from "../../../redux/api";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { logout } from "../../../redux/authSlice";

const DeactivateAccount = () => {
  const user = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState(1);
  const [text, setText] = useState("");
  const [otp, setOTP] = useState("");
  const [showGetOTP, setShowGetOTP] = useState(true);
  const [getOTP, { isSuccess, isLoading: isLoadingGetOTP}] = api.useDeactivateAccountOTPMutation();
  const [verifyOTP, { isSuccess: isSuccessVerification, isLoading}] = api.useDeactivateAccountMutation();

  const handleGetOTP = ()=>{
    if(text != user?.mobile){
      Alert.alert("Error","Please enter the number associated with your account.", [
        {
          text: "OK",
          onPress: () => {},
          style: "cancel",
        }
      ]);
    }
    else{
      getOTP({
        user_id: user?.user_id,
        phoneNumber: text
      });
    }
  }

  const handleVerifyOTP = ()=>{
    verifyOTP({
      otp: otp,
      user_id: user?.user_id,
      phone: text
    })
  }

  useEffect(()=>{
    if(isSuccessVerification){
      dispatch(logout());
    }
  },[isSuccessVerification])

  useEffect(()=>{
    if(isSuccess){
      setShowGetOTP(false);
    }
  },[isSuccess])
  const textData = [
    "Profile Visibility: Your profile becomes invisible to other users.",
    "Search Invisibility: You'll no longer appear in search results or be accessible through any in-app functions.",
    "Suspended Interactions: All active interactions within the app will be put on hold.",
    "Streak Loss: Any ongoing streaks or similar achievements will be lost.",
    "Easy Reactivation: To reactivate your account and regain full access, simply log in to your account at any time.",
  ];
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
            Deactivate account
          </Text>
        </View>
        {stage === 1 && (
          <>
            <View f={1}>
              <View
                f={1}
                mt={16}
                mh={16}
                bgc={"rgba(255, 255, 255, 0.65)"}
                ph={8}
                pt={16}
                pb={8}
                br={12}>
                <Text c={"#333333"} ftsz={15} weight="600">
                  Deactivate account
                </Text>
                <View mt={16} f={1}>
                  <Text ph={8} c={"#444444"} ftsz={14} weight="500">
                    Deactivate account
                  </Text>
                  <Text ph={8} c={"#555555"} mt={8} ftsz={11} weight="400">
                    Temporarily make your profile and data invisible by
                    deactivating your account. You can reactivate it whenever
                    you choose, which will restore your access and visibility
                    while keeping all your information intact. Here's what
                    happens when you deactivate:
                  </Text>
                  <ScrollView
                    mt={16}
                    ph={8}
                    persistentScrollbar={true}
                    showsVerticalScrollIndicator={true}>
                    {textData?.map(item => {
                      return (
                        <View fd="row" mv={8}>
                          <View mt={8} h={4} w={4} br={4} bgc={"#555555"} />
                          <Text ftsz={11} weight="400" c={"#555555"} ph={8}>
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
              <View
                mv={16}
                mh={16}
                bgc={"rgba(255, 255, 255, 0.65)"}
                ph={24}
                pt={16}
                pb={8}
                br={12}>
                <Text
                  asf="center"
                  ta="center"
                  c={"#333333"}
                  ftsz={15}
                  weight="600">
                  Are you sure you want to deactivate your account?
                </Text>
                <View gap={16} fd="row" mt={32}>
                  <TouchableOpacity
                    onPress={() => setStage(2)}
                    bgc={"#D8E3FC"}
                    pv={16}
                    f={1}
                    ai="center"
                    jc="center"
                    br={12}>
                    <Text ftsz={12} weight="500" c={"#000"}>
                      Yes, deactivate
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => popNavigation()}
                    bgc={"#000000"}
                    pv={16}
                    f={1}
                    ai="center"
                    jc="center"
                    br={12}>
                    <Text ftsz={12} weight="500" c={"#FFF"}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
        {stage === 2 && (
          <>
            <KeyboardAvoidingView
              f={1}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              //   keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
              <View f={1} jc="center">
                <View
                  mt={16}
                  mh={16}
                  bgc={"rgba(255, 255, 255, 0.65)"}
                  ph={8}
                  pt={16}
                  pb={8}
                  br={12}>
                  <View ph={8} mt={16}>
                    <Text c={"#444444"} ftsz={14} weight="500">
                      Deactivate account
                    </Text>
                    <Text c={"#555555"} mt={8} ftsz={11} weight="400">
                      Please enter the required details to deactivate your
                      account.
                    </Text>
                    <View mv={32}>
                      <Text ftsz={14} weight="500" c={"#333333"}>
                        Enter your mobile number
                      </Text>
                      <Text mt={4} ftsz={12} weight="500" c={"#7F8A8E"}>
                        We will send you an OTP to confirm
                      </Text>
                      <View bbw={1} mt={8} fd="row" ai="center">
                        <TextInput
                          pl={4}
                          p={0}
                          value={text}
                          keyboardType="phone-pad"
                          onChangeText={e => {setText(e)
                          setShowGetOTP(true)}}
                          placeholder="Mobile"
                          f={1}
                          c={'#000'}
                        />
                        {showGetOTP && (isLoadingGetOTP ? <ActivityIndicator size={'small'} color={'#000'}/>: <TouchableOpacity disabled={text?.length <= 0} onPress={handleGetOTP} ph={8}>
                          <Text ftsz={12} weight="500" c={text?.length <= 0 ? "#7F8A8E" : "#333333"}>
                            Get OTP
                          </Text>
                        </TouchableOpacity>)}
                      </View>

                      <Text mt={32} ftsz={14} weight="500" c={"#333333"}>
                        Enter OTP sent to your mobile number
                      </Text>
                      <View bbw={1} mt={8}>
                        <TextInput
                          p={0}
                          pl={4}
                          value={otp}
                          onChangeText={e => setOTP(e)}
                          maxLength={6}
                          placeholder="OTP"
                          c={'#000'}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleVerifyOTP}
                      disabled={showGetOTP || isLoading}
                      pv={16}
                      ai="center"
                      jc="center"
                      bgc={"#000000"}
                      br={12}>
                      {isLoading ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ftsz={12} weight="500" c={"#FFF"}>
                        Confirm
                      </Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </ImageBackground>
    </MainLayout>
  );
};

export default DeactivateAccount;
