import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native-style-shorthand';
import Modal from "react-native-modal";

import {Text} from '../../components';
import CommonTextInput from '../../components/CommonTextInput.js/CommonTextInput';

const PersonaliseFeedModal = ({savedLinks, isVisible, onClose, onSave, linkType}: any) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    if (linkType === 'instagram') {
      setLink(savedLinks["instagram"] || 'https://www.instagram.com/');
    }
    if (linkType === 'twitter') {
      setLink(savedLinks["twitter"] || 'https://www.twitter.com/');
    }
    if (linkType === 'linkedin') {
      setLink(savedLinks["linkedin"] || 'https://www.linkedin.com/');
    }
    if (linkType === 'other') {
      setLink(savedLinks["other"] || 'https://');
    }
  }, [linkType]);

  const onSaveLink = () => {
    onSave(link);
  };

  return (
    <Modal isVisible={isVisible} avoidKeyboard>
      <ScrollView fg={0} keyboardShouldPersistTaps="handled" bgc="white" mh={10} br={20} p={25}>
        <View fd="row" jc="space-between" ai="center">
          <Text ftsz={13} weight="700" lh={21}>Add Link</Text>
          <TouchableOpacity onPress={onClose}>
            <Text ftsz={11} weight="700" lh={21} c={"#8E8E8E"}>Close</Text>
          </TouchableOpacity>
        </View>
        <CommonTextInput
          autoFocus
          autoComplete="off"
          value={link}
          onChangeText={setLink}
          placeholder="https://www.instagram.com/example"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={onSaveLink}
          style={styles.button}
        >
          <Text ftsz={12} weight="700" c="white">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily: 'RedHatDisplay-Regular',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default PersonaliseFeedModal;
