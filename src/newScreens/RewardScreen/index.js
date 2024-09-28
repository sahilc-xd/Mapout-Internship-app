import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native-style-shorthand";
import { Animated, Alert } from "react-native";
import { ICONS } from "../../constants";
import { Text, TextInput } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckBox from "react-native-check-box";
import Icons from "../../constants/icons";
import { useAppSelector } from "../../redux";
import Toast from "react-native-toast-message";

const RewardScreen = props => {
  const points = props?.route?.params?.points;
  const inner = useRef(new Animated.Value(0));
  const [isModalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const user = useAppSelector(state => state.user);
  const task_id = props?.route?.params?.task_id;
  const user_id = user?.user_id;
  const { token } = useAppSelector(state => state.auth);
  const [selectedPace, setSelectedPace] = useState("");
  const [selectedDepth, setSelectedDepth] = useState("");
  const [engagement, setEngagement] = useState("");
  const [otherEngagement, setOtherEngagement] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

    fetch("https://dev.api-gateway.mapout.com/mapout-node/api/taskFeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          Toast.show({
            type: "success",
            text1: "Feedback Submitted",
            text2: "Feedback Submitted successfully.",
          });
          setFeedbackSubmitted(true);
        } else {
          console.error("Failed to send data" + JSON.stringify(response));
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });

    // Close the modal
    setModalVisible(false);
  };

  const handleOtherCheckboxChange = newValue => {
    setEngagement("Other");
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(inner.current, {
          toValue: 1.3,
          duration: 2700,
          useNativeDriver: true,
        }),
        Animated.timing(inner.current, {
          toValue: 1,
          duration: 2700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../../components/RewardPointModal/RewardBackground.png")}
        resizeMode="cover">
        <View f={1} mv={16}>
          <View f={1}>
            <Image
              source={require("../../assets/gifs/Confetti.gif")}
              style={{ width: "100%", position: "absolute", height: "80%" }}
              resizeMode="stretch"
            />
            <View f={1} jc="center" ai="center">
              <Animated.View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 16,
                  height: 170,
                }}>
                <Animated.View
                  style={{
                    backgroundColor: "#FFFFFF40",
                    // padding: inner.current,
                    borderRadius: 100,
                    transform: [{ scale: inner.current }],
                  }}>
                  <Animated.View
                    style={{
                      backgroundColor: "#FFFFFF59",
                      // padding: inner.current,
                      borderRadius: 100,
                      margin: 12,
                    }}>
                    <Animated.View
                      style={{
                        backgroundColor: "#FFFFFF73",
                        // padding: inner.current,
                        borderRadius: 100,
                        margin: 12,
                      }}>
                      <View p={48}></View>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
              <View po="absolute" asf="center">
                <ICONS.Trophy width={64} height={64} />
              </View>
            </View>
            <View
              mv={8}
              bgc={"#FFF8DE"}
              ph={32}
              pv={16}
              bw={2}
              bc={"#FFD439"}
              br={12}
              asf="center">
              <Text ftsz={16} weight="600">
                +{points} points
              </Text>
            </View>
            <View
              mh={32}
              mv={8}
              bgc={"#FFF8DE"}
              ph={16}
              pv={16}
              br={12}
              asf="center">
              <Text ftsz={16} weight="600" ta="center">
                Well done!
              </Text>
              <Text mt={8} ftsz={14} weight="500" ta="center">
                You earned {points} points for completing this task.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            mt={32}
            mb={16}
            mh={32}
            jc="center"
            ai="center"
            bgc={"#000"}
            br={12}>
            <Text weight="500" ftsz={14} c={"#FFF"} pv={16}>
              Collect
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default RewardScreen;
