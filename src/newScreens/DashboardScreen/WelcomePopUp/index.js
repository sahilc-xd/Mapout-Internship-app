import React from "react";
import { Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../components";
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WelcomePopup = props => {
  const { showPopup, closePopup } = props;
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={showPopup}
      animationType="fade"
      transparent
      onRequestClose={closePopup}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} onPress={closePopup} f={1} />
        <View bgc={"#FFF"} btrr={30} btlr={30} pt={32} pb={16} ph={24}>
          <TouchableOpacity onPress={closePopup} asf="flex-end" t={0}>
            <Icon name="close" color={"#000"} size={18} />
          </TouchableOpacity>
          <Text ph={32} ta="center" ftsz={16} weight="600">
            Yay! We are excited to be your career co-pilot{" "}
          </Text>
          <Text mt={16} ftsz={12} weight="500">
            Here are 5 ways to get started:
          </Text>
          <View fd="row" mt={16}>
            <Text ftsz={12} weight="400">
              <Text ftsz={12} weight="600">
                1.{" "}
              </Text>
              <Text weight="800">Build Your Profile:</Text> Craft a{" "}
              <Text weight="600">standout profile</Text> that reflects your
              unique skills, experience, and aspirations.
            </Text>
          </View>
          <View fd="row" mt={16}>
            <Text ftsz={12} weight="400">
              {" "}
              <Text ftsz={12} weight="600">
                2.{" "}
              </Text>
              <Text weight="800">Explore Coaching: </Text>Dive into our{" "}
              <Text weight="600">daily coaching,</Text> covering essential
              topics to boost your essential soft skills.
            </Text>
          </View>
          <View fd="row" mt={16}>
            <Text ftsz={12} weight="400">
              {" "}
              <Text ftsz={12} weight="600">
                3.{" "}
              </Text>
              <Text weight="800">Engage with Success Mentors:</Text> Connect
              with specialists who can provide valuable guidance and support in
              your career path.
            </Text>
          </View>
          <View fd="row" mt={16}>
            <Text ftsz={12} weight="400">
              <Text ftsz={12} weight="600">
                4.{" "}
              </Text>
              <Text weight="800">Browse Jobs: </Text>Discover exciting{" "}
              <Text weight="600">job opportunities</Text> tailored to your
              profile, abilities and interests.
            </Text>
          </View>
          <View fd="row" mt={16}>
            <Text ftsz={12} weight="400">
              {" "}
              <Text ftsz={12} weight="600">
                5.{" "}
              </Text>
              <Text weight="800">Career Discovery Quiz: </Text>Take the{" "}
              <Text weight="600">assessment</Text> to discover the careers best
              matched to your personality and interest.
            </Text>
          </View>
          <Text mt={16} ftsz={12} weight="500">
            Let the journey begin!
          </Text>
          <TouchableOpacity
            onPress={closePopup}
            mt={32}
            bgc={"#000"}
            br={12}
            pv={12}
            jc="center"
            ai="center">
            <Text c={"#FFF"} ftsz={14} weight="500">
              Get started
            </Text>
          </TouchableOpacity>
          <View h={insets?.bottom}/>
        </View>
        
      </View>
    </Modal>
  );
};

export default WelcomePopup;
