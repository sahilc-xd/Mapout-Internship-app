import React, {useEffect} from "react"
import { Platform, StatusBar } from "react-native"

export const useStatusBar = (backGroundColor= "#000000", barStyle='lc', isFocus)=>{
    useEffect(()=>{
        if(isFocus){
            if(Platform.OS === 'ios'){
                StatusBar.setBarStyle(barStyle === 'lc' ? 'light-content' : 'dark-content');
            }
            else{
                StatusBar.setBackgroundColor(backGroundColor);
                StatusBar.setBarStyle(barStyle === 'lc' ? 'light-content' : 'dark-content');
                StatusBar.setTranslucent(true);
            }
        }
    },[isFocus])
}