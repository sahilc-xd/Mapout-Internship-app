import React, { memo, useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import {
  useWindowDimensions,
  Image as Img,
  Alert,
  Linking,
} from "react-native";
import timeDiff from "../../utils/timeDiff";
import {
  postCategories,
  profilePicturePlaceholder,
} from "../../utils/constants";
import { navigate, pushNavigation } from "../../utils/navigationService";
import { useDispatch } from "react-redux";
import { homeActions } from "../../redux/homeSlice";
import PostOptionsModal from "./PostOptionsModal";
import Hyperlink from "react-native-hyperlink";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { useDebounceClick } from "../../hooks/useDebounceClick";

const PostDetails = ({ item, it, showFollow, openModal, isFollowed, handleFollowButtonCLick }) => {
  const user = useAppSelector(state => state.user);
  
  return (
    <>
      <View fd="row" jc="space-between" mb={10}>
        <View f={1} fd="row">
          <TouchableOpacity
            onPress={() => {
              logAnalyticsEvents("user_profile_visited", {
                targetId: it?.user_id,
              });
              pushNavigation("UserProfile", { targetId: it?.user_id });
            }}
            fd="row">
            <Image
              br={38}
              h={38}
              w={38}
              source={{
                uri:
                  item?.profilePic?.length > 0
                    ? item?.profilePic
                    : profilePicturePlaceholder,
              }}
            />
            <View ml={10} mt={-4}>
              <Text ftsz={14} weight="500" numberOfLines={1}>
                {item?.name?.substring(0, 20)}
              </Text>
              {item?.subName?.length > 0 && (
                <Text ftsz={11} weight="500" c={"#7F8A8E"}>
                  {item?.subName}
                </Text>
              )}
              <Text ftsz={11} weight="400" c={"#7F8A8E"}>
                {timeDiff(item?.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
          {!it?.isSuperUser && showFollow && !isFollowed && user?.user_id != it.user_id && (
            <TouchableOpacity
              onPress={handleFollowButtonCLick}
              ph={12}
              pv={6}
              br={4}
              asf="flex-start"
              bgc={"#000"}
              ml={8}
              mt={-4}>
              <Text ftsz={10} weight="600" c={"#FFF"}>
                + Follow
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={openModal}
          hitSlop={12}
          mt={8}>
          <Icons.Threedots />
        </TouchableOpacity>
      </View>
    </>
  );
};

const PostCard = props => {
  const [optionsModal, setOptionsModal] = useState(false);
  const dispatch = useDispatch();
  const { item: it, showFollow = true } = props;
  const home = useAppSelector(state => state.home);
  const item = home?.posts[home?.posts?.findIndex(t => t._id === it._id)];
  const [
    followUser,
    { isSuccess: isSuccessFollow, isLoading: isLoadingFollow },
  ] = api.useFollowUserMutation();
  const isFollowed =
    home?.userFollowingStatus[
      home?.userFollowingStatus?.findIndex(e => e.user_id === it?.user_id)
    ].isFollowed;
  const user = useAppSelector(state => state.user);
  const [toggleLike, { isSuccess, isLoading }] = api.useLikeAPostMutation();

  const [isTalentBoard, setIsTalentBoard] = useState(false);
  const [tags, setTags] = useState([]);

  const [ imgHeight,setImgHeight] = useState(250);
  const widthScreen= useWindowDimensions().width - 32;

  const getImageHeight=()=>{
    item?.video?.videoThumbnail?.length>0 && Img.getSize(item?.video?.videoThumbnail ,(width, height)=>{
      const h = height * (widthScreen / width);
      if(h<=250){
        setImgHeight(h);
      }
    });
  }

  useEffect(()=>{
    item?.video?.videoThumbnail?.length>0 & getImageHeight();
  },[])

  useEffect(() => {
    if (item?.talentBoard) {
      setIsTalentBoard(true);
      setTags(item?.talentBoard?.projectTags);
    }
  }, []);

  const closeModal = () => {
    setOptionsModal(false);
  };

  const openModal = () => {
    setOptionsModal(true);
  };

  const goToPost = () => {
    pushNavigation("ViewPostScreen", {
      data: it,
      showFollow: showFollow,
    });
  }

  const handleTap = useDebounceClick(goToPost, 200);


  const playVideo = () => {
    navigate("PlayVideoLink", {
      url: item?.video?.videoUrl,
    });
  };

  const handleFollowButtonCLick = () => {
    logAnalyticsEvents("follow_user", { targetUserId: item?.user_id });
    followUser({ userId: user?.user_id, targetUserId: item?.user_id });
  };

  useEffect(() => {
    if (isSuccessFollow && !isLoadingFollow) {
      let followersData = [...home?.userFollowingStatus] || [];
      const thisFollowerIndex = home?.userFollowingStatus?.findIndex(
        e => e.user_id === it?.user_id,
      );
      let updatedFollowerData = { user_id: it?.user_id, isFollowed: true };
      followersData[thisFollowerIndex] = { ...updatedFollowerData };
      dispatch(homeActions.updateUserFollowingStatus(followersData));
    }
  }, [isSuccessFollow, isLoadingFollow]);

  const updateLike = () => {
    const posts = home?.posts || [];
    const thisPostIndex = home?.posts?.findIndex(t => t._id === it._id);
    let thisPostData = posts[home?.posts?.findIndex(t => t._id === it._id)];
    if (thisPostData.isLiked) {
      thisPostData.likesCount = thisPostData.likesCount - 1;
    } else {
      thisPostData.likesCount = thisPostData.likesCount + 1;
    }
    thisPostData.isLiked = !thisPostData.isLiked;
    posts[thisPostIndex] = thisPostData;
    dispatch(homeActions.updatePosts(posts));
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      updateLike();
    }
  }, [isSuccess, isLoading]);

  const handleLikeButtonClick = () => {
    logAnalyticsEvents(item?.isLiked ? "unlike_post" : "like_post", {
      post_id: item?._id,
    });
    toggleLike({ user_id: user?.user_id, post_id: item?._id });
  };

  const handleClickedThumbnail = () => {
    navigate("TalentBoardProject", {
      isTalentBoard: true,
      talentBoardID: item?.talentBoard?.talentBoardId,
      projectId: item?.talentBoard?.talendBoardProjectId,
      hideButtons: true,
    });
  };

  const handleImageClick = (index) => {
    navigate('ImageCarousel', { images: item?.images, index: index, text: item?.caption })
  }

  return (
    item?.hide ? <></> :
      <>
        <PostOptionsModal
          postId={item?._id}
          showModal={optionsModal}
          closeModal={closeModal}
          userId={user?.user_id}
          targetId={item?.user_id}
          name={item?.name}
          isSuperUser={item?.isSuperUser}
        />
        <TouchableOpacity
          onPress={() => {
            handleTap();
          }}
          activeOpacity={1}
          f={1}
          ai="center"
          bgc={"#FFFFFF"}
          bc={"#D9BCFF"}
          bw={0.5}
          mv={8}>
          <View w={"100%"} mt={15} mb={25} ph={20}>
            <PostDetails 
              item={item} 
              it={it} 
              showFollow={showFollow} 
              openModal={openModal} 
              isFollowed={isFollowed} 
              handleFollowButtonCLick={handleFollowButtonCLick}
            />

            {isTalentBoard ? (
              <View fd="row">
                <View
                  bgc={"#f7e165"}
                  mr={8}
                  asf="baseline"
                  ph={16}
                  pv={4}
                  br={40}>
                  <Text ftsz={11} weight="500">
                    {item?.category}
                  </Text>
                </View>
                {tags?.map((tag, index) => (
                  <View
                    key={index}
                    bgc={"#fff6c5"}
                    mr={8}
                    asf="baseline"
                    ph={12}
                    pv={4}
                    br={40}>
                    <Text ftsz={11} weight="500">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View
                bgc={postCategories[item?.category]?.bgColor}
                mr={8}
                asf="baseline"
                ph={16}
                pv={4}
                br={40}>
                <Text ftsz={11} weight="500">
                  {item?.category}
                </Text>
              </View>
            )}

            <View mv={10}>
              <Hyperlink
                linkStyle={{ color: "#6691FF" }}
                onPress={(url, text) =>
                  Linking.openURL(url)
                    .then()
                    .catch(() => { })
                }>
                <Text ftsz={14} weight="400">
                  {item?.caption?.substring(0, 250)}
                  {item?.caption?.length > 250 && (
                    <Text 
                      onPress={() => {
                        logAnalyticsEvents("read_more_text", { post_id: item?._id });
                        handleTap();
                      }}
                      ftw="500"
                      ftsz={13}
                      c={"#6691FF"}>
                      {"  ...read more"}
                    </Text>)
                  }
                </Text>
              </Hyperlink>
            </View>
            

            {item?.video?.videoUrl && item?.video?.videoUrl?.length > 0 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  playVideo();
                }}
                w={"100%"}
                jc="center"
                ai="center">
                <Image
                  source={{ uri: item?.video?.videoThumbnail }}
                  w={"100%"}
                  h={250}
                  br={12}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    playVideo();
                  }}
                  asf="center"
                  po="absolute"
                  z={1}
                  br={50}
                  bgc="rgba(0,0,0,0.4)">
                  <Icons.PlayButton fill={"#000"} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            {isTalentBoard && item?.talentBoard && (
              <TouchableOpacity
                style={{ position: "relative" }}
                onPress={handleClickedThumbnail}>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                    padding: 10,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    width: "100%",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}>
                  <Text c={"#fff"} ftw="500">
                    {item?.talentBoard?.projectTitle}
                  </Text>
                </View>
                <Image
                  source={{ uri: item?.talentBoard?.projectCoverImg }}
                  w={"100%"}
                  h={250}
                  br={12}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {item?.images?.length === 1 && (
              <TouchableOpacity onPress={() => handleImageClick(0)}>
                <Image
                  source={{ uri: item?.images[0] }}
                  w={"100%"}
                  h={250}
                  br={12}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {item?.images?.length === 2 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity onPress={() => handleImageClick(0)} w={"49.5%"}>
                  <Image
                    source={{ uri: item?.images[0] }}
                    w={'100%'}
                    h={250}
                    btlr={12}
                    bblr={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleImageClick(1)} w={"49.5%"}>
                  <Image
                    source={{ uri: item?.images[1] }}
                    w={"100%"}
                    h={250}
                    btrr={12}
                    bbrr={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}

            {item?.images?.length === 3 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity onPress={() => handleImageClick(0)} w={"49.5%"}>
                  <Image
                    source={{ uri: item?.images[0] }}
                    w={'100%'}
                    h={250}
                    btlr={12}
                    bblr={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View w={"49.5%"} jc="space-between">
                  <TouchableOpacity onPress={() => handleImageClick(1)} w={"100%"}>
                    <Image
                      bw={1}
                      source={{ uri: item?.images[1] }}
                      w={'100%'}
                      h={124}
                      btrr={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleImageClick(2)} w={"100%"}>
                    <Image
                      source={{ uri: item?.images[2] }}
                      w={"100%"}
                      h={124}
                      bbrr={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {item?.images?.length > 3 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity onPress={() => handleImageClick(0)} w={"49.5%"}>
                  <Image
                    source={{ uri: item?.images[0] }}
                    w={'100%'}
                    h={250}
                    btlr={12}
                    bblr={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View w={"49.5%"} jc="space-between">
                  <TouchableOpacity onPress={() => handleImageClick(1)} w={'100%'}>
                    <Image
                      bw={1}
                      source={{ uri: item?.images[1] }}
                      w={"100%"}
                      h={124}
                      btrr={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleImageClick(2)}>
                    <Image
                      source={{ uri: item?.images[2] }}
                      w={"100%"}
                      h={124}
                      bbrr={12}
                      resizeMode="cover"
                    />
                    <View
                      bbrr={12}
                      po="absolute"
                      w={"100%"}
                      h={124}
                      bgc={"rgba(0,0,0,0.5)"}
                      ai="center"
                      jc="center">
                      <Text ftsz={28} weight="600" c={"#FFF"}>
                        +{item?.images?.length - 2}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View fd="row" ai="center" gap={19} mv={15}>
              <View fd="row" ai="center" gap={4}>
                <TouchableOpacity onPress={handleLikeButtonClick}>
                  {item?.isLiked ? <Icons.LikedIcon /> : <Icons.LikeIcon />}
                </TouchableOpacity>
                <Text ftsz={12} weight="400">
                  {item?.likesCount} {item?.likesCount == 1 ? "Like" : "Likes"}
                </Text>
              </View>
              <View fd="row" ai="center" gap={4}>
                <Icons.CommentsIcon />
                <Text ftsz={12} weight="400">
                  {item?.commentsCount}{" "}
                  {item?.commentsCount == 1 ? "Comment" : "Comments"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                pushNavigation("ViewPostScreen", {
                  data: it,
                  makeComment: true,
                  showFollow: showFollow,
                });
              }}
              fd="row"
              bbw={1}
              pv={8}
              bc={"#D5D5D5"}
              ai="center">
              <View f={1}>
                <Text ftsz={12} weight="400" c={"rgba(23, 23, 23, 0.5)"}>
                  Join the conversation here{" "}
                </Text>
              </View>
              <View>
                <Text ftsz={14} weight="400">
                  Add comment
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </>
  );
};

export default memo(PostCard);
