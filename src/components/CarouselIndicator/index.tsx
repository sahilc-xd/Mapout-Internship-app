import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {View, StyleSheet} from 'react-native-style-shorthand';

interface CarouselIndicatorProps {
  length: number;
  activeIndicatorWidth?: number;
  animValue: Animated.SharedValue<number>;
}

interface DotProps {
  index: number;
  length: number;
  activeIndicatorWidth: number;
  animValue: Animated.SharedValue<number>;
}

const Dot = ({index, animValue, length, activeIndicatorWidth}: DotProps) => {
  const width = 26;
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [width, activeIndicatorWidth, width];
    let outputRange2 = [
      '#8E8E8E',
      '#FFFFFF',
      '#8E8E8E',
    ];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
    }

    return {
      width: interpolate(
        animValue?.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP,
      ),
      backgroundColor: interpolateColor(
        animValue?.value,
        inputRange,
        outputRange2,
        'HSV',
      ),
    };
  }, [animValue, index, length]);

  return <Animated.View style={[styles.dot, animStyle]} />;
};

const CarouselIndicator = ({
  length,
  animValue,
  activeIndicatorWidth,
}: CarouselIndicatorProps) => {
  return (
    <View fd="row" ai="center">
      {Array.from({length}, (_, i) => (
        <Dot
          key={i}
          index={i}
          length={length}
          animValue={animValue}
          activeIndicatorWidth={activeIndicatorWidth || 46}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 4,
    width: 26,
    marginRight: 8,
    borderRadius: 20,
  },
});

export default CarouselIndicator;
