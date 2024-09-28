import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import styles from "./otpInput.style";
import { TextInput } from "..";

const OtpInput = ({ otp: otpValue, handleOtpInputChange }) => {
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, []);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent : "space-between"}}>
        {Array.from({ length: 6 }, (_, index) => (
          <TextInput
            key={index}
            style={styles.inputStyle}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value =>
              handleOtpInputChange(value, index, otpInputRefs)
            }
            value={(otpValue && otpValue.length > 0 && otpValue[index]) || ""}
            ref={ref => (otpInputRefs.current[index] = ref)}
          />
        ))}
      </View>
    </View>
  );
};

export default OtpInput;
