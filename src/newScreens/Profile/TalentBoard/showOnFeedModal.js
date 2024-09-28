import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../../components";
import Icon from "react-native-vector-icons/AntDesign";

const ShowOnFeedModal = props => {
  const { closeModal, showModal , handleShareOnFeed } = props;
  const insets = useSafeAreaInsets();
  const isLoading = false

  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
        <View bgc={"#FFF"} btrr={24} btlr={24} pt={16} ph={32}>
          <TouchableOpacity hitSlop={10} onPress={closeModal} asf="flex-end">
            <Icon name="close" size={18} color={"#202020"} />
          </TouchableOpacity>
          <Text ftsz={16} weight="500" ta="center">
            Congratulations!
          </Text>
          <Text mt={24} ftsz={14} weight="500" ta="center" c="#000000">
            Your project is now LIVE on your profile. Do you also want to share
            on the Feed for other users to see?
          </Text>
          <TouchableOpacity
          onPress={() => handleShareOnFeed()}
          style={{
            marginTop: 20,
            backgroundColor: "#000000",
            alignItems: "center",
            borderRadius: 12,
            paddingVertical: 22,
          }}>
          {isLoading ? (
            <ActivityIndicator color={"#FFFFFF"} />
          ) : (
            <Text style={{ color: "#FFFFFF" }}>Share On Feed</Text>
          )}
        </TouchableOpacity>
        </View>
        <View bgc={"#FFF"} h={insets.bottom} />
      </View>
    </Modal>
  );
};

export default ShowOnFeedModal;
