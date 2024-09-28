import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native-style-shorthand';
import { Text } from '../../components';
import {Alert, Image as Img, Linking, PermissionsAndroid, Platform, useWindowDimensions} from 'react-native';
import MainLayout from '../../components/MainLayout';
import { navigate, popNavigation } from '../../utils/navigationService';
import Icons from '../../constants/icons';
import EditPictureModal from '../DashboardScreen/Header/EditPictureModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, checkMultiple, openSettings, requestMultiple } from 'react-native-permissions';
import { api } from '../../redux/api';
import { useAppSelector } from '../../redux';
import ImagePicker from "react-native-image-crop-picker";
import { profilePicturePlaceholder } from '../../utils/constants';
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';


export const ViewProfilePicture = (props) => {
    const [pictureModal, setPictureModal] = useState(false);
    const user = useAppSelector(state=>state.user);
    const url = user?.profilePic?.length >0 ? user?.profilePic : profilePicturePlaceholder;
    const [imgHeight, setImgHeight] = useState(200);
    const widthScreen = useWindowDimensions().width;
    const [uploadImage, { isLoading }] = api.useUploadImageMutation();

    const uploadFromCamera = type => {
      if (Platform.OS == "android") {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
          .then(res => {
            if (!!res && res == "granted") {
              launchCamera({
                mediaType: type,
                videoQuality: "high",
                formatAsMp4: true,
                cameraType: "front",
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
                      type: res?.assets?.[0]?.type,
                    };
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
        checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then(
          res => {
            if (
              res?.["ios.permission.CAMERA"] === RESULTS.GRANTED &&
              res?.["ios.permission.MICROPHONE"] === RESULTS.GRANTED
            ) {
              launchCamera({
                mediaType: type,
                videoQuality: "high",
                formatAsMp4: true,
                maxWidth: 300,
                maxHeight: 400,
                cameraType: "front",
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
                      type: res?.assets?.[0]?.type,
                    };
                    uploadVideo(video);
                  }
                }
              });
            } else {
              requestMultiple([
                PERMISSIONS.IOS.CAMERA,
                PERMISSIONS.IOS.MICROPHONE,
              ]).then(res => {
                if (
                  res?.["ios.permission.CAMERA"] === RESULTS.GRANTED &&
                  res?.["ios.permission.MICROPHONE"] === RESULTS.GRANTED
                ) {
                  launchCamera({
                    mediaType: type,
                    videoQuality: "high",
                    formatAsMp4: true,
                    maxWidth: 300,
                    maxHeight: 400,
                    cameraType: "front",
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
                          type: res?.assets?.[0]?.type,
                        };
                        uploadVideo(video);
                      }
                    }
                  });
                } else {
                  Alert.alert(
                    "Alert!",
                    "To upload/change profile picture or video please provide camera and microphone permissions in the app setting.",
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
              });
            }
          },
        );
      }
    };
  
    const uploadPicture = async image => {
      if (image.path) {
        const user_id = user?.user_id;
        const uri = image.path;
        const type = image.mime;
        const name = `${user_id}ProfileImage`;
  
        const bodyFormData = new FormData();
        bodyFormData.append("user_id", user?.user_id);
        bodyFormData.append("image", {
          uri: uri,
          name: name,
          type: type,
        });
        setPictureModal(false);
        const response = await uploadImage(bodyFormData);
        if (response?.data?.status === true) {
          logAnalyticsEvents("uploaded_profile_picture", {});
          dispatch(userActions.changeProfilePic(image?.path));
        } else {
          console.error("Upload failed:");
        }
      }
    };

    const getImageHeight = () => {
        Img.getSize(
          url,
          (width, height) => {
            setImgHeight(height * (widthScreen / width));
          },
        );
      };

      useEffect(()=>{
        getImageHeight();
      },[])

      const onEditProfilePic = async () => {
        try {
          const image = await ImagePicker.openPicker({
            width: 400,
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
              } else {
                Alert.alert(
                  "Alert!",
                  "To upload/change profile picture or video please provide Files and media permission in the app setting.",
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
              if (type == "photo") {
                onEditProfilePic();
              }
            } else {
              request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
                  if (type == "photo") {
                    onEditProfilePic();
                  }
                } else {
                  // Permission denied or blocked
                  Alert.alert(
                    "Alert!",
                    "To upload/change profile picture or video please provide Photos access in the app setting.",
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

      const openPictureModal = () => {
        setPictureModal(true);
      };
    
      const closePictureModal = () => {
        setPictureModal(false);
      };
  return (
    <MainLayout bgColor="#000" statusBar_bg="#000" statusBar_bs="lc">
      <EditPictureModal
          profileModal={pictureModal}
          closePictureModal={closePictureModal}
          uploadFromCamera={uploadFromCamera}
          requestGalleryPermission={requestGalleryPermission}
        />
        <View ph={16} mt={8}>
            <TouchableOpacity
                asf='flex-start'
                br={100}
                bgc={'#FFF'}
                  onPress={() => {
                    popNavigation();
                  }}>
                  <Icons.BackArrow width={32} height={32}/>
            </TouchableOpacity>
        </View>
        <View f={1} ai='center' jc='center'>
            <Image w={'100%'} h={imgHeight} source={{uri: url}}/>
        </View>
        <TouchableOpacity onPress={openPictureModal} jc='center' ai='center'>
          <Text c={'#FFF'} weight='500' ftsz={16}>
            Edit Picture
          </Text>
        </TouchableOpacity>
    </MainLayout>
  )
}

export default ViewProfilePicture;