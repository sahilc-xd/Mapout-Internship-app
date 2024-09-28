import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { SelectInput, Text, TextInput } from "../../../components";
import { useAppSelector } from "../../../redux";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, RESULTS, check, openSettings, request } from "react-native-permissions";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-toast-message";
import { api } from "../../../redux/api";

const ContactUs = () => {
  const user = useAppSelector(state => state?.user);
  const [name, setName] = useState(user?.name?.length > 0 ? user?.name : "");
  const [email, setEmail] = useState(
    user?.email?.length > 0 ? user?.email : "",
  );
  const [subject, setSubject] = useState("");
  const onSelectSubject = val => {
    setSubject(val);
  };
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState([]);
  const [submitForm, {isSuccess, isLoading}] = api.useSubmitContactUsFormMutation();
  const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  };
  const handleSubmit=()=>{
    if(name?.length ===0 || email?.length===0 || subject?.length===0 || desc?.length ===0){
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all the details',
      });
    }
    else if (!isValidEmail(email)) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Please enter a valid email address ",
    });
    } 
    else{
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("email", email);
    bodyFormData.append("user_id", user?.user_id);
    bodyFormData.append("subject", subject);
    bodyFormData.append("description", desc);
    image?.forEach((item)=>{
      bodyFormData.append("images", item?.uri);
    })
      submitForm(bodyFormData)
    }
  }

  useEffect(()=>{
    if (isSuccess) {
       Toast.show({
        type: 'success',
        text1: 'Thank you for reaching out to us ',
        text2: 'We will connect with you shortly. ',
      });
      popNavigation();
    }
  },[isSuccess])

  const removeImage=(uri)=>{
    const index = image.findIndex(obj => obj?.uri === uri);
    if (index !== -1) {
      const newObj = [...image];
      newObj.splice(index, 1);
      setImage([...newObj]);
    }
  }

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
              launchImageLibrary(
                {
                  mediaType: type
                },
                res => {
                  const imgData = {
                    name: res?.assets?.[0]?.fileName,
                    type: res?.assets?.[0]?.type,
                    uri: res?.assets?.[0]?.uri,
                  };
                  if(image?.length === 10){
                    Toast.show({
                      type: 'error',
                      text1: 'Limit Reached',
                      text2: 'Maximum of 10 images can be selected',
                  });
                  }else{
                    setImage(prv=>{
                      return [...prv, imgData];
                    });
                  }
                },
              ).catch(err => {
                console.log("err", err);
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
            launchImageLibrary(
              {
                mediaType: type
              },
              res => {
                const imgData = {
                  name: res?.assets?.[0]?.fileName,
                  type: res?.assets?.[0]?.type,
                  uri: res?.assets?.[0]?.uri,
                };
                setImage(prv=>{
                  return [...prv, imgData];
                });
              },
            ).catch(err => {
              console.log("err", err);
            });
          }
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
              if (type == "photo") {
                launchImageLibrary(
                  {
                    mediaType: type
                  },
                  res => {
                    const imgData = {
                      name: res?.assets?.[0]?.fileName,
                      type: res?.assets?.[0]?.type,
                      uri: res?.assets?.[0]?.uri,
                    };
                    setImage(prv=>{
                      return [...prv, imgData];
                    });
                  },
                ).catch(err => {
                  console.log("err", err);
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

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../SettingsBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            po="absolute"
            l={16}>
              <Icons.BackArrow width={32} height={32}/>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Contact Us
          </Text>
        </View>
        <View f={1}>
          <KeyboardAvoidingView
            f={1}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            //   keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <ScrollView f={1} ph={24} mt={16}>
              <Text c={"#141418"} ftsz={13} weight="500">
                Name*
              </Text>
              <View mt={8} bbw={1} bc={"#7F8A8E"}>
                <TextInput
                  placeholderTextColor={"#7F8A8E"}
                  value={name}
                  onChangeText={e => setName(e)}
                  p={0}
                  placeholder="Type here"
                  c={'#000'}
                />
              </View>
              <Text mt={32} c={"#141418"} ftsz={13} weight="500">
                Email*
              </Text>
              <View mt={8} bbw={1} bc={"#7F8A8E"}>
                <TextInput
                  placeholderTextColor={"#7F8A8E"}
                  value={email}
                  onChangeText={e => setEmail(e)}
                  p={0}
                  placeholder="Type here"
                  c={'#000'}
                />
              </View>
              <Text mt={32} c={"#141418"} ftsz={13} weight="500">
                Subject*
              </Text>
              <SelectInput
                selectedOptions={subject}
                snapPoints={["50%"]}
                value={subject}
                onSelect={index => {
                  onSelectSubject(index);
                }}
                options={[
                  "Booking a session",
                  "Payments",
                  "Other",
                ]}
                label="Subject*"
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    mt={8}
                    bbw={1}
                    bc={"#7F8A8E"}
                    fd="row"
                    ai="center">
                    <Text
                      f={1}
                      ftsz={12}
                      weight="400"
                      c={subject?.length > 0 ? "#000" : "#7F8A8E"}
                      pb={4}>
                      {subject?.length > 0 ? subject : "Choose here"}
                    </Text>
                    <View>
                      <Icons.ChevronLeft
                        width={24}
                        height={24}
                        fill={"#000"}
                        style={{
                          transform: [
                            {
                              rotate: "270deg",
                            },
                          ],
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
              <Text mt={32} c={"#141418"} ftsz={13} weight="500">
                Description*
              </Text>
              <View mt={12} h={100} bw={1} bc={"#7F8A8E"} br={12}>
                <TextInput
                  onChangeText={(t)=>setDesc(t)}
                  placeholderTextColor={"#7F8A8E"}
                  ph={8}
                  pv={8}
                  multiline
                  p={0}
                  placeholder="Type here"
                  c={'#000'}
                />
              </View>
              <Text mt={32} c={"#141418"} ftsz={13} weight="500">
                Add Attachment
              </Text>
              <View fd="row" ai="center" mt={8}>
              <TouchableOpacity onPress={() => requestGalleryPermission("photo")} mr={20} w={50} h={50} bw={1} br={12} jc="center" ai="center">
                <Text ftsz={20}>+</Text>
              </TouchableOpacity>
              <ScrollView scrollEnabled={true} horizontal contentContainerStyle={{flexGrow:1}}>
              {image?.[0]?.name?.length > 0 && (
                image?.map((item)=>{
                  return(
                    <>
                    <View w={50} h={50} mt={8} ai="center" fd="row" jc="center" mh={10}>
                      <Image
                        w={50}
                        h={50}
                        source={{ uri: item?.uri }}
                        resizeMode="contain"
                      />
                      <TouchableOpacity po="absolute" t={-10} r={-10} onPress={() => removeImage(item?.uri)}>
                        <Icon name="close" size={18} color={"#000"} />
                      </TouchableOpacity>
                    </View>
                  </>
                  )
                })
              )}
              </ScrollView>
              </View>
              <TouchableOpacity
                mt={8}
                onPress={() => requestGalleryPermission("photo")}
                jc="center"
                ai="center"
                pv={16}
                br={12}
                bgc={"rgba(255, 255, 255, 0.65)"}>
                <Text c={"#333333"} ftsz={12} weight="500">
                  Upload Image
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
          <TouchableOpacity
            onPress={handleSubmit}
            mt={16}
            jc="center"
            ai="center"
            pv={12}
            br={12}
            bgc={"#000"}
            mh={24}>
            {isLoading ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text c={"#FFF"}>Submit</Text>}
          </TouchableOpacity>
          <Text ftsz={12} weight="500" c={"#4772F4"} mv={8} ta="center">
            You can also reach out to us at support@mapout.com.{" "}
          </Text>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default ContactUs;
