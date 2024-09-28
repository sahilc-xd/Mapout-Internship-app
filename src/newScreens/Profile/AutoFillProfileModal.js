import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native-style-shorthand';
import Icon from "react-native-vector-icons/AntDesign";
import { Text } from '../../components';

const AutoFillProfileModal = (props)=>{
    const {showModal, closeModal, onUploadFile} = props;
    const [step, setStep] = useState(1);

    const handleCloseModal = ()=>{
        setStep(1);
        closeModal();
    }
    return(
        <Modal visible={showModal} transparent>
            <View bgc={"rgba(0,0,0,0.3)"} f={1}>
            <TouchableOpacity activeOpacity={1} onPress={handleCloseModal} f={1} />
            <View bgc={'#FFF'} ph={24} pv={32} btrr={32} btlr={32}>
                {step === 1 && <>
                    <TouchableOpacity onPress={handleCloseModal} asf='flex-end'>
                        <Icon name="close" size={18} color={"#202020"}/>
                    </TouchableOpacity>
                    <Text ta='center' ftsz={16} weight='500'>Autofill with CV</Text>
                    <View ai='center' mv={32}>
                        <Text ftsz={14} weight='500'>Upload your latest CV</Text>
                        <Text c={'#7F8A8E'} weight='400' ftsz={12}>Suitable formats: PDF. No more than 10mb</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{
                        setStep(2);
                    }} jc='center' ai='center' br={12} bgc={'#000'} pv={16}>
                        <Text ftsz={12} weight='500' c={'#FFF'}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </>}
                {step === 2 && <>
                    <TouchableOpacity onPress={handleCloseModal} asf='flex-end'>
                        <Icon name="close" size={18} color={"#202020"}/>
                    </TouchableOpacity>
                    <Text ta='center' ftsz={16} weight='500'>Autofill with CV</Text>
                    <View ai='center' mv={32}>
                        <Text ta='center' ftsz={14} weight='400'>Your profile will be overwritten with new data from your CV. Are you sure you want to continue?</Text>
                        <Text mt={8} ta='center' weight='400' ftsz={14}>Are you sure you want to continue?</Text>
                    </View>
                    <View fd='row' ai='center' gap={16}>
                        <TouchableOpacity f={1} onPress={()=>{
                            handleCloseModal();
                        }} jc='center' ai='center' br={12} bgc={'#D8E3FC'} pv={16}>
                            <Text ftsz={12} weight='500' c={'#000'}>
                                No
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity f={1} onPress={()=>{
                            onUploadFile();
                        }} jc='center' ai='center' br={12} bgc={'#000'} pv={16}>
                            <Text ftsz={12} weight='500' c={'#FFF'}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>}
            </View>
            </View>
        </Modal>
    )
}

export default AutoFillProfileModal;