import React, { useEffect, useRef } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Animated } from "react-native";
import { ICONS } from "../../constants";
import { Text } from "../../components";
import { popNavigation } from "../../utils/navigationService";
import LinearGradient from "react-native-linear-gradient";

const CareerTasterCompleted = props => {
  const inner = useRef(new Animated.Value(1.3));
  const { data = {} } = props?.route?.params;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(inner.current, {
          toValue: 1.8,
          duration: 2700,
          useNativeDriver: true,
        }),
        Animated.timing(inner.current, {
          toValue: 1.3,
          duration: 2700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

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
          <View f={1} mv={16}>
            <View f={1}>
              <Image
                source={require("../../assets/gifs/Confetti.gif")}
                style={{ width: "100%", position: "absolute", height: "100%" }}
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
                        margin: 18,
                      }}>
                      <Animated.View
                        style={{
                          backgroundColor: "#FFFFFF73",
                          // padding: inner.current,
                          borderRadius: 100,
                          margin: 18,
                        }}>
                        <View p={48}></View>
                      </Animated.View>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
                <View po="absolute" asf="center">
                  <ICONS.PartyPopper width={64} height={64} />
                </View>
              </View>
                <View mv={32} ph={24}>
                    <Text ftsz={18} weight="600" ta="center">Congratulations on completing the {data?.careerTaster?.name} Virtual Experience Program by {data?.careerTaster?.employerName}!</Text>
                </View>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}
              mt={32}
              mb={16}
              mh={24}
              jc="center"
              ai="center"
              pv={16}
              bgc={"#000"}
              br={12}>
              <Text weight="500" ftsz={14} c={"#FFF"}>
                Download completion certificate
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default CareerTasterCompleted;
