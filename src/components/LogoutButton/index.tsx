import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-style-shorthand';

import {useAppDispatch} from '../../redux';
import {logout} from '../../redux/authSlice';
import Text from '../CustomText/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadCVButton = () => {
  const dispatch = useAppDispatch();

  const onPress = async() => {
    dispatch(logout());
    await AsyncStorage.setItem('notificationToken','')
  };

  return (
    <TouchableOpacity fd="row" ai="center" onPress={onPress}>
      <Icon name="logout" size={16} />
      <Text pl={5}>Logout</Text>
    </TouchableOpacity>
  );
};

export default UploadCVButton;
