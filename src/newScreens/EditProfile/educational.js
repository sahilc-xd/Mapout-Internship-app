import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { SearchInput, SelectInput, Text, TextInput } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import CheckBox from "react-native-check-box";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import { api } from "../../redux/api";
import { isDateValid, isDateValidMY } from "../../utils/isEmailValid";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MonthPicker from 'react-native-month-year-picker'
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const EducationalDetails = props => {
  const handleButtonPress = props?.handleButtonPress;
  const user = useAppSelector(state => state.user);
  const educationDetails = user?.educationDetails;
  const [inputError, setInputError] = useState(false);
  const educationData =
    educationDetails?.map(item => {
      const sDate = new Date(item?.start_date);
      const eDate = item?.still_pursuing ? false : new Date(item?.end_date);
      const sMonth = sDate.getMonth() + 1;
      const sYear = sDate.getFullYear();
      const eMonth = item?.still_pursuing ? "" : eDate?.getMonth() + 1;
      const eYear = item?.still_pursuing ? "" : eDate?.getFullYear();
      return {
        college: item?.college,
        specialisation: item?.specialisation,
        degree: item?.degree,
        marks_format: item?.marks_format,
        marks: item?.marks,
        still_pursuing: item?.still_pursuing,
        professors_studied_under: [...item?.professors_studied_under],
        subjects: [...item?.subjects],
        startDateMonth: `${sMonth}`,
        startDateYear: `${sYear}`,
        endDateMonth: `${eMonth}`,
        endDateYear: `${eYear}`,
      };
    }) || false;
  const [school, setSchool] = useState(
    educationData?.length > 0
      ? [...educationData]
      : [
          {
            college: "",
            specialisation: "",
            degree: "",
            marks_format: "",
            marks: "",
            startDateMonth: "",
            startDateYear: "",
            endDateMonth: "",
            endDateYear: "",
            still_pursuing: 0,
            professors_studied_under: ["", ""],
            subjects: ["", "", ""],
          },
        ],
  );

  const [searchDegree, setSearchDegree] = useState("");
  const [searchCollege, setSearchCollege] = useState("");
  const [searchSpecialisation, setSearchSpecialisation] = useState("");
  const debouncedSearchDegree = useDebounce(searchDegree, 300);
  const debouncedSearchCollege = useDebounce(searchCollege, 300);
  const debouncedSearchSpecialisation = useDebounce(searchSpecialisation, 300);
  const [collegeDataList, setCollegeDataList] = useState([]);
  const {
    data: collegeList,
    page: collegeListPage,
    onReachedEnd: onReachedCollegeEnd,
    loadingMoreData: loadMoreCollegeData,
  } = usePagination(debouncedSearchCollege, collegeDataList);
  const { data: collegeData, isLoading: isLoadingCollege } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedSearchCollege,
      type: "college",
      page: collegeListPage,
    });
  const [degreeDataList, setDegreeDataList] = useState([]);
  const {
    data: degreeList,
    page: degreeListPage,
    onReachedEnd: onReachedDegreeEnd,
    loadingMoreData: loadMoreDegreeData,
  } = usePagination(debouncedSearchDegree, degreeDataList);
  const { data: degreeData, isLoading: isLoadingDegree } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedSearchDegree,
      type: "degree",
      page: degreeListPage,
    });
  const [specialisationDataList, setSpecialisationDataList] = useState([]);
  const {
    data: specialisationList,
    page: specialisationListPage,
    onReachedEnd: onReachedSpecialisationEnd,
    loadingMoreData: loadMoreSpecialisationData,
  } = usePagination(debouncedSearchSpecialisation, specialisationDataList);
  const { data: specialisationData, isLoading: isLoadingSpecialisation } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedSearchSpecialisation,
      type: "specialisation",
      page: specialisationListPage,
    });
  const [saveProfile, { data, isSuccess, isLoading, isError, error }] =
    api.useSaveProfileWorkExperienceMutation();
  const [refreshScore, {}] = api.useRefreshScoreMutation();

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const initalObject = { index : null , type : null} 
  const [dateObjects, setdateObjects] = useState(initalObject)

  const onValueChange = (event, newDate) => {
    setShow(false);
    setInputError(false);

    if (event == "dateSetAction") {
      const selectedDate = newDate || date;

      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      if (dateObjects.type == "start") {
        updateData(month, "startDateMonth", dateObjects.index);
        updateData(year, "startDateYear", dateObjects.index);
      }

      if (dateObjects.type == "end") {
        updateData(month, "endDateMonth", dateObjects.index);
        updateData(year, "endDateYear", dateObjects.index);
      }
      
    } else {
      setdateObjects(initalObject);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refreshScore({ user_id: user?.user_id });
      logAnalyticsEvents('completed_education_profile', {});
      handleButtonPress();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (collegeData?.data?.length > 0) {
      setCollegeDataList([...collegeData?.data]);
    } else {
      setCollegeDataList([]);
    }
  }, [collegeData]);

  useEffect(() => {
    if (degreeData?.data?.length > 0) {
      setDegreeDataList([...degreeData?.data]);
    } else {
      setDegreeDataList([]);
    }
  }, [degreeData]);

  useEffect(() => {
    if (specialisationData?.data?.length > 0) {
      setSpecialisationDataList([...specialisationData?.data]);
    } else {
      setSpecialisationDataList([]);
    }
  }, [specialisationData]);

  const deleteSchool = index => {
    setSchool(prv => {
      let data = [...prv];
      data.splice(index, 1);
      return [...data];
    });
  };

  const AddSchool = () => {
    setSchool(prv => {
      let data = [...prv];
      data.push({
        college: "",
        specialisation: "",
        degree: "",
        marks_format: "",
        marks: "",
        startDateMonth: "",
        startDateYear: "",
        endDateMonth: "",
        endDateYear: "",
        still_pursuing: 0,
        professors_studied_under: ["", ""],
        subjects: ["", "", ""],
      });
      return data;
    });
  };

  const clearSchool = () => {
    setSchool([
      {
        college: "",
        specialisation: "",
        degree: "",
        marks_format: "",
        marks: "",
        startDateMonth: "",
        startDateYear: "",
        endDateMonth: "",
        endDateYear: "",
        still_pursuing: 0,
        professors_studied_under: ["", ""],
        subjects: ["", "", ""],
      },
    ]);
  };

  const updateProfessrorOrSubject = (val, key, index, innerIndex) => {
    setSchool(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      let updatedKey = [...updatedData?.[key]];
      updatedKey[innerIndex] = val;
      updatedData[key] = [...updatedKey];
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const updateData = (val, key, index) => {
    setSchool(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      updatedData[key] = val;
      if (val === true && key === "still_pursuing") {
        (updatedData["endDateMonth"] = ""), (updatedData["endDateYear"] = "");
      }
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const validateData = () => {
    let key = false;
    let msg = false
    const validArr = school?.map((item , index) => {
      if (item?.college?.length === 0) {
        if (!key) {
          key = "college";
        }
        return false;
      }
      if (item?.specialisation?.length === 0) {
        if (!key) {
          key = "specialisation";
        }
        return false;
      }
      if (item?.degree?.length === 0) {
        if (!key) {
          key = "degree";
        }
        return false;
      }
      if (item?.still_pursuing) {
        if (
          !isDateValidMY(`${item?.startDateMonth}/${item?.startDateYear}`) ||
          parseInt(item?.startDateMonth) > 12 ||
          parseInt(item?.startDateMonth) < 1 ||
          parseInt(item?.startDateYear) < 1
        ) {
          if (!key) {
            key = "startDate";
          }
          return false;
        }
      } else {
        if (
          !isDateValidMY(`${item?.startDateMonth}/${item?.startDateYear}`) ||
          parseInt(item?.startDateMonth) > 12 ||
          parseInt(item?.startDateMonth) < 1 ||
          parseInt(item?.startDateYear) < 1
        ) {
          if (!key) {
            key = "startDate";
          }
          return false;
        }
        if (
          parseInt(item?.endDateMonth) > 12 ||
          parseInt(item?.endDateMonth) < 1 ||
          parseInt(item?.endDateYear) < 1 ||
          !isDateValidMY(`${item?.endDateMonth}/${item?.endDateYear}`)
        ) {
          if (!key) {
            key = "endDate";
          }
          return false;
        }
        if(new Date(`${item?.endDateYear}-${item?.endDateMonth}-31`) < new Date(`${item?.startDateYear}-${item?.startDateMonth}-31`)) {
          if (!key) {
            key = "endDate";
          }
          if(!msg) {  
            msg = "End Date should be greater than Start Date"
          }
          return false;

        }
      }
      return true;
    });
    if (validArr?.includes(false)) {
      const index = validArr?.indexOf(false);
      setInputError({
        key: key,
        index: index,
        errorMsg: msg ? msg : "Missing",
      });
      return false;
    }
    return true;
  };

  const onPressSave = () => {
    const valid = validateData();
    if (valid) {
      const data = school?.map(item => {
        let sMonth = parseInt(item?.startDateMonth);
        let sYear = parseInt(item?.startDateYear);
        let day = 1;
        let dateString = `${sYear}-${sMonth}-${day}`;
        let dateObject = new Date(dateString);
        let end_date = false;
        if (!item?.still_pursuing) {
          let eMonth = parseInt(item?.endDateMonth);
          let eYear = parseInt(item?.endDateYear);
          let day = 1;
          let eDateString = `${eYear}-${eMonth}-${day}`;
          let eDateObject = new Date(eDateString);
          end_date = eDateObject?.toDateString();
        }
        return {
          college: item?.college,
          specialisation: item?.specialisation,
          degree: item?.degree,
          marks_format: item?.marks_format,
          marks: item?.marks,
          still_pursuing: item?.still_pursuing,
          professors_studied_under: [...item?.professors_studied_under],
          subjects: [...item?.subjects],
          start_date: dateObject.toDateString(),
          end_date: item?.still_pursuing ? false : end_date,
        };
      });
      saveProfile({
        user_id: user?.user_id,
        education: [...data],
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Missing field",
        text2: "Please fill all the requires fields.",
      });
    }
  };


  const handleOpenDatePicker = ({type , index}) => {
    setdateObjects({type , index})
    setShow(true);
  };


  const isDataLoading =
    isLoadingCollege || isLoadingDegree || isLoadingSpecialisation;

  return isDataLoading ? (
    <View f={1} ai="center" jc="center">
      <ActivityIndicator size={"large"} color={"#000"} />
    </View>
  ) : (
    <>
      <View f={1}>
      {show && (
                      <MonthPicker
                        onChange={onValueChange}
                        mode="full"
                        value={date}
                        maximumDate={new Date()}
                      />
                    )}
      <KeyboardAwareScrollView
              style={{flex:1, paddingTop:16}}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}>
            {school?.map((item, index) => {
              return (
                <View mt={index === 0 ? 16 : 48} mh={24}>
                  <View fd="row" jc="space-between">
                    <Text ftsz={15} weight="600">
                      School/College {index + 1}
                    </Text>
                    {school?.length > 1 && (
                      <TouchableOpacity
                        br={8}
                        pv={4}
                        ph={12}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        onPress={() => {
                          deleteSchool(index);
                        }}>
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    )}
                    {school?.length == 1 && (
                      <TouchableOpacity
                        br={8}
                        pv={4}
                        ph={12}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        onPress={() => {
                          clearSchool();
                        }}>
                        <Text>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Name of the institution*
                    </Text>
                    <SelectInput
                      selectedOptions={item?.college}
                      onSearch={setSearchCollege}
                      searchPlaceholder="Search college"
                      onReachEnd={onReachedCollegeEnd}
                      onReachEndThreshold={0.5}
                      loadingMoreData={loadMoreCollegeData}
                      onSelect={val => {
                        updateData(val, "college", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "college" &&
                          setInputError(false);
                      }}
                      options={[...collegeList?.map(val => val.name)]}
                      label="Institution*"
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
                            c={item?.college?.length ? "#000" : "#7F8A8E"}
                            pb={4}>
                            {item?.college?.length
                              ? item?.college
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
                      inputError?.index === index &&
                      inputError?.key === "college" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Specialization*
                    </Text>
                    <SelectInput
                      onSearch={setSearchSpecialisation}
                      searchPlaceholder="Search specialization"
                      onReachEnd={onReachedSpecialisationEnd}
                      onReachEndThreshold={0.5}
                      selectedOptions={item?.specialisation}
                      loadingMoreData={loadMoreSpecialisationData}
                      onSelect={val => {
                        updateData(val, "specialisation", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "specialisation" &&
                          setInputError(false);
                      }}
                      options={[...specialisationList?.map(val => val.name)]}
                      label="Specialization*"
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
                            c={
                              item?.specialisation?.length ? "#000" : "#7F8A8E"
                            }
                            pb={4}>
                            {item?.specialisation?.length
                              ? item?.specialisation
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
                      inputError?.index === index &&
                      inputError?.key === "specialisation" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Degree / Diploma Name*
                    </Text>
                    <SelectInput
                      onSearch={setSearchDegree}
                      searchPlaceholder="Search degree/diploma"
                      onReachEnd={onReachedDegreeEnd}
                      onReachEndThreshold={0.5}
                      loadingMoreData={loadMoreDegreeData}
                      onSelect={val => {
                        updateData(val, "degree", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "degree" &&
                          setInputError(false);
                      }}
                      options={[...degreeList?.map(val => val.name)]}
                      label="Degree/Diploma*"
                      selectedOptions={item?.degree}
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
                            c={item?.degree?.length ? "#000" : "#7F8A8E"}
                            pb={4}>
                            {item?.degree?.length
                              ? item?.degree
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
                      inputError?.index === index &&
                      inputError?.key === "degree" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24} fd="row" gap={16} ai="flex-end">
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Aggregate Score
                      </Text>
                      <SelectInput
                        snapPoints={["50%"]}
                        onSelect={val => {
                          updateData(val, "marks_format", index);
                        }}
                        selectedOptions={item?.marks_format}
                        options={["GPA", "Grade", "Percentage"]}
                        label="Score type"
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
                              c={
                                item?.marks_format?.length ? "#000" : "#7F8A8E"
                              }
                              pb={4}>
                              {item?.marks_format?.length
                                ? item?.marks_format
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
                      <View f={1}>
                        <TextInput
                          keyboardType={
                            item?.marks_format === "Grade" ? "default" : "numeric"
                          }
                          value={item?.marks}
                           onChangeText={text => {
                             
                            if (item?.marks_format === "Percentage" && text.length > 2) {
                              return;
                            }
                            
                            
                            if (item?.marks_format === "GPA") {
                              if (parseFloat(text) > 9.9) {
                                return;
                              }
                              
                              const formattedText = text.match(/^\d*\.?\d{0,1}/)[0];
                              updateData(formattedText, "marks", index);
                              return;
                            }

       
                            if (item?.marks_format === "Grade") {
                              const formattedText = text.match(/^[A-Za-z]\+?$/);
                              if (formattedText) {
                                updateData(formattedText[0], "marks", index);
                              } else {
                                updateData('', "marks", index); 
                              }
                              return;
                            }

                              updateData(text, "marks", index);
                                  }}
                          editable={!!item?.marks_format}
                          bc={"#7F8A8E"}
                          style={{
                            fontSize: 14,
                            fontWeight: "400",
                            
                          }}
                          p={0}
                          m={0}
                          ph={8}
                          placeholder="Type here"
                          placeholderTextColor={"#7F8A8E"}
                          bbw={1}
                          c={"#000"}
                          maxLength={item?.marks_format === "Percentage" ? 2 : undefined}
                        />
                      </View>
                  </View>

                  <View mt={24} fd="row">
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Start date*
                      </Text>
                      <TouchableOpacity onPress={() => handleOpenDatePicker({ type : "start", index})} >
                      <View ai="center" mt={12} fd="row" gap={8} asf="baseline" bbw={1} bc={'#7F8A8E'}>
                        <Text                          
                          style={{ fontSize: 14, fontWeight: "400" }}
                          p={0}
                          m={0}
                          pl={4}
                          c={item?.startDateMonth ? "#000" : "#7F8A8E"}>{item?.startDateMonth ? item?.startDateMonth : "MM"}</Text>
                        <Text>/</Text>
                        <Text
                         style={{ fontSize: 14, fontWeight: "400" }}
                         p={0}
                         m={0}
                         pr={4}
                         c={item?.startDateYear ? "#000" : "#7F8A8E"}
                        >{item?.startDateYear ? item?.startDateYear : "YYYY"}</Text>
                      </View>
                      </TouchableOpacity>
                      {inputError &&
                        inputError?.index === index &&
                        inputError?.key === "startDate" && (
                          <Text ftsz={12} weight="500" c={"red"}>
                            {inputError?.errorMsg}
                          </Text>
                        )}
                    </View>
                    <View f={1}>
                      <Text
                        ftsz={15}
                        weight="500"
                        c={item?.still_pursuing ? "#7F8A8E" : "#141418"}>
                        End date*
                      </Text>
                      <TouchableOpacity onPress={() =>  !item?.still_pursuing && handleOpenDatePicker({ type : "end", index})} >
                      <View ai="center" mt={12} fd="row" gap={8} asf="baseline" bbw={1} bc={'#7F8A8E'}>
                        <Text
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        pl={4}
                        c={(item?.still_pursuing || !item?.endDateMonth) ? "#7F8A8E" : "#000"}
                        >{item?.endDateMonth ? item?.endDateMonth : "MM"}</Text>
                        <Text c={item?.still_pursuing ? "#7F8A8E" : "#000"} >/</Text>
                        <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={(item?.still_pursuing || !item?.endDateYear ) ? "#7F8A8E" : "#000"}
                        >{item?.endDateYear ? item?.endDateYear : "YYYY"}</Text>
                      </View> 
                      </TouchableOpacity>
                      {inputError &&
                        inputError?.index === index &&
                        inputError?.key === "endDate" && (
                          <Text ftsz={12} weight="500" c={"red"}>
                            {inputError?.errorMsg}
                          </Text>
                        )}
                    </View>
                  </View>
                  <View mt={24} fd="row" ai="center">
                    <CheckBox
                      style={{}}
                      onClick={() => {
                        if(!item?.still_pursuing){
                          inputError &&
                        inputError?.index === index &&
                        inputError?.key === "endDate" && setInputError(false);
                        }
                        updateData(
                          !item?.still_pursuing,
                          "still_pursuing",
                          index,
                        );
                      }}
                      isChecked={item?.still_pursuing}
                    />
                    <Text ftsz={12} weight="400" ml={8}>
                      I’m still pursuing this
                    </Text>
                  </View>
                  <View mt={24}>
                    <Text ftsz={13} weight="500">
                      Top 2 Notable professors I studied under
                    </Text>
                    <View mv={8} fd="row" bbw={1} bc={"#7F8A8E"} ai="center">
                      <Text c={"#7F8A8E"} ftsz={12} weight="400">
                        1.
                      </Text>
                      <TextInput
                        f={1}
                        value={item?.professors_studied_under?.[0]}
                        onChangeText={text => {
                          updateProfessrorOrSubject(
                            text,
                            "professors_studied_under",
                            index,
                            0,
                          );
                        }}
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        ph={8}
                        placeholder="Type here"
                        placeholderTextColor={"#7F8A8E"}
                        c={"#000"}
                      />
                    </View>
                    <View mv={4} fd="row" bbw={1} bc={"#7F8A8E"} ai="center">
                      <Text c={"#7F8A8E"} ftsz={12} weight="400">
                        2.
                      </Text>
                      <TextInput
                        f={1}
                        value={item?.professors_studied_under?.[1]}
                        onChangeText={text => {
                          updateProfessrorOrSubject(
                            text,
                            "professors_studied_under",
                            index,
                            1,
                          );
                        }}
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        ph={8}
                        placeholder="Type here"
                        placeholderTextColor={"#7F8A8E"}
                        c={"#000"}
                      />
                    </View>
                  </View>
                  <View mt={24}>
                    <Text ftsz={13} weight="500">
                      My top 3 subjects/modules studied
                    </Text>
                    <View mv={8} fd="row" bbw={1} bc={"#7F8A8E"} ai="center">
                      <Text c={"#7F8A8E"} ftsz={14} weight="400">
                        1.
                      </Text>
                      <TextInput
                        f={1}
                        value={item?.subjects?.[0]}
                        onChangeText={text => {
                          updateProfessrorOrSubject(text, "subjects", index, 0);
                        }}
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        ph={8}
                        placeholder="Type here"
                        placeholderTextColor={"#7F8A8E"}
                        c={"#000"}
                      />
                    </View>
                    <View mv={4} fd="row" bbw={1} bc={"#7F8A8E"} ai="center">
                      <Text c={"#7F8A8E"} ftsz={14} weight="400">
                        2.
                      </Text>
                      <TextInput
                        f={1}
                        value={item?.subjects?.[1]}
                        onChangeText={text => {
                          updateProfessrorOrSubject(text, "subjects", index, 1);
                        }}
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        ph={8}
                        placeholder="Type here"
                        placeholderTextColor={"#7F8A8E"}
                        c={"#000"}
                      />
                    </View>
                    <View mv={4} fd="row" bbw={1} bc={"#7F8A8E"} ai="center">
                      <Text c={"#7F8A8E"} ftsz={14} weight="400">
                        3.
                      </Text>
                      <TextInput
                        f={1}
                        value={item?.subjects?.[2]}
                        onChangeText={text => {
                          updateProfessrorOrSubject(text, "subjects", index, 2);
                        }}
                        style={{ fontSize: 14, fontWeight: "400" }}
                        p={0}
                        m={0}
                        ph={8}
                        placeholder="Type here"
                        placeholderTextColor={"#7F8A8E"}
                        c={"#000"}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              onPress={AddSchool}
              bgc={"rgba(216, 227, 252, 0.45)"}
              jc="center"
              ai="center"
              pv={16}
              br={12}
              mh={24}
              mt={24}>
              <Text ftsz={12} weight="500">
                + Add School/College
              </Text>
            </TouchableOpacity>
            <View h={100} />
        </KeyboardAwareScrollView>
      </View>
      {!show && <TouchableOpacity
        onPress={onPressSave}
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
          <Text ftsz={12} weight="500" c={"#FFF"}>
            Save & Next
          </Text>
        )}
      </TouchableOpacity>}
    </>
  );
};

export default EducationalDetails;
