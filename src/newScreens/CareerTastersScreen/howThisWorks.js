import React from "react";
import MainLayout from "../../components/MainLayout";
import { TouchableOpacity, View } from "react-native-style-shorthand";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const HowThisWorks = () => {
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
              How this works
            </Text>
          </View>
          <View jc="center" ai="center" f={1} ph={16}>
            <View bgc={"rgba(255, 255, 255, 0.7)"} br={16} ph={16} pv={32}>
              <Text ftsz={13} weight="400" ta="center">
                Welcome to MapOut’s Career Tasters! These are free, virtual
                experience programs that help build real-life skills for
                real-life roles.
              </Text>
              <Text mt={24} ftsz={13} weight="500">
                How it works:
              </Text>
              <View mt={32} fd="row">
                <Text ftsz={13} weight="400">
                  1.{"  "}
                </Text>
                <Text f={1} ftsz={13} weight="400">
                  Enroll in a Career Taster of your interest and complete{" "}
                  <Text ftsz={13} weight="600">
                    self-paced tasks
                  </Text>
                  {"  "}
                  guided by videos or prompts from the employer.
                </Text>
              </View>
              <View mt={16} fd="row">
                <Text ftsz={13} weight="400">
                  2.{" "}
                </Text>
                <Text ftsz={13} weight="400" f={1}>
                  Earn a{" "}
                  <Text ftsz={13} weight="600">
                    completion certificate
                  </Text>
                  , that gets added to your MapOut profile for future employers
                  to view.
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default HowThisWorks;
