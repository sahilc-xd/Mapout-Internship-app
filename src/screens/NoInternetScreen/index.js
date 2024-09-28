import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStatusBar } from '../../hooks/useStatusBar';
import { useIsFocused } from '@react-navigation/native';
import { fetch } from "@react-native-community/netinfo";
import { useDispatch } from 'react-redux';

const NoInternetScreen = ()=>{
    const insets= useSafeAreaInsets()
    const isFocused = useIsFocused();
    useStatusBar('#FFF', 'dc', isFocused);

    const dispatch = useDispatch();

    const onPressRefresh=()=>{
        fetch().then(state => {
            if(state.isConnected || state.isInternetReachable){
                dispatch()
            }
          });
    }

    

    return(
        <View f={1} bgc={'#FFF'}>
            <View h={insets.top}/>
            <View f={1} jc='center' ai='center'>
                <Image source={require('../../assets/images/internet_off.png')} style={{width: 220, height: 220}} resizeMode='contain'/>
                <Text weight='600' ftsz={18} mt={32}>
                    Slow or no internet connection
                </Text>
                <Text weight='400' ftsz={14}>
                    Check your internet connection
                </Text>
                <TouchableOpacity onPress={onPressRefresh} bgc={'#000'} br={8} mt={32}>
                    <Text c={'#FFF'} weight='600' ftsz={12} ph={32} pv={12}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
            <View h={insets.bottom}/>
        </View>
    )
}

export default NoInternetScreen;