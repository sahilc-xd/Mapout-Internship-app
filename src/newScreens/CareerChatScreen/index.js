import React, { useEffect, useState } from "react";
import { Client as ConversationsClient } from "@twilio/conversations";
import { TouchableOpacity } from "react-native";
import Conversation from "./Conversation";
import { useAppDispatch, useAppSelector } from "../../redux";
import { api } from "../../redux/api";
import Animated from "react-native-reanimated";
import { ActivityIndicator, View } from "react-native-style-shorthand";
import { Text } from "../../components";
import { saveChatToken } from "../../redux/authSlice";

const statusStrings = {
    connecting: 'Connecting to Career Advisor',
    connected: 'You are Connected',
    disconnecting: 'Disconnecting from Career Advisor...',
    disconnected: 'Disconnected',
    retrying: 'Retrying Connection',
    denied: 'Failed to Connect, try again later!'
}

const Conversations = () => {
    const user = useAppSelector(state=>state.user);
    const { chatToken } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [chatID, setChatID] = useState(user?.chat_id);
    const [conString, setConString] = useState(null);
    const [statusString, setStatusString] = useState(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const [ getAccessToken, { data: accessTokenData }] = api.useLazyGetAccessTokenQuery();
    const [ initiateChat, { data: initiateChatData, isSuccess: isICSuccess }] = api.useLazyCreateChatQuery();
    
    useEffect(() => {
        if(chatID) {
            initConversations();
        } else {
            initiateChat({ userId: user?._id , advisorId: user?.career_advisor });
        }
    }, []);

    useEffect(() => {
        if(isICSuccess) {
            setChatID(initiateChatData?.data?.conversationSid);
        }
    }, [isICSuccess])

    useEffect(() => {
        if(connectionAttempts > 0 && connectionAttempts <= 3) {
            initConversations();
        } 
    }, [connectionAttempts]);

    const initConversations = () => {
        const tokenVar = (chatID !== null && chatID !== undefined) ? (chatToken !== null && chatToken!== undefined) ? chatToken : 'sample' : 'sample';
        const conversationsClient = new ConversationsClient(tokenVar);
        setStatusString(statusStrings['connecting']);

        conversationsClient.on("connectionStateChanged", (state) => {
            switch(state) {
                case "connecting":
                    setStatusString(statusStrings['connecting']);
                    break;

                case "connected":
                    setStatusString(statusStrings['connected']);
                    break;

                case "disconnecting":
                    setStatusString(statusStrings['disconnecting']);
                    break;

                case "disconnected":
                    setStatusString(statusStrings['disconnected']);
                    break;

                case "denied":
                    const abc = getAccessToken({ userId: user?._id });
                    dispatch(saveChatToken(accessTokenData?.data?.token));
                    setTimeout(()=>{
                        setConnectionAttempts(prev => prev + 1);
                    }, 1000);
            }
        })

        conversationsClient.on("conversationJoined", (conversation) => {
            setConString(conversation);
        });
        
        conversationsClient.on("conversationLeft", (thisConversation) => {
            // setCon([...con, thisConversation]);
        });
    }

    return(
        <View style={{ flex:1 }}>
            <View style={{ marginTop: 20, flex:1 }}>
                {conString !== undefined && conString !== null ? 
                    <Conversation
                        conversationProxy={conString}
                        myIdentity={user?._id}
                    />
                    :
                    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                        <ActivityIndicator />
                        <Text style={{ fontSize:12, fontWeight:'500', color:'gray' }}>Fetching your chat</Text>
                    </View>
                }
            </View>
        </View>
    );
}

export default Conversations;