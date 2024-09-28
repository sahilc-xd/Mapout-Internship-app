import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { Text } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import { ICONS } from "../../constants";
import Task1 from "./task1";
import Task2 from "./task2";
import Task3 from "./task3";
import Task4 from "./task4";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";
import Task3Quiz from "./task3Quiz";
import Task4Quiz from "./task4Quiz";

const TaskScreen = props => {
  const [taskInstruction, setTaskInstruction] = useState(
    "Instructions to complete the quiz like choose what comes to you etc. appear here.",
  );
  const user = useAppSelector(state => state?.user);
  const [getTask, { data: APIdata, isSuccess, isFetching, isLoading }] =
    api.useLazyGetDailyTaskQuery();
  const [data, setData] = useState({});
  const points = data?.task?.point;
  const [updateTaskToInProgress] = api.useUpdateTaskToInProgressMutation();

  useEffect(() => {
    getTask({ userId: user?.user_id });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setData(APIdata);
      updateTaskToInProgress({userID: user?.user_id, taskID: APIdata?.task?._id});
    }
  }, [isSuccess, APIdata]);

  useEffect(() => {
    if (data?.task?.type) {
      switch (data?.task?.type) {
        case 3: {
          setTaskInstruction(
            "Watch this video and answer a question when done to complete today’s task.",
          );
        }

        case 4: {
          setTaskInstruction(
            "Read through this post and answer a question in the end to complete.",
          );
        }
      }
    }
  }, [data?.task?.type]);

  const taskType = type => {
    switch (type) {
      case 1: {
        return <Task1 navigation={props?.navigation} data={data} />;
      }

      case 2: {
        return <Task2 navigation={props?.navigation} data={data} />;
      }

      case 3: {
        if (data?.task?.task_type === 'assessment') {
          return <Task3 navigation={props?.navigation} data={data} />;
        } else if(data?.task?.task_type === 'quiz'){
          return <Task3Quiz navigation={props?.navigation} data={data} />;
        }
      }

      case 4: {
        if (data?.task?.task_type === 'assessment') {
          return <Task4 navigation={props?.navigation} data={data} />;
        } else if(data?.task?.task_type === 'quiz'){
          return <Task4Quiz navigation={props?.navigation} data={data} />;
        }
      }
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../CoachingScreen/CoachingBackground.png")}
        resizeMode="cover">
        {isFetching ? (
          <View f={1} mv={16} jc="center" ai="center">
            <ActivityIndicator color={"#000"} size={"large"} />
          </View>
        ) : !data?.isTaskExist ? (
          <View f={1} jc="center" ai="center">
            <Text>No Task Exists</Text>
          </View>
        ) : data?.isTaskCompleted ? (
          <View mt={32} f={1}>
            <View mh={16}>
              <View fd="row" ai="center">
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
            </View>
            <View
              mt={32}
              bgc={"rgba(255,255,255,0.65)"}
              pv={16}
              ph={16}
              mh={24}
              br={12}>
              <Text ta="center" ftsz={14} weight="400">
                You’ve already completed today’s task, you can view your
                learning in the <Text weight="600">Previous Learnings</Text>{" "}
                tab. Check back tomorrow for a new task.
              </Text>
            </View>
          </View>
        ) : (
          <View f={1} mv={8}>
            <View mh={16} fd="row" ai="center" jc="space-between">
              <View fd="row" ai="center">
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
              {/* <View fd="row" jc="center" ai="center">
                <Image
                        source={require("../../assets/gifs/FireAnimation.gif")}
                        style={{ width: 18, height: 18 }}
                        resizeMode="contain"
                    />
                <Text ml={4} c={"#EFC019"} ftsz={12} weight="600">
                  Earn {points} points
                </Text>
              </View> */}
            </View>
                {taskType(data?.task?.type)}
          </View>
        )}
      </ImageBackground>
    </MainLayout>
  );
};

export default TaskScreen;
