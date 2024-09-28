import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { SelectInput, Text, TextInput } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../redux/api";
import Toast from "react-native-toast-message";

const CareerTasterFeedback = (props) => {
  const { data = {}, updateData } = props?.route?.params;
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [question4, setQuestion4] = useState("");
  const [question5, setQuestion5] = useState("");
  const [question6, setQuestion6] = useState("");
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");

  const [submitFeedback, {isSuccess, isLoading}] = api.useSubmitCareerTasterFeedbackMutation();

  const handlSubmitButton=()=>{
    if(!question1?.length || !question2?.length || !question3?.length || !question4?.length || !question5?.length || !question6?.length || !star || !comment?.length){
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You must answer all the feedback questions.',
      })
    }else{
      const APIdata = {
        careerTaster_id: data?.careerTaster?._id,
        rating: star,
        answers: [question1, question2, question3, question4, question5, question6],
        comment: comment
      }
      submitFeedback(APIdata);
    }
  }

  useEffect(()=>{
    if(isSuccess && !isLoading){
      const updatedDetails = { ...data };
      updatedDetails.isCompleted = true;
      updateData(updatedDetails);
      popNavigation();
      navigate('CareerTasterCompleted', {data: updatedDetails});
    }
  },[isSuccess, isLoading])

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <KeyboardAvoidingView
        contentContainerStyle={{ marginBottom: 32 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        f={1}>
        <View f={1}>
          <View fd="row" mh={16} mv={8} ai="center" jc="space-between">
            <TouchableOpacity
              z={1}
              po="absolute"
              onPress={() => popNavigation()}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text f={1} ta="center" ftsz={17} weight="500">
              MapOut’s Career Taster
            </Text>
          </View>
          <ScrollView
            ph={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}>
            <Text mb={24} ftsz={14} weight="500">
              Feedback questions:
            </Text>
            <View>
              <Text ftsz={13} weight="400">
                How much has your awareness of MapOut increased after taking the
                program?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question1}
                selectedOptions={question1}
                onSelect={index => setQuestion1(index)}
                label="Select*"
                options={[
                  "Significantly increased",
                  "Somewhat increased",
                  "Neutral",
                  "Slightly decreased",
                  "Significantly decreased",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question1 ? question1 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View mt={16}>
              <Text ftsz={13} weight="400">
                How likely are you to speak positively about MapOut to others?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question2}
                selectedOptions={question2}
                onSelect={index => setQuestion2(index)}
                label="Select*"
                options={[
                  "Very likely",
                  "Likely",
                  "Neutral",
                  "Unlikely",
                  "Very unlikely",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question2 ? question2 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View mt={16}>
              <Text ftsz={13} weight="400">
                How well do you understand MapOut’s values and culture after
                completing the program?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question3}
                selectedOptions={question3}
                onSelect={index => setQuestion3(index)}
                label="Select*"
                options={[
                  "Very well",
                  "Well",
                  "Neutral",
                  "Poorly",
                  "Very poorly",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question3 ? question3 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View mt={16}>
              <Text ftsz={13} weight="400">
                How likely are you to apply for a job with MapOut?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question4}
                selectedOptions={question4}
                onSelect={index => setQuestion4(index)}
                label="Select*"
                options={[
                  "Very likely",
                  "Likely",
                  "Neutral",
                  "Unlikely",
                  "Very unlikely",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question4 ? question4 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View mt={16}>
              <Text ftsz={13} weight="400">
                How likely are you to pursue this career tasters career?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question5}
                selectedOptions={question5}
                onSelect={index => setQuestion5(index)}
                label="Select*"
                options={[
                  "Very likely",
                  "Likely",
                  "Neutral",
                  "Unlikely",
                  "Very unlikely",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question5 ? question5 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View mt={16}>
              <Text ftsz={13} weight="400">
                How would you rate the overall quality of the program?
              </Text>
              <SelectInput
                snapPoints={["70%"]}
                value={question6}
                selectedOptions={question6}
                onSelect={index => setQuestion6(index)}
                label="Select*"
                options={[
                  "Very likely",
                  "Likely",
                  "Neutral",
                  "Unlikely",
                  "Very unlikely",
                ]}
                renderInput={({ onPressSelect }) => (
                  <TouchableOpacity
                    onPress={onPressSelect}
                    jc="center"
                    ai="center"
                    mt={12}
                    bbw={1}
                    bc={"#000"}
                    fd="row"
                    gap={16}>
                    <Text f={1} weight="400" ftsz={12} c={"#000"} pb={4}>
                      {question6 ? question6 : "Select an option"}
                    </Text>
                    <Icons.ChevronLeft
                      width={20}
                      height={20}
                      fill={"#000"}
                      style={{
                        transform: [{ rotate: "270deg" }],
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <Text mt={16}>
              How would you rate the overall quality of the program?
            </Text>
            <View fd="row" asf="center" gap={8}>
              {[...Array(star)]?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setStar(index + 1)}
                    key={index.toString()}>
                    <Icon name="star" size={24} color="#FFC107" />
                  </TouchableOpacity>
                );
              })}
              {[...Array(5 - star)]?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setStar(index + 1 + star)}
                    key={index.toString()}>
                    <Icon name="star" size={24} color="#D9D9D9" />
                  </TouchableOpacity>
                );
              })}
            </View>
            <View mb={32}>
              <Text>Leave a comment/review: </Text>
              <TextInput
                f={1}
                bbw={1}
                mt={8}
                value={comment}
                onChangeText={text => setComment(text)}
                style={{ fontSize: 14, fontWeight: "400" }}
                placeholder="Type here"
                placeholderTextColor={"#7F8A8E"}
                c={"#000"}
              />
            </View>
            <TouchableOpacity
              onPress={handlSubmitButton}
              disabled={isLoading}
              br={16}
              mb={16}
              bgc={"#000"}
              mh={16}
              ai="center"
              jc="center"
              pv={12}>
              {isLoading ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ftsz={14} weight="500" c={"#FFF"}>
                Get Certificate
              </Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

export default CareerTasterFeedback;
