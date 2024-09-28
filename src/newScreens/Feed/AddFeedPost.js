import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text, TextInput } from "../../components";
import MainLayout from "../../components/MainLayout";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { useAppSelector } from "../../redux";
import PostVisibilityPopUp from "./PostVisibilityPopUp";
import Video from "react-native-video";
import {
  Video as VideoC,
  createVideoThumbnail,
  clearCache,
} from "react-native-compressor";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  useWindowDimensions,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from "react-native-permissions";
import {
  postCategories,
  profilePicturePlaceholder,
} from "../../utils/constants";
import Toast from "react-native-toast-message";
import { api } from "../../redux/api";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import useKeyboard from "../../hooks/useKeyboard";

const AddFeedPost = props => {
  const {
    resetJobs = false,
    isTalentBoard = false,
    talentBoardDatas,
    talentBoardIds,
  } = props?.route?.params;

  const postCats = Object.values(postCategories);
  const itemWidth = (useWindowDimensions().width - 40) / 3;
  const user = useAppSelector(state => state.user);
  const postVisibilityRef = useRef(null);
  const [postVisibility, setPostVisibility] = useState("Posting publicly");
  const [postText, setPostText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    postCats[0]?.name,
  );
  const [addPost, { isSuccess, isLoading }] = api.useAddFeedPostMutation();
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState({});
  const [compressingVideo, setCompressingVideo] = useState(false);
  const [talentBoardCategories, setTalentBoardCategories] = useState([]);
  const [talentBoardSelectedCategory, setTalentBoardSelectedCategory] =
    useState([]);
  const [talentBoardLoading, setTalentBoardLoading] = useState(true);

  const handlePostButtonClick = props => {
    if (postText?.trim()?.length === 0) {
      Toast.show({
        text1: "Error",
        text2: "Caption cannot be empty",
        type: "error",
      });
      return;
    } else {
      if (!video?.uri?.length && images?.length == 0) {
        const data = new FormData();
        data.append("user_id", user?.user_id);
        data.append("caption", postText?.trim());
        data.append("status", "published");
        data.append("postVisibility", postVisibility === "Posting publicly" ? "public" : "selective")
        data.append(
          "category",
          isTalentBoard ? "TalentBoard" : selectedCategory,
        );
        if (isTalentBoard) {
          data.append("talentBoardId", talentBoardIds?.talentBoardId);
          data.append(
            "talendBoardProjectId",
            talentBoardIds?.talendBoardProjectId,
          );
        }
        addPost(data);
      } else if (video?.uri?.length > 0) {
        addVideoPost();
      } else if (images?.length > 0) {
        const data = new FormData();
        data.append("user_id", user?.user_id);
        data.append("caption", postText);
        data.append("postVisibility", postVisibility === "Posting publicly" ? "public" : "selective")
        data.append(
          "category",
          isTalentBoard ? "TalentBoard" : selectedCategory,
        );
        data.append("status", "published");
        if (isTalentBoard) {
          data.append("talentBoardId", talentBoardIds?.talentBoardId);
          data.append(
            "talendBoardProjectId",
            talentBoardIds?.talendBoardProjectId,
          );
        }
        images?.forEach(it => {
          data.append("images", {
            uri: it?.uri,
            type: it.type,
            name: it.fileName,
          });
        });
        addPost(data);
      }
    }
  };

  useEffect(() => {
    if (isTalentBoard) {
      setTalentBoardLoading(true);
      const talentboardtags = [
        {
          name: "TalentBoard",
          desc: "These are selected from TalentBoard",
          bgColor: "rgba(255, 246, 198, 1)",
        },
      ];

      if (talentBoardDatas?.tags.length > 0) {
        const tagItems = talentBoardDatas?.tags.map(it => {
          return {
            name: it,
            desc: "These are selected from TalentBoard",
            bgColor: "#ede9d8",
          };
        });

        talentboardtags.push(...tagItems);
      }

      setTalentBoardSelectedCategory(talentboardtags.map(it => it.name));
      setTalentBoardCategories([...talentboardtags, ...postCats]);
      setTalentBoardLoading(false);
    } else {
      setTalentBoardLoading(false);
    }
  }, []);

  const addVideoPost = async () => {
    setCompressingVideo(true);
    await VideoC.compress(
      video?.uri,
      {
        compressionMethod: "auto",
      },
      progress => {},
    ).then(async compressedFileUrl => {
      const thumbnail = await createVideoThumbnail(compressedFileUrl);
      const baseName = video?.fileName?.replace(/\.[^/.]+$/, "") + ".jpeg";
      const data = new FormData();
      data.append("user_id", user?.user_id);
      data.append("caption", postText);
      data.append("category", selectedCategory);
      data.append("status", "published");
      data.append("postVisibility", postVisibility === "Posting publicly" ? "public" : "selective")
      data.append("coverImg", {
        uri: thumbnail.path,
        name: baseName,
        type: thumbnail.mime,
      });
      data.append("videos", {
        uri: video?.uri,
        type: video?.type,
        name: video?.fileName,
      });
      addPost(data);
    });
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      logAnalyticsEvents("add_post_success", {});
      if (video?.uri?.length > 0) {
        setCompressingVideo(false);
        clearCache();
      }
      resetJobs && resetJobs();
      popNavigation();
    }
  }, [isSuccess, isLoading]);

  const imageIconClicked = () => {
    if (video?.uri?.length > 0) {
      Alert.alert(
        "Your selected video will be lost.",
        "Are you sure to continue?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setVideo({});
              requestGalleryPermission((type = "photo"));
            },
          },
        ],
      );
    } else {
      requestGalleryPermission((type = "photo"));
    }
  };

  const videoIconClicked = () => {
    if (images?.length > 0) {
      Alert.alert(
        "Your selected images will be lost.",
        "Are you sure Are you sure to continue?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setImages([]);
              requestGalleryPermission((type = "video"));
            },
          },
        ],
      );
    } else {
      requestGalleryPermission((type = "video"));
    }
  };

  const updateVideo = vid => {
    setVideo(vid);
  };

  const requestGalleryPermission = (type = "photo") => {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(
        Platform.Version <= 32
          ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          : type == "photo"
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      )
        .then(res => {
          if (!!res && res == "granted") {
            launchImageLibrary({
              mediaType: type == "photo" ? "photo" : "video",
              videoQuality: "high",
              selectionLimit: type == "photo" ? 10 - images?.length : 1,
              formatAsMp4: true,
            }).then(res => {
              if (type == "photo") {
                const assetsSelected = res.assets;
                let assets = [];
                assetsSelected.forEach(item => {
                  if (images?.length + assets?.length < 10) {
                    if (
                      images?.findIndex(it => it.fileName === item.fileName) >=
                      0
                    ) {
                      //do nothing
                    } else {
                      assets.push(item);
                    }
                  }
                });
                setImages([...images, ...assets]);
              } else if (type == "video") {
                navigate("PlayVideoScreen", {
                  res,
                  uploadVideo: updateVideo,
                });
              }
            });
          } else {
            Alert.alert(
              "Alert!",
              "To upload/change pictures or video please provide Files and media permission in the app setting.",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                },
                {
                  text: "Open Settings",
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
              ],
            );
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    } else {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(res => {
        if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
          launchImageLibrary({
            mediaType: type == "photo" ? "photo" : "video",
            videoQuality: "high",
            selectionLimit: type == "photo" ? 10 - images?.length : 1,
            formatAsMp4: true,
          }).then(res => {
            if (type == "photo") {
              const assetsSelected = res.assets;
              let assets = [];
              assetsSelected.forEach(item => {
                if (images?.length + assets?.length < 10) {
                  if (
                    images?.findIndex(it => it.fileName === item.fileName) >= 0
                  ) {
                    //do nothing
                  } else {
                    assets.push(item);
                  }
                }
              });
              setImages([...images, ...assets]);
            } else if (type == "video") {
              navigate("PlayVideoScreen", {
                res,
                uploadVideo: updateVideo,
              });
            }
          });
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
              launchImageLibrary({
                mediaType: type == "photo" ? "photo" : "video",
                videoQuality: "high",
                selectionLimit: type == "photo" ? 10 - images?.length : 1,
                formatAsMp4: true,
              }).then(res => {
                if (type == "photo") {
                  const assetsSelected = res.assets;
                  let assets = [];
                  assetsSelected.forEach(item => {
                    if (images?.length + assets?.length < 10) {
                      if (
                        images?.findIndex(
                          it => it.fileName === item.fileName,
                        ) >= 0
                      ) {
                        //do nothing
                      } else {
                        assets.push(item);
                      }
                    }
                  });
                  setImages([...images, ...assets]);
                } else if (type == "video") {
                  navigate("PlayVideoScreen", {
                    res,
                    uploadVideo: updateVideo,
                  });
                }
              });
            } else {
              Alert.alert(
                "Alert!",
                "To upload/change pictures or video please provide Photos access in the app setting.",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                  },
                  {
                    text: "Open Settings",
                    onPress: () => {
                      openSettings();
                    },
                  },
                ],
              );
            }
          });
        }
      });
    }
  };

  const deleteSelectedImage = index => {
    let selectedImages = [...images];
    selectedImages?.splice(index, 1);
    setImages(selectedImages);
  };

  const renderMediaItem = ({ item, index }) => {
    return (
      <View
        style={{
          height: itemWidth,
          width: itemWidth,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View>
          {item?.type?.includes("image") && (
            <>
              <TouchableOpacity
                onPress={() => {
                  deleteSelectedImage(index);
                }}
                jc="center"
                ai="center"
                btrr={10}
                btlr={10}
                bgc={"grey"}
                w={itemWidth - 10}>
                <Text c={"#FFF"}>Delete</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: item?.uri }}
                bbrr={10}
                bblr={10}
                style={{
                  height: itemWidth - 10,
                  width: itemWidth - 10,
                }}
              />
            </>
          )}
          {item?.type?.includes("video") && (
            <Video
              source={{ uri: item?.uri }}
              pause={true}
              style={{
                height: itemWidth - 10,
                width: itemWidth - 10,
                borderRadius: 10,
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const updatePostVisibility = val => {
    setPostVisibility(val);
  };

  const {keyboardOpen} = useKeyboard();
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        jc="center"
        source={require("./FeedBackground.png")}
        resizeMode="cover">
        <View f={1}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            pb={16}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps={'handled'} f={1} contentContainerStyle={{ paddingBottom :  (Platform?.OS === 'ios' && keyboardOpen) ? 80 : 0, flexGrow:1}}>
              <View mt={8} mb={16}>
                <View fd="row" ai="center">
                  <TouchableOpacity
                    z={1}
                    l={16}
                    po="absolute"
                    onPress={() => {
                      popNavigation();
                    }}>
                    <Icons.BackArrow width={32} height={32} />
                  </TouchableOpacity>
                  <Text ta="center" ftsz={17} weight="500" c={"#141418"} f={1}>
                    Create Post
                  </Text>
                </View>
              </View>
              <View f={1}>
                <View fd="row" ph={16} ai="center">
                  <Image
                    source={{
                      uri:
                        user?.profilePic?.length > 0
                          ? user?.profilePic
                          : profilePicturePlaceholder,
                    }}
                    w={50}
                    h={50}
                    br={50}
                    resizeMode="contain"
                  />
                  <View ml={12}>
                    <Text ftsz={14} weight="500">
                      {user?.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        postVisibilityRef?.current?.present();
                      }}
                      fd="row"
                      ai="center">
                      <Icons.FeedEye fill={'#000'}/>
                      <Text ftsz={11} weight="400" ml={6}>
                        {postVisibility}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View pl={16} pv={16} mt={12}>
                  <Text ftsz={12} weight="500">
                    Choose a category for your post{" "}
                  </Text>
                  {isTalentBoard ? (
                    talentBoardLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <ScrollView
                        mt={12}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {talentBoardCategories.map((item, index) => {
                          return (
                            <>
                              <TouchableOpacity
                                key={index?.toString()}
                                bgc={
                                  talentBoardSelectedCategory.includes(
                                    item?.name,
                                  )
                                    ? item?.bgColor
                                    : "transparent"
                                }
                                mr={8}
                                ph={12}
                                bw={0.4}
                                pv={4}
                                br={40}>
                                <Text ftsz={11} weight="500">
                                  {item?.name}
                                </Text>
                              </TouchableOpacity>
                            </>
                          );
                        })}
                      </ScrollView>
                    )
                  ) : (
                    <ScrollView
                      mt={12}
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {postCats.map(item => {
                        return (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedCategory(item?.name);
                              }}
                              bgc={
                                selectedCategory === item?.name
                                  ? item?.bgColor
                                  : "transparent"
                              }
                              mr={8}
                              ph={12}
                              bw={0.4}
                              pv={4}
                              br={40}>
                              <Text ftsz={11} weight="500">
                                {item?.name}
                              </Text>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                    </ScrollView>
                  )}
                  <Text mt={8} ftsz={10} weight="400">
                    {isTalentBoard
                      ? talentBoardCategories[
                          talentBoardCategories.findIndex(
                            item => item.name === "TalentBoard",
                          )
                        ]?.desc
                      : postCategories[selectedCategory]?.desc}
                  </Text>
                </View>
                <View f={1} btw={1} bc={"#D9BCFF"}>
                  <TextInput
                    value={postText}
                    onChangeText={t => {
                      setPostText(t);
                    }}
                    style={{ fontFamily: "Manrope-Regular", fontSize: 14 }}
                    maxLength={3000}
                    f={1}
                    bgc={"#FFF"}
                    multiline
                    placeholder="Start typing here..."
                    textAlignVertical="top"
                    placeholderTextColor={"#7F8A8E"}
                    ph={16}
                    c={"#000"}
                    mb={16}
                  />
                  {isTalentBoard && talentBoardDatas?.coverImage && (
                    <View>
                      <View btrr={10} btlr={10}>
                        <Text c={"#111"}>{talentBoardDatas?.title}</Text>
                      </View>
                      <Image
                        source={{ uri: talentBoardDatas?.coverImage?.uri }}
                        bbrr={10}
                        bblr={10}
                        style={{
                          height: itemWidth - 10,
                          width: itemWidth - 10,
                        }}
                      />
                    </View>
                  )}
                  {images?.length > 0 && (
                    <FlatList
                      pl={16}
                      fg={0}
                      mb={16}
                      horizontal
                      ItemSeparatorComponent={() => {
                        return <View w={16} />;
                      }}
                      data={[...images]}
                      renderItem={renderMediaItem}
                      ListEmptyComponent={() => {
                        return <></>;
                      }}
                    />
                  )}

                  {video?.uri?.length > 0 && (
                    <Video
                      source={{ uri: video?.uri }}
                      pause={true}
                      muted={true}
                      style={{
                        height: itemWidth - 10,
                        width: itemWidth - 10,
                        borderRadius: 10,
                      }}
                    />
                  )}
                  <View fd="row" ai="center" jc="space-between" ph={16} mv={8}>
                    <View f={1} fd="row" ai="center" jc="flex-start" gap={24} ph={16}>
                      {!isTalentBoard && (
                        <>
                          <TouchableOpacity onPress={imageIconClicked}>
                            <Icons.FeedImage width={24} height={24} fill={'#444444'}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={videoIconClicked}>
                            <Icons.FeedVideo width={28} height={24} fill={'#444444'}/>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                    <View fd="row" ai="center" gap={16}>
                      {/* <TouchableOpacity
                        br={12}
                        w={100}
                        jc="center"
                        ai="center"
                        bw={0.4}
                        pv={12}>
                        <Text ftsz={12} weight="500">
                          Save Draft
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={handlePostButtonClick}
                        disabled={compressingVideo || isLoading}
                        br={12}
                        w={100}
                        jc="center"
                        ai="center"
                        pv={12}
                        bgc={"#000"}>
                        {compressingVideo || isLoading ? (
                          <ActivityIndicator size={"small"} color={"#FFF"} />
                        ) : (
                          <Text c={"#FFF"} ftsz={12} weight="500">
                            Post
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <PostVisibilityPopUp
          postVisibility={postVisibility}
          updatePostVisibility={updatePostVisibility}
          ref={postVisibilityRef}
          backdrop
          snapPoints={["40%"]}
        />
      </ImageBackground>
    </MainLayout>
  );
};

export default AddFeedPost;
