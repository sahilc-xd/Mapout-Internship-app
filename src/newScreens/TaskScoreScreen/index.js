import React, { useEffect, useRef } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Animated } from "react-native";
import { ICONS } from "../../constants";
import { Text } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const TaskScoreScreen = props => {
  const inner = useRef(new Animated.Value(1.1));
  const data = props?.route?.params?.data;
  const task_id = props?.route?.params?.task_id;
  const content = data?.assessmentResult?.content?.replace("mapoutScorePlaceholder", data?.totalScore);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(inner.current, {
          toValue: 1.4,
          duration: 2700,
          useNativeDriver: true,
        }),
        Animated.timing(inner.current, {
          toValue: 1.1,
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
        source={require("./ScoreBackground.png")}
        resizeMode="cover">
        <View f={1} mt={8} mb={16}>
          <View mh={16} fd="row" ai="center">
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text ml={8} ftsz={17} weight="500">
              Today’s task
            </Text>
          </View>
          <View f={1}>
            <Text mt={8} ta="center" c={"#FFF"} ftsz={20} weight="600">
              Your Total Score
            </Text>
            <View mt={32} jc="center" ai="center">
              <Animated.View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                }}>
                <Animated.View
                  style={{
                    backgroundColor: "#FFFFFF40",
                    borderRadius: 100,
                    transform: [{ scale: inner.current }],
                  }}>
                  <Animated.View
                    style={{
                      backgroundColor: "#FFFFFF59",
                      margin: 12,
                      borderRadius: 100,
                    }}>
                    <Animated.View
                      style={{
                        backgroundColor: "#FFFFFF73",
                        margin: 12,
                        borderRadius: 100,
                      }}>
                      <View p={48}></View>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
              <View po="absolute" asf="center" ai="center">
                <Text weight="700" ftsz={30}>
                  {data?.totalScore}
                </Text>
                <Text weight="500" ta="center" ftsz={14}>
                  out of {data?.maxScore}
                </Text>
              </View>
            </View>
            <View pv={16} ph={32} br={12} asf="center">
              <Text ftsz={24} weight="600">
                {data?.assessmentResult?.heading}
              </Text>
            </View>
            <View
              mt={16}
              mh={32}
              bgc={"rgba(255, 255, 255, 0.65)"}
              ph={16}
              br={12}
              f={1}
              pv={16}
              jc="center"
              asf="center">
              <ScrollView
                contentContainerStyle={{
                  justifyContent: "center",
                  flexGrow: 1,
                }}>
                <Text ftsz={14} weight="400" ta="center">
                  {content}
                </Text>
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
                props?.navigation?.replace("KeyTakeawayScreen", {points: data?.point,keyTakeaway: data?.keyTakeaway,task_id:task_id });
            }}
            mt={32}
            mb={16}
            mh={32}
            jc="center"
            ai="center"
            bgc={"#000"}
            br={12}>
            <Text weight="400" ftsz={14} c={"#FFF"} pv={16}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default TaskScoreScreen;
