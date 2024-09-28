import React from 'react';
import MainLayout from '../../components/MainLayout';
import { ImageBackground, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import { Alert } from 'react-native';

const CareerAnalysisIdealCareer = ()=>{
    return(
<MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CareerAnalysisScreen/CareerAnalysisBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
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
            l={16}>
            <Text c={"#7F8A8E"}>Exit Test</Text>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Ideal Careers
          </Text>
        </View>
        </ImageBackground>
        </MainLayout>
    )
}

export default CareerAnalysisIdealCareer;