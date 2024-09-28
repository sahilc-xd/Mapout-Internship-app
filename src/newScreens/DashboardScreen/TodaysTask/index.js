import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../../components";
import Icon from "react-native-vector-icons/Fontisto";
import { ICONS } from "../../../constants";
import { navigate } from "../../../utils/navigationService";
import { api } from "../../../redux/api";
import { useAppSelector } from "../../../redux";
import { useWindowDimensions, Image as Img } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AntIcon from "react-native-vector-icons/AntDesign";
import Icons from "../../../constants/icons";
import {
  welcomeToCoachingThumbnail,
  welcomeToCoachingVideo,
} from "../../../utils/constants";
import logAnalyticsEvents from "../../../utils/logAnalyticsEvent";

const VideoModal = props => {
  const { showVideoPopup, closePopup } = props;
  const [imgHeight, setImgHeight] = useState(200);
  const widthScreen = useWindowDimensions().width - 48;
  const data = [
    {
      heading: "Module 1",
      text: "Communication Mastery - Learn to communicate clearly and confidently, both verbally and non-verbally.",
    },
    {
      heading: "Module 2",
      text: "Body Language - Master the art of non-verbal communication to enhance your presence.",
    },
    {
      heading: "Module 3",
      text: "Emotional Intelligence - Develop self-awareness, empathy, and relationship skills.",
    },
    {
      heading: "Module 4",
      text: "Self-Confidence - Build resilience and empower yourself to pursue your goals fearlessly.",
    },
  ];

  const getImageHeight = () => {
    Img.getSize(welcomeToCoachingThumbnail, (width, height) => {
      setImgHeight(height * (widthScreen / width));
    });
  };

  useEffect(() => {
    getImageHeight();
  }, []);

  const onCLickPlay = () => {
    closePopup();
    navigate("PlayVideoLink", {
      url: welcomeToCoachingVideo,
    });
  };
  return (
    <Modal
      visible={showVideoPopup}
      onRequestClose={closePopup}
      transparent
      animationType="fade">
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
        <TouchableOpacity activeOpacity={1} f={1} onPress={closePopup} />
        <View f={3}>
          <LinearGradient
            colors={["#BAE4A8", "#C9F2EF"]}
            useAngle={true}
            angle={135}
            angleCenter={{ x: 0.5, y: 0.5 }}
            style={{
              paddingHorizontal: 24,
              paddingTop: 32,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
            }}>
            <TouchableOpacity onPress={closePopup} asf="flex-end" t={0}>
              <AntIcon name="close" size={18} color={"#000"} />
            </TouchableOpacity>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}>
              <Text ta="center" mh={64} ftsz={16} weight="500">
                Welcome to the Coaching Essentials Program!
              </Text>
              <Text mt={32} ftsz={12} weight="400">
                Over the next four modules, each spanning 30 days, you'll learn
                essential skills for personal and professional growth.
              </Text>
              <Text mt={16} ftsz={12} weight="400">
                Let’s learn about what is essential soft skills coaching!
              </Text>
              <View w={"100%"} pt={16} jc="center">
                <TouchableOpacity
                  onPress={onCLickPlay}
                  asf="center"
                  po="absolute"
                  z={1}
                  br={50}
                  bgc="rgba(0,0,0,0.4)">
                  <ICONS.PlayButton fill={"#000"} />
                </TouchableOpacity>
                <Image
                  br={12}
                  resizeMode="contain"
                  h={imgHeight}
                  w={"100%"}
                  source={{
                    uri: welcomeToCoachingThumbnail,
                  }}
                />
              </View>
              <View mt={32}>
                {data.map((item, index) => {
                  return (
                    <Text
                      key={index.toString()}
                      mb={16}
                      c={"#000"}
                      ftsz={14}
                      weight="700">
                      {item?.heading}
                      <Text c={"#000"} ftsz={14} weight="300">
                        : {item.text}
                      </Text>
                    </Text>
                  );
                })}
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const TodaysTask = ({ source = "dashboard" }) => {
  const [getDailyTask, { data: APIdata, isSuccess, isFetching }] =
    api.useLazyGetDailyTaskQuery({});
  const user = useAppSelector(state => state?.user);
  const [data, setData] = useState();
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const title = data?.completedTask?.title || data?.task?.title || "";
  const description =
    data?.completedTask?.first_line || data?.task?.first_line || "";
  const points = data?.completedTask?.point || data?.task?.point || 0;
  const isTaskCompleted = user?.taskDetails?.taskStatus === "completed";

  useEffect(() => {
    getDailyTask({ userId: user?.user_id });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setData(APIdata);
    }
  }, [isSuccess, APIdata]);

  const closePopup = () => {
    setShowVideoPopup(false);
  };

  return (
    <>
      <VideoModal showVideoPopup={showVideoPopup} closePopup={closePopup} />
      {source === "dashboard" && (
        <LinearGradient
          colors={["rgba(240, 245, 248, 1)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          useAngle={true}
          angle={180}
          angleCenter={{ x: 0.5, y: 0.5 }}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text ftsz={18} weight="400" c={"#17171F"}>
            Your Coaching Journey
          </Text>
          <TouchableOpacity
            onPress={() => {
              logAnalyticsEvents("viewed_modules_info", {});
              setShowVideoPopup(true);
            }}>
            <View
              br={12}
              bgc={"rgba(255, 255, 255, 0.65)"}
              pv={8}
              ph={8}
              asf="flex-end"
              fd="row"
              ai="center">
              <Text mr={4} ftsz={12} weight="500">
                Modules
              </Text>
              <ICONS.Info fill={"#EDEDED"} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      )}
      {source === "inner" && <View style={{ marginTop: 20 }}></View>}
      <TouchableOpacity
        onPress={() => {
          source != "dashboard" &&
            logAnalyticsEvents("start_task", { task_id: data?.task?._id });
          source === "dashboard"
            ? navigate("JourneyScreen", {
                selectedTab: isTaskCompleted
                  ? "Previous Learning"
                  : "Todays Task",
              })
            : navigate("TaskScreen");
        }}
        mh={source === "dashboard" ? 24 : 0}
        bgc={isTaskCompleted ? "rgba(217, 217, 217, 0.45)" : "#FFFFFFBF"}
        bw={isTaskCompleted ? 0 : 1}
        bc={"#FFFFFF"}
        ph={16}
        pv={24}
        br={20}>
        <View fd="row" jc="space-between">
          <View fd="row" jc="space-between" ai="center">
            <View fd="row" jc="center" ai="center">
              <Text mr={4} ftsz={12} weight="400" c={"#17171F80"}>
                Today’s task
              </Text>
              <Icon name="ellipse" size={2} color={"#17171F80"} />
              <Text ml={4} ftsz={12} weight="400" c={"#FF8C6B"}>
                {user?.taskDetails?.taskStatus === "notCompleted"
                  ? "Not started"
                  : user?.taskDetails?.taskStatus === "inprogress"
                  ? "In Progress"
                  : "Completed"}
              </Text>
            </View>
            <View></View>
          </View>
          {/* {!isTaskCompleted && <View fd="row" ai="center">
            <Image
                        source={require("../../../assets/gifs/FireAnimation.gif")}
                        style={{ width: 15, height: 15 }}
                        resizeMode="contain"
                    />
            <Text ml={4} c={"#EFC019"} ftsz={12} weight="600">
              Earn {points} points
            </Text>
          </View>} */}
        </View>
        <View pv={32}>
          <Text ftsz={20} weight="600" c={"#000"}>
            {title}
          </Text>
          <Text ftsz={14} weight="400" c={"rgba(23, 23, 31, 0.5)"}>
            {description}
          </Text>
        </View>
        {isTaskCompleted ? (
          <TouchableOpacity
            jc="center"
            ai="center"
            bgc={"#FFF"}
            br={12}
            fd="row"
            disabled={true}
            pv={12}>
            <Icons.Tick height={24} width={24} />
            <Text ml={8} c={"#000"} ftsz={14} weight="400">
              All done for today
            </Text>
            {/* <AntIcon name="check" size={18} color={'#48A022'} /> */}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              logAnalyticsEvents("start_task", { task_id: data?.task?._id });
              navigate("TaskScreen");
            }}
            jc="center"
            ai="center"
            bgc={"#000"}
            br={12}
            pv={12}>
            <Text c={"#FFF"} ftsz={14} weight="400">
              Start Task
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {/* {source === 'dashboard' && <View mh={64} fd="row" jc="space-between">
        <View h={16} w={4} bgc={"#FFF"} />
        <View h={16} w={4} bgc={"#FFF"} />
      </View>} */}
    </>
  );
};

export default TodaysTask;
