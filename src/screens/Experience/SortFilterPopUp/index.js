import React from 'react';
import { Text, withBottomSheet } from '../../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native-style-shorthand';
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

const SortFilterPopUp = (props)=>{

    const { dismiss } = useBottomSheetModal();
    const onClose = () => dismiss();
    const onConfirm = () => {
        onClose();
    };
    const { setSort=false, sort = 'new' } = props;
    const insets = useSafeAreaInsets();

    const updateSort=(sortBasedOn)=>{
        setSort && setSort(sortBasedOn);
        onConfirm();
    }

    return(
        <View f={1} pb={insets.bottom}>
            <View bgc={'#d9d9d9'} w={66} h={4} br={40} mt={8} style={{ alignSelf: 'center' }} />
            <TouchableOpacity onPress={onConfirm} po='absolute' r={16} t={16}>
                <Icon name="close" size={18} color={"#202020"} />
            </TouchableOpacity>
            <View f={1} mt={32}>
                <Text mb={8} mh={16} ftsz={14} weight='500'>Sort by</Text>
                <View h={StyleSheet.hairlineWidth} bgc={"#8E8E8E"} mv={8}/>
                <TouchableOpacity onPress={()=>{
                    updateSort('new');
                }}>
                <Text weight={sort == 'new' ? '600' : '400'} mh={16} ftsz={14}>
                    Latest Jobs
                </Text>
                </TouchableOpacity>
                <View h={StyleSheet.hairlineWidth} bgc={"#8E8E8E"} mv={8}/>
                <TouchableOpacity onPress={()=>{
                    updateSort('score');
                }}>
                <Text mh={16} weight={sort == 'score' ? '600' : '400'} ftsz={14}>
                    Employability Score: High to Low
                </Text>
                </TouchableOpacity>
                <View h={StyleSheet.hairlineWidth} bgc={"#8E8E8E"} mv={8}/>
            </View>
        </View>
    )
}

export default withBottomSheet(SortFilterPopUp);