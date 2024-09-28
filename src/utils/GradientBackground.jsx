import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet } from "react-native";

const GradientBackground = ({ colors, start, end, children }) => {
  return (
    <LinearGradient
      colors={["rgba(102, 145, 255, 0.65)", "rgba(217, 188, 255, 0.65)"]}
      start={{ x: 0.0164, y: 0 }}
      end={{ x: 0.9377, y: 0 }}
      style={styles.gradientBox}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
  },
});

export default GradientBackground;
