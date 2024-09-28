import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native-style-shorthand';
import Toast from 'react-native-toast-message';

import { api } from "../../redux/api";
import { useAppSelector } from '../../redux';
import { Text, Layout } from '../../components';
import { useStatusBar } from '../../hooks/useStatusBar';
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';

const SelectFlow = () => {
  const { params } = useRoute();
  const { navigate } = useNavigation();
  const insets = useSafeAreaInsets();

  const currentStep = params.currentStep;

  const navigatedFrom = params?.from;

  const userId = useAppSelector(state => state.user?.user_id);
  const [createTest, { data, isLoading, isError, isSuccess }] = api.useCreatePersonalityTestMutation();

  const { isLoading: isLoadingQuestions, isSuccess: getQuestionsSuccess } = api.useGetTestQuestionsQuery({
    userId,
    testId: data?.testId,
  }, {
    skip: !data?.testId,
  });

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
    if (isSuccess && getQuestionsSuccess) {
      navigate('PersonalityTest', { from: navigatedFrom });
    }
  }, [isSuccess, getQuestionsSuccess]);

  let headerColor = "#F6CA53";
  let headerImage = require("../../assets/images/start_personality_assessment.png");
  switch (currentStep) {
    case 2:
      headerColor = "#3F8F61";
      headerImage = require("../../assets/images/start_skill_test.png");
      break;
    case 3:
      headerColor = "#754DA4";
      headerImage = require("../../assets/images/backgroundTest.png");
      break;
  }

  const renderHeader = () => (
    <View ph={16} f={1} pt={insets.top}>
      <Image source={headerImage} asf="center" />
    </View>
  );

  const onPressStart = async () => {
    if (currentStep === 1) {
      logAnalyticsEvents('clicked_start_career_path',{step: 1});
      await createTest(userId);
    } else if (currentStep === 2) {
      logAnalyticsEvents('clicked_start_career_path',{step: 2});
      navigate('SkillAndAspirations' as never);
    } else if (currentStep === 3) {
      logAnalyticsEvents('clicked_start_career_path',{step: 3});
      navigate('EducationDetails' as never);
    }
  };

  const renderStepIndicator = (step, isActive) => (
    <View h={28} w={28} br={28} bw={1.5} bc={(isActive && currentStep === step) ? "#fff" : "#8e8e8e"} jc="center" ai="center" bgc={isActive ? "#000" : "#8e8e8e"}>
      {isActive ? (
        <Text ftsz={14} c={currentStep === step ? "#fff" : "#8e8e8e"}>{step}</Text>
      ) : (
        <Icon name="check" size={14} color="#000" />
      )}
    </View>
  );

  const renderStepContent = (title, description, step, isActive) => (
    <View>
      <Text ftsz={14} weight="400" c={(isActive && currentStep === step) ? "#fff" : "#8e8e8e"}>{title}</Text>
      <Text ftsz={12} weight="300" c={(isActive && currentStep === step) ? "#fff" : "#8e8e8e"}>{isActive ? description : ' '}</Text>
    </View>
  );

  const isFocused = useIsFocused();
  useStatusBar(headerColor, 'dc', isFocused);

  return (
    <Layout
      renderHeader={renderHeader}
      topContainerHeightPercent={40}
      headerColor={headerColor}
      containerStyle={{
        flex: 1,
        gap: 40,
        paddingTop: 40,
        justifyContent: 'center',
        paddingBottom: insets.bottom + 40
      }}
    >
      <Text c="#fff" ta="center" ph={24} lh={18.36}>
        {navigatedFrom === 'profile' ? 'This requires your undivided attention. There are no right or wrong answers, answer with what comes to you naturally.' : 'Time to find ideal careers that match your professional aspirations and skills.'}
      </Text>
      {navigatedFrom !== 'profile' && (
        <View fd="row" jc="center" gap={10} f={1} pv={24}>
          <View mb={12}>
            {renderStepIndicator(1, currentStep === 1)}
            <View f={1} w={1.5} bgc={currentStep === 1 ? "#8e8e8e" : "#fff"} asf="center" />
            {renderStepIndicator(2, currentStep !== 3)}
            {/* <View f={1} w={1.5} bgc={currentStep !== 3 ? "#8e8e8e" : "#fff"} asf="center" />
            {renderStepIndicator(3, true)} */}
          </View>
          <View>
            {renderStepContent('Personality & Interests', 'About 10 mins', 1, currentStep === 1)}
            <View f={1} />
            {renderStepContent('Aspirations & Skills', '3-5 mins', 2, currentStep !== 3)}
            {/* <View f={1} />
            {renderStepContent('Education', '3-5 mins', 3, true)} */}
          </View>
        </View>
      )}
      <TouchableOpacity
        disabled={(isLoading || isLoadingQuestions)}
        h={44}
        mh={32}
        br={8}
        jc="center"
        ai="center"
        bgc={"#FFF"}
        onPress={onPressStart}
      >
        {(isLoading || isLoadingQuestions) && <ActivityIndicator color="#000" />}
        {!isLoading && !isLoadingQuestions && <Text c={'#000'} weight="700" ftsz={14} lh={34}>Start Career Path Analysis</Text>}
      </TouchableOpacity>
    </Layout>
  );
};

export default SelectFlow;
