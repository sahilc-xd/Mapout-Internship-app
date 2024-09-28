import React from 'react';
import {TouchableOpacity, View} from 'react-native-style-shorthand';
import {Text, withBottomSheet} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Icon from "react-native-vector-icons/AntDesign";

const InformationPopUp = (props) => {
    const {info} = props;
    const { dismiss } = useBottomSheetModal();
    const onClose = () => dismiss();
    const onConfirm = () => {
        onClose();
    };
  return (
        <View f={1} ai="center" ph={24}>
            <View
                bgc={'#d9d9d9'}
                w={66}
                h={4}
                br={40}
                mt={8}
                style={{alignSelf: 'center'}}/>
                <TouchableOpacity onPress={onConfirm} po='absolute' r={16} t={16}>
                    <Icon name="close" size={18} color={"#202020"}/>
                </TouchableOpacity>
            <View f={1} jc='center'>
                <Text ftsz={12} ta='center' weight='500' mb={32}>{info}</Text>
                <TouchableOpacity onPress={onConfirm}>
                    <LinearGradient colors={["#5980FF","#A968FD"]} useAngle={true} angle={135} angleCenter={{x:0.5,y:0.5}} style={{alignItems: 'center', borderRadius: 10, marginHorizontal: 64}}>
                        <Text weight='700' ftsz={12} c={'#FFF'} pv={16}>
                            Continue
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
  );
};

export default withBottomSheet(InformationPopUp);
