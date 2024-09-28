import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Animated, Platform } from "react-native";
import { Text, TextInput } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import RenderHTML from "react-native-render-html";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/AntDesign";
import CheckBox from "react-native-check-box";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../redux/api";

const KeyTakeawayScreen = props => {

//   const inner = useRef(new Animated.Value(0));
  const insets = useSafeAreaInsets();
  const keyTakeaway = props?.route?.params?.keyTakeaway;
  const [isModalVisible, setModalVisible] = useState(false);
  const user = useAppSelector(state => state.user);
  const task_id = props?.route?.params?.task_id;
  const { token } = useAppSelector(state => state.auth);
  const user_id = user?.user_id;
  const [selectedPace, setSelectedPace] = useState("");
  const [selectedDepth, setSelectedDepth] = useState("");
  const [engagement, setEngagement] = useState("");
  const [otherEngagement, setOtherEngagement] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [postTaskFeedback, {isSuccess, isError}] = api.usePostTaskFeedbackMutation();

  useEffect(()=>{
    if(isSuccess){
      Toast.show({
        type: "success",
        text1: "Feedback Submitted",
        text2: "Feedback Submitted successfully.",
      });
      setFeedbackSubmitted(true);
    }
  },[isSuccess])

  useEffect(()=>{
    if(isError){
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
        text2: "Please try again later.",
      });
    }
  },[isError])

  const handleSubmit = () => {
    if (feedbackSubmitted) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You have already submitted the Feedback",
      });
      setModalVisible(false);
      return;
    }

    const data = {
      user_id: user_id,
      task_id: task_id,
      paceOfLearning: selectedPace,
      depthOfLearning: selectedDepth,
      engagementWithTasks: engagement,
      otherEngagement: engagement === "Other" ? otherEngagement : "",
      feedback: feedback,
    };

    postTaskFeedback(data);
    // Close the modal
    setModalVisible(false);
  };

  const handleOtherCheckboxChange = newValue => {
    setEngagement("Other");
  };



  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: '#000',
      fontSize:15,
      fontWeight: '400',
      textAlign: 'center',
      fontFamily : 'RedHatDisplay-Regular'
    },
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./KeyTakeawayBackground.png")}
        resizeMode="cover">
        <View f={1} mt={8} mb={8}>
          <View mh={16} fd="row" ai="center" pb={16}>
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}>
                <Icons.BackArrow width={32} height={32}/>
            </TouchableOpacity>
            <Text ml={8} ftsz={17} weight="500">
              Today’s task
            </Text>
          </View>
          <ScrollView contentContainerStyle={{justifyContent: 'center', flexGrow:1}}>
            <View pv={16} ph={32} br={12} asf="center">
              <Text ftsz={20} weight="600">
              Key takeaway for today
              </Text>
            </View>
            <View
                mt={16}
              mh={32}
              bgc={"rgba(255, 255, 255, 0.8)"}
              ph={16}
              br={12}
              f={1}
              pv={16}
              jc="center"
              asf="center">
              
              <RenderHTML
                systemFonts={["RedHatDisplay-Regular"]}
                source={{ html: keyTakeaway }}
                tagsStyles={tagsStyles}
              />
            </View>
            </ScrollView>
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            mt={16}
            // mb={16}
            mh={32}
            jc="center"
            ai="center"
            bgc={"#000"}
            br={12}>
            <Text weight="400" ftsz={14} c={"#FFF"} pv={16}>
              Complete
            </Text>
          </TouchableOpacity>
          <View
          mt={8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 170,
            }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 15,
                color: "#000",
              }}>
              Rate today's task:
            </Text>
            <View style={{ flexDirection: "row", paddingLeft: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setFeedback("positive");
                  setModalVisible(true);
                }}
                style={{ paddingRight: 5 }}>
                <Icons.ThumbsUp size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFeedback("negative");
                  setModalVisible(true);
                }}
                style={{ paddingLeft: 5 }}>
                <Icons.ThumbsDown size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : 'height'} style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              paddingTop: 16,
              paddingHorizontal: 16,
            }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={18} color={"#000"} />
            </TouchableOpacity>
            <ScrollView>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    color: "#000",
                  }}>
                  Rate today's task:
                </Text>
                <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setFeedback("positive");
                      setModalVisible(true);
                    }}
                    style={{ paddingRight: 5 }}>
                    {feedback === "positive" ? (
                      <Icons.ThumbsUpGreen size={24} color="#000" />
                    ) : (
                      <Icons.ThumbsUp size={24} color="#000" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setFeedback("negative");
                      setModalVisible(true);
                    }}
                    style={{ paddingLeft: 5 }}>
                    {feedback === "negative" ? (
                      <Icons.ThumbsDownRed size={24} color="#000" />
                    ) : (
                      <Icons.ThumbsDown size={24} color="#000" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View mh={16}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 15,
                  textAlign: "left",
                }}>
                Pace of learning:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                <CheckBox
                  style={{ borderColor: "#000" }}
                  isChecked={selectedPace === "JustRight"}
                  onClick={() => setSelectedPace("JustRight")}
                />

                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Just Right</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={selectedPace === "TooSlow"}
                  onClick={() => setSelectedPace("TooSlow")}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Too Slow</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={selectedPace === "TooFast"}
                  onClick={() => setSelectedPace("TooFast")}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Too Fast</Text>
              </View>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 10,
                  textAlign: "left",
                }}>
                Depth of learning:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                <CheckBox
                  isChecked={selectedDepth === "DeeplyInformative"}
                  onClick={() => setSelectedDepth("DeeplyInformative")}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Deeply Informative</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={selectedDepth === "Adequate"}
                  onClick={() => setSelectedDepth("Adequate")}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Adequate</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={selectedDepth === "NotEnoughDepth"}
                  onClick={() => setSelectedDepth("NotEnoughDepth")}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Not Enough Depth</Text>
              </View>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 10,
                  textAlign: "left",
                }}>
                Engagement with Tasks:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                <CheckBox
                  isChecked={engagement === "HighlyEngaging"}
                  onClick={() =>
                    setEngagement("HighlyEngaging")
                  }
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Highly Engaging</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={engagement === "ModeratelyEngaging"}
                  onClick={() =>
                    setEngagement("ModeratelyEngaging")
                  }
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Moderately Engaging</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={engagement === "NotEngaging"}
                  onClick={() =>
                    setEngagement("NotEngaging")
                  }
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Not Engaging</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <CheckBox
                  isChecked={engagement === "Other"}
                  onClick={handleOtherCheckboxChange}
                />
                <Text ftsz={14} weight="400" style={{ marginLeft: 10 }}>Other (please specify)</Text>
              </View>
              {engagement === "Other" && (
                <View mt={8}>
                  <TextInput
                    maxLength={250}
                    weight={'400'}
                    ftsz={13}
                    multiline
                    textAlignVertical='top'
                    bw={0.5}
                    bc={'#000'}
                    br={12}
                    pv={16}
                    ph={8}
                    placeholder="Type here"
                    placeholderTextColor="black"
                    onChangeText={setOtherEngagement}
                    value={otherEngagement}
                  />
                  <Text ftsz={12} ta="right" pt={2}>
                    250 Characters allowed
                  </Text>
                </View>
              )}
              </View>
            </View>
            
                <TouchableOpacity
                  mh={24}
                  mt={16}
                  onPress={handleSubmit}
                  jc="center"
                  ai="center"
                  style={{
                    backgroundColor: "#000",
                    borderRadius: 12,
                    paddingVertical:16,
                  }}>
                  <Text ftsz={14} weight="500" c={'#FFF'}>
                    Submit
                  </Text>
                </TouchableOpacity>
                </ScrollView>
          </View>
          <View style={{ backgroundColor: "#FFFFFF", height: insets.bottom }} />
        </KeyboardAvoidingView>
      </Modal>
    </MainLayout>
  );
};

export default KeyTakeawayScreen;
