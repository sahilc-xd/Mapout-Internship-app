import React, { useRef, useState } from 'react';
import {BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, TouchableOpacity} from 'react-native-style-shorthand';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

import withBottomSheet from '../BottomSheet';
import Text from '../CustomText/CustomText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ConfirmBack = withBottomSheet((props) => {
  const {showOnlyExitMsg = false} = props;
  const { dismiss } = useBottomSheetModal();
  const onClose = () => {
    dismiss();
  };

  const insets = useSafeAreaInsets();

  return (
    <View f={1} pt={32} pb={insets.bottom}>
      <TouchableOpacity onPress={onClose} asf="flex-end" pr={32} t={0}>
        <Icon name="close" size={18} />
      </TouchableOpacity>
      <View f={1} jc='center'>
        <Text ph={40} ta="center" weight="500" lh={18} ftsz={14}>
          Are you sure you want to quit?{`\n\n`}
          {showOnlyExitMsg ? `` : `Your progress will be lost and you'll have to start again. We're collecting this information to provide you with the best-fit answers.`}
        </Text>
      </View>
    </View>
  );
});


const BackButtonHandler = ({ exitOnBack, showOnlyExitMsg=false }) => {
  const ref = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const { dismiss } = useBottomSheetModal();

  useFocusEffect(
    React.useCallback(() => {
      const onPress = () => {
        if (!isOpen) {
          setIsOpen(true);
          ref?.current?.present();
          return true;
        } else {
          dismiss();
          if (exitOnBack) {
            BackHandler.exitApp();
            return true;
          }
          return false;
        }
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onPress);
      return () => subscription.remove();
    }, [isOpen])
  );

  return (
    <ConfirmBack snapPoints={["33%"]} ref={ref} onCloseBottomSheet={() => setIsOpen(false)} showOnlyExitMsg={showOnlyExitMsg}/>
  );
};

export default BackButtonHandler;
