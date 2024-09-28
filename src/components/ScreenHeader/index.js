import React from 'react';
import { TouchableOpacity, View } from 'react-native-style-shorthand';
import CustomText from '../CustomText/CustomText';
import { ICONS } from '../../constants';

const ScreenHeader=(props)=>{
    const {title, subTitle, onPressInformationIcon=false} = props;
    return(
        <View>
            <View fd='row' ai='center' jc='space-between'>
                <CustomText ftsz={26} weight='700' style={{ color: '#FFFFFF'}}>{title}</CustomText>
                <TouchableOpacity onPress={()=>{
                    onPressInformationIcon && onPressInformationIcon();
                }}>
                    <ICONS.Info width={24} height={24} fill={'#EDEDED'}/>
                </TouchableOpacity>
            </View>
            <CustomText weight='500' ftsz={12} style={{ color: '#FFFFFF', fontStyle:'italic'}}>{subTitle}</CustomText>
        </View>
    )
}

export default ScreenHeader