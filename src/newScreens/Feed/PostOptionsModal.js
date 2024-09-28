import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import Icon from "react-native-vector-icons/AntDesign";
import { Text } from "../../components";
import { ICONS } from "../../constants";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { homeActions } from "../../redux/homeSlice";
import { useDispatch } from "react-redux";
import Share from "react-native-share";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const PostOptionsModal = props => {
  const { showModal, closeModal, name = "", targetId, userId, postId, isSuperUser=false } = props;
  const home = useAppSelector(state => state.home);
  const isFollowed =
    home?.userFollowingStatus[
      home?.userFollowingStatus?.findIndex(e => e.user_id === targetId)
    ].isFollowed;
  const isSaved = home?.posts[home?.posts?.findIndex((t)=>t._id === postId)]?.isSaved;
  const dispatch = useDispatch();
  const [unFollowUser, { isSuccess: isSuccessUnFollow, isLoading }] =
    api.useUnfollowUserMutation();
  const [savePost, { isSuccess, isLoading: isSavingPost }] =
    api.useSavePostMutation();
  const [
    removeSavedPost,
    { isSuccess: removedSavedSuccess, isLoading: isRemovingPost },
  ] = api.useRemoveSavedPostMutation();
  const [
    followUser,
    { isSuccess: isSuccessFollow, isLoading: isLoadingFollow },
  ] = api.useFollowUserMutation();
  const [notInterested, {isSuccess: isSuccessNotInterested, isLoading: isLoadingNotInterested}] = api.usePostNotInterestedMutation();

  useEffect(() => {
    if (isSuccess && !isSavingPost) {
      logAnalyticsEvents('save_post', {postId: postId});
      const posts = [...home?.posts] || [];
      const thisPostIndex = home?.posts?.findIndex(t => t._id === postId);
      let thisPostData = posts[home?.posts?.findIndex(t => t._id === postId)];
      thisPostData.isSaved = true;
      posts[thisPostIndex] = thisPostData;
      dispatch(homeActions.updatePosts(posts));
    }
  }, [isSuccess, isSavingPost]);

  useEffect(() => {
    if (removedSavedSuccess && !isRemovingPost) {
      logAnalyticsEvents('unsave_post', {postId: postId});
      const posts = [...home?.posts] || [];
      const thisPostIndex = home?.posts?.findIndex(t => t._id === postId);
      let thisPostData = posts[home?.posts?.findIndex(t => t._id === postId)];
      thisPostData.isSaved = false;
      posts[thisPostIndex] = thisPostData;
      dispatch(homeActions.updatePosts(posts));
    }
  }, [removedSavedSuccess, isRemovingPost]);

  const handleSavePostClicked = () => {
    isSaved ? removeSavedPost({ post_id: postId, user_id: userId }) : savePost({ post_id: postId, user_id: userId });
  };

  const handleUnFollowButtonCLick = () => {
    isFollowed
      ? unFollowUser({ userId: userId, targetUserId: targetId })
      : followUser({ userId: userId, targetUserId: targetId });
  };

  const updateFollowStatus = () => {
    let followersData = [...home?.userFollowingStatus] || [];
    const thisFollowerIndex = home?.userFollowingStatus?.findIndex(
      e => e.user_id === targetId,
    );
    let updatedFollowerData = {
      ...followersData[thisFollowerIndex],
      isFollowed: isFollowed ? false : true,
    };
    followersData[thisFollowerIndex] = updatedFollowerData;
    dispatch(homeActions.updateUserFollowingStatus(followersData));
  };

  const handleNotInterested=()=>{
    notInterested({post_id: postId, user_id: userId})
  }

  useEffect(()=>{
    if(isSuccessNotInterested && !isLoadingNotInterested){
      const posts = [...home?.posts] || [];
      const thisPostIndex = home?.posts?.findIndex(t => t._id === postId);
      let thisPostData = {...posts[home?.posts?.findIndex(t => t._id === postId)]};
      thisPostData["hide"]=true;
      posts[thisPostIndex] = thisPostData;
      dispatch(homeActions.updatePosts(posts));
    }
  },[isSuccessNotInterested, isLoadingNotInterested])

  useEffect(() => {
    if (isSuccessUnFollow && !isLoading) {
      logAnalyticsEvents('unfollow_user', {targetUserId: targetId})
      updateFollowStatus();
    }
  }, [isSuccessUnFollow, isLoading]);

  useEffect(() => {
    if (isSuccessFollow && !isLoadingFollow) {
      logAnalyticsEvents('follow_user', {targetUserId: targetId})
      updateFollowStatus();
    }
  }, [isSuccessFollow, isLoadingFollow]);

  const insets = useSafeAreaInsets();

  const sharePost=()=>{
    logAnalyticsEvents('share_post', {postId: postId});
    const options = {
      message: `https://mapout.com/post/${postId}`,
    };
    Share.open(options).then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
  }

  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
        <View bgc={"#FFF"} btrr={24} btlr={24} pt={16}>
          <TouchableOpacity
            ph={32}
            hitSlop={10}
            onPress={closeModal}
            asf="flex-end">
            <Icon name="close" size={18} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSavePostClicked}
            mt={16}
            btw={1}
            jc="center"
            ai="center"
            pv={12}
            fd="row">
            <ICONS.SaveJob width={32} />
            <Text ml={8}>{isSaved ? "Unsave Post":  "Save Post"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePost} btw={1} jc="center" ai="center" pv={12} fd="row">
            <ICONS.ShareIcon width={32} />
            <Text ml={8}>Share post</Text>
          </TouchableOpacity>
          {(targetId != userId && !isSuperUser) && (
            <TouchableOpacity
              onPress={handleUnFollowButtonCLick}
              btw={1}
              jc="center"
              ai="center"
              ph={16}
              pv={12}
              fd="row">
              <Icon name="close" size={18} color={"#000"} />
              <Text numberOfLines={1} ml={8}>
                {isFollowed ? "Unfollow" : "Follow"} {name}
              </Text>
            </TouchableOpacity>
          )}
          {
            isSuperUser && targetId != userId && <TouchableOpacity
            onPress={handleNotInterested}
            btw={1}
            jc="center"
            ai="center"
            ph={16}
            pv={12}
            fd="row">
            <Icon name="close" size={18} color={"#000"} />
            <Text numberOfLines={1} ml={8}>
              Not Interested
            </Text>
            </TouchableOpacity>
          }
        </View>
        <View bgc={"#FFF"} h={insets.bottom} />
      </View>
    </Modal>
  );
};

export default PostOptionsModal;
