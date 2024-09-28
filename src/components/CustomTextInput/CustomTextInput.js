import React from 'react';
import { TextInput } from "react-native-style-shorthand";
import {RFValue} from "react-native-responsive-fontsize";
import { useWindowDimensions } from 'react-native';

const CustomTextInput = ({ children, style, weight, ftsz, ftf,  ...rest }) => {

  let fontSize = ftsz || style?.fontSize || 14;
  const deviceHeight = useWindowDimensions().height;
  let fontFamily = ftf || style?.fontFamily || 'Manrope-Regular';
  let fontWeight = weight || style?.fontWeight || 400;
  if (fontWeight ===  '300' || fontWeight ===  '200' ||  fontWeight ===  '100' || fontWeight === 'light')  {
    fontFamily = 'Manrope-Light';
  } else if (fontWeight ===  '400')  {
    fontFamily = 'Manrope-Regular';
  } else if (fontWeight ===  '500' || fontWeight === 'medium')  {
    fontFamily = 'Manrope-Medium';
  } else if (fontWeight ===  '600' || fontWeight === 'semi-bold')  {
    fontFamily = 'Manrope-SemiBold';
  } else if (fontWeight ===  '700' || fontWeight === 'bold')  {
    fontFamily = 'Manrope-Bold';
  } else if (fontWeight ===  '800' || fontWeight ===  '900' || fontWeight === 'extra-bold')  {
    fontFamily = 'Manrope-ExtraBold';
  }

  const {fontFamily : a, fontSize : b, fontWeight: c, ...rest1} = style || {};
  const updatedStyle = {...rest1};

  if (fontSize) {
    fontSize = RFValue(fontSize, (deviceHeight-100));
  }

  return (
    <TextInput c="#000" style={updatedStyle} ftf={fontFamily} ftsz={fontSize} {...rest} allowFontScaling={false}>
      {children}
    </TextInput>
  );
};

export default CustomTextInput;
