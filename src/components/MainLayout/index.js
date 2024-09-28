import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native-style-shorthand';
import { useStatusBar } from '../../hooks/useStatusBar';
import { Platform } from 'react-native';


const MainLayout = ({bgColor = "#FFF", statusBar_bg = "#FFF", statusBar_bs= "dc", children})=>{
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    useStatusBar(statusBar_bg, statusBar_bs, isFocused);
    const devicePlatform = Platform?.OS === 'ios' ? "ios" : "android"

    return(
        <View f={1} w={'100%'} bgc={bgColor} pb={insets.bottom} mt={devicePlatform ==='ios'? 0 : insets.top} pt={devicePlatform ==='ios' ? insets.top : 0}>
            <View f={1}>
                {children}
            </View>
        </View>
        )
}

export default MainLayout