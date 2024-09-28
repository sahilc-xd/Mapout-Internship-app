import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
} from "react-native-style-shorthand";
import { Text, SelectInput, TextInput } from "../../components";
import Icons from "../../constants/icons";
import { Keyboard, Platform } from "react-native";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import { isEmailValid, isOTPValid } from "../../utils/isEmailValid";
import usePagination from "../../hooks/usePagination";
import LinearGradient from "react-native-linear-gradient";
import AntIcon from "react-native-vector-icons/AntDesign";
import useKeyboard from "../../hooks/useKeyboard";
import { getFcmToken } from "../../utils/notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GradientBackground from "../../utils/GradientBackground";
import DatePicker from "react-native-date-picker";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
const languageLevels = ["Basic", "Fluent", "Native"];

const OTPModal = props => {
  const {
    showOTPpopup,
    closePopup,
    isEmail,
    value,
    resendOTP,
    handleVerifyOTP,
    isVerifying,
    resendDisabled,
    OTP,
    setOTP,
    errorMsg,
    setErrorMsg,
  } = props;
  const { keyboardOpen } = useKeyboard();

  return (
    <Modal visible={showOTPpopup} onRequestClose={closePopup} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        bgc={"rgba(0,0,0,0.3)"}
        f={1}>
        <TouchableOpacity
          activeOpacity={1}
          f={1}
          onPress={() => {
            Keyboard?.dismiss();
          }}
        />
        <View>
          <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            useAngle={true}
            angle={135}
            angleCenter={{ x: 0.5, y: 0.5 }}
            style={{
              paddingHorizontal: 24,
              paddingTop: 32,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
            }}>
            <TouchableOpacity onPress={closePopup} asf="flex-end" t={0}>
              <AntIcon name="close" size={18} color={"#000"} />
            </TouchableOpacity>
            <View w={"100%"} ai="center" jc="space-between">
              <View w={"100%"}>
                <View mh={24}>
                  <Text ftsz={18} weight="500">
                    Enter OTP sent to your {isEmail ? "Email" : "Phone"}
                  </Text>
                  <Text c={"#7F8A8E"} mv={8} ftsz={14} weight="500">
                    We've sent it to {value}
                  </Text>
                  <View fd="row">
                    <TextInput
                      autoFocus
                      c={"#000"}
                      placeholderTextColor={"#7F8A8E"}
                      maxLength={6}
                      f={1}
                      value={OTP}
                      keyboardType="number-pad"
                      pv={12}
                      onChangeText={text => {
                        setOTP(text);
                        setErrorMsg(false);
                      }}
                      ftf="RedHatDisplay-SemiBold"
                      ftsz={15}
                      bw={0.4}
                      bc={"#7F8A8E"}
                      br={12}
                      bgc={"#FFF"}
                      ta="center"
                      placeholder={"000000"}
                    />
                  </View>
                  {errorMsg && (
                    <Text mt={12} ta="center" ftsz={14} weight="600" c={"red"}>
                      {errorMsg}
                    </Text>
                  )}
                  <View w={"100%"} mt={16}>
                    <TouchableOpacity
                      onPress={handleVerifyOTP}
                      mb={8}
                      br={12}
                      bgc={"#000000"}
                      jc="center"
                      ai="center"
                      bw={1}
                      pv={12}
                      fd="row">
                      {isVerifying ? (
                        <ActivityIndicator size={"small"} color={"#FFF"} />
                      ) : (
                        <Text ml={8} ftsz={16} weight="600" c={"#FFF"}>
                          Verify OTP
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 16);

const selectedDate = new Date();
selectedDate.setFullYear(selectedDate.getFullYear() - 17);

const PersonalDetails = props => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const handleButtonPress = props?.handleButtonPress;
  const user = useAppSelector(state => state?.user);
  const currentDate = new Date();
  const [inputError, setInputError] = useState(false);
  const {
    data: languagesList,
    isLoading: isLoadingLanguage,
    isSuccess: isSuccessLanguage,
  } = api.useGetLanguagesQuery();
  const [allLanguages, setAllLanguages] = useState([]);
  const [ethinicDataList, setEthinicDataList] = useState([]);
  const {
    data: ethinicityList,
    page: ethinicityPage,
    onReachedEnd: onReachedEthinicityEnd,
    loadingMoreData: loadMoreEthinicityData,
  } = usePagination("", ethinicDataList, (pagesize = 20), (initialPage = 1));
  const { data: ethinicityData, isLoading: isLoadingEthinicity } =
    api.useGetEducationWorkDetailsQuery({
      search: "",
      type: "ethnicity",
      page: ethinicityPage,
    });
  const [searchHobby, setSearchHobby] = useState("");
  const debouncedHobby = useDebounce(searchHobby, 300);
  const [hobbyDataList, setHobbyDataList] = useState([]);
  const {
    data: hobbyList,
    page: hobbyPage,
    onReachedEnd: onReachedHobbyEnd,
    loadingMoreData: loadMoreHobbyData,
  } = usePagination(
    debouncedHobby,
    hobbyDataList,
    (pagesize = 20),
    (initialPage = 1),
  );

  const { data: hobbiesData, isLoading: isLoadingHobby } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedHobby,
      type: "hobby",
      page: hobbyPage,
    });
  const [searchNationality, setSearchNationality] = useState("");
  const debouncedNationality = useDebounce(searchNationality, 300);
  const [nationalityDataList, setNationalityDataList] = useState([]);
  const {
    data: nationalityList,
    page: nationalityPage,
    onReachedEnd: onReachedNationalityEnd,
    loadingMoreData: loadMoreNationalityData,
  } = usePagination(
    debouncedNationality,
    nationalityDataList,
    (pagesize = 20),
    (initialPage = 1),
  );
  const { data: nationalityData, isLoading: isLoadingNationality } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedNationality,
      type: "nationality",
      page: nationalityPage,
    });
  const [firstName, setFirstName] = useState(
    user?.firstName?.length > 0 ? user?.firstName : "",
  );
  const [lastName, setLastName] = useState(
    user?.lastName?.length > 0 ? user?.lastName : "",
  );
  const [gender, setGender] = useState(
    user?.gender?.length > 0 ? user?.gender : "",
  );
  const [ethinicity, setEthinicity] = useState(
    user?.ethnicity?.length > 0 ? user?.ethnicity : "",
  );
  const [nationality, setNationality] = useState(
    user?.nationality?.length > 0 ? user?.nationality : "",
  );
  const [date, setDate] = useState(
    user?.dob?.length > 0 ? user?.dob?.split("/")?.[0] : "",
  );
  const [month, setMonth] = useState(
    user?.dob?.length > 0 ? user?.dob?.split("/")?.[1] : "",
  );
  const [year, setYear] = useState(
    user?.dob?.length > 0 ? user?.dob?.split("/")?.[2] : "",
  );
  const [email, setEmail] = useState(
    user?.email?.length > 0 ? user?.email : "",
  );
  const [phone, setPhone] = useState(user?.mobile ? user?.mobile : "");
  const [hobby, setHobby] = useState(
    user?.hobbies_interests?.length > 0 ? user?.hobbies_interests : [],
  );
  const [language, setLanguage] = useState(
    user?.languages?.length > 0
      ? user?.languages
      : [
        {
          name: "",
          fluency: "",
        },
      ],
  );

  const [showCountryCode, setShowCountryCode] = useState([]);
  const [allCountryCodes, setAllCountryCodes] = useState([]);
  const [countryCode, setCountryCode] = useState("+91");
  const [
    getCountryCode,
    { data: countryCodeData, isSuccess: isSuccessCountryCode },
  ] = api.useLazyGetCountryCodeQuery();
  const [
    sendOtp,
    {
      data: otpData,
      isLoading: otpGetLoading,
      error: otpError,
      isSuccess: otpGetSuccess,
    },
  ] = api.useSendOtpForMobileVerificationMutation();
  const [showOTPpopup, setshowOTPpopup] = useState(false);
  const [validitionError, setvaliditionError] = useState(false);
  const [isEmail, setIsEmail] = useState();
  const [
    verifyOtp,
    {
      isLoading: isVerifying,
      error: verifyError,
      isError: isVerifyError,
      isSuccess: isVerifySucess,
    },
  ] = api.useVerifyOtpForMobileVerificationMutation();
  const [resendDisabled, setResendDisabled] = useState(true);
  const [OTP, setOTP] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [verified, setverified] = useState(false);

  const [open, setOpen] = useState(false);

  // const retrieveNotificationToken = async () => {
  //   try {
  //     let token = await AsyncStorage.getItem("notificationToken");
  //     return token
  //   } catch (error) {
  //     console.error("Error retrieving notification token:", error);
  //     return null;
  //   }
  // };
  useEffect(() => {
    if (otpGetSuccess) {
      setResendDisabled(true);
    }
  }, [otpGetSuccess]);

  useEffect(() => {
    getCountryCode();
  }, []);

  useEffect(() => {
    if (isSuccessCountryCode) {
      setCountryCode(countryCodeData?.data?.userCountryDetails?.code || "+91");
      const data = countryCodeData?.data?.allCountryDetails?.map(item => {
        return `${item?.flag} ${item?.name} ${item?.code}`;
      });
      setAllCountryCodes(data);
      setShowCountryCode(data);
    }
  }, [isSuccessCountryCode]);

  const [saveProfile, { data, isSuccess, isLoading, isError, error }] =
    api.useSaveProfileMutation();

  useEffect(() => {
    if (isSuccess) {
      logAnalyticsEvents('completed_personal_profile', {});
      handleButtonPress();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.message || "Something went wrong",
      });
      setverified(false);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccessLanguage) {
      const languages = [...languagesList?.data?.map(val => val.language)];
      setAllLanguages([...languages]);
    }
  }, [isSuccessLanguage]);

  useEffect(() => {
    if (ethinicityData?.data?.length > 0) {
      setEthinicDataList([...ethinicityData?.data]);
    } else {
      setEthinicDataList([]);
    }
  }, [ethinicityData]);

  useEffect(() => {
    if (hobbiesData?.data?.length > 0) {
      setHobbyDataList([...hobbiesData?.data]);
    } else {
      setHobbyDataList([]);
    }
  }, [hobbiesData]);

  useEffect(() => {
    if (nationalityData?.data?.length > 0) {
      setNationalityDataList([...nationalityData?.data]);
    } else {
      setNationalityDataList([]);
    }
  }, [nationalityData]);

  const checkLanguage = () => {
    const valid = language?.map((item, index) => {
      if (
        item?.name?.trim()?.length === 0 ||
        item?.fluency?.trim()?.length === 0
      ) {
        return false;
      }
      return true;
    });
    if (valid?.includes(false)) {
      const index = valid?.indexOf(false);
      setInputError({
        id: index,
        errorMsg: "Missing",
        key:
          language[index]?.name?.trim()?.length === 0
            ? "language-name"
            : "language-fluency",
      });
    }
    return valid?.includes(false);
  };

  const handleSave = () => {
    if (firstName?.trim()?.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill the first name",
      });
      setInputError({
        key: "firstName",
        errorMsg: "Missing",
      });
      return;
    }
    // <<<<<<< MO-560
    else if (lastName?.trim()?.length === 0) {
      // =======
      //     if (
      //       firstName?.length === 0 ||
      //       lastName?.length === 0 ||
      //       gender?.length === 0 ||
      //       date?.length != 2 ||
      //       month?.length != 2 ||
      //       year.length != 4 ||
      //       email?.length === 0 ||
      //       !isEmailValid(email) ||
      //       phone?.length === 0
      //     ) {
      // >>>>>>> development
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill the last name",
      });
      setInputError({
        key: "lastName",
        errorMsg: "Missing",
      });
      return;
      // <<<<<<< MO-560
    } else if (gender?.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill the gender",
      });
      setInputError({
        key: "gender",
        errorMsg: "Missing",
      });
      return;
    } else if (
      date?.length != 2 ||
      month?.length != 2 ||
      year.length != 4 ||
      isNaN(parseInt(date)) ||
      !Number.isInteger(parseInt(date)) ||
      date > 31 ||
      date <= 0 ||
      isNaN(parseInt(month)) ||
      !Number.isInteger(parseInt(month)) ||
      month > 12 ||
      month <= 0 ||
      isNaN(parseInt(year)) ||
      !Number.isInteger(parseInt(year))
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill the valid date",
      });
      setInputError({
        key: "date",
        errorMsg: "Enter a valid date",
      });
      return;
    } else if (email?.length === 0 || !isEmailValid(email)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill the valid email",
      });
      setInputError({
        key: "email",
        errorMsg: "Please enter a valid email.",
      });
      return;
    } else if (checkLanguage()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must fill all the necessary fields",
      });
      return;
    } else {
      let data = {
        user_id: user?.user_id,
        name: `${firstName} ${lastName}`,
        ethnicity: ethinicity,
        nationality: nationality,
        dob: `${date}/${month}/${year}`,
        email: email,
        gender: gender,
        hobbies_interests: hobby,
        languages: language,
        firstName: firstName,
        lastName: lastName
      };

      saveProfile(data);
    }
  };

  const onSelectGender = val => {
    setGender(val);
  };

  const onSelectEthinicty = val => {
    setEthinicity(val);
  };

  const onSelectNationality = val => {
    setNationality(val);
  };

  const onSelectHobby = val => {
    if (hobby?.includes(val)) {
      const data = [...hobby];
      const index = data.indexOf(val);
      if (index > -1) {
        data.splice(index, 1);
        setHobby([...data]);
      }
    } else {
      if (hobby?.length === 5) {
        Toast.show({
          type: "error",
          text1: "Maximum selected",
          text2: "Choose at max 5.",
        });
      } else {
        setHobby(prv => {
          let data = [...prv];
          data.push(val);
          return data;
        });
      }
    }
  };

  const addLanguage = (val, key, index) => {
    setLanguage(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      updatedData[key] = val;
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const deleteLanguage = index => {
    setLanguage(prv => {
      let data = [...prv];
      data.splice(index, 1);
      return data;
    });
  };

  const onSearchLanguage = val => {
    const searchKey = val?.trim()?.toLowerCase();
    if (searchKey?.length > 0) {
      const languages = [...languagesList?.data?.map(it => it.language)];
      const languageFilter = [...languages]?.filter(item => {
        if (item?.toLowerCase()?.includes(searchKey)) {
          return item;
        }
      });
      setAllLanguages(languageFilter);
    } else {
      setAllLanguages([...languagesList?.data?.map(it => it.language)]);
    }
  };

  const onSearchCountryCode = val => {
    const searchKey = val?.trim()?.toLowerCase();
    if (searchKey?.length === 0) {
      setShowCountryCode(allCountryCodes);
    } else {
      const arr = allCountryCodes?.filter(item => {
        if (item?.trim()?.toLowerCase().includes(searchKey)) {
          return item;
        }
      });
      setShowCountryCode(arr);
    }
  };

  let loadingData =
    isLoadingEthinicity ||
    isLoadingNationality ||
    isLoadingHobby ||
    isLoadingLanguage;

  const closePopup = () => {
    setshowOTPpopup(false);
  };

  const onClickVerify = type => {
    Keyboard?.dismiss();
    setIsEmail(type == "email" ? true : false);
    handleGetOTP();
    setshowOTPpopup(true);
  };

  const handleGetOTP = () => {
    if (isEmail) {
      if (isEmailValid(email)) {
        sendOtp({ email: email });
      } else {
        setvaliditionError("Invalid email");
      }
    } else {
      if (phone?.length > 0) {
        sendOtp({ phoneNumber: `${phone}`, country_code: `${countryCode}` });
      } else {
        setvaliditionError("Invalid Phone");
      }
    }
  };

  const handleResendOTP = () => {
    sendOtp(
      isEmail
        ? { email: email }
        : { phoneNumber: phone, country_code: countryCode },
    );
  };

  const handleVerifyOTP = async () => {
    if (isOTPValid(OTP, (type = isEmail ? "email" : "phone"))) {
      try {
        await getFcmToken();
        verifyOtp(
          isEmail
            ? { email, otp: OTP, isToVerify: true }
            : {
              otp: OTP,
              phoneNumber: phone,
              country_code: countryCode,
              isToVerify: true,
            },
        );
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    } else {
      setErrorMsg("Error: OTP must be of 6 digits.");
    }
  };

  useEffect(() => {
    if (isVerifyError) {
      setErrorMsg("OTP is not correct");
    }
  }, [isVerifyError]);

  useEffect(() => {
    if (isVerifySucess) {
      setverified(true);
      closePopup();
    }
  }, [isVerifySucess]);

  useEffect(() => {
    setErrorMsg(false);
  }, [email, phone]);

  const handleDateChanges = () => {
    setOpen(true);
  };

  const handleCancelDatePicker = () => {
    setOpen(false);
  };


  const handleDatePickerConfirmed = date => {
    const selectedDate = new Date(date);
    const [day, month, year] = [
      selectedDate.getDate().toString().padStart(2, "0"),
      (selectedDate.getMonth() + 1).toString().padStart(2, "0"),
      selectedDate.getFullYear().toString(),
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedDay = selectedDate.getDate();

    let age = currentYear - selectedYear;

    if (currentMonth < selectedMonth || (currentMonth === selectedMonth && currentDay < selectedDay)) {
      age--;
    }

    if (age < 16) {
      setInputError({
        key: "date",
        errorMsg: "Age should be at least 16",
      });
    } else {
      setDate(day.toString());
      setMonth(month.toString());
      setYear(year.toString());
    }

    setOpen(false);
  };

  const handleFirstNameInput = (text) => {
    setFirstName(text);
    inputError &&
      inputError?.key === "firstName" &&
      setInputError(false);
  }

  const handleLastNameInput = (text) => {
    setLastName(text);
    inputError &&
      inputError?.key === "lastName" &&
      setInputError(false);
  }

  const handleGenderSelect = (item) => {
    setGender(item);
  }

  const renderGenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => handleGenderSelect(item)} f={1} bw={1} bc={'#8E8E8E'} bgc={gender === item ? '#FFF' : 'transparent'} br={10} pv={5} ph={10} mh={10} mv={5} ai="center">
        <Text ftsz={13}>{item}</Text>
      </TouchableOpacity>
    )
  }

  const handleFluencySelected = (val, index) => {
    addLanguage(val, "fluency", index);
  }

  const renderLanguageItem = ({ item, index }) => {
    return (
      <View bw={1} br={12} bc={'#8E8E8E'} bgc={"#FFF"} mv={5} ph={20} pv={10}>
        <View fd="row" ai="flex-start">
          <View f={1}>
            <SelectInput
              align={"left"}
              snapPoints={["80%"]}
              onSelect={val => {
                addLanguage(val, "name", index);
                inputError &&
                  inputError?.key === "language-name" &&
                  inputError?.id === index &&
                  setInputError(false);
              }}
              selectedOptions={item?.name}
              onSearch={onSearchLanguage}
              searchPlaceholder="Search language"
              options={[...allLanguages]}
              label="Choose any one*"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={onPressSelect}
                  ai="center"
                  bc={"#7F8A8E"}
                  fd="row"
                  gap={16}>
                  <Text
                    weight="400"
                    ftsz={14}
                    c={item?.name?.length ? "#000" : "#7F8A8E"}
                    pb={4}>
                    {item?.name?.length
                      ? item?.name
                      : "Choose here"}
                  </Text>
                  <Icons.ChevronLeft
                    width={20}
                    height={20}
                    fill={"#000"}
                    style={{
                      transform: [{ rotate: "270deg" }],
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          <View>
            {language?.length > 1 && (
              <TouchableOpacity
                onPress={() => {
                  deleteLanguage(index);
                }}
                mt={4}
                asf="flex-end">
                <Icons.TrashRed />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View mt={10}>
          <FlatList
            data={languageLevels}
            renderItem={({ item: level }) => (
              <TouchableOpacity onPress={() => handleFluencySelected(level, index)} f={1} ai="center" bgc={item?.fluency === level ? "rgba(216,277,252,1)" : "rgba(216, 227, 252, 0.45)"} mh={10} br={8} pv={5}>
                <Text ftsz={13}>{level}</Text>
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        </View>
      </View>
    )
  }

  const addNewLanguage = () => {
    setLanguage(prv => {
      let data = [...prv];
      data.push({
        name: "",
        fluency: "",
      });
      return data;
    });
  }

  const renderNationality = ({ onPressSelect }) => (
    <TouchableOpacity
      onPress={onPressSelect}
      jc="center"
      ai="center"
      mt={12}
      bbw={1}
      bc={"#7F8A8E"}
      fd="row"
      gap={16}>
      <Text
        f={1}
        weight="400"
        ftsz={14}
        c={nationality ? "#000" : "#7F8A8E"}
        pb={4}>
        {nationality ? nationality : "Choose here"}
      </Text>
      <Icons.ChevronLeft
        width={20}
        height={20}
        fill={"#000"}
        style={{
          transform: [{ rotate: "270deg" }],
        }}
      />
    </TouchableOpacity>
  )

  return loadingData ? (
    <View f={1} ai="center" jc="center">
      <ActivityIndicator size={"large"} color={"#000"} />
    </View>
  ) : (
    <>
      <OTPModal
        showOTPpopup={showOTPpopup}
        isVerifying={isVerifying}
        closePopup={closePopup}
        isEmail={isEmail}
        value={isEmail ? email : phone}
        resendDisabled={resendDisabled}
        resendOTP={handleResendOTP}
        handleVerifyOTP={handleVerifyOTP}
        OTP={OTP}
        setOTP={setOTP}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
      <View f={1}>
        <DatePicker
          modal
          open={open}
          date={selectedDate}
          maximumDate={maxDate}
          mode="date"
          onConfirm={date => handleDatePickerConfirmed(date)}
          onCancel={handleCancelDatePicker}
        />
        <KeyboardAwareScrollView
          style={{ flex: 1, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}>
          <View mh={24} mt={16}>
            <Text ftsz={13} weight="500" c={"#141418"}>
              Name*
            </Text>
            <View fd="row" gap={16} ai="baseline">
              <View f={1}>
                <TextInput
                  value={firstName}
                  ref={firstNameRef}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => { lastNameRef?.current?.focus(); }}
                  onChangeText={handleFirstNameInput}
                  bc={"#7F8A8E"}
                  style={{ fontSize: 14, fontFamily: "Manrope-Regular" }}
                  pb={4}
                  maxLength={20}
                  placeholder="First Name"
                  placeholderTextColor={"#7F8A8E"}
                  mt={8}
                  bbw={1}
                  c={"#000"}
                />
                {inputError && inputError?.key === "firstName" && (
                  <Text ftsz={12} weight="500" c={"red"}>
                    {inputError?.errorMsg}
                  </Text>
                )}
              </View>
              <View f={1}>
                <TextInput
                  value={lastName}
                  ref={lastNameRef}
                  onChangeText={handleLastNameInput}
                  bc={"#7F8A8E"}
                  style={{ fontSize: 14, fontFamily: "Manrope-Regular" }}
                  pb={4}
                  maxLength={20}
                  placeholder="Last Name"
                  placeholderTextColor={"#7F8A8E"}
                  mt={8}
                  bbw={1}
                  c={"#000"}
                />
                {inputError && inputError?.key === "lastName" && (
                  <Text ftsz={12} weight="500" c={"red"}>
                    {inputError?.errorMsg}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View mh={24} mt={24}>
            <Text ftsz={13} weight="500" c={"#141418"}>
              Gender*
            </Text>
            <FlatList
              data={genders}
              renderItem={renderGenderItem}
              numColumns={2}
            />
            {/* <SelectInput
              snapPoints={["50%"]}
              value={gender}
              selectedOptions={gender}
              onSelect={index => {
                onSelectGender(index);
                inputError &&
                  inputError?.key === "gender" &&
                  setInputError(false);
              }}
              options={["Male", "Female", "Non-binary", "Prefer not to say"]}
              label="Gender*"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={onPressSelect}
                  jc="center"
                  ai="center"
                  mt={12}
                  bbw={1}
                  bc={"#7F8A8E"}
                  fd="row"
                  gap={16}>
                  <Text
                    f={1}
                    weight="400"
                    ftsz={14}
                    c={gender ? "#000" : "#7F8A8E"}
                    pb={4}>
                    {gender ? gender : "Choose here"}
                  </Text>
                  <Icons.ChevronLeft
                    width={20}
                    height={20}
                    fill={"#000"}
                    style={{
                      transform: [{ rotate: "270deg" }],
                    }}
                  />
                </TouchableOpacity>
              )}
            /> */}
            {inputError && inputError?.key === "gender" && (
              <Text ftsz={12} weight="500" c={"red"}>
                {inputError?.errorMsg}
              </Text>
            )}
          </View>
          <View mh={24} mt={24}>
            <Text ftsz={13} weight="500" c={"#141418"}>
              Ethinicity
            </Text>
            <SelectInput
              onReachEnd={onReachedEthinicityEnd}
              onReachEndThreshold={0.5}
              loadingMoreData={loadMoreEthinicityData}
              snapPoints={["60%"]}
              value={ethinicity}
              selectedOptions={ethinicity}
              onSelect={index => {
                onSelectEthinicty(index);
              }}
              options={[...ethinicityList?.map(val => val.name)]}
              label="Ethinicity"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={onPressSelect}
                  jc="center"
                  ai="center"
                  mt={12}
                  bbw={1}
                  bc={"#7F8A8E"}
                  fd="row"
                  gap={16}>
                  <Text
                    f={1}
                    weight="400"
                    ftsz={14}
                    c={ethinicity ? "#000" : "#7F8A8E"}
                    pb={4}>
                    {ethinicity ? ethinicity : "Choose here"}
                  </Text>
                  <Icons.ChevronLeft
                    width={20}
                    height={20}
                    fill={"#000"}
                    style={{
                      transform: [{ rotate: "270deg" }],
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          <View mh={24} mt={16}>
            <GradientBackground>
              <View>
                <Text style={styles.heading}>✨ MapOut suggestions ✨</Text>
                <Text style={styles.paragraph}>
                  Including your ethnicity in your profile can help promote
                  diversity and inclusion within the workplace, and contribute
                  to creating an environment that values and respects diverse
                  ethnic backgrounds{" "}
                </Text>
              </View>
            </GradientBackground>
          </View>
          <View mh={24} mt={24}>
            <Text ftsz={13} weight="500" c={"#141418"}>
              Nationality
            </Text>
            <SelectInput
              onSearch={setSearchNationality}
              searchPlaceholder="Search nationality"
              onReachEnd={onReachedNationalityEnd}
              onReachEndThreshold={0.5}
              loadingMoreData={loadMoreNationalityData}
              snapPoints={["80%"]}
              value={nationality}
              selectedOptions={nationality}
              onSelect={index => {
                onSelectNationality(index);
              }}
              options={[...nationalityList?.map(val => val.name)]}
              label="Nationality"
              renderInput={renderNationality}
            />
          </View>
          <TouchableOpacity onPress={() => {
            handleDateChanges()
            setInputError(false)
          }}>
            <View mh={24} mt={24}>
              <Text ftsz={13} weight="500" c={"#141418"}>
                Date of birth*
              </Text>
              <View ai="center" mt={12} fd="row" gap={8} asf="baseline" bbw={1} bc={'#7F8A8E'}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                  }}
                  pl={4}
                  p={0}
                  m={0}
                  c={date?.length === 0 ? "#7F8A8E" : "#000"}>
                  {date?.length === 0 ? "DD" : date}
                </Text>
                <Text>/</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                  }}
                  p={0}
                  m={0}
                  c={month?.length === 0 ? "#7F8A8E" : "#000"}>
                  {month?.length === 0 ? "MM" : month}
                </Text>
                <Text>/</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                  }}
                  p={0}
                  pr={4}
                  m={0}
                  c={year?.length === 0 ? "#7F8A8E" : "#000"}>
                  {year?.length === 0 ? "YY" : year}
                </Text>
              </View>
              {inputError && inputError?.key === "date" && (
                <Text ftsz={12} weight="500" c={"red"}>
                  {inputError?.errorMsg}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View mh={24} mt={16} fd="row" gap={16}>
            <View f={1}>
              <Text ftsz={13} weight="500" c={"#141418"}>
                Email*
              </Text>
              <View fd="row" gap={16}>
                <TextInput
                  editable={user?.email?.length > 0 ? false : true && !verified}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    inputError &&
                      inputError?.key === "email" &&
                      setInputError(false);
                  }}
                  bc={"#7F8A8E"}
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                  }}
                  pb={4}
                  placeholder="Type here"
                  placeholderTextColor={"#7F8A8E"}
                  f={1}
                  bbw={1}
                  mt={8}
                  c={"#000"}
                />
              </View>
              {inputError && inputError?.key === "email" && (
                <Text ftsz={12} weight="500" c={"red"}>
                  {inputError?.errorMsg}
                </Text>
              )}
              {!user?.email && email.length > 0 && (
                <View ai="flex-end">
                  <TouchableOpacity
                    disabled={verified}
                    onPress={() => onClickVerify("email")}>
                    {otpGetLoading ? (
                      <></>
                    ) : verified ? (
                      <Text c={"#00a410"}>Verified</Text>
                    ) : (
                      <Text>Verify</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View f={1}>
              <Text ftsz={13} weight="500" c={"#141418"}>
                Mobile No*
              </Text>
              <View fd="row" gap={5}>
                <SelectInput
                  onSearch={val => {
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
                      onPress={() => {
                        onPressSelect();
                        Keyboard.dismiss();
                      }}
                      ph={5}
                      bbw={1}
                      bc={"#7F8A8E"}
                      mt={8}
                      jc="flex-end">
                      <Text pb={6} ftsz={14} weight="400" color="#000">
                        {countryCode}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TextInput
                  editable={user?.mobile ? false : true && !verified}
                  value={`${phone}`}
                  onChangeText={text => {
                    setPhone(text);
                    inputError &&
                      inputError?.key === "phone" &&
                      setInputError(false);
                  }}
                  keyboardType="number-pad"
                  bc={"#7F8A8E"}
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "Manrope-Regular",
                  }}
                  pb={4}
                  placeholder="Type here"
                  placeholderTextColor={"#7F8A8E"}
                  f={1}
                  mt={8}
                  bbw={1}
                  c={"#000"}
                />
              </View>
              {inputError && inputError?.key === "phone" && (
                <Text ftsz={12} weight="500" c={"red"}>
                  {inputError?.errorMsg}
                </Text>
              )}
              {!user?.mobile && phone.length > 0 && (
                <View ai="flex-end">
                  <TouchableOpacity
                    disabled={verified}
                    onPress={() => onClickVerify("phone")}>
                    {otpGetLoading ? (
                      <></>
                    ) : verified ? (
                      <Text c={"#00a410"}>Verified</Text>
                    ) : (
                      <Text>Verify</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View mh={24} mt={24}>
            <View fd="row" jc="space-between" ai="center">
              <Text ftsz={13} weight="500" c={"#141418"}>
                Hobbies & Interests
              </Text>
              {hobby?.length > 0 && (
                <TouchableOpacity
                  br={8}
                  pv={4}
                  ph={12}
                  bgc={"rgba(216, 227, 252, 0.45)"}
                  onPress={() => {
                    setHobby([]);
                  }}>
                  <Text>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
            <SelectInput
              onSearch={setSearchHobby}
              align={"left"}
              searchPlaceholder={"Search Hobby and Interests"}
              onReachEnd={onReachedHobbyEnd}
              onReachEndThreshold={0.5}
              loadingMoreData={loadMoreHobbyData}
              value={hobby}
              maxSelected={3}
              selectedOptions={hobby}
              onSelect={val => {
                // setHobby();
                onSelectHobby(val);
              }}
              options={[...hobbyList?.map(val => val.name)]}
              label="Hobbies & Interests"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={onPressSelect}
                  jc="center"
                  ai="center"
                  mt={12}
                  bbw={1}
                  bc={"#7F8A8E"}
                  fd="row"
                  gap={16}>
                  <Text
                    f={1}
                    weight="400"
                    ftsz={14}
                    c={hobby?.join()?.length > 0 ? "#000" : "#7F8A8E"}
                    pb={4}>
                    {hobby?.join()?.length > 0
                      ? hobby?.join(", ")
                      : "Choose at least 3"}
                  </Text>
                  <Icons.ChevronLeft
                    width={20}
                    height={20}
                    fill={"#000"}
                    style={{
                      transform: [{ rotate: "270deg" }],
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          <View mh={24} mt={24}>
            <View fd="row" jc="space-between" ai="center">
              <Text ftsz={13} weight="500" c={"#141418"}>
                Languages*
              </Text>
            </View>
            <View>
              <FlatList
                data={language}
                renderItem={renderLanguageItem}
                ListFooterComponent={<TouchableOpacity
                  onPress={addNewLanguage}
                  mt={16}
                  bgc={"rgba(216, 227, 252, 0.45)"}
                  asf="baseline"
                  pv={8}
                  ph={8}
                  br={8}>
                  <Text ftsz={12} weight="500">
                    + Add Other
                  </Text>
                </TouchableOpacity>}
              />
            </View>
            {/* <View>
              {language?.map((item, index) => {
                return (
                  <>
                    <View key={index.toString()} fd="row" gap={16}>
                      <View f={1}>
                        {inputError &&
                          inputError?.key === "language-name" &&
                          inputError?.id === index && (
                            <Text ftsz={12} weight="500" c={"red"}>
                              {inputError?.errorMsg}
                            </Text>
                          )}
                      </View>
                      <View f={1}>
                        <SelectInput
                          align={"left"}
                          snapPoints={["50%"]}
                          selectedOptions={item?.fluency}
                          onSelect={val => {
                            addLanguage(val, "fluency", index);
                            inputError &&
                              inputError?.key === "language-fluency" &&
                              inputError?.id === index &&
                              setInputError(false);
                          }}
                          options={["Basic", "Fluent", "Native"]}
                          label="Fluency*"
                          renderInput={({ onPressSelect }) => (
                            <TouchableOpacity
                              onPress={onPressSelect}
                              jc="center"
                              ai="center"
                              mt={12}
                              bbw={1}
                              bc={"#7F8A8E"}
                              fd="row"
                              gap={16}>
                              <Text
                                f={1}
                                weight="400"
                                ftsz={14}
                                c={item?.fluency?.length ? "#000" : "#7F8A8E"}
                                pb={4}>
                                {item?.fluency?.length
                                  ? item?.fluency
                                  : "Choose here"}
                              </Text>
                              <Icons.ChevronLeft
                                width={20}
                                height={20}
                                fill={"#000"}
                                style={{
                                  transform: [{ rotate: "270deg" }],
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        />
                        {inputError &&
                          inputError?.key === "language-fluency" &&
                          inputError?.id === index && (
                            <Text ftsz={12} weight="500" c={"red"}>
                              {inputError?.errorMsg}
                            </Text>
                          )}
                      </View>
                    </View>
                    {language?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => {
                          deleteLanguage(index);
                        }}
                        mt={4}
                        asf="flex-end">
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </>
                );
              })}
              <TouchableOpacity
                onPress={() => {
                  setLanguage(prv => {
                    let data = [...prv];
                    data.push({
                      name: "",
                      fluency: "",
                    });
                    return data;
                  });
                }}
                mt={16}
                bgc={"rgba(216, 227, 252, 0.45)"}
                asf="baseline"
                pv={8}
                ph={8}
                br={8}>
                <Text ftsz={12} weight="500">
                  + Add Other
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View h={100} />
        </KeyboardAwareScrollView>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        jc="center"
        ai="center"
        bgc={"#000"}
        pv={16}
        mv={4}
        mh={24}
        br={12}>
        {isLoading ? (
          <ActivityIndicator color={"#FFF"} size={"small"} />
        ) : (
          <Text ftsz={14} weight="500" c={"#FFF"}>
            Save & Next
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-Bold",
    marginBottom: 6,
  },
  paragraph: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "left",
  },
});

export default PersonalDetails;
