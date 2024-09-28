import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../utils/navigationService';

const NotificationModal = (props) => {
    const {showModal=false, closeModal=false, data={}} = props;

    return(
        <Modal visible={showModal} onRequestClose={()=>{
            closeModal && closeModal();
          }} transparent={true}>
            <View f={1} bgc={'rgba(255, 255, 255, 0.9)'} jc='center'>
              <View bgc={'#FFF'} mh={32} ph={16} pv={32} jc='center' ai='center' bw={3} bc={'rgb(220, 220, 240)'} br={20}>
                {data?.popup?.title && <Text c={'#000'} weight='600' ftsz={20}>
                  {data?.popup?.title}
                </Text>}
                {data?.popup?.description && <Text mt={32} c={'#000'} weight='400' ftsz={16}>
                  {data?.popup?.description}
                </Text>}
                {data?.popup?.buttonText && <TouchableOpacity onPress={()=>{
                    data?.navigateTo?.length>0 ? navigate(data?.navigateTo) : (closeModal && closeModal()) 
                }}>
                  <LinearGradient colors={["#5980FF", "#A968FD"]} start={{ x: 0, y: 0}} end={{ x: 1, y: 1}} style={{borderRadius: 8, paddingVertical: 12, marginTop: 32}}>
                    <Text ftsz={12} weight='700' c={"#fff"} ta="center" ph={32}>{data?.popup?.buttonText}</Text>
                  </LinearGradient>
                </TouchableOpacity>}
              </View>
            </View>
          </Modal>
    )
}

export default NotificationModal;