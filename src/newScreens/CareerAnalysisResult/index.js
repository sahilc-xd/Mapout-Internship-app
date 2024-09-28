import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import RenderHTML from "react-native-render-html";
import IdealCareerTab from "./idealCareerTab";
import { PanResponder } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const CareerAnalysisResult = props => {
  const type = props?.route?.params?.type || false;
  const [selectedTab, setSelectedTab] = useState(
    type === "Ideal Career"
      ? "Ideal Career"
      : type === "Personality"
      ? "Personality"
      : type === "Interests"
      ? "Interests"
      : "Personality",
  );
  const user = useAppSelector(state => state.user);
  const userId = user?.user_id;
  const testId = useAppSelector(state => state.careerTest?.testId);
  const testResult = useAppSelector(state => state.careerTest?.result);
  const result = testResult ? testResult : user?.personality_assesment;
  const shouldSkipApiCall = !userId || !testId || testResult?.resultGenarated;
  const { isLoading, isError, isSuccess } = api.useGetCareerTestResultQuery(
    { userId, testId },
    { skip: shouldSkipApiCall },
  );
  const [selectedCareer, setSelectedCareer] = useState(false);
  const [allIdealCareers, setAllIdealCareers] = useState(false);

  useEffect(()=>{
    selectedCareer && logAnalyticsEvents('career_result_career_visited', {selectedCareer: selectedCareer?.careerName})
  },[selectedCareer])

  const [
    getAllCareers,
    {
      data: idealCareers,
      isLoading: isLoadingIdealCareer,
      isError: IsErrorIdealCareer,
      error,
      isFetching,
      isSuccess: idealCareerSuccess,
    },
  ] = api.useLazyGetIdealCareersQuery();

  const careerData =
    {
      R: {
        title: "Realistic (R) - ‘Builders’",
        description: `
          <p><b>People with a Realistic Interest Type are often called ‘Builders’:</b></p>
          <ul>
            <li>As a Builder, you’re a<b><u> friendly</u></b> and work-oriented person who likes working with their hands.</li>
            <li>You prefer work or play that’s not confined to four walls.</li>
            <li>You <u><b>love the outdoors</b></u> and are not pleased with the prospect of having a desk job for a career.</li>
          </ul>
        `,
      },
      I: {
        title: "Investigative (I) - ‘Thinkers’",
        description: `
          <p><b>People with an Investigative Interest Type are often called ‘Thinkers’:</b></p>
          <ul>
            <li>Thinkers are <u><b>logical</b></u> individuals who place rationality above everything else. As a Thinker, you’re great at working with numbers, complex concepts, and new ideas.</li>
            <li>You’re <u><b>intelligent</u></b> and a<u><b> great problem solver.</b></u></li>
            <li>Your primary career would include being involved in research-oriented tasks like strategizing, planning, and organizing.</li>
          </ul>
        `,
      },
      A: {
        title: "Artistic (A) - ‘Creators’",
        description: `
          <p><b>People with an Artistic Interest Type are often called ‘Creators’:</b></p>
          <ul>
            <li>Creators are the<u><b> artists of the world</u></b>. As a Creator, your interests extend far and wide. You pursue work that keeps you engaged and relaxed at the same time.</li>
            <li>As a Creator, you <u><b>prefer working in inclusive and positive environments, preferably outdoors.</u></b></li>
            <li>Virtues like<u><b> honesty, independence, and logic attract you</b></u>, both in your personal and professional life.</li>
          </ul>
        `,
      },
      S: {
        title: "Social (S) - ‘Helpers’",
        description: `
          <p><b>People with a Social Interest Type are often called ‘Helpers’:</b></p>
          <ul>
            <li>As a Helper, you’re <b><u>driven by a need to serve others</u></b> in your life.</li>
            <li>You’re <u><b>charming, warm, and caring</b></u> to those around you and they love you for it.</li>
            <li>They place their personal values in high regard & choose work that upholds them.</li>
            <li>Your primary areas of interest are careers in healthcare, social service, or human resources.</li>
          </ul>
        `,
      },
      E: {
        title: "Enterprising (E) - ‘Persuaders’",
        description: `
          <p><b>People with an Enterprising Interest Type are often called ‘Persuaders’:</b></p>
          <ul>
            <li>As a Persuader, you are <u><b>charming and adventurous</u></b> and are not afraid of taking risks.</li>
            <li>You’re a <u><b>confident</u></b> individual who’s comfortable in positions of power and responsibility.</li>
            <li>Persuaders are <u></b>natural leaders</u></b> and hence, excel in fields that demand strategizing, managing, and visualizing long-term goals.</li>
          </ul>
        `,
      },
      C: {
        title: "Conventional (C) - ‘Organizers’",
        description: `
          <p><b>People with a Conventional Interest Type are often called ‘Organizers’:</b></p>
          <ul>
            <li>As an Organizer, you’re great with data, numbers, and detail-oriented work. You pride yourself on your ability to be <u><b>fairly organized</u></b>, even under pressure.</li>
            <li>You’re a <u><b>perfectionist</u></b> with a trained eye for possible improvements.</li>
            <li>You love workplaces that have structure and a clear workflow.</li>
            <li>They value accuracy and love to follow procedures & instructions.</li>
          </ul>
        `,
      },
    };



  useEffect(() => {
    if (idealCareerSuccess) {
      setAllIdealCareers(idealCareers?.data);
    }
  }, [idealCareerSuccess]);

  const onPressPrevious = () => {
    let selectedCareerForSwipe = "";
    setSelectedTab(prv => {
      if (prv === "Interests") {
        return "Personality";
      } else if (prv === "Ideal Career") {
        setSelectedCareer(prv1 => {
          if (prv1 === false) {
            selectedCareerForSwipe = false;
            return prv1;
          } else {
            selectedCareerForSwipe = prv1;
            return false;
          }
        });
        if (selectedCareerForSwipe === false) {
          return "Interests";
        } else {
          return prv;
        }
      } else return prv;
    });
  };

  const onPressNext = () => {
    setSelectedTab(prv => {
      if (prv === "Personality") {
        return "Interests";
      } else if (prv === "Interests") {
        return "Ideal Career";
      } else return prv;
    });
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (
          gestureState.dy > 5 ||
          gestureState.dy < -5 ||
          (gestureState.dx <= 10 && gestureState.dx >= -10)
        ) {
          return false;
        }
        return true;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          onPressNext();
        } else if (gestureState.dx > 50) {
          onPressPrevious();
        }
      },
    }),
  ).current;

  useEffect(() => {
    getAllCareers({ userId: user?.user_id });
  }, []);

  const handleButton = () => {
    if (selectedTab === "Personality") {
      setSelectedTab("Interests");
    } else if (selectedTab === "Interests") {
      setSelectedTab("Ideal Career");
    }
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    logAnalyticsEvents('career_discovery_result', {selectedTab : selectedTab});
    if (selectedTab === "Personality" || selectedTab === "Interests") {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [selectedTab]);

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CareerAnalysisScreen/CareerAnalysisBackground.png")}
        resizeMode="cover">
        {isLoading || isLoadingIdealCareer ? (
          <View f={1} jc="center" ai="center">
            <ActivityIndicator size={"large"} color={"#000"} />
            <Text mt={16} ph={32} ta="center" ftsz={14} weight="600">
              Please wait, we are preparing your results...
            </Text>
          </View>
        ) : (
          <View f={1} {...panResponder.panHandlers}>
            <View mh={16} mt={8} mb={16}>
              <View fd="row" ai="center">
                <TouchableOpacity
                  onPress={() => {
                    navigate("BottomTab", { screen: "Dashboard" });
                  }}
                  bgc={"#000"}
                  br={100}>
                  <Icons.ChevronLeft width={32} height={32} fill={"#FFF"} />
                </TouchableOpacity>
                <Text
                  ftsz={17}
                  weight="500"
                  c={"#141418"}
                  f={1}
                  mr={32}
                  ta="center">
                  Career Discovery Quiz
                </Text>
              </View>
            </View>
            <View fd="row" mh={16}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab("Personality");
                }}
                f={1}
                ai="center"
                bc={selectedTab === "Personality" ? "#C566FF" : "#7F8A8E"}
                bbw={selectedTab === "Personality" ? 2 : 1}
                pb={8}>
                <Text ftsz={14} weight="400">
                  Personality
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab("Interests");
                }}
                f={1}
                ai="center"
                bc={selectedTab === "Interests" ? "#C566FF" : "#7F8A8E"}
                bbw={selectedTab === "Interests" ? 2 : 1}
                pb={8}>
                <Text ftsz={14} weight="400">
                  Interests
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab("Ideal Career");
                }}
                f={1}
                ai="center"
                bc={selectedTab === "Ideal Career" ? "#C566FF" : "#7F8A8E"}
                bbw={selectedTab === "Ideal Career" ? 2 : 1}
                pb={8}>
                <Text ftsz={14} weight="400">
                  Best-fit Careers
                </Text>
              </TouchableOpacity>
            </View>
            {selectedTab === "Personality" || selectedTab === "Interests" ? (
              <>
                <ScrollView contentContainerStyle={{flexGrow:1}}>
                  <View f={1} jc="center" ai="center" ph={24}>
                    <View
                      f={1}
                      w={"100%"}
                      mb={32}
                      pt={16}
                      br={12}>
                      <View
                        w={"100%"}
                        bgc={
                          selectedTab === "Personality" ? "#DAD7FF" : "#D9BCFF"
                        }
                        pv={16}
                        br={12}>
                        <View mh={16}>
                          <Text ftsz={18} weight="700" ta="center">
                            {selectedTab === "Personality"
                              ? result?.mbti?.code
                              : result?.riasec?.code}
                          </Text>
                          <Text mt={8} ftsz={14} weight="700" ta="center">
                            {selectedTab === "Personality"
                              ? result?.mbti?.full_form
                              : result?.riasec?.full_form}
                          </Text>
                        </View>
                      </View>
                      <View
                        f={1}
                        w={"100%"}
                        bgc={
                          selectedTab === "Personality"
                            ? "rgba(231, 229, 253, 0.75)"
                            : "#ECDEFF"
                        }
                        mv={32}
                        jc="center"
                        br={12}>
                        <ScrollView
                          contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center'
                          }}
                          ph={16}
                          mb={16}
                          showsVerticalScrollIndicator={false}
                          pt={16}
                          ref={scrollRef}>
                          {selectedTab === "Personality" ? (
                            <>
                              <RenderHTML
                                systemFonts={["Manrope-Regular"]}
                                source={{
                                  html: result?.mbti?.summary_for_short_report,
                                }}
                                tagsStyles={tagsStyles}
                              />
                            </>
                          ) : (
                            <>
                              {/* <Text ftsz={14} weight="400">
                                {result?.riasec?.detail}//ok----------
                              </Text> */}
                                  
                                   {result.riasec.code.split('').map((letter) => (
                                    <View key={letter} style={{ marginBottom: 16 }}>
                                      <Text ftsz={18} weight="700">{careerData[letter]?.title}</Text>
                                      <RenderHTML
                                        systemFonts={["Manrope-Regular"]}
                                        source={{
                                          html: careerData[letter]?.description,
                                        }}
                                        tagsStyles={tagsStyles}
                                      />
                                    </View>
                                  ))}
                            </>
                          )}
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  onPress={handleButton}
                  bgc={"#000"}
                  mh={24}
                  mt={8}
                  pv={12}
                  br={12}
                  jc="center"
                  ai="center">
                  <Text c={"#FFF"} ftsz={18} weight="600">
                    Next
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isFetching ? (
                  <View f={1} jc="center" ai="center">
                    <ActivityIndicator size={"large"} color={"#000"} />
                  </View>
                ) : (
                  <>
                    {allIdealCareers && (
                      <IdealCareerTab
                        data={allIdealCareers}
                        selectedCareer={selectedCareer}
                        setSelectedCareer={setSelectedCareer}
                      />
                    )}
                  </>
                )}
              </>
            )}
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
    fontFamily: "Manrope-Regular"
  },
};

export default CareerAnalysisResult;
