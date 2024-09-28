import React, { useEffect, useState } from 'react';
import SubCommentsSection from './SubCommentsSection';
import { Image, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import { profilePicturePlaceholder } from '../../utils/constants';
import timeDiff from '../../utils/timeDiff';
import Icons from '../../constants/icons';
import { api } from '../../redux/api';
import { useAppSelector } from '../../redux';
import { pushNavigation } from '../../utils/navigationService';
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';

const Comment = ({item, isSubComment=false, commentId=""})=>{
    const user = useAppSelector(state=>state.user);
    const [isLiked, setIsLiked] = useState(item?.isLiked);
    const [likeCount, setLikeCount] = useState(item?.likes || 0);
    const [updateLike, {isSuccess, isLoading}] = api.useLikeACommentMutation();

    const handleLikeButton = ()=>{
       isSubComment ? updateLike({
        comment_id : commentId,
      user_id : user?.user_id, reply_id : item?.replyId}) : updateLike({
        comment_id : item?._id,
      user_id : user?.user_id})
    }

    useEffect(()=>{
      if(isSuccess && !isLoading){
        if(isLiked){
          logAnalyticsEvents(isSubComment ? 'dislike_comment_reply' : 'dislike_comment', isSubComment ? {comment_id : commentId, reply_id : item?.replyId} : {comment_id : item?._id});
          setLikeCount(likeCount-1)
        }
        else{
          logAnalyticsEvents(isSubComment ? 'like_comment_reply' : 'like_comment', isSubComment ? {comment_id : commentId, reply_id : item?.replyId} : {comment_id : item?._id});
          setLikeCount(likeCount+1)
        }
        setIsLiked(!isLiked)
      } 
    },[isSuccess, isLoading])

    const visitProfile=()=>{
      pushNavigation("UserProfile", { targetId: item?.user_id });
    }

    return(
        <>
            <View mt={8} ph={16} fd="row">
              <TouchableOpacity onPress={visitProfile}>
                <Image source={{ uri: item?.profilePic?.length>0 ?  item?.profilePic : profilePicturePlaceholder}} w={34} h={34} br={34} />
              </TouchableOpacity>
              <View
                pv={8}
                ph={16}
                f={1}
                ml={8}
                br={12}
                bw={0.4}
                bc={"#D9BCFF"}
                bgc={"#FFF"}>
                <TouchableOpacity onPress={visitProfile} fd="row" jc="space-between" ai="center">
                  <View>
                    <Text ftsz={14} weight="500" c={"#000"}>
                      {item?.name}
                    </Text>
                    <Text ftsz={11} weight="400" c={"#7F8A8E"}>
                      {timeDiff(item?.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text ftsz={12} weight="400" mt={8}>
                  {item?.text}
                </Text>
                <View mt={8} fd="row" ai="center">
                  <TouchableOpacity onPress={handleLikeButton} fd="row" ai="center">
                    {isLiked ? <Icons.LikedIcon /> : <Icons.LikeIcon />}
                    <Text ftsz={12} weight="400" ml={4} mr={8}>
                     {likeCount} {likeCount> 1 ? "Likes" : "Like"}
                    </Text>
                  </TouchableOpacity>
                  {!isSubComment && <TouchableOpacity fd="row" ai="center">
                    <Icons.CommentsIcon />
                    <Text ml={4}>Replies</Text>
                  </TouchableOpacity>}
                </View>
              </View>
            </View>
            </>
    )
}

export default Comment;