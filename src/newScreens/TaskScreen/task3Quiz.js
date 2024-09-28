import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import { ICONS } from "../../constants";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import { useWindowDimensions, Image as Img } from "react-native";
import Toast from "react-native-toast-message";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const Task3Quiz = props => {
  const user = useAppSelector(state => state?.user);
  const widthScreen = useWindowDimensions().width - 48;
  const [imgHeight, setImgHeight] = useState(200);
  const taskDetails = props?.data?.task;
  const videoIndex = taskDetails?.typeDetails?.findIndex(
    obj => obj?.type === "video",
  );
  const questionIndex = taskDetails?.typeDetails?.findIndex(
    obj => obj?.type === "questionnaire",
  );
  const videoDetails = props?.data?.task?.typeDetails?.[videoIndex]?.media;
  const allQuestions =
    props?.data?.task?.typeDetails?.[questionIndex]?.questionnaire
      ?.questionSets;
  const totalQuestions = allQuestions?.length;
  const [sliderLength, setSliderLength] = useState(100 / (totalQuestions + 1));
  const [videoWatched, setVideoWatched] = useState(false);
  const [componentVisible, setComponentVisible] = useState("video");
  const [selectedOption, setSelectedOption] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    allQuestions?.[currentQuestionNumber],
  );
  const [allAnswers, setAllAnswers] = useState([]);
  const [submitTaskAPI, { data, isSuccess, isLoading, isError, error }] =
    api.useSubmitTaskMutation();
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const handleVideoWatched = () => {
    setVideoWatched(true);
  };

  const getImageHeight = () => {
    let h = 0;
    Img.getSize(videoDetails?.thumbnail, (width, height) => {
      h = height * (widthScreen / width);
      if( h && h > 0){
        setImgHeight(h);
      }
      else{
        setImgHeight(300);
      }
    });
    if(h === 0){
      setImgHeight(300);
    }
  };

  useEffect(() => {
    if (videoDetails?.thumbnail?.length > 0) {
      getImageHeight();
    }
  }, [videoDetails?.thumbnail]);

  const handlePlayButton = () => {
    navigate("PlayVideoLink", {
      handleVideoWatched: handleVideoWatched,
      url: videoDetails?.url,
    });
  };

  const handleVideoNext = () => {
    if(!videoWatched){
      Toast.show({text1: "Error", text2: "Please watch the complete video", type: 'error'})
    }
    else{
      logAnalyticsEvents('task_video_viewed',{task_id: taskDetails?._id});
      setSliderLength(prv => prv + 100 / (totalQuestions + 1));
      setComponentVisible("question");
    }
  };

  useEffect(() => {
    if (currentQuestionNumber > 0) {
      setSliderLength(prv => prv + 100 / (totalQuestions + 1));
    }
  }, [currentQuestionNumber]);

  const submitAnswer = () => {
    setAnswerSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestionNumber + 1 != totalQuestions) {
      setAnswerSubmitted(false);
      setAllAnswers(prv => {
        let data = [...prv];
        data.push({
          questionId: currentQuestion?._id,
          submittedOption: selectedOption,
        });
        return data;
      });
      const questionNumber = currentQuestionNumber;
      setCurrentQuestionNumber(prv => prv + 1);
      setCurrentQuestion(allQuestions?.[questionNumber + 1]);
      setSelectedOption(false);
      logAnalyticsEvents('task_next_clicked',{task_id: taskDetails?._id})
    } else {
      const lastAnswer = {
        questionId: currentQuestion?._id,
        submittedOption: selectedOption,
      };
      let answerSheet = [...allAnswers];
      answerSheet.push(lastAnswer);
      logAnalyticsEvents('task_submit_clicked', {task_id: taskDetails?._id})
      submitTaskAPI({
        userID: user?.user_id,
        taskID: taskDetails?._id,
        answers: answerSheet,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      logAnalyticsEvents('task_submit_success', {task_id: taskDetails?._id});
      props?.navigation?.replace("KeyTakeawayScreen", {
        points: data?.point,
        keyTakeaway: data?.keyTakeaway,
        task_id:taskDetails?._id
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
        text2: "Please try again later.",
      });
    }
  }, [isError]);

  return (
    <>
      <ScrollView scrollEnabled={true} contentContainerStyle={{flexGrow:1, justifyContent: 'space-between'}}>
        <View mh={16} mv={64}>
          <Text ftsz={24} weight="600">
            {props?.data?.task?.title}
          </Text>
          <Text ftsz={14} weight="400">
          {videoWatched ? props?.data?.task?.second_line : props?.data?.task?.first_line}
          </Text>
          <Text mt={32} ftsz={14} weight="400">
          {videoWatched ? props?.data?.task?.second_desc : props?.data?.task?.first_desc}
          </Text>
        </View>
        <View pv={16} f={1} bgc={"#FFF"}>
          <View mh={24} mt={10} br={8} bw={1} jc="center">
            <View br={8} h={5} w={`${sliderLength}%`} bgc={"#000"}></View>
          </View>
          {componentVisible === "video" && (
            <>
              <View mh={24} f={1} mt={16}>
                <TouchableOpacity activeOpacity={1} onPress={handlePlayButton} jc="center" mb={16} f={1}>
                  <Image
                    jc="center"
                    br={12}
                    source={{ uri: videoDetails?.thumbnail }}
                    w={"100%"}
                    h={imgHeight}
                    resizeMode="contain"
                  />
                  {!videoWatched ? (
                    <TouchableOpacity
                      onPress={handlePlayButton}
                      po="absolute"
                      asf="center"
                      z={1}
                      bgc='rgba(0,0,0,0.4)'
                      br={100}
                      jc="center"
                      ai="center">
                      <ICONS.PlayButton width={64} height={64} />
                    </TouchableOpacity>
                  ) : (
                    <View
                      po="absolute"
                      asf="center"
                      z={1}
                      bgc="rgba(255,255,255,0.7)"
                      br={100}
                      jc="center"
                      ai="center">
                      <ICONS.Tick width={64} height={64} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
          {componentVisible === "question" && (
            <>
              <View mh={24} f={1} mt={24}>
                <Text ftsz={12} weight="500">
                  Question {currentQuestionNumber + 1}
                </Text>
                {currentQuestion?.heading &&
                  currentQuestion?.heading?.length > 0 && (
                    <Text ftsz={14} weight="500" mt={8}>
                      {currentQuestion?.heading}
                    </Text>
                  )}
                <Text ftsz={14} weight="400" mt={8}>
                  {currentQuestion?.question}
                </Text>
                <View f={1} mt={16} pb={16} pr={16}>
                  {currentQuestion?.options?.map((item, index) => {
                    return (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedOption(item.letter);
                          }}
                          disabled={answerSubmitted}
                          fd="row"
                          ai="center"
                          bw={0.5}
                          asf="baseline"
                          bc={"#8E8E8E"}
                          bgc={
                            selectedOption === item?.letter
                              ? answerSubmitted
                                ? item?.letter ===
                                  currentQuestion?.correctAnswer
                                  ? "#DAF1D6"
                                  : "#FFDEDE"
                                : "#DAF1D6"
                              : answerSubmitted
                              ? item?.letter === currentQuestion?.correctAnswer
                                ? "#DAF1D6"
                                : "#FFF"
                              : "#FFF"
                          }
                          pv={8}
                          mb={16}
                          ph={8}
                          br={40}>
                         <View
                        mr={8}
                        w={24}
                        h={24}
                        ai="center"
                        jc="center"
                        bgc={"#D8E3FC80"}
                          br={10}>
                        <Text ftsz={12} weight="400"  style={{ textAlign: 'center', lineHeight: 24, marginTop: -3.5}}>{item.letter}</Text>
                      </View>
                          <Text ftsz={12} weight="400" ph={8}>
                            {item?.text}
                          </Text>
                        </TouchableOpacity>
                        {answerSubmitted &&
                          currentQuestion?.correctAnswer === item?.letter && (
                            <ImageBackground
                              mb={16}
                              bw={1}
                              bc={"#C4C4C4BF"}
                              bgc={"rgba(255,255,255,0.45)"}
                              pv={8}
                              of="hidden"
                              br={20}
                              source={require("../CoachingScreen/CoachingBackground.png")}
                              resizeMode="cover"
                              resizeMethod="resize">
                              <Text ftsz={12} weight="400" ph={8}>
                                {currentQuestion?.correctAnswer !=
                                  selectedOption && (
                                  <Text>
                                    The correct answer is Option
                                    <Text weight="500">
                                      {" "}
                                      {currentQuestion?.correctAnswer}.{"\n"}
                                    </Text>
                                  </Text>
                                )}
                                {currentQuestion?.correctDesc}
                              </Text>
                            </ImageBackground>
                          )}
                      </>
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {componentVisible === "video" ? (
        <TouchableOpacity
          mh={24}
          onPress={handleVideoNext}
          bgc={videoWatched ? "#000" : "#7F8A8E"}
          jc="center"
          ai="center"
          pv={12}
          br={12}>
          <Text ftsz={14} weight="400" c={"#FFF"}>
            Next
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            answerSubmitted ? nextQuestion() : submitAnswer();
          }}
          disabled={!selectedOption}
          bgc={selectedOption ? "#000" : "#7F8A8E"}
          jc="center"
          ai="center"
          pv={12}
          br={12}
          mh={24}>
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#FFF"} />
          ) : (
            <Text ftsz={14} weight="400" c={"#FFF"}>
              {answerSubmitted ? "Next" : "Submit"}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

export default Task3Quiz;
