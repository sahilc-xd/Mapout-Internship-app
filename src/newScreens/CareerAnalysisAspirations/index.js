import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ImageBackground,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native-style-shorthand";
import { popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";
import Toast from "react-native-toast-message";
import { ICONS } from "../../constants";
import { Alert } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const SkillButton = ({ title, color, isSelected, onPress, size, style, selectionOrder }) => {
  const getBackgroundColor = () => {
    if (selectionOrder === 1) return "#B785F9"; // Blue
    if (selectionOrder === 2) return "#ABC2FF"; // Purple
    return "#FFF";
  };

   const selectedShadowStyle = isSelected
    ? {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 20,
        elevation: 40,
      }
    : {};

  const getTextColor = () => {
    return isSelected ? "#000" : "#7F8A8E";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: size / 2,
          height: size,
          width: size,
          alignItems: "center",
          justifyContent: "center",
          position: 'absolute',
           ...selectedShadowStyle,
        },
        style
      ]}
    >
      <Text c={getTextColor()} ftsz={11} weight="500">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const CareerAnalysisAspirations = (props) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(selectedSkills.length !== 2);
  }, [selectedSkills]);

  const onSelectSkill = (skill) => () => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length === 2) {
        Toast.show({
          type: "error",
          text1: "Only 2 can be selected.",
        });
      } else {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handlePressNext = () => {
    logAnalyticsEvents("aspirations_test_next", {});
    props?.navigation?.replace("CareerAnalysisStepper", {
      currentStep: 3,
      aspirations: selectedSkills,
    });
  };

  const bubbles = [
    { title: "Social Impact", color: "#B785F9", size: 125, style: { top: 90, left: 80 } },
    { title: "Growth", color: "#B9E4A6", size: 91, style: { top: 50, right: 115 } },
    { title: "Fulfillment", color: "#4772F4", size: 91, style: { top: 120, right:1 } },
    { title: "Money", color: "#9767D5", size: 91, style: { top: 190, left:0 } },
    { title: "Recognition", color: "#B9E4A6", size: 91, style: { top: 230, left: 100 } },
    { title: "Independence", color: "#754DA4", size: 125, style: { bottom: 305, right: 85 } },
    { title: "Influence", color: "#4772F4", size: 91, style: { top:10, left: 300 } },
    { title: "Innovation", color: "#B9E4A6", size: 91, style: { top: 30, left: 5 } },
    { title: "Financial Security", color: "#B9E4A6", size: 125, style: { bottom: 140, left: 10 } },
    { title: "Purpose", color: "#ABC2FF", size: 91, style: { bottom: 170, right: 150 } },
    { title: "Entrepreneurship", color: "#4772F4", size: 125, style: { bottom: 180, right: 10 } },
  ];

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CareerAnalysisScreen/CareerAnalysisBackground.png")}
        resizeMode="cover"
      >
        <View bgc={"#FFF"} ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Your progress will be lost.", "Are you sure you want to exit?", [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    popNavigation();
                  },
                },
              ]);
            }}
            po="absolute"
            l={16}
          >
            <Text c={"#7F8A8E"}>Exit</Text>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Aspirations
          </Text>
          <View po="absolute" r={8} fd="row">
            <View mh={4} h={8} w={8} bgc={"#000"} br={4} />
            <View mh={4} h={8} w={16} bgc={"#000"} br={4} />
            <View mh={4} h={8} w={8} bgc={"#D9D9D9"} br={4} />
          </View>
        </View>
        <View f={1}>
          <Text mt={40} ftsz={16} weight="500" ph={32} ta="center">
            What are your desires and aspirations related to career?
          </Text>
          <Text mt={16} ftsz={12} weight="400" ph={32} ta="center">
            Choose your top 2
          </Text>
          <View f={1} ai="center" jc="center">
            <View style={{ width: '100%', height: '100%' }}>
              {bubbles.map((bubble) => (
                <SkillButton
                  key={bubble.title}
                  title={bubble.title}
                  color={bubble.color}
                  isSelected={selectedSkills.includes(bubble.title)}
                  onPress={onSelectSkill(bubble.title)}
                  size={bubble.size}
                  style={bubble.style}
                  selectionOrder={selectedSkills.indexOf(bubble.title) + 1}
                />
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePressNext}
          disabled={disabled}
          style={{
            backgroundColor: disabled ? "#7F8A8E" : "#000",
            marginHorizontal: 24,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 16,
            borderRadius: 12,
          }}
        >
          <Text ftsz={14} weight="600" c={"#FFF"}>
            Next
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default CareerAnalysisAspirations;
