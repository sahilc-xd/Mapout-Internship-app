import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native-style-shorthand';
import {Image as Img, useWindowDimensions} from 'react-native'
import { Text } from '../../../components';
import Icons from '../../../constants/icons';
import { navigate } from '../../../utils/navigationService';
import { api } from '../../../redux/api';
import { useAppSelector } from '../../../redux';
import { welcomeToCoachingThumbnail, welcomeToCoachingVideo } from '../../../utils/constants';
import logAnalyticsEvents from '../../../utils/logAnalyticsEvent';
import LinearGradient from 'react-native-linear-gradient';

const WelcomeToMapout = ()=>{
    
    const user = useAppSelector(state=>state?.user);
    const widthScreen = useWindowDimensions().width-48;
    const [imgHeight, setImgHeight] = useState(200);
    const [startStreak, {isSuccess, data}]= api.useLazyStartStreakQuery();
    const [getProfile, {}] =api.useLazyGetUserProfileQuery();

    const getImageHeight=()=>{
        Img.getSize(welcomeToCoachingThumbnail,(width, height)=>{
            setImgHeight(height * (widthScreen / width));
        });
    }

    const handleVideoOpened = () => {
        logAnalyticsEvents('viewed_welcome_to_coaching', {});
        startStreak({user_id: user?.user_id});
    }

    const clickPlay = ()=>{
        navigate("PlayVideoLink", {
            handleVideoOpened: handleVideoOpened,
            url: welcomeToCoachingVideo
          });
    }

    useEffect(()=>{
        getImageHeight();
    },[]);

    useEffect(()=>{
        if(isSuccess){
            getProfile(user?.user_id);
        }
    },[isSuccess])

    return(
        <View>
            <LinearGradient colors={["rgba(240, 245, 248, 1)", "rgba(255, 255, 255, 0)"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} useAngle={true} angle={180} angleCenter={{x:0.5,y:0.5}} style={{paddingLeft:16, paddingRight:24, paddingVertical: 12}}>
                <Text ftsz={16} weight='700'>
                Let’s start building your Softskills
                </Text>
            </LinearGradient>
            <Text mh={24} mb={8} ftsz={11} weight='500'>Learn how our coaching can help you!</Text>
            <View mh={24} jc='center'>
                <TouchableOpacity onPress={clickPlay} asf='center' po='absolute' z={1} br={50} bgc='rgba(0,0,0,0.4)'>
                    <Icons.PlayButton fill={'#000'}/>
                </TouchableOpacity>
                <Image br={12} resizeMode='contain' h={imgHeight} w={'100%'} source={{uri: welcomeToCoachingThumbnail}}/>
            </View>
        </View>
    )
}

export default WelcomeToMapout;