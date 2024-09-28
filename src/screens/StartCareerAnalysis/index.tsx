import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from "react-native-vector-icons/AntDesign";
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, TouchableOpacity} from 'react-native-style-shorthand';

import {Text, Layout, withBottomSheet} from '../../components';

const SelectFlow = () => {
  const ref = useRef<any>();
  const insets = useSafeAreaInsets();
  const handleStart = () => ref.current?.present();

  return (
    <Layout
      topContainerHeightPercent={45}
      headerColor="#D0B9EC"
      headerImage={require('../../assets/images/career_path_analysis.png')}
      containerStyle={{ flex: 1, justifyContent: 'center' }}
    >
      <Text ph={40} pv={60} weight="400" lh={24.48} ftsz={16} c="white" ta="center">You have come to the right place, let's explore your career options!</Text>
      <TouchableOpacity
        h={44}
        mh={32}
        br={8}
        mt={30}
        jc="center"
        ai="center"
        bgc={"white"}
        onPress={handleStart}
        mb={insets.bottom + 30}
      >
        <Text weight="700" ftsz={14} c="#000" lh={34}>Start Career Path Analysis</Text>
      </TouchableOpacity>
      <ConfirmStart snapPoints={["45%"]} ref={ref} />
    </Layout>
  );
};

const ConfirmStart = withBottomSheet(() => {
  const {navigate} = useNavigation();
  const { dismiss } = useBottomSheetModal();
  const onClose = () => dismiss();
  const onConfirm = () => {
    onClose();
    navigate('StartPersonalityTest');
  };

  return (
    <View f={1} jc="center">
      <TouchableOpacity onPress={onClose} asf="flex-end" p={32} po="absolute" t={0}>
        <Icon name="close" size={18} />
      </TouchableOpacity>
      <Text p={40} ta="center" weight="500" lh={18}>
        The Career Path Analysis requires 10 mins of your undivided attention.{`\n\n`}
        There are no right or wrong answers, answer with what comes to you naturally.
      </Text>
      <TouchableOpacity
          h={44}
          mh={32}
          br={8}
          mt={30}
          jc="center"
          ai="center"
          bgc={"#000"}
          onPress={onConfirm}
        >
          <Text c={'white'} weight="700" ftsz={14} lh={34}>I'm ready</Text>
        </TouchableOpacity>
    </View>
  );
});

export default SelectFlow;
