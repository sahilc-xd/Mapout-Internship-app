import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { useAppSelector } from "../../redux";
import { Text, TextInput } from "../../components";
import CheckBox from "react-native-check-box";
import MonthPicker from "react-native-month-year-picker";
import { Platform } from "react-native";
import useKeyboard from "../../hooks/useKeyboard";
import { api } from "../../redux/api";
import { popNavigation } from "../../utils/navigationService";
import Toast from "react-native-toast-message";
import { isValidURL } from "../../utils/isValidLink";

const Certifications = props => {
  const handleButtonPress = props?.handleButtonPress;
  const user = useAppSelector(state => state.user);
  const {manualCertificates = [], careerTasterCertificates=[]} = user?.allCertificates;
  const [updateCertificates, {data, isSuccess, isLoading}] = api.useUpdateCertificatesMutation();
  const [certificatesData, setCertificatesData] = useState(
    manualCertificates?.length > 0
      ? [...manualCertificates]
      : [
          {
            name: "",
            organisation: "",
            issueDate: "",
            expirationDate: "",
            noExpiration: false,
            certificateLink: "",
          },
        ],
  );

  const handleSubmit=()=>{
    let canSubmit = -1;
    for(let i=0; i<certificatesData?.length; i++){
      if(!certificatesData[i]?.name?.length || !certificatesData[i]?.organisation.length || !certificatesData[i]?.issueDate.length || !certificatesData[i]?.certificateLink?.length){
        canSubmit=i;
        break;
      }
      else if(!(certificatesData[i]?.noExpiration || certificatesData[i]?.expirationDate?.length)){
        canSubmit=i;
        break;
      }
    }
    if(canSubmit >= 0){
      Toast.show({
        type: 'error',
        text1: 'Missing',
        text2: `Details missing in Certificate ${canSubmit+1+careerTasterCertificates?.length}`,
    });
    }
    canSubmit<0 && updateCertificates({
      user_id: user?.user_id,
      certificates: certificatesData
    })
  }

  useEffect(()=>{
    if(isSuccess){
      popNavigation();
    }
  },[isSuccess])

  const onPressAddOther = () => {
    setCertificatesData([
      ...certificatesData,
      {
        name: "",
        organisation: "",
        issueDate: "",
        expirationDate: "",
        noExpiration: false,
        certificateLink: "",
      },
    ]);
  };

  const [date, setDate] = useState(new Date());
  const [showIssueDate, setShowIssueDate] = useState(false);
  const [showExpirationDate, setShowExpirationDate] = useState(false);
  const initalObject = { index: null, type: null };
  const [dateObjects, setdateObjects] = useState(initalObject);

  const handleOpenDatePicker = ({ type, index }) => {
    setdateObjects({ type, index });
    type === "start" ? setShowIssueDate(true) : setShowExpirationDate(true);
  };

  const deleteCertificate = index => {
    const updatedCertificate = certificatesData;
    updatedCertificate?.splice(index, 1);
    setCertificatesData([...updatedCertificate]);
  };

  const updateData = (val, key, index) => {
    setCertificatesData(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      updatedData[key] = val;
      if (val === true && key === "noExpiration") {
        updatedData["expirationDate"] = "";
      }
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const onValueChange = (event, newDate) => {
    setShowIssueDate(false);
    setShowExpirationDate(false);

    if (event == "dateSetAction") {
      const selectedDate = newDate || date;

      if (dateObjects.type == "start") {
        updateData(
          selectedDate.toDateString(),
          "issueDate",
          dateObjects?.index,
        );
      }

      if (dateObjects.type == "end") {
        updateData(
          selectedDate.toDateString(),
          "expirationDate",
          dateObjects?.index,
        );
      }
    } else {
      setdateObjects(initalObject);
    }
  };

  const { keyboardOpen } = useKeyboard();

  return (
    <View f={1} ph={24}>
      {showIssueDate && (
        <MonthPicker
          onChange={(event, newDate) => onValueChange(event, newDate)}
          mode="full"
          value={date}
          maximumDate={new Date()}
        />
      )}
      {showExpirationDate && (
        <MonthPicker
          onChange={(event, newDate) => onValueChange(event, newDate)}
          mode="full"
          value={date}
          //   maximumDate={new Date()}
        />
      )}
      <KeyboardAvoidingView
        f={1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          f={1}
          contentContainerStyle={{
            paddingBottom: Platform?.OS === "ios" && keyboardOpen ? 80 : 120,
            flexGrow: 1,
          }}>
            {careerTasterCertificates?.map((item, index) => {
            return (
              <>
                <View mt={24}>
                  <View mb={8} fd="row" jc="space-between">
                    <Text ftsz={15} weight="600">
                      Certificate {index + 1}
                    </Text>
                  </View>
                  <Text ftsz={15} weight="500" c={"#141418"}>
                    Name*
                  </Text>
                  <TextInput
                    value={item?.name}
                    editable={false}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    onTe
                    placeholder={
                      "Ex. Project Management Professional Certificate"
                    }
                    placeholderTextColor={"#7F8A8E"}
                  />
                  <Text mt={16} ftsz={15} weight="500" c={"#141418"}>
                    Issuing Organisation*
                  </Text>
                  <TextInput
                    value={item?.organisation}
                    editable={false}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    placeholder={"Ex. Microsoft"}
                    placeholderTextColor={"#7F8A8E"}
                  />
                  <View mt={16} fd="row">
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Issue date*
                      </Text>
                      <TouchableOpacity disabled={true}>
                        <View
                          ai="center"
                          fd="row"
                          gap={8}
                          asf="baseline"
                          bbw={1}
                          bc={"#7F8A8E"}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={
                              item?.issueDate?.length > 0 ? "#000" : "#7F8A8E"
                            }>
                            {item?.issueDate?.length > 0
                              ? new Date(item?.issueDate)?.getMonth() + 1
                              : "MM"}
                          </Text>
                          <Text>/</Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={
                              item?.issueDate?.length > 0 ? "#000" : "#7F8A8E"
                            }>
                            {item?.issueDate?.length > 0
                              ? new Date(item?.issueDate)?.getFullYear()
                              : "YYYY"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View f={1}>
                      <Text
                        ftsz={15}
                        weight="500"
                        c={item?.noExpiration ? "#7F8A8E" : "#141418"}>
                        Expiration date*
                      </Text>
                      <TouchableOpacity
                        disabled={true}>
                        <View
                          ai="center"
                          fd="row"
                          gap={8}
                          asf="baseline"
                          bbw={1}
                          bc={"#7F8A8E"}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={
                              item?.noExpiration ||
                              !item?.expirationDate?.length
                                ? "#7F8A8E"
                                : "#000"
                            }>
                            {item?.expirationDate?.length
                              ? new Date(item?.expirationDate)?.getMonth() + 1
                              : "MM"}
                          </Text>
                          <Text c={item?.noExpiration ? "#7F8A8E" : "#000"}>
                            /
                          </Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={
                              item?.noExpiration ||
                              !item?.expirationDate?.length
                                ? "#7F8A8E"
                                : "#000"
                            }>
                            {item?.expirationDate?.length
                              ? new Date(item?.expirationDate)?.getFullYear()
                              : "YYYY"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View mt={16} fd="row" ai="center">
                    <CheckBox
                      style={{}}
                      isChecked={item?.noExpiration}
                    />
                    <Text ftsz={12} weight="400" ml={8}>
                      There is no expiration
                    </Text>
                  </View>
                  <Text mt={16} ftsz={15} weight="500" c={"#141418"}>
                    Add certificate link*
                  </Text>
                  <TextInput
                    value={item?.certificateLink}
                    editable={false}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    placeholder={"Add the unique link to your certificate"}
                    placeholderTextColor={"#7F8A8E"}
                  />
                </View>
              </>
            );
          })}
          {certificatesData?.map((item, index) => {
            return (
              <>
                <View mt={24}>
                  <View mb={8} fd="row" jc="space-between">
                    <Text ftsz={15} weight="600">
                      Certificate {index + 1 + careerTasterCertificates?.length}
                    </Text>
                    {certificatesData?.length > 1 && (
                      <TouchableOpacity
                        br={8}
                        pv={4}
                        ph={12}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        onPress={() => {
                          //   clearSchool();
                          deleteCertificate(index);
                        }}>
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text ftsz={15} weight="500" c={"#141418"}>
                    Name*
                  </Text>
                  <TextInput
                    value={item?.name}
                    onChangeText={e => {
                      updateData(e, "name", index);
                    }}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    onTe
                    placeholder={
                      "Ex. Project Management Professional Certificate"
                    }
                    placeholderTextColor={"#7F8A8E"}
                  />
                  <Text mt={16} ftsz={15} weight="500" c={"#141418"}>
                    Issuing Organisation*
                  </Text>
                  <TextInput
                    value={item?.organisation}
                    onChangeText={e => {
                      updateData(e, "organisation", index);
                    }}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    placeholder={"Ex. Microsoft"}
                    placeholderTextColor={"#7F8A8E"}
                  />
                  <View mt={16} fd="row">
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Issue date*
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleOpenDatePicker({ type: "start", index })
                        }>
                        <View
                          ai="center"
                          fd="row"
                          gap={8}
                          asf="baseline"
                          bbw={1}
                          bc={"#7F8A8E"}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={
                              item?.issueDate?.length > 0 ? "#000" : "#7F8A8E"
                            }>
                            {item?.issueDate?.length > 0
                              ? new Date(item?.issueDate)?.getMonth() + 1
                              : "MM"}
                          </Text>
                          <Text>/</Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={
                              item?.issueDate?.length > 0 ? "#000" : "#7F8A8E"
                            }>
                            {item?.issueDate?.length > 0
                              ? new Date(item?.issueDate)?.getFullYear()
                              : "YYYY"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View f={1}>
                      <Text
                        ftsz={15}
                        weight="500"
                        c={item?.noExpiration ? "#7F8A8E" : "#141418"}>
                        Expiration date*
                      </Text>
                      <TouchableOpacity
                        disabled={item?.noExpiration}
                        onPress={() =>
                          handleOpenDatePicker({ type: "end", index })
                        }>
                        <View
                          ai="center"
                          fd="row"
                          gap={8}
                          asf="baseline"
                          bbw={1}
                          bc={"#7F8A8E"}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={
                              item?.noExpiration ||
                              !item?.expirationDate?.length
                                ? "#7F8A8E"
                                : "#000"
                            }>
                            {item?.expirationDate?.length
                              ? new Date(item?.expirationDate)?.getMonth() + 1
                              : "MM"}
                          </Text>
                          <Text c={item?.noExpiration ? "#7F8A8E" : "#000"}>
                            /
                          </Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={
                              item?.noExpiration ||
                              !item?.expirationDate?.length
                                ? "#7F8A8E"
                                : "#000"
                            }>
                            {item?.expirationDate?.length
                              ? new Date(item?.expirationDate)?.getFullYear()
                              : "YYYY"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View mt={16} fd="row" ai="center">
                    <CheckBox
                      style={{}}
                      onClick={() => {
                        updateData(!item?.noExpiration, "noExpiration", index);
                      }}
                      isChecked={item?.noExpiration}
                    />
                    <Text ftsz={12} weight="400" ml={8}>
                      There is no expiration
                    </Text>
                  </View>
                  <Text mt={16} ftsz={15} weight="500" c={"#141418"}>
                    Add certificate link*
                  </Text>
                  <TextInput
                    value={item?.certificateLink}
                    onChangeText={e => {
                      updateData(e, "certificateLink", index);
                    }}
                    ftsz={13}
                    weight={"400"}
                    p={0}
                    bbw={1}
                    bc={"#7F8A8E"}
                    placeholder={"https://mapout.com"}
                    placeholderTextColor={"#7F8A8E"}
                  />
                </View>
                {index + 1 === certificatesData?.length && (
                  <TouchableOpacity
                    onPress={onPressAddOther}
                    bgc={"rgba(216, 227, 252, 0.45)"}
                    mt={24}
                    br={16}
                    pv={16}
                    ai="center"
                    jc="center">
                    <Text ftsz={12} weight="500">
                      + Add Other
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={handleSubmit} ai="center" jc="center" bgc={"#000"} pv={12} br={12}>
          {isLoading ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ftsz={14} weight="500" c={"#FFF"}>
            Submit
          </Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Certifications;
