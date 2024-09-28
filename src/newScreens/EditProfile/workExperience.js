import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { Select, SelectInput, Text, TextInput } from "../../components";
import CheckBox from "react-native-check-box";
import { api } from "../../redux/api";
import usePagination from "../../hooks/usePagination";
import { isDateValid } from "../../utils/isEmailValid";
import { useAppSelector } from "../../redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GradientBackground from "../../utils/GradientBackground";
import DatePicker from "react-native-date-picker";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const WorkExperience = props => {
  const handleButtonPress = props?.handleButtonPress;
  const user = useAppSelector(state => state.user);
  const [inputError, setInputError] = useState(false);
  const flatlistRef = useRef(null);
  const workData =
    user?.workDetails?.map(item => {
      const sDate = new Date(item?.start_date);
      const eDate = item?.still_pursuing ? false : new Date(item?.end_date);
      const sDay = `${sDate.getDate()}`;
      const sMonth = `${sDate.getMonth() + 1}`;
      const sYear = `${sDate.getFullYear()}`;
      const eDay = item?.still_pursuing ? "" : `${eDate?.getDate()}`;
      const eMonth = item?.still_pursuing ? "" : `${eDate?.getMonth() + 1}`;
      const eYear = item?.still_pursuing ? "" : `${eDate?.getFullYear()}`;
      return {
        role: item?.role,
        company: item?.company,
        industry: item?.industry,
        employment_type: item?.employment_type,
        responsibilities: item?.responsibilities,
        startDate: sDay,
        startDateMonth: sMonth,
        startDateYear: sYear,
        still_pursuing: item?.still_pursuing,
        endDateMonth: item?.still_pursuing ? "" : eMonth,
        endDateYear: item?.still_pursuing ? "" : eYear,
        endDate: item?.still_pursuing ? "" : eDay,
      };
    }) || false;
  const [work, setWork] = useState(
    workData?.length > 0
      ? workData
      : [
          {
            role: "",
            company: "",
            industry: "",
            employment_type: "",
            responsibilities: ["", "", ""],
            startDate: "",
            startDateMonth: "",
            startDateYear: "",
            endDateMonth: "",
            endDateYear: "",
            endDate: "",
            still_pursuing: false,
          },
        ],
  );

  const [searchIndustry, setSearchIndustry] = useState("");
  const debouncedSearchIndustry = useDebounce(searchIndustry, 300);
  const [industryDataList, setIndustryDataList] = useState([]);
  const {
    data: industryList,
    page: industryListPage,
    onReachedEnd: onReachedIndustryEnd,
    loadingMoreData: loadMoreIndustryData,
  } = usePagination(debouncedSearchIndustry, industryDataList);
  const { data: industryData, isLoading: isLoadingIndustry } =
    api.useGetEducationWorkDetailsQuery({
      search: debouncedSearchIndustry,
      type: "industries",
      page: industryListPage,
    });
  const [saveProfile, { data, isSuccess, isLoading, isError, error }] =
    api.useSaveProfileWorkExperienceMutation();
  const [refreshScore, {}] = api.useRefreshScoreMutation();

  const [jobResponsibilitySuggestions, {isSuccess : isJobResponsibilitySuccess , isError : isJobResponsibilityError , isFetching , data : jobResponsibilities , isLoading: isLoadingJobResponsibilities }] = api.useLazyJobResponsibilitiesQuery();
  const [rephraseResponsibilities, {isSuccess : isRephraseResponsibilitySuccess , isError : isRephraseResponsibilityError , isFetching : isRephraseResponsibilityFetching , data : rephraseResponsibilitiesData , isLoading: isLoadingRephraseResponsibilities }] = api.useLazyRephraseResponsibilitiesQuery();
  const [jobResponsibilitiesItems, setjobResponsibilitiesItems] = useState([])
  const [rephrasedResponsibilitiesItems, setrephrasedResponsibilitiesItems] = useState([])
  const [isCheckedJobResponsibility, setIsCheckedJobResponsibility] = useState([])
  const [jobIndex, setjobIndex] = useState(null)
  const [rephraseIndex, setRephraseIndex] = useState(null)


  const [open, setOpen] = useState(false);
  const initialDateObjects = { type: null, index: null };
  const [dateObjects, setDateObjects] = useState(initialDateObjects);


  const handleJobOnBlur = index => {
    const jobTitle = work[index]?.role;
    setjobIndex(index)
    if (jobTitle) {
      jobResponsibilitySuggestions({ jobTitle });
    }
  };

  const handleResponsibilitiesBlur = (index)   => {
    const joinedResponsibilities = work[index]?.responsibilities?.filter(item => item !== ".").join(",");
    setRephraseIndex(index)
    if(joinedResponsibilities){
      rephraseResponsibilities({text : joinedResponsibilities});
    }
  }

  useEffect(() => {
    if(isRephraseResponsibilitySuccess){
      setrephrasedResponsibilitiesItems([...rephraseResponsibilitiesData?.data?.rephrased_version])
    } 
  },[isRephraseResponsibilitySuccess])


  useEffect(() => {
    if (isJobResponsibilitySuccess) {
      setjobResponsibilitiesItems([...jobResponsibilities?.data.suggestions]);
    }
  }, [isJobResponsibilitySuccess , isFetching]);

  useEffect(() => {
    if (isSuccess) {
      refreshScore({ user_id: user?.user_id });
      logAnalyticsEvents('completed_work_profile', {});
      handleButtonPress();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (industryData?.data?.length > 0) {
      setIndustryDataList([...industryData?.data]);
    } else {
      setIndustryDataList([]);
    }
  }, [industryData]);

  const deleteWork = index => {
    setWork(prv => {
      let data = [...prv];
      data.splice(index, 1);
      return [...data];
    });
  };

  const clearWork = () => {
    setWork([
      {
        role: "",
        company: "",
        industry: "",
        employment_type: "",
        responsibilities: ["", "", ""],
        startDate: "",
        startDateMonth: "",
        startDateYear: "",
        endDateMonth: "",
        endDateYear: "",
        endDate: "",
        still_pursuing: false,
      },
    ]);
  };

  const addResponsibilities = index => {
    setWork(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      let updatedResponsibilties = [...updatedData?.["responsibilities"], ""];
      updatedData = {
        ...updatedData,
        responsibilities: [...updatedResponsibilties],
      };
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const AddJob = () => {
    setWork(prv => {
      let data = [...prv];
      data.push({
        role: "",
        company: "",
        industry: "",
        employment_type: "",
        responsibilities: ["", "", ""],
        startDate: "",
        startDateMonth: "",
        startDateYear: "",
        endDateMonth: "",
        endDateYear: "",
        endDate: "",
        still_pursuing: false,
      });
      return data;
    });
  };

  const updateData = (val, key, index) => {
    setWork(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      updatedData[key] = val;
      if (val === true && key === "still_pursuing") {
        (updatedData["endDate"] = ""),
          (updatedData["endDateMonth"] = ""),
          (updatedData["endDateYear"] = "");
      }
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const updateResponsibilities = (val, key, index, innerIndex) => {
    setWork(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[index] };
      let updatedResponsibilties = [...updatedData?.["responsibilities"]];
      updatedResponsibilties[innerIndex] = val;
      updatedData = {
        ...updatedData,
        responsibilities: [...updatedResponsibilties],
      };
      data.splice(index, 1);
      data.splice(index, 0, updatedData);
      return data;
    });
  };

  const validateData = () => {
    let key = false;
    let responsibilityIndex = -1;
    let msg = false
    const validArr = work?.map(item => {
      if (item?.role?.trim()?.length === 0) {
        if (!key) {
          key = "role";
        }
        return false;
      }
      if (item?.company?.trim()?.length === 0) {
        if (!key) {
          key = "company";
        }
        return false;
      }
      if (item?.employment_type?.length === 0) {
        if (!key) {
          key = "employmentType";
        }
        return false;
      }
      const validateResponsibilities = item?.responsibilities?.map(
        (respItem, index2) => {
          if (respItem?.trim().length === 0 && index2 < 3) {
            return false;
          }
        },
      );
      if (validateResponsibilities?.includes(false)) {
        if (!key) {
          key = "responsibility";
          responsibilityIndex = validateResponsibilities?.indexOf(false);
        }
        return false;
      }
      if (item?.still_pursuing) {
        if (
          !isDateValid(
            `${item?.startDate}/${item?.startDateMonth}/${item?.startDateYear}`,
          ) ||
          parseInt(item?.startDate) > 31 ||
          parseInt(item?.startDateMonth) > 12 ||
          parseInt(item?.startDate) < 1 ||
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
          !isDateValid(
            `${item?.startDate}/${item?.startDateMonth}/${item?.startDateYear}`,
          ) ||
          parseInt(item?.startDate) > 31 ||
          parseInt(item?.startDateMonth) > 12 ||
          parseInt(item?.startDate) < 1 ||
          parseInt(item?.startDateMonth) < 1 ||
          parseInt(item?.startDateYear) < 1
        ) {
          if (!key) {
            key = "startDate";
          }
          return false;
        }
        if (
          !isDateValid(
            `${item?.endDate}/${item?.endDateMonth}/${item?.endDateYear}`,
          ) ||
          parseInt(item?.endDate) > 31 ||
          parseInt(item?.endDateMonth) > 12 ||
          parseInt(item?.endDate) < 1 ||
          parseInt(item?.endDateMonth) < 1 ||
          parseInt(item?.endDateYear) < 1
        ) {
          if (!key) {
            key = "endDate";
          }
          return false;
        }
        if(new Date(`${item?.endDateYear}-${item?.endDateMonth}-${item?.endDate}`) < new Date(`${item?.startDateYear}-${item?.startDateMonth}-${item?.startDate}`)) {
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
      let index = validArr?.indexOf(false);
      setInputError({
        key: key,
        index: index,
        errorMsg:  msg ? msg : "Missing",
        subIndex: key === "responsibility" ? responsibilityIndex : -1,
      });
      flatlistRef?.current?.scrollToIndex({ animated: true, index });
      return false;
    }
    return true;
  };

  const onPressSave = () => {
    const valid = validateData();
    if (valid) {
      const data = work?.map(item => {
        let sMonth = parseInt(item?.startDateMonth);
        let sYear = parseInt(item?.startDateYear);
        let sDay = parseInt(item?.startDate);
        let dateString = `${sYear}-${sMonth}-${sDay}`;
        let dateObject = new Date(dateString);
        if (!item?.still_pursuing) {
          let eMonth = parseInt(item?.endDateMonth);
          let eYear = parseInt(item?.endDateYear);
          let eDay = parseInt(item?.endDate);
          let eDateString = `${eYear}-${eMonth}-${eDay}`;
          let eDateObject = new Date(eDateString);
          end_date = eDateObject?.toDateString();
        }
        return {
          role: item?.role,
          company: item?.company,
          industry: item?.industry,
          employment_type: item?.employment_type,
          responsibilities: item?.responsibilities,
          start_date: dateObject?.toDateString(),
          end_date: item?.still_pursuing ? false : end_date,
          still_pursuing: item?.still_pursuing,
        };
      });
      saveProfile({
        user_id: user?.user_id,
        work_details: [...data],
      });
    }
  };

  const handleCheckJobResponsibility = item => {
    const isItemChecked = isCheckedJobResponsibility.includes(item);

    if (isItemChecked) {
      setIsCheckedJobResponsibility(prevState =>
        prevState.filter(i => i !== item),
      );
    } else {
      setIsCheckedJobResponsibility(prevState => [...prevState, item]);
    }
  };

  const onPressAddResponsibilities = (index) => {
    setWork(prevState => {  
      return prevState.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            responsibilities: isCheckedJobResponsibility,
          };
        }
        return item;
      });
    });
  };

  const handleDateChanges = ({ type, index }) => {
    setOpen(true);
    setInputError(false);
    setDateObjects({ type, index });
  };

  const handleCancelDatePicker = () => {
    setDateObjects(initialDateObjects);
    setOpen(false);
  };


  const handleDatePickerConfirmed = date => {
    const selectedDate = new Date(date);
    const [day, month, year] = [
      selectedDate.getDate().toString().padStart(2, "0"),
      (selectedDate.getMonth() + 1).toString().padStart(2, "0"),
      selectedDate.getFullYear(),
    ];

    setWork(prv => {
      let data = [...prv];
      let updatedData = { ...data?.[dateObjects.index] };

      if (dateObjects.type === "start") {
        updatedData["startDate"] = day;
        updatedData["startDateMonth"] = month;
        updatedData["startDateYear"] = year;
      } else if (dateObjects.type === "end") {
        updatedData["endDate"] = day;
        updatedData["endDateMonth"] = month;
        updatedData["endDateYear"] = year;
      }
      data.splice(dateObjects.index, 1);
      data.splice(dateObjects.index, 0, updatedData);
      return data;
    });

    setOpen(false);
  };

  return isLoadingIndustry ? (
    <View f={1} ai="center" jc="center">
      <ActivityIndicator size={"large"} color={"#000"} />
    </View>
  ) : (
    <>
      <View f={1}>
        <DatePicker
          modal
          open={open}
          date={new Date()}
          mode="date"
          onConfirm={date => handleDatePickerConfirmed(date)}
          onCancel={handleCancelDatePicker}
          maximumDate={new Date()}
        />
        <KeyboardAwareScrollView
          style={{ flex: 1, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}>
          <FlatList
            ListFooterComponent={() => {
              return (
                <TouchableOpacity
                  onPress={AddJob}
                  bgc={"rgba(216, 227, 252, 0.45)"}
                  jc="center"
                  ai="center"
                  pv={16}
                  mb={16}
                  br={12}
                  mh={24}
                  mt={24}>
                  <Text ftsz={12} weight="500">
                    + Add Another Job
                  </Text>
                </TouchableOpacity>
              );
            }}
            pt={16}
            ref={flatlistRef}
            keyExtractor={(item, index) => index.toString()}
            data={[...work]}
            renderItem={({ item, index }) => {
              return (
                <View key={index?.toString()} mh={24} mt={24}>
                  <View jc="space-between" fd="row" ai="center">
                    <Text bbw={1} ftsz={16} weight="700">
                      Job {index + 1}
                    </Text>
                    {work?.length > 1 && (
                      <TouchableOpacity
                        br={8}
                        pv={4}
                        ph={12}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        onPress={() => {
                          deleteWork(index);
                        }}>
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    )}
                    {work?.length == 1 && (
                      <TouchableOpacity
                        br={8}
                        pv={4}
                        ph={12}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        onPress={() => {
                          clearWork();
                        }}>
                        <Text>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Job Title*
                    </Text>
                    <TextInput
                      value={item?.role}
                      onBlur={() => handleJobOnBlur(index)}
                      onChangeText={text => {
                        updateData(text, "role", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "role" &&
                          setInputError(false);
                      }}
                      bc={"#7F8A8E"}
                      style={{ fontSize: 14, fontWeight: "400" }}
                      p={0}
                      mt={12}
                      placeholder="Type here"
                      placeholderTextColor={"#7F8A8E"}
                      f={1}
                      bbw={1}
                      pb={4}
                      c={"#000"}
                    />
                    {inputError &&
                      inputError?.index === index &&
                      inputError?.key === "role" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Company Name*
                    </Text>
                    <TextInput
                      value={item?.company}
                      onChangeText={text => {
                        updateData(text, "company", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "company" &&
                          setInputError(false);
                      }}
                      bc={"#7F8A8E"}
                      style={{ fontSize: 14, fontWeight: "400" }}
                      p={0}
                      mt={12}
                      placeholder="Type here"
                      placeholderTextColor={"#7F8A8E"}
                      f={1}
                      bbw={1}
                      c={"#000"}
                      pb={4}
                    />
                    {inputError &&
                      inputError?.index === index &&
                      inputError?.key === "company" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Industry
                    </Text>
                    <SelectInput
                      selectedOptions={item?.industry}
                      onSearch={setSearchIndustry}
                      searchPlaceholder="Search industry"
                      onReachEnd={onReachedIndustryEnd}
                      onReachEndThreshold={0.5}
                      loadingMoreData={loadMoreIndustryData}
                      onSelect={val => {
                        updateData(val, "industry", index);
                      }}
                      options={[...industryList?.map(val => val.name)]}
                      label="Industry"
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
                            c={item?.industry?.length ? "#000" : "#7F8A8E"}
                            pb={4}>
                            {item?.industry?.length
                              ? item?.industry
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
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Employment Type*
                    </Text>
                    <SelectInput
                      selectedOptions={item?.employment_type}
                      snapPoints={["50%"]}
                      onSelect={val => {
                        updateData(val, "employment_type", index);
                        inputError &&
                          inputError?.index === index &&
                          inputError?.key === "employmentType" &&
                          setInputError(false);
                      }}
                      options={[
                        "Full-time",
                        "Part-time",
                        "Internship",
                        "Contract",
                        "Volunteer",
                      ]}
                      label="Available for*"
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
                              item?.employment_type?.length ? "#000" : "#7F8A8E"
                            }
                            pb={4}>
                            {item?.employment_type?.length
                              ? item?.employment_type
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
                      inputError?.key === "employmentType" && (
                        <Text ftsz={12} weight="500" c={"red"}>
                          {inputError?.errorMsg}
                        </Text>
                      )}
                  </View>
                  <View mt={24}>
                    <Text ftsz={15} weight="500" c={"#141418"}>
                      Responsibilities*
                    </Text>
                    <View mt={16}>
                      {item?.responsibilities?.map((item1, innerIndex) => {
                        return (
                          <>
                            <View fd="row">
                              <View
                                mr={8}
                                h={4}
                                w={4}
                                br={2}
                                mt={8}
                                bgc={"#7F8A8E"}
                              />
                              <TextInput
                                value={item1}
                                onChangeText={text => {
                                  // setFirstName(text);
                                  updateResponsibilities(
                                    text,
                                    "responsibilities",
                                    index,
                                    innerIndex,
                                  );
                                  inputError &&
                                    inputError?.index === index &&
                                    inputError?.key === "responsibility" &&
                                    inputError?.subIndex === innerIndex &&
                                    setInputError(false);
                                }}
                                // onBlur={}
                                multiline
                                style={{ fontSize: 14, fontWeight: "400" }}
                                p={0}
                                placeholder="Type bullet point here"
                                placeholderTextColor={"#7F8A8E"}
                                f={1}
                                mb={4}
                                c={"#000"}
                              />
                            </View>
                            {inputError &&
                              inputError?.index === index &&
                              inputError?.key === "responsibility" &&
                              inputError?.subIndex === innerIndex && (
                                <Text ftsz={12} weight="500" c={"red"}>
                                  {inputError?.errorMsg}
                                </Text>
                              )}
                          </>
                        );
                      })}
                    </View>
                    <View fd="row" jc="space-between">
                    {item?.responsibilities?.length < 5 && (
                      <TouchableOpacity
                        onPress={() => {
                          addResponsibilities(index);
                        }}
                        bgc={"rgba(216, 227, 252, 0.45)"}
                        asf="baseline"
                        pv={8}
                        ph={8}
                        br={8}>
                        <Text ftsz={12} weight="500">
                          + Add Other
                        </Text>
                      </TouchableOpacity>
                    )}
                    {<TouchableOpacity onPress={() => handleResponsibilitiesBlur(index)}>
                      <Text ftsz={12} weight="500" c={"#4747ff"} underline  >Rephrase with Ai</Text>
                    </TouchableOpacity>}
                    </View>
                  </View>
                  <>
                  { item?.responsibilities[index]?.length == 0 &&
                    jobIndex === index && (jobResponsibilities || isLoadingJobResponsibilities) && (
                      <View mt={8}>
                        <GradientBackground>
                          <View>
                            <Text style={styles.heading}>
                              ✨ MapOut suggestions ✨
                            </Text>
                            <View>
                              <Text style={styles.paragraph}>
                              {(isLoadingJobResponsibilities || isFetching ) ? "Generating Suggestions..." : "Here are some responsibiltiies you can add:" }
                              </Text>
                              {!isLoadingJobResponsibilities && jobResponsibilitiesItems?.map(item => {
                                return (
                                  <>
                                    <TouchableOpacity
                                      fd="row"
                                      ai="flex-start"
                                      jc="flex-start"
                                      gap={6}
                                      mt={5}
                                      style={{ maxWidth: "90%" }}
                                      >
                                      <CheckBox
                                        isChecked={isCheckedJobResponsibility?.includes(item)}
                                        onClick={() => handleCheckJobResponsibility(item)}
                                      />
                                      <Text style={styles.paragraph}>{item}</Text>
                                    </TouchableOpacity>
                                  </>
                                );
                              })}
                            </View>
                            <TouchableOpacity
                              onPress={() => onPressAddResponsibilities(index)}
                              jc="center"
                              ai="center"
                              bgc={"#000"}
                              pv={16}
                              br={12}
                              mt={24}>
                              <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                          </View>
  
                      </GradientBackground>
                    </View> )
                  }
                  </>
                  { 
                    rephraseIndex === index && (rephraseResponsibilitiesData || isLoadingRephraseResponsibilities) && <View mt={8}>
                    <GradientBackground>
                      <View>
                        <Text style={styles.heading}>
                          ✨ MapOut suggestions ✨
                        </Text>
                        <View>
                        {isLoadingRephraseResponsibilities ? (
                          <Text style={styles.paragraph}>
                            Generating Suggestions...
                          </Text>
                        ) : (
                          <View>
                            <Text style={styles.paragraph}>
                              Here’s how you can summarize all your responsibilities in the most impactful manner:
                          </Text>
                            {rephrasedResponsibilitiesItems.length > 0 &&  rephrasedResponsibilitiesItems?.map(item => {
                              return (
                                <>
                                  <TouchableOpacity
                                    fd="row"
                                    ai="flex-start"
                                    jc="flex-start"
                                    gap={6}
                                    mt={5}
                                    style={{ maxWidth: "90%" }}
                                    >
                                    <CheckBox
                                      isChecked={isCheckedJobResponsibility?.includes(item)}
                                      onClick={() => handleCheckJobResponsibility(item)}
                                    />
                                    <Text style={styles.paragraph}>{item}</Text>
                                  </TouchableOpacity>
                                </>
                              );
                            })}
                          </View>
                        )}
                        </View>
                        <TouchableOpacity
                          onPress={() => onPressAddResponsibilities(index)}
                          jc="center"
                          ai="center"
                          bgc={"#000"}
                          pv={16}
                          br={12}
                          mt={24}
                          >
                          <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </GradientBackground>
                  </View>}
                  <View mt={24} fd="row" gap={16}>
                    <View f={1}>
                      <Text ftsz={15} weight="500" c={"#141418"}>
                        Start date*
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleDateChanges({ type: "start", index })
                        }>
                        <View ai="center" mt={12} fd="row" gap={8} asf="baseline" bbw={1} bc={'#7F8A8E'}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={item?.startDate ? "#000" : "#7F8A8E"}>
                            {item?.startDate ? item?.startDate : "DD"}
                          </Text>
                          <Text>/</Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            c={item?.startDateMonth ? "#000" : "#7F8A8E"}>
                            {item?.startDateMonth ? item?.startDateMonth : "MM"}
                          </Text>
                          <Text>/</Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={item?.startDateYear ? "#000" : "#7F8A8E"}>
                            {item?.startDateYear ? item?.startDateYear : "YYYY"}
                          </Text>
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
                      <TouchableOpacity
                        onPress={() =>
                          !item?.still_pursuing &&
                          handleDateChanges({ type: "end", index })
                        }>
                        <View ai="center" mt={12} fd="row" gap={8} asf="baseline" bbw={1} bc={'#7F8A8E'}>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pl={4}
                            c={(item?.still_pursuing || !item?.endDate) ? "#7F8A8E" : "#000"}>
                            {item?.endDate ? item?.endDate : "DD"}
                          </Text>
                          <Text c={item?.still_pursuing ? "#7F8A8E" : "#000"}>
                            /
                          </Text>
                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            c={(item?.still_pursuing || !item?.endDateMonth) ? "#7F8A8E" : "#000"}>
                            {item?.endDateMonth ? item?.endDateMonth : "MM"}
                          </Text>
                          <Text c={item?.still_pursuing ? "#7F8A8E" : "#000"}>
                            /
                          </Text>

                          <Text
                            style={{ fontSize: 14, fontWeight: "400" }}
                            p={0}
                            m={0}
                            pr={4}
                            c={(item?.still_pursuing || !item?.endDateYear) ? "#7F8A8E" : "#000"}>
                            {item?.endDateYear ? item?.endDateYear : "YYYY"}
                          </Text>
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
                        if (!item?.still_pursuing) {
                          inputError &&
                            inputError?.index === index &&
                            inputError?.key === "endDate" &&
                            setInputError(false);
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
                      Current role
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </KeyboardAwareScrollView>
      </View>
      <TouchableOpacity
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
  buttonText: {
    color: "#fff",
  },
});
export default WorkExperience;
