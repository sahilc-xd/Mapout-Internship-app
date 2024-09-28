import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Platform } from "react-native";
import MainLayout from "../../components/MainLayout";
import Icons from "../../constants/icons";
import {
  popNavigation,
} from "../../utils/navigationService";
import CommentsSection from "./CommentsSection";
import { useAppSelector } from "../../redux";
import PostOptionsModal from "./PostOptionsModal";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";

const ViewPostScreen = props => {
  const [optionsModal, setOptionsModal] = useState(false);
  const user = useAppSelector(state => state.user);
  const home = useAppSelector(state => state.home);
  const {
    data: itt,
    makeComment = false,
    showFollow = true,
    post_id = false
  } = props?.route?.params;
  const [postId, setPostId] = useState(itt?._id || false);
  const item = home?.posts[home?.posts?.findIndex(t => t._id === postId)];

  const [getPostById, {data, isSuccess, isFetching, isError}] = api.useLazyGetPostByIdQuery();

  useEffect(()=>{
    if(isError){
      Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
        popNavigation();
    }
  },[isError])

  useEffect(()=>{
    if(isSuccess && !isFetching){
      setPostId(data?._id);
    }
  },[isSuccess, isFetching])

  useEffect(()=>{
    if(post_id?.length>0 && !postId){
      getPostById({postId: post_id})
    }
  },[post_id])

  const closeModal = () => {
    setOptionsModal(false);
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./FeedBackground.png")}
        w={"100%"}
        h={"100%"}
        resizeMode="cover">
        {
        item?._id?.length > 0 && <PostOptionsModal
          postId={item?._id}
          showModal={optionsModal}
          closeModal={closeModal}
          userId={user?.user_id}
          targetId={item?.user_id}
          name={item?.name}
          isSuperUser={item?.isSuperUser}
        />
        }
        {!item?._id?.length > 0 ? <View f={1} jc="center" ai="center">
          <ActivityIndicator size={'large'} color={'#000'}/>
        </View> : <View f={1}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <>
              <ScrollView
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled">
                <>
                  <View mh={16} mv={8}>
                    <TouchableOpacity
                      onPress={() => {
                        popNavigation();
                      }}>
                      <Icons.BackArrow width={32} height={32} />
                    </TouchableOpacity>
                  </View>
                </>
                <CommentsSection
                  showFollow={showFollow}
                  makeComment={makeComment}
                  postId={item?._id}
                  setOptionsModal={setOptionsModal}
                />
              </ScrollView>
            </>
          </KeyboardAvoidingView>
        </View>}
      </ImageBackground>
    </MainLayout>
  );
};

export default ViewPostScreen;
