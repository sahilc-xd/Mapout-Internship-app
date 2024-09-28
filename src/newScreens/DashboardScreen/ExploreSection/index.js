import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Modal } from "react-native-style-shorthand";
import { Text } from "../../../components";
import Icons from "../../../constants/icons";
import { navigate } from "../../../utils/navigationService";
import { useAppSelector } from "../../../redux";
import { ICONS } from "../../../constants";
import LinearGradient from "react-native-linear-gradient";
import { useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logAnalyticsEvents from "../../../utils/logAnalyticsEvent";
const ExploreSection = () => {
  const user = useAppSelector(state => state.user);
  const result = user?.personality_assesment;
  const item = {
    name: "Career discovery quiz",
    desc: "Learn more about your career",
    Icon: <Icons.CVAnalysis width={64} height={64} />,
    bgColor: "#D9BCFF59",
    navigate:
      user?.personality_assesment?.mbti?.code?.length > 0
        ? "CareerAnalysisResult"
        : "CareerAnalysisScreen",
  };

  const width = useWindowDimensions().width/2.5;
  const isCompletedTest = user?.isCareerAnalysisComplete;

   const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [continuePressed, setContinuePressed] = useState(false); // State to track continue button press
  const insets = useSafeAreaInsets();
  const handleContinue = () => {
    logAnalyticsEvents('retake_career_discovery_test',{});
    setContinuePressed(true);
    setModalVisible(false);
    navigate("CareerAnalysisScreen"); // Navigate to designated page
  };

  const handleBack = () => {
    setContinuePressed(false);
    setModalVisible(false);
  };


  return (
    <>
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
  }}>
  <View style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
    <View style={{ height: 233, backgroundColor: "#FFFFFF", borderTopRightRadius: 24, borderTopLeftRadius: 24, paddingTop: 16, paddingHorizontal: 32 }}>
      <TouchableOpacity style={{ alignSelf: "flex-end", }} onPress={() => setModalVisible(false)}>
        <Icon name="close" size={18} color={"#000"} />
      </TouchableOpacity>
      <View>
        <Text style={{textAlign:"center",fontSize:16,fontWeight: "500"}}>Retake Test</Text>
        <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }} pt={40}>Retaking the Career Discovery Quiz will erase your current results. Are you sure you want to continue?</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30,justifyContent: "center" }}>
                
           <TouchableOpacity onPress={handleBack} style={{ backgroundColor: "#fff", borderRadius: 12,width:140,height:48,paddingVertical: 12,borderColor:"#000",borderBottomColor:"#000",borderWidth:0.4,marginRight: 25  }}>
            <Text style={{ color: "#000", textAlign: "center",fontSize:14 }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleContinue} style={{ backgroundColor: "#000", paddingVertical: 12, borderRadius: 12,width:140,height:48,marginLeft:25 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Continue</Text>
          </TouchableOpacity>
         
        </View>
      </View>
    </View>
    <View style={{ backgroundColor: "#FFFFFF", height: insets.bottom }} />
  </View>
</Modal>






      {!isCompletedTest ? (
        <View mt={16}>
          <Text ml={24} ftsz={18} weight="400" c={"#17171F"}>
            Discover Career Paths
          </Text>
          <TouchableOpacity
            f={1}
            onPress={() => {
              item?.navigate?.length > 0 && navigate(item?.navigate);
            }}
            bgc={"rgba(255, 255, 255, 0.75)"}
            mh={24}
            mt={8}
            ph={16}
            br={20}
            pv={16}>
            <View fd="row" asf="baseline" ai="center">
              <View fd="row" ai="center" jc="space-between" w={'100%'}>
                <View>
                  <Text ftsz={12} weight="400" c={'#FF8C6B'}>15-20 minutes</Text>
                </View>
                <View fd="row" ai="center">
                  <ICONS.Star width={16} height={16} fill={"#FFD439"} />
                  <Text ml={4} ftsz={12} weight="600">
                    4.7
                  </Text>
                  <Text c={'rgba(23, 23, 31, 0.5)'} ml={4} ftsz={12} weight="400">
                   (5000+ reviews)
                  </Text>
                </View>
              </View>
            </View>
            <Text c="#17171F" weight="600" ftsz={20} mt={16}>
              Career Discovery Quiz
            </Text>
            <Text mb={16} mt={8} ftsz={13} weight="400" c={'rgba(23, 23, 31, 0.5)'}>Discover your 9 best-fit careers based on your <Text ftsz={13} weight="400" c={'#17171F'}>Personality, Interests, Aspirations and Soft Skills.</Text></Text>
            <TouchableOpacity
              onPress={() => {
                item?.navigate?.length > 0 && navigate(item?.navigate);
              }}
              br={12}
              bgc={"#000"}
              w={"100%"}
              jc="center"
              ai="center"
              ph={64}
              pv={12}>
              <Text ftsz={14} weight="500" c={"#FFF"}>
                Discover
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ) : (
        <View mt={16} f={1}>
          <View fd="row" ai="center" jc="space-between" mh={24} mb={8}>
            <Text ftsz={18} weight="400" c={"#17171F"}>
            Your Career Paths
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text ftsz={12} weight="600" c={"rgba(23, 23, 31, 0.5)"}>
              Retake quiz
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal ph={16} showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={()=>{
                  navigate('CareerAnalysisResult', {type: "Ideal Career"});
                }} style={{borderRadius: 12, width: width, marginRight: 16, height:'100%'}}>
                  <LinearGradient colors={["#D9BCFF59","#D8E3FC59","#B9E4A659"]} useAngle={true} angle={135} angleCenter={{x:0.5,y:0.5}} style={{width: width, paddingTop: 16, paddingHorizontal:4, justifyContent :'center', alignItems: 'center', borderRadius: 12}}>
                    <Icons.CVAnalysis width={50} height={50}/>
                    <View h={50} jc="center">
                      <Text ph={4} ta="center" ftsz={14} weight="600" c={'#17171F'}>Your Ideal Careers</Text>
                    </View>
                    <View h={50} jc="center">
                      <Text ta="center" ftsz={14} weight="600" c={'#17171F50'}>9 Careers</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  navigate('CareerAnalysisResult', {type: "Personality"});
                }} bgc={'#CAF3F240'} style={{borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingTop: 16, paddingHorizontal: 4, width: width, marginRight: 16}}>
                  <Icons.CVAnalysis width={50} height={50}/>
                  <View h={50} jc="center">
                    <Text ph={4} ta="center" ftsz={14} weight="600" c={'#17171F'}>MBTI - {result?.mbti?.code}</Text>
                  </View>
                  <View h={50} jc="center">
                    <Text ta="center" ftsz={14} weight="600" c={'#17171F50'}>Personality Type</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  navigate('CareerAnalysisResult', {type: "Interests"});
                }} bgc={'#D8E3FC8C'} style={{borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingTop: 16, paddingHorizontal: 4, width: width, marginRight: 32}}>
                  <Icons.CVAnalysis width={50} height={50}/>
                  <View h={50} jc="center">
                    <Text ph={4} ta="center" ftsz={14} weight="600" c={'#17171F'}>RIASEC - {result?.riasec?.code}</Text>
                  </View>
                  <View h={50} jc="center">
                    <Text ta="center" ftsz={14} weight="600" c={'#17171F50'}>Interests Type</Text>
                  </View>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

export default ExploreSection;
