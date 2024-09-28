import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import Icon from "react-native-vector-icons/AntDesign";

const ScoreDescriptionModal = (props)=>{
    const showModal = props?.showModal;
    const closeModal = props?.closeModal;
    const modalData = props?.modalData;
    
    return(
        <Modal onRequestClose={closeModal} animationType='fade' transparent visible={showModal}>
            <View bgc={"rgba(0,0,0,0.3)"} f={1}>
            <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1}/>
            <View ph={16} btrr={24} btlr={24} bgc={'#FFF'} pv={24}>
            <TouchableOpacity asf='flex-end' onPress={closeModal}>
                <Icon name="close" size={18} color={"#000"} />
            </TouchableOpacity>
                <Text weight='500' ftsz={16}>{modalData?.name}</Text>
                <Text mt={8} weight='400' ftsz={16}>{modalData?.text}</Text>
            </View>
            </View>
        </Modal>
    )
}

export default ScoreDescriptionModal;