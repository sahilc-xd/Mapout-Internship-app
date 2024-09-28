import React, { useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { popNavigation } from "../../utils/navigationService";
import StreakSection from "./streakSection";
import PointsSections from "./pointsSection";
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import LinearGradient from "react-native-linear-gradient";
import { PanResponder, useWindowDimensions } from "react-native";
import GradientText from "../../utils/GradientText";
import { useAppSelector } from "../../redux";

const StreakAndRewardScreen = () => {

    const user = useAppSelector(state=>state.user);
    const streakDay = user?.taskDetails?.dailyStreakCount <= -1 ? 0 : user?.taskDetails?.dailyStreakCount;
    const [selectedTab, setSelectedTab] = useState("Streak");
    const [showModal, setShowModal] = useState(false);

    const updateModal = () =>{
      setShowModal(!showModal);
    }

    const onPressNext =()=>{
      setSelectedTab(prv=>{
        if(prv === "Streak"){
          return "Points"
        }
        return prv
      })
    }

    const onPressPrevious =()=>{
      setSelectedTab(prv=>{
        if(prv === "Points"){
          return "Streak"
        }
        return prv
      })
    }

    const panResponder = React.useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          if(gestureState.dy > 5 ||  gestureState.dy < -5 || (gestureState.dx <= 10 && gestureState.dx >= -10)){
            return false;
          }
          return true
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < -50) {
            onPressNext()
          }
          else if (gestureState.dx > 50) {
            onPressPrevious();
          }
        },
      })
    ).current;

    const ShareModal=()=>{
      const ref=useRef();

      const handleShare = ()=>{
        ref?.current?.capture().then(uri => {
          const options = {
            url: uri
          };
          Share.open(options)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            err && console.log(err);
          });
        });
      }
      return(
        <Modal onRequestClose={updateModal} animationType="fade" transparent visible={showModal}>
        <View f={1} bgc={'rgba(0,0,0,0.6)'}>
          <View f={1} jc="center" ai="center" btrr={32} btlr={32} pv={32} ph={16}>
          <ViewShot ref={ref} options={{ fileName: "ShareStreak", format: "png", quality: 1 }}>
            <LinearGradient
                  colors={["#FFF8BE", "#FFF178", "#FF8000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  useAngle={true}
                  angle={135}
                  angleCenter={{ x: 0.5, y: 0.5 }}
                  style={{
                    width: useWindowDimensions().width-64,
                    height: 220,
                    borderRadius: 32,
                    paddingHorizontal: 16,
                    paddingVertical: 16
                  }}>
                    <View fd="row" ai="center">
                      <View f={1}>
                        <Text ftsz={14} c={'#333333'} weight="600">I am on a</Text>
                        <GradientText colors={["#FFD439", "#FF4C00" ,"#FF4C00"]} ftsz={40} weight="700">{streakDay}</GradientText>
                        <Text ftsz={14} c={'#333333'} weight="600">day learning streak on MapOut!</Text>
                        <Text ftsz={10} c={'#333333'} weight="400" mt={16}>Download the app today to have your own career co-pilot.</Text>
                      </View>
                      <View h={'100%'} jc="center">
                        <Image source={require('../../assets/images/FireRotated.png')}/>
                      </View>
                    </View>
            </LinearGradient>
          </ViewShot>
          <View gap={16} fd="row">
          <TouchableOpacity fd="row" pv={8} ph={16} br={20} bgc={'#FFD439'} mt={32} onPress={handleShare}>
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity fd="row" pv={8} ph={16} br={20} bgc={'#000'} mt={32} onPress={updateModal}>
            <Text c={'#FFF'}>Close</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>
      )
    }
  
  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./StreakAndRewardBackground.png")}
        resizeMode="cover">
        <ShareModal/>
        <View f={1} {...panResponder.panHandlers}>
        <View mh={16} mv={16}>
          <View fd="row" ai="center">
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}>
                <Icons.BackArrow width={32} height={32}/>
            </TouchableOpacity>
              <Text 
                ftsz={17}
                weight="500"
                c={"#141418"}
                f={1}
                ta="center"
                >
                Your Current Streak
              </Text>
            <TouchableOpacity onPress={updateModal}>
                <Icons.ShareIcon width={32} height={32}/>
            </TouchableOpacity>
          </View>
        </View>
         <View fd="row">
            <TouchableOpacity onPress={()=>{
                setSelectedTab("Streak")
            }} f={1} ai="center" bc={selectedTab === "Streak" ? '#48A022' : '#7F8A8E'} bbw={selectedTab === "Streak" ? 2 : 1} pb={8}>
              <Text ftsz={14} weight="400">Streak</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                setSelectedTab("Points")
            }} f={1} ai="center" bc={selectedTab === "Points" ? '#48A022' : '#7F8A8E'} bbw={selectedTab === "Points" ? 2 : 1} pb={8}>
              <Text ftsz={14} weight="400">Points</Text>
            </TouchableOpacity>
          </View>
        {selectedTab === "Streak" ? <StreakSection/> : <PointsSections/>}
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default StreakAndRewardScreen;
