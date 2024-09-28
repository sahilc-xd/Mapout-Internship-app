import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { api } from "../../redux/api";

const IdealCareerTab = props => {
  const [data, setData] = useState([]);
  const {selectedCareer, setSelectedCareer } = props;
  const [
    getCareerInsights,
    { data: insightsData, isFetching },
  ] = api.useLazyGetCareerInsightsQuery();

  const getData = () => {
    props?.data?.idealCareers?.forEach(item => {
      let type = item?.type;
      type = type.charAt(0).toUpperCase() + type.slice(1);
      let careers = [];
      item?.careers?.forEach(item => {
        careers.push({ type: type, careerName: item?.name });
      });
      setData(prv => {
        return [...careers, ...prv];
      });
    });
  };

  useEffect(() => {
    props?.data?.idealCareers &&
      props?.data?.idealCareers?.length > 0 &&
      getData();
  }, []);

  useEffect(() => {
    if (selectedCareer?.careerName) {
      getCareerInsights({ career: selectedCareer?.careerName });
    }
  }, [selectedCareer]);

  return (
    <>
      {!selectedCareer?.careerName ? (
        <ScrollView>
        <View f={1}>
          <View
            mv={16}
            bgc={"rgba(255, 255, 255, 0.65)"}
            jc="center"
            ai="center"
            pv={16}
            mh={24}
            br={12}>
            <Text ftsz={18} weight="600">
                Your {data?.length} Best-fit Careers
            </Text>
          </View>
          {data?.length > 0 && (
            <FlatList
            ph={24}
                persistentScrollbar={true}
              data={data}
              ItemSeparatorComponent={() => {
                return <View h={8} />;
              }}
              ListFooterComponent={() => {
                return <View h={32} />;
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCareer(item);
                    }}
                    pv={16}
                    ph={16}
                    bw={1}
                    bc={"rgba(255, 255, 255, 1)"}
                    bgc={"rgba(255, 255, 255, 0.65)"}
                    fd="row"
                    jc="space-between"
                    ai="center"
                    br={12}>
                    <View jc="center">
                      <Text c={"#70757F"} ftsz={12} weight="400">
                        #{item?.type} Careers
                      </Text>
                      <View
                        mt={8}
                        pv={8}
                        ph={8}
                        br={20}
                        asf="baseline"
                        bgc={item?.type === "Futuristic" ? "rgba(217, 188, 255, 0.5)" : item?.type === "Freelancing" ? "#B9E4A6" : "#D8E3FC"}>
                        <Text ftsz={14} weight="500">
                          {item?.careerName}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icons.ChevronLeft
                        width={24}
                        height={24}
                        fill={"#000"}
                        style={{
                          transform: [{ rotate: "180deg" }],
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View f={1} mh={24}>
          <TouchableOpacity
            onPress={() => {
              setSelectedCareer(false);
            }}
            mv={16}
            asf="baseline"
            bw={1}
            br={100}
            bgc={"#000"}>
            <Icons.ChevronLeft fill={"#FFF"} width={32} height={32} />
          </TouchableOpacity>
          <View
            pv={16}
            f={1}
            bw={1}
            mb={16}
            bc={"#D9BCFF"}
            br={12}
            bgc={"rgba(255, 255, 255, 0.65)"}>
            {isFetching && insightsData?.data?.insight ? (
              <View f={1} jc="center" ai="center">
                <ActivityIndicator color={"#000"} size={"large"} />
              </View>
            ) : (
              <View ph={16}>
                <Text c={"#7F8A8E"} ftsz={12} weight="400">
                  #{selectedCareer?.type} Career
                </Text>
                <Text ftsz={20} weight="700">
                  {selectedCareer?.careerName}
                </Text>
                <Text c={"#6B6B83"} ftsz={11} weight="400" mt={16}>
                  {insightsData?.data?.insight?.work}
                </Text>
                <View fd="row" mt={16} gap={8}>
                  <View
                    f={1}
                    h={"100%"}
                    pv={16}
                    asf="center"
                    bgc={selectedCareer?.type === "Futuristic" ? "rgba(217, 188, 255, 0.5)" : selectedCareer?.type === "Freelancing" ? "#B9E4A6" : "#D8E3FC"}
                    br={10}
                    bw={0.4}
                    bc={"rgba(255, 255, 255, 0.5)"}
                    ph={8}>
                    <Text
                      ta="center"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      ftsz={16}
                      weight="500">
                      {insightsData?.data?.insight?.salary}
                    </Text>
                    <Text ftsz={12} weight="500" mt={8}>
                      Average Salary
                    </Text>
                    <Text ftsz={12} weight="500" c={"#70757F"}>
                      {insightsData?.data?.country}
                    </Text>
                  </View>
                  <View
                    f={1}
                    h={"100%"}
                    pv={16}
                    asf="center"
                    bgc={selectedCareer?.type === "Futuristic" ? "rgba(217, 188, 255, 0.5)" : selectedCareer?.type === "Freelancing" ? "#B9E4A6" : "#D8E3FC"}
                    br={10}
                    bw={0.4}
                    bc={"rgba(255, 255, 255, 0.5)"}
                    ph={8}>
                    <Text ta="center" ftsz={16} weight="500">
                      {insightsData?.data?.insight?.demand}
                    </Text>
                    <Text ftsz={12} weight="500" mt={8}>
                      Demand
                    </Text>
                    <Text ftsz={12} weight="500" c={"#70757F"}>
                      {insightsData?.data?.country}
                    </Text>
                  </View>
                </View>
                <Text ftsz={16} weight="600" mt={16}>
                  Educational Requirements
                </Text>
                <Text mt={8} c={"#6B6B83"} weight="400" ftsz={11}>
                  {insightsData?.data?.insight?.education}
                </Text>
                <Text ftsz={16} weight="600" mt={16}>
                  Career Path
                </Text>
                <Text c={"#6B6B83"} weight="400" ftsz={11}>
                  as per standard industry practices
                </Text>
                {/* <ScrollView showsHorizontalScrollIndicator={false}  w={'100%'} bw={1} horizontal> */}
                  <View fd="row" mt={16} gap={8}>
                    {insightsData?.data?.insight?.careerPath.map(item => {
                      return (
                        <>
                          <View
                            f={1}
                            h={"100%"}
                            asf="center"
                            bw={1}
                            ph={8}
                            pv={8}
                            bgc={selectedCareer?.type === "Futuristic" ? "rgba(217, 188, 255, 0.5)" : selectedCareer?.type === "Freelancing" ? "#B9E4A6" : "#D8E3FC"}
                            br={10} pb={24}>
                            <Text adjustsFontSizeToFit ftsz={12} weight="600">
                              {item?.title}
                            </Text>
                            <Text po="absolute" b={0} ph={8} ftsz={10} weight="400" c={"#6B6B83"}>
                            {item?.years} years
                            </Text>
                          </View>
                        </>
                      );
                    })}
                  </View>
                {/* </ScrollView> */}
                <Text ftsz={16} weight="600" mt={16}>
                  Industry Culture
                </Text>
                <Text mt={8} c={"#6B6B83"} weight="400" ftsz={11}>
                  {insightsData?.data?.insight?.industryCulture}
                </Text>
              </View>
            )}
          </View>
        </View>
        </ScrollView>
      )}
    </>
  );
};

export default IdealCareerTab;