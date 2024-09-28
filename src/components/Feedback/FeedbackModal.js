import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '..';
import Rating from './Rating';
import Options from './Options';
import OptionsVertical from './OptionsVertical';
import TextAnswer from './TextAnswer';
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../redux';
import { api } from '../../redux/api';
import Toast from 'react-native-toast-message';

const options = ["Coaching", "CareerWise", "Jobs", "Workshops"]

const FeedbackModal = ({ screen })=>{
    const user = useAppSelector(state => state.user);
    let user_id = user?.user_id;
    let day = user?.userDay;
    const { isSuccess, isLoading, isError, error, data } = api.useFeedbackQuestionsQuery({ user_id, day: day, feedback_for: screen });
    const [submitFeedback, {isSuccess: isSubmitSuccess, isLoading: isLoadingSuccess }] = api.useSubmitFeedbackMutation();
    const [submitFeedbackReminder, {isSuccess: isSubmitReminderSuccess }] = api.useSubmitFeedbackReminderMutation();
    const [a, setA]= useState(true);
    const [b, setB] = useState(true);
    const [answers, setAnswer] = useState([]);

    const updateAnswer = (ans)=>{
        const answersArray = []
        let questionExists = false;
        for(let i=0;i<answers.length;i++) {
            if(answers[i]?.question_id === ans.question_id) {
                questionExists = true;
                answersArray.push(ans)
            } else {
                answersArray.push(answers[i])
            }
        }
        if(!questionExists) {
            answersArray.push(ans);
        }
        setAnswer(answersArray)
    }

    const insets = useSafeAreaInsets();

    const questions = data?.feedbackQuestions?.questions;
    const showRemindLater = data?.showRemindLater;

    const handleSubmitClicked = () => {
        if(questions.length === answers.length) {
            const responseData = {
                user_id: user_id,
                feedback_questions_id: data?.feedbackQuestions?._id,
                day:day,
                answers: answers
            }
            submitFeedback(responseData);
            setA(false);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'You must answer all the feedback questions.',
            });
        }
    }

    const handleRemindNeverClicked = () => {
        const responseData = {
            user_id: user_id,
            feedback_questions_id: data?.feedbackQuestions?._id,
            whenToRemind: 'never'
        }
        submitFeedbackReminder(responseData);
        setB(false);
    }

    const handleRemindLaterClicked = () => {
        const responseData = {
            user_id: user_id,
            feedback_questions_id: data?.feedbackQuestions?._id,
            whenToRemind: 'later'
        }
        submitFeedbackReminder(responseData);
        setB(false);
    }

    if(!isLoading && isSuccess) {
        if(a === true) {
            return(
                <Modal onRequestClose={()=>{
                    setA(false);
                }} f={1} visible={a} h={'50%'} jc='flex-end' animationType="slide"
                transparent={true} bgc={'#FFF'} pb={-insets.bottom}>
                    <TouchableOpacity jc='flex-end' f={1.5} onPress={()=>{
                        setA(false);
                    }}>
                        <View bgc={'#FFF'} asf='center' br={25} p={8} mb={16}>
                            <Icon name="close" size={20} color={"#202020"}/>
                        </View>
                    </TouchableOpacity>
                    <KeyboardAvoidingView behavior={"padding"}>
                        <View f={3.5} pt={16} jc='center' bgc={'#FFF'} ph={16} btrr={40} btlr={40}>
                            <Text ta='center' weight='700' ftsz={17}>
                                Share your feedback
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'} style={{marginVertical: 8}} contentContainerStyle={{flexGrow: 1, justifyContent: 'center', paddingVertical: 16}}>
                                {questions.map((ques) => {
                                    switch(ques.question_type) {
                                        case 'stars':
                                            return <Rating questionText={ques.question_text} questionIndex={ques.question_id} answerVal={answers} updateAnswer={updateAnswer} />

                                        case 'options':
                                            return <Options questionText={ques.question_text} options={ques.options} questionIndex={ques.question_id} answerVal={answers} updateAnswer={updateAnswer}/>

                                        case 'text':
                                            return <TextAnswer questionText={ques.question_text} questionIndex={ques.question_id} answerVal={answers} updateAnswer={updateAnswer}/>

                                        default:
                                            break;
                                    }
                                })}
                            </ScrollView>
                            <TouchableOpacity onPress={handleSubmitClicked} pb={16} asf='center'>
                                <LinearGradient colors={["#5980FF", "#A968FD"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} style={{borderRadius: 8, paddingVertical: 12}}>
                                    <Text ph={48} ftsz={12} weight='700' c={"#fff"} ta="center">Submit</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            )
        } else if(a === false && b === true && showRemindLater === true && (!isSubmitSuccess && !isLoadingSuccess)) {
            return(
                <Modal onRequestClose={()=>{
                    setB(false);
                }} f={1} visible={b} h={'50%'} jc='flex-end' animationType="slide"
                transparent={true} bgc={'#FFF'} pb={-insets.bottom}>
                    <TouchableOpacity jc='flex-end' f={3} onPress={()=>{
                        setB(false);
                    }}>
                        <View bgc={'#FFF'} asf='center' br={25} p={8} mb={16}>
                            <Icon name="close" size={20} color={"#202020"}/>
                        </View>
                    </TouchableOpacity>
                    <KeyboardAvoidingView behavior={"padding"}>
                        <View f={2} pt={16} jc='center' bgc={'#FFF'} ph={16} btrr={40} btlr={40}>
                            <Text ta='center' weight='700' ftsz={17}>
                                Your feedback is valuable to us for the Beta version. 
                            </Text>
                            <Text ta='center' weight='500' ftsz={13} pv={18}>
                                Please tell us when can we ask again for Feedback.
                            </Text>
                            <View style={{ flexDirection:'row' }}>
                                <TouchableOpacity f={2} onPress={handleRemindNeverClicked} pb={16} mh={2} asf='center'>
                                    <View style={{borderRadius: 8, paddingVertical: 12}}>
                                        <Text bw={1} bc={"#000"} pv={10} br={8} ftsz={12} weight='400' c={"#000"} ta="center">Remind Never</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity f={3} onPress={handleRemindLaterClicked} pb={16} mh={2} asf='center'>
                                    <LinearGradient colors={["#5980FF", "#A968FD"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} style={{borderRadius: 8, paddingVertical: 12}}>
                                        <Text ftsz={12} weight='700' c={"#fff"} ta="center">Remind me Later</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            )
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export default FeedbackModal;