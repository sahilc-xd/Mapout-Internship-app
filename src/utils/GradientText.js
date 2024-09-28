import React from 'react';
import MaskedView from'@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../components';

export default GradientText = (props) => {
    const {colors= ["#A968FD", "#5980FF"], ...rest} = props;
    const props1 = rest;
    return (
      <MaskedView maskElement={<Text {...props1} />}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text {...props1} style={[props1.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };