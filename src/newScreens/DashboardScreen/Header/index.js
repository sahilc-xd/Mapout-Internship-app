import React, { useState, useEffect  } from "react";
import { Image, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../components";
import { ICONS } from "../../../constants";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  check,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { Video } from 'react-native-compressor';
import { navigate, popNavigation } from "../../../utils/navigationService";
import ProfileModal from "./ProfileModal";
import EditPictureModal from "./EditPictureModal";
import EditVideoModal from "./EditVideoModal";
import { useAppSelector } from "../../../redux";
import ImagePicker from "react-native-image-crop-picker";
import { api } from "../../../redux/api";
import { userActions } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import Icons from "../../../constants/icons";
import { useFocusEffect } from '@react-navigation/native'; 
import { profilePicturePlaceholder } from "../../../utils/constants";
import { homeActions } from "../../../redux/homeSlice";


const Header = props => {
  const [videoUrl, setVideoUrl] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pictureModal, setPictureModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const width = useWindowDimensions().width;
  const user = useAppSelector(state => state.user);
  const firstName = user?.firstName || "User";
  const [uploadImage, { isLoading }] = api.useUploadImageMutation();
  const [uploadVideoAPI, { isLoading: isLoadingVideoUpload }] = api.useUploadVideoMutation();
  const dispatch = useDispatch();

  const [getNotifications, { data, isError, error, isFetching, isSuccess }] = api.useLazyGetNotificationsQuery();
  

  
  
  useFocusEffect(
    React.useCallback(() => {
      if (user?.user_id) {
        getNotifications({ userId: user?.user_id });
      }
    }, [user?.user_id])
  );

  useEffect(()=>{
    if(isSuccess && !isFetching){
      dispatch(homeActions.updateShowNotificationIcon(data?.data?.isRedDotShown || false));
    }
  },[isSuccess, isFetching])

  const closeAllModalExceptProfile = () => {
    setPictureModal(false);
    setVideoModal(false);
    setShowModal(true);
  };

  const closeAllModals = () => {
    setPictureModal(false);
    setVideoModal(false);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openPictureModal = () => {
    setShowModal(false);
    setPictureModal(true);
  };

  const closePictureModal = () => {
    setShowModal(true);
    setPictureModal(false);
  };

  const openVideoModal = () => {
    setShowModal(false);
    setVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowModal(true);
    setVideoModal(false);
  };

  const uploadPicture = async (image) => {
    if (image.path) {
      const user_id = user?.user_id;
      const uri = image.path;
      const type = image.mime;
      const name = `${user_id}ProfileImage`;

      const bodyFormData = new FormData();
      bodyFormData.append("user_id", user_id);
      bodyFormData.append("image", {
        uri: uri,
        name: name,
        type: type,
      });
      setPictureModal(false);
      setShowModal(true);
      const response = await uploadImage(bodyFormData);
      if (response?.data?.status === true) {
        dispatch(userActions.changeProfilePic(image?.path));
      } else {
        console.error("Upload failed:");
      }
    }
  };

  const uploadVideo = async (video) => {
    if (video?.path) {
      const user_id = user?.user_id;
      const uri = video?.path;
      const name = video?.name;
      const type = video?.type;

      await Video.compress(
        uri,
        {
          compressionMethod: "auto",
        },
        (progress) => {
          console.log({ compression: progress });
        }
      ).then(async (compressedFileUrl) => {
        // do something with compressed video file
        const bodyFormData = new FormData();
        bodyFormData.append("user_id", user_id);
        bodyFormData.append("media", {
          uri: compressedFileUrl,
          name: name,
          type: type,
        });
        setVideoModal(false);
        setShowModal(true);
        const response = await uploadVideoAPI(bodyFormData);
      });


      // const bodyFormData = new FormData();
      // bodyFormData.append("user_id", user_id);
      // bodyFormData.append("media", {
      //   uri: uri,
      //   name: name,
      //   type: type,
      // });
      // setVideoModal(false);
      // setShowModal(true);
      // const response = await uploadVideoAPI(bodyFormData);
    }
  }

  const onEditProfilePic = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: "photo",
        compressImageQuality: __DEV__ ? 0.1 : 0.5,
      });

      if (image.path) {
        uploadPicture(image);
      } else {
        console.error("Image path is undefined or null.");
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
      // Handle ImagePicker error here, if needed.
    }
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
            if (type == "photo") {
              onEditProfilePic();
            }
            else if (type == "video") {
              launchImageLibrary({
                mediaType: type,
                maxWidth: 300,
                maxHeight: 400,
                videoQuality: "high",
              }).then(res => {
                if (res?.assets?.[0]?.uri?.length > 0) {
                  closeAllModals();
                  navigate("PlayVideoScreen", {
                    res,
                    closeAllModalExceptProfile,
                    uploadVideo
                  });
                }
              })
            }
          } else {
            Alert.alert(
              "Alert!",
              "To upload/change profile picture or video please provide Files and media permission in the app setting.",
              [
                {
                  text: "Cancel",
                  onPress: () => { },
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
          if (type == "photo") {
            onEditProfilePic();
          }
          else if (type == "video") {
            launchImageLibrary({
              mediaType: type,
              videoQuality: "high",
              formatAsMp4: true,
            }).then(res => {
              if (res?.assets?.[0]?.uri?.length > 0) {
                closeAllModals();
                navigate("PlayVideoScreen", { res, closeAllModalExceptProfile, uploadVideo });
              }
            });
          }
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
              if (type == "photo") {
                onEditProfilePic();
              }
              else if (type == "video") {
                launchImageLibrary({
                  mediaType: type,
                  videoQuality: "high",
                  formatAsMp4: true,
                }).then(res => {
                  if (res?.assets?.[0]?.uri?.length > 0) {
                    closeAllModals();
                    navigate("PlayVideoScreen", {
                      res,
                      closeAllModalExceptProfile,
                      uploadVideo
                    });
                  }
                })
              }
            } else {
              // Permission denied or blocked
              Alert.alert(
                "Alert!",
                "To upload/change profile picture or video please provide Photos access in the app setting.",
                [
                  {
                    text: "Cancel",
                    onPress: () => { },
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

  const uploadFromCamera = type => {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
        .then(res => {
          if (!!res && res == "granted") {
            launchCamera({
              mediaType: type,
              videoQuality: "high",
              formatAsMp4: true,
              maxWidth: 300,
              maxHeight: 400
            }).then(res => {
              if (res?.assets?.[0]?.uri?.length > 0) {
                if (type == "photo") {
                    const image = {
                      path: res?.assets?.[0]?.uri,
                      mime: res?.assets?.[0]?.type,
                    };
                    uploadPicture(image);
                }else if(type == "video"){
                  const video = {
                    path: res?.assets?.[0]?.uri,
                    name: res?.assets?.[0]?.fileName,
                    type: res?.assets?.[0]?.type
                  }
                  uploadVideo(video);
                }
              }
            });
          } else {
            Alert.alert(
              "Alert!",
              "To upload/change profile picture or video please provide camera permission in the app setting.",
              [
                {
                  text: "Cancel",
                  onPress: () => { },
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
      checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((res) => {
        if (res?.['ios.permission.CAMERA'] === RESULTS.GRANTED && res?.['ios.permission.MICROPHONE'] === RESULTS.GRANTED) {
          launchCamera({
            mediaType: type,
            videoQuality: "high",
            formatAsMp4: true,
            maxWidth: 300,
            maxHeight: 400
          }).then(res => {
            if (res?.assets?.[0]?.uri?.length > 0) {
              if (type == "photo") {
                const image = {
                  path: res?.assets?.[0]?.uri,
                  mime: res?.assets?.[0]?.type,
                };
                uploadPicture(image);
              } else if (type == "video") {
                const video = {
                  path: res?.assets?.[0]?.uri,
                  name: res?.assets?.[0]?.fileName,
                  type: res?.assets?.[0]?.type
                }
                uploadVideo(video);
              }
            }
          });
        }
        else{
          requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((res)=>{
            if(res?.['ios.permission.CAMERA'] === RESULTS.GRANTED && res?.['ios.permission.MICROPHONE'] === RESULTS.GRANTED){
              launchCamera({
                mediaType: type,
                videoQuality: "high",
                formatAsMp4: true,
                maxWidth: 300,
                maxHeight: 400
              }).then(res => {
                if (res?.assets?.[0]?.uri?.length > 0) {
                  if (type == "photo") {
                    const image = {
                      path: res?.assets?.[0]?.uri,
                      mime: res?.assets?.[0]?.type,
                    };
                    uploadPicture(image);
                  } else if (type == "video") {
                    const video = {
                      path: res?.assets?.[0]?.uri,
                      name: res?.assets?.[0]?.fileName,
                      type: res?.assets?.[0]?.type
                    }
                    uploadVideo(video);
                  }
                }
              });
            }
            else {
              Alert.alert(
                "Alert!",
                "To upload/change profile picture or video please provide camera and microphone permissions in the app setting.",
                [
                  {
                    text: "Cancel",
                    onPress: () => { },
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
        }

      })

    }
  };

  return (
    <View mt={8}>
      <ProfileModal
        showModal={showModal}
        closeModal={closeModal}
        openPictureModal={openPictureModal}
        openVideoModal={openVideoModal}
        isLoadingImage={isLoading}
        isLoadingVideo={isLoadingVideoUpload}
      />
      <EditPictureModal
        profileModal={pictureModal}
        closePictureModal={closePictureModal}
        uploadFromCamera={uploadFromCamera}
        requestGalleryPermission={requestGalleryPermission}
      />
      <EditVideoModal
        videoModal={videoModal}
        closeVideoModal={closeVideoModal}
        uploadFromCamera={uploadFromCamera}
        requestGalleryPermission={requestGalleryPermission}
      />
      <View fd="row" jc="space-between" ai="center">
        <View>
          <View
            bgc={"#F4F3F2"}
            btrr={30}
            bbrr={30}
            jc="center">
            <TouchableOpacity  onPress={() => {
              navigate("Profile");
            }} ml={16} jc="center" mr={16} mv={4} h={54} w={54} br={32}>
              <Image
                  w={48}
                  h={48}
                  br={48}
                  source={
                    user?.profilePic?.length > 0
                      ? { uri: user?.profilePic }
                      : { uri: profilePicturePlaceholder }
                  }
                />
            </TouchableOpacity>
          </View>
        </View>
        <View fd="row" gap={8} mr={24}>
          <TouchableOpacity
            onPress={() => {
              navigate("Notifications");
            }}
            bc={"#FFFFFF80"}
            asf="center"
            bgc={"#FFFFFF66"}
            bw={1}
            p={6}
            br={50}>
            {data?.data?.isRedDotShown ? (
    <ICONS.BellNotification width={28} height={28} />
  ) : (
    <ICONS.Bell width={28} height={28} />
  )}
            
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate("Settings");
            }}
            bw={1}
            asf="center"
            bc={"#FFFFFF80"}
            bgc={"#FFFFFF66"}
            p={6}
            br={50}>
            <ICONS.SettingsWheel width={28} height={28} />
          </TouchableOpacity>
        </View>
      </View>
      <View ml={16} mt={16} fd="row" ai="center">
        <Text mr={4} c={"#17171F80"} ftsz={24} weight="400">
          Hey,{" "}
          <Text c={"#17171F"} ftsz={24} weight="500">
            {firstName}{" "}
          </Text>
        </Text>
        <Icons.WavingHand width={24} height={24}/>
      </View>
    </View>
  );
};

export default Header;
