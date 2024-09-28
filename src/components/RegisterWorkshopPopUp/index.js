import React, { useEffect, useState } from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native-style-shorthand';
import {Text, withBottomSheet} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { BottomSheetTextInput, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useAppSelector } from '../../redux';
import { api } from '../../redux/api';
import Icon from "react-native-vector-icons/AntDesign";

const RegisterWorkshopPopUp = (props) => {
    const {selectedId=false, refreshWorkshops=false} = props;
    const user = useAppSelector(state => state.user);
    const [registerForWorkshop, {data, isSuccess, isLoading}] = api.useRegisterForWorkshopMutation();
    const { dismiss } = useBottomSheetModal();
    const onClose = () => dismiss();
    const [email, setEmail] = useState(user?.email || false);
    
    useEffect(()=>{
        if(isSuccess){
            dismiss();
            refreshWorkshops && refreshWorkshops();
        }
    },[isSuccess])

    const handleConfirm=()=>{
        if(email && selectedId){
        registerForWorkshop({userId: user?.user_id, workshopId: selectedId, email: email});
        }
    }
  return (
        <View f={1} ai="center" ph={24}>
            <View
                bgc={'#d9d9d9'}
                w={66}
                h={4}
                br={40}
                mt={8}
                style={{alignSelf: 'center'}}/>
                <TouchableOpacity onPress={onClose} po='absolute' r={16} t={16}>
                    <Icon name="close" size={18} color={"#202020"}/>
                </TouchableOpacity>
            <View f={1} jc='center' w={'100%'} >
                <Text ftsz={12} weight='400' mb={8}>Please confirm your email address*:</Text>
                <BottomSheetTextInput placeholder="Enter email"
                placeholderTextColor={'#000'}
                    onChangeText={setEmail}
                    value={email}
                    textContentType="emailAddress"
                    style={{
                            // alignSelf: "stretch",
                            // marginHorizontal: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            borderRadius: 4,
                            backgroundColor: "#BDD4FF",
                            color: "#000",
                            textAlign: "center"}} 
                    />
                    <TouchableOpacity bgc={'#000'} ai='center' br={8} mt={8} onPress={handleConfirm}>
                        {isLoading ? <ActivityIndicator pv={16} color={'#FFF'}/> :<Text ftsz={12} weight='700' c={'#FFF'} pv={16}>Confirm</Text>}
                    </TouchableOpacity>
            </View>
        </View>
  );
};

export default withBottomSheet(RegisterWorkshopPopUp);
