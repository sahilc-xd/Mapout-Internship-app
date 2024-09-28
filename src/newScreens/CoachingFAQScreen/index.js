import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";

const CoachingFAQScreen = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const questions = [
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
    {
      question: "Who is a career advisor?",
      answer:
        "MapOut career advisors are people who are unqiuely suggested for you and who can help you navigate everything in your career. These are highly vetted and you can choose to book a session with them and discuss your career path. your CV or how to apply for jobs. You can also choose to unlock chat with them and get your questions answered there.",
    },
  ];
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CoachingScreen/CoachingBackground.png")}
        resizeMode="cover">
        <View mh={16} mv={16}>
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
              Your Career Advisor
            </Text>
          </View>
        </View>
        <View f={1}>
          <View mt={16} mh={24} bbw={1} asf="baseline">
            <Text c={"#17171F"} ftsz={14} weight="600">
              Career Advisor questions
            </Text>
          </View>
          <FlatList
            data={questions}
            ItemSeparatorComponent={() => {
              return <View mv={24} w={"100%"} h={0.4} bgc={"#000000"} />;
            }}
            ListHeaderComponent={() => {
              return <View mv={24} w={"100%"} h={0.4} bgc={"#000000"} />;
            }}
            ListFooterComponent={() => {
              return <View mv={24} w={"100%"} h={0.4} bgc={"#000000"} />;
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  mh={24}
                  onPress={() => {
                    if (index === selectedQuestion) {
                      setSelectedQuestion(null);
                    } else setSelectedQuestion(index);
                  }}>
                  <Text ftsz={14} weight="500">
                    {item?.question}
                  </Text>
                  {index === selectedQuestion && (
                    <Text ftsz={12} weight="400" mt={16}>{item?.answer}</Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default CoachingFAQScreen;
