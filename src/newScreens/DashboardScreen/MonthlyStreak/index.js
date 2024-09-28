import React from 'react';
import { TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../utils/navigationService';
import { useAppSelector } from '../../../redux';

const MonthlyStreak = ()=>{

    const user = useAppSelector(state=>state.user);
    const streakDay = user?.taskDetails?.dailyStreakCount <= -1 ? 0 : user?.taskDetails?.dailyStreakCount;
    
    return(
        <TouchableOpacity onPress={()=>{
            navigate('StreakAndRewardScreen');
        }} mh={24} bgc={'#FFFFFFBF'} bw={1} bc={'#FFFFFF'} ph={16} pv={16} br={20} fd='row' ai='center'>
            <LinearGradient colors={["#FAC540", "#FF8C6B" ]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} useAngle={true} angle={270} angleCenter={{x:0.5,y:0.5}} style={{ zIndex: 1, borderRadius: 70, marginVertical: 4, width: 90, height: 90, justifyContent: 'center', alignItems: 'center', marginRight: 12}}>
                <View w={78} h={78} bgc={'#FFF'} br={60} jc='center' ai='center'>
                    <Text c={'#FF8C6B'} ftsz={24} weight='600'>
                        {streakDay}
                    </Text>
                    <Text c={'#FF8C6B'} ftsz={12} weight='500'>
                        {streakDay>1 ? 'days' : 'day'}
                    </Text>
                </View>
            </LinearGradient>
            <View f={1}>
                <Text mb={8} ftsz={16} weight='500' c={'#17171F'}>
                    Current streak
                </Text>
                <Text ftsz={12} weight='400' c={'#17171F80'}>
                    {streakDay === 0? "Start completing tasks everyday to collect cool rewards." : "Great job! Keep completing tasks everyday to collect cool rewards."}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default MonthlyStreak;