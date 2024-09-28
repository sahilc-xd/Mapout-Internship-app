import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { ICONS } from "../../constants";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import Icon from "react-native-vector-icons/AntDesign";
import { api } from "../../redux/api";

const StreakSection = () => {
  const user = useAppSelector(state=>state.user);
  const streakDay = user?.taskDetails?.dailyStreakCount <= -1 ? 0 : user?.taskDetails?.dailyStreakCount;
  const [streakModal, setStreakModal] = useState(false);
  const [participateCompletedModal, setParticipateCompletedModal] = useState(false);
  const [showAlreadyParticipateModal, setShowAlreadyParticipateModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [rewardsData, setRewardsData] = useState([]);
  const [getRewards, {data, isSuccess, isFetching}] = api.useLazyFetchRewardsQuery();
  const [participateInReward, {data: participateData, isSuccess: participateSuccess}] = api.useParticipateInRewardMutation();

  useEffect(()=>{
    if(participateSuccess){
      setRewardsData(participateData?.rewards);
      updateParticipateCompleteModal();
    }
  },[participateSuccess, participateData])

  useEffect(()=>{
    if(isSuccess){
      setRewardsData(data?.rewards);
    }
  },[isSuccess, data])

  useEffect(()=>{
    getRewards(user?.user_id);
  },[])



  const updateParticipateCompleteModal = ()=>{
    setParticipateCompletedModal(!participateCompletedModal);
  }

  const updateAlreadyParticipateModal=()=>{
    setShowAlreadyParticipateModal(!showAlreadyParticipateModal);
  }

  const RewardCard = (data)=>{
    
    const {logoUrl="", prizeName="", countryPrize="", description="", canParticipate=false, contestClosesOn="", minStreak=0, _id, participated=false} = data;
    return(
      <View mb={16}>
      <Text mb={4} ftsz={13} weight="500">Unlock after {minStreak}-day streak</Text>
      <View pv={16} bgc={canParticipate ? '#FFF' : 'rgba(255, 255, 255, 0.4)'} br={12} fd="row" f={1} bw={0.5} bc={"#7F8A8E50"} ai="center">
        <View f={1}>
          <Image w={'100%'} h={100} source={{uri: logoUrl}} resizeMode="contain"/>
        </View>
        <View f={1.5} mh={12}>
          <Text ftsz={12} weight="600">{prizeName}</Text>
          <Text ftsz={10} weight="400">{countryPrize}</Text>
          <Text mt={8} mb={4} ftsz={10} weight="400">{description}</Text>
          <TouchableOpacity onPress={()=>{
            setModalData(data);
            participated ? participateInReward({user_id: user?.user_id, reward_id: _id}) : updateAlreadyParticipateModal();
          }} disabled={!canParticipate} bgc={canParticipate ? '#000' : '#7F8A8E'} jc="center" ai="center" pv={8} br={12}>
            <Text c={'#FFF'}>{participated ? "Currently participating" : "Participate"}</Text>
          </TouchableOpacity>
          <Text mt={4} ftsz={9} weight="300" ta="right">Contest closes on {contestClosesOn}</Text>
        </View>
      </View>
      </View>
    )
  }

  const updateModal=()=>{
    setStreakModal(!streakModal);
  }

  const AlreadyParticipatedModal=()=>{
    return(
      <Modal animationType="fade" onRequestClose={updateAlreadyParticipateModal} transparent visible={showAlreadyParticipateModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
          <TouchableOpacity f={1} onPress={updateAlreadyParticipateModal} activeOpacity={1}/>
          <View bgc={'#FFF'} ai="center" btrr={32} btlr={32} pt={32} pb={48} ph={16}>
            <TouchableOpacity onPress={updateAlreadyParticipateModal} po='absolute' r={16} t={16}>
                    <Icon name="close" size={18} color={"#202020"}/>
            </TouchableOpacity>
            <Text mt={16} ftsz={13} ta="center" weight="400">You are already participating in this contest. One lucky winner will be selected by us and notified through email.</Text>
            <Text  mt={16} ftsz={13} ta="center" weight="400">Good luck!</Text>
            <Text mt={32} ta="center" ftsz={10} weight="400">Contest closes on {modalData?.contestClosesOn}</Text>
            <Text ta="center" ftsz={10} weight="400">Contest closes on {modalData?.winnerAnnouncedOn}</Text>
          </View>
        </View>
      </Modal>
    )
  }


  const ParticipatedModal = ()=>{
    return(
      <Modal animationType="fade" onRequestClose={updateParticipateCompleteModal} transparent visible={participateCompletedModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
          <TouchableOpacity f={1} onPress={updateParticipateCompleteModal} activeOpacity={1}/>
          <View bgc={'#FFF'} ai="center" btrr={32} btlr={32} pt={32} pb={48} ph={16}>
            <TouchableOpacity onPress={updateParticipateCompleteModal} po='absolute' r={16} t={16}>
                    <Icon name="close" size={18} color={"#202020"}/>
            </TouchableOpacity>
            <Image source={{uri: modalData?.logoUrl}} width={200} height={150} resizeMode="contain"/>
            <Text mt={32} ftsz={14} weight="600">{modalData?.prizeName}</Text>
            <Text ftsz={11} weight="400">{modalData?.countryPrize}</Text>
            <Text  mt={32} ftsz={13} ta="center" weight="400">{modalData?.afterParticipateText}</Text>
            <Text  mt={16} ftsz={13} ta="center" weight="400">Good luck!</Text>
            <Text mt={32} ta="center" ftsz={10} weight="400">Contest closes on {modalData?.contestClosesOn}</Text>
            <Text ta="center" ftsz={10} weight="400">Contest closes on {modalData?.winnerAnnouncedOn}</Text>
          </View>
        </View>
      </Modal>
    )
  }

  const StreakModal = ()=>{
    return(
      <Modal animationType="fade" transparent onRequestClose={updateModal} visible={streakModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
          <TouchableOpacity f={1} onPress={updateModal} activeOpacity={1}/>
          <View bgc={'#FFF'} ai="center" btrr={32} btlr={32} pt={32} pb={64} ph={16}>
            <TouchableOpacity onPress={updateModal} po='absolute' r={16} t={16}>
                    <Icon name="close" size={18} color={"#202020"}/>
            </TouchableOpacity>
            <Text ta="center" ftsz={16} weight="500">What is a streak?</Text>
            <Text mt={16} weight="400" ftsz={12} >Streaks are a consecutive series of actions or activities performed without interruption. Completing a task every day grows your streak but skipping a day resets it, so make sure to come back daily. The longer your streak, the more points you get. Streaks also help your brain focus on the task every day.</Text>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <>
      <StreakModal/>
      <ParticipatedModal/>
      <AlreadyParticipatedModal/>
      <ScrollView contentContainerStyle={{flexGrow:1}}>
      <View
        mh={16}
        bgc={"rgba(255, 255, 255, 0.75)"}
        br={12}
        pv={8}
        mv={16}>
        <View fd="row" ai="center" ph={16}>
          <View>
            <Image
                source={require("../../assets/gifs/FireAnimation.gif")}
                style={{ width: 40, height: 50 }}
                resizeMode="contain"
            />
          </View>
          <View f={1} mh={16}>
            <Text ftsz={16} weight="600">
              Current Streak: {streakDay} {streakDay > 1 ? "days" : "day"}
            </Text>
            <Text mt={4} ftsz={12} weight="400">
              {streakDay>0 ? "Great job! Keep completing tasks everyday to collect cool rewards." : "Start completing tasks everyday to collect cool rewards."}
            </Text>
          </View>
          <TouchableOpacity onPress={updateModal} po="absolute" t={0} r={8}>
            <ICONS.Info fill={'#EDEDED'}/>
          </TouchableOpacity>
        </View>
      </View>
      <View mt={16} f={1} ai="center">
        <View bgc={'#FFD439'} pv={8} ph={24} br={20}>
          <Text ftsz={14} weight="600">Rewards</Text>
        </View>
        {isFetching ? <View f={1} jc="center" ai="center">
          <ActivityIndicator color={'#000'} size={"large"}/>
        </View> : <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start'}}
          w={'100%'}
          ph={16}
          pt={16}
          mt={16}
          ListFooterComponent={()=>{
            return(
              <View h={32}/>
            )
          }}
          ListEmptyComponent={()=>{
            return(
            <View jc="center" ai="center" f={1}>
              <Text ta="center" ftsz={16} weight="500">No Rewards Found</Text>
            </View>
            )
          }}
          data={rewardsData}
          renderItem={({item, index})=>{
            return(
              <RewardCard {...item}/>
            )
          }}
        />}
      </View>
      </ScrollView>
    </>
  );
};

export default StreakSection;