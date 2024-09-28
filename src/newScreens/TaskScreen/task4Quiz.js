import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import YoutubePlayer from "react-native-youtube-iframe";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const Task4Quiz = props => {
  const user = useAppSelector(state => state?.user);
  const taskDetails = props?.data?.task;
  const textIndex = taskDetails?.typeDetails?.findIndex(
    obj => obj?.type === "text",
  );
  const questionIndex = taskDetails?.typeDetails?.findIndex(
    obj => obj?.type === "questionnaire",
  );
  const textDetails = props?.data?.task?.typeDetails?.[textIndex]?.text;
  const questionDetails =
    props?.data?.task?.typeDetails?.[questionIndex]?.questionnaire
      ?.questionSets?.[0];
  const pageLength = textDetails?.length;
  const allQuestions =
    props?.data?.task?.typeDetails?.[questionIndex]?.questionnaire
      ?.questionSets;
  const totalQuestions = allQuestions?.length;
  const totalLength = pageLength + totalQuestions; //num of pages + 1 question + 1 for submit;
  const [sliderLength, setSliderLength] = useState(100 / totalLength);
  const [showText, setShowText] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [text, setText] = useState(textDetails?.[pageNumber]);
  const [selectedOption, setSelectedOption] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    allQuestions?.[currentQuestionNumber],
  );
  const [allAnswers, setAllAnswers] = useState([]);
  const [submitTaskAPI, { data, isSuccess, isLoading, isError, error }] =
    api.useSubmitTaskMutation();

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

  useEffect(() => {
    if (currentQuestionNumber > 0) {
      setSliderLength(prv => prv + 100 / totalLength);
    }
  }, [currentQuestionNumber]);

  useEffect(() => {
    if (pageNumber >= 1) {
      if (pageNumber === pageLength) {
        setShowText(false);
        setSliderLength(prv => prv + 100 / totalLength);
      } else {
        setText(textDetails?.[pageNumber]);
        setSliderLength(prv => prv + 100 / totalLength);
      }
    }
  }, [pageNumber]);

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
      logAnalyticsEvents('task_next_clicked', {task_id: taskDetails?._id});
    } else {
      const lastAnswer = {
        questionId: currentQuestion?._id,
        submittedOption: selectedOption,
      };
      let answerSheet = [...allAnswers];
      answerSheet.push(lastAnswer);
      logAnalyticsEvents('task_submit_clicked', {task_id: taskDetails?._id});
      submitTaskAPI({
        userID: user?.user_id,
        taskID: taskDetails?._id,
        answers: answerSheet,
      });
    }
  };

  const submitAnswer = () => {
    setAnswerSubmitted(true);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}>
        <View mh={16} mv={64}>
          <Text ftsz={24} weight="600">
            {props?.data?.task?.title}
          </Text>
          <Text ftsz={14} weight="400">
            {!showText
              ? props?.data?.task?.second_line
              : props?.data?.task?.first_line}
          </Text>
          <Text mt={32} ftsz={14} weight="400">
            {!showText
              ? props?.data?.task?.second_desc
              : props?.data?.task?.first_desc}
          </Text>
        </View>
        <View ph={16} pv={16} f={1} bgc={"#FFF"} btrr={40} btlr={40}>
          <View mt={10} br={8} bw={1} w={"100%"} jc="center">
            <View br={8} h={5} w={`${sliderLength}%`} bgc={"#000"}></View>
          </View>
          {showText && <View jc="center" f={1}>
                {text?.heading && (
                  <Text mt={32} ftsz={14} weight="500">
                    {text?.heading}
                  </Text>
                )}
                {text?.text && (
                  <Text mt={16} ftsz={14} weight="400">
                    {text?.text}
                  </Text>
                )}
                {text?.type === "link" && text?.youtubeLink?.length > 0 && (
                  <View mt={32}>
                    <YoutubePlayer
                      height={200}
                      play={false}
                      videoId={text?.youtubeLink}
                      // onChangeState={onStateChange}
                    />
                  </View>
            )}
          </View>}
          {!showText && (
            <>
              <View f={1} mt={24}>
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
      {showText ? (
        <TouchableOpacity
          onPress={() => {
            logAnalyticsEvents('task_next_text_clicked', {task_id: taskDetails?._id})
            setPageNumber(prv => prv + 1);
          }}
          pv={12}
          jc="center"
          ai="center"
          mt={8}
          br={12}
          mh={16}
          bgc={"#000"}>
          <Text c={"#FFF"} ftsz={14} weight="400">
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
          mt={8}
          pv={12}
          br={12}
          mh={16}>
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

export default Task4Quiz;
