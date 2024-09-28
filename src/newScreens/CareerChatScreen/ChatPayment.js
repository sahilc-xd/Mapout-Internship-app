import React, { useState } from 'react';
import PaymentOptionsModal from './PaymentOptionsModal';
import { Text } from '../../components';
import { ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand';

const ChatPayment = (props) => {
    const {paymentOptions = []} = props;
    const [showModal, setShowModal] = useState(false);

    const chatData = [
        {
          heading: "Learn What Employers Want",
          desc: "Understand what companies look for in people they hire.",
        },
        {
          heading: "Refine your Resumes",
          desc: "Make your resume stand out to show your best.",
        },
        {
          heading: "Improve Interview Skills",
          desc: "Learn how to impress in job interviews.",
        },
        {
            heading: "Find Jobs Easier",
            desc: "Create a plan  just for you to find good jobs.",
          },
      ];
    
    const handleUnlockClicked = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return(
        <View style={{ flex:1, width: '100%' }}>
          <View f={1}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius:12, padding: 16}}>
                <Text ph={12} ftsz={14} weight="400">
                Meet Neha, your career advisor with 15 years of experience in helping people get jobs and grow in their careers. 
                </Text>
                    <View mt={8} pr={8}>
                    <Text mt={8}>Chat with Neha today to:</Text>
                      {
                        chatData?.map((item)=>{
                          return(
                            <View fd="row" ai="flex-start" mt={8}>
                              <View h={6} w={6} br={6} bgc={'#000'} mt={10} mr={8}/>
                              <Text ftsz={14} weight="400"><Text weight="700">{item?.heading}</Text>: {item?.desc}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
            </View>
            </View>
            <TouchableOpacity asf='center' pv={16} onPress={handleUnlockClicked} style={{ marginTop:30, backgroundColor:'#000000', borderRadius:12, alignItems:'center', width: '90%' }}>
              <Text ftsz={14} weight='400' style={{ color:'#FFFFFF' }}>Unlock Chat</Text>
            </TouchableOpacity>
            <PaymentOptionsModal showModal={showModal} closeModal={closeModal} paymentOptions={paymentOptions}/>
        </View>
    )
}

export default ChatPayment;