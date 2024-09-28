import React, { useRef } from 'react';
import { View } from 'react-native';
import MessageBubble from "./MessageBubble";
import { FlatList } from 'react-native-style-shorthand';

const ConversationsMessages = ({ identity, messages }) => {
  const messagesRef = useRef();
  const renderMessage = ({ item, index }) => {
    if(item?.author === identity) {
      return <MessageBubble key={item?.index} direction="outgoing" message={item} />;
    } else {
      return <MessageBubble key={item?.index} direction="incoming" message={item} />;
    }
  }
  // console.log(messages)

  return(
    <View style={{ flex:1 }}>
      <FlatList 
        ref={messagesRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        // onContentSizeChange={messagesRef?.current?.scrollToEnd()}
        // onLayout={messagesRef?.current?.scrollToEnd()}
      />
    </View>
  )
}

export default ConversationsMessages;