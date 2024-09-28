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

const ViewCompletedTask = props => {
  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);
  const { taskDetails } = props?.route?.params;
  const [taskNumber, setTaskNumber] = useState(taskDetails?.count);

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
          <View fd="row" mh={16} mv={8} ai="center" jc="center">
            <TouchableOpacity l={0} po="absolute" onPress={() => popNavigation()}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text ftsz={17} weight="500">
              MapOut’s Career Taster
            </Text>
          </View>
          <ScrollView
            ref={scrollRef}
            f={1}
            ph={16}
            contentContainerStyle={{ paddingBottom: 180 }}>
            <View fd="row" mt={16} ai="center" jc="space-between">
              <Text f={1} ftsz={16} weight="600">
                Task {taskNumber}: {taskDetails?.title}
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
                  mt={16}
                  bw={1}
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
                  {taskDetails?.backgroundSubTitle?.length > 0 && (
                    <>
                      <Text mt={8} ftsz={13} weight="400">
                        {taskDetails?.backgroundSubTitle}
                      </Text>
                      <View mt={12} gap={4}>
                        {taskDetails?.backgroundSubArray?.map((item, index) => {
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
                        })}
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
                  <View fd="row" jc="center" ai="center">
                    <Icons.Done
                      width={24}
                      height={24}
                    />
                    <Text ml={12}>Submission successful</Text>
                  </View>
                </View>
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
            {step < 3 && (
              <TouchableOpacity
                f={1}
                onPress={() => (step === 1 ? setStep(2) : setStep(3))}
                mb={16}
                pv={12}
                br={16}
                jc="center"
                ai="center"
                bgc={"#000"}>
                <Text c={"#FFF"} ftsz={14} weight="500">
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default ViewCompletedTask;
