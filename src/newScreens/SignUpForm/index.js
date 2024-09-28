import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { SelectInput, Text, TextInput } from "../../components";
import { ICONS } from "../../constants";
import Icon from "react-native-vector-icons/Feather";
import { Keyboard, Platform } from "react-native";
import { useAppSelector } from "../../redux";
import DocumentPicker, { types } from "react-native-document-picker";
import { api } from "../../redux/api";
import { navigate } from "../../utils/navigationService";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignUpForm = props => {
  const navigation = props?.navigation;
  const user = useAppSelector(state => state?.user);
  const home = useAppSelector(state => state?.home);
  const [firstName, setFirstName] = useState(
    user?.firstName?.length > 0 ? user?.firstName : "",
  );
  const [lastName, setLastName] = useState(
    user?.lastName?.length > 0 ? user?.lastName : "",
  );
  const [stage, setStage] = useState(1);
  const [cvPath, setCVPath] = useState(false);
  const [careerStage, setCareerStage] = useState("");
  const [desiredCareer, setDesiredCareer] = useState(false);
  const [referralCode , setReferralCode] = useState(home?.referralCode || "");
  const [
    submitSignUpForm,
    { data: signUpSuccessData, isSuccess, isError, isLoading, error },
  ] = api.useSignUpMutation();
  const [searchRole, setSearchRole] = useState("");
  const debouncedSearchRole = useDebounce(searchRole, 300);
  const [roleDataList, setRoleDataList] = useState([]);
  const {
    data: roleList,
    page: roleListPage,
    onReachedEnd: onReachedRoleEnd,
    loadingMoreData: loadMoreRoleData,
  } = usePagination(debouncedSearchRole, roleDataList);
  const { data: roleData } = api.useGetEducationWorkDetailsQuery({
    search: debouncedSearchRole,
    type: "job_titles",
    page: roleListPage,
  });
  const [degree, setDegree] = useState(false);
  const [degreeCompletion, setDegreeCompletion] = useState("");
  const [yoe, setYoe] = useState(false);

  useEffect(()=>{
    if(isError){
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error?.message}`,
    });
    }
  },[isError])

  let stage1Disabled =
    firstName?.trim()?.length === 0 ||
    lastName?.trim()?.length === 0 ||
    careerStage?.trim()?.length === 0;
  if (careerStage === "Working Professional") {
    stage1Disabled = stage1Disabled || !yoe;
  }
  if (careerStage === "College Student") {
    stage1Disabled =
      stage1Disabled || !degree || degreeCompletion?.length === 0;
  }
  const stage2Disabled = !desiredCareer || desiredCareer?.length === 0;
  const stage3Disabled = !cvPath?.uri?.length || cvPath?.uri?.length === 0;

  useEffect(() => {
    if (roleData?.data?.length > 0) {
      setRoleDataList([...roleData?.data]);
    } else {
      setRoleDataList([]);
    }
  }, [roleData]);

  const onSelectRole = val => {
    setDesiredCareer(val);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Disable swipe back gesture
    });
  }, [navigation]);

  const handleBackPress = () => {
    setStage(stage - 1);
  };

  const onUploadFile = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.images, types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      const { uri, type, name } = pickerResult;
      setCVPath({ uri, name, type });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong in UploadCV or ParseCV",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      logAnalyticsEvents("profile_created", {});
      if (cvPath?.name?.length > 0) {
        logAnalyticsEvents("resume_uploaded_sign_up", {});
      }
      navigate("BottomTab", {
        screen: "Dashboard",
        params: { showWelcomePopup: true },
      });
    }
  }, [isSuccess]);

  const submitForm = skip => {
    const bodyFormData = new FormData();
    bodyFormData.append("user_id", user?.user_id);
    bodyFormData.append("firstName", firstName);
    bodyFormData.append("lastName", lastName);
    bodyFormData.append("currentStage", careerStage);
    bodyFormData.append("desiredCareer", desiredCareer);
    bodyFormData.append("degree", degree);
    bodyFormData.append("yoe", yoe);
    bodyFormData.append("degreeYear", degreeCompletion);
    referralCode?.length>0 && bodyFormData.append("referred_by",referralCode)

    {
      skip && bodyFormData.append("resume", cvPath);
    }

    submitSignUpForm(bodyFormData);
  };

  useEffect(() => {
    if (careerStage === "College Student") {
      setYoe(false);
    } else if (careerStage === "Working Professional") {
      setDegree(false);
      setDegreeCompletion("");
    }
  }, [careerStage]);

  const handleNextButton = () => {
    if (stage === 1) {
      if (
        firstName?.length > 0 &&
        lastName?.length > 0 &&
        careerStage?.length > 0
      ) {
        logAnalyticsEvents("sign_up_next_1", {});
        setStage(2);
      }
    } else if (stage === 2) {
      if (desiredCareer?.length > 0) {
        logAnalyticsEvents("sign_up_next_2", {});
        setStage(3);
      }
    } else if (stage === 3) {
      if (cvPath?.uri?.length > 0) {
        logAnalyticsEvents("sign_up_next_3", {});
        submitForm(true);
      }
    }
  };

  const insets = useSafeAreaInsets();

  const Form1 = () => {
    return (
      <View>
        <Text weight="500" ftsz={18} mt={32}>
          Your Name
        </Text>
        <View fd="row" gap={24} mt={12}>
          <TextInput
            value={firstName?.trim()}
            onChangeText={text => {
              setFirstName(text);
            }}
            f={1}
            pv={16}
            bgc={"#FFf"}
            c={"#000"}
            placeholderTextColor={"#7F8A8E"}
            placeholder="First name"
            ftf="Manrope-SemiBold"
            ftw="600"
            ftsz={15}
            bw={0.4}
            bc={"#7F8A8E"}
            br={12}
            pl={16}
          />
          <TextInput
            value={lastName?.trim()}
            onChangeText={text => {
              setLastName(text);
            }}
            f={1}
            bgc={"#FFf"}
            pl={16}
            c={"#000"}
            placeholderTextColor={"#7F8A8E"}
            placeholder="Last name"
            ftf="Manrope-SemiBold"
            ftw="600"
            ftsz={15}
            bw={0.4}
            bc={"#7F8A8E"}
            br={12}></TextInput>
        </View>
        <Text weight="500" ftsz={18} mt={32}>
          Your current career stage
        </Text>
        <View mt={12}>
          <SelectInput
            snapPoints={["50%"]}
            value={careerStage}
            selectedOptions={careerStage}
            onSelect={index => {
              setCareerStage(index);
            }}
            options={["College Student", "Working Professional"]}
            label="Your current career stage"
            renderInput={({ onPressSelect }) => (
              <TouchableOpacity
                onPress={() => {
                  Keyboard?.dismiss();
                  onPressSelect();
                }}
                bw={0.4}
                bc={"#7F8A8E"}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FFF",
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}>
                <Text
                  numberOfLines={1}
                  weight="600"
                  ftsz={15}
                  style={{
                    flex: 1,
                    color: careerStage ? "#000" : "#7F8A8E",
                    paddingVertical: 20,
                  }}>
                  {careerStage ? `${careerStage}` : "Choose here"}
                </Text>
                <View>
                  <ICONS.Settings fill={"#7F8A8E"} stroke={"#7F8A8E"} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {careerStage === "College Student" && (
          <>
            <Text weight="500" ftsz={18} mt={32}>
              Choose degree & year of completion
            </Text>
            <View mt={12} fd="row">
              <SelectInput
                snapPoints={["50%"]}
                value={degree}
                selectedOptions={degree}
                onSelect={index => {
                  setDegree(index);
                }}
                options={["Bachelors", "Masters", "Doctorate (Phd)"]}
                label="Degree"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    f={1}
                    onPress={() => {
                      Keyboard?.dismiss();
                      onPressSelect();
                    }}
                    bw={0.4}
                    bc={"#7F8A8E"}
                    btlr={12}
                    bblr={12}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#FFF",
                      paddingHorizontal: 16,
                      alignItems: "center",
                    }}>
                    <Text
                      numberOfLines={1}
                      weight="600"
                      ftsz={15}
                      style={{
                        flex: 1,
                        color: degree ? "#000" : "#7F8A8E",
                        paddingVertical: 20,
                      }}>
                      {degree ? `${degree}` : "Choose degree"}
                    </Text>
                    <View>
                      <ICONS.Settings fill={"#7F8A8E"} stroke={"#7F8A8E"} />
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TextInput
                value={degreeCompletion?.trim()}
                onChangeText={text => {
                  setDegreeCompletion(text);
                }}
                keyboardType="number-pad"
                f={1}
                pv={16}
                bgc={"#FFf"}
                c={"#000"}
                maxLength={4}
                placeholderTextColor={"#7F8A8E"}
                placeholder="Type year"
                ftf="Manrope-SemiBold"
                weight="600"
                ftsz={15}
                btw={0.4}
                brw={0.4}
                bbw={0.4}
                bc={"#7F8A8E"}
                btrr={12}
                bbrr={12}
                pl={16}
              />
            </View>
          </>
        )}
        {careerStage === "Working Professional" && (
          <>
            <Text weight="500" ftsz={18} mt={32}>
              Choose years of experience
            </Text>
            <View mt={12} fd="row">
              <SelectInput
                snapPoints={["60%"]}
                value={yoe}
                selectedOptions={yoe}
                onSelect={index => {
                  setYoe(index);
                }}
                options={[
                  "0-2 years",
                  "2-4 years",
                  "4-8 years",
                  "8-12 years",
                  "12+ years",
                ]}
                label="Years of experience"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard?.dismiss();
                      onPressSelect();
                    }}
                    f={1}
                    bw={0.4}
                    bc={"#7F8A8E"}
                    br={12}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#FFF",
                      paddingHorizontal: 16,
                      alignItems: "center",
                    }}>
                    <Text
                      numberOfLines={1}
                      weight="600"
                      ftsz={15}
                      style={{
                        flex: 1,
                        color: yoe ? "#000" : "#7F8A8E",
                        paddingVertical: 20,
                      }}>
                      {yoe ? `${yoe}` : "Choose"}
                    </Text>
                    <View>
                      <ICONS.Settings fill={"#7F8A8E"} stroke={"#7F8A8E"} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}
        <Text weight="500" ftsz={18} mt={32}>
          Referral code 
        </Text>
        <View  mv={12} >
          <TextInput
            value={referralCode?.trim()}
            onChangeText={text => {
              setReferralCode(text);
            }}
            f={1}
            pv={16}
            bgc={"#FFf"}
            c={"#000"}
            placeholderTextColor={"#7F8A8E"}
            placeholder="Referral code"
            ftf="Manrope-SemiBold"
            ftw="600"
            ftsz={15}
            bw={0.4}
            bc={"#7F8A8E"}
            br={12}
            pl={16}
          />
        </View>
      </View>
    );
  };

  const Form2 = () => {
    return (
      <View>
        <Text weight="500" ftsz={18} mt={32}>
          Your current or desired career
        </Text>
        <View mt={12}>
          <View
            w={"100%"}
            style={{
              backgroundColor: "#FFF",
              borderRadius: 12,
              borderColor: "#7F8A8E",
              borderWidth: 0.4,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}>
            <SelectInput
              selectedOptions={desiredCareer}
              align={"left"}
              searchKey={searchRole}
              onSearch={setSearchRole}
              searchPlaceholder="Ex: Product manager"
              onReachEnd={onReachedRoleEnd}
              onReachEndThreshold={0.5}
              loadingMoreData={loadMoreRoleData}
              onSelect={onSelectRole}
              options={roleList?.map(val => val.name)}
              label="Choose your desired career"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={() => {
                    onPressSelect();
                  }}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#FFF",
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}>
                  <Text
                    numberOfLines={1}
                    weight="600"
                    ftsz={14}
                    style={{
                      flex: 1,
                      color: desiredCareer ? "#000" : "#7F8A8E",
                      paddingVertical: 20,
                    }}>
                    {desiredCareer ? `${desiredCareer}` : "Choose here"}
                  </Text>
                  <View>
                    <ICONS.Settings fill={"#7F8A8E"} stroke={"#7F8A8E"} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
    );
  };

  const Form3 = () => {
    return (
      <View>
        <Text ta="center" weight="500" ftsz={18} mt={32}>
          Help us personalise your experience
        </Text>
        <View mt={16}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={onUploadFile}
            fd="row"
            jc="center"
            bgc={"#FFF"}
            ai="baseline"
            pv={16}
            br={12}>
            <Text mr={8} weight="700" ftsz={14}>
              Upload CV
            </Text>
            <Icon name="upload" size={20} color={"#000"} />
          </TouchableOpacity>
          {cvPath?.name?.length > 0 && (
            <Text ta="center" ftsz={12} weight="500" mt={8}>
              Selected file: {cvPath?.name}
            </Text>
          )}
        </View>
        <Text ta="center" mt={16} ftsz={10} weight="400" c={"#FFF"}>
          File type: PDF, JPG or PNG. File size: less than 10MB.
        </Text>
      </View>
    );
  };

  const imgUrl =
    stage === 1
      ? require("./SignUpFormBackground.png")
      : stage === 2
      ? require("./SignUpFormBackground2.png")
      : require("./SignUpFormBackground3.png");

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground ai="center" f={1} source={imgUrl} resizeMode="cover">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          w={"100%"}
          f={1}>
          <ScrollView
            w={"100%"}
            contentContainerStyle={{ paddingBottom: insets?.bottom + 100, flexGrow: 1 }}>
            <View f={1} ph={16} w={"100%"} mt={12}>
              <View fd="row" ai="center" jc="space-between">
                <TouchableOpacity
                  onPress={() => {
                    if (stage > 1) {
                      handleBackPress();
                    }
                  }}
                  h={30}
                  w={30}
                  br={30}
                  bgc={stage > 1 ? "#000" : "transparent"}
                  jc="center"
                  ai="center"
                  mv={16}>
                  {stage > 1 && <ICONS.ChevronLeft fill="#FFF" />}
                </TouchableOpacity>
                {stage === 3 && (
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => {
                      logAnalyticsEvents("sign_up_cv_skip", {});
                      submitForm(false);
                    }}>
                    <Text ftsz={16} weight="600">
                      Skip
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View fd="row" mb={32} mt={16} gap={12}>
                <View
                  br={8}
                  bgc={stage >= 1 ? "#000" : "#FFF"}
                  h={8}
                  f={1}></View>
                <View
                  br={8}
                  bgc={stage >= 2 ? "#000" : "#FFF"}
                  h={8}
                  f={1}></View>
                <View
                  br={8}
                  bgc={stage >= 3 ? "#000" : "#FFF"}
                  h={8}
                  f={1}></View>
              </View>
              <View w={"100%"}>
                <Text ftsz={19} weight="500" c={"#000"}>
                  Hi there!
                </Text>
                <Text ftsz={14} weight="500" c={"#FFF"} mt={8}>
                  Let’s get to know you a bit.
                </Text>
              </View>
              {stage === 1 ? Form1() : stage === 2 ? Form2() : Form3()}
            </View>
            {stage === 1 && (
              <View w={"100%"} pb={8} po="absolute" b={insets?.bottom + 20}>
                <TouchableOpacity
                  onPress={() => {
                    handleNextButton();
                  }}
                  disabled={stage1Disabled}
                  mb={8}
                  br={12}
                  pv={12}
                  mh={16}
                  bgc={stage1Disabled ? "#7F8A8E" : "#000"}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color={"#FFF"} />
                  ) : (
                    <Text weight="600" ftsz={16} c={"#FFF"} ta="center">
                      Next
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {stage === 2 && (
              <View w={"100%"} pb={8}  po="absolute" b={0}>
                <TouchableOpacity
                  disabled={stage2Disabled}
                  onPress={() => {
                    handleNextButton();
                  }}
                  mb={8}
                  br={12}
                  pv={12}
                  mh={16}
                  bgc={stage2Disabled ? "#7F8A8E" : "#000"}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color={"#FFF"} />
                  ) : (
                    <Text weight="600" ftsz={16} c={"#FFF"} ta="center">
                      Next
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {stage === 3 && (
              <View w={"100%"} pb={8} po="absolute" b={0}>
                <TouchableOpacity
                  disabled={stage3Disabled}
                  onPress={() => {
                    handleNextButton();
                  }}
                  mb={8}
                  br={12}
                  pv={12}
                  mh={16}
                  bgc={stage3Disabled ? "#7F8A8E" : "#000"}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color={"#FFF"} />
                  ) : (
                    <Text weight="600" ftsz={16} c={"#FFF"} ta="center">
                      Next
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </MainLayout>
  );
};

export default SignUpForm;