import React, { memo, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text, TextInput } from "../../components";
import { navigate, pushNavigation } from "../../utils/navigationService";
import { api } from "../../redux/api";
import Comment from "./Comment";
import { useAppSelector } from "../../redux";
import SubCommentsSection from "./SubCommentsSection";
import usePagination from "../../hooks/usePagination";
import { useDispatch } from "react-redux";
import { homeActions } from "../../redux/homeSlice";
import { Keyboard, Image as Img, useWindowDimensions } from "react-native";
import {
  postCategories,
  profilePicturePlaceholder,
} from "../../utils/constants";
import timeDiff from "../../utils/timeDiff";
import Icons from "../../constants/icons";
import Hyperlink from "react-native-hyperlink";
import { Linking } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const CommentsSection = props => {
  const {
    makeComment,
    postId = false,
    showFollow = true,
    setOptionsModal,
  } = props;
  const widthScreen = useWindowDimensions().width - 32;
  const home = useAppSelector(state => state.home);
  const item = home?.posts[home?.posts?.findIndex(t => t._id === postId)];
  const isFollowed =
    home?.userFollowingStatus[
      home?.userFollowingStatus?.findIndex(e => e.user_id === item?.user_id)
    ].isFollowed;
  const dispatch = useDispatch();
  const [imgHeight, setImgHeight] = useState(
    item?.images?.map(item => {
      return 200;
    }) || false,
  );
  const user = useAppSelector(state => state.user);
  const [comments, setComments] = useState([]);
  const [addCommentText, setAddCommentText] = useState("");
  const [
    addComment,
    { isSuccess: isSuccessPostComment, isLoading: isLoadingPostComment },
  ] = api.useAddPostCommentMutation();
  const [getComments, { data, isSuccess, isFetching }] =
    api.useLazyGetPostCommentsQuery();
  const [userComments, setUserComments] = useState([]);
  const [
    getUserComments,
    {
      data: userCommentsData,
      isSuccess: userCommentSuccess,
      isFetching: isFetchingPostComment,
    },
  ] = api.useLazyGetPostUserCommentsQuery();
  const {
    data: commentsList,
    page: commentsPage,
    onReachedEnd: onReachedCommentsEnd,
    loadingMoreData: loadingMoreComments,
    reset,
  } = usePagination("", comments, 10, 1);
  const [toggleLike, { isSuccess: isSuccessToggleLike, isLoading }] =
    api.useLikeAPostMutation();

  const [isTalentBoard, setIsTalentBoard] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (item?.talentBoard) {
      setIsTalentBoard(true);
      setTags(item?.talentBoard?.projectTags);
    }
  }, []);

  const handleClickedThumbnail = () => {
    navigate("TalentBoardProject", {
      isTalentBoard: true,
      talentBoardID: item?.talentBoard?.talentBoardId,
      projectId: item?.talentBoard?.talendBoardProjectId,
    });
  };

  const updateLike = () => {
    const posts = home?.posts || [];
    const thisPostIndex = home?.posts?.findIndex(t => t._id === item._id);
    let thisPostData = posts[home?.posts?.findIndex(t => t._id === item._id)];
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
    if (isSuccessToggleLike && !isLoading) {
      updateLike();
    }
  }, [isSuccessToggleLike, isLoading]);

  const getImageHeight = () => {
    const heights = [];
    item?.images?.forEach(it => {
      Img.getSize(
        it,
        (width, height) => {
          const computedHeight = height * (widthScreen / width);
          heights.push(computedHeight);
          if (heights?.length === item?.images?.length) {
            setImgHeight(heights);
          }
        },
        err => {
          console.log("err :>> ", err);
        },
      );
    });
  };

  const handleFollowButtonCLick = () => {
    logAnalyticsEvents("follow_user", { targetUserId: item?.user_id });
    followUser({ userId: user?.user_id, targetUserId: item?.user_id });
  };

  const [followUser, { isSuccess: isSuccessFollow }] =
    api.useFollowUserMutation();

  useEffect(() => {
    if (isSuccessFollow) {
      let followersData = [...home?.userFollowingStatus] || [];
      const thisFollowerIndex = home?.userFollowingStatus?.findIndex(
        e => e.user_id === item?.user_id,
      );
      let updatedFollowerData = { user_id: item?.user_id, isFollowed: true };
      followersData[thisFollowerIndex] = { ...updatedFollowerData };
      dispatch(homeActions.updateUserFollowingStatus(followersData));
    }
  }, [isSuccessFollow]);

  const playVideo = () => {
    navigate("PlayVideoLink", {
      url: item?.video?.videoUrl,
    });
  };

  const handleLikeButtonClick = () => {
    logAnalyticsEvents(item?.isLiked ? "unlike_post" : "like_post", {
      post_id: item?._id,
    });
    toggleLike({ user_id: user?.user_id, post_id: item?._id });
  };

  useEffect(() => {
    item?.images?.length > 0 && getImageHeight();
  }, [item?.images?.length]);

  const handleAddCommentClick = () => {
    addCommentText?.trim()?.length > 0 &&
      addComment({
        user_id: user?.user_id,
        post_id: postId,
        text: addCommentText,
      });
  };

  useEffect(() => {
    if (userCommentSuccess && !isFetchingPostComment) {
      setUserComments(userCommentsData?.comments);
    }
  }, [userCommentSuccess, isFetchingPostComment]);

  useEffect(() => {
    if (isSuccessPostComment && !isLoadingPostComment) {
      logAnalyticsEvents("add_comment", { postId: postId });
      const posts = home?.posts || [];
      const thisPostIndex = home?.posts?.findIndex(t => t._id === postId);
      let thisPostData = posts[home?.posts?.findIndex(t => t._id === postId)];
      thisPostData.commentsCount += 1;
      posts[thisPostIndex] = thisPostData;
      dispatch(homeActions.updatePosts(posts));
      setAddCommentText("");
      getUserComments({ postId: postId, userId: user?.user_id });
    }
  }, [isSuccessPostComment, isLoadingPostComment]);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setComments(data?.comments);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    getComments({ postId: postId, userId: user?.user_id, page: commentsPage });
  }, [commentsPage]);

  useEffect(() => {
    getUserComments({ postId: postId, userId: user?.user_id });
  }, []);

  const handleImageClick=(index)=>{
    navigate('ImageCarousel', {images: item?.images, index: index, text: item?.caption})
  }

  return (
    <View mb={25}>
      <FlatList
        style={{ paddingBottom: 20 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          onReachedCommentsEnd();
        }}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={20}
        nestedScrollEnabled={true}
        keyExtractor={(item, index) => item?._id}
        data={[
          { _id: "abcd", name: "addComment" },
          ...userComments,
          ...commentsList,
        ]}
        ItemSeparatorComponent={() => {
          return <View h={8} />;
        }}
        ListHeaderComponent={() => {
          return (
            <>
              <View bgc={"#FFFFFF"}>
                <View w={"100%"} pt={16} ph={16}>
                  <View fd="row" jc="space-between" mb={10}>
                    <TouchableOpacity f={1} fd="row">
                      <TouchableOpacity
                        onPress={() =>
                          pushNavigation("UserProfile", {
                            targetId: item?.user_id,
                          })
                        }>
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
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          pushNavigation("UserProfile", {
                            targetId: item?.user_id,
                          })
                        }
                        ml={10}
                        mt={-4}>
                        <Text ftsz={14} weight="500">
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
                      </TouchableOpacity>
                      {!item?.isSuperUser &&
                        showFollow &&
                        !isFollowed &&
                        user?.user_id != item.user_id && (
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
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setOptionsModal && setOptionsModal(true)}
                      hitSlop={12}
                      mt={8}>
                      <Icons.Threedots />
                    </TouchableOpacity>
                  </View>

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
                          .catch(() => {})
                      }>
                      <Text ftsz={14} weight="400">
                        {item?.caption}
                      </Text>
                    </Hyperlink>
                  </View>

                  {item?.video?.videoUrl &&
                    item?.video?.videoUrl?.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          playVideo();
                        }}
                        jc="center"
                        ai="center"
                        w={"100%"}>
                        <Image
                          source={{ uri: item?.video?.videoThumbnail }}
                          w={"100%"}
                          h={250}
                          br={12}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
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
                    <TouchableOpacity onPress={()=>handleImageClick(0)}>
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
                      <TouchableOpacity onPress={()=>handleImageClick(0)} w={"49.5%"}>
                        <Image
                          source={{ uri: item?.images[0] }}
                          w={'100%'}
                          h={250}
                          btlr={12}
                          bblr={12}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>handleImageClick(1)} w={"49.5%"}>
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
                      <TouchableOpacity onPress={()=>handleImageClick(0)} w={"49.5%"}>
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
                        <TouchableOpacity onPress={()=>handleImageClick(1)} w={"100%"}>
                          <Image
                            bw={1}
                            source={{ uri: item?.images[1] }}
                            w={'100%'}
                            h={124}
                            btrr={12}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleImageClick(2)} w={"100%"}>
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
                      <TouchableOpacity onPress={()=>handleImageClick(0)} w={"49.5%"}>
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
                        <TouchableOpacity onPress={()=>handleImageClick(1)} w={'100%'}>
                        <Image
                          bw={1}
                          source={{ uri: item?.images[1] }}
                          w={"100%"}
                          h={124}
                          btrr={12}
                          resizeMode="cover"
                        />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleImageClick(2)}>
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
                      <TouchableOpacity
                        onPress={() => {
                          handleLikeButtonClick();
                        }}>
                        {item?.isLiked ? (
                          <Icons.LikedIcon />
                        ) : (
                          <Icons.LikeIcon />
                        )}
                      </TouchableOpacity>
                      <Text ftsz={12} weight="400">
                        {item?.likesCount}{" "}
                        {item?.likesCount == 1 ? "Like" : "Likes"}
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
                </View>
              </View>
            </>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <>
              {
                <>
                  {index === 0 && (
                    <View
                      fd="row"
                      bbw={1}
                      ph={16}
                      pv={8}
                      bgc={"#FFF"}
                      bc={"#D5D5D5"}
                      ai="flex-end">
                      <View f={1}>
                        <TextInput
                          ftf="Manrope-Regular"
                          value={addCommentText}
                          autoFocus={makeComment}
                          onChangeText={setAddCommentText}
                          ftsz={12}
                          weight="400"
                          c={"#000"}
                          placeholder="Join the conversation here "
                          placeholderTextColor={"rgba(23, 23, 23, 0.5)"}
                          p={0}
                          m={0}
                          multiline
                        />
                      </View>
                      <TouchableOpacity onPress={handleAddCommentClick} ml={8}>
                        <Text ftsz={14} weight="400">
                          Add comment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {index !== 0 && (
                    <>
                      <Comment item={item} postId={postId} />
                      <SubCommentsSection postId={postId} item={item} />
                    </>
                  )}
                </>
              }
            </>
          );
        }}
      />
    </View>
  );
};

export default memo(CommentsSection);
