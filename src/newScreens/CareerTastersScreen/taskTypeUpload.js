import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import LinearGradient from "react-native-linear-gradient";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { Text, TextInput } from "../../components";
import { profilePicturePlaceholder } from "../../utils/constants";
import { ICONS } from "../../constants";
import Hyperlink from "react-native-hyperlink";
import { Linking } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import QuizModal from "./quizModal";
import DocumentPicker, { types } from "react-native-document-picker";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";
import { isValidURL } from "../../utils/isValidLink";

const TaskTypeUpload = props => {
  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);
  const { data = {}, index, updateData } = props?.route?.params;
  const [details, setDetails] = useState(data);
  const [taskNumber, setTaskNumber] = useState(index);
  const taskDetails = details?.careerTaster?.tasks?.[taskNumber];
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [documentPath, setDocumentPath] = useState(false);
  const [submit, { isSuccess, isLoading }] =
    api.useSubmitCareerTasterTaskMutation();
  const [link, setLink] = useState("");
  const [quizAnswers, setQuizAnswers] = useState(false);

  const handleSubmitUpload = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("documents", documentPath);
    bodyFormData.append("careerTaster_id", details?.careerTaster?._id);
    bodyFormData.append("task_id", taskDetails?._id);
    bodyFormData.append("submitType", "upload");
    bodyFormData.append("count", taskDetails?.count);
    submit(bodyFormData);
  };

  const handleSubmitLink = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("link", link);
    bodyFormData.append("careerTaster_id", details?.careerTaster?._id);
    bodyFormData.append("task_id", taskDetails?._id);
    bodyFormData.append("submitType", "link");
    bodyFormData.append("count", taskDetails?.count);
    submit(bodyFormData);
  };

  const handleSubmitQuiz = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("careerTaster_id", details?.careerTaster?._id);
    bodyFormData.append("task_id", taskDetails?._id);
    bodyFormData.append("submitType", "quiz");
    bodyFormData.append("count", taskDetails?.count);
    const arr = [];
    quizAnswers?.map((item, index) => {
      arr.push({ question: taskDetails?.quiz?.[index], answer: item });
    });
    bodyFormData.append("quiz", arr);
    submit(bodyFormData);
  };

  const handleSubmitButton = () => {
    if (
      taskDetails?.submissionType === "upload" &&
      documentPath?.uri?.length > 0
    ) {
      handleSubmitUpload();
    } else if (taskDetails?.submissionType === "link" && isValidURL(link)) {
      handleSubmitLink();
    } else if (
      taskDetails?.submissionType === "quiz" &&
      taskDetails?.quiz?.length > 0
    ) {
      let allQuestionsAnswered = true;
      for (let i = 0; i < taskDetails?.quiz?.length; i++) {
        if (!quizAnswers?.[i]?.length) {
          allQuestionsAnswered = false;
        }
      }
      if (allQuestionsAnswered) {
        handleSubmitQuiz();
      } else {
        Toast.show({
          type: "error",
          text1: "Please answer all the quiz questions",
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      if (taskNumber + 1 < data?.careerTaster?.tasks?.length) {
        setStep(1);
        setDocumentPath(false);
        setLink("");
        setQuizAnswers("");
        const updatedDetails = { ...details };
        const updatedTasks = [...updatedDetails.careerTaster.tasks];
        const updatedTask = { ...updatedTasks[taskNumber] };
        updatedTask.isCompleted = true;
        updatedTasks[taskNumber] = updatedTask;
        updatedDetails.careerTaster.tasks = updatedTasks;
        setTaskNumber(taskNumber + 1);
        updateData(updatedDetails);
        setDetails(updatedDetails);
      } else {
        setDocumentPath(false);
        setLink("");
        setQuizAnswers("");
        const updatedDetails = { ...details };
        const updatedTasks = [...updatedDetails.careerTaster.tasks];
        const updatedTask = { ...updatedTasks[taskNumber] };
        updatedTask.isCompleted = true;
        updatedTasks[taskNumber] = updatedTask;
        updatedDetails.careerTaster.tasks = updatedTasks;
        updateData(updatedDetails);
        setDetails(updatedDetails);
        popNavigation();
        navigate("CareerTasterFeedback", {
          data: updatedDetails,
          updateData: updateData,
        });
      }
    }
  }, [isSuccess, isLoading]);

  const onUploadFile = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.pdf, types.docx, types.doc],
        copyTo: "documentDirectory",
      });
      const { uri, type, name } = pickerResult;
      setDocumentPath({ uri, name, type });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong in UploadCV or ParseCV",
      });
    }
  };

  const toggleModal = () => {
    if (!showQuizModal && !quizAnswers) {
      setQuizAnswers(Array(taskDetails?.quiz?.length).fill(""));
    }
    setShowQuizModal(!showQuizModal);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [step]);

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1} w={"100%"} h={"100%"}>
        <LinearGradient
          colors={[
            "#FFFFFF",
            "rgba(102, 145, 255, 0.4)",
            "rgba(102, 145, 255, 0.4)",
            "#FFFFFF",
          ]}
          useAngle={true}
          angle={135}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.2, 0.4, 0.65, 1]}
          style={{ flex: 1 }}>
          <QuizModal
            showModal={showQuizModal}
            closeModal={toggleModal}
            questions={taskDetails?.quiz || []}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
          />
          <View fd="row" mh={16} mv={8} ai="center" jc="space-between">
            <TouchableOpacity onPress={() => popNavigation()}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text ftsz={17} weight="500">
              MapOut’s Career Taster
            </Text>
            <TouchableOpacity>
              <Icons.Threedots width={28} height={28} />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            f={1}
            ph={16}
            contentContainerStyle={{ paddingBottom: 180 }}>
            <TouchableOpacity
              onPress={() => navigate("TaskOverview", { data: details })}
              fd="row"
              ph={16}
              pv={16}
              ai="center"
              jc="space-between"
              bgc={"#FFF"}
              br={16}
              bw={1}
              bc={"rgba(255, 255, 255, 0.75)"}>
              <Text ftsz={14} weight="500">
                Overview
              </Text>
              <Icons.ChevronLeft
                width={24}
                height={24}
                fill={"#000"}
                style={{
                  transform: [{ rotate: "180deg" }],
                }}
              />
            </TouchableOpacity>
            {new Array(taskNumber).fill("").map((item, index) => {
              return (
                <TouchableOpacity
                  mt={8}
                  onPress={() =>
                    navigate("ViewCompletedTask", {
                      taskDetails: details?.careerTaster?.tasks?.[index],
                    })
                  }
                  fd="row"
                  ph={16}
                  pv={16}
                  ai="center"
                  jc="space-between"
                  bgc={"#FFF"}
                  br={16}
                  bw={1}
                  bc={"rgba(255, 255, 255, 0.75)"}>
                  <Text ftsz={14} weight="500">
                    Task {index + 1}
                  </Text>
                  <Icons.Done width={24} height={24} />
                </TouchableOpacity>
              );
            })}
            <View fd="row" mt={16} ai="center" jc="space-between">
              <Text f={1} ftsz={16} weight="600">
                Task {taskNumber + 1}: {taskDetails?.title}
              </Text>
              <View fd="row" ai="center" gap={4}>
                <View w={16} h={4} bgc={step >= 1 ? "#000" : "#FFF"} br={20} />
                <View w={16} h={4} bgc={step >= 2 ? "#000" : "#FFF"} br={20} />
                <View w={16} h={4} bgc={step >= 3 ? "#000" : "#FFF"} br={20} />
              </View>
            </View>
            <View
              mt={8}
              asf="flex-start"
              pv={4}
              ph={12}
              bgc={"rgba(102, 145, 255, 0.5)"}
              br={8}>
              <Text>{taskDetails?.estimatedCompletionTime}</Text>
            </View>
            {step === 1 && (
              <>
                {taskDetails?.isIntroVideo && (
                  <View mt={16} bgc={"#FFF"} br={16} jc="center">
                    <View w={"100%"} h={250} jc="center" ai="center">
                      <Image
                        br={16}
                        source={{ uri: profilePicturePlaceholder }}
                        w={"100%"}
                        h={250}
                      />
                      <TouchableOpacity
                        z={1}
                        po="absolute"
                        p={4}
                        br={100}
                        bgc={"rgba(0,0,0,0.3)"}>
                        <Icons.PlayButton width={54} height={54} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <View
                  bw={1}
                  mt={16}
                  bc={"rgba(255, 255, 255, 0.75)"}
                  bgc={"rgba(255, 255, 255, 0.6)"}
                  p={16}
                  br={16}>
                  <Text ftsz={13} weight="400">
                    {taskDetails?.introduction}
                  </Text>
                  <Text mt={16} ftsz={16} weight="600">
                    What you’ll learn
                  </Text>
                  <Text mt={4} ftsz={13} weight="400">
                    {taskDetails?.whatYoullLearn}
                  </Text>
                  <Text mt={16} ftsz={16} weight="600">
                    What you’ll do
                  </Text>
                  {taskDetails?.whatYoullDo?.map((item, index) => {
                    return (
                      <View
                        key={index?.toString()}
                        fd="row"
                        mt={index === 0 ? 0 : 4}>
                        <View mt={10} h={4} w={4} bgc={"#000"} br={4} mr={8} />
                        <Text f={1} ftsz={13} weight="400" c={"#0F0F10"}>
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
            {step === 2 && (
              <>
                <View
                  mt={16}
                  bw={1}
                  bc={"rgba(255, 255, 255, 0.75)"}
                  bgc={"rgba(255, 255, 255, 0.6)"}
                  p={16}
                  br={16}>
                  <Text ftsz={16} weight="600">
                    Background
                  </Text>
                  <View mt={12} gap={4}>
                    {taskDetails?.background?.map((item, index) => {
                      return (
                        <View key={index?.toString()} fd="row">
                          <View mt={8} mr={6} w={5} h={5} bgc={"#000"} br={4} />
                          <Text ftsz={13} weight="400">
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  {taskDetails?.backgroundSubTitle?.length &&
                    taskDetails?.backgroundSubArray?.length && (
                      <>
                        <Text mt={8} ftsz={13} weight="400">
                          {taskDetails?.backgroundSubTitle}
                        </Text>
                        <View mt={12} gap={4}>
                          {taskDetails?.backgroundSubArray?.map(
                            (item, index) => {
                              return (
                                <View key={index?.toString()} fd="row">
                                  <View
                                    mt={8}
                                    mr={6}
                                    w={5}
                                    h={5}
                                    bgc={"#000"}
                                    br={4}
                                  />
                                  <Text ftsz={13} weight="600">
                                    {item?.key}:{" "}
                                    <Text ftsz={13} weight="400">
                                      {item.value}
                                    </Text>
                                  </Text>
                                </View>
                              );
                            },
                          )}
                        </View>
                      </>
                    )}
                </View>
                {taskDetails?.resources?.length > 0 && (
                  <View mt={16} gap={8}>
                    {taskDetails?.resources?.map((item, index) => {
                      return (
                        <View
                          key={index?.toString()}
                          bw={1}
                          bc={"rgba(255, 255, 255, 0.75)"}
                          bgc={"rgba(255, 255, 255, 0.6)"}
                          p={16}
                          br={16}>
                          {index === 0 && (
                            <Text ftsz={16} weight="600">
                              Resources
                            </Text>
                          )}
                          <View fd="row">
                            <View
                              mt={9}
                              mr={6}
                              w={5}
                              h={5}
                              bgc={"#000"}
                              br={4}
                            />
                            <Hyperlink
                              linkStyle={{ color: "#000" }}
                              onPress={(url, text) =>
                                Linking.openURL(url)
                                  .then()
                                  .catch(() => {})
                              }>
                              <Text ftsz={13} weight="400">
                                {item}
                              </Text>
                            </Hyperlink>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
            )}
            {step === 3 && (
              <>
                {taskDetails?.isSubmissionVideo && (
                  <View mt={16} bgc={"#FFF"} br={16} jc="center">
                    <View w={"100%"} h={250} jc="center" ai="center">
                      <Image
                        br={16}
                        source={{ uri: profilePicturePlaceholder }}
                        w={"100%"}
                        h={250}
                      />
                      <TouchableOpacity
                        z={1}
                        po="absolute"
                        p={4}
                        br={100}
                        bgc={"rgba(0,0,0,0.3)"}>
                        <Icons.PlayButton width={54} height={54} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <View
                  mt={16}
                  bw={1}
                  bc={"rgba(255, 255, 255, 0.75)"}
                  bgc={"rgba(255, 255, 255, 0.6)"}
                  p={16}
                  br={16}>
                  <Text ftsz={16} weight="600">
                    Submission for this task
                  </Text>
                  <View mt={16}>
                    {taskDetails?.submission?.map((item, index) => {
                      return (
                        <View key={index?.toString()} fd="row">
                          <View mt={8} mr={6} w={5} h={5} bgc={"#000"} br={4} />
                          <Text ftsz={13} weight="400">
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                {taskDetails?.submissionType === "upload" && (
                  <View
                    mt={16}
                    bw={1}
                    bc={"rgba(255, 255, 255, 1)"}
                    bgc={"rgba(255, 255, 255, 0.75)"}
                    pv={32}
                    ph={16}
                    br={16}
                    ai="center"
                    jc="center">
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={onUploadFile}
                      fd="row"
                      ai="center"
                      gap={8}>
                      <Icon name="upload" size={16} color={"#000"} />
                      <Text ml={8} ftsz={14} weight="400">
                        Upload
                      </Text>
                    </TouchableOpacity>
                    {documentPath?.name?.length > 0 && (
                      <Text mt={8} ftsz={12} weight="400">
                        {documentPath?.name}
                      </Text>
                    )}
                    <Text
                      mt={8}
                      ftsz={12}
                      weight="400"
                      ta="center"
                      c={"#7F8A8E"}>
                      You can choose to upload a document as Word doc or PDF.
                      Please make sure the size is less than 10MB.
                    </Text>
                  </View>
                )}
                {taskDetails?.submissionType === "link" && (
                  <View
                    mt={16}
                    bw={5}
                    bc={"rgba(255, 255, 255, 1)"}
                    bgc={"rgba(255, 255, 255, 0.75)"}
                    pv={32}
                    ph={16}
                    br={16}
                    ai="center"
                    jc="center">
                    <View fd="row" ai="center">
                      <Text>Add Link :</Text>
                      <TextInput
                        value={link}
                        onChangeText={e => {
                          setLink(e);
                        }}
                        m={0}
                        p={0}
                        ml={8}
                        f={1}
                        bbw={1}
                      />
                    </View>
                    <Text
                      mt={8}
                      ftsz={12}
                      weight="400"
                      ta="center"
                      c={"#7F8A8E"}>
                      You can choose to upload a document as Word doc or PDF.
                      Please make sure the size is less than 10MB.
                    </Text>
                  </View>
                )}
                {taskDetails?.submissionType === "quiz" && (
                  <TouchableOpacity
                    onPress={toggleModal}
                    mt={16}
                    bw={5}
                    bc={"rgba(255, 255, 255, 1)"}
                    bgc={"rgba(255, 255, 255, 0.75)"}
                    pv={32}
                    ph={16}
                    br={16}
                    ai="center"
                    jc="center">
                    <View jc="center" ai="center">
                      <Text>Quiz</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <Text mt={16} ta="center" ftsz={11} weight="400">
                  Please make sure you submit original work. If the system
                  detects this as not original, it will be flagged to the
                  Employer as well.
                </Text>
              </>
            )}
          </ScrollView>
          <View fd="row" mh={16} gap={8}>
            {step > 1 && (
              <TouchableOpacity
                f={1}
                onPress={() => (step === 2 ? setStep(1) : setStep(2))}
                mb={16}
                pv={12}
                br={16}
                jc="center"
                ai="center"
                bgc={"#FFF"}>
                <Text c={"#000"} ftsz={14} weight="500">
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              f={1}
              onPress={() =>
                step === 1
                  ? setStep(2)
                  : step === 2
                  ? setStep(3)
                  : handleSubmitButton()
              }
              mb={16}
              disabled={isLoading}
              pv={12}
              br={16}
              jc="center"
              ai="center"
              bgc={"#000"}>
              {isLoading ? (
                <ActivityIndicator size={"small"} color={"#FFF"} />
              ) : (
                <Text c={"#FFF"} ftsz={14} weight="500">
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default TaskTypeUpload;
