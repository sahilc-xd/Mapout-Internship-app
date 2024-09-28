import React, { useState } from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../../components";
import { ICONS } from "../../../../constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../../../redux";
import Icons from "../../../../constants/icons";
import { SampleProfile } from "../../../../utils/constants";
import { useWindowDimensions } from "react-native";
import { navigate } from "../../../../utils/navigationService";

const EditVideoModal = props => {
  const {
    videoModal = false,
    closeVideoModal = false,
    uploadFromCamera = false,
    requestGalleryPermission = false,
    openVideoModal=false
  } = props;
  const [stage, setStage] = useState(1);
  const user = useAppSelector(state=>state.user);
  const screenWidth = useWindowDimensions().width-96;

  const closeModal = () => {
    setStage(1);
    closeVideoModal();
  };

  const playVideo=(url)=>{
    closeModal();
    navigate("PlayVideoLink", { url: url, handleVideoWatched: openVideoModal });
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={videoModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
      <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
      <View bgc={"#FFF"} pv={16} btrr={20} btlr={20}>
        <TouchableOpacity onPress={closeModal} ai="flex-end" mh={24}>
          <Icon name="close" size={18} color={"#000"} />
        </TouchableOpacity>
        <View mb={16} jc="center">
          <Text ta="center" ftsz={16} weight="500" c={"#000"}>
            {stage === 3 ? "Sample Profile Videos" : "Add/Edit Profile Video"}
          </Text>
          {
            stage === 3 && <TouchableOpacity onPress={()=>setStage(1)} po="absolute" ml={16}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
          }
        </View>
        {/* {!user?.profileVideo?.link?.length && <>
          <View fd="row" mh={64} jc="center">
            <Image
                source={require("../../../../assets/gifs/FireAnimation.gif")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
            />
            <Text ml={4} ta="center" c={"#EFC019"} ftsz={12} weight="600">
              Earn 20 points the first time
            </Text>
          </View>
          <Text ml={4} ta="center" c={"#EFC019"} ftsz={12} weight="600">
          you add a profile video
          </Text>
        </>} */}
        {stage === 2  && (
          <View>
            <Text mt={16} ftsz={14} weight="500" c={"#000"} ta="center">
              Upload a video
            </Text>
            <Text
              mb={16}
              mh={32}
              ftsz={12}
              weight="400"
              ta="center"
              c={"red"}>
              Suitable formats: MP4. No more than 50mb.
            </Text>
            <View w={"100%"} h={0.4} bgc={"#000"}></View>
            <TouchableOpacity
              onPress={() => {
                requestGalleryPermission("video");
              }}>
              <Text ta="center" pv={16} c={"#6691FF"} weight="400" ftsz={14}>
                Gallery
              </Text>
            </TouchableOpacity>
            <View w={"100%"} h={0.4} bgc={"#000"}></View>
            <TouchableOpacity
              onPress={() => {
                uploadFromCamera("video");
              }}>
              <Text ta="center" pv={16} c={"#6691FF"} weight="400" ftsz={14}>
                Use Camera
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {stage == 1 && (
          <View ph={16}>
            <View fd="row" ai="center" mt={16}>
              <Text ftsz={16} weight="500" f={1} pr={4}>
                What is a profile video?
              </Text>
              <TouchableOpacity onPress={()=>setStage(3)} bgc={"#D8E3FC"} br={8}>
                <Text ftsz={12} weight="600" c={"#000"} ph={24} pv={12}>
                  Sample
                </Text>
              </TouchableOpacity>
            </View>
            <Text mt={16} ftsz={12} weight="400">
              A video profile is a short video introduction that showcases your
              personality, skills, and career goals. It's a powerful way to make
              a memorable impression.
            </Text>
            <Text mt={16} mb={16} ftsz={16} weight="500">
              Guidelines
            </Text>
            <View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                1. Setup:
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Choose a well-lit, quiet space.
              </Text>
            </View>
            <View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                2. Attire:
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Dress professionally,
                avoid distractions. 
              </Text>
            </View>
            <View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                3. Content:
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Plan your message, be concise.
              </Text>
            </View><View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                4. Body Language:
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Have good posture, eye contact.
              </Text>
            </View>
            <View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                5. Tone & Language:
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Speak confidently, avoid slang.
              </Text>
            </View>
            <View mh={8} fd="row" mt={4}>
              <Text ftsz={12} weight="700" mr={4}>
                6. Length
              </Text>
              <Text f={1} ftsz={12} weight="500" mr={8}>
                Keep it under 1 minutes.
              </Text>
            </View>
            <View fd="row" mv={16}>
            <Text ftsz={12} weight="400" c={'red'} f={1}>*Make sure your video is less than 50 MB and is shot in vertical mode on your phone.</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setStage(2);
              }}
              mt={16}
              mh={8}
              bgc={"#000"}
              br={12}>
              <Text c={"#FFF"} pv={16} ta="center" weight="400" ftsz={14}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {
          stage == 3 && 
          <View mt={16} fd="row" ph={32} gap={32}>
            {
              SampleProfile?.map((item, index)=>{

                return(
                  <View key={index?.toString()} f={1}>
                    <TouchableOpacity onPress={()=>playVideo(item?.videoUrl)} activeOpacity={1} w={screenWidth/2} h={screenWidth/2} ai="center">
                      <Image br={12} source={{uri: item?.videoThumbnail}} w={screenWidth/2} h={screenWidth/2} resizeMode="cover"/>
                      <TouchableOpacity onPress={()=>playVideo(item?.videoUrl)} po="absolute" b={-22}>
                        <ICONS.PlayVideo width={40} height={40} fill={'#000'}/>
                      </TouchableOpacity>
                    </TouchableOpacity>
                    <Text ftsz={12} weight="500" mt={24} ta="center">{item.name}</Text>
                    <Text ftsz={12} weight="400" ta="center">{item.title}</Text>
                  </View>
                )
              })
            }
          </View>
        }
      </View>
      </View>
    </Modal>
  );
};

export default EditVideoModal;
