import React from "react";
import MainLayout from "../../components/MainLayout";
import { ScrollView, TouchableOpacity, View } from "react-native-style-shorthand";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const Stepper = () => {
  return (
    <View fd="row" ph={32} jc="space-between">
      <View h={14} bgc={"#FFF"} w={4} />
      <View h={14} bgc={"#FFF"} w={4} />
    </View>
  );
};

const CompleteTaskOverview = props => {
  const { data = {} } = props?.route?.params;
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
            <ScrollView>
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
          <View f={1} ph={24} mt={16}>
            {data?.careerTaster?.tasks?.map((item, index) => {
              return (
                  <View key={index?.toString()}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                        navigate("ViewCompletedTask", {
                          taskDetails: data?.careerTaster?.tasks?.[index],
                        })
                      }
                      bgc={"rgba(255, 255, 255, 0.8)"}
                      p={16}
                      br={16}>
                      <View fd="row" ai="center" jc="space-between">
                        <Text ftsz={16} weight="600">
                          Task {index + 1}
                        </Text>
                        <Icons.Done
                            width={24}
                            height={24}
                        />
                      </View>
                    </TouchableOpacity>
                    <Stepper />
                  </View>
              );
            })}
            <Stepper />
            <Stepper />
            <Stepper />
            <View
              bgc={"rgba(255, 255, 255, 0.6)"}
              pv={16}
              ph={16}
              jc="center"
              ai="center"
              br={16}>
              <Icons.PartyPopper width={40} height={40} />
              <Text mb={16} mt={24} c={"#0F0F10"} ftsz={16} weight="600" ta="center">
                You have successfully completed this Virtual Experience
                Certificate.
              </Text>
            </View>

            <TouchableOpacity mt={16} bgc={'#000'} pv={12} br={16} ai="center" jc="center">
              <Text ftsz={14} weight="500" c={'#FFF'}>Download completion certificate</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default CompleteTaskOverview;
