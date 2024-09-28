import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { SelectInput, Text, TextInput } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import LinearGradient from "react-native-linear-gradient";
import EditPictureModal from "../DashboardScreen/Header/EditPictureModal";
import EditVideoModal from "../DashboardScreen/Header/EditVideoModal";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  useWindowDimensions,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useAppDispatch, useAppSelector } from "../../redux";
import { userActions } from "../../redux/userSlice";
import { api } from "../../redux/api";
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkMultiple,
  request,
  requestMultiple,
} from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker, { types } from "react-native-document-picker";
import Toast from "react-native-toast-message";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import {
  Video,
  createVideoThumbnail,
  clearCache,
} from "react-native-compressor";
import RNFS from "react-native-fs";
import AutoFillProfileModal from "./AutoFillProfileModal";
import Spacer from "./spacer";
import TalentBoard from "./TalentBoard";
import SocialMediaLinks from "../../screens/CreateProfile/SocialMediaLinks";
import SocailMediaLinksModal from "./SocailMediaLinksModal";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import SearchabilityModal from "./SearchabilityModal";
import PreviewProfileModal from "./PreviewProfileModal";
import { ICONS } from "../../constants";
import RNFetchBlob from "rn-fetch-blob";
import Octicons from "react-native-vector-icons/Octicons";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const Profile = () => {
  const user = useAppSelector(state => state.user);
  const home = useAppSelector(state => state.home);
  const [autoFillCVModal, setAutoFillCVModal] = useState(false);
  const [pictureModal, setPictureModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [searchabilityModal, setSearchabilityModal] = useState(false);
  const [uploadImage, { isLoading }] = api.useUploadImageMutation();
  const [uploadVideoAPI, { isLoading: isLoadingVideoUpload }] =
    api.useUploadVideoMutation();
  const [isCompressingVideo, setIsCompressingVideo] = useState(false);
  const dispatch = useAppDispatch();
  const isProfilePicUploaded = user?.profilePic?.length > 0 ? true : false;
  const isProfileVideoUploaded =
    user?.profileVideo?.link?.length > 0 ? true : false;
  const [uploadCV, { isLoading: uploadCVLoading, isError: uploadCVError }] =
    api.useUploadCVMutation();
  const [loading, setLoading] = useState(false);
  const [parseCV, { isSuccess, isLoading: parseCVLoading }] =
    api.useCvAutoFillMutation();
  const [
    saveCareerStage,
    { isSuccess: saveCarrerStageSuccess, isLoading: loadingCareerStage },
  ] = api.useSaveCareerStageMutation();
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearch = useDebounce(searchCity, 300);
  const [locationDataList, setLocationDataList] = useState([]);
  const {
    data: locationList,
    page: locationListPage,
    onReachedEnd: onReachedLocationEnd,
    loadingMoreData: loadMoreLocationData,
  } = usePagination(debouncedSearch, locationDataList);
  const { data: cityList } = api.useGetCitysQuery({
    citysearch: debouncedSearch,
    page: locationListPage,
  });
  const [saveProfile, { isLoading: loadingLocation }] =
    api.useSaveProfileMutation();
  const [
    saveHeadline,
    { isLoading: loadingHeadline, isSuccess: isSuccessCarrerHeadline },
  ] = api.useSaveProfileMutation();
  const [
    downloadProfile,
    {
      data: downloadProfileData,
      isSuccess: downloadProfileSuccess,
      isFetching: downloadProfileFetching,
    },
  ] = api.useLazyDownloadProfileQuery();
  const screenLoader =
    loadingLocation ||
    loadingCareerStage ||
    parseCVLoading ||
    isLoading ||
    isLoadingVideoUpload ||
    loading ||
    isCompressingVideo ||
    loadingHeadline ||
    downloadProfileFetching;
  const career_headline = user?.career_headline || "";
  const [profileHeadline, setProfileHeadline] = useState(career_headline);
  const [editHeadline, setEditHeadline] = useState(false);
  const [inputHeight, setInputHeight] = useState(100);
  const existingLinks = user.links || [];
  const [link, setLink] = useState(
    existingLinks.find(link => link.type === "LinkedIn")?.link || "",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOption, setSelectedOption] = useState({
    name: "LinkedIn",
    icon: <ICONS.LinkedinBig />,
  });
  const [
    saveProfileLinks,
    {
      isLoading: isSaving,
      isSuccess: saveSuccess,
      isError: saveError,
      error: saveErrorMsg,
    },
  ] = api.useSaveProfileMutation();
  const otherLinksFromExisting = existingLinks
  .filter(link => {
    if (link.type?.includes("Other")) {
      return true;
    }
  })
  .slice(0, 3)
  .map(link => link.link) || ["", "", ""];
  const [otherLinks, setOtherLinks] = useState(
    existingLinks
      .filter(link => {
        if (link.type?.includes("Other")) {
          return true;
        }
      })
      .slice(0, 3)
      .map(link => link.link)?.length>0 ? existingLinks
      .filter(link => {
        if (link.type?.includes("Other")) {
          return true;
        }
      })
      .slice(0, 3)
      .map(link => link.link) : ["", "", ""]
  );

  const socialMediaOptions = [
    { name: "LinkedIn", icon: <ICONS.LinkedinBig /> },
    { name: "GitHub", icon: <ICONS.Github /> },
    { name: "Behance", icon: <ICONS.Behance /> },
    { name: "Other", icon: null },
    // Add more options as needed
  ];

  const extractNameFromLink = url => {
    const match = url.match(/\/\/(?:www\.)?([^\/]+)\//);
    return match ? match[1] : null;
  };

  const handleOptionPress = option => {
    setErrorMsg("");
    setSelectedOption(option);
    const existingLink = existingLinks.find(link => link.type === option.name);
    setLink(existingLink ? existingLink.link : "");
  };

  const handleSaveLink = async () => {
    try {
      if (!link || link.length === 0) {
        setErrorMsg("Enter a valid link");
        return;
      }
      const newData = {
        name: selectedOption.name,
        link: link,
        icon: selectedOption.name, // Adjust icon assignment
        type: selectedOption.name,
      };

      const existingLinkIndex = existingLinks.findIndex(
        prevLink => prevLink.type === newData.type,
      );

      let updatedLinks;
      if (existingLinkIndex !== -1) {
        updatedLinks = [...existingLinks];
        updatedLinks[existingLinkIndex] = newData;
      } else {
        updatedLinks = [...existingLinks, newData];
      }

      saveProfileLinks({
        user_id: user._id,
        links: updatedLinks,
      });
    } catch (error) {
      console.error("Save Profile Error:---", error); // Corrected the error logging
    }
  };

  useEffect(() => {
    if (!isSaving && saveSuccess) {
      setErrorMsg("");
      Toast.show({
        type: "success",
        text1: "Link Updated Successfully.",
        text2: "Link has been updated.",
      });
    }
  }, [isSaving, saveSuccess]);

  useEffect(() => {
    if (saveError && !isLoading) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while saving.",
      });
    }
  }, [saveError]);

  const handleOtherLinkChange = (index, value) => {
    const updatedOtherLinks = [...otherLinks];
    updatedOtherLinks[index] = value;
    setOtherLinks(updatedOtherLinks);
  };

  const handleSaveOtherLinks = () => {
    try {
      const newOtherLinks = otherLinks.map((link, index) => ({
        name: `Other ${index + 1}`,
        link: link,
        type: `Other ${index + 1}`,
      }));

      const updatedLinks = [
        ...existingLinks.filter(link => !link.type.startsWith("Other")),
        ...newOtherLinks,
      ];

      saveProfileLinks({
        user_id: user._id,
        links: updatedLinks,
      });
    } catch (error) {
      console.error("Save Other Links Error:---", error);
    }
  };

  useEffect(() => {
    if (isSuccessCarrerHeadline && !loadingHeadline) {
      logAnalyticsEvents("updated_career_headline", {});
    }
  }, [isSuccessCarrerHeadline, loadingHeadline]);

  useEffect(() => {
    if (cityList?.data?.length > 0) {
      setLocationDataList([...cityList?.data]);
    } else {
      setLocationDataList([]);
    }
  }, [cityList]);

  useEffect(() => {
    if (isSuccess) {
      setLoading(false);
    }
  }, [isSuccess]);

  const openCVModal = () => {
    setAutoFillCVModal(true);
  };

  const closePreviewModal = () => {
    setPreviewModal(false);
  };

  const closeCVModal = () => {
    setAutoFillCVModal(false);
  };

  const openSocialLinkModal = () => {
    setSocialMediaLinksModal(true);
  };

  const closeSocialLinkModal = () => {
    setSocialMediaLinksModal(false);
  };

  const closeAllModals = () => {
    setPictureModal(false);
    setVideoModal(false);
  };

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
  const compressAndUpload = async (uri, user_id, name, type) => {
    setIsCompressingVideo(true);
    await Video.compress(
      uri,
      {
        compressionMethod: "auto",
      },
      progress => {
        console.log({ compression: progress });
      },
    ).then(async compressedFileUrl => {
      const thumbnail = await createVideoThumbnail(compressedFileUrl);
      const baseName = name.replace(/\.[^/.]+$/, "") + ".jpeg";
      const bodyFormData = new FormData();
      bodyFormData.append("user_id", user_id);
      bodyFormData.append("media", {
        uri: compressedFileUrl,
        name: name,
        type: type,
      });
      bodyFormData.append("thumbnail", {
        uri: thumbnail.path,
        name: baseName,
        type: thumbnail.mime,
      });
      setVideoModal(false);
      const response = await uploadVideoAPI(bodyFormData);
      await clearCache();
      setIsCompressingVideo(false);
    });
  };

  const downloadPdf = async pdf => {
    try {
      const { config, fs } = RNFetchBlob;
      const { DownloadDir, CacheDir } = fs.dirs;
      const date = new Date();
      const isAndroid = Platform.OS === "android";

      let path;
      if (isAndroid) {
        path = `${DownloadDir}/me_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.pdf`;
      } else {
        path = `${CacheDir}/me_${Math.floor(
          // Use shared directory
          date.getTime() + date.getSeconds() / 2,
        )}.pdf`;
      }
      const options = {
        fileCache: true,
        path,
        useDownloadManager: isAndroid, // Use DownloadManager on Android only
        notification: true,
        description: "File downloaded by download manager.",
      };

      config(options)
        .fetch("GET", pdf)
        .then(res => {
          !isAndroid &&
            setTimeout(() => {
              RNFetchBlob.ios.openDocument(path);
            }, 2000);
          Toast.show({
            type: "success",
            text1: "Download success!",
            text2: "Your Cv is downloaded successfully.",
          });
        });
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (downloadProfileSuccess && !downloadProfileFetching) {
      logAnalyticsEvents("download_profile_success", {});
      downloadPdf(downloadProfileData?.profilePdfLink);
    }
  }, [downloadProfileSuccess, downloadProfileFetching]);

  const onPressDownload = () => {
    downloadProfile({ userId: user?.user_id });
  };

  const uploadVideo = async video => {
    if (video?.uri) {
      const user_id = user?.user_id;
      const uri = video?.uri;
      const name = video?.fileName;
      const type = video?.type;

      const fileInfo = await RNFS.stat(uri);
      const fileSizeInMegabytes = fileInfo.size / (1024 * 1024);

      if (fileSizeInMegabytes > 50) {
        await compressAndUpload(uri, user_id, name, type);
      } else {
        const bodyFormData = new FormData();
        bodyFormData.append("user_id", user_id);
        bodyFormData.append("media", {
          uri: uri,
          name: name,
          type: type,
        });
        const thumbnail = await createVideoThumbnail(uri);
        const baseName = name.replace(/\.[^/.]+$/, "") + ".jpeg";
        bodyFormData.append("thumbnail", {
          uri: thumbnail.path,
          name: baseName,
          type: thumbnail.mime,
        });
        setVideoModal(false);
        const response = await uploadVideoAPI(bodyFormData);
        if (response?.data?.message == "Profile video uploaded successfully") {
          logAnalyticsEvents("uploaded_profile_video", {});
        }
        await clearCache();
      }
    }
  };

  const openPictureModal = () => {
    setPictureModal(true);
  };

  const closePictureModal = () => {
    setPictureModal(false);
  };

  const viewProfilePicture = () => {
    logAnalyticsEvents("view_profile_picture", {});
    isProfilePicUploaded &&
      navigate("ViewProfilePicture", { url: user?.profilePic });
  };

  const viewProfileVideo = () => {
    logAnalyticsEvents("view_profile_video", {});
    isProfileVideoUploaded &&
      navigate("PlayVideoLink", { url: user?.profileVideo?.link });
  };

  const openVideoModal = () => {
    setVideoModal(true);
  };

  const closeVideoModal = () => {
    setVideoModal(false);
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
            } else if (type == "video") {
              launchImageLibrary({
                mediaType: type,
                videoQuality: "high",
              }).then(res => {
                if (res?.assets?.[0]?.uri?.length > 0) {
                  closeAllModals();
                  navigate("PlayVideoScreen", {
                    res,
                    closeAllModals,
                    uploadVideo,
                  });
                }
              });
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
          } else if (type == "video") {
            launchImageLibrary({
              mediaType: type,
              videoQuality: "high",
              formatAsMp4: true,
            }).then(res => {
              if (res?.assets?.[0]?.uri?.length > 0) {
                closeAllModals();
                navigate("PlayVideoScreen", {
                  res,
                  closeAllModals,
                  uploadVideo,
                });
              }
            });
          }
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
              if (type == "photo") {
                onEditProfilePic();
              } else if (type == "video") {
                launchImageLibrary({
                  mediaType: type,
                  videoQuality: "high",
                  formatAsMp4: true,
                }).then(res => {
                  if (res?.assets?.[0]?.uri?.length > 0) {
                    closeAllModals();
                    navigate("PlayVideoScreen", {
                      res,
                      closeAllModals,
                      uploadVideo,
                    });
                  }
                });
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
      bodyFormData.append("user_id", user_id);
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

  const data = [
    {
      name: "Personal Details",
      percentage: user?.personalDetailsPercentage,
      navigate: "Personal",
    },
    {
      name: "Educational Details",
      percentage: user?.educationDetailsPercentage,
      navigate: "Educational",
    },
    {
      name: "Work Experience",
      percentage: user?.workDetailsPercentage,
      navigate: "WorkExperience",
    },
    {
      name: "Skills",
      percentage: user?.skillAspirationsPercentage,
      navigate: "Skills",
    },
    {
      name: "Work Preference",
      percentage: user?.workPreferencePercentage,
      navigate: "WorkPreference",
    },
    {
      name: "Certifications",
      percentage: user?.workPreferencePercentage,
      navigate: "Certifications",
    },
  ];

  const onUploadFile = async () => {
    try {
      const userID = user?.user_id;
      setLoading(true);
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.images, types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      closeCVModal();
      let data = new FormData();
      const { uri, type, name } = pickerResult;
      data.append("cv_doc", { uri, type, name });
      data.append("user_id", userID);
      const uploadResponse = await uploadCV(data);

      if (uploadResponse.data.item.cv_doc.file) {
        const file = uploadResponse.data.item.cv_doc.file;
        logAnalyticsEvents("resume_uploaded_autofill", {});
        let cvData = new FormData();
        cvData.append("cv_url", file);
        cvData.append("user_id", user?.user_id);
        parseCV(cvData);
      } else {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Error occured while trying to upload CV",
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Something went wrong in UploadCV or ParseCV",
      });
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./ProfileBackground.png")}
        resizeMode="cover">
        <AutoFillProfileModal
          showModal={autoFillCVModal}
          closeModal={closeCVModal}
          onUploadFile={onUploadFile}
        />
        <SearchabilityModal
          showModal={searchabilityModal}
          closeModal={() => setSearchabilityModal(false)}
        />
        <PreviewProfileModal
          showModal={previewModal}
          closeModal={closePreviewModal}
        />
        {/* <SocailMediaLinksModal
          showModal={socialMediaLinksModal}
          closeModal={closeSocialLinkModal}
          onUploadFile={onUploadFile}
          prevLinks={user?.links}
          userId={user?.user_id}
        /> */}
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
          openVideoModal={openVideoModal}
        />
        <View mt={8} mb={16}>
          <View fd="row" ai="center" jc="space-between">
            <View mh={16} fd="row" ai="center">
              <TouchableOpacity
                onPress={() => {
                  popNavigation();
                }}>
                <Icons.BackArrow width={32} height={32} />
              </TouchableOpacity>
              <View>
                <Text ftsz={15} weight="500" c={"#141418"} ml={8}>
                  MapOut Persona
                </Text>
                <TouchableOpacity
                  mt={2}
                  onPress={() => {
                    logAnalyticsEvents("profile_preview_clicked", {});
                    setPreviewModal(true);
                  }}
                  bgc={"#000"}
                  pv={4}
                  ph={8}
                  br={8}
                  asf="flex-start"
                  ml={8}
                  fd="row"
                  ai="center">
                  <Text mr={4} ftsz={12} weight="500" c={"#FFF"}>
                    Preview
                  </Text>
                  <Icons.ChevronLeft
                    width={18}
                    height={16}
                    fill={"#FFF"}
                    style={{
                      transform: [
                        { rotate: previewModal ? "90deg" : "270deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              btlr={30}
              bblr={30}
              pv={8}
              ph={16}
              bgc={"#FFF"}
              onPress={() => {
                setSearchabilityModal(true);
                logAnalyticsEvents("viewed_searchability", {});
              }}>
              <View fd="row" ai="center">
                <AnimatedCircularProgress
                  size={50}
                  width={4}
                  prefill={0}
                  duration={3000}
                  rotation={360}
                  delay={50}
                  fill={user?.overallPercentage || 0}
                  backgroundColor="#6691FF10"
                  tintColor={
                    user?.overallPercentage <= 40
                      ? "#F6431C"
                      : user?.overallPercentage <= 70
                      ? "#4772F4"
                      : "#78B55D"
                  }>
                  {fill => (
                    <Text
                      c={
                        user?.overallPercentage <= 40
                          ? "#F6431C"
                          : user?.overallPercentage <= 70
                          ? "#4772F4"
                          : "#78B55D"
                      }
                      ftsz={11}
                      weight="600">
                      {user?.overallPercentage || 0}%
                    </Text>
                  )}
                </AnimatedCircularProgress>
                <View ml={8} ai="center">
                  <Text
                    ftsz={15}
                    weight="600"
                    c={
                      user?.overallPercentage <= 40
                        ? "#F6431C"
                        : user?.overallPercentage <= 70
                        ? "#4772F4"
                        : "#78B55D"
                    }>
                    {user?.overallPercentage <= 40
                      ? "LOW"
                      : user?.overallPercentage <= 70
                      ? "MID"
                      : "HIGH"}
                  </Text>
                  <Text ftsz={10} weight="600">
                    Searchability
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View f={1}>
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View ph={24} mt={4} jc="center" fd="row" ai="center">
              <Text f={1} ta="center" ftsz={20} weight="600" c={"#141418"}>
                {user?.name}
              </Text>
            </View>
            <View mv={4} fd="row" ai="center" jc="center">
              <TouchableOpacity
                mr={8}
                onPress={() => {
                  navigate("MyFollowersScreen");
                }}>
                <Text ta="center" ftsz={12} weight="500" c={"#141418"}>
                  {user?.followCountDetails?.totalFollowers} followers
                </Text>
              </TouchableOpacity>
              <View h={6} w={6} br={6} bgc={"#000"} />
              <TouchableOpacity
                ml={8}
                onPress={() => {
                  navigate("MyFollowingsScreen");
                }}>
                <Text ta="center" ftsz={12} weight="500" c={"#141418"}>
                  {home.followingsCount} following
                </Text>
              </TouchableOpacity>
            </View>
            <View mt={8} fd="row" ai="center" mh={32}>
              <View f={1} ai="center" jc="center">
                <SelectInput
                  selectedOptions={user?.career_stage}
                  snapPoints={["30%"]}
                  value={user?.career_stage}
                  onSelect={val => {
                    if (val != user?.career_stage) {
                      logAnalyticsEvents("update_career_stage", {});
                      saveCareerStage({
                        user_id: user?.user_id,
                        career_stage: val,
                      });
                    }
                  }}
                  options={["College Student", "Working Professional"]}
                  label="Career stage*"
                  renderInput={({ onPressSelect }) => (
                    <TouchableOpacity
                      disabled={loadingCareerStage}
                      onPress={onPressSelect}
                      f={1}
                      ai="center"
                      jc="center"
                      fd="row">
                      <Icons.Degree width={20} height={20} />
                      <Text
                        numberOfLines={1}
                        f={1}
                        ml={8}
                        ftsz={12}
                        weight="400">
                        {user?.career_stage}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View f={1}>
                <SelectInput
                  selectedOptions={user?.current_location || ""}
                  onSearch={setSearchCity}
                  searchPlaceholder="Search location"
                  onReachEnd={onReachedLocationEnd}
                  onReachEndThreshold={0.5}
                  loadingMoreData={loadMoreLocationData}
                  onSelect={val => {
                    if (val != user?.current_location) {
                      logAnalyticsEvents("update_location", {});
                      saveProfile({
                        user_id: user?.user_id,
                        current_location: val,
                      });
                    }
                  }}
                  options={[...locationList?.map(val => val.name)]}
                  label="Location*"
                  renderInput={({ onPressSelect }) => (
                    <TouchableOpacity
                      onPress={onPressSelect}
                      f={1}
                      ai="center"
                      jc="center"
                      fd="row">
                      <Icons.LocationPin />
                      <Text numberOfLines={1} ml={8} ftsz={12} weight="400">
                        {user?.current_location?.length > 0
                          ? user?.current_location
                          : "Location"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <View
              fd="row"
              mh={24}
              h={160}
              mt={8}
              jc="space-around"
              ai="center"
              gap={8}>
              <View f={1} w={"100%"} ai="center">
                {isProfilePicUploaded && (
                  <TouchableOpacity
                    onPress={openPictureModal}
                    br={8}
                    fd="row"
                    bgc={"#000"}
                    p={10}
                    z={2}
                    r={24}
                    b={4}
                    po="absolute">
                    <Octicons name="pencil" size={16} color={"#FFF"} />
                  </TouchableOpacity>
                )}
                <LinearGradient
                  colors={["#B3C8FD", "#F3ECFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  useAngle={true}
                  angle={0}
                  angleCenter={{ x: 0.5, y: 0.5 }}
                  style={{
                    zIndex: 1,
                    borderRadius: 75,
                    marginVertical: 4,
                    width: 150,
                    height: 150,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    onPress={
                      isProfilePicUploaded
                        ? viewProfilePicture
                        : openPictureModal
                    }>
                    {isProfilePicUploaded ? (
                      <Image
                        source={{ uri: user?.profilePic }}
                        w={140}
                        h={140}
                        br={75}
                      />
                    ) : (
                      <View
                        w={140}
                        h={140}
                        bgc={"#FFF"}
                        br={75}
                        jc="center"
                        ai="center">
                        <Icons.PhotoIcon width={24} height={24} />
                        <Text mt={8} ftsz={10} weight="500">
                          Add
                        </Text>
                        <Text ftsz={10} weight="500">
                          Profile Picture
                        </Text>
                        {/* <View fd="row" ai="center">
                          <Image
                            source={require("../../assets/gifs/FireAnimation.gif")}
                            style={{ width: 18, height: 18 }}
                            resizeMode="contain"
                          />
                          <Text ml={4} c={"#EFC019"} ftsz={10} weight="500">
                            Earn 10 points
                          </Text>
                        </View> */}
                      </View>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View f={1} w={"100%"} ai="center">
                {isProfileVideoUploaded && (
                  <TouchableOpacity
                    onPress={() => {
                      logAnalyticsEvents("bulb_clicked", {});
                      navigate("VideoAnalysisScreen");
                    }}
                    br={12}
                    fd="row"
                    z={2}
                    r={12}
                    po="absolute">
                    <Icons.Bulb width={42} height={42} />
                  </TouchableOpacity>
                )}
                {isProfileVideoUploaded && (
                  <TouchableOpacity
                    onPress={openVideoModal}
                    br={8}
                    fd="row"
                    bgc={"#000"}
                    p={10}
                    z={2}
                    r={24}
                    b={4}
                    po="absolute">
                    <Octicons name="pencil" size={16} color={"#FFF"} />
                  </TouchableOpacity>
                )}
                <LinearGradient
                  colors={["#B3C8FD", "#F3ECFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  useAngle={true}
                  angle={0}
                  angleCenter={{ x: 0.5, y: 0.5 }}
                  style={{
                    zIndex: 1,
                    borderRadius: 75,
                    marginVertical: 4,
                    width: 150,
                    height: 150,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    onPress={
                      isProfileVideoUploaded ? viewProfileVideo : openVideoModal
                    }>
                    {isProfileVideoUploaded ? (
                      <>
                        <View w={140} h={140}>
                          <Image
                            source={{ uri: user?.profileVideo?.thumbnail }}
                            w={"100%"}
                            h={"100%"}
                            br={75}
                            resizeMode="cover"
                          />
                          <View
                            b={8}
                            bgc={"rgba(0,0,0,0.4)"}
                            p={2}
                            br={100}
                            po="absolute"
                            asf="center">
                            <Icons.PlayButton width={24} height={24} />
                          </View>
                        </View>
                      </>
                    ) : (
                      <View
                        w={140}
                        h={140}
                        bgc={"#FFF"}
                        br={75}
                        jc="center"
                        ai="center">
                        <Icons.VideoIcon width={24} height={24} />
                        <Text mt={8} ftsz={10} weight="500">
                          Add
                        </Text>
                        <Text ftsz={10} weight="500">
                          Profile Video
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
            <View mh={24} bgc={"#FFF"} mt={16} br={12} ph={16} pt={16}>
              <View fd="row" jc="space-between" ai="center">
                <Text ftsz={14} weight="500">
                  Career Headline
                </Text>
                {career_headline?.length > 0 && (
                  <TouchableOpacity onPress={() => setEditHeadline(true)}>
                    <ICONS.EditPencil />
                  </TouchableOpacity>
                )}
              </View>
              {!editHeadline && (
                <TouchableOpacity onPress={() => setEditHeadline(true)}>
                  <Text
                    mt={4}
                    mb={16}
                    ftsz={career_headline?.length > 0 ? 12 : 10}
                    weight="400"
                    c={career_headline?.length > 0 ? "#000" : "#525252"}>
                    {career_headline?.length > 0
                      ? career_headline
                      : 'Add bio to summarize your expertise and goals in one line. For eg. "Experienced Digital Marketer Specializing in SEO and Social Media Campaigns"'}
                  </Text>
                </TouchableOpacity>
              )}
              {editHeadline && (
                <>
                  <TextInput
                    value={profileHeadline}
                    onChangeText={setProfileHeadline}
                    mt={8}
                    ftsz={12}
                    weight={400}
                    br={8}
                    bgc={"#EDF2FD"}
                    mv={14}
                    maxLength={200}
                    placeholderTextColor={"#7F8A8E"}
                    placeholder="Add bio here"
                    multiline={true}
                    textAlignVertical="top"
                    style={{
                      padding: 10,
                      maxHeight: 200, // Maximum height
                    }}
                    h={80}
                  />
                  <Text ta="right" ftsz={10} weight="600" c={"#7F8A8E"}>
                    200 Character Limit
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditHeadline(false);
                      saveHeadline({
                        user_id: user?.user_id,
                        career_headline: profileHeadline.trim(),
                      });
                    }}
                    mt={8}
                    mb={16}
                    bgc={"#000"}
                    pv={10}
                    jc="center"
                    ai="center"
                    br={12}>
                    <Text ftsz={14} weight="500" c={"#FFF"}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Spacer />
            <View
              style={{
                marginHorizontal: 24,
                backgroundColor: "#FFF",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingTop: 16,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}>
                {socialMediaOptions.map(option => (
                  <View key={option.name}>
                    <TouchableOpacity
                      onPress={() => handleOptionPress(option)}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 26,
                        borderRadius: 12,
                        position: "relative",
                      }}>
                      {option.icon ? (
                        option.icon
                      ) : (
                        <Text style={{ fontWeight: "500" }}>{option.name}</Text>
                      )}
                    </TouchableOpacity>
                    {selectedOption && selectedOption.name === option.name && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: -10,
                          left: 0,
                          right: 0,
                          height: 2.5,
                          backgroundColor: "#48A022",
                          zIndex: 0,
                        }}
                      />
                    )}
                  </View>
                ))}
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#7F8A8E",
                  marginBottom: 16,
                  marginTop: 10,
                }}
              />

              {selectedOption && selectedOption.name !== "Other" && (
                <View style={{ alignItems: "center" }}>
                  <TextInput
                    style={{
                      width: "100%",
                      padding: 8,
                      borderColor: "#DFE5F2",
                      borderWidth: 1,
                      borderRadius: 8,
                      marginBottom: 18,
                      backgroundColor: "#EDF2FD",
                    }}
                    placeholderTextColor="#000"
                    placeholder={link ? link : "Paste your link here"}
                    value={link}
                    onChangeText={setLink}
                  />

                  {errorMsg.length > 0 && (
                    <Text style={{ fontSize: 12, color: "#d30000" }}>
                      {errorMsg}
                    </Text>
                  )}
                  {existingLinks.find(link => link.type === selectedOption.name)
                    ?.link != link ? (
                    <TouchableOpacity
                      onPress={handleSaveLink}
                      style={{
                        backgroundColor: "#000",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 12,
                        width: "100%",
                        marginTop: 2,
                        marginBottom: 16,
                      }}>
                      {isSaving ? (
                        <ActivityIndicator size={"small"} color={"#FFF"} />
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#FFF",
                          }}>
                          Save
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}

              {selectedOption && selectedOption.name === "Other" && (
                <View>
                  {otherLinks.map((otherLink, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 16,
                      }}>
                      <TextInput
                        style={{
                          flex: 1,
                          padding: 8,
                          borderColor: "#DFE5F2",
                          borderWidth: 1,
                          borderRadius: 8,
                          backgroundColor: "#EDF2FD",
                        }}
                        placeholderTextColor="#000"
                        placeholder={`Paste link ${index + 1}`}
                        value={otherLink}
                        onChangeText={value =>
                          handleOtherLinkChange(index, value)
                        }
                      />
                    </View>
                  ))}

                  {errorMsg.length > 0 && (
                    <Text style={{ fontSize: 12, color: "#d30000" }}>
                      {errorMsg}
                    </Text>
                  )}

                  {otherLinks?.filter((item, index) => {
                      if (otherLinks[index] != otherLinksFromExisting[index]) {
                        return true;
                      }
                    })?.length > 0 && <TouchableOpacity
                    onPress={handleSaveOtherLinks}
                    style={{
                      backgroundColor: "#000",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 12,
                      width: "100%",
                      marginTop: 2,
                      marginBottom: 16,
                    }}>
                      {isSaving ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#FFF",
                        }}>
                        Save
                      </Text>}
                  </TouchableOpacity>}
                </View>
              )}
            </View>
            <Spacer />
            <TalentBoard />
            <Spacer />
            {data?.map((item, index) => {
              return (
                <View key={index.toString()}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate("EditProfile", { type: item?.navigate });
                    }}
                    ph={8}
                    pv={24}
                    ai="center"
                    bgc={"rgba(255, 255, 255, 0.75)"}
                    mh={24}
                    br={12}
                    fd="row">
                    <View f={1}>
                      <Text ftsz={14} weight="600">
                        {item?.name}
                      </Text>
                      <Text c={"#FF4C00"} ftsz={12} weight="400">
                        {item?.percentage}% complete
                      </Text>
                    </View>
                    <View>
                      <Icons.ChevronLeft
                        width={28}
                        height={28}
                        fill={"#000"}
                        style={{
                          transform: [{ rotate: "180deg" }],
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  {index != 5 && <Spacer />}
                </View>
              );
            })}
            <Spacer />
            <TouchableOpacity
              onPress={onPressDownload}
              mh={24}
              pv={12}
              bgc={"#000"}
              jc="center"
              ai="center"
              br={8}>
              <Text c={"#FFF"} weight="500" ftsz={15}>
                Download Profile as CV
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {screenLoader && (
          <View
            bgc={"rgba(0,0,0,0.5)"}
            po="absolute"
            w={"100%"}
            h={"100%"}
            jc="center"
            ai="center"
            z={10}>
            <ActivityIndicator size={"large"} color={"#FFF"} />
          </View>
        )}
      </ImageBackground>
    </MainLayout>
  );
};

export default Profile;
