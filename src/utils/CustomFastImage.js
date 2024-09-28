import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

const CustomFastImage = ({ source, style, ...restProps }) => {

  const defaultStyle = {
    width: 52, 
    height: 52,  
    borderRadius: 52,
  };

  return (
    <View>
      <FastImage source={source} {...restProps} style={{...defaultStyle}} resizeMode={'cover'} />
    </View>
  );
};

export default CustomFastImage;
