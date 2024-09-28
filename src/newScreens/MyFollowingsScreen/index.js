import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
    ActivityIndicator,
    FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { Text, TextInput } from "../../components";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import usePagination from "../../hooks/usePagination";
import { homeActions } from "../../redux/homeSlice";
import { useDispatch } from "react-redux";
import { profilePicturePlaceholder } from "../../utils/constants";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const MyFollowingsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const user = useAppSelector(state=>state.user);
  const home = useAppSelector(state=>state.home);
  const debouncedSearchText = useDebounce(searchText, 300);
  const [followersList, setFollowersList] = useState([]);
  const dispatch = useDispatch();
  const {
    data: list,
    page: page,
    onReachedEnd: onReachedEnd,
    loadingMoreData: loadingMoreData,
  } = usePagination(debouncedSearchText, followersList, 20, 1);
  const [unFollowUser, { isSuccess: isSuccessUnFollow, isLoading }] =
    api.useUnfollowUserMutation();
  const [getFollowings, {data, isSuccess, isFetching}] = api.useLazyGetFollowingsQuery();
  const [
    followUser,
    { isSuccess: isSuccessFollow, isLoading: isLoadingFollow },
  ] = api.useFollowUserMutation();

  useEffect(()=>{
    getFollowings({userId: user?.user_id ,searchKey: debouncedSearchText, page: page})
  },[debouncedSearchText, page])

  useEffect(()=>{
    if(isSuccess && !isFetching){
        setFollowersList(data?.userFollowings);
    }
  },[isSuccess, isFetching])

  const handleClick = (targetId, status)=>{
    logAnalyticsEvents(status === true ? 'follow_user' : 'unfollow_user', {targetUserId: targetId})
    let followersData = [...home?.userFollowingStatus] || [];
    const thisFollowerIndex = home?.userFollowingStatus?.findIndex(
      e => e.user_id === targetId,
    );
    let updatedFollowerData = {
      ...followersData[thisFollowerIndex],
      isFollowed: status,
    };
    followersData[thisFollowerIndex] = updatedFollowerData;
    dispatch(homeActions.updateUserFollowingStatus(followersData));
    status ? followUser({ userId: user?.user_id, targetUserId: targetId }) : unFollowUser({ userId: user?.user_id, targetUserId: targetId })
  }

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../EditProfile/EditProfileBackground.png")}
        resizeMode="cover">
        <View f={1}>
          <View mh={16}>
            <View pt={8} pb={8} ai="center" jc="center">
              <TouchableOpacity
                po="absolute"
                l={0}
                onPress={() => {
                  popNavigation();
                }}>
                <Icons.BackArrow width={32} height={32} />
              </TouchableOpacity>
              <Text ta="center" ml={8} ftsz={17} weight="500">
                Following
              </Text>
            </View>
          </View>
          <View
            mt={8}
            bc={"#7F8A8E"}
            bgc={"rgba(255, 255, 255, 0.65)"}
            ph={8}
            pv={4}
            br={30}
            bw={0.4}
            mh={16}
            fd="row"
            ai="center">
            <Icons.SearchJob />
            <TextInput
              value={searchText}
              onChangeText={t => setSearchText(t)}
              f={1}
              m={0}
              pv={0}
              ph={8}
              c={"#000"}
              ftsz={12}
              ftf="Manrope-Medium"
              placeholder="Search"
              placeholderTextColor={"#000"}
            />
          </View>
          <View f={1}>
                {(page ==1 && isFetching) ? <View f={1} ac="center" jc="center"><ActivityIndicator size={'large'} color={'#000'}/></View> : <FlatList
                    f={1}
                    mt={16}
                    data={[...list]}
                    keyExtractor={(item,index)=>{
                        return item?.user_id
                    }}
                    ListEmptyComponent={()=>{
                        return(
                            <View f={1}>
                                <Text ta="center">No followings found</Text>
                            </View>
                        )
                    }}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.2}
                    onEndReached={onReachedEnd}
                    renderItem={({item})=>{
                        const newItem = home?.userFollowingStatus[home?.userFollowingStatus?.findIndex(t => t.user_id === item.user_id)];
                        return(
                            <>
                                <View btw={0.3} bbw={0.1} ph={16}>
                                    <View mv={16} fd="row" ai="center">
                                        <TouchableOpacity onPress={()=>{
                                          logAnalyticsEvents('user_profile_visited', {targetId: item?.user_id})
                                          navigate('UserProfile', { targetId: item?.user_id })
                                        }}>
                                        <Image source={{uri: item?.profilePic || profilePicturePlaceholder}} w={35} h={35} br={35}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                          logAnalyticsEvents('user_profile_visited', {targetId: item?.user_id})
                                          navigate('UserProfile', { targetId: item?.user_id })
                                        }} f={1} mh={16}>
                                            <Text numberOfLines={1}>{item?.name}</Text>
                                            {item?.careerHeadline?.length>0 && <Text>{item?.careerHeadline}</Text>}
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>handleClick(item?.user_id, newItem?.isFollowed ? false : true)} br={4} bgc={'#000'} pv={6} ph={12}>
                                            <Text c={'#FFF'}>{newItem?.isFollowed ? "Unfollow" : "+ Follow"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )
                    }}
                />}
          </View>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default MyFollowingsScreen;
