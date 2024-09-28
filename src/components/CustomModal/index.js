import React from "react";
import { Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "..";
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ICONS } from "../../constants";

const CustomModal = ({
  showModal = false,
  closeModal = false,
  heading = "",
  text = "",
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          f={1}
        />
        <View bgc={"#FFF"} btrr={24} btlr={24} pt={16} ph={32}>
          <TouchableOpacity onPress={closeModal} asf="flex-end" t={0}>
            <Icon name="close" size={18} color={"#000"} />
          </TouchableOpacity>
          <View fd="row" ai="center">
            <ICONS.Info width={24} height={24} fill={"#EDEDED"} />
            <Text ml={8} ftsz={16} weight="500">
              {heading}
            </Text>
          </View>
          <Text mt={32} ftsz={14} weight="400">
            {text}
          </Text>
        </View>
        <View bgc={"#FFF"} h={insets.bottom} />
      </View>
    </Modal>
  );
};

export default CustomModal;
