import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text, TextInput } from "../../components";
import { pushNavigation } from "../../utils/navigationService";
import Comment from "./Comment";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import usePagination from "../../hooks/usePagination";
import { Keyboard } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const SubCommentsSection = ({ item, postId }) => {
  const user = useAppSelector(state => state.user);
  const visitProfile = () => {
    pushNavigation("UserProfile");
  };

  const [subComments, setSubComments] = useState([]);
  const [viewMoreCount, setViewMoreCount] = useState(0);
  const {
    data: subCommentsList,
    page: subCommentsPage,
    onReachedEnd: onReachedSubCommentsEnd,
    loadingMoreData: loadingMoreSubComments,
    reset,
  } = usePagination("", subComments, 4, 1);
  const [subCommentText, setSubCommentText] = useState("");
  const [getPostCommentsReplies, { data, isSuccess, isFetching }] =
    api.useLazyGetPostCommentsRepliesQuery();
  const [addPostReply, { isLoading, isSuccess: isSuccessCommentReply }] =
    api.useAddPostCommentReplyMutation();
  const [userSubComments, setUserSubComments] = useState([]);
  const [
    getUserReplies,
    {
      data: userRepliesData,
      isSuccess: userRepliesSuccess,
      isFetching: userRepliesLoading,
    },
  ] = api.useLazyGetPostUserCommentsRepliesQuery();

  const handleAddReply = () => {
    subCommentText?.trim()?.length > 0 &&
      addPostReply({
        comment_id: item?._id,
        user_id: user?.user_id,
        text: subCommentText?.trim(),
      });
      Keyboard.dismiss();
  };

  useEffect(() => {
    if (userRepliesSuccess && !userRepliesLoading) {
      setUserSubComments(userRepliesData?.replies);
    }
  }, [userRepliesSuccess, userRepliesLoading]);

  useEffect(() => {
    if (!isLoading && isSuccessCommentReply) {
      logAnalyticsEvents('post_comment_reply',{postId: postId, commentId: item?._id})
      setSubCommentText("");
      getUserReplies({
        postId: postId,
        userId: user?.user_id,
        commentId: item?._id,
      });
    }
  }, [isLoading, isSuccessCommentReply]);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setViewMoreCount(data?.noOfRemainingReplies);
      setSubComments(data?.replies);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    getPostCommentsReplies({
      postId: postId,
      userId: user?.user_id,
      commentId: item?._id,
      page: subCommentsPage,
    });
  }, [subCommentsPage]);

  useEffect(() => {
    getUserReplies({
      postId: postId,
      userId: user?.user_id,
      commentId: item?._id,
    });
  }, []);

  return (
    <>
      <View>
        {
          <View
            ai="flex-end"
            ph={16}
            bw={0.4}
            pv={16}
            bc={"#D9BCFF"}
            br={12}
            mr={16}
            ml={60}
            fd="row"
            bgc={"#FFF"}>
            <TextInput
              onChangeText={t => {
                setSubCommentText(t);
              }}
              value={subCommentText}
              c={"#000"}
              placeholder="Reply..."
              placeholderTextColor={"#7F8A8E"}
              multiline
              textAlignVertical="center"
              f={1}
              m={0}
              p={0}
            />
            <TouchableOpacity onPress={handleAddReply} ml={16}>
              <Text>Reply</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
      <FlatList
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => index.toString()}
        data={[...userSubComments, ...subCommentsList]}
        ListFooterComponent={() => {
          return (
            <>
              {viewMoreCount > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    onReachedSubCommentsEnd();
                  }}
                  ml={60 + 16 + 60 - 32}>
                  <Text>View more replies</Text>
                </TouchableOpacity>
              )}
            </>
          );
        }}
        renderItem={({ item: it }) => {
          return (
            <>
              <View pl={44}>
                <Comment
                  item={it}
                  isSubComment={true}
                  commentId={item?._id}
                />
              </View>
            </>
          );
        }}
      />
    </>
  );
};

export default SubCommentsSection;
