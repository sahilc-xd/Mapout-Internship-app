import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "..";
import { ICONS } from "../../constants";
import { Animated } from "react-native";

const RewardPointModal = () => {
  const [showModal, setShowModal] = useState(false);
  const points = 10;
  const inner = useRef(new Animated.Value(0));

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(inner.current, {
          toValue: 16,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(inner.current, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Modal onRequestClose={closeModal} animationType="fade" transparent visible={showModal}>
      <View bgc={"rgba(0,0,0,0.3)"} f={1}>
      <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1}/>
        <ImageBackground
          source={require("./RewardBackground.png")}
          resizeMode="stretch"
          >
          <Image
            source={require("../../assets/gifs/Confetti.gif")}
            style={{ width: "100%", position: "absolute", height: 400 }}
            resizeMode="stretch"
          />
          <Animated.View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 16,
              height: 150,
              marginTop: 32,
            }}>
            <Animated.View
              style={{
                backgroundColor: "#FFFFFF40",
                padding: inner.current,
                borderRadius: 100,
              }}>
              <Animated.View
                style={{
                  backgroundColor: "#FFFFFF59",
                  padding: inner.current,
                  borderRadius: 100,
                }}>
                <Animated.View
                  style={{
                    backgroundColor: "#FFFFFF73",
                    padding: inner.current,
                    borderRadius: 100,
                  }}>
                  <ICONS.Trophy
                    style={{
                      margin: 8,
                      backgroundColor: "#FFFFFF73",
                      borderRadius: 100,
                    }}
                    width={64}
                    height={64}
                  />
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </Animated.View>
          <View
            mv={8}
            bgc={"#FFF8DE"}
            ph={32}
            pv={16}
            bw={2}
            bc={"#FFD439"}
            br={12}
            asf="center">
            <Text ftsz={16} weight="600">+{points} points</Text>
          </View>
          <View
            mh={64}
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
              You earned 10 points for adding profile picture.
            </Text>
          </View>
          <TouchableOpacity
            onPress={closeModal}
            mt={32}
            mb={16}
            mh={32}
            jc="center"
            ai="center"
            bgc={"#000"}
            br={12}>
            <Text weight="400" ftsz={14} c={"#FFF"} pv={16}>
              Collect
            </Text>
          </TouchableOpacity>
        </ImageBackground>
        </View>
    </Modal>
  );
};

export default RewardPointModal;
