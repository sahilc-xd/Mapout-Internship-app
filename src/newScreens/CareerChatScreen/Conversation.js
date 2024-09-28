import React, { useCallback, useEffect, useRef, useState } from 'react';
import ConversationsMessages from './ConversationsMessages';
import { KeyboardAvoidingView, View, TouchableOpacity, ActivityIndicator } from 'react-native-style-shorthand';
import PropTypes from "prop-types";
import { Platform } from 'react-native';
import { ICONS } from '../../constants';
import { TextInput } from '../../components';

const Conversation = ({ myIdentity, conversationProxy }) => {
    const [loadingState, setLoadingState] = useState('initializing');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [cp, setCP] = useState(conversationProxy);
    const [bc, setBC] = useState(new Set());

    const loadMessagesFor = useCallback((thisConversation) => {
        if (cp === thisConversation) {
            thisConversation.getMessages()
                .then(messagePaginator => {
                    if (cp === thisConversation) {
                        setMessages(messagePaginator.items);
                        setLoadingState('ready');
                    }
                })
                .catch(err => {
                    console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
                    setLoadingState("failed");
                });
        }
    }, [cp]);

    useEffect(() => {
        if (cp) {
            loadMessagesFor(cp);

            if (!bc.has(cp)) {
                let newConversation = cp;
                newConversation.on('messageAdded', (m) => messageAdded(m, newConversation));
                setBC(prev => new Set([...prev, newConversation]));
            }
        }
    }, [cp, bc, loadMessagesFor]);

    useEffect(() => {
        setLoadingState('loading messages');
        setCP(conversationProxy);
    }, [conversationProxy]);

    const messageAdded = (message, targetConversation) => {
        if (targetConversation === cp) {
            // setLoadingState('loading');
            setMessages(prevMessages => [...prevMessages, message]);
        }
    };

    const onMessageChanged = message => {
        setNewMessage(message);
    };

    const sendMessage = () => {
        const message = newMessage;
        if (message !== '') {
            cp?.sendMessage(message);
        }
        setNewMessage('');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={170}
            enabled
        >
            {messages &&
                <ConversationsMessages
                    identity={myIdentity}
                    messages={messages} />
            }
            <View style={{ paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#B9E4A6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                <View style={{ flex: 1 }}>
                    <TextInput placeholderTextColor={'#000'} style={{ color: '#000', fontSize: 16 }} multiline={true} placeholder='Type your message here...' onChangeText={onMessageChanged} value={newMessage} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ height:38, width:38, borderRadius:19, borderWidth:1, borderColor:'gray'  }}></View> */}
                    <TouchableOpacity disabled={loadingState !== 'ready'} onPress={sendMessage} style={{ marginLeft: 10, height: 38, width: 38, borderRadius: 19, backgroundColor: '#B9E4A6', alignItems: 'center', justifyContent: 'center' }}>
                        <ICONS.ChatSend width={20} height={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

Conversation.propTypes = {
    myIdentity: PropTypes.string.isRequired,
    conversationProxy: PropTypes.object.isRequired
}

export default Conversation;