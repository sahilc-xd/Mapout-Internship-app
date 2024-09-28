import React from "react";
import MainLayout from "../../components/MainLayout";
import { TouchableOpacity, View } from "react-native-style-shorthand";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const Stepper = () => {
  return (
    <View fd="row" ph={32} jc="space-between">
      <View h={14} bgc={"#FFF"} w={4} />
      <View h={14} bgc={"#FFF"} w={4} />
    </View>
  );
};

const TaskOverview = (props) => {
  const {data={}} = props?.route?.params;

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1} w={"100%"} h={"100%"}>
        <LinearGradient
          colors={["#FFFFFF", "rgba(102, 145, 255, 0.4)", "#FFFFFF"]}
          useAngle={true}
          angle={135}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.2, 0.65, 1]}
          style={{ flex: 1 }}>
          <View fd="row" mh={16} mv={8} ai="center" jc="space-between">
            <TouchableOpacity
              z={1}
              po="absolute"
              onPress={() => popNavigation()}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text f={1} ta="center" ftsz={17} weight="500">
              Overview
            </Text>
          </View>
          <View f={1} ph={32} mt={16}>
            {data?.careerTaster?.tasks?.map((item, index)=>{
                return(
                    <View key={index?.toString()}>
                        <View bgc={'rgba(255, 255, 255, 0.8)'} p={16} br={16}>
                            <View fd="row" ai="center" jc="space-between">
                                <Text ftsz={16} weight="600">
                                    Task {index+1}
                                </Text>
                                <View bgc={'rgba(102, 145, 255, 0.5)'} pv={4} ph={8} br={8}>
                                    <Text ftsz={12} weight="500">{item?.estimatedCompletionTime}</Text>
                                </View>
                            </View>
                            <Text mt={16} c={'#0F0F10'} ftsz={13} weight="400">
                                {item?.whatYoullLearn}
                            </Text>
                        </View>
                        <Stepper/>
                    </View>
                )
            })}
            <View bgc={'rgba(102, 145, 255, 0.5)'} pv={16} jc="center" ai="center" br={16}>
                <Text c={'#0F0F10'} ftsz={13} weight="400">Earn completion certificate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default TaskOverview;
