import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { SearchInput, SelectInput, Text } from "../../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ICONS } from "../../constants";
import { api } from "../../redux/api";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import { useAppSelector } from "../../redux";
import Icon from "react-native-vector-icons/AntDesign";
import CheckBox from "react-native-check-box";
import MainLayout from "../../components/MainLayout";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const JobFilters = props => {
  const {
    applyFilters = false,
    locationValue = "",
    roleValue = "",
    jobTypeValue = [],
    experienceFilterValue = [],
    onlyRemote = false,
  } = props?.route?.params;

  const [
    requestToAddOption,
    {
      isLoading: isRequestToAddLoading,
      isSuccess: isRequestToAddSuccess,
      reset,
      isError: requestToAddError,
    },
  ] = api.useRequestToAddDataMutation();
  const user = useAppSelector(state => state.user);
  const career = user?.workDetails?.[0]?.role;

  const Job_types = ["Internship", "Contract", "Part Time", "Full Time"];
  const Experience_types = [
    "0-2",
    "2-4",
    "4-8",
    "8-12",
    "12+"
  ];

  const [jobType, setJobType] = useState(jobTypeValue);
  const [experience_filter, setExperienceFilter] = useState(
    experienceFilterValue,
  );

  const [location, setLocation] = useState(locationValue);
  const [onlyRemoteCheck, setOnlyRemote] = useState(onlyRemote);
  const [isCheckedSelected, setIsCheckedSelected] = useState(false);

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
  const [role, setRole] = useState(roleValue);
  const [searchLocation, setSearchLocation] = useState("");
  const debouncedSearchLocation = useDebounce(searchLocation, 300);
  const [locationDataList, setLocationDataList] = useState([]);
  const {
    data: locationList,
    page: locationListPage,
    onReachedEnd: onReachedLocationEnd,
    loadingMoreData: loadMoreLocationData,
  } = usePagination(debouncedSearchLocation, locationDataList);
  const { data: locData } = api.useGetCitysQuery({
    citysearch: debouncedSearchLocation,
    page: locationListPage,
  });

  const onPressAddSearchRole = type => () => {
    if (isRequestToAddLoading || !searchRole) {
      return;
    }
    requestToAddOption({
      type: type,
      newData: searchRole,
      user_id: user?.user_id,
    });
  };

  useEffect(() => {
    if (roleData?.data?.length > 0) {
      setRoleDataList([...roleData?.data]);
    } else {
      setRoleDataList([]);
    }
  }, [roleData]);

  useEffect(() => {
    if (locData?.data?.length > 0) {
      setLocationDataList([...locData?.data]);
    } else {
      setLocationDataList([]);
    }
  }, [locData]);

  const onSelectJobType = val => {
    let array = [...jobType];
    const index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(val);
    }
    setJobType([...array]);
  };

  const onSelectLocation = val => {
    setLocation(val);
  };

  const onSelectRole = val => {
    setRole(val);
  };

  const onSelectExperienceType = val => {
    let array = [...experience_filter];
    const index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(val);
    }
    setExperienceFilter([...array]);
  };

  const removeExperienceFilter = val => {
    let array = [...experience_filter];
    const index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    }
    setExperienceFilter([...array]);
  };

  const removeJobTypeFilter = val => {
    let array = [...jobType];
    const index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    }
    setJobType([...array]);
  };

  const onClickSave = () => {
    logAnalyticsEvents('apply_filters_job', {});
    const data = {
      role: role,
      location: location,
      jobType: jobType,
      experience_filter: experience_filter,
      savePreference: isCheckedSelected ? 1 : 0,
      onlyRemote: onlyRemoteCheck
    };
    applyFilters(data);
    props?.navigation?.goBack();
  };

  const onSearch = type => text => {
    if (type === "job_titles") {
      setSearchRole(text);
    } else if (type === "industries") {
      setSearchIndustry(text);
    } else if (type === "field_of_work") {
      setSearchFieldOfWork(text);
    }

    if (isRequestToAddSuccess || requestToAddError) {
      reset();
    }
  };

  const clearAll = () => {
    setRole("");
    setJobType([]);
    setLocation("");
    setExperienceFilter([]);
  };

  const onClearRole = () => {
    setRole("");
  };

  const onClearJobType = () => {
    setJobType([]);
  };

  const onClearLocation = () => {
    setLocation("");
  };

  const onClearExperienceFilter = () => {
    setExperienceFilter([]);
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./JobsBackground.png")}
        resizeMode="cover">
        <View f={1}>
          <View mh={16} mv={16}>
            <View fd="row" ai="center">
              <TouchableOpacity
                onPress={() => {
                  popNavigation();
                }}>
                <Icons.BackArrow width={32} height={32} />
              </TouchableOpacity>
              <Text
                ftsz={17}
                weight="500"
                c={"#141418"}
                f={1}
                mr={32}
                ta="center">
                Filters
              </Text>
            </View>
          </View>
          <View jc="center" f={1} ph={24}>
            <View mb={32}>
              <View fd="row" ai="center" jc="space-between">
                <Text ftsz={12} weight="400" c={"#000"}>
                  Your selected title
                </Text>
              </View>
              <SelectInput
                selectedOptions={role}
                searchKey={debouncedSearchRole}
                onSearch={setSearchRole}
                searchPlaceholder="Ex: Product manager"
                onReachEnd={onReachedRoleEnd}
                onReachEndThreshold={0.5}
                loadingMoreData={loadMoreRoleData}
                onSelect={onSelectRole}
                options={roleList?.map(val => val.name)}
                label="Title"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={0.5}
                    bc={"#A1A1A1"}
                    fd="row"
                    gap={16}>
                    <Text mv={4} f={1} weight="500" ftsz={14} c={"#000"} pb={4}>
                      {role}
                    </Text>
                    <Icons.PencilEdit width={20} height={20} fill={"#000"} />
                  </TouchableOpacity>
                )}
              />
            </View>

            <View>
              <View fd="row" ai="center" jc="space-between">
                <Text ftsz={12} weight="400" c={"#000"}>
                  Location
                </Text>
                <TouchableOpacity onPress={onClearLocation}>
                  <Text ftsz={12} weight="300" c={"#000"}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <SelectInput
                selectedOptions={location}
                onSearch={setSearchLocation}
                searchPlaceholder="Ex: Gurgoan, Haryana"
                onReachEnd={onReachedLocationEnd}
                onReachEndThreshold={0.5}
                loadingMoreData={loadMoreLocationData}
                onSelect={onSelectLocation}
                options={locationList?.map(citi => citi.name)}
                label="Location"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={0.5}
                    bc={"#A1A1A1"}
                    fd="row"
                    gap={16}>
                    <Text mv={4} f={1} weight="500" ftsz={14} c={"#000"} pb={4}>
                      {location}
                    </Text>
                    <Icons.PencilEdit width={20} height={20} fill={"#000"} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              ai="center"
              style={{
                flexDirection: "row",
              }}
              mb={32}>
              <CheckBox
                checkBoxColor={"#000"}
                onClick={() => setOnlyRemote(!onlyRemoteCheck)}
                isChecked={onlyRemoteCheck}
              />
              <Text style={{ marginLeft: 8, color: "#000" }}>
                Remote
              </Text>
            </View>

            <View mb={32}>
              <View fd="row" ai="center" jc="space-between">
                <Text ftsz={12} weight="400" c={"#000"}>
                  Job type
                </Text>
                <TouchableOpacity onPress={onClearJobType}>
                  {jobType?.length>0 && <Text ftsz={12} weight="300" c={"#000"}>
                    Clear
                  </Text>}
                </TouchableOpacity>
              </View>

              <SelectInput
                snapPoints={["50%"]}
                selectedOptions={jobType}
                onSelect={onSelectJobType}
                options={Job_types}
                maxSelected={4}
                label="Job type"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={0.5}
                    bc={"#A1A1A1"}
                    fd="row"
                    gap={16}>
                    {jobType?.length > 0 ? (
                      <FlatList
                        f={1}
                        mt={4}
                        horizontal
                        data={jobType}
                        contentContainerStyle={{
                          flexWrap: "wrap",
                          width: "100%",
                        }}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              mb={8}
                              br={8}
                              mr={8}
                              bw={0.5}
                              bgc={"#FFF"}
                              ph={8}
                              fd="row"
                              ai="center"
                              onPress={() => removeJobTypeFilter(item)}
                              key={index}>
                              <Text pv={2} mr={4} c={"#000"}>
                                {item}
                              </Text>
                              <Icon name="close" size={10} color={"#000"} />
                            </TouchableOpacity>
                          );
                        }}
                      />
                    ) : (
                      <Text
                        mv={4}
                        f={1}
                        weight="500"
                        ftsz={14}
                        c={"#000"}
                        pb={4}>
                        {" "}
                      </Text>
                    )}
                    <Icons.PencilEdit width={20} height={20} fill={"#000"} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View>
              <View fd="row" ai="center" jc="space-between">
                <Text ftsz={12} weight="400" c={"#000"}>
                  Experience
                </Text>
                {experience_filter?.length > 0 && (
                  <TouchableOpacity onPress={onClearExperienceFilter}>
                    <Text ftsz={12} weight="300" c={"#000"}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <SelectInput
                snapPoints={["60%"]}
                selectedOptions={experience_filter}
                onSelect={onSelectExperienceType}
                maxSelected={4}
                options={Experience_types}
                label="Experience"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={0.5}
                    bc={"#A1A1A1"}
                    fd="row"
                    gap={16}>
                    {experience_filter?.length > 0 ? (
                      <FlatList
                        f={1}
                        mt={4}
                        horizontal
                        data={experience_filter}
                        contentContainerStyle={{
                          flexWrap: "wrap",
                          width: "100%",
                        }}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              mb={8}
                              br={8}
                              mr={8}
                              bw={0.5}
                              bgc={"#FFF"}
                              ph={8}
                              fd="row"
                              ai="center"
                              onPress={() => removeExperienceFilter(item)}
                              key={index}>
                              <Text pv={2} mr={4} c={"#000"}>
                                {item}
                              </Text>
                              <Icon name="close" size={10} color={"#000"} />
                            </TouchableOpacity>
                          );
                        }}
                      />
                    ) : (
                      <Text
                        mv={4}
                        f={1}
                        weight="500"
                        ftsz={14}
                        c={"#000"}
                        pb={4}>
                        {""}
                      </Text>
                    )}
                    <Icons.PencilEdit width={20} height={20} fill={"#000"} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "center",
              }}>
              <CheckBox
                checkBoxColor={"#000"}
                onClick={() => setIsCheckedSelected(!isCheckedSelected)}
                isChecked={isCheckedSelected}
              />
              <Text style={{ marginLeft: 8, color: "#000" }}>
                Save your job preference
              </Text>
            </View>
            <View fd="row" ai="center" mt={24} gap={16}>
              <TouchableOpacity
                onPress={clearAll}
                pv={12}
                br={12}
                ai="center"
                jc="center"
                bgc={"#D8E3FC"}
                f={1}>
                <Text ftsz={14} weight="500">
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                f={2}
                bgc={"#000000"}
                pv={12}
                br={12}
                jc="center"
                ai="center"
                onPress={onClickSave}>
                <Text ftsz={14} weight="500" c={"#FFF"}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default JobFilters;
