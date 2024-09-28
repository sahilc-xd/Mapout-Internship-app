import React, { useEffect } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native-style-shorthand";
import MainLayout from "../../components/MainLayout";
import { Text } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import { navigate, popNavigation } from "../../utils/navigationService";
import { Alert } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const CareerAnalysisStepper = (props) => {
  const currentStep = props?.route?.params?.currentStep || 1;
  const aspirations = props?.route?.params?.aspirations || [];

  const renderStepIndicator = (step, isActive) => (
    <View
      h={28}
      w={28}
      br={28}
      bw={2}
      bc={isActive && currentStep === step ? "#171717" : "#7E7E7E"}
      jc="center"
      ai="center"
      //   bgc={isActive ? "#000" : "#8e8e8e"}
    >
      {isActive ? (
        <Text ftsz={14} c={currentStep === step ? "#171717" : "#7E7E7E"}>
          {step}
        </Text>
      ) : (
        <Icon name="check" size={14} color="#7E7E7E" />
      )}
    </View>
  );

  const renderStepContent = (title, description, step, isActive) => (
    <View>
      <Text
        ftsz={14}
        weight="500"
        c={isActive && currentStep === step ? "#171717" : "#7E7E7E"}>
        {title}
      </Text>
      <Text
        ftsz={12}
        weight="300"
        c={isActive && currentStep === step ? "#171717" : "#7E7E7E"}>
        {description}
      </Text>
    </View>
  );

  const handleButtonPress = () =>{
    if(currentStep === 1){
      logAnalyticsEvents('start_personality_test',{});
        props?.navigation?.replace('PersonalityTest');
    }
    else if(currentStep === 2){
        logAnalyticsEvents('start_aspirations_test',{});
        props?.navigation?.replace('CareerAnalysisAspirations');
    }
    else if(currentStep === 3){
      logAnalyticsEvents('start_softskills_test',{});
      props?.navigation?.replace('CareerAnalysisSoftSKills', {aspirations: aspirations});
    }
  }


  return (
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
            <Text c={'#7F8A8E'}>Exit Test</Text>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Career Discovery Quiz
          </Text>
        </View>
        <View f={1} ai="center" jc="center">
          <Text ta="center" ph={32} ftsz={14} weight="500">
            {currentStep === 1 ? "The Career Discovery Quiz has 3 steps which require your undivided attention. There are no right or wrong answers, answer with what comes to you naturally." : currentStep === 2 ? "Time to find ideal careers that match your professional aspirations." : "Let’s also count your soft skills to find your best-fit careers." }
          </Text>
          <View h={250}>
            <View fd="row" jc="center" gap={10} f={1} pv={24}>
              <View mb={12}>
                {renderStepIndicator(1, currentStep === 1)}
                <View
                  f={1}
                  w={2}
                  bgc={currentStep === 1 ? "#171717" : "#7E7E7E"}
                  asf="center"
                />
                <View
                  f={1}
                  w={2}
                  bgc={currentStep === 2 ? "#171717" : "#7E7E7E"}
                  asf="center"
                />
                {renderStepIndicator(2, currentStep !== 3)}
                <View
                  f={1}
                  w={2}
                  bgc={currentStep === 2 ? "#171717" : "#7E7E7E"}
                  asf="center"
                />
                <View
                  f={1}
                  w={2}
                  bgc={currentStep === 3 ? "#171717" : "#7E7E7E"}
                  asf="center"
                />
                {renderStepIndicator(3, true)}
              </View>
              <View>
                {renderStepContent(
                  "Personality & Interests",
                  "About 10 mins",
                  1,
                  currentStep === 1,
                )}
                <View f={1} />
                {renderStepContent(
                  "Aspirations",
                  "1 min",
                  2,
                  currentStep !== 3,
                )}
                <View f={1} />
                {renderStepContent("Skills", "1 min", 3, true)}
              </View>
            </View>
          </View>
          {currentStep === 1 && <Text ta="center" ph={32} ftsz={14} weight="500">
          Once you begin the test, you cannot go back. Please review your responses before proceeding.
          </Text>}
        </View>
        <TouchableOpacity onPress={()=>{
            handleButtonPress();
        }} bgc={'#000'} mh={24} jc="center" ai="center"pv={16} br={12}>
            <Text weight="600" ftsz={14} c={'#FFF'} >Start Test</Text>
        </TouchableOpacity>
      </ImageBackground>
    </MainLayout>
  );
};

export default CareerAnalysisStepper;
