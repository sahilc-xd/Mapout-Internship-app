/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native-style-shorthand';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../redux/api';
import { Text, ConfirmBack } from '../../components';
import { useAppSelector } from '../../redux';
import { UpdateStatus } from '../../utils/updateStatus';
import { useDispatch } from 'react-redux';
import { userActions } from '../../redux/userSlice';
import Animated, { BounceInRight } from 'react-native-reanimated';
import { useStatusBar } from '../../hooks/useStatusBar';
import { useIsFocused } from '@react-navigation/native';
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';
import MainLayout from '../../components/MainLayout';
import { navigate, popNavigation } from '../../utils/navigationService';
import Icons from '../../constants/icons';
import { Alert } from 'react-native';

function PersonalityTest({ navigation, route }: any) {
  const questionId = route?.params?.questionId || 0;
  const navigatedFrom = route.params?.from;
  const userId = useAppSelector(state => state.user.user_id);
  const testId = useAppSelector(state => state.careerTest.testId);
  const questions = useAppSelector(state => state.careerTest.questions);

  const question = questions[questionId];
  const [disabled, setDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPairOption, setSelectedPairOption] = useState<{ [key: string]: {} }>({});
  // const sliderLength = Math.round((questionId+1) * (100/20));

  const [saveAnswer, { isLoading, isSuccess, isError }] = api.useSaveTestAnswerMutation();


  useEffect(() => {
    if (questionId + 1 === 20 && Object.values(selectedPairOption).length === 8) {
      setDisabled(false);
    }
  }, [Object.values(selectedPairOption).length]);

  const onSelectPairOption = (optionId: any, quesId: any) => {
    setSelectedPairOption({
      ...selectedPairOption,
      [quesId]: optionId,
    });
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      if (questionId + 1 === 20) {
        // navigation.replace('PersonalityTestResult');
        navigation?.replace("CareerAnalysisStepper", { currentStep: 2 });
      } else {
        navigation.replace('PersonalityTest', { from: navigatedFrom, questionId: questionId + 1 });
      }
    }
  }, [isSuccess]);

  const onSelectOption = (optionId: any) => () => {
    setSelectedOption(optionId);
    setDisabled(false);
  };

  const onPressNext = () => {
    logAnalyticsEvents('question_answered',{questionId: questionId+1});
    if(questionId + 1 === 20){
      if(Object.values(selectedPairOption)?.length === 8){
      const arr = Object.keys(selectedPairOption).map((key: any) => ({
        question_id: key,
        option_id: selectedPairOption[key],
      }));
      saveAnswer({
        arr,
        userId,
        testId,
      });
      }
      else{
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select an answer for each to continue.',
        });
      }
    }
    else{
      if(selectedOption){
        saveAnswer({
          arr: [{
            question_id: question._id,
            option_id: selectedOption,
          }],
          userId,
          testId,
        });
      }
      else{
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select an option to continue.',
        });
      }
    }
  };


  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      {/* <View bgc={'#FFF'} ph={16} pv={16} fd='row' ai='center'>
        <View f={1} bw={1} bc={'#D9BCFF'} mv={8} asf='center' br={8}>
          <View w={`${sliderLength}%`} bgc={'#D9BCFF'} h={6} br={8}>
          </View>
        </View>
        <Text ml={16} ftsz={11} weight='500'>{sliderLength}%</Text>
      </View> */}
      <View ai='center' pv={16} jc='center'>
        <TouchableOpacity onPress={()=>{
          Alert.alert("Your progress will be lost.", "Are you sure you want to exit?", [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => {
                logAnalyticsEvents('exit_personality_test',{});
                popNavigation();
              },
            },
          ]);
        }} po='absolute' l={16}>
          {/* <Icons.ChevronLeft width={20} height={20} fill={'#000'} /> */}
          <Text c={'#7F8A8E'}>Exit Test</Text>
        </TouchableOpacity>
        <Text ftsz={16} weight='600' ta='center'>Personality & Interests</Text>
        <View po='absolute' r={8} fd='row'>
          <View mh={4} h={8} w={16} bgc={'#000'} br={4}/> 
          <View mh={4} h={8} w={8} bgc={'#D9D9D9'} br={4}/> 
          <View mh={4} h={8} w={8} bgc={'#D9D9D9'} br={4}/> 
        </View>
      </View>
      <ScrollView persistentScrollbar={true} contentContainerStyle={styles.container}>
        {questionId + 1 !== 20 && (
          <FastImage
            resizeMode="cover"
            source={{ uri: question?.bg_img }}
            style={styles.image}
          />
        )}
        <View p={16} mb={15} style={styles.queSection}>
          <Text pv={4} ftsz={12} c={'#000'} bgc={'#FFD70280'} asf='baseline' ph={8} br={8} weight="500">{`Q${questionId + 1} / 20`}</Text>
          {question?.before_text && <Text ftsz={12} weight="500" c={'#404040'} pv={8}>{question.before_text}</Text>}
          <Text ftsz={12} weight="500" c={'#000000'} mt={8}>{question.question}</Text>
          {questionId + 1 < 20 && (
            <View mv={5}>
              {question.opt.map((optionItem: any, index: number) => (
                <TouchableOpacity onPress={onSelectOption(optionItem.option_id)} key={optionItem.option_id} bw={0.4} bc={'#8E8E8E'} mr={24} p={10} pr={16} br={40} mv={10} fd="row" ai="center" asf="flex-start">
                  <View bgc={optionItem.option_id === selectedOption ? "#D9BCFF" : "white"} h={24} w={24} br={24} jc="center" ai="center">
                    <Text ftsz={10}>{String.fromCharCode(index + 65)}</Text>
                  </View>
                  <Text pl={10} fw="wrap" ftsz={12} weight="400" c={'#000000'}>{optionItem.opt_data}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {questionId + 1 === 20 && (
            questions.slice(questionId).map((item: any) => (
              <View mv={5} fd="row" key={item.id} ai='center' gap={8}>
                {item.opt.map((optionItem: any, index: number) => (
                  <TouchableOpacity onPress={() => onSelectPairOption(optionItem.option_id, item._id)} key={optionItem.option_id} bw={0.4} bc={'#8E8E8E'} f={1} p={10} pr={16} br={40} mv={10} fd="row" ai="center">
                    <View bgc={optionItem.option_id === selectedPairOption[item._id] ? "#D9BCFF" : "white"} h={24} w={24} br={24} jc="center" ai="center">
                      <Text ftsz={10}>{String.fromCharCode(index + 65)}</Text>
                    </View>
                    <Text f={1} pl={10} fw="wrap" ftsz={12} weight="400" c={'#000000'}>{optionItem.opt_data}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {!disabled && question.after_text && 
      (<Animated.View entering={BounceInRight.duration(500)} style={{
          backgroundColor: "#D9BCFF",
          padding:10,
          marginLeft: 32,
          marginVertical: 5,
          marginRight: "3%",
          maxWidth: '100%',
          alignSelf: 'flex-end',
          borderRadius: 20,
          right: 3
        }}>          
          <Text style={{ fontSize: 14, color: "#000", fontFamily: 'RedHatDisplay-Medium' }}>{question.after_text}</Text>
          <View style={styles.rightArrow}></View>   
          <View style={styles.rightArrowOverlap}></View>
        </Animated.View>)}
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPressNext}
        mh={15}
        br={8}
        ph={17}
        pv={12}
        bgc={disabled ? "#D9D9D9" : "#000000"}>
        {isLoading && <ActivityIndicator color="#ffffff" />}
        {!isLoading && (
          <Text c="#ffffff" weight="700" ftsz={14} ta="center">Next</Text>
        )}
      </TouchableOpacity>
      {/* <ConfirmBack exitOnBack /> */}
    </MainLayout>
  );
}

PersonalityTest.defaultProps = {
  questionId: 0,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  image: {
    width: "100%",
    height: "32%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  queSection: {
    width: "100%",
    minHeight: 750,
    marginBottom: 40
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#D9BCFF",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },
  
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#FEFAEF",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20
  
  },
});

export default PersonalityTest;
