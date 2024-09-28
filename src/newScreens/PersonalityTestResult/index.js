import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import RenderHTML from "react-native-render-html";
import { Alert, useWindowDimensions } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const MBTITestResult = props => {
  const [selectedTab, setSelectedTab] = useState("MBTI");
  const scrollRef = useRef(null);
  const user = useAppSelector(state => state.user);
  const userId = user?.user_id;
  const testId = useAppSelector(state => state.careerTest?.testId);
  const testResult = useAppSelector(state => state.careerTest?.result);
  const result = testResult ? testResult : user?.MBTI_assesment;
  const shouldSkipApiCall = !userId || !testId;
  const { isLoading, isError, isSuccess } = api.useGetCareerTestResultQuery(
    { userId, testId },
    { skip: shouldSkipApiCall },
  );
  const width = useWindowDimensions()?.width -48-32;

  useEffect(() => {
    logAnalyticsEvents('personality_test_result', {selectedTab : selectedTab})
    if (selectedTab === "Hoolland") {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [selectedTab]);

  const handleButton = () => {
    if (selectedTab === "MBTI") {
      setSelectedTab("Holland");
    } else if (selectedTab === "Holland") {
      props?.navigation?.replace("CareerAnalysisStepper", { currentStep: 2 });
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CareerAnalysisScreen/CareerAnalysisBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Your progress will be lost.",
                "Are you sure you want to exit?",
                [
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
                ],
              );
            }}
            po="absolute"
            l={16}>
            <Text c={"#7F8A8E"}>Exit Test</Text>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Career Discovery Quiz
          </Text>
        </View>
        {isLoading ? (
          <View f={1} jc="center" ai="center">
            <ActivityIndicator size={"large"} color={"#000"} />
            <Text mt={16} ph={32} ta="center" ftsz={14} weight="600">
              Please wait, we are preparing your results...
            </Text>
          </View>
        ) : (
          <View f={1} ai="center" ph={24}>
            <ScrollView contentContainerStyle={{flexGrow:1}}  showsVerticalScrollIndicator={false}>
            <View f={1} w={"100%"} jc="center">
              <Text mb={8} ftsz={18} weight="600" ta="center">
                    YOUR {selectedTab === "MBTI" ? "MBTI" : "HOLLAND CODE"} TYPE
                  </Text>
              <View
                w={"100%"}
                bgc={selectedTab === "MBTI" ? "#DAD7FF" : "#D9BCFF"}
                pv={16}
                br={12}>
                <View mh={16}>
                  <Text ftsz={18} weight="700" ta="center">
                    {selectedTab === "MBTI"
                      ? result?.mbti?.code
                      : result?.riasec?.code}
                  </Text>
                  <Text mt={8} ftsz={14} weight="700" ta="center">
                    {selectedTab === "MBTI"
                      ? result?.mbti?.full_form
                      : result?.riasec?.full_form}
                  </Text>
                </View>
              </View>
              <View
                f={1}
                w={"100%"}
                bgc={selectedTab === "MBTI" ? "rgba(231, 229, 253, 0.75)" : "#ECDEFF"}
                mv={32}
                jc="center"
                br={12}>
                <ScrollView
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                ph={16}
                mb={16}
                showsVerticalScrollIndicator={false}
                pt={16}
                ref={scrollRef}>
                {selectedTab === "MBTI" ? (
                  <>
                  <RenderHTML
                    systemFonts={["RedHatDisplay-Regular"]}
                    source={{ html: result?.mbti?.summary_for_short_report }}
                    tagsStyles={tagsStyles}
                    contentWidth={width}
                  />
                  </>
                ) : (
                  <>
                    <Text ftsz={14} weight="400">
                      {result?.riasec?.detail}
                    </Text>
                  </>
                )}
                </ScrollView>
              </View>
            </View>
            </ScrollView>
            <TouchableOpacity
              w={"100%"}
              onPress={handleButton}
              bgc={"#000"}
              mh={24}
              pv={12}
              br={12}
              mt={8}
              jc="center"
              ai="center">
              <Text c={"#FFF"} ftsz={18} weight="600">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </MainLayout>
  );
};

const tagsStyles = {
  body: {
    whiteSpace: "normal",
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
  },
};

export default MBTITestResult;
