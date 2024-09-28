import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-style-shorthand";
import { IMAGES } from "../../constants";

const TestLayout = ({ headerColor, type, containerStyle, children }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View f={1}>
      <View
        h={"16.75%"}
        // jc="center"
        // ai="center"
        bgc={headerColor}>
        {type === "MBTI" ? (
          <IMAGES.CareerTestResultHeaderFirstImg
            // height={"100%"}
            width={"100%"}
          />
        ) : (
          <IMAGES.CareerTestResultHeaderSecondImg
            height={"100%"}
            width={"100%"}
          />
        )}
      </View>
      <View h={"83.25%"}>
        <View f={1} bgc={"black"} style={containerStyle ?? {}}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default TestLayout;
