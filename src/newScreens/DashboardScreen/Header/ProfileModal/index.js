import React from "react";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../../../components";
import { ICONS } from "../../../../constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../../../redux";
import { navigate } from "../../../../utils/navigationService";

const ProfileModal = props => {
  const {
    closeModal = false,
    showModal = false,
    openPictureModal = false,
    openVideoModal = false,
    isLoadingImage = false,
    isLoadingVideo = false,
  } = props;

  const user = useAppSelector(state => state.user);
  const isProfilePicUploaded = user?.profilePic?.length > 0 ? true : false;
  const isProfileVideoUploaded = user?.profileVideo?.link?.length > 0 ? true : false;

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={showModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
      <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
      <View bgc={"#FFF"} pv={16} pb={32} btrr={20} btlr={20}>
        <TouchableOpacity
          hitSlop={20}
          onPress={closeModal}
          ai="flex-end"
          mh={24}>
          <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <Text mb={16} ta="center" ftsz={16} weight="500" c={"#000"}>
          Your Profile
        </Text>
        <View fd="row" mh={24} gap={8}>
          {/* <TouchableOpacity
            onPress={openPictureModal}
            jc="space-between"
            pv={16}
            ph={8}
            f={1}
            bw={1}
            bc={"#6691FF"}
            bs="dashed"
            br={12}>
            {isLoadingImage ? (
              <ActivityIndicator
                mv={16}
                color={"#6691FF"}
                size={30}
                asf="center"
              />
            ) : isProfilePicUploaded ? (
              <View mv={16} asf="center" bgc={"#B9E4A6"} ph={4} pv={4} br={20}>
                <ICONS.Check width={28} height={28} />
              </View>
            ) : (
              <Text pv={8} ta="center" ftsz={32} weight="500" c={"#6691FF"}>
                +
              </Text>
            )}
            <Text pv={8} ta="center" ftsz={12} weight="400" c={"#000000"}>
              Add/Edit Profile Picture
            </Text>
            {!isProfilePicUploaded && (
              <View jc="center" fd="row" ai="center">
                <ICONS.FireEmoji width={12} height={12} />
                <Text ml={4} c={"#FFD439"} ftsz={10} weight="500">
                  Earn 10 points
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openVideoModal}
            jc="space-between"
            pv={16}
            ph={8}
            f={1}
            bw={1}
            bc={"#6691FF"}
            bs="dashed"
            br={12}>
            {isLoadingVideo ? (
              <ActivityIndicator
                mv={16}
                color={"#6691FF"}
                size={30}
                asf="center"
              />
            ) : isProfileVideoUploaded ? (
              <View mv={16} asf="center" bgc={"#B9E4A6"} ph={4} pv={4} br={20}>
                <ICONS.Check width={28} height={28} />
              </View>
            ) : (
              <Text pv={8} ta="center" ftsz={32} weight="500" c={"#6691FF"}>
                +
              </Text>
            )}
            <Text pv={8} ta="center" ftsz={12} weight="400" c={"#000000"}>
              Add/Edit Profile Video
            </Text>
            {!isProfileVideoUploaded && (
              <View jc="center" fd="row" ai="center">
                <ICONS.FireEmoji width={12} height={12} />
                <Text ml={4} c={"#FFD439"} ftsz={10} weight="500">
                  Earn 20 points
                </Text>
              </View>
            )}
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              closeModal();
              navigate("Profile");
            }}
            jc="space-between"
            pv={16}
            ph={8}
            f={1}
            bw={1}
            bc={"#6691FF"}
            bs="dashed"
            br={12}>
            <View mv={8} ai="center">
            </View>
            <Text ph={64} pv={8} ta="center" ftsz={12} weight="400" c={"#000000"}>
              Complete/Edit Profile
            </Text>
            {/* <View jc="center" fd="row" ai="center">
              <ICONS.FireEmoji width={12} height={12} />
              <Text ml={4} c={"#FFD439"} ftsz={10} weight="500">
                Earn 30 points
              </Text>
            </View> */}
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;
