import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native-style-shorthand';
import Icon from 'react-native-vector-icons/AntDesign';

import {Text} from '../../components';
import AddSocialMediaLinkModal from './AddSocialMediaLinkModal';
import { ICONS } from '../../constants';


const SocialMediaLinks = ({links=[], onSaveLink}) => {
  const [linkType, setLinkType] = useState(''); // ['instagram', 'twitter', 'linkedin', 'other']
  const [modalVisible, setModalVisible] = useState(false);
  const [savedLinks, setSavedLinks]= useState({});

  useEffect(()=>{
    if(links?.length>0){
      let savedLinksObj = {}
      links?.forEach((item)=>{
        savedLinksObj[item?.type] = item?.link;
      })
      setSavedLinks(savedLinksObj)
    }
  },[links])

  const onPressAddMedia = (type: string) => () => {
    setLinkType(type);
    setModalVisible(true);
  };

  const onSave = (link: string) => {
    onSaveLink({
      type: linkType,
      link,
    });
    setModalVisible(false);
  };

  const onClose = () => {
    setModalVisible(false);
  };

  return (
    <View fd="row" ai="center" gap={7}>
      <Text ftsz={12} weight='500'>Add social media</Text>
      <View fd="row" gap={7}>
        <TouchableOpacity onPress={onPressAddMedia('instagram')} p={7} br={4} bw={0.4}>
          {savedLinks["instagram"] ? <ICONS.Instagram width={18} height={18}/> : <Icon name="instagram" size={18} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAddMedia('twitter')} p={7} br={4} bw={0.4}>
          {savedLinks["twitter"] ? <ICONS.Twitter width={18} height={18}/> : <ICONS.TwitterLogo width={18} height={18}/>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAddMedia('linkedin')} p={7} br={4} bw={0.4}>
        {savedLinks["linkedin"] ? <ICONS.LinkedInIcon width={18} height={18}/> : <Icon name="linkedin-square" size={18} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAddMedia('other')} p={7} br={4} bw={0.4}>
        {savedLinks["other"] ? <Icon name="plus" size={18}  color={'#000'}/> : <Icon name="plus" size={18} />}
        </TouchableOpacity>
      </View>
      <AddSocialMediaLinkModal savedLinks={savedLinks} isVisible={modalVisible} onClose={onClose} onSave={onSave} linkType={linkType} />
    </View>
  );
};

export default SocialMediaLinks;
