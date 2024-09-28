import React, { useEffect, useReducer, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../../utils/navigationService";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import LinearGradient from "react-native-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import { useWindowDimensions } from "react-native";
import LottieView from 'lottie-react-native';

const IntroScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const [step, setStep] = useState(1);
  const width = useWindowDimensions().width;
  const arr = [1, 2, 3, 4, 5];
  useEffect(() => {
    const isFirstTimeOpen = () => {
      AsyncStorage.getItem("FirstTimeAppOpen")
        .then(val => {
          if (val == "false") {
            navigate("Welcome");
          } else {
            logAnalyticsEvents(`IntroScreen`, {});
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    };
    isFirstTimeOpen();
  }, []);

  if (isLoading) {
    return (
      <View f={1} jc="center" ai="center">
        <ActivityIndicator />
      </View>
    );
  }

  const handlePressContinue = () => {
    if (step <= 4) {
      logAnalyticsEvents(`onboarding_continue_${step}`, {});
      setStep(prv => prv + 1);
      ref?.current?.next({ count: 1, animated: true });
    } else {
      logAnalyticsEvents('onboarding_next', {});
      navigate("Welcome");
    }
  };

  const color = [["#FFFFFF", "#D8E3FC"], ["#FFFFFF", "#D9BCFF"], ["#FFFFFF", "#B9E4A6"], ["#FFFFFF", "#CAF3F2"], ["#FFFFFF", "#6691FF"]]

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1}>
        <View
          po="absolute"
          pt={8}
          ph={24}
          fd="row"
          jc="space-between"
          w={"100%"}
          z={1}>
          <View fd="row" ai="center" gap={8}>
            <View bgc={"#000"} w={12} br={40} h={4} />
            <View bgc={step >= 2 ? "#000" : "#7F8A8E"} w={12} br={40} h={4} />
            <View bgc={step >= 3 ? "#000" : "#7F8A8E"} w={12} br={40} h={4} />
            <View bgc={step >= 4 ? "#000" : "#7F8A8E"} w={12} br={40} h={4} />
            <View bgc={step >= 5 ? "#000" : "#7F8A8E"} w={12} br={40} h={4} />
          </View>
          <TouchableOpacity onPress={() => {
            logAnalyticsEvents(`onboarding_skip_${step}`, {});
            navigate("Welcome")
            }}>
            <Text ftsz={14} weight="500" c={"#000"}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <View f={1}>
          <Carousel
            loop={false}
            ref={ref}
            width={width}
            // height={'100%'}
            data={[...arr]}
            scrollAnimationDuration={1000}
            onSnapToItem={index => setStep(index + 1)}
            renderItem={({ index }) => (
              <LinearGradient
                colors={color[index]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    borderRadius: 12,
                    backgroundColor: "#FFF",
                    paddingTop: 32,
                    marginHorizontal: 24,
                    marginTop: 40,
                    marginBottom: 100,
                  }}>
                  {index === 0 && (
                    <>
                      <Text pl={16} pr={32} ftsz={32} lh={35} weight="400" c={"#000"} pt={10}>
                      Build the Career you desire
                      </Text>
                      <View f={1}>
                        <Text
                          mt={32}
                          pl={16}
                          pr={8}
                          ftsz={20}
                          weight="400"
                          c={"#000"}>
                          Welcome to <Text weight="600" ftsz={20}>MapOut</Text>: Your one-stop shop for{" "}
                          <Text weight="600" ftsz={20}>
                            exploring, experiencing, and pursuing careers.
                          </Text>
                        </Text>
                        <View mt={16} f={1}>
                          {/* <Image asf="flex-end" resizeMode="contain" source={require('../../assets/gifs/OnboardingGif1.gif')} w={'70%'} h={'100%'}/> */}
                          <LottieView resizeMode="contain" source={require('../../assets/jsons/OnboardingGif1_Lottie.json')} autoPlay loop style={{width: '70%', height: '100%', alignSelf: 'flex-end'}}/>
                        </View>
                      </View>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <Text pl={16} pr={32} ftsz={32} weight="400" c={"#000"}>
                        Show off your skills and find new fans
                      </Text>
                      <View f={1}>
                        <Text
                          mt={32}
                          pl={16}
                          pr={8}
                          ftsz={18}
                          weight="400"
                          c={"#000"}>
                          Craft a{" "}
                          <Text ftsz={18} weight="600">dynamic profile with video</Text> and a{" "}
                          <Text ftsz={18} weight="600">smashing talent board. </Text>Go beyond qualifications, show your personality AND potential!
                        </Text>
                        <View mt={16} f={1}>
                        <LottieView resizeMode="contain" source={require('../../assets/jsons/OnboardingGif2_Lottie.json')} autoPlay loop style={{width: '100%', height: '100%', alignSelf: 'flex-end'}}/>
                        </View>
                      </View>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <Text pl={16} pr={32} ftsz={32} weight="400" c={"#000"}>
                        Get Career support anytime you need it
                      </Text>
                      <View f={1}>
                        <Text
                          mt={32}
                          pl={16}
                          pr={8}
                          ftsz={18}
                          weight="400"
                          c={"#000"}>
                          Never feel lost in your career journey again.
                          <Text ftsz={18} weight="600">
                           {" "}On demand 1-1 Career guidance 
                          </Text>{" "}whenever you need it.
                        </Text>
                        <View mt={16} f={1}>
                        <LottieView resizeMode="cover" source={require('../../assets/jsons/OnboardingGif3_Lottie.json')} autoPlay loop style={{width: '40%', height: '100%', alignSelf: 'flex-end'}}/>
                        </View>
                      </View>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <Text pl={16} pr={32} ftsz={32} weight="400" c={"#000"}>
                      Stop endless job hunting
                      </Text>
                      <View f={1}>
                        <Text
                          mt={32}
                          pl={16}
                          pr={8}
                          ftsz={18}
                          weight="400"
                          c={"#000"}>
                          No more searching through countless job sites. We'll match you with the{" "}<Text ftsz={18} weight="600">best-fit opportunities based on your skills, experience, and goals.</Text>
                        </Text>
                        <View mt={16} f={1} ph={32}>
                        <LottieView resizeMode="contain" source={require('../../assets/jsons/OnboardingGif4_Lottie.json')} autoPlay loop style={{width: '100%', height: '100%', alignSelf: 'flex-end'}}/>
                        </View>
                      </View>
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <Text pl={16} pr={32} ftsz={32} weight="400" c={"#000"}>
                        Stay Inspired, Stay Engaged
                      </Text>
                      <View f={1}>
                        <Text
                          mt={32}
                          pl={16}
                          pr={8}
                          ftsz={18}
                          weight="400"
                          c={"#000"}>
                          Every scroll brings{" "}
                          <Text ftsz={18} weight="600">
                          new career paths 
                          </Text>
                          {" "}to explore,{" "}
                          <Text ftsz={18} weight="600">
                          inspiring talents{" "}
                          </Text>
                          to discover and a chance to{" "}
                          <Text ftsz={18} weight="600">
                          showcase your own. 
                          </Text>

                        </Text>
                        <View mt={16} f={1}>
                        <LottieView resizeMode="contain" source={require('../../assets/jsons/OnboardingGif5_Lottie.json')} autoPlay loop style={{width: '100%', height: '100%', alignSelf: 'flex-end'}}/>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </LinearGradient>
            )}
          />
        </View>
        <TouchableOpacity
          asf="center"
          b={0}
          po="absolute"
          w={"90%"}
          mh={24}
          onPress={handlePressContinue}
          jc="center"
          ai="center"
          pv={16}
          mv={16}
          bgc={"#000"}
          br={12}>
          <Text ftsz={14} weight="500" c={"#FFF"}>
            {step <= 4 ? "Continue" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

export default IntroScreen;
