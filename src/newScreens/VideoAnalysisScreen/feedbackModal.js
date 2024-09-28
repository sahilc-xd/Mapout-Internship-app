import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text, TextInput } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import Icons from "../../constants/icons";
import CheckBox from "react-native-check-box";
import Toast from "react-native-toast-message";
import { useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import { Platform } from "react-native";

const FeedbackModal = props => {
  const user = useAppSelector(state => state?.user);
  const showModal = props?.visible;
  const id = props?.id;
  const closeFeedbackModal = props?.closeModal;
  const modalType = props?.modalType;
  const changeType = props?.changeType;
  const [selectedOption, setSelectedOption] = useState([]);
  const [otherText, setOtherText] = useState("");
  const [submitFeedback, { isSuccess, isLoading }] = api.useSubmitVideoFeedbackMutation();

  const closeModal = () => {
    setSelectedOption([]);
    setOtherText("");
    closeFeedbackModal();
  };

  useEffect(()=>{
    if(isSuccess){
      closeModal();
    }
  },[isSuccess])

  const selectOption = (item)=>{
    if(selectedOption?.includes(item)){
      
      const index = selectedOption.findIndex(obj => obj === item);
      if (index !== -1) {
        setSelectedOption((prv)=>{
          let data= [...prv];
          data.splice(index,1);
          return data;
        })
      }
    }
    else{
      setSelectedOption((prv)=>{
        return [...prv, item];
      })
    }
  }

  const submitData = () => {
    let options = [...selectedOption];
    if(options?.includes("Other (please specify)")){
      const index = options.findIndex(obj => obj === "Other (please specify)");
      if (index !== -1) {
          options.splice(index,1);
      }
      options.push(otherText);
    }
    if(modalType === "like"){
      let data = {
        _id: id,
        user_id: user?.user_id,
        rate: modalType === "like" ? "like" : "dislike",
        positiveFeedback: options
      };
      submitFeedback(data);
    }
    else{
      let data = {
        _id: id,
        user_id: user?.user_id,
        rate: modalType === "like" ? "like" : "dislike",
        negativeFeedback: options
      };
      submitFeedback(data);
    }
    // submitFeedback();
  };

  const onPressSubmit = () => {
    if (selectedOption?.includes("Other (please specify)")) {
      if (otherText?.length === 0) {
        Toast.show({
          type: "error",
          text1: "Text field cannot be empty.",
        });
      } else {
        submitData();
      }
    } else {
      submitData();
    }
  };

  const likeOptions = [
    "It was accurate",
    "It helped me understand myself better",
    "It provided valuable insights",
    "Other (please specify)",
  ];
  const disLikeOptions = [
    "The feature could be more accurate",
    "The feature was difficult to use",
    "The insights provided were not helpful",
    "Other (please specify)",
  ];

  return (
    <Modal
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      visible={showModal}>
         <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        bgc={"rgba(0,0,0,0.3)"}
        f={1}>
      <TouchableOpacity
      activeOpacity={1}
        onPress={closeModal}
        f={1}
      />
      <View ph={24} btrr={24} btlr={24} bgc={"#FFF"} pv={24}>
        <TouchableOpacity mb={4} asf="flex-end" onPress={closeModal}>
          <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <View asf="center" fd="row" ai="center" gap={8}>
          <Text ftsz={14} weight="600">
            Please rate your video analysis
          </Text>
          <TouchableOpacity
            onPress={() => {
              changeType("like");
              setSelectedOption([]);
              setOtherText("");
            }}>
            {modalType === "like" ? (
              <Icons.ThumbsUpGreen width={20} height={20} />
            ) : (
              <Icons.ThumbsUp width={20} height={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              changeType("dislike");
              setSelectedOption([]);
              setOtherText("");
            }}>
            {modalType === "dislike" ? (
              <Icons.ThumbsDownRed width={20} height={20} />
            ) : (
              <Icons.ThumbsDown width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
        <Text mt={16} ftsz={14} weight="500">
          {modalType == "like"
            ? "Please tell us what was good:"
            : "Please tell us what didn’t work:"}
        </Text>
        <FlatList
          data={modalType == "like" ? likeOptions : disLikeOptions}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  selectOption(item);
                }}
                key={item}
                fd="row"
                ai="center"
                mv={8}>
                <CheckBox
                  style={{}}
                  onClick={() => {
                    selectOption(item);
                  }}
                  isChecked={selectedOption?.includes(item)}
                />
                <Text ml={8} ftsz={14} weight="400">
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        {selectedOption?.includes("Other (please specify)") && (
          <>
            <TextInput
              value={otherText}
              onChangeText={text => {
                setOtherText(text);
              }}
              placeholderTextColor='#000'
              mt={8}
              placeholder="Type here"
              maxLength={250}
              bw={1}
              br={12}
              multiline
              ph={16}
              c={'#000'}
            />
            <Text asf="flex-end" ftsz={10} weight="300">
              250 characters allowed
            </Text>
          </>
        )}
        <TouchableOpacity
          onPress={onPressSubmit}
          disabled={selectedOption?.length == 0}
          bgc={selectedOption?.length == 0 ? "#D9D9D9" : "#000"}
          asf="center"
          mt={16}
          pv={16}
          ph={64}
          br={8}>
         {isLoading ? <ActivityIndicator size={'small'} color={'#FFF'}/> : <Text ftsz={12} weight="500" c={"#FFF"}>
            Submit
          </Text>}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FeedbackModal;
