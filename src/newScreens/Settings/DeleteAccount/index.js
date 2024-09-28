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
import CheckBox from "react-native-check-box";
import { api } from "../../../redux/api";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { logout } from "../../../redux/authSlice";

const DeleteAccount = () => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState(1);
  const [text, setText] = useState("");
  const [otp, setOTP] = useState("");
  const [showGetOTP, setShowGETOTP] = useState(true);
  const [getOTP, { isSuccess, isLoading }] =
    api.useDeactivateAccountOTPMutation();
  const [verifyOTP, { isSuccess: isSuccessDelete, isLoading: isVerifying }] =
    api.useDeleteAccountMutation();

  const handleGetOTP = () => {
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
        phoneNumber: text,
      });
    }
  };

  const handleVerifyOTP = () => {
    const reason = selectedOption === "Others (Please mention)" ? otherText : selectedOption;
    verifyOTP({
      otp: otp,
      user_id: user?.user_id,
      phone: text,
      reasonToDelete: reason
    })
  };

  useEffect(() => {
    if (isSuccessDelete) {
      dispatch(logout());
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isSuccess) {
      setShowGETOTP(false);
    }
  }, [isSuccess]);
  const textData = [
    "Permanent Data Erasure: All personal information, including your saved preferences and activity history, will be irrevocably deleted from our servers.",
    "Inaccessible Content: You will lose access to any rewards, points, credits, and uploaded content such as photos, videos, or documents.",
    "Non-refundable Transactions: Any subscriptions or purchases made through the app are non-refundable and will be lost upon account deletion.",
    "Irreversible Action: Deleting your account is a final decision. You will permanently lose access to your account, its content, and any services connected to it.",
    "Pre-deletion Recommendation: Before proceeding, ensure to download any crucial data you wish to keep.",
    "Consider Deactivation: If there's a chance you might want to return, we recommend deactivating your account instead. Deactivation hides your profile temporarily but preserves the option for reactivation in the future.",
  ];

  const [selectedOption, setSelectedOption] = useState(false);
  const options = [
    "Not interested anymore",
    "I don’t find it useful",
    "Found an alternative service/app.",
    "Privacy concerns.",
    "Dissatisfied with the service/app.",
    "Others (Please mention)",
  ];
  const [otherText, setOtherText] = useState("");

  const onSelectReason = () => {
    setStage(3);
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../SettingsBackground.png")}
        resizeMode="cover">
          <KeyboardAvoidingView
              f={1}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              //   keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
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
            Delete account
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
                  Delete account
                </Text>
                <View f={1} mt={16}>
                  <Text ph={8} c={"#444444"} ftsz={14} weight="500">
                    Delete account
                  </Text>
                  <Text ph={8} c={"#555555"} mt={8} ftsz={11} weight="400">
                    Opting to delete your account results in the permanent
                    removal of your profile and all associated data. Please be
                    aware of the following implications:
                  </Text>
                  <ScrollView
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
                  Are you sure you want to delete your account?
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
                      Yes, Delete
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
            
              <View f={1}>
                <View
                  mt={16}
                  mh={16}
                  bgc={"rgba(255, 255, 255, 0.65)"}
                  ph={16}
                  pt={16}
                  pb={8}
                  br={12}>
                  <Text c={"#333333"} ftsz={14} weight="500">
                    Reason for deleting the account
                  </Text>
                  <Text mt={8} c={"#444444"} ftsz={12} weight="400">
                    Please let us know why are you deleting the account. this
                    will help us to improve our service.
                  </Text>
                  <View pl={8} mt={16}>
                    {options?.map(item => {
                      return (
                        <View mv={8}>
                          <View fd="row" ai="center">
                            <CheckBox
                              onClick={() => {
                                setSelectedOption(item);
                              }}
                              isChecked={selectedOption === item}
                            />
                            <TouchableOpacity
                              onPress={() => setSelectedOption(item)}>
                              <Text ftsz={14} weight="500" c={"#333333"} pl={8}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {selectedOption === "Others (Please mention)" &&
                            item === "Others (Please mention)" && (
                              <View bbw={1}>
                                <TextInput
                                  value={otherText}
                                  onChangeText={e => setOtherText(e)}
                                  mt={16}
                                  p={0}
                                  placeholder="Type here..."
                                  c={'#000'}
                                />
                              </View>
                            )}
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    disabled={selectedOption === false}
                    onPress={onSelectReason}
                    jc="center"
                    ai="center"
                    mt={32}
                    br={12}
                    pv={16}
                    bgc={selectedOption === false ? "#A8A8A8" : "#000"}>
                    <Text
                      ftsz={12}
                      weight="500"
                      c={selectedOption === false ? "#333333" : "#FFF"}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              </KeyboardAvoidingView>
          </>
        )}
        {stage === 3 && (
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
                      Delete account
                    </Text>
                    <Text c={"#555555"} mt={8} ftsz={11} weight="400">
                      Please enter the required details to delete your account.
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
                          onChangeText={e => {
                            setText(e);
                            setShowGETOTP(true);
                          }}
                          placeholder="Mobile number"
                          f={1}
                          c={'#000'}
                        />
                        {showGetOTP &&
                          (isLoading ? (
                            <ActivityIndicator size={"small"} color={"#000"} />
                          ) : (
                            <TouchableOpacity
                              onPress={handleGetOTP}
                              disabled={text?.length <= 0}
                              ph={8}>
                              <Text
                                ftsz={12}
                                weight="500"
                                c={text?.length <= 0 ? "#7F8A8E" : "#333333"}>
                                Get OTP
                              </Text>
                            </TouchableOpacity>
                          ))}
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
                      disabled={showGetOTP || isVerifying}
                      pv={16}
                      ai="center"
                      jc="center"
                      bgc={"#000000"}
                      br={12}>
                      {isVerifying ? (
                        <ActivityIndicator size={"small"} color={"#FFF"} />
                      ) : (
                        <Text ftsz={12} weight="500" c={"#FFF"}>
                          Confirm
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </MainLayout>
  );
};

export default DeleteAccount;
