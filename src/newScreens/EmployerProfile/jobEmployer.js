import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { profilePicturePlaceholder } from "../../utils/constants";
import LinearGradient from "react-native-linear-gradient";
import { PanResponder } from "react-native";
import { render } from "react-native-style-shorthand/lib/esm/hoc";

const JobCard = ({ data }) => {
  return (
    <View br={20}>
      <Image
        br={20}
        source={{
          uri: "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Task%201.png",
        }}
        w={"100%"}
        h={400}
      />
      <View
        ai="center"
        jc="space-between"
        fd="row"
        bgc={"rgba(0, 0, 0, 0.55)"}
        pv={12}
        ph={16}
        po="absolute"
        t={0}
        w={"100%"}
        btrr={20}
        btlr={20}>
        <Text ftsz={14} weight="500" f={1} c={"#FFF"}>
          Hear directly from DRW about this role!
        </Text>
        <TouchableOpacity>
          <Icons.PlayButton width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View
        bgc={"rgba(0, 0, 0, 0.55)"}
        pv={12}
        ph={16}
        po="absolute"
        b={0}
        w={"100%"}
        bbrr={20}
        bblr={20}>
        <View fd="row">
          <View f={1} fd="row" ai="center" jc="space-between">
            <Image
              source={{ uri: data?.companyLogo || profilePicturePlaceholder }}
              w={56}
              h={56}
              br={56}
            />
            <Text f={1} ml={16} ftsz={15} c={"#FFF"} weight="600">
              {data?.companyName}
            </Text>
          </View>
          <View>
            <LinearGradient
              colors={["#B9E4A6", "#FFFFFF"]}
              useAngle={true}
              angle={180}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}>
              <Text ftsz={12} weight="700">
                100%
              </Text>
              <Text ftsz={12} weight="500">
                Match
              </Text>
            </LinearGradient>
          </View>
        </View>
        <Text ftsz={16} weight="500" c={"#FFF"}>
          {data?.jobTitle}
        </Text>
        <View fd="row" ai="center" fw="wrap">
          <Text ftsz={12} weight="400" c={"#FFF"}>
            {data?.location}
          </Text>
          <View mh={4} h={4} w={4} bgc={"#FFF"} br={2} />
          <Text ftsz={12} weight="400" c={"#FFF"}>
            {data?.jobType}
          </Text>
          <View mh={4} h={4} w={4} bgc={"#FFF"} br={2} />
          <Text ftsz={12} weight="400" c={"#FFF"}>
            {data?.jobPreference}
          </Text>
        </View>
        <View fd="row" ai="center" mt={8}>
          <TouchableOpacity mr={16} p={12} bw={1} bc={"#FFF"} br={8}>
            <Icons.SaveJob width={20} height={20} stroke={"#FFF"} />
          </TouchableOpacity>
          <TouchableOpacity f={1} pv={12} br={8} jc="center" ai="center" bgc={'#FFF'}>
              <Text ftsz={14} weight="500">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const JobsEmployer = props => {
  const {updateSelected=false, renderTabs=false} = props;
  const jobDetails = [
    {
      videoThumbnail: "",
      videoUrl: "",
      score: 20,
      jobTitle: "Algorithmic Trader",
      companyName: "DRW",
      companyLogo: "",
      location: "Amsterdam, Netherlands",
      jobType: "Full-time",
      jobPreference: "Office",
      isSaved: false,
      isApplied: false,
    },
    {
      videoThumbnail: "",
      videoUrl: "",
      score: 20,
      jobTitle: "Algorithmic Trader",
      companyName: "DRW",
      companyLogo: "",
      location: "Amsterdam, Netherlands",
      jobType: "Full-time",
      jobPreference: "Office",
      isSaved: false,
      isApplied: false,
    },
    {
      videoThumbnail: "",
      videoUrl: "",
      score: 20,
      jobTitle: "Algorithmic Trader",
      companyName: "DRW",
      companyLogo: "",
      location: "Amsterdam, Netherlands",
      jobType: "Full-time",
      jobPreference: "Office",
      isSaved: false,
      isApplied: false,
    },
  ];

  useEffect(()=>{
    renderTabs && renderTabs();
  },[])

  const onPressNext=()=>{
    updateSelected && updateSelected(2)
  }

  const onPressPrevious=()=>{
    updateSelected && updateSelected(0)
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
        if (gestureState.dx < -50) {
          onPressNext()
        }
        else if (gestureState.dx > 50) {
          onPressPrevious();
        }
      },
    })
  ).current;

  return (
    <>
    <View f={1} ph={16} {...panResponder.panHandlers}>
      <FlatList
        mb={80}
        ListEmptyComponent={()=>{
          return(
            <View bgc={'rgba(217, 217, 217, 0.65)'} w={'100%'} ai='center' jc='center' pv={16} br={12} asf='center'>
                    <Text ftsz={14} weight='600'>No jobs found.</Text>
                </View>
          )
        }}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        ItemSeparatorComponent={() => {
          return <View h={16} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        data={jobDetails}
        initialNumToRender={50}
        renderItem={({ item, index }) => {
          return <JobCard data={item} />;
        }}
      />
      </View>
    </>
  );
};

export default React.memo(JobsEmployer);
