import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
    FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const CareerAnalysisScreen = () => {
  const [question, setQuestion] = useState(0);
  const userId = useAppSelector(state => state.user?.user_id);
  const [loading, setLoading] = useState(true);
  const [createTest, { data, isLoading, isError, isSuccess }] = api.useCreatePersonalityTestMutation();
  const { isLoading: isLoadingQuestions, isSuccess: getQuestionsSuccess } = api.useGetTestQuestionsQuery({
    userId,
    testId: data?.testId,
  }, {
    skip: !data?.testId,
  });

  useEffect(()=>{
    createTest(userId);
  },[])

  useEffect(()=>{
    if(isSuccess && getQuestionsSuccess){
      setLoading(false);
    }
  },[isSuccess, getQuestionsSuccess])

  const handleStartTest = ()=>{
    logAnalyticsEvents('start_test_clicked', {});
    navigate('CareerAnalysisStepper',{currentStep:1});
  }

  const dummyData = [
    {
      question: "What is Career Discovery Quiz?",
      text1:
        "Career Discovery Quiz helps you identify your MBTI personality type, Holland Code Interest type and your Ideal Careers based on your personality and interests.",
     text2: (
        <>
          This will take <Text style={{ fontWeight: "bold" }}>15 minutes</Text> of your time and requires your
          undivided attention. There are no wrong or right answers, answer with
          what comes naturally to you.
        </>
      ),
    },
    {
      question: "What is MBTI Personality Type?",
      text1:
        "Myers–Briggs Type Indicator (MBTI) is a personality assessment which helps users narrow down their career options by identifying their strongest skills, likes, dislikes and work preferences. In MBTI Theory, people are identified as having one of 16 personality types.",
    },
    {
      question: "What is Holland Code Interest Type?",
      text1:
        "Holland codes, a system developed by Dr. John L. Holland, is a way of classifying people’s interests into six broad types: Realistic, Investigative, Artistic, Social, Enterprising and Conventional. Each type is then matched to careers that allows them to use their skills and abilities and achieve maximum career satisfaction.",
    },
    {
      question: "What are Best-Fit Careers?",
      text1:
        "Best-fit careers are those that match your unique personality, interests, skills, and aspirations.  By analyzing this data, we suggest a personalized list of the top 9 careers that could be a fantastic fit for you. Imagine a career that feels fulfilling, utilizes your talents, and keeps you motivated – that's the power of finding your best fit!",
    },
  ];

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./CareerAnalysisBackground.png")}
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
              Career Discovery Quiz
            </Text>
          </View>
        </View>
        <View f={1}>
            <View pv={32} mh={24} mv={24} br={12} bgc={'rgba(255, 255, 255, 0.75)'}>
              <Text ph={32} ftsz={15} weight="600" ta="center" lh={21}>{dummyData?.[question]?.question}</Text>
              <Text mt={32} ph={18} ftsz={13} weight="400" ta="center">{dummyData?.[question]?.text1}</Text>
              <Text mt={32} ph={28} ftsz={13} weight="400" ta="center">{dummyData?.[question]?.text2}</Text>
            </View>
            <View>
                <FlatList
                    mv={70}
                    ph={32}
                    ListFooterComponent={()=>{
                        return(
                            <View w={50}/>
                        )
                    }}
                    showsHorizontalScrollIndicator={false}
                    data={dummyData}
                    horizontal
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}
                    renderItem={({item, index})=>{
                        return(
                            <TouchableOpacity onPress={()=>{
                                setQuestion(index)
                            }} jc="center" bw={0.25} bc={'#7F8A8E'} bgc={question === index ? 'rgba(217,188,255,0.35)' : 'rgba(255, 255, 255, 0.45)'}  mr={16} br={12} w={question === index ? 150 : 120} h={question === index ? 150 : 120}>
                                <Text ftsz={12} weight={question === index ? '600' : '400' } ph={8} ta="center">{item?.question}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            <View f={1} jc="center">
              <Text ph={32} ftsz={12} weight="500" ta="center"> You can start when you’re ready!</Text>
            </View>
        </View>
        <View mh={24}>
          <TouchableOpacity
            disabled={loading}
            onPress={()=>{
                handleStartTest();
            }}
            mv={10}
            bgc={"#000"}
            jc="center"
            ai="center"
            pv={16}
            br={12}>
            {loading ? <ActivityIndicator color={'#FFF'} size={"small"}/> : <Text ftsz={14} weight="600" c={"#FFF"}>
              Start Test
            </Text>}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default CareerAnalysisScreen;
