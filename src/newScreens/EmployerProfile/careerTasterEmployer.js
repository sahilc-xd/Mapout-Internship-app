import React, { useEffect, useRef } from "react";
import { FlatList, View } from "react-native-style-shorthand";
import CareerTasterCard from "../JobsScreen/CareerTaster/careerTasterCard";
import { Text } from "../../components";
import { PanResponder } from "react-native";

const CareerTasterEmployer = (props) => {
  const {updateSelected=false, renderTabs=false} = props;
  const careerTasters = [
    {
      _id: "6679199181e5ba70bf4ca8af",
      employer_id: "667276f46c4e42f15d4e6e29",
      Employerlogo:
        "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/mapout-logo.png",
      employerName: "Mapout",
      timePeriod: "2 weeks",
      coverImg:
        "https://www.shutterstock.com/image-photo/workshop-university-rear-view-students-260nw-296223497.jpg",
      tasterMode: "Online",
      name: "UI/UX Design Taster",
      description:
        "Welcome to MapOut’s UI/UX Design virtual experience program, we’re glad you’re here. Let’s get started with the first task to make you a UI/UX Design rockstar! Our first task is to learn to create user personas and why they’re important.",
      __v: 0,
      isCompleted: false,
      isSaved: false,
      isStarted: false,
    },
    {
      _id: "6679199181e5ba70bf4ca8af",
      employer_id: "667276f46c4e42f15d4e6e29",
      Employerlogo:
        "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/mapout-logo.png",
      employerName: "Mapout",
      timePeriod: "2 weeks",
      coverImg:
        "https://www.shutterstock.com/image-photo/workshop-university-rear-view-students-260nw-296223497.jpg",
      tasterMode: "Online",
      name: "UI/UX Design Taster",
      description:
        "Welcome to MapOut’s UI/UX Design virtual experience program, we’re glad you’re here. Let’s get started with the first task to make you a UI/UX Design rockstar! Our first task is to learn to create user personas and why they’re important.",
      __v: 0,
      isCompleted: false,
      isSaved: false,
      isStarted: false,
    },
    {
      _id: "6679199181e5ba70bf4ca8af",
      employer_id: "667276f46c4e42f15d4e6e29",
      Employerlogo:
        "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/mapout-logo.png",
      employerName: "Mapout",
      timePeriod: "2 weeks",
      coverImg:
        "https://www.shutterstock.com/image-photo/workshop-university-rear-view-students-260nw-296223497.jpg",
      tasterMode: "Online",
      name: "UI/UX Design Taster",
      description:
        "Welcome to MapOut’s UI/UX Design virtual experience program, we’re glad you’re here. Let’s get started with the first task to make you a UI/UX Design rockstar! Our first task is to learn to create user personas and why they’re important.",
      __v: 0,
      isCompleted: false,
      isSaved: false,
      isStarted: false,
    },
  ];

  useEffect(()=>{
    renderTabs && renderTabs();
  },[])
  
  const onPressPrevious=()=>{
    updateSelected && updateSelected(1)
  }

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log("gestureState", gestureState)
        if(gestureState.dy > 5 ||  gestureState.dy < -5 || (gestureState.dx <= 10 && gestureState.dx >= -10)){
          return false;
        }
        return true
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          onPressPrevious();
        }
      },
    })
  ).current;

  return (
    <View f={1} ph={16} {...panResponder.panHandlers}>
    <FlatList
        mb={80}
        keyExtractor={(item, index)=>index.toString()}
        ItemSeparatorComponent={()=>{
            return(
                <View h={16}/>
            )
        }}
        ListEmptyComponent={()=>{
          return(
            <View bgc={'rgba(217, 217, 217, 0.65)'} w={'100%'} ai='center' jc='center' pv={16} br={12} asf='center'>
                    <Text ftsz={14} weight='600'>No career taster found.</Text>
                </View>
          )
        }}
      onEndReached={() => {
        console.log("reached endddd");
      }}
      data={careerTasters}
      renderItem={({ item, index }) => {
        return (
          <CareerTasterCard item={item} index={index} show={false} size={360} />
        );
      }}
    />
    </View>
  );
};

export default React.memo(CareerTasterEmployer);
