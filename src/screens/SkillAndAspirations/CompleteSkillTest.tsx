import React, { useEffect } from "react";
import {TouchableOpacity, View, ImageBackground} from "react-native-style-shorthand";

import {Text} from "../../components";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { UpdateStatus } from "../../utils/updateStatus";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/userSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useIsFocused } from "@react-navigation/native";


const SkillAndAspirations = ({navigation}: any) => {

  const userId = useAppSelector(state => state.user.user_id);


  const [saveProfile, {isSuccess}] = api.useSaveProfileMutation();
const dispatch = useDispatch()

  useEffect(() => {
    if(isSuccess){
      dispatch(userActions.updateLastUpdateStatus(UpdateStatus.AspirationSkills));
      navigation.push("StartPersonalityTest", { currentStep: 3 });
    }
  },[isSuccess])


  const onPressNext = () => {
    try {
      saveProfile({ user_id : userId , lastUpdate : UpdateStatus.AspirationSkills })
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  useStatusBar('#000', 'lc', isFocused)

  return (
    <ImageBackground f={1} jc="center" source={require("../../assets/images/bg_pattern.png")} pb={-insets.bottom} pt={-insets.top}>
      <View bgc="white" br={45} mh={32} ph={15} pv={52}>
        <Text lh={27.5} ftsz={18} weight="500" ta="center" c="#000">
          Hooray,{`\n`}
          you're just one step away from finding out your ideal careers!
        </Text>
        <Text pt={32} lh={24.5} ftsz={16} weight="400" ta="center" c="#000">
          We've found 50+ new career options, let's now personalise them to your experience.
        </Text>
        <TouchableOpacity mt={40} onPress={onPressNext} h={44} br={8} jc="center" bgc={"#000"}>
        <Text weight="700" ftsz={14} ta="center" c={"#fff"}>Next</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SkillAndAspirations;
