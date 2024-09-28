import React, { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import usePagination from "../../hooks/usePagination";
import { api } from "../../redux/api";
import Icon from "react-native-vector-icons/AntDesign";
import Icons from "../../constants/icons";
import JobsCardSmall from "./JobsCardSmall";
import { navigate } from "../../utils/navigationService";
import SortFilterPopUp from "../../screens/Experience/SortFilterPopUp";
import SavedJobs from "./savedJobs";
import OtherJobs from "./otherJobs";
import JobSectionPopUp from "../../screens/Experience/JobSectionPopUp";
import { homeActions } from "../../redux/homeSlice";
import { useDispatch } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { BackHandler } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { useFocusEffect } from "@react-navigation/native";
import CareerTasterHome from "./CareerTaster/Home.careertaster";

const getItemLayout= (data, index) => {
  return {length: 270, offset: (270+16) * index, index}
}

const JobsScreen = props => {
  const navigation = props?.navigation;
  const isFocused = navigation?.isFocused;
  const firstRender = useRef(true);
  const tab = props?.route?.params?.tab || "Jobs";
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(tab);
  const [selectedSubTab, setSelectedSubTab] = useState("Both");
  const cvParserRef = useRef(null);
  const sortFilterRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAppSelector(state => state.user);
  const home = useAppSelector(state => state.home);
  const userID = user?.user_id;
  const [jobsDataList, setJobsDataList] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const resume = user?.docs?.cv_doc?.file || "";
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [sort, setSort] = useState("new");
  const [showSort, setShowSort] = useState(false);
  const [onlyRemote, setOnlyRemote] = useState(false);
  const {
    data: jobsList,
    page: jobsListPage,
    onReachedEnd: onReachedJobsEnd,
    loadingMoreData: loadMoreJobsData,
    reset,
  } = usePagination("", jobsDataList, 10, 0);
  const [
    getJobs,
    { data: jobsData, isSuccess: jobFetchSuccess, isLoading: isFetching },
  ] = api.useFetchGoogleJobsMutation();
  const [
    deleteRecentJob,
    { data: recentSearchesUpdated, isSuccess: recentJobDeleteSuccess },
  ] = api.useDeleteRecentJobMutation();
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    logAnalyticsEvents("job_screen_tab", { selectedTab: selectedTab });
  }, [selectedTab]);

  const backPressHandler = () => {
    if (isFocused()) {
      navigate("BottomTab", { screen: "Dashboard" });
      return true;
    } else {
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressHandler,
      );

      return () => {
        backHandler.remove();
      };
    }, []),
  );

  const createFormData = ({
    user_id,
    page,
    job_type,
    location,
    keyword,
    experience_filter,
    savePreference = 0,
    sort,
    onlyRemote,
  }) => {
    const bodyFormData = new FormData();
    {
      user_id?.length > 0 && bodyFormData.append("user_id", user_id);
    }
    bodyFormData.append("page", page);
    jobTypeData(job_type)?.forEach(item => {
      bodyFormData.append("job_type", item);
    });
    {
      location?.length > 0 && bodyFormData.append("location", location);
    }
    {
      keyword?.length > 0 && bodyFormData.append("keyword", keyword);
    }
    expFilterData(experience_filter)?.forEach(item => {
      bodyFormData.append("experience_filter", item);
    });
    bodyFormData.append("savePreference", savePreference);
    bodyFormData.append("sort", sort);
    !firstRender.current &&
      bodyFormData.append("onlyRemote", onlyRemote ? 1 : 0);
    firstRender.current &&
      bodyFormData.append("resetJobsCount", 1 );
    return bodyFormData;
  };

  useEffect(() => {
    const data = createFormData({
      user_id: userID,
      page: jobsListPage,
      job_type: jobType,
      location: location,
      keyword: role,
      cv_link: resume,
      experience_filter: experienceFilter,
      sort: sort,
    });
    getJobs(data);
  }, [jobsListPage]);

  useEffect(() => {
    if (!firstRender.current) {
      if (jobsListPage === 0) {
        const data = createFormData({
          user_id: userID,
          page: 0,
          job_type: jobType,
          location: location,
          keyword: role,
          cv_link: resume,
          experience_filter: experienceFilter,
          sort: sort,
          onlyRemote: onlyRemote,
        });
        getJobs(data);
      } else {
        reset();
      }
    } else {
      firstRender.current = false;
    }
  }, [sort]);

  useEffect(() => {
    if (jobFetchSuccess) {
      setShowSort(jobsData?.sortingFlag ? jobsData?.sortingFlag : false);
      if (jobsData?.data?.length > 0) {
        setRefreshing(false);
        setJobsDataList([...jobsData?.data]);
        if (jobsListPage === 0) {
          setAllJobs([...jobsData?.data]);
        } else {
          setAllJobs(prv => {
            return [...prv, ...jobsData?.data];
          });
        }
        setOnlyRemote(
          jobsData?.current_job_preference?.[0]?.onlyRemote ? 1 : 0,
        );
        setLocation(jobsData?.current_job_preference?.[0]?.qlocation);
        setRole(jobsData?.current_job_preference?.[0]?.keyword);
        setExperienceFilter(
          reverseFilterData(
            jobsData?.current_job_preference?.[0]?.experience_filter,
          ),
        );
        setJobType(
          reverseJobTypeData(jobsData?.current_job_preference?.[0]?.job_type),
        );
        if (jobsListPage === 0) {
          setRecentSearches(jobsData?.recent_job_preferences);
        }
      } else {
        setRefreshing(false);
        setJobsDataList([]);
        if (jobsListPage === 0) {
          setAllJobs([]);
        } else {
          setAllJobs(prv => {
            return [...prv, ...jobsData?.data];
          });
        }
        setOnlyRemote(
          jobsData?.current_job_preference?.[0]?.onlyRemote ? 1 : 0,
        );
        setLocation(jobsData?.current_job_preference?.[0]?.qlocation);
        setRole(jobsData?.current_job_preference?.[0]?.keyword);
        setExperienceFilter(
          reverseFilterData(
            jobsData?.current_job_preference?.[0]?.experience_filter,
          ),
        );
        setJobType(
          reverseJobTypeData(jobsData?.current_job_preference?.[0]?.job_type),
        );
      }
    }
  }, [jobFetchSuccess]);

  const [allOtherJobs, setAllOtherJobs] = useState([]);
  const [otherJobsFinal, setOtherJobsFinal] = useState([]);
  const [refreshingOtherJobs, setRefreshingOtherJobs] = useState(false);
  const [
    getOtherJobs,
    {
      data: otherJobs,
      isSuccess: otherJobsSuccess,
      isFetching: isFetchingOtherJobs,
    },
  ] = api.useLazyGetOtherJobsQuery();
  const {
    data: otherJobList,
    page: otherJobListPage,
    onReachedEnd: onReachedOtherJobsEnd,
    loadingMoreData: loadMoreOtherJobsData,
    reset: resetOtherJobs,
  } = usePagination("", allOtherJobs, 25, 0);

  useEffect(() => {
    getOtherJobs({ user_id: user?.user_id, page_number: otherJobListPage });
  }, [otherJobListPage]);

  useEffect(() => {
    if (!isFetchingOtherJobs && otherJobsSuccess) {
      
      setAllOtherJobs(otherJobs?.jobs);

      if(refreshingOtherJobs){
        setRefreshingOtherJobs(false);
        setOtherJobsFinal(otherJobs?.jobs);
      }
      else{
        if (otherJobListPage === 0) {
          setOtherJobsFinal(otherJobs?.jobs);
        } else {
          setOtherJobsFinal(prv => {
            return [...prv, ...otherJobs?.jobs];
          });
        }
      }
    }
  }, [isFetchingOtherJobs, otherJobsSuccess]);

  useEffect(()=>{
    if(refreshingOtherJobs){
      if(otherJobListPage === 0){
        getOtherJobs({ user_id: user?.user_id, page_number: 0 });
      }
      else{
        resetOtherJobs();
      }
    }
  },[refreshingOtherJobs])

  const onRefreshOtherJobs = () => {
    setRefreshingOtherJobs(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (jobsListPage == 0) {
      const data = createFormData({
        user_id: userID,
        page: 0,
        job_type: jobType,
        location: location,
        keyword: role,
        experience_filter: experienceFilter,
        cv_link: resume,
        sort: sort,
        onlyRemote: onlyRemote,
      });
      getJobs(data);
    } else {
      reset();
    }
  };

  const deleteRecentSearch = id => {
    deleteRecentJob({ user_id: userID, id });
  };

  useEffect(() => {
    if (recentJobDeleteSuccess) {
      setRecentSearches(recentSearchesUpdated?.recent_job_preferences);
    }
  }, [recentJobDeleteSuccess]);

  const applyFilters = data => {
    setJobType(data?.jobType);
    setOnlyRemote(data?.onlyRemote ? 1 : 0);
    setLocation(data?.location);
    setRole(data?.role);
    setExperienceFilter(data?.experience_filter);
    if (jobsListPage != 0) {
      reset();
    } else {
      const apiData = createFormData({
        user_id: userID,
        page: 0,
        job_type: data?.jobType,
        location: data?.location,
        keyword: data?.role,
        experience_filter: data?.experience_filter,
        cv_link: resume,
        savePreference: data?.savePreference ? 1 : 0,
        sort: sort,
        onlyRemote: data?.onlyRemote ? 1 : 0,
      });
      getJobs(apiData);
    }
  };

  const expFilterData = data => {
    const arr = data?.map(item => {
      if (item === "0-2") {
        return 1;
      } else if (item === "2-4") {
        return 2;
      } else if (item === "4-8") {
        return 3;
      } else if (item === "8-12") {
        return 4;
      } else if (item === "12+") {
        return 5;
      }
    });
    return arr;
  };

  const reverseFilterData = data => {
    const arr = data?.map(item => {
      if (item == "1") {
        return "0-2";
      } else if (item == "2") {
        return "2-4";
      } else if (item == "3") {
        return "4-8";
      } else if (item == "4") {
        return "8-12";
      } else if (item == "5") {
        return "12+";
      }
    });
    return arr;
  };

  const jobTypeData = data => {
    const arr = data?.map(item => {
      if (item === "Internship") {
        return "INTERN";
      } else if (item === "Contract") {
        return "CONTRACTOR";
      } else if (item === "Part Time") {
        return "PARTTIME";
      } else if (item === "Full Time") {
        return "FULLTIME";
      }
    });
    return arr;
  };

  const reverseJobTypeData = data => {
    const arr = data?.map(item => {
      if (item === "INTERN") {
        return "Internship";
      } else if (item === "CONTRACTOR") {
        return "Contract";
      } else if (item === "PARTTIME") {
        return "Part Time";
      } else if (item === "FULLTIME") {
        return "Full Time";
      }
    });
    return arr;
  };

  const onPressSearch = () => {
    navigate("JobFilters", {
      applyFilters: applyFilters,
      locationValue: location,
      roleValue: role,
      jobTypeValue: jobType,
      experienceFilterValue: experienceFilter,
      onlyRemote: onlyRemote ? true : false,
    });
  };

  const onPressSort = () => {
    sortFilterRef?.current?.present();
  };

  const clickRecentSearch = (
    keyword,
    location,
    exp_fil,
    jobType,
    onlyRemote,
  ) => {
    if (jobsListPage != 0) {
      setRole(keyword);
      setLocation(location);
      setExperienceFilter(exp_fil);
      setJobType(jobType);
      setOnlyRemote(onlyRemote ? 1 : 0);
      reset();
    } else {
      const apiData = createFormData({
        user_id: userID,
        page: 0,
        job_type: jobType,
        location: location,
        keyword: keyword,
        experience_filter: exp_fil,
        cv_link: resume,
        savePreference: 0,
        sort: sort,
        onlyRemote: onlyRemote,
      });
      getJobs(apiData);
    }
  };

  const updateSaved = ({ url, save }) => {
    const newJobs = allJobs?.map((item, index) => {
      let jobsData = { ...item };
      if (jobsData?.link === url) {
        jobsData = { ...item, isSaved: save ? 1 : 0 };
      }
      return jobsData;
    });
    setAllJobs(newJobs);
    const otherJobs = otherJobsFinal?.map(item => {
      let jobsData = { ...item };
      if (jobsData?.link === url) {
        jobsData = { ...item, isSaved: save ? 1 : 0 };
      }
      return jobsData;
    });
    setOtherJobsFinal(otherJobs);
  };

  // const updateOtherFromOtherScreen = ({ url, save }) => {
  //   updateSaved({ url, save });
  //   const otherJobs = otherJobsFinal?.map(item => {
  //     let jobsData = { ...item };
  //     if (jobsData?.link === url) {
  //       jobsData = { ...item, isSaved: save ? 1 : 0 };
  //     }
  //     return jobsData;
  //   });
  //   setOtherJobsFinal(otherJobs);
  // };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./JobsBackground.png")}
        resizeMode="cover">
        <View f={1} mh={16}>
          <View fd="row" mv={8} bbw={0.2} mh={-16}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Jobs");
              }}
              ai="center"
              f={1}
              jc="center"
              ph={16}
              bc={selectedTab === "Jobs" ? "#B9E4A6" : "#7F8A8E"}
              bbw={selectedTab === "Jobs" ? 2 : 0}
              pb={8}>
              <Text ftsz={14} weight="600">
                Jobs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("CareerTaster");
              }}
              ai="center"
              jc="center"
              bc={selectedTab === "CareerTaster" ? "#B9E4A6" : "#7F8A8E"}
              bbw={selectedTab === "CareerTaster" ? 2 : 0}
              mh={16}
              pb={8}>
              <Text ta="center" ftsz={14} weight="600">
                Career Tasters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Saved");
              }}
              f={1}
              ai="center"
              jc="center"
              ph={16}
              bc={selectedTab === "Saved" ? "#B9E4A6" : "#7F8A8E"}
              bbw={selectedTab === "Saved" ? 2 : 0}
              pb={8}>
              <Text ftsz={14} weight="600">
                Saved
              </Text>
            </TouchableOpacity>
          </View>
          {selectedTab === "Jobs" && (
            <>
              {selectedSubTab != "otherJobs" && (
                <>
                  <View
                    mb={16}
                    bw={0.5}
                    bc={"#7F8A8E"}
                    fd="row"
                    gap={8}
                    ai="center"
                    bgc={"#FFF"}
                    br={30}
                    ph={8}>
                    <TouchableOpacity
                      jc="space-between"
                      pv={8}
                      f={1}
                      fd="row"
                      ai="center"
                      onPress={onPressSearch}>
                      <View f={1} fd="row" ai="center">
                        <Icons.SearchJob width={24} height={24} />
                        <Text
                          numberOfLines={1}
                          f={1}
                          ml={8}
                          ftsz={11}
                          weight="500"
                          c={"#000"}>
                          {role}
                          {location?.length > 0 ? "," : ""} {location}
                        </Text>
                      </View>
                      <View mr={6} ai="center" fd="row">
                        <Icons.JobFilter width={20} height={20} />
                        {(experienceFilter?.length > 0 ||
                          jobType?.length > 0) && (
                          <View
                            jc="center"
                            ai="center"
                            br={100}
                            ph={5}
                            pv={1}
                            ml={4}
                            bgc={"#FF4C00"}>
                            <Text ftsz={9} weight="600" c={"#FFF"}>
                              {jobType?.length + experienceFilter?.length}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    {showSort && (
                      <TouchableOpacity
                        onPress={onPressSort}
                        ai="center"
                        fd="row">
                        <Icons.JobSort width={20} height={20} />
                        {sort === "score" && (
                          <View
                            jc="center"
                            ai="center"
                            ml={4}
                            ph={5}
                            pv={1}
                            bgc={"#FF4C00"}
                            br={100}>
                            <Text ftsz={9} weight="600" c={"#FFF"}>
                              1
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
              {selectedSubTab == "Both" && (
                <ScrollView
                  f={1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}>
                  {recentSearches?.length > 0 ? (
                    <View>
                      <Text ftsz={12} weight="400" c={"#333333"}>
                        Recent searches
                      </Text>

                      <ScrollView horizontal mt={8}>
                        {recentSearches?.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={index?.toString()}
                              onPress={() => {
                                clickRecentSearch(
                                  item?.keyword,
                                  item?.qlocation,
                                  reverseFilterData(item?.experience_filter),
                                  reverseJobTypeData(item?.job_type),
                                  item?.onlyRemote,
                                );
                              }}
                              ph={16}
                              br={20}
                              pv={6}
                              fd="row"
                              bgc={"rgba(127, 138, 142, 0.25)"}
                              mr={8}
                              ai="center">
                              <Text ftsz={12} weight="400" c={"#000"}>
                                {item?.keyword}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  deleteRecentSearch(item?._id?.$oid);
                                }}
                                ml={8}>
                                <Icon name="close" size={16} color={"#000"} />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : (
                    <></>
                  )}
                  {jobsListPage === 0 && isFetching ? (
                    <View h={200} jc="center" ai="center">
                      <ActivityIndicator size={"large"} color={"#000"} />
                    </View>
                  ) : (
                    <>
                      <View mt={16} fd="row" jc="space-between" ai="center">
                        <Text ftsz={16} weight="600">
                          Jobs for you
                        </Text>
                        <TouchableOpacity
                          onPress={() => setSelectedSubTab("AllJobs")}
                          fd="row"
                          ai="center">
                          <Text ftsz={15} weight="400">
                            View all
                          </Text>
                          <Icons.ChevronLeft
                            width={24}
                            height={24}
                            fill={"#000"}
                            style={{
                              transform: [
                                {
                                  rotate: "180deg",
                                },
                              ],
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      {home?.newJobsCount > 0 && (
                        <View
                          mv={8}
                          bgc={"#FFD439"}
                          ph={24}
                          pv={4}
                          jc="center"
                          ai="center"
                          asf="baseline"
                          br={16}>
                          <Text ftsz={12} weight="600">
                            {home?.newJobsCount}+ New jobs
                          </Text>
                        </View>
                      )}
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal>
                        <View fd="row">
                          {[...allJobs.slice(0, 10)].map((item, index) => {
                            return (
                              <View key={index?.toString()}>
                                <JobsCardSmall
                                  item={item}
                                  size={0.7}
                                  updateSaved={updateSaved}
                                />
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </>
                  )}
                  <View mt={16}>
                    {otherJobListPage === 0 && isFetchingOtherJobs ? (
                      <View h={200} jc="center" ai="center">
                        <ActivityIndicator size={"large"} color={"#000"} />
                      </View>
                    ) : 
                      (otherJobsFinal?.length>0 ?  <>
                        <View mv={16} fd="row" jc="space-between" ai="center">
                          <Text ftsz={16} weight="600">
                            Other jobs to explore
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedSubTab("otherJobs");
                            }}
                            fd="row"
                            ai="center">
                            <Text ftsz={15} weight="400">
                              View all
                            </Text>
                            <Icons.ChevronLeft
                              width={24}
                              height={24}
                              fill={"#000"}
                              style={{
                                transform: [
                                  {
                                    rotate: "180deg",
                                  },
                                ],
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal>
                          <View fd="row">
                            {[...otherJobsFinal.slice(0, 10)].map(
                              (item, index) => {
                                return (
                                  <View key={index?.toString()}>
                                    <JobsCardSmall
                                      item={item}
                                      size={0.7}
                                      updateSaved={updateSaved}
                                    />
                                  </View>
                                );
                              },
                            )}
                          </View>
                        </ScrollView>
                      </> : <></>)
                      }
                  </View>
                </ScrollView>
              )}
              {selectedSubTab === "AllJobs" && (
                <>
                  {jobsListPage === 0 &&
                  isFetching &&
                  selectedTab === "Jobs" ? (
                    <View f={1} jc="center" ai="center">
                      <ActivityIndicator size={"large"} color={"#000"} />
                    </View>
                  ) : (
                    <>
                      {selectedTab === "Jobs" && (
                        <View f={1}>
                          <View f={1}>
                            <View f={1}>
                              {isFetching && jobsListPage == 0 ? (
                                <View f={1} jc="center" ai="center">
                                  <ActivityIndicator
                                    size={"large"}
                                    color={"#000"}
                                  />
                                </View>
                              ) : jobsListPage == 0 &&
                                jobsList?.length === 0 ? (
                                <View f={1} jc="center" ai="center">
                                  <Text
                                    ftsz={14}
                                    weight="600"
                                    ta="center"
                                    c={
                                      "#000"
                                    }>{`No jobs found.\n Please check again later.`}</Text>
                                </View>
                              ) : (
                                <FlatList
                                  nestedScrollEnabled={true}
                                  ItemSeparatorComponent={() => {
                                    return <View h={16} />;
                                  }}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                  ListHeaderComponent={() => {
                                    return (
                                      <>
                                        {resume?.length === 0 && (
                                          <TouchableOpacity
                                            onPress={() => {
                                              logAnalyticsEvents(
                                                "boost_job_search",
                                                {},
                                              );
                                              cvParserRef?.current?.present();
                                            }}>
                                            <LinearGradient
                                              colors={["#D8E3FC", "#E3D5F3"]}
                                              start={{ x: 0, y: 0 }}
                                              end={{ x: 1, y: 1 }}
                                              style={{
                                                marginBottom: 16,
                                                paddingHorizontal: 16,
                                                paddingVertical: 16,
                                                borderRadius: 12,
                                              }}>
                                              <View f={1}>
                                                <Text
                                                  ta="center"
                                                  ftsz={13}
                                                  weight="700">
                                                  BOOST YOUR JOB SEARCH
                                                </Text>
                                                <Text
                                                  ta="center"
                                                  ftsz={12}
                                                  weight="500">
                                                  Upload your CV for a
                                                  personalized job search and
                                                  higher match scores!
                                                </Text>
                                              </View>
                                            </LinearGradient>
                                          </TouchableOpacity>
                                        )}
                                        {recentSearches?.length > 0 ? (
                                          <View>
                                            <Text
                                              ftsz={12}
                                              weight="400"
                                              c={"#333333"}>
                                              Recent searches
                                            </Text>

                                            <ScrollView horizontal mt={8}>
                                              {recentSearches?.map(
                                                (item, index) => {
                                                  return (
                                                    <TouchableOpacity
                                                      key={index?.toString()}
                                                      onPress={() => {
                                                        clickRecentSearch(
                                                          item?.keyword,
                                                          item?.qlocation,
                                                          reverseFilterData(
                                                            item?.experience_filter,
                                                          ),
                                                          reverseJobTypeData(
                                                            item?.job_type,
                                                          ),
                                                          item?.onlyRemote,
                                                        );
                                                      }}
                                                      ph={16}
                                                      br={20}
                                                      pv={6}
                                                      fd="row"
                                                      bgc={
                                                        "rgba(127, 138, 142, 0.25)"
                                                      }
                                                      mr={8}
                                                      ai="center">
                                                      <Text
                                                        ftsz={12}
                                                        weight="400"
                                                        c={"#000"}>
                                                        {item?.keyword}
                                                      </Text>
                                                      <TouchableOpacity
                                                        onPress={() => {
                                                          deleteRecentSearch(
                                                            item?._id?.$oid,
                                                          );
                                                        }}
                                                        ml={8}>
                                                        <Icon
                                                          name="close"
                                                          size={16}
                                                          color={"#000"}
                                                        />
                                                      </TouchableOpacity>
                                                    </TouchableOpacity>
                                                  );
                                                },
                                              )}
                                            </ScrollView>
                                          </View>
                                        ) : (
                                          <></>
                                        )}
                                        <TouchableOpacity
                                          mt={12}
                                          mb={8}
                                          ai="center"
                                          onPress={() =>
                                            setSelectedSubTab("Both")
                                          }
                                          fd="row">
                                          <Icons.ChevronLeft
                                            width={24}
                                            height={24}
                                            fill={"#000"}
                                          />
                                          <Text
                                            c={"#000"}
                                            ftsz={16}
                                            weight="600">
                                            Jobs for you
                                          </Text>
                                        </TouchableOpacity>
                                      </>
                                    );
                                  }}
                                  showsVerticalScrollIndicator={false}
                                  onEndReachedThreshold={0.5}
                                  data={[...allJobs]}
                                  getItemLayout={getItemLayout}
                                  refreshing={refreshing}
                                  onRefresh={onRefresh}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <>
                                        {home?.personalCoach &&
                                          home?.personalCoach?.picture?.length >
                                            0 &&
                                          index === 6 && (
                                            <LinearGradient
                                              colors={[
                                                "rgba(185, 228, 166, 0.75)",
                                                "rgba(202, 243, 242, 0.75)",
                                              ]}
                                              start={{ x: 0, y: 0 }}
                                              end={{ x: 1, y: 1 }}
                                              style={{
                                                marginBottom: 16,
                                                paddingHorizontal: 16,
                                                paddingVertical: 16,
                                                borderRadius: 12,
                                              }}>
                                              <View fd="row" ai="center">
                                                <Image
                                                  source={{
                                                    uri: home?.personalCoach
                                                      ?.picture,
                                                  }}
                                                  w={60}
                                                  h={75}
                                                  resizeMode="contain"
                                                />
                                                <View f={1} ml={8}>
                                                  <Text ftsz={14} weight="700">
                                                    Ready to ace your job
                                                    search?{" "}
                                                  </Text>
                                                  <Text ftsz={12} weight="400">
                                                    Speak with your Career Coach
                                                    and develop a winning
                                                    strategy and stand out to
                                                    employers!
                                                  </Text>
                                                </View>
                                              </View>
                                              <View fd="row" gap={16} mt={16}>
                                                <TouchableOpacity
                                                  onPress={() => {
                                                    logAnalyticsEvents(
                                                      "Book_Session_CC",
                                                      {},
                                                    );
                                                    navigate("Booking_page", {
                                                      source:
                                                        home?.personalCoach
                                                          ?.bookingLink,
                                                    });
                                                  }}
                                                  bc={"#000"}
                                                  bw={0.4}
                                                  pv={8}
                                                  br={12}
                                                  bgc={"#000"}
                                                  f={1}
                                                  jc="center"
                                                  ai="center">
                                                  <Text
                                                    ftsz={14}
                                                    weight="500"
                                                    c={"#FFF"}>
                                                    Book a session
                                                  </Text>
                                                </TouchableOpacity>
                                              </View>
                                            </LinearGradient>
                                          )}
                                        <JobsCardSmall
                                          item={item}
                                          updateSaved={updateSaved}
                                        />
                                      </>
                                    );
                                  }}
                                  onEndReached={onReachedJobsEnd}
                                  ListFooterComponent={() => {
                                    return (
                                      <View>
                                        {loadMoreJobsData && (
                                          <View z={50} mt={20}>
                                            <ActivityIndicator color={"#000"} />
                                          </View>
                                        )}
                                        <View mb={180} />
                                      </View>
                                    );
                                  }}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
              {selectedSubTab === "otherJobs" && (
                <>
                  {isFetchingOtherJobs && otherJobListPage == 0 ? (
                    <View f={1} jc="center" ai="center">
                      <ActivityIndicator size={"large"} color={"#000"} />
                    </View>
                  ) : otherJobListPage == 0 && otherJobsFinal?.length === 0 ? (
                    <View f={1} jc="center" ai="center">
                      <Text
                        ftsz={14}
                        weight="600"
                        ta="center"
                        c={"#000"}>{`No Other jobs found.`}</Text>
                    </View>
                  ) : (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      onEndReachedThreshold={0.5}
                      data={[...otherJobsFinal]}
                      getItemLayout={getItemLayout}
                      refreshing={refreshingOtherJobs}
                      onRefresh={onRefreshOtherJobs}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        return (
                          <>
                            {index === 3 && user?.overAllPercentage < 75 && (
                              <TouchableOpacity
                                mb={16}
                                ph={16}
                                pv={16}
                                br={16}
                                bgc={"rgba(255, 255, 255, 0.75)"}
                                onPress={() => {
                                  navigate("Profile");
                                }}>
                                <Text ftsz={12} weight="500">
                                  Not satisfied with our recommendations?
                                  Complete your{" "}
                                  <Text ftsz={13} weight="500">
                                    MapOut profile
                                  </Text>{" "}
                                  to get the best results.
                                </Text>
                              </TouchableOpacity>
                            )}
                            <View mb={16}>
                              <JobsCardSmall
                                item={item}
                                updateSaved={updateSaved}
                                hideScore={true}
                              />
                            </View>
                          </>
                        );
                      }}
                      ListHeaderComponent={() => {
                        return (
                          <TouchableOpacity
                            mt={12}
                            mb={8}
                            ai="center"
                            onPress={() => setSelectedSubTab("Both")}
                            fd="row">
                            <Icons.ChevronLeft
                              width={24}
                              height={24}
                              fill={"#000"}
                            />
                            <Text c={"#000"} ftsz={16} weight="600">
                              Other jobs to explore
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      onEndReached={onReachedOtherJobsEnd}
                      ListFooterComponent={() => {
                        return (
                          <View>
                            {loadMoreOtherJobsData && (
                              <View z={50} mt={20}>
                                <ActivityIndicator color={"#000"} />
                              </View>
                            )}
                            <View mb={180} />
                          </View>
                        );
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}
          {selectedTab === "Saved" && <SavedJobs updateSaved={updateSaved} />}
          {selectedTab === "CareerTaster" && <CareerTasterHome />}
        </View>
        <SortFilterPopUp
          sort={sort}
          setSort={setSort}
          ref={sortFilterRef}
          backdrop
          snapPoints={["30%"]}
        />
        <JobSectionPopUp
          userID={userID}
          ref={cvParserRef}
          backdrop
          snapPoints={["40%"]}
        />
      </ImageBackground>
    </MainLayout>
  );
};

export default JobsScreen;
