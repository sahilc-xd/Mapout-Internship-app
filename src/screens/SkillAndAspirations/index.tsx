import React from "react";
import {SafeAreaView, TouchableOpacity, View} from "react-native-style-shorthand";

import {ConfirmBack, Text} from "../../components";
import { ICONS } from "../../constants";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useIsFocused } from "@react-navigation/native";

const SkillButton = ({title, color, isSelected, onPress}) => (
  <TouchableOpacity onPress={onPress} bw={1} bc={color} pv={6} ph={13} bgc={isSelected ? color : 'transparent'} br={40}>
    <Text c={isSelected ? "white" : color} ftsz={12} lh={18} weight="400">{title}</Text>
  </TouchableOpacity>
);

const SkillAndAspirations = ({navigation}: any) => {
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (selectedSkills.length === 2) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedSkills]);

  const onSelectSkill = (skill) => () => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if(selectedSkills.length === 2){
        Toast.show({
          type: 'error',
          text1: 'Only 2 can be selected.'
        });
      }
      else{
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const onPressNext = () => {
    navigation.navigate("SoftSkillsAssessment", {desires_aspirations: selectedSkills});
  };

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  useStatusBar('#FFF', 'dc', isFocused)

  return (
    <View f={1} mb={30}>
      <Text pt={23} ftsz={12} ta="center" c="#8E8E8E">Q1/02</Text>
      <Text pt={17} ph={42} lh={21} ta="center" c="#FFF" weight="500">What are your desires and aspirations related to career?</Text>
      <Text pt={12} pb={30} ftsz={12} ta="center" c="#8E8E8E">Choose your top 2</Text>
      <View f={1} ai="center" jc="center" gap={12}>
        <View fd="row" gap={8} ai="center">
          <SkillButton
            title="Social Impact"
            color="#D0B9EC"
            isSelected={selectedSkills.includes("Social Impact")}
            onPress={onSelectSkill("Social Impact")}
          />
          <ICONS.SkillArrowUp />
          <SkillButton
            title="Growth"
            color="#3F8F61"
            isSelected={selectedSkills.includes("Growth")}
            onPress={onSelectSkill("Growth")}
          />
          <ICONS.SkillArrowLeftLarge />
        </View>
        <View fd="row" gap={8} ai="center">
          <View h={30} w={30} br={30} bgc={"#D0B9EC"} />
          <SkillButton
            title="Fulfillment"
            color="#FBD238"
            isSelected={selectedSkills.includes("Fulfillment")}
            onPress={onSelectSkill("Fulfillment")}
          />
          <ICONS.SkillArrowLeftLarge2 />
          <ICONS.SkillArrowLeft />
          <SkillButton
            title="Money"
            color="#D0B9EC"
            isSelected={selectedSkills.includes("Money")}
            onPress={onSelectSkill("Money")}
          />
        </View>
        <View fd="row" gap={8} ai="center">
          <ICONS.SkillArrowRight />
          <SkillButton
            title="Recognition"
            color="#C0ECB9"
            isSelected={selectedSkills.includes("Recognition")}
            onPress={onSelectSkill("Recognition")}
          />
          <View h={30} w={30} br={30} bgc={"#FFF6C6"} />
          <SkillButton
            title="Independence"
            color="#754DA4"
            isSelected={selectedSkills.includes("Independence")}
            onPress={onSelectSkill("Independence")}
          />
        </View>
        <View fd="row" gap={8} ai="center">
          <ICONS.SkillArrowRightLarge />
          <SkillButton
            title="Influence"
            color="#FFF6C6"
            isSelected={selectedSkills.includes("Influence")}
            onPress={onSelectSkill("Influence")}
          />
          <SkillButton
            title="Innovation"
            color="#3F8F61"
            isSelected={selectedSkills.includes("Innovation")}
            onPress={onSelectSkill("Innovation")}
          />
          <View h={30} w={30} br={30} bgc={"#C0ECB9"} />
        </View>
        <View fd="row" gap={8} ai="center">
          <SkillButton
            title="Financial Security"
            color="#C0ECB9"
            isSelected={selectedSkills.includes("Financial Security")}
            onPress={onSelectSkill("Financial Security")}
          />
          <ICONS.SkillArrowRightLarge2 />
          <ICONS.SkillArrowDown />
          <SkillButton
            title="Purpose"
            color="#D0B9EC"
            isSelected={selectedSkills.includes("Purpose")}
            onPress={onSelectSkill("Purpose")}
          />
        </View>
        <View fd="row" gap={8} ai="center">
          <SkillButton
            title="Creativity"
            color="#FFF6C6"
            isSelected={selectedSkills.includes("Creativity")}
            onPress={onSelectSkill("Creativity")}
          />
          <View h={30} w={30} br={30} bgc={"#D0B9EC"} />
          <SkillButton
            title="Entrepreneurship"
            color="#F6CA53"
            isSelected={selectedSkills.includes("Entrepreneurship")}
            onPress={onSelectSkill("Entrepreneurship")}
          />
        </View>
      </View>
      <TouchableOpacity onPress={onPressNext} disabled={disabled} mb={42} mh={32} h={44} br={8} jc="center" bgc={disabled ? "#D9D9D9" : "#FFFFFF"}>
        <Text weight="700" ftsz={14} ta="center" c={disabled ? "#fff" : "#000"}>Next</Text>
      </TouchableOpacity>
      <ConfirmBack exitOnBack />
    </View>
  );
};

export default SkillAndAspirations;
