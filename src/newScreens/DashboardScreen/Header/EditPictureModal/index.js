import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../../components";
import { ICONS } from "../../../../constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../../../redux";

const EditPictureModal = props => {
  const { profileModal = false, closePictureModal = false, uploadFromCamera=false, requestGalleryPermission=false } = props;
  const user = useAppSelector(state => state?.user);
  const profilePic = user?.profilePic || false;

  return (
    <Modal
      animationType="fade"
      onRequestClose={closePictureModal}
      transparent
      visible={profileModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
      <TouchableOpacity
      activeOpacity={1}
        onPress={closePictureModal}
        f={1}
      />
      <View bgc={"#FFF"} pv={16} btrr={20} btlr={20}>
        <TouchableOpacity onPress={closePictureModal} ai="flex-end" mh={24}>
          <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <Text mb={16} ta="center" ftsz={16} weight="500" c={"#000"}>
          Add/Edit Profile Picture
        </Text>
        <View fd="row" mh={64} jc="center">
          {profilePic ? <Image source={{uri: profilePic}} br={8} w={100} h={100} resizeMode="contain"/> : <>
          {/* <Image
              source={require("../../../../assets/gifs/FireAnimation.gif")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
          />
          <Text ml={4} ta="center" c={"#EFC019"} ftsz={12} weight="600">
            Earn 10 points the first time you add a profile picture
          </Text> */}
          </>
          }
        </View>
        <Text mt={16} ftsz={14} weight="500" c={"#000"} ta="center">
          {profilePic ?  `Update photo` : `Upload a photo`}
        </Text>
        <Text mb={16} mh={32} ftsz={12} weight="400" ta="center" c={"#7F8A8E"}>
          Suitable formats: jpg, png. No more than 10mb
        </Text>
        <View w={"100%"} h={0.4} bgc={"#000"}></View>
        <TouchableOpacity onPress={()=>{requestGalleryPermission("photo")}}>
          <Text ta="center" pv={16} c={"#6691FF"} weight="400" ftsz={14}>
            Gallery
          </Text>
        </TouchableOpacity>
        <View w={"100%"} h={0.4} bgc={"#000"}></View>
        <TouchableOpacity onPress={()=>{uploadFromCamera("photo")}}>
          <Text ta="center" pv={16} c={"#6691FF"} weight="400" ftsz={14}>
            Use Camera
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </Modal>
  );
};

export default EditPictureModal;
