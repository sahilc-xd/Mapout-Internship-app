import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux';
import { Image, Modal, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '..';
import { appLink, version_code, version_name } from '../../utils/config';
import { Linking, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const UpdatePopup=()=>{
    // updateType - 'soft' and 'hard'
    const { update_popup } = useAppSelector((state) => state.home);
    const [showPopup,setShowPopUp] = useState(false);
    const [updateType, setUpdateType] = useState(false);
    const versionInfo = Platform.OS === 'android' ? version_code : version_name;

    useEffect(()=>{
        if(update_popup?.hard_update?.enable && update_popup?.hard_update?.version?.includes(versionInfo)){
            setShowPopUp(true);
            setUpdateType('hard');
        }
        else if(update_popup?.soft_update?.enable && update_popup?.soft_update?.version?.includes(versionInfo)){
            setShowPopUp(true);
            setUpdateType('soft');
        }
    },[update_popup])

    const requestClose = ()=>{
        if(showPopup && updateType === 'soft'){
            setShowPopUp(false);
        }
    }

    const onPressUpdateNow = ()=>{
        Linking.openURL(appLink);
    }

    return(
        <>
        {showPopup && updateType && <Modal onRequestClose={requestClose} z={100} visible={true} transparent h={'100%'} w={'100%'}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
            <View f={1} ai='center'>
                <View f={1}/>
                <View h={40} w={'100%'} ph={16} btlr={35} btrr={35} bgc={'#FFF'} ai='center' bw={1} mb={-35}></View>
                <View z={2} ph={16} btlr={35} btrr={35} bgc={'#FFF'} ai='center' pb={32}>
                    <View pb={32}>
                        <View mt={8} w={80} h={4} br={8} bgc={'grey'}/>
                    </View>
                    <Image source={require('../../assets/images/UpdatePopup.gif')} style={{width:60, height: 60, position: 'absolute', left: 32, marginTop: 12, zIndex: 10, transform: [{ rotate: '255deg' }]}} resizeMode='contain'/>
                    <Text weight='500' ph={32} ftsz={16} mv={16} ta='center' c={'#000'}>A newer and better version is available. Please update the app for the best experience.</Text>
                    {updateType && <><View gap={8} mt={16} ph={16} fd='row' jc='space-around'>
                        {updateType === 'soft' && <TouchableOpacity onPress={()=>{
                            setShowPopUp(false);
                        }} p={8} f={2} bw={1} br={8} ai='center'>
                            <Text pv={4} weight='400' ftsz={12} c={'#000'}>
                                Cancel
                            </Text>
                        </TouchableOpacity>}
                        
                        <LinearGradient colors={["#5980FF", "#A968FD"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} style={{borderRadius: 8, padding: 8, flex:3 }}>
                            <TouchableOpacity onPress={onPressUpdateNow} bc={'#000'} ai='center'>
                                <Text pv={4} weight='700' ftsz={12} c={'#FFF'}>
                                    Update Now
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        
                    </View></>}
                </View>
            </View>
            </View>
        </Modal>}
        </>
    )
}

export default UpdatePopup;