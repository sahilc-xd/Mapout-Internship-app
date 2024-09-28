import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/AntDesign";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native-style-shorthand";

import { api } from "../redux/api";
import { useAppSelector } from "../redux";
import StartCareerAnalysis from "../screens/StartCareerAnalysis";
import StartPersonalityTest from "../screens/StartPersonalityTest";
import PersonalityTest from "../screens/PersonalityTest";
import StartSkillTest from "../screens/StartSkillTest";
import SkillAndAspirations from "../screens/SkillAndAspirations";
import CompleteSkillTest from "../screens/SkillAndAspirations/CompleteSkillTest";
import StartBackgroundTest from "../screens/StartBackgroundTest";
import Notifications from "../screens/Notifications";
import { UpdateStatus } from "../utils/updateStatus";
import { ICONS } from "../constants";
import { BottomTab } from "./BottomTab";
import Booking_page from "../screens/Booking_page";
import Timeslotbooking from "../screens/Booking_page/Timeslotbooking";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignUpForm from "../newScreens/SignUpForm";
import PlayVideoScreen from "../newScreens/PlayVideoScreen";
import RewardPointModal from "../components/RewardPointModal";
import CoachingScreen from "../newScreens/CoachingScreen";
import TaskScreen from "../newScreens/TaskScreen";
import PlayVideoLink from "../newScreens/PlayVideoLink";
import RewardScreen from "../newScreens/RewardScreen";
import StreakAndRewardScreen from "../newScreens/StreakAndRewardScreen";
import CareerAnalysisScreen from "../newScreens/CareerAnalysisScreen";
import CareerAnalysisResult from "../newScreens/CareerAnalysisResult";
import PersonalityTestResult from "../newScreens/PersonalityTestResult";
import CareerAnalysisStepper from "../newScreens/CareerAnalysisStepper";
import CareerAnalysisAspirations from "../newScreens/CareerAnalysisAspirations";
import CareerAnalysisSoftSKills from "../newScreens/CareerAnalysisSoftSkills";
import CareerAnalysisIdealCareer from "../newScreens/CareerAnalysisIdealCareer";
import CoachingFAQScreen from "../newScreens/CoachingFAQScreen";
import Profile from "../newScreens/Profile";
import EditProfile from "../newScreens/EditProfile";
import VideoAnalysisScreen from "../newScreens/VideoAnalysisScreen";
import TaskScoreScreen from "../newScreens/TaskScoreScreen";
import KeyTakeawayScreen from "../newScreens/KeyTakeawayScreen";
import JobDetailsScreen from "../newScreens/JobsScreen/JobDetailsScreen";
import JobFilters from "../newScreens/JobsScreen/JobFilters";
import Settings from "../newScreens/Settings";
import AccountManagement from "../newScreens/Settings/AccountManagement";
import ManageAccount from "../newScreens/Settings/ManageAccount";
import DeleteAccount from "../newScreens/Settings/DeleteAccount";
import DeactivateAccount from "../newScreens/Settings/DeactivateAccount";
import PaymentHistory from "../newScreens/Settings/PaymentHistory";
import PrivacyAndTnC from "../newScreens/Settings/PrivacyAndTnC";
import FAQs from "../newScreens/Settings/FAQs";
import ContactUs from "../newScreens/Settings/ContactUs";
import AddProjectStep1 from "../newScreens/Profile/TalentBoard/AddProjectStep1";
import AddProjectStep2 from "../newScreens/Profile/TalentBoard/AddProjectStep2";
import TalentBoardProject from "../newScreens/Profile/TalentBoard/TalentBoardProject";
import DraftedProjects from "../newScreens/Profile/TalentBoard/Draft";
import EditProjectStep1 from "../newScreens/Profile/TalentBoard/EditProjectStep1";
import EditProjectStep2 from "../newScreens/Profile/TalentBoard/EditProjectStep2";
import MainLayout from "../components/MainLayout";
import { useDispatch } from "react-redux";
import { homeActions } from "../redux/homeSlice";
import AddFeedPost from "../newScreens/Feed/AddFeedPost";
import ViewPostScreen from "../newScreens/Feed/ViewPostScreen";
import UserProfile from "../newScreens/UserProfile";
import MyPosts from "../newScreens/MyPosts";
import SavedPosts from "../newScreens/SavedPosts";
import JourneyScreen from "../newScreens/Journey";
import ViewProfilePicture from "../newScreens/ViewProfilePicture";
import MyFollowingsScreen from "../newScreens/MyFollowingsScreen";
import MyFollowersScreen from "../newScreens/MyFollowersScreen";
import Samples from "../newScreens/Profile/TalentBoard/samples/Samples";
import CareerTasterScreen from "../newScreens/CareerTastersScreen";
import HowThisWorks from "../newScreens/CareerTastersScreen/howThisWorks";
import TaskOverview from "../newScreens/CareerTastersScreen/taskOverView";
import TaskTypeUpload from "../newScreens/CareerTastersScreen/taskTypeUpload";
import CareerTasterFeedback from "../newScreens/CareerTastersScreen/careerTasterFeedback";
import Certifications from "../newScreens/EditProfile/certifications";
import { Linking, Platform } from "react-native";
import DeepLinkNavigation from "../utils/deepLinkNavigation";
import CareerTasterCompleted from "../newScreens/CareerTastersScreen/careerTasterCompletedScreen";
import ViewCompletedTask from "../newScreens/CareerTastersScreen/completedTaskScreen";
import CompleteTaskOverview from "../newScreens/CareerTastersScreen/completeOverview";
import ImageCarousel from "../newScreens/ImageCarousel";
import EmployerProfile from "../newScreens/EmployerProfile";
import CVATSScreen from "../newScreens/CVATSScreen";

