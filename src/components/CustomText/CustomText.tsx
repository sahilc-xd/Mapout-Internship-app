import React, {ReactNode} from 'react';
import {TextProps} from 'react-native/types';
import { Text } from "react-native-style-shorthand";
import {RFValue} from "react-native-responsive-fontsize";
import type { FC, SS } from 'react-native-style-shorthand';
import { useWindowDimensions } from 'react-native';

export type CustomTextProps = SS.Text &
  TextProps & {
    children: ReactNode;
    weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'light' | 'medium' | 'semi-bold' | 'bold' | 'extra-bold' ;
  };

const CustomText: FC<CustomTextProps> = ({ children, style, weight, ftsz, ...rest }) => {

  let fontSize = ftsz || style?.fontSize || 14;
  const deviceHeight = useWindowDimensions().height;
  let fontFamily = 'Manrope-Regular';
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

  if (fontSize) {
    fontSize = RFValue(fontSize, (deviceHeight-100));
  }

  // if (style?.fontSize) {
  //   style.fontSize = RFValue(style.fontSize, 640);
  // }

  return (
    <Text c="#000" style={[{fontFamily}, style]} ftsz={fontSize} {...rest} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default CustomText;
