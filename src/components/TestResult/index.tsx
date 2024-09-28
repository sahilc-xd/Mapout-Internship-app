import React from "react";

import { TouchableOpacity, View } from "react-native-style-shorthand";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TestLayout from "../Layout/testLayout";
import { COLORS } from "../../theme";
import { ICONS } from "../../constants";
import { Text } from "../../components";

const CareerTestResult = ({ onPressNext, resultData }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <TestLayout
      headerColor={COLORS.white}
      type={resultData.type}>
      <View
        bgc={COLORS.white}
        pv={"12%"}
        ph={"8.5%"}
        jc="center"
        ai="center"
        gap={20}
        bbrr={50}
        bblr={50}
        btrr={50}>
        <Text weight="600" lh={27.54} ftsz={18} c={COLORS.black}>
          {resultData.firstHeading}
        </Text>
        <View jc="center" ai="center">
          <Text weight="700" lh={27.81} ftsz={17} c={COLORS.black}>
            {resultData.secondHeading}
          </Text>
          <Text weight="700" lh={21.63} ftsz={14} c={COLORS.black}>
            {resultData.secondSubHeading}
          </Text>
        </View>
        <Text weight="400" ftsz={14} c={COLORS.black} ta="center" lh={21.63}>
          {resultData.content}
        </Text>
      </View>
      {resultData.type === "HOLLAND" && (
        <Text
          weight="500"
          ftsz={16}
          lh={21.92}
          c={COLORS.white}
          ta="center"
          mt={20}
          ph={"10%"}>
          Now, you're just two steps away from finding your ideal careers!
        </Text>
      )}
      {resultData.type === "HOLLAND" ? (
        <TouchableOpacity
          w={"90%"}
          h={40}
          br={8}
          mt={24}
          jc="center"
          ai="center"
          asf="center"
          onPress={onPressNext}
          mb={insets.bottom + 30}
          bgc={COLORS.white}>
          <Text weight="700" lh={34} ftsz={14} c={COLORS.black}>
            Next
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          w={40}
          h={40}
          br={40}
          mt={24}
          jc="center"
          ai="center"
          asf="center"
          onPress={onPressNext}
          mb={insets.bottom + 30}
          bgc={COLORS.white}>
          <ICONS.RightIcon color={"black"} />
        </TouchableOpacity>
      )}
    </TestLayout>
  );
};

export default CareerTestResult;
