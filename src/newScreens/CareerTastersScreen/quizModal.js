import React, { useState } from "react";
import { Platform } from "react-native";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text, TextInput } from "../../components";
import Icon from 'react-native-vector-icons/AntDesign';

const QuizModal = props => {
  const { showModal, closeModal, questions, quizAnswers, setQuizAnswers } = props;
  return (
    <Modal visible={showModal} transparent onRequestClose={closeModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        f={1}
        bgc={"rgba(0,0,0,0.3)"}>
        <TouchableOpacity onPress={closeModal} activeOpacity={1} f={3} />
        <View f={7} bgc={"#FFF"} ph={24} pv={32} btrr={32} btlr={32}>
          <TouchableOpacity onPress={closeModal} asf="flex-end">
            <Icon name="close" size={18} />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 32,
              paddingTop: 16,
              flexGrow: 1,
            }}>
            {questions?.map((item,index) => {
              return (
                <View key={index?.toString()}>
                  <Text mt={16}>{index+1}. {item}</Text>
                  <TextInput
                    value={quizAnswers[index]}
                    onChangeText={(e)=>{
                      setQuizAnswers((prv)=>{
                        let ans=[...prv];
                        ans[index]=e;
                        return ans;
                      })
                    }}
                    mt={8}
                    h={100}
                    bw={1}
                    c={"#000"}
                    pv={8}
                    br={12}
                    placeholderTextColor={"#7F8A8E"}
                    placeholder={"Type here"}
                    place
                    ph={8}
                    textAlignVertical="top"
                    multiline
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuizModal;
