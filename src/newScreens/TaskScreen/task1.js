import React, { useEffect, useState } from "react";
import {
    ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";

const Task1 = props => {
  const allQuestions = props?.data?.task?.typeDetails?.[0]?.questionnaire?.questionSets;
  const totalQuestions = allQuestions?.length;
  const [sliderLength, setSliderLength] = useState(100/(totalQuestions));
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(props?.data?.task?.typeDetails?.[0]?.questionnaire?.questionSets?.[currentQuestionNumber]);

  useEffect(()=>{
    if(currentQuestionNumber>0){
        setSliderLength(prv => prv+(100/(totalQuestions)));
    }
  },[currentQuestionNumber])
  

  const handleSubmit = ()=>{
    if(!answerSubmitted){
        //handle API for right or wrong answer.
        setAnswerSubmitted(true);
      }
      else if(answerSubmitted){
            if(currentQuestionNumber+1 === totalQuestions){
                navigate("BottomTab", {screen: 'Dashboard'});
                navigate('RewardScreen')
            }
            else{
            setAnswerSubmitted(false);
            const questionNumber = currentQuestionNumber;
            setCurrentQuestionNumber(prv=>prv+1);
            setCurrentQuestion(props?.data?.task?.typeDetails?.[0]?.questionnaire?.questionSets?.[questionNumber+1]);
            setSelectedOption(false);
            setAnswerSubmitted(false);
            }
      }
  }

  return (
    <View ph={16} pv={16} f={1} bgc={"#FFF"} btrr={40} btlr={40}>
      <View mt={10} br={8} bw={1} w={"100%"} jc="center">
        <View br={8} h={5} w={`${sliderLength}%`} bgc={"#000"}></View>
      </View>
      <View f={1} mh={8}>
        <ScrollView showsVerticalScrollIndicator={false} pt={24}>
          <Text ftsz={12} weight="500">
            Question {currentQuestionNumber+1}
          </Text>
          <Text ftsz={14} weight="400" mt={8}>
            {currentQuestion?.question}
          </Text>
          <View f={1} mt={16} pb={32}>
            {currentQuestion?.options?.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    disabled={answerSubmitted}
                    onPress={() => {
                      setSelectedOption(item.letter);
                    }}
                    fd="row"
                    ai="center"
                    bw={0.5}
                    bc={"#8E8E8E"}
                    bgc={selectedOption === item?.letter ? "#DAF1D6" : "#FFF"}
                    pv={8}
                    mb={16}
                    asf="baseline"
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
                        <Text style={{ textAlign: 'center', lineHeight: 24, marginTop: -3.5}}>{item.letter}</Text>
                      </View>
                    <Text ph={8}>{item?.text}</Text>
                  </TouchableOpacity>
                  {answerSubmitted && selectedOption === item?.letter && (
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
                      <Text ph={8}>
                        {currentQuestion?.optionDescriptions?.[selectedOption]}
                      </Text>
                    </ImageBackground>
                  )}
                </>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
            disabled={!selectedOption}
            bgc={selectedOption ? "#000" : "#7F8A8E"}
            jc="center"
            ai="center"
            pv={16}
            br={12}
            mh={8}>
            <Text ftsz={14} weight="400" c={"#FFF"}>
              { answerSubmitted ? 'Next':  'Submit'}
            </Text>
          </TouchableOpacity>
    </View>
  );
};

export default Task1;
