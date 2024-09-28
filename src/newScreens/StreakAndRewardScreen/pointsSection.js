import React, { useEffect, useRef } from "react";
import { FlatList, ScrollView, View } from "react-native-style-shorthand";
import { Text } from "../../components";
import { ICONS } from "../../constants";
import { Animated } from "react-native";
import { useAppSelector } from "../../redux";

const PointsSections = () => {
  const inner = useRef(new Animated.Value(1));
  const user=useAppSelector(state=>state.user);
  const points = user?.PointsWallet;
  const dummyData = ["Complete a task everyday to earn points.", "Unlock points by logging in and maintaining a streak.", "Add profile picture and profile video.", "Complete 100% of your profile.", "Start posting on the Feed."]

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
    <View f={1}>
      <ScrollView contentContainerStyle={{paddingBottom: 32}}>
      <View jc="center" ai="center">
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
              transform: [{scale: inner.current}]
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
                  margin:12,
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
      <View mt={16} ai="center" f={1}>
        <View
          ai="center"
          jc="center"
          mh={16}
          pv={16}
          bgc={"rgba(255, 255, 255, 0.75)"}
          br={12}>
          <Text ftsz={16} weight="600">
            Your points: {points}
          </Text>
          <Text mt={4} mh={32} ta="center" ftsz={12} weight="400">
            {points > 0
              ? "Way to go! Keep completing tasks to gain more points everyday."
              : "Start completing tasks everyday to collect points."}
          </Text>
        </View>
        <Text ftsz={14} weight="400" mh={16} bgc={'#FFD439'} pv={8} ph={16} mt={16} br={20} ta="center">Redeem points for cool prizes coming soon!</Text>
        <Text mt={32} ftsz={16} weight="500">
            Tips to earn more points
        </Text>
        <View
            ph={16}
            mt={32}
            w={'100%'}>
            {
              dummyData?.map((item, index)=>{
                return(
                  <View key={index} fd="row" mb={4}>
                      <View mt={8} h={4} w={4} br={4} bgc={'#000'}/>
                      <Text ml={8} ftsz={12} weight="400">{item}</Text>
                  </View>
              )})
              
            }
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

export default PointsSections;
