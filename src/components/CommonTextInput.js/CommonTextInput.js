import React from "react";
import { TextInput } from "react-native-style-shorthand";
import styles from "./Styled.CommonTextInput";

const CommonTextInput = ({ style, ...rest }) => {
  const mergedStyle = style ? [styles.inputStyle, style] : styles.inputStyle;

  return (
    <TextInput style={mergedStyle} placeholderTextColor={'#8E8E8E'} {...rest} />
  );
};

export default CommonTextInput;
