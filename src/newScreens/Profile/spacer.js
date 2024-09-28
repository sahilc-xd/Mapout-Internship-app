import React from 'react'
import { View } from 'react-native-style-shorthand';

const Spacer = () => {
    return(
        <View fd="row" mh={48} jc="space-between">
            <View h={16} w={4} bgc={"#FFF"} />
            <View h={16} w={4} bgc={"#FFF"} />
        </View>
    )
}

export default Spacer;