import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../../components";
import { useWindowDimensions } from "react-native";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";

const CVATSScreen = () => {
  const [loadingNum, setLoadingNum] = useState(1);
  const [resultsLoading, setResultsLoading] = useState(true);
  const screenHeight = useWindowDimensions().height;

  useEffect(() => {
    let num = loadingNum;
    if (loadingNum < 4) {
      setTimeout(() => {
        setLoadingNum(num + 1);
      }, 4000);
    }
    else{
        setResultsLoading(false)
    }
  }, [loadingNum]);


  const data = [{title: "Proper Use of Keywords", score: "6/10"}, {title: "Consistent Formatting", score: "7/10"}, {title: "Contact Information", score: "9/10"}, {title: "File Name and Type", score: "8/10"}, {title: "Use of Action Verbs and Achievements", score: "10/10"}]

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1} w={"100%"} h={"100%"}>
        {resultsLoading ? <LinearGradient
          colors={["#FFFFFF", "#D8E3FC", "#FFFFFF"]}
          useAngle={true}
          angle={135}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.3, 0.65, 1]}
          style={{ flex: 1 }}>
            <View h={screenHeight} f={1} jc="center">
              <Text mh={24} ftsz={17} ta="center" weight="600">
                Analyzing your CV...
              </Text>
              <View ml={50} fd="row">
                <View ai="center">
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 1 ? 38 : 28}
                      w={loadingNum === 1 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 1 ? 38 : 28}>
                      <Text ftsz={loadingNum === 1 ? 18 : 13} weight="500">
                        1
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 2 ? 38 : 28}
                      w={loadingNum === 2 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 2 ? 38 : 28}>
                      <Text ftsz={loadingNum === 2 ? 18 : 13} weight="500">
                        2
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 3 ? 38 : 28}
                      w={loadingNum === 3 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 3 ? 38 : 28}>
                      <Text ftsz={loadingNum === 3 ? 18 : 13} weight="500">
                        3
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View
                      mt={32}
                      jc="center"
                      ai="center"
                      h={loadingNum === 4 ? 38 : 28}
                      w={loadingNum === 4 ? 38 : 28}
                      bgc={"#FFF"}
                      br={loadingNum === 4 ? 38 : 28}>
                      <Text ftsz={loadingNum === 4 ? 18 : 13} weight="500">
                        4
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        c={loadingNum != 1 ? "#888888" : "#000"}
                        mt={32}
                        ftsz={loadingNum === 1 ? 14 : 11}
                        weight={loadingNum === 1 ? "500" : "400"}
                        ml={8}>
                        Analyzing your Skills & Experience
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        c={loadingNum != 2 ? "#888888" : "#000"}
                        mt={32}
                        ftsz={loadingNum === 2 ? 14 : 11}
                        weight={loadingNum === 2 ? "500" : "400"}
                        ml={8}>
                        Analyzing Keywords & Action verbs
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        mt={32}
                        c={loadingNum != 3 ? "#888888" : "#000"}
                        ftsz={loadingNum === 3 ? 14 : 11}
                        weight={loadingNum === 3 ? "500" : "400"}
                        ml={8}>
                        Analyzing Formatting & Structure
                      </Text>
                    </View>
                  </View>
                  <View h={80} jc="center">
                    <View>
                      <Text
                        mt={32}
                        c={loadingNum != 4 ? "#888888" : "#000"}
                        ftsz={loadingNum === 4 ? 14 : 11}
                        weight={loadingNum === 4 ? "500" : "400"}
                        ml={8}>
                        Analyzing Grammar and Spelling
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
        </LinearGradient> : 
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.58)", "rgba(225, 232, 250, 0.58)", "rgba(231, 249, 223, 0.58)"]}
          useAngle={true}
          angle={105}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.2, 0.65, 1]}
          style={{ flex: 1 }}>
            <View f={1} ph={16}>
              <View mt={8} mb={16} ai="center">
                <TouchableOpacity
                    po="absolute"
                    l={0}
                  onPress={() => {
                    popNavigation();
                  }}>
                  <Icons.BackArrow width={32} height={32} />
                </TouchableOpacity>
                <Text ftsz={17} weight="500">
                  CV Analysis
                </Text>
              </View>
              <ScrollView f={1} contentContainerStyle={{paddingBottom: 80}}>
                <View mt={12} bgc={'#D8E3FC'} asf="center" p={20} br={12}>
                  <Text>Your Overall ATS Score:  4/5</Text>
                </View>
                <View bgc={'#FFF'} mt={32} p={16} btrr={12} btlr={12}>
                    <Text ftsz={14} weight="500">Good: Your CV will pass through ATS and has a good chance of attracting employer attention.</Text>
                    <Text mt={12} ftsz={12} weight="400">Most key elements are well-presented. Focus on fine-tuning your content, ensuring consistent formatting, and optimizing keywords to increase your CV’s impact.</Text>
                </View>
                <View bgc={'#BFD4FF'} h={16} bbrr={12} bblr={12}/>
                <View mt={32}>
                  {
                    data?.map((item, index)=>{
                        return(
                            <View fd="row" pv={12} ph={16} bgc={'rgba(255, 255, 255, 0.75)'} ai="center" jc="space-between" mb={16} key={index?.toString()} br={12}>
                                <Text f={1} ftsz={13} weight="600">{item?.title}</Text>
                                <View br={36} bgc={'rgba(185, 228, 166, 0.4)'} p={8}>
                                    <Text>{item?.score}</Text>
                                </View>
                            </View>
                        )
                    })
                  }
                </View>
                <View mt={16} fd="row" asf="center" ai="center">
                    <View p={8} bgc={'#FFF'} br={100}>
                        <Icons.ThumbsDown/>
                    </View>
                    <Text mh={16}>Rate our Analysis</Text>
                    <View p={8} bgc={'#FFF'} br={100}>
                        <Icons.ThumbsUp/>
                    </View>
                </View>
                <Text mt={16} ftsz={14} weight="600" ta="center">Download your MapOut profile as a standout CV with a high ATS score!</Text>
                <TouchableOpacity onPress={()=>{
                    navigate('Profile');
                }} bgc={'#000'} ai="center" jc="center" pv={16} mt={16} br={12}>
                    <Text ftsz={14} weight="500" c={'#FFF'}>Build your MapOut Profile</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
        </LinearGradient>}
      </View>
    </MainLayout>
  );
};

export default CVATSScreen;
