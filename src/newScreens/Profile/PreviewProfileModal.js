import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import Icon from "react-native-vector-icons/AntDesign";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import { useAppSelector } from "../../redux";
import { Platform } from "react-native";

const PreviewProfileModal = props => {
  const user = useAppSelector(state => state.user);
  const { showModal, closeModal } = props;
  const insets = useSafeAreaInsets();
  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
        <View bgc={"#FFF"} btrr={24} btlr={24} pt={16}>
          <TouchableOpacity
            ph={32}
            hitSlop={10}
            onPress={closeModal}
            asf="flex-end">
            <Icon name="close" size={18} color={"#202020"} />
          </TouchableOpacity>
          <Text ta="center" ftsz={15} weight="600">Preview</Text>
          <View mt={16}>
            <TouchableOpacity
              onPress={() => {
                navigate("EditProfile", { tab: "Preview" });
                closeModal();
              }}
              btw={0.4}
              pv={16}
              jc="center"
              ai="center">
              <Text ta="center">Your view</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigate("UserProfile", { targetId: user?.user_id });
                closeModal();
              }}
              btw={0.4}
              pv={16}
              jc="center"
              ai="center">
              <Text ta="center">Any user’s view</Text>
            </TouchableOpacity>
            <TouchableOpacity
              btw={0.4}
              bbw={0.4}
              pv={16}
              jc="center"
              ai="center">
              <Text ta="center">Employer’s view <Text ftsz={10} >(Coming soon)</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'ios' && <View bgc={"#FFF"} h={insets.bottom} />}
      </View>
    </Modal>
  );
};

export default PreviewProfileModal;
