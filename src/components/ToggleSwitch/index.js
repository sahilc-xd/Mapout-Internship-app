import React, { useEffect, useRef } from "react";
import { Animated, PanResponder, Platform } from "react-native";
import { TouchableOpacity, View } from "react-native-style-shorthand";

const ToggleSwitch = props => {
  const {
    isOn = false,
    onBgColor= "#D8E3FC",
    offBgColor="rgba(194, 194, 194, 0.65)",
    onColor = "#4772F4",
    offColor = "#7F8A8E",
    size = "large",
    toggle = false,
  } = props;

  const calculateDimensions = size => {
    switch (size) {
      case "small":
        return {
          width: 40,
          padding: 10,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22,
        };
      case "large":
        return {
          width: 70,
          padding: 20,
          circleWidth: 30,
          circleHeight: 30,
          translateX: 38,
        };
      default:
        return {
          width: 46,
          padding: 12,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 26,
        };
    }
  };
  let dimensions = calculateDimensions(size);
  let toValue;
  let offsetX = useRef(new Animated.Value(0))
  useEffect(()=>{
    if(isOn){
      toValue = dimensions.width - dimensions.translateX;
      Animated.timing(offsetX.current, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    else{
      toValue = 0;
      Animated.timing(offsetX.current, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  },[isOn])

  return (
    <View
      style={{
        borderWidth: 1,
        width: dimensions.width,
        backgroundColor: isOn ? onBgColor : offBgColor,
        borderRadius: dimensions?.circleWidth,
      }}>
      <Animated.View
        style={{
          width: dimensions?.circleWidth,
          height: dimensions?.circleHeight,
          backgroundColor: isOn ? onColor : offColor,
          borderRadius: dimensions?.circleHeight,
          transform: [{ translateX: offsetX.current }],
          marginHorizontal: 4,
          marginVertical: 2,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2.5,
          elevation: 1.5,
        }}>
        </Animated.View>
    </View>
  );
};

export default ToggleSwitch;
