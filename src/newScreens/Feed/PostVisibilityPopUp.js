import React from 'react';
import { TouchableOpacity, View } from 'react-native-style-shorthand';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, withBottomSheet } from '../../components';
import Icon from "react-native-vector-icons/AntDesign";
import { postVisibilityCategory } from '../../utils/constants';

const PostVisibilityPopUp = (props) => { 
    const {updatePostVisibility = false, postVisibility} = props
    const { dismiss } = useBottomSheetModal();
    const onClose = () => dismiss();
    const insets = useSafeAreaInsets();

  return (
    <View f={1} pb={insets.bottom}>
        <TouchableOpacity mr={24} onPress={onClose} asf='flex-end' mt={24}>
            <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <Text ftsz={16} weight='500' ta='center'>Post Visibility</Text>
        <View mt={32} f={1} jc='center'>
        {
            postVisibilityCategory?.map((item, index)=>{
                return(
                    <TouchableOpacity key={index.toString()} onPress={()=>{
                        updatePostVisibility && updatePostVisibility(item?.name)
                        onClose();
                    }} f={1} ph={16} btw={0.5} fd='row' ai='center'>
                        <View>
                            <View bgc={postVisibility === item?.name ? '#000' : '#FFF'} h={16} w={16} br={8} bw={1}/>
                        </View>
                        <View f={1} ml={16}>
                        <Text ftsz={14} weight='500'>{item?.name}</Text>
                        <Text ftsz={12} weight='400'>{item?.desc}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        </View>
    </View>
  );
};

export default withBottomSheet(PostVisibilityPopUp);
