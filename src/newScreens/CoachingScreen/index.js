import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { Text } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import { Linking, PanResponder } from "react-native";
// import { Client as ConversationsClient } from "@twilio/conversations";
import { useAppSelector } from "../../redux";
import Conversations from "../CareerChatScreen";
import ChatPayment from "../CareerChatScreen/ChatPayment";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const CoachingScreen = props => {
  const data = props?.route?.params?.data;
  const type = props?.route?.params?.type;
  const tab = props?.route?.params?.tab;
  const user = useAppSelector(state => state.user);
  const [selectedTab, setSelectedTab] = useState(tab);
  const paymentOptions = data?.paymentOptions || [];

  useEffect(()=>{
    logAnalyticsEvents('Coaching_screen_tab', {selectedTab: selectedTab})
  },[selectedTab])

  const sessionDataAvni = [
    {
      heading: "Effective Communication",
      desc: "Learn how to express yourself clearly and confidently, whether in interviews or public speaking.",
    },
    {
      heading: "Professional Presence",
      desc: "Avni teaches you how to present yourself professionally, making sure you leave a lasting impression.",
    },
    {
      heading: "Personal Growth",
      desc: "With Avni’s help, turn into the best version of yourself, ready to show the world your unique strengths and capabilities.",
    },
  ];

  const sessionDataNeha = [
    {
      heading: "Learn What Employers Want",
      desc: "Understand what companies look for in people they hire.",
    },
    {
      heading: "Refine your Resumes",
      desc: "Make your resume stand out to show your best.",
    },
    {
      heading: "Improve Interview Skills",
      desc: "Learn how to impress in job interviews.",
    },
    {
      heading: "Find Jobs Easier",
      desc: "Create a plan  just for you to find good jobs.",
    },
  ];

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

  const onPressNext = () => {
    setSelectedTab(prv => {
      if (type === "career-coach") {
        if (prv === "Profile") {
          return "Sessions";
        } else if (prv === "Sessions") {
          return "Chat";
        } else {
          return prv;
        }
      } else {
        return "Sessions";
      }
    });
  };

  const onPressPrevious = () => {
    setSelectedTab(prv => {
      if (type === "career-coach") {
        if (prv === "Chat") {
          return "Sessions";
        } else if (prv === "Sessions") {
          return "Profile";
        } else {
          return prv;
        }
      } else {
        return "Profile";
      }
    });
  };

  const handleBookSessionClicked = () => {
    type === "career-coach" ? logAnalyticsEvents("Book_Session_CC", {}) : logAnalyticsEvents("Book_Session_BC", {})
    navigate("Booking_page", {
      source: data?.bookingLink
    });
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./CoachingBackground.png")}
        resizeMode="cover">
        <View f={1} {...panResponder.panHandlers}>
          <View mh={16} mv={8}>
            <View fd="row" ai="center">
              <TouchableOpacity
                onPress={() => {
                  popNavigation();
                }}>
                <Icons.BackArrow width={32} height={32} />
              </TouchableOpacity>
              <Text
                ftsz={17}
                weight="500"
                c={"#141418"}
                f={1}
                mr={32}
                ta="center">
                Your Career Advisor
              </Text>
            </View>
          </View>
          <View fd="row">
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Profile");
              }}
              f={1}
              ai="center"
              bc={selectedTab === "Profile" ? "#48A022" : "#7F8A8E"}
              bbw={selectedTab === "Profile" ? 2 : 1}
              pb={8}>
              <Text ftsz={14} weight="400">
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab("Sessions");
              }}
              f={1}
              ai="center"
              bc={selectedTab === "Sessions" ? "#48A022" : "#7F8A8E"}
              bbw={selectedTab === "Sessions" ? 2 : 1}
              pb={8}>
              <Text ftsz={14} weight="400">
                Sessions
              </Text>
            </TouchableOpacity>
            {/* {type === "career-coach" && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab("Chat");
                }}
                f={1}
                ai="center"
                bc={selectedTab === "Chat" ? "#48A022" : "#7F8A8E"}
                bbw={selectedTab === "Chat" ? 2 : 1}
                pb={8}>
                {user?.is_chat_enabled === true ? (
                  <Text ftsz={14} weight="400">
                    Chat
                  </Text>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text ftsz={14} weight="400" style={{ marginRight: 5 }}>
                      Chat
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )} */}
          </View>
          <View style={{ flex: 1 }} mh={16}>
            <View style={{ flex: 1 }}>
              {selectedTab === "Profile" && (
                <>
                  <View style={{ flex: 1 }}>
                    <ScrollView>
                      <TouchableOpacity
                        onPress={() => {
                          navigate("FAQs" , { scrollToHeading : 'Career Analysis' });
                        }}
                        asf="flex-end"
                        bbw={0.4}
                        mb={16}>
                        <Text ftsz={10} weight="600">
                          Have questions? Learn more.
                        </Text>
                      </TouchableOpacity>
                      <View fd="row" ai="center">
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              if (data?.video?.length > 0) {
                                logAnalyticsEvents('coach_video_viewed',{coachName: data?.firstName || ""});
                                navigate("PlayVideoLink", { url: data?.video });
                              }
                            }}
                            po="absolute"
                            z={10}
                            b={-20}
                            l={40}>
                            <Icons.PlayVideo width={40} height={40} />
                          </TouchableOpacity>
                          <Image
                            w={120}
                            h={120}
                            br={120}
                            source={{ uri: data?.picture }}
                          />
                        </View>
                        <View ml={16} gap={4}>
                          <View
                            asf="baseline"
                            bgc={"#B9E4A6"}
                            ph={16}
                            pv={8}
                            br={8}>
                            <Text
                              ftsz={18}
                              weight="600">{`${data?.firstName} ${data?.lastName}`}</Text>
                          </View>
                          <View fd="row" ai="center">
                            <Icons.Star
                              width={14}
                              height={14}
                              fill={"#F6CA53"}
                            />
                            <Text ml={4} ftsz={12} weight="400" c={"#17171F"}>
                              {data?.ratings}
                            </Text>
                            <Text c={"#17171F80"} ftsz={12} weight="400">
                              {" "}
                              ({data?.reviews} ratings)
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              logAnalyticsEvents('coach_linkedin_visited',{coachName: data?.firstName || ""})
                              Linking.openURL(
                                data?.linkedInUrl ||
                                  "https://www.linkedin.com/company/mapoutglobal/",
                              );
                            }}
                            bgc={"#0A7BBA"}
                            w={28}
                            jc="center"
                            ai="center"
                            h={28}
                            br={4}>
                            <Icons.LinkedInIcon width={20} height={20} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View f={1} mt={32}>
                        <Text mr={16} ftsz={15} weight="400">
                          {data?.longDescription}
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    mv={16}
                    bgc={"#000"}
                    pv={16}
                    br={12}
                    jc="center"
                    ai="center"
                    onPress={handleBookSessionClicked}>
                    <Text ftsz={14} weight="400" c={"#FFF"}>
                      Book a session
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedTab === "Sessions" && (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <ScrollView w={'100%'}>
                    <View mt={32} mb={16} fd="row" ai="center" asf="baseline">
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            if (data?.video?.length > 0) {
                              logAnalyticsEvents('coach_video_viewed',{coachName: data?.firstName || ""});
                              navigate("PlayVideoLink", { url: data?.video });
                            }
                          }}
                          po="absolute"
                          z={10}
                          b={-20}
                          l={40}>
                          <Icons.PlayVideo width={40} height={40} />
                        </TouchableOpacity>
                        <Image
                          w={120}
                          h={120}
                          br={120}
                          source={{ uri: data?.picture }}
                        />
                      </View>
                      <View ml={16} gap={4}>
                        <View
                          asf="baseline"
                          bgc={"#B9E4A6"}
                          ph={16}
                          pv={8}
                          br={8}>
                          <Text
                            ftsz={18}
                            weight="600">{`${data?.firstName} ${data?.lastName}`}</Text>
                        </View>
                        <View fd="row" ai="center">
                          <Icons.Star width={14} height={14} fill={"#F6CA53"} />
                          <Text ml={4} ftsz={12} weight="400" c={"#17171F"}>
                              {data?.ratings}
                            </Text>
                          <Text c={"#17171F80"} ftsz={12} weight="400">
                            {" "}
                            ({data?.reviews} ratings)
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            logAnalyticsEvents('coach_linkedin_visited',{coachName: data?.firstName || ""})
                            Linking.openURL(
                              data?.linkedInUrl ||
                                "https://www.linkedin.com/company/mapoutglobal/",
                            );
                          }}
                          bgc={"#0A7BBA"}
                          w={28}
                          jc="center"
                          ai="center"
                          h={28}
                          br={4}>
                          <Icons.LinkedInIcon width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      f={1}
                      mv={16}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.65)",
                        fontWeight: "400",
                        fontSize: 14,
                        padding: 16,
                        borderRadius: 12,
                      }}>
                      {type != "career-coach" ? (
                        <>
                          <Text ph={12} ftsz={14} weight="400">
                            Meet Avni, your expert Personal Brand Coach at
                            MapOut. With her vast experience from McKinsey to
                            IIT Kharagpur, Avni excels at making people stand
                            out.
                          </Text>
                          <Text ftsz={14} weight="400" mt={16}>
                            Book your session with Avni today to master:
                          </Text>
                          <View pr={8}>
                            {sessionDataAvni?.map(item => {
                              return (
                                <View fd="row" ai="flex-start" mt={8}>
                                  <View
                                    h={6}
                                    w={6}
                                    br={6}
                                    bgc={"#000"}
                                    mt={8}
                                    mr={8}
                                  />
                                  <Text ftsz={14} weight="400">
                                    <Text weight="700">{item?.heading}</Text>:{" "}
                                    {item?.desc}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </>
                      ) : (
                        <>
                          <Text ph={12} ftsz={14} weight="400">
                            Meet Neha, your career advisor with 15 years of
                            experience in helping people get jobs and grow in
                            their careers.
                          </Text>
                          <Text ftsz={14} weight="400" mt={16}>
                            Book your session with Neha today to:
                          </Text>
                          <View pr={8}>
                            {sessionDataNeha?.map(item => {
                              return (
                                <View fd="row" ai="flex-start" mt={8}>
                                  <View
                                    h={6}
                                    w={6}
                                    br={6}
                                    bgc={"#000"}
                                    mt={10}
                                    mr={8}
                                  />
                                  <Text ftsz={14} weight="400">
                                    <Text weight="700">{item?.heading}</Text>:{" "}
                                    {item?.desc}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </>
                      )}
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    onPress={handleBookSessionClicked}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      backgroundColor: "#000000",
                      borderRadius: 12,
                      alignItems: "center",
                      width: '90%'
                    }}
                    pv={16}>
                    <Text ftsz={14} weight="400" style={{ color: "#FFFFFF" }}>Book a session</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "#FFFFFF",
                      fontWeight: "400",
                      fontSize: 14,
                      padding: 10,
                      borderRadius: 12,
                    }}>
                    <Text>INR 499/- for 30 minutes session</Text>
                  </View>
                </View>
              )}
              {/* {selectedTab === "Chat" &&
                (user?.is_chat_enabled === true ? (
                  <Conversations />
                ) : (
                  <>
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View mv={32} fd="row" ai="center" asf="baseline">
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            if (data?.video?.length > 0) {
                              navigate("PlayVideoLink", { url: data?.video });
                            }
                          }}
                          po="absolute"
                          z={10}
                          b={-20}
                          l={40}>
                          <Icons.PlayVideo width={40} height={40} />
                        </TouchableOpacity>
                        <Image
                          w={120}
                          h={120}
                          br={120}
                          source={{ uri: data?.picture }}
                        />
                      </View>
                      <View ml={16} gap={4}>
                        <View
                          asf="baseline"
                          bgc={"#B9E4A6"}
                          ph={16}
                          pv={8}
                          br={8}>
                          <Text
                            ftsz={18}
                            weight="600">{`${data?.firstName} ${data?.lastName}`}</Text>
                        </View>
                        <View fd="row" ai="center">
                          <Icons.Star width={14} height={14} fill={"#F6CA53"} />
                          <Text ml={4} ftsz={12} weight="400" c={"#17171F"}>
                              {data?.ratings}
                            </Text>
                          <Text c={"#17171F80"} ftsz={12} weight="400">
                            {" "}
                            ({data?.reviews} ratings)
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            logAnalyticsEvents('coach_linkedin_visited',{coachName: name || ""})
                            Linking.openURL(
                              data?.linkedInUrl ||
                                "https://www.linkedin.com/company/mapoutglobal/",
                            );
                          }}
                          bgc={"#0A7BBA"}
                          w={28}
                          jc="center"
                          ai="center"
                          h={28}
                          br={4}>
                          <Icons.LinkedInIcon width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View f={1}>
                      <ChatPayment paymentOptions={paymentOptions}/>
                    </View>
                    </ScrollView>
                  </>
                ))
              } */}
            </View>
          </View>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default CoachingScreen;