const Stack = createNativeStackNavigator();

const headerProfileOptions = (showBack = true, title) => ({
  navigation,
}: any) => ({
  title: title || null,
  headerShown: true,
  headerLeft: () => (
    <View fd="row" ai="center" gap={5}>
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} pr={4}>
          <ICONS.ChevronLeft fill="#202020" />
        </TouchableOpacity>
      )}
      {/* <Text ftsz={16} weight="600" lh={21}>
        Tell us about you
      </Text> */}
    </View>
  ),
  // headerRight: () => <UploadCVButton />,
});

const headerEducationOptions = (title) => ({ navigation }: any) => ({
  title: title,
  headerShown: true,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={30} pr={4}>
      <ICONS.ChevronLeft fill="#202020" />
    </TouchableOpacity>
  ),
});

function AuthorisedStack() {
  let initialRouteName;
  const dispatch = useDispatch();
  let bottomTabInitialRoute="Dashboard";
  let currentStep;
  const user = useAppSelector((state) => state.user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ getJobs, { data: jobsData, isSuccess: jobFetchSuccess, isLoading: isFetching },] = api.useFetchGoogleJobsMutation();

  const getNewJobsCount = ()=>{
    const bodyFormData = new FormData();
    bodyFormData.append("user_id", user?.user_id);
    bodyFormData.append("page", 0);
    bodyFormData.append("sort", 0);
    getJobs(bodyFormData);
  }

  const [
    getUserData,
    { isSuccess, isError },
  ] = api.useLazyGetUserProfileQuery();

  const _handleOpenUrl=(event)=>{
    event?.url?.length>0 && event?.url.includes('mapout.com') && DeepLinkNavigation(event?.url);
  }

  useEffect(()=>{
    const linking = Linking.addEventListener('url', _handleOpenUrl);

    return ()=>{
      linking.remove();
    }
  },[])

  useEffect(()=>{
    if(isSuccess || isError){
      setProfileLoading(false);
    }
  },[isSuccess, isError])

  useEffect(()=>{
    if(user?.lastUpdate === UpdateStatus.Feed){
      getNewJobsCount();
    }
  },[user?.lastUpdate])

  useEffect(()=>{
    if(jobFetchSuccess){
      jobsData?.newJobsCount > 0 && dispatch(homeActions.updateJobsCount(jobsData?.newJobsCount));
    }
  },[jobFetchSuccess])

  useEffect(() => {
    setProfileLoading(true);
    getUserData(user?.user_id);
  }, [user?.user_id]);

     switch(user?.lastUpdate) {
      case UpdateStatus.Verified:
        initialRouteName = "SignUpForm";
        break;
      case UpdateStatus.Named:
        initialRouteName = "SelectCareerStage";
        break;
      case UpdateStatus.CareerStage:
        initialRouteName = "SelectFlow";
        break;
      case UpdateStatus.YesFlow:
        initialRouteName = "SelectRole";
        break;
      case UpdateStatus.Feed: {
        initialRouteName = "BottomTab";
        bottomTabInitialRoute = "Dashboard";
        break;
      }
      case UpdateStatus.Jobs: {
        initialRouteName = "BottomTab";
        bottomTabInitialRoute = "Dashboard";
        break;
      }
      case UpdateStatus.NoFlow:
        initialRouteName = "StartPersonalityTest";
        currentStep = 1;
        break;
      case UpdateStatus.TestComplete:
        initialRouteName = "TestResult";
        break;
      case UpdateStatus.NoFlow:
        initialRouteName = "StartPersonalityTest";
        currentStep = 1;
        break;
      case UpdateStatus.PersonalityTest:
        initialRouteName = "StartPersonalityTest";
        currentStep = 2;
        break;
      default:
        break;
    }

  if (profileLoading) {
    return (
      <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
        <ImageBackground
          f={1}
          jc="center"
          ai="center"
          source={require("../newScreens/DashboardScreen/DashboardBackground.png")}
          resizeMode="stretch">
          <ActivityIndicator color={'#000'} size={'large'}/>
        </ImageBackground>
      </MainLayout>
    );
  }

  return (
    <>
      <RewardPointModal />
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="SignUpForm" component={SignUpForm} />
        <Stack.Screen name="StartSkillTest" component={StartSkillTest} />
        <Stack.Screen
          name="SkillAndAspirations"
          component={SkillAndAspirations}
          options={{
            title: "Skills & Aspirations",
            headerShown: true,
          }}
        />
        <Stack.Screen name="CompleteSkillTest" component={CompleteSkillTest} />
        <Stack.Screen
          name="StartBackgroundTest"
          component={StartBackgroundTest}
        />
        <Stack.Screen
          name="PersonalityTest"
          component={PersonalityTest}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="StartCareerAnalysis"
          component={StartCareerAnalysis}
        />
        <Stack.Screen
          name="StartPersonalityTest"
          component={StartPersonalityTest}
          initialParams={{ currentStep }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          initialParams={{ initialScreen: bottomTabInitialRoute }}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Booking_page" component={Booking_page} />
        <Stack.Screen name="Timeslotbooking" component={Timeslotbooking}/>
        <Stack.Screen name="PlayVideoScreen" component={PlayVideoScreen} />
        <Stack.Screen name="CoachingScreen" component={CoachingScreen} />

        <Stack.Screen name="TaskScreen" component={TaskScreen} />
        <Stack.Screen name="JourneyScreen" component={JourneyScreen} />

        <Stack.Screen name="PlayVideoLink" component={PlayVideoLink} />

        <Stack.Screen name="RewardScreen" component={RewardScreen} />

        <Stack.Screen
          name="StreakAndRewardScreen"
          component={StreakAndRewardScreen}
        />

        <Stack.Screen
          name="CareerAnalysisScreen"
          component={CareerAnalysisScreen}
        />

        <Stack.Screen
          name="CareerAnalysisResult"
          component={CareerAnalysisResult}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="PersonalityTestResult"
          component={PersonalityTestResult}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="CareerAnalysisStepper"
          component={CareerAnalysisStepper}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="CareerAnalysisAspirations"
          component={CareerAnalysisAspirations}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="CareerAnalysisSoftSKills"
          component={CareerAnalysisSoftSKills}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="CareerAnalysisIdealCareer"
          component={CareerAnalysisIdealCareer}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen name="CoachingFAQScreen" component={CoachingFAQScreen} />

        <Stack.Screen name="Profile" component={Profile} />

        <Stack.Screen name="EditProfile" component={EditProfile} />

        <Stack.Screen
          name="VideoAnalysisScreen"
          component={VideoAnalysisScreen}
        />

        <Stack.Screen name="TaskScoreScreen" component={TaskScoreScreen} />

        <Stack.Screen name="KeyTakeawayScreen" component={KeyTakeawayScreen} />

        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />

        <Stack.Screen name="Settings" component={Settings} />

        <Stack.Screen name="AccountManagement" component={AccountManagement} />

        <Stack.Screen name="ManageAccount" component={ManageAccount} />

        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

        <Stack.Screen name="DeactivateAccount" component={DeactivateAccount} />

        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />

        <Stack.Screen name="PrivacyAndTnC" component={PrivacyAndTnC} />

        <Stack.Screen name="FAQs" component={FAQs} />

        <Stack.Screen name="ContactUs" component={ContactUs} />

        <Stack.Screen name="AddProjectStep1" component={AddProjectStep1} />

        <Stack.Screen name="AddProjectStep2" component={AddProjectStep2} />

        <Stack.Screen name="Samples" component={Samples} />

        <Stack.Screen
          name="TalentBoardProject"
          component={TalentBoardProject}
        />

        <Stack.Screen name="EditProjectStep1" component={EditProjectStep1} />
        <Stack.Screen name="DraftedProjects" component={DraftedProjects} />

        <Stack.Screen name="EditProjectStep2" component={EditProjectStep2} />

        <Stack.Screen name="AddFeedPost" component={AddFeedPost} options={{animation:"slide_from_bottom"}}/>

        <Stack.Screen name="ViewPostScreen" component={ViewPostScreen} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="MyPosts" component={MyPosts} />
        <Stack.Screen name="SavedPosts" component={SavedPosts} />
        <Stack.Screen name="MyFollowingsScreen" component={MyFollowingsScreen} />
        <Stack.Screen name="MyFollowersScreen" component={MyFollowersScreen} />
        <Stack.Screen name="ViewProfilePicture" component={ViewProfilePicture} options={{animation:"simple_push"}}/>
        <Stack.Screen name="CareerTasterScreen" component={CareerTasterScreen}/>
        <Stack.Screen name="HowThisWorks" component={HowThisWorks}/>
        <Stack.Screen name="TaskOverview" component={TaskOverview}/>
        <Stack.Screen name="TaskTypeUpload" component={TaskTypeUpload}/>
        <Stack.Screen name="CareerTasterFeedback" component={CareerTasterFeedback}/>
        <Stack.Screen name="CareerTasterCompleted" component={CareerTasterCompleted}/>
        <Stack.Screen name="ViewCompletedTask" component={ViewCompletedTask}/>
        <Stack.Screen name="CompleteTaskOverview" component={CompleteTaskOverview}/>
        <Stack.Screen name="Certifications" component={Certifications}/>
        <Stack.Screen name="ImageCarousel" component={ImageCarousel}/>
        <Stack.Screen name="EmployerProfile" component={EmployerProfile}/>
        <Stack.Screen name="JobFilters" component={JobFilters}/>
        <Stack.Screen name="CVATSScreen" component={CVATSScreen}/>
      </Stack.Navigator>
    </>
  );
}

export default AuthorisedStack;
