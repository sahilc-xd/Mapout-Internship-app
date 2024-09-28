import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import ScoreDescriptionModal from "./scoreDescriptionModal";
import FeedbackModal from "./feedbackModal";
import { navigate, popNavigation } from "../../utils/navigationService";
import { useWindowDimensions } from "react-native";
import { ICONS } from "../../constants";
import LinearGradient from "react-native-linear-gradient";
import CoachCard from "../DashboardScreen/SuccessMentors/CoachCard";
import CustomModal from "../../components/CustomModal";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const ScoreCard = ({ heading, text, recommendation }) => {
  return(
    <View bgc={"#BFD4FF"} mh={20} mv={10} br={12}>
      <View bgc={"#FFFFFF"} ml={10} btrr={12} bbrr={12}>
        <View fd="row" ai="center" jc="space-between" mb={10} mt={20} ph={10}>
          <Text ftsz={13} weight="500">{heading}</Text>
          <Text ftsz={13} weight="600">{text}</Text>
        </View>
        <View ph={10} mb={20}>
          <Text ftsz={12} weight="400">{recommendation}</Text>
        </View>
      </View>
    </View>
  )
}

const VideoAnalysisScreen = () => {
  const [getVideoAnalysis, { data, isSuccess, isLoading }] =
    api.useVideoAnalysisMutation();
  const [getBrandCoach, { data: brandCoachDetails, isSuccess: brandCoachSuccess }] = api.useLazyGetBrandCoachQuery();
  const [brandCoachData, setBranchCoachData] = useState(false);
  const user = useAppSelector(state => state?.user);
  const videoUrl =
    user?.profileVideo?.link ||
    "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Movie+on+16-01-24+at+3.39%E2%80%AFPM.export.mov";
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [modalData, setModalData] = useState({
    heading: "Personal Brand Coach",
    text: "7 seconds. That’s all it takes to form a first impression. With Your Personal Brand Coach, master the art of seizing these crucial moments with impactful body language, refined communication skills, and compelling self-presentation. Make every second count to leave an unforgettable impression on employers and excel in your career journey.",
  });
  const [likeDislike, setLikeDislike] = useState(false);
  const screenHeight = useWindowDimensions().height;
  const [loadingNum, setLoadingNum] = useState(1);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [scores, setScores] = useState({});

  useEffect(() => {
    let num = loadingNum;
    if (loadingNum < 4) {
      setTimeout(() => {
        setLoadingNum(num + 1);
      }, 8000);
    }
  }, [loadingNum]);

  useEffect(() => {
    if (brandCoachSuccess) {
      setBranchCoachData(brandCoachDetails);
    }
  }, [brandCoachSuccess]);

  useEffect(() => {
    if(isSuccess) {
      setScores(data?.data?.scores);
      if(data?.data?.compute_stat === 2) {
        setResultsLoading(false);
      }
    }
  }, [isSuccess])

  const closeModal = () => {
    setShowModal(false);
    setShowFeedbackModal(false);
  };

  const openModalBrandCoach = () => {
    setShowModal(true);
  };

  const handleBookSessionClicked = () => {
    logAnalyticsEvents("Book_Session_BC", {});
    navigate("Booking_page", {
      source: brandCoachData?.bookingLink,
    });
  }

  useEffect(() => {
    loadVideoAnalysis();
    getBrandCoach();
  }, []);

  const loadVideoAnalysis = () => {
    let data = new FormData();
    data.append("user_id", user?.user_id);
    data.append("video_url", videoUrl);
    getVideoAnalysis(data);
  }

  console.log(modalData?.heading)

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <CustomModal
        showModal={showModal}
        heading={modalData?.heading}
        text={modalData?.text}
        closeModal={closeModal}
      />
      <FeedbackModal
        changeType={setLikeDislike}
        visible={showFeedbackModal}
        closeModal={closeModal}
        modalType={likeDislike}
        id={data?._id?.$oid}
      />
      <ScrollView
        w={"100%"}
        f={1}
        h={"100%"}
        showsVerticalScrollIndicator={false}>
        <LinearGradient 
          colors={["#FFFFFF","#BFD4FF", "#E7F9DF"]} 
          useAngle={true} 
          angle={95} 
          angleCenter={{x:0.5,y:0.5}}
          locations={[0,0.8,0.95]}
        >
          {resultsLoading ? (
            <View h={screenHeight} f={1} jc="center">
              <Text mh={24} ftsz={17} ta="center" weight="600">
                Fetching tips on how to improve profile video...
              </Text>
              <View ml={80} fd="row">
                <View ai="center">
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 1 ? 38 : 28}
                      w={loadingNum === 1 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 1 ? 38 : 28}>
                      <Text ftsz={loadingNum === 1 ? 18 : 13} weight="500">
                        1
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 2 ? 38 : 28}
                      w={loadingNum === 2 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 2 ? 38 : 28}>
                      <Text ftsz={loadingNum === 2 ? 18 : 13} weight="500">
                        2
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 3 ? 38 : 28}
                      w={loadingNum === 3 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 3 ? 38 : 28}>
                      <Text ftsz={loadingNum === 3 ? 18 : 13} weight="500">
                        3
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 4 ? 38 : 28}
                      w={loadingNum === 4 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 4 ? 38 : 28}>
                      <Text ftsz={loadingNum === 4 ? 18 : 13} weight="500">
                        4
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        c={loadingNum != 1 ? "#888888" : "#000"}
                        mt={32}
                        ftsz={loadingNum === 1 ? 14 : 11}
                        weight={loadingNum === 1 ? "500" : "400"}
                        ml={8}>
                        Analyzing your video
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        c={loadingNum != 2 ? "#888888" : "#000"}
                        mt={32}
                        ftsz={loadingNum === 2 ? 14 : 11}
                        weight={loadingNum === 2 ? "500" : "400"}
                        ml={8}>
                        Analyzing your Expression
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        mt={32}
                        c={loadingNum != 3 ? "#888888" : "#000"}
                        ftsz={loadingNum === 3 ? 14 : 11}
                        weight={loadingNum === 3 ? "500" : "400"}
                        ml={8}>
                        Analyzing your Communication
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        mt={32}
                        c={loadingNum != 4 ? "#888888" : "#000"}
                        ftsz={loadingNum === 4 ? 14 : 11}
                        weight={loadingNum === 4 ? "500" : "400"}
                        ml={8}>
                        Analyzing your Talking pace
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View pb={50}>
              <View mv={16} mh={16}>
                <View fd="row" ai="center">
                  <TouchableOpacity
                    onPress={() => {
                      popNavigation();
                    }}>
                      <Icons.BackArrow width={32} height={32}/>
                  </TouchableOpacity>
                  <Text
                    ftsz={17}
                    weight="500"
                    c={"#141418"}
                    f={1}
                    mr={32}
                    ta="center">
                    Video Analysis
                  </Text>
                </View>
              </View>
              <View bgc={"#D8E3FC"} mh={20} mb={20} pv={20} br={12} ai="center">
                <Text ftsz={14} weight="600">Your Overall Impact Score: <Text tt="uppercase">{scores?.impact_score?.text}</Text></Text>
              </View>
              <View
                w={"100%"}
                h={400}
                mb={32}
                jc="center"
                ai="center">
                <TouchableOpacity
                onPress={() => {
                  navigate("PlayVideoLink", {
                    url: videoUrl,
                  });
                }} p={4} bgc='rgba(0,0,0,0.4)' br={100} po="absolute" z={1}>
                  <ICONS.PlayButton fill={"#000"} />
                </TouchableOpacity>
                {/* //for thumbnail */}
                {user?.profileVideo?.thumbnail?.length>0 && <Image
                    source={{ uri: user?.profileVideo?.thumbnail}}
                    w={'100%'}
                    h={400}
                    resizeMode="cover"
                  />}
              </View>
              <ScoreCard heading={"Tone"} text={scores?.tone_energy_score?.text} recommendation={scores?.tone_energy_score?.recommendation} />
              <ScoreCard heading={"Fluency"} text={scores?.fluency_score?.text} recommendation={scores?.fluency_score?.recommendation} />
              <ScoreCard heading={"Body Language"} text={scores?.body_language_score?.text} recommendation={scores?.body_language_score?.recommendation} />
              <ScoreCard heading={"Eye Contact"} text={scores?.eye_contact_score?.text} recommendation={scores?.eye_contact_score?.recommendation} />
              <ScoreCard heading={"Audio Clarity"} text={scores?.audio_clarity_score?.text} recommendation={scores?.audio_clarity_score?.recommendation} />
              <View mh={16} asf="flex-end" fd="row" gap={8}>
                <Text ftsz={14} weight="600">
                  Rate our tips:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowFeedbackModal(true);
                    setLikeDislike("like");
                  }}>
                  <Icons.ThumbsUp width={20} height={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowFeedbackModal(true);
                    setLikeDislike("dislike");
                  }}>
                  <Icons.ThumbsDown width={20} height={20} />
                </TouchableOpacity>
              </View>
              {brandCoachData && 
                <View mt={30} mh={20}>
                  <Text ftsz={14} weight="600" mb={20}>
                    For personalized guidance on how to build a super impressive video profile, book a session with your brand coach today!
                  </Text>
                  <LinearGradient colors={["#CC7AFF","#E1CBFF"]} useAngle={true} angle={135} angleCenter={{x:0.4,y:0.4}} style={{borderRadius: 12}}>
                    <TouchableOpacity
                    onPress={() => {
                      navigate("CoachingScreen", {
                        type: "brand-coach",
                        tab: "Profile",
                        data: { ...brandCoachData },
                      });
                    }}
                    pv={24}
                    ph={16}
                    br={20}>
                    <CoachCard
                      openModal={openModalBrandCoach}
                      video={brandCoachData?.video}
                      img={brandCoachData?.picture}
                      coachText={"Your personal brand coach"}
                      name={`${brandCoachData?.firstName} ${brandCoachData?.lastName}`}
                      rating={brandCoachData?.ratings}
                      reviews={brandCoachData?.reviews}
                      linkedInUrl= {brandCoachData?.linkedInUrl}
                    />
                    <View fd="row" gap={8} mt={16}>
                      <TouchableOpacity
                        onPress={handleBookSessionClicked}
                        br={12}
                        jc="center"
                        ai="center"
                        pv={12}
                        bgc={"#000000"}
                        f={1}>
                        <Text ftsz={14} weight="500" c={"#FFF"}>
                          Book 1-1 session
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </View>}
            </View>
          )}
        </LinearGradient>
      </ScrollView>
    </MainLayout>
  );
};

export default VideoAnalysisScreen;
