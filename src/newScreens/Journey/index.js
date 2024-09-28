import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native-style-shorthand'
import MainLayout from '../../components/MainLayout'
import { Linking, PanResponder } from "react-native";
import Icons from '../../constants/icons';
import { popNavigation } from '../../utils/navigationService';
import TodaysTask from '../DashboardScreen/TodaysTask';
import { ICONS } from '../../constants';
import { api } from '../../redux/api';
import { useAppSelector } from '../../redux';
import moment from 'moment';
import { Text } from '../../components';
import RenderHTML from "react-native-render-html";
import logAnalyticsEvents from '../../utils/logAnalyticsEvent';

const sorts = [
    {
        name: "Newest First"
    },
    {
        name: "Oldest First"
    }
]

const JourneyScreen = (props) => {
    const showPreviousLearning = props?.route?.params?.selectedTab === "Previous Learning" ? 2 : 1;
    const [selectedTab, setSelectedTab] = useState(showPreviousLearning);
    const [sort, setSort] = useState(0);
    const [learningData, setLearningData] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const user = useAppSelector(state => state.user);
    const { data, isSuccess, isLoading } = api.useGetPreviousLearningsQuery({ userId: user?._id });

    useEffect(()=>{
        logAnalyticsEvents('coaching_journey_tab', {selectedTab: selectedTab === 1 ? 'Todays Task' : 'Previous Learning'})
    },[selectedTab])


    useEffect(() => {
        if(isSuccess){
        let newData = [...data?.tasks];
        setLearningData(newData.reverse());
        }
    }, [isSuccess])

    const onPressNext=()=>{
        setSelectedTab((prv)=>{
            if(prv==1)
                return 2;
            return prv;
        })
    }

    const onPressPrevious=()=>{
        setSelectedTab((prv)=>{
            if(prv==2)
                return 1;
            return prv;
        })
    }

    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if (
                    gestureState.dy > 5 ||
                    gestureState.dy < -5 ||
                    (gestureState.dx <= 10 && gestureState.dx >= -10)
                ) {
                    return false;
                }
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -50) {
                    onPressNext();
                } else if (gestureState.dx > 50) {
                    onPressPrevious();
                }
            },
        }),
    ).current;

    const handleExpandCard = (index) => {
        if(expanded === index) {
            setExpanded(null);
        } else {
            logAnalyticsEvents('expand_previous_learning', {})
            setExpanded(index);
        }
    }

    const renderLearning = ({ item, index }) => {
        let completedOn = moment(item?.taskCompletedOn).format('DD MMM YYYY');
        return(
            <TouchableOpacity key={index} onPress={() => handleExpandCard(index)} fd='row' mv={10}>
                <View h={11} w={11} br={6} bc={'#000000'} bw={1} ai='center' jc='center' mt={30}>
                    <View h={7} w={7} br={4} bgc={'#000000'}></View>
                </View>
                <View bgc={'rgba(255,255,255,0.65)'} ml={20} f={1} p={10} br={10}>
                    <View fd='row' jc='space-between' ai='center'>
                        <View>
                            <Text ftw='500' ftsz={10}>Learning {item?.taskCount}</Text>
                        </View>
                        <View>
                            <Text ftw='400' ftsz={10}>Completed on {completedOn}</Text>
                        </View>
                    </View>
                    <View fd='row' jc='space-between' ai='flex-start' mt={10}>
                        <View f={1}>
                            <Text ftw='500' ftsz={14}>{item?.title}</Text>
                        </View>
                        <View ph={10}>
                            <ICONS.ChevronDown />
                        </View>
                    </View>
                    <View>
                        <Text c={'#7F8A8E'} ftsz={12} ftw='500'>{item?.desc}</Text>
                    </View>
                    {expanded === index && <View mt={20}>
                        <Text ftsz={12} ftw='600'>What you learned</Text>
                        <RenderHTML
                            systemFonts={["Manrope-Regular"]}
                            contentWidth={"100%"}
                            source={{
                                html: item?.takeaway,
                            }}
                            tagsStyles={tagsStyles}
                        />
                    </View>}
                </View>
            </TouchableOpacity>
        )
    }

    const handleSortChange = () => {
        let newData = [...data?.tasks]; 
        if(sort === 0) {
            setSort(1);
            setLearningData(newData);
        } else {
            let reversedData = newData.reverse();
            setSort(0);
            setLearningData(reversedData);
        }
    }

    return (
        <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
            <ImageBackground
                f={1}
                source={require("../CoachingScreen/CoachingBackground.png")}
                resizeMode="cover">
                <View mh={16} f={1} {...panResponder.panHandlers}>
                    <View mv={8}>
                        <View fd="row" ai="center">
                            <TouchableOpacity
                                onPress={() => {
                                    popNavigation();
                                }}>
                                <Icons.BackArrow width={32} height={32} />
                            </TouchableOpacity>
                            <Text
                                ftsz={17}
                                weight="500"
                                c={"#141418"}
                                f={1}
                                mr={32}
                                ta="center">
                                Your Coaching Journey
                            </Text>
                        </View>
                    </View>
                    <View fd="row">
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedTab(1);
                            }}
                            f={1}
                            ai="center"
                            bc={selectedTab === 1 ? "#48A022" : "#7F8A8E"}
                            bbw={selectedTab === 1 ? 2 : 1}
                            pb={8}>
                            <Text ftsz={14} weight="400">
                                Today's Task
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedTab(2);
                            }}
                            f={1}
                            ai="center"
                            bc={selectedTab === 2 ? "#48A022" : "#7F8A8E"}
                            bbw={selectedTab === 2 ? 2 : 1}
                            pb={8}>
                            <Text ftsz={14} weight="400">
                                Previous Learnings
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        {selectedTab === 1 &&
                            <>
                                <View style={{ flex: 1 }}>
                                    <ScrollView>
                                        <TodaysTask source="inner" />
                                    </ScrollView>
                                </View>
                            </>
                        }
                        {selectedTab === 2 && 
                            <>
                                <View style={{ flex:1 }}>
                                    {isLoading ? <View f={1} ai='center' jc='center'>
                                        <ActivityIndicator size={'large'} color={'#000'}/>
                                    </View> : <><View mt={10} fd="row" jc='space-between'>
                                        {learningData?.length>0 && <TouchableOpacity onPress={handleSortChange} fd='row' ai='center'>
                                            <Text ftsz={12}>
                                                Sort By: {sorts[sort]?.name} 
                                            </Text>
                                            {sort === 0 ? <ICONS.LearningSortDown /> : <ICONS.LearningSortUp />}
                                        </TouchableOpacity>}
                                    </View>
                                    <FlatList 
                                        data={learningData}
                                        renderItem={renderLearning}
                                        ListEmptyComponent={()=>{
                                            return(
                                                <View mt={16} bgc={'rgba(217, 217, 217, 0.45)'} w={'100%'} ai='center' jc='center' pv={16} br={12} asf='center'>
                                                    <Text ftsz={14} weight='600'>No learning found.</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    </>}
                                </View>
                            </>
                        }
                    </View>
                </View>
            </ImageBackground>
        </MainLayout>
    )
}

const tagsStyles = {
    body: {
      whiteSpace: "normal",
      color: "#000",
      fontSize: 14,
      fontFamily: "Manrope-Regular"
    },
  };

export default JourneyScreen;