import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native-style-shorthand";
import MainLayout from "../../components/MainLayout";
import { Text } from "../../components";
import { api } from "../../redux/api";
import { navigate, popNavigation } from "../../utils/navigationService";
import { useAppSelector } from "../../redux";
import { ICONS } from "../../constants";
import {
  postCategories,
  profilePicturePlaceholder,
} from "../../utils/constants";
import usePagination from "../../hooks/usePagination";
import PostCard from "./PostCard";
import { Alert, BackHandler } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import Icon from "react-native-vector-icons/AntDesign";

const EmptyList = () => {
  return (
    <View f={1} jc="center" ai="center">
      <Text>No Posts Found!</Text>
    </View>
  );
};

const Feed = props => {
  const navigation = props?.navigation;
  const isFocused = navigation?.isFocused;
  const user = useAppSelector(state => state.user);
  const postCats = Object.values(postCategories);
  const [postsArray, setPostsArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const sections = ["AddPostsAndFilters", "Posts"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const {
    data: postList,
    page: postListPage,
    onReachedEnd: onReachedPostEnd,
    loadingMoreData: loadMorePostData,
    reset,
  } = usePagination("", postsArray, 20, 1);

  const backPressHandler = () => {
    if (isFocused()) {
      navigate("BottomTab", { screen: "Dashboard" });
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    logAnalyticsEvents("feed_category", { selectedCategory: selectedCategory });
  }, [selectedCategory]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backPressHandler,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const [
    getAllPosts,
    { data: postsList, isSuccess: isSuccessPosts, isFetching },
  ] = api.useLazyGetPostsQuery();

  const resetFeed = () => {
    if (postListPage === 1) {
      // setPostsArray([]);
      getAllPosts({
        page: 1,
        userId: user?.user_id,
        category: selectedCategory === "All" ? "" : selectedCategory,
      });
    } else {
      setPostsArray([]);
      reset();
    }
  };

  useEffect(() => {
    if (isSuccessPosts && !isFetching) {
      setPostsArray(postsList?.posts);
    }
  }, [isSuccessPosts, isFetching]);

  useEffect(() => {
    getAllPosts({
      page: postListPage || 1,
      userId: user?.user_id,
      category: selectedCategory === "All" ? "" : selectedCategory,
    });
  }, [postListPage]);

  useEffect(() => {
    resetFeed();
  }, [selectedCategory]);

  const onRefresh = async () => {
    logAnalyticsEvents("refresh_feed", {});
    setRefreshing(true);
    resetFeed();
    setRefreshing(false);
  };

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    !showMenu && logAnalyticsEvents("show_feed_menu", {});
    showMenu && logAnalyticsEvents("close_feed_menu", {});
    setShowMenu(!showMenu);
  };

  const renderPost = ({ item, index }) =>
    index === 0 ? (
      <View>
        <View pl={16} bgc={"#FFF"} pv={8} btw={0.4} bbw={0.4} bc={"#D9BCFF"}>
          <FlatList
            data={[{ name: "All" }, ...postCats]}
            keyExtractor={(item, index) => item?.name?.toString()}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {postListPage == 1 && isFetching && postList?.length === 0 && (
          <View mt={128} ai="center" jc="center">
            <ActivityIndicator size={"large"} color={"#000"} />
          </View>
        )}
        {postListPage == 1 && !isFetching && postList?.length === 0 && (
          <View mt={128} ai="center" jc="center">
            <Text>No Posts Found</Text>
          </View>
        )}
      </View>
    ) : item?.hide ? (
      <></>
    ) : (
      <PostCard item={item} />
    );

  const renderCategory = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index?.toString()}
        onPress={() => {
          setSelectedCategory(item?.name);
        }}
        bgc={item?.name === selectedCategory ? "#D9BCFF" : "transparent"}
        mr={8}
        ph={16}
        pv={8}
        br={8}>
        <Text style={{  }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        jc="center"
        source={require("./FeedBackground.png")}
        resizeMode="cover">
        <View f={1}>
          <TouchableOpacity
            onPress={() => {
              navigate("AddFeedPost", {
                resetJobs: resetFeed,
              });
            }}
            p={10}
            br={100}
            bgc={"#000"}
            ai="center"
            jc="center"
            z={10}
            po="absolute"
            b={65}
            r={16}>
            <Icon name="plus" size={30} color={"#FFF"} />
          </TouchableOpacity>
          <FlatList
            f={1}
            nestedScrollEnabled={true}
            onRefresh={onRefresh}
            stickyHeaderIndices={[1]}
            stickyHeaderHiddenOnScroll={true}
            refreshing={refreshing}
            onEndReachedThreshold={0.1}
            onEndReached={onReachedPostEnd}
            initialNumToRender={20}
            ListEmptyComponent={<EmptyList />}
            keyExtractor={(item, index) => {
              if (index === 0) {
                return "header";
              } else {
                return item?._id?.toString();
              }
            }}
            w={"100%"}
            data={["Header", ...postList]}
            renderItem={renderPost}
            ListHeaderComponent={
              <>
              <View fd="row" ai="center" jc="center" mt={16} mb={16}>
                <Text ml={8} ftsz={17} weight="500">
                  Feed
                </Text>
                <TouchableOpacity po="absolute" r={16} onPress={toggleMenu}>
                  {showMenu ? <ICONS.CloseHamburger /> : <ICONS.HamburgerMenu />}
                </TouchableOpacity>
              </View>
              <View mh={16} mb={8}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate("AddFeedPost", {
                        resetJobs: resetFeed,
                      });
                    }}
                    activeOpacity={1}
                    bgc={"#FFF"}
                    h={130}
                    bw={0.4}
                    f={1}
                    br={12}
                    bc={"#D9BCFF"}>
                    <View fd="row" f={1} ph={16} pv={16} ai="center">
                      <View bw={1.5} br={50} w={50} h={50}>
                        <Image
                          source={{
                            uri:
                              user?.profilePic?.length > 0
                                ? user?.profilePic
                                : profilePicturePlaceholder,
                          }}
                          w={"100%"}
                          h={"100%"}
                          br={50}
                          resizeMode="contain"
                        />
                      </View>
                      <Text f={1} ml={12} c={"#7F8A8E"} weight="400" ftsz="12">
                        What career story do you want to share today?
                      </Text>
                    </View>
                    <View h={1} mh={16} bgc={"#F2F2F2"} />
                    <View ph={16} pv={8} jc="space-between" ai="center" fd="row">
                      <View fd="row" ai="center" gap={12}>
                        <ICONS.FeedImage width={18} height={18} fill={'#333333'}/>
                        <ICONS.FeedVideo width={22} height={22} fill={'#333333'}/>
                      </View>
                      <View fd="row" ai="center">
                        <ICONS.FeedEye width={20} height={20} fill={'#333333'} />
                        <View ml={8} bgc={"#000"} br={12} pv={8} ph={24}>
                          <Text c={"#FFF"} ftsz={14} weight="500">
                            Post
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
              </>
            }
            ListFooterComponent={
              <View>
                {loadMorePostData && (
                  <View z={50} mt={20}>
                    <ActivityIndicator color={"#000"} />
                  </View>
                )}
                <View mb={180} />
              </View>
            }
          />
          {showMenu && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleMenu}
              w={"100%"}
              h={"100%"}
              z={1000}
              po="absolute"
              bgc={"rgba(217, 217, 217, 0.25)"}>
              <View fd="row" ai="center" jc="center" mt={16} mb={16}>
                <Text ml={8} ftsz={17} weight="500">
                  Feed
                </Text>
                <TouchableOpacity po="absolute" r={16} onPress={toggleMenu}>
                  {showMenu ? (
                    <ICONS.CloseHamburger />
                  ) : (
                    <ICONS.HamburgerMenu />
                  )}
                </TouchableOpacity>
              </View>
              <View mr={16} asf="flex-end" bgc={"#FFF"} br={12}>
                <TouchableOpacity
                  onPress={() => {
                    navigate("MyPosts");
                    setShowMenu(false);
                  }}
                  pb={16}
                  pl={24}
                  pr={80}
                  pt={16}>
                  <Text ftsz={14} weight="400">
                    Your Posts
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigate("SavedPosts");
                    setShowMenu(false);
                  }}
                  pb={16}
                  pl={24}
                  pr={80}>
                  <Text ftsz={14} weight="400">
                    Saved Posts
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default Feed;
