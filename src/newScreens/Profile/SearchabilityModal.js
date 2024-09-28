import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import { searchabilityScoreThreshold } from "../../utils/constants";

const SearchabilityModal = props => {
  const { closeModal, showModal } = props;
  const insets = useSafeAreaInsets();
  const howItWorks = [
    "Career Headline",
    "At least 3 projects on your Talentbaord",
    "Profile Picture",
    "Profile Video",
    "Experience, Education & Skills",
  ];
  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
        <View bgc={"#FFF"} btrr={24} btlr={24} pt={16} ph={32}>
            <TouchableOpacity hitSlop={10} onPress={closeModal} asf='flex-end'>
                        <Icon name="close" size={18} color={"#202020"}/>
            </TouchableOpacity>
          <Text ftsz={16} weight="500" ta="center">
            Your Searchability Score
          </Text>
          {/* <View asf="center" fd="row" ai="center">
            <Image
              source={require("../../assets/gifs/FireAnimation.gif")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text ta="center" ml={8} c={"#FFD439"} ftsz={12} weight="500">
              Earn 50 points when score is above 70%
            </Text>
          </View> */}
          <Text mt={24} ftsz={12} weight="600">
            Build Your MapOut Persona and get discovered!
          </Text>
          <Text mt={16} ftsz={12} weight="400">
            <Text ftsz={12} weight="600">
              MapOut’s Persona and its Searchability Score
            </Text>{" "}
            is your way to turn up the volume on your{" "}
            <Text ftsz={12} weight="600">
              skills, individuality, and brilliance
            </Text>{" "}
            so the right employers can't help but notice you.
          </Text>
          <Text mt={16} ftsz={12} weight="500">
            Here's how it works:
          </Text>
          {
            searchabilityScoreThreshold.map((item, index)=>{
              return(
                <View key={index.toString()} fd="row" ai="flex-start">
                  <View mt={9} mr={8} h={4} w={4} bgc={'#000'} br={2}/>
                  <View f={1}><Text ftsz={12} weight="600">{item.title} - <Text ftsz={12} weight="400">{item.desc}</Text></Text></View>
                </View>
              )
            })
          }
          <Text mt={16} ftsz={12} weight="400">
            It’s simple. Complete all the elements and boost your visibility!
          </Text>
          <View gap={2} mt={4}>
            {howItWorks?.map((item, index) => {
              return (
                <View key={index?.toString()} fd="row" ai="center" ml={4}>
                  <View mt={1.5} h={4} w={4} br={2} bgc={"#000"} />
                  <Text ftsz={12} weight="400" ml={8}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text mt={2} ftsz={12} weight="400">
            The higher the score, the more “searchable” you are.
          </Text>
        </View>
        <View bgc={"#FFF"} h={insets.bottom} />
      </View>
    </Modal>
  );
};

export default SearchabilityModal;
