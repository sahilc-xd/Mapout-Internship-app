import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, TouchableOpacity, Image} from 'react-native-style-shorthand';

import {Text, Layout} from '../../components';

const SelectFlow = () => {
  const {navigate} = useNavigation();
  const insets = useSafeAreaInsets();

  const renderHeader = () => (
    <View ph={16} f={1} pt={insets.top}>
      <View pb={12} fd="row" ai="center" jc="space-between">
        <Text weight="500" ftsz={14}>Step 03</Text>
        <View gap={12} fd="row">
          <View h={8} w={8} br={8} bgc="#8E8E8E"/>
          <View h={8} w={8} br={8} bgc="#8E8E8E" />
          <View h={8} w={8} br={8} bgc="white" />
        </View>
      </View>
      <Text weight="500" ftsz={18} lh={24}>Your Background</Text>
      <Text weight="400" ftsz={12} lh={18} pt={8}>Lastly, tell us a little more about yourself so we make it all about you!</Text>
    </View>
  );

  const onPressStart = () => {
    navigate('CreateProfile' as never);
  };

  return (
    <Layout
      renderHeader={renderHeader}
      topContainerHeightPercent={40}
      headerColor="#754DA4"
      backgroundColor="#FFFFFF"
      containerStyle={{ flex: 1, justifyContent: 'center', gap: 40 }}
    >
      <Image source={require("../../assets/images/backgroundTest.png")} asf="center" />
      <TouchableOpacity
          h={44}
          mh={32}
          br={8}
          mt={30}
          jc="center"
          ai="center"
          bgc={"#000"}
          onPress={onPressStart}
        >
          <Text c={'white'} weight="700" ftsz={14} lh={34}>Start Assessment</Text>
        </TouchableOpacity>
    </Layout>
  );
};

export default SelectFlow;
