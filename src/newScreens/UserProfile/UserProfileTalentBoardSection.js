import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import { navigate } from '../../utils/navigationService';



const UserProfileTalentBoardSection=(props)=>{
    const {data={}} = props;
    const talentboardData = data?.talentBoard?.projects;
    const screenWidth = useWindowDimensions().width-32-32;

    return(
        <View pv={16} ph={16} gap={16} fw='wrap' fd='row' ai='center'>
            {
                talentboardData?.length>0 ?  talentboardData?.map((item, index)=>{
                    return(
                        <TouchableOpacity onPress={()=> navigate('TalentBoardProject', { data: item, talentBoardID: data?.talentBoard?.talentBoardID, hideButtons: true })} key={index.toString()} w={screenWidth/3} h={screenWidth/3}>
                            <Image source={{uri: item?.coverImgUrls?.[0]?.url}} w={'100%'} h={'100%'}/>
                            <View pv={2} bgc={'rgba(0, 0, 0, 0.25)'} w={'100%'} po='absolute' b={0}>
                                <Text numberOfLines={1} ftsz={12} weight='400' c={'#FFF'}> {item?.name} </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }) : <View bgc={'rgba(217, 217, 217, 0.65)'} w={'100%'} ai='center' jc='center' pv={16} br={12} asf='center'>
                    <Text ftsz={14} weight='600'>No projects to show yet.</Text>
                </View>
            }
        </View>
    )
}

export default UserProfileTalentBoardSection;