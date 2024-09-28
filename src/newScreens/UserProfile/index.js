import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import MainLayout from "../../components/MainLayout";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";
import UserProfilePostSection from "./UserProfilePostSection";
import LinearGradient from "react-native-linear-gradient";
import { homeActions } from "../../redux/homeSlice";
import { useDispatch } from "react-redux";
import UserProfileTalentBoardSection from "./UserProfileTalentBoardSection";
import { profilePicturePlaceholder } from "../../utils/constants";
import usePagination from "../../hooks/usePagination";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import UserProfileDetails from "./UserProfileDetails";

const UserProfile = props => {
  const { targetId="", sharedId=false } = props?.route?.params;
  const user = useAppSelector(state => state.user);
  const home = useAppSelector(state => state.home);
  const [profileData, setProfileData] = useState(false);
  const isFollowed =
    home?.userFollowingStatus[
      home?.userFollowingStatus?.findIndex(e => e.user_id === profileData?.user_id)
    ]?.isFollowed;
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [getProfileData, { data, isSuccess, isFetching, isError }] =
    api.useLazyGetUserProfileDataQuery();
  const [getSharedProfileData, { data: sharedData, isSuccess: sharedDataSuccess, isFetching: fetchingSharedData, isError: isErrorSharedData }] =
    api.useLazyGetSharedUserProfileDataQuery();
  const [unFollowUser, { isSuccess: isSuccessUnFollow, isLoading }] =
    api.useUnfollowUserMutation();
  const [
    followUser,
    { isSuccess: isSuccessFollow, isLoading: isLoadingFollow },
  ] = api.useFollowUserMutation();
  const dispatch = useDispatch();
  const [followersCount, setFollowersCount] = useState(0);
  const handleFollowButtonPress = () => {
    isFollowed
      ? unFollowUser({ userId: user?.user_id, targetUserId: profileData?.user_id })
      : followUser({ userId: user?.user_id, targetUserId: profileData?.user_id });
  };
  
  useEffect(()=>{
    logAnalyticsEvents('user_profile_tab', {selectedTab: selectedTab})
  },[selectedTab])

  useEffect(() => {
    if (isSuccessUnFollow && !isLoading) {
      logAnalyticsEvents('unfollow_user', {targetUserId: profileData?.user_id});
      updateFollowStatus();
    }
  }, [isSuccessUnFollow, isLoading]);

  useEffect(() => {
    if (isSuccessFollow && !isLoadingFollow) {
      logAnalyticsEvents('follow_user', {targetUserId: profileData?.user_id});
      updateFollowStatus();
    }
  }, [isSuccessFollow, isLoadingFollow]);

  const updateFollowStatus = () => {
    if (isFollowed) {
      setFollowersCount(followersCount - 1);
    } else {
      setFollowersCount(followersCount + 1);
    }
    let followersData = [...home?.userFollowingStatus] || [];
    const thisFollowerIndex = home?.userFollowingStatus?.findIndex(
      e => e.user_id === profileData?.user_id,
    );
    let updatedFollowerData = {
      ...followersData[thisFollowerIndex],
      isFollowed: isFollowed ? false : true,
    };
    followersData[thisFollowerIndex] = updatedFollowerData;
    dispatch(homeActions.updateUserFollowingStatus(followersData));
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        text1: "Error",
        text2: "Something went wrong. Try again later.",
        type: "error",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setFollowersCount(data?.data?.followers);
      setProfileData(data?.data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isErrorSharedData) {
      Toast.show({
        text1: "Error",
        text2: "Something went wrong. Try again later.",
        type: "error",
      });
    }
  }, [isErrorSharedData]);

  useEffect(() => {
    if (sharedDataSuccess) {
      setFollowersCount(sharedData?.data?.followers);
      setProfileData(sharedData?.data);
    }
  }, [sharedDataSuccess]);

  useEffect(() => {
    !sharedId ? getProfileData({ profileUserId: targetId }) : getSharedProfileData({shareID: sharedId});
  }, []);

  const [postsArray, setPostsArray] = useState([]);
  const {
    data: postList,
    page: postListPage,
    onReachedEnd: onReachedPostEnd,
    loadingMoreData: loadMorePostData,
    reset,
  } = usePagination("", postsArray, 20, 1);

  const [getPosts, { data: postData, isSuccess: isSuccessPostData, isFetching:isFetchingPosts }] = api.useLazyGetUsersPostsQuery();

  useEffect(() => {
    if(profileData?.user_id?.length>0){
      getPosts({ page: postListPage, userId: user?.user_id, targetId: profileData?.user_id });
    }
  }, [postListPage, profileData?.user_id]);

  useEffect(() => {
    if (!isFetchingPosts && isSuccessPostData) {
      setPostsArray(postData?.posts);
    }
  }, [isSuccessPostData, isFetchingPosts]);

  const renderProfile = ({ item, index }) => {
    if (index === 0) {
      return (
        <View bgc={"#FFF"}>
          <View fd="row" bbw={1}>
          <TouchableOpacity
              onPress={() => {
                setSelectedTab("Profile");
              }}
              bc={"#6691FF"}
              bbw={selectedTab === "Profile" ? 2 : 0}
              f={1}
              jc="center"
              ai="center"
              pv={8}>
              <Text ftsz={14} weight="400">
              Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Talent Board");
              }}
              bc={"#6691FF"}
              bbw={selectedTab === "Talent Board" ? 2 : 0}
              f={1}
              jc="center"
              ai="center"
              pv={8}>
              <Text ftsz={14} weight="400">
                Talent Board
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Posts");
              }}
              bc={"#6691FF"}
              bbw={selectedTab === "Posts" ? 2 : 0}
              f={1}
              jc="center"
              ai="center"
              pv={8}>
              <Text ftsz={14} weight="400">
                Posts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <>
          {selectedTab === "Profile" && <UserProfileDetails data={profileData} /> }
          {selectedTab === "Talent Board" && <UserProfileTalentBoardSection data={profileData} /> }
          {selectedTab === "Posts" && <UserProfilePostSection postList={postList} isFetching={isFetchingPosts} postListPage={postListPage}/>}
        </>
      );
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./UserProfileBackground.png")}
        resizeMode="cover">
        <>
          {(isFetching || fetchingSharedData) ? (
            <View f={1} jc="center" ai="center">
              <ActivityIndicator color={"#000"} size={"large"} />
            </View>
          ) : (
            <View f={1}>
              <View mh={16} mv={8} jc="space-between" ai="center" fd="row">
                <TouchableOpacity
                  onPress={() => {
                    popNavigation();
                  }}>
                  <Icons.BackArrow width={32} height={32} />
                </TouchableOpacity>
                {!profileData?.isSuperUser && profileData?.user_id != user?.user_id && (
                  <TouchableOpacity
                    onPress={handleFollowButtonPress}
                    br={4}
                    bgc={isFollowed ? "#7F8A8E" : "#000"}
                    ph={16}
                    pv={6}>
                    <Text c={"#FFF"}>
                      {isFollowed ? "Unfollow" : "+ Follow"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                f={1}
                nestedScrollEnabled={true}
                data={["StickyHeader", "Data"]}
                stickyHeaderIndices={[1]}
                onEndReached={()=>{
                  selectedTab==='Posts' && onReachedPostEnd()
                }}
                onEndReachedThreshold={0.5}
                renderItem={renderProfile}
                ListHeaderComponent={() => {
                  return (
                    <>
                      <View mt={32} mh={16} fd="row">
                        <View w={"30%"}>
                          <View br={12} w={"100%"} h={180}>
                            {profileData?.profileVideo?.thumbnail?.length >
                            0 ? (
                              <>
                                <Image
                                  br={12}
                                  source={{
                                    uri: profileData?.profileVideo?.thumbnail,
                                  }}
                                  w={"100%"}
                                  h={"100%"}
                                  resizeMode="cover"
                                />
                                <TouchableOpacity
                                  onPress={() => {
                                    navigate("PlayVideoLink", {
                                      url: profileData?.profileVideo?.link,
                                    });
                                  }}
                                  br={1000}
                                  bgc={"rgba(0,0,0,0.4)"}
                                  p={2}
                                  z={10}
                                  po="absolute"
                                  b={8}
                                  asf="center">
                                  <Icons.PlayButton width={24} height={24} />
                                </TouchableOpacity>
                              </>
                            ) : (
                              <View
                                br={12}
                                bgc={"#FFF"}
                                w={"100%"}
                                h={"100%"}
                                ai="center"
                                jc="center">
                                <Icons.NoVideo />
                                <Text
                                  po="absolute"
                                  b={16}
                                  ta="center"
                                  ftsz={10}
                                  weight="500"
                                  c={"#7F8A8E"}>
                                  No profile video added
                                </Text>
                              </View>
                            )}
                          </View>
                          <Image
                            po="absolute"
                            t={-32}
                            r={-32}
                            source={{
                              uri:
                                profileData?.profilePic ||
                                profilePicturePlaceholder,
                            }}
                            w={80}
                            br={80}
                            h={80}
                            resizeMode="cover"
                          />
                        </View>
                        <View jc="space-around" f={1} ml={40}>
                          <Text ftsz={20} weight="600">
                            {profileData?.name}
                          </Text>
                          <View fd="row" fw="wrap" ai="center">
                            <Text ftsz={13} weight="500">
                              {followersCount} followers
                            </Text>
                          </View>
                          <View fd="row" ai="center">
                            <Icons.Degree width={20} height={20} />
                            <Text ftsz={12} weight="400" ml={4}>
                              {profileData?.career_stage}
                            </Text>
                          </View>
                          {profileData?.current_location?.length > 0 && (
                            <View fd="row" ai="center">
                              <Icons.LocationPin width={20} height={20} />
                              <Text ftsz={12} weight="400" ml={4}>
                                {profileData?.current_location}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View mh={16} mb={16}>
                        {profileData?.career_headline?.length > 0 && (
                          <LinearGradient
                            colors={["#D8E3FC", "#E3D5F3"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                              borderRadius: 8,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              marginTop: 16,
                            }}>
                            <Text ftsz={12} weight="500" ta="center">
                              {profileData?.career_headline}
                            </Text>
                          </LinearGradient>
                        )}
                      </View>
                    </>
                  );
                }}
              />
            </View>
          )}
        </>
      </ImageBackground>
    </MainLayout>
  );
};

export default UserProfile;
