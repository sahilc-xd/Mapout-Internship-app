import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { ActivityIndicator, FlatList, ImageBackground, TouchableOpacity, View } from "react-native-style-shorthand";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import usePagination from "../../hooks/usePagination";
import { Text } from "../../components";
import PostCard from "../Feed/PostCard";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const MyPosts = () => {
    const user = useAppSelector(state=>state?.user);
    const [getMyPosts, {data : postsList, isSuccess: isSuccessPosts, isFetching}] = api.useLazyGetUsersPostsQuery();
    const [postsArray, setPostsArray] = useState([]);
    const {
        data: postList,
        page: postListPage,
        onReachedEnd: onReachedPostEnd,
        loadingMoreData: loadMorePostData,
        reset,
      } = usePagination("", postsArray, 20, 1);

      useEffect(() => {
        if (isSuccessPosts && !isFetching) {
          setPostsArray(postsList?.posts);
        }
      }, [isSuccessPosts, isFetching]);

      useEffect(() => {
        getMyPosts({
          page: postListPage,
          userId: user?.user_id,
          targetId: user?.user_id
        });
      }, [postListPage]);

      const renderPost = (item, index) => <PostCard item={item} />;
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        jc="center"
        source={require("../Feed/FeedBackground.png")}
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
                            <Icons.BackArrow width={32} height={32}/>
                        </TouchableOpacity>
                        <Text ta="center" ml={8} ftsz={17} weight="500">
                        Your Posts
                        </Text>
                    </View>
                </View>
                {isFetching && postListPage == 1 ? (
              <View f={1} ai="center" jc="center">
                <ActivityIndicator size={"large"} color={"#000"} />
              </View>
            ) : (
              <>
                {postList?.length == 0 ? (
                  <View f={1} jc="center" ai="center">
                    <Text>No Posts Found!</Text>
                  </View>
                ) : (
                  <FlatList
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    f={1}
                    w={"100%"}
                    data={postList}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          {renderPost(item, index)}
                        </>
                      );
                    }}
                    ListFooterComponent={() => {
                      return (
                        <View>
                          {loadMorePostData && (
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
            </View>
        </ImageBackground>
    </MainLayout>
  );
};

export default MyPosts;
