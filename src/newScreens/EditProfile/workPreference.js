import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { SelectInput, Text } from "../../components";
import usePagination from "../../hooks/usePagination";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import { useAppSelector } from "../../redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const WorkPreferenceDetails = (props) => {
  const handleButtonPress = props?.handleButtonPress;
  const user = useAppSelector(state=>state.user);
  const [inputError, setInputError] = useState(false);
  const motivationList = [
    "First Job",
    "Career Change",
    "Better Compensation",
    "Better Challenges",
    "Better Culture",
    "Better Learnings",
    "Better Benefits",
    "Location Change",
    "Career Mobility",
    "Career Progression",
  ];
  const [workPreference, setWorkPreference] = useState(user?.work_preference?.length>0 ? user?.work_preference : "");
  const [industryPreference, setIndustryPreference] = useState( user?.industry_preferences?.length > 0 ? user?.industry_preferences : []);
  const [rolePreference, setRolePreference] = useState(user?.role_preferences?.length>0 ? user?.role_preferences : []);
  const [motivation, setMotivation] = useState(user?.job_search_motivation?.length>0 ? user?.job_search_motivation : []);
  const [availability, setAvailability] = useState(user?.availability?.length>0 ? user?.availability : [{available_for: "", available_from: ""}]);
  const [searchRole, setSearchRole] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");
  const debouncedSearchRole = useDebounce(searchRole, 300);
  const debouncedSearchIndustry = useDebounce(searchIndustry, 300);
  const [saveProfile, { data, isSuccess, isLoading, isError, error }] =
    api.useSaveProfileMutation();

  const [roleDataList, setRoleDataList] = useState([]);
  const {
    data: roleList,
    page: roleListPage,
    onReachedEnd: onReachedRoleEnd,
    loadingMoreData: loadMoreRoleData,
  } = usePagination(debouncedSearchRole, roleDataList);
  const { data: roleData, isLoading: isLoadingRole } = api.useGetEducationWorkDetailsQuery({
    search: debouncedSearchRole,
    type: "job_titles",
    page: roleListPage,
  });
  const [industryDataList, setIndustryDataList] = useState([]);
  const {
    data: industryList,
    page: industryListPage,
    onReachedEnd: onReachedIndustryEnd,
    loadingMoreData: loadMoreIndustryData,
  } = usePagination(debouncedSearchIndustry, industryDataList);
  const { data: industryData, isLoading: isLoadingIndustry } = api.useGetEducationWorkDetailsQuery({
    search: debouncedSearchIndustry,
    type: "industries",
    page: industryListPage,
  });

  useEffect(()=>{
    if(isSuccess){
      logAnalyticsEvents('completed_preference_profile', {});
      handleButtonPress();
    }
  },[isSuccess])

  useEffect(() => {
    if (roleData?.data?.length > 0) {
      setRoleDataList([...roleData?.data]);
    } else {
      setRoleDataList([]);
    }
  }, [roleData]);

  useEffect(() => {
    if (industryData?.data?.length > 0) {
      setIndustryDataList([...industryData?.data]);
    } else {
      setIndustryDataList([]);
    }
  }, [industryData]);

  const updateIndustryPreference = (val)=>{
    if (industryPreference?.includes(val)) {
      const data= [...industryPreference]
      const index = data.indexOf(val);
      if (index > -1) {
        data.splice(index, 1);
        setIndustryPreference([...data]);
      }
      return;
    } else {
      if(industryPreference?.length === 3){
        Toast.show({
          type: "error",
          text1: "Maximum selected",
          text2: "You can select at max 3.",
        });
        return;
      }
      else{
        setIndustryPreference(prv => {
          let data = [...prv];
          data.push(val);
          return data;
        });
      }
    }
  }

  const updateRolePreference=(val)=>{
    if (rolePreference?.includes(val)) {
      const data= [...rolePreference]
      const index = data.indexOf(val);
      if (index > -1) {
        data.splice(index, 1);
        setRolePreference([...data]);
      }
      return;
    } else {
      if(rolePreference?.length === 3){
        Toast.show({
          type: "error",
          text1: "Maximum selected",
          text2: "You can select at max 3.",
        });
        return;
      }
      else{
        setRolePreference(prv => {
          let data = [...prv];
          data.push(val);
          return data;
        });
      }
    }
  }

  const clearindustryPreference = ()=>{
    setIndustryPreference([]);
  }

  const clearRolePreference = ()=>{
    setRolePreference([]);
  }

  const addMotivation = val => {
    if (motivation?.includes(val)) {
      const data= [...motivation]
      const index = data.indexOf(val);
      if (index > -1) {
        data.splice(index, 1);
        setMotivation([...data]);
      }
      return;
    } else {
      if(motivation?.length === 2){
        Toast.show({
          type: "error",
          text1: "Maximum selected",
          text2: "You can select at max 2.",
        });
        return;
      }
      else{

      setMotivation(prv => {
        let data = [...prv];
        data.push(val);
        return data;
      });
    }
    }
  };

  const clearMotivation = () => {
    setMotivation([]);
  };

  const setAvailablityFor = (val, index) => {
    setAvailability((prv)=>{
      let data = [...prv];
      data[index] = {
        available_for: val,
        available_from: data[index]?.available_from
      }
      return data;
    })
  };

  const setAvailablityFrom = (val, index) => {
    setAvailability((prv)=>{
      let data = [...prv];
      data[index] = {
        available_for: data[index]?.available_for,
        available_from: val
      }
      return data;
    })
  };

  const addAvailablity = ()=>{
    setAvailability((prv)=>{
      let data = [...prv];
      data.push({available_for: "", available_from: ""})
      return data;
    })
  }

  const deleteAvailability = (index)=>{
    setAvailability((prv)=>{
      let data = [...prv];
      data.splice(index,1);
      return data;
    })
  }

  const onPressSave=()=>{
    if(motivation?.join()?.length ==0){
      setInputError({
        key: "motivation",
        errorMsg: "Missing"
      })
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must fill all the necessary fields",
      });
      return;
    } else if(availability?.length == 0){
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must fill all the necessary fields",
      });
      return;
    }else{
      let data={
        user_id: user?.user_id,
        work_preference: workPreference,
        industry_preferences: industryPreference,
        role_preferences: rolePreference,
        job_search_motivation: motivation,
        availability: availability
      }
      saveProfile(data);
    }
  }

  const isDataLoading = isLoadingRole || isLoadingIndustry;

  return (
    isDataLoading ? <View f={1} ai="center" jc="center">
    <ActivityIndicator size={"large"} color={'#000'}/>
  </View> :
    <>
      <View f={1}>
      <KeyboardAwareScrollView
              style={{flex:1, paddingTop:16}}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}>
            <View mh={24} mt={24}>
              <Text ftsz={15} weight="500" c={"#141418"}>
                Work Preference
              </Text>
              <SelectInput
                snapPoints={["50%"]}
                onSelect={val => {
                  setWorkPreference(val);
                }}
                options={["In-office", "Hybrid", "Remote", "No preference"]}
                label="Work Preference"
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
                      c={workPreference ? "#000" : "#7F8A8E"}
                      pb={4}>
                      {workPreference ? workPreference : "Choose one"}
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
              <Text ftsz={15} weight="500" c={"#141418"}>
                Industry Preference
              </Text>
              <SelectInput
                selectedOptions={industryPreference}
                maxSelected={3}
                onSearch={setSearchIndustry}
                searchPlaceholder="Search industry"
                onReachEnd={onReachedIndustryEnd}
                onReachEndThreshold={0.5}
                loadingMoreData={loadMoreIndustryData}
                onSelect={val => {
                  updateIndustryPreference(val);
                }}
                options={[...industryList?.map(val => val.name)]}
                label="Industry Preference"
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
                      c={industryPreference?.join().length ? "#000" : "#7F8A8E"}
                      pb={4}>
                        {industryPreference?.join().length
                        ? industryPreference?.join()
                        : "Choose max 3"}
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
              {industryPreference?.length > 0 && (
                <TouchableOpacity
                  onPress={clearindustryPreference}
                  mt={8}
                  asf="flex-end">
                  <Text>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View mh={24} mt={24}>
              <Text ftsz={15} weight="500" c={"#141418"}>
                Role Preference
              </Text>
              <SelectInput
                selectedOptions={rolePreference}
                maxSelected={3}
                searchKey={debouncedSearchRole}
                onSearch={setSearchRole}
                searchPlaceholder="Search role"
                onReachEnd={onReachedRoleEnd}
                onReachEndThreshold={0.5}
                loadingMoreData={loadMoreRoleData}
                onSelect={val => {
                  updateRolePreference(val);
                }}
                options={[...roleList?.map(val => val.name)]}
                label="Role Preference"
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
                      c={rolePreference?.join()?.length ? "#000" : "#7F8A8E"}
                      pb={4}>
                      {rolePreference?.join()?.length ? rolePreference?.join() : "Choose max 3"}
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
              {rolePreference?.length > 0 && (
                <TouchableOpacity
                  onPress={clearRolePreference}
                  mt={8}
                  asf="flex-end">
                  <Text>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View mh={24} mt={24}>
              <Text ftsz={15} weight="500" c={"#141418"}>
                Motivation for Job search*
              </Text>
              <SelectInput
                onSelect={val => {
                  addMotivation(val);
                  inputError && inputError?.key === "motivation" && setInputError(false);
                }}
                options={[...motivationList]}
                selectedOptions={motivation}
                maxSelected={2}
                label="Motivation for Job search"
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
                      c={motivation?.join().length ? "#000" : "#7F8A8E"}
                      pb={4}>
                      {motivation?.join().length
                        ? motivation?.join()
                        : "Choose max 2"}
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
              {
                inputError && inputError?.key === "motivation" && <Text ftsz={12} weight="500" c={'red'}>{inputError?.errorMsg}</Text>
              }
              {motivation?.length > 0 && (
                <TouchableOpacity
                  onPress={clearMotivation}
                  mt={8}
                  asf="flex-end">
                  <Text>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <SelectInput
              onSelect={val => {
                addMotivation(val);
              }}
              options={[...motivationList]}
              label="Motivation for Job search"
              renderInput={({ onPressSelect }) => (
                <TouchableOpacity
                  onPress={onPressSelect}
                  mt={motivation?.length > 0 ? 8 : 24}
                  mh={24}
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
            />

            <View mt={24} mh={24}>
              { availability?.map((item, index)=>{
              return(
              <>
              <View fd="row" gap={16}>
                <View f={1}>
                  <Text ftsz={15} weight="500" c={"#141418"}>
                    Available for*
                  </Text>
                  <SelectInput
                    snapPoints={["50%"]}
                    onSelect={val => {
                      setAvailablityFor(val, index);
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
                          numberOfLines={1}
                          f={1}
                          weight="400"
                          ftsz={14}
                          c={
                            item?.available_for?.length > 0 ? "#000" : "#7F8A8E"
                          }
                          pb={4}>
                          {item?.available_for?.length > 0
                            ? item?.available_for
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
                  <Text ftsz={15} weight="500" c={"#141418"}>
                    Available from*
                  </Text>
                  <SelectInput
                    snapPoints={["50%"]}
                    onSelect={val => {
                      setAvailablityFrom(val, index);
                    }}
                    options={[
                      "Immediately",
                      "30 days",
                      "60 days",
                      "90 days",
                    ]}
                    label="Available from*"
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
                          c={item?.available_from?.length > 0 ? "#000" : "#7F8A8E"}
                          pb={4}>
                          {item?.available_from?.length > 0
                            ? item?.available_from
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
              </View>
              {availability?.length > 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      deleteAvailability(index);
                    }}
                    asf="flex-end">
                    <Text mt={8}>Delete</Text>
                  </TouchableOpacity>
                )}
              </>
              )})}
            </View>
                <TouchableOpacity
                  onPress={addAvailablity}
                  mh={24}
                  mt={availability?.length > 0 ? 8 : 24}
                  bgc={"rgba(216, 227, 252, 0.45)"}
                  asf="baseline"
                  pv={8}
                  ph={8}
                  br={8}>
                  <Text ftsz={12} weight="500">
                    + Add Other
                  </Text>
                </TouchableOpacity>

            <View h={100} />
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
        {isLoading ? <ActivityIndicator color={'#FFF'} size={"small"}/> : <Text ftsz={14} weight="500" c={"#FFF"}>
          Save
        </Text>}
      </TouchableOpacity>
    </>
  );
};

export default WorkPreferenceDetails;
