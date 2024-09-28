import React, { useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../utils/navigationService";
import Icons from "../../constants/icons";
import { Text } from "../../components";
import { profilePicturePlaceholder } from "../../utils/constants";
import AboutEmployer from "./aboutEmployer";
import JobEmployer from "./jobEmployer";
import CareerTasterEmployer from "./careerTasterEmployer";
import { ICONS } from "../../constants";

const companyData = {
  name: "MapOut",
  industry: "Ed-tech",
  location: "Singapore",
  primaryBrandColor: "#172641",
  primaryTextColor: "#FFF",
  secondaryBrandColor: "#00D3BE",
  secondaryTextColor: "#000",
  logo: "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/mapout-logo.png",
  videoThumbnail:
    "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Task%201.png",
  videoUrl: "",
  tags: ["Ed-tech"],
  headline: "Your AI Career Planner App",
  shortDesc:
    "We are a diversified trading firm innovating across both traditional and cutting-edge markets.",
  about: {
    work: "We merge technology with career wisdom.\n\nWe want to ensure that everyone striving for a successful career finds their perfect support & fit.\n\nWe envision a future where career guidance is more:\n\nAccessible\nBorderless\nBorderless\nTransparent\nInclusive\nPersonalised",
    coreValues: [
      "Inclusivity",
      "Innovation",
      "Empowerment",
      "Community",
      "Adaptability"
    ],
    insider:
      "At MapOut, we're a bunch of innovative minds who hustle hard and are driven to make career planning accessible to everyone.\nHere, you'll work side-by-side with talented individuals who’ll become your teammates, your cheerleaders, and even your friends. Get ready to push boundaries, learn from each other, and celebrate successes together.\n If you're looking for an opportunity in a dynamic and fast-paced environment, driven towards making any career accessible to anyone and career advice scalable, then MapOut might be just the perfect fit for you.",
    images: [
      "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Task%201.png",
      "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Task%201.png",
      "https://s3.ap-south-1.amazonaws.com/s3.mapout.com/Task%201.png",
    ],
    qualities: [
      "Innovative thinkers",
      "Integrity and Accountability",
      "Customer-Centric",
      "Data-driven decision makers",
      "Excellent Communication",
      "Collaborative team players",
    ],
    perks: [
      "Learning & Development Opportunities",
      "Medical Insurance",
      "Supportive Environment",
      "Casual Dress Code",
    ],
  },
};

const EmployerProfile = () => {
  const tabs = ["Tabs", "Details"];
  const [selectedTab, setSelectedTab] = useState(0);

  const updateSelected = (index) =>{
    setSelectedTab(index);
  }

  const renderTabBar = () => {
    return (
      <View ph={16} bgc={"#FFF"}>
        <View fd="row" bw={0.4} mv={16} br={16}>
          <TouchableOpacity
            br={16}
            pv={16}
            onPress={() => {
              setSelectedTab(0);
            }}
            bgc={selectedTab === 0 ? companyData?.primaryBrandColor : "#FFF"}
            f={1}
            jc="center"
            ai="center">
            <Text
              c={selectedTab === 0 ? companyData?.primaryTextColor : "#000"}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            br={16}
            pv={16}
            onPress={() => {
              setSelectedTab(1);
            }}
            bgc={selectedTab === 1 ? companyData?.primaryBrandColor : "#FFF"}
            f={1}
            jc="center"
            ai="center">
            <Text
              c={selectedTab === 1 ? companyData?.primaryTextColor : "#000"}>
              Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            br={16}
            pv={16}
            onPress={() => {
              setSelectedTab(2);
            }}
            bgc={selectedTab === 2 ? companyData?.primaryBrandColor : "#FFF"}
            f={1}
            jc="center"
            ai="center">
            <Text
              c={selectedTab === 2 ? companyData?.primaryTextColor : "#000"}>
              Career taster
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const flatlistRef = useRef(null);

  const renderTabs = () => {
    flatlistRef?.current?.scrollToIndex({ index: 1, animated: true });
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        {index === 0 && renderTabBar()}
        {index === 1 && selectedTab === 0 && (
          <AboutEmployer companyData={companyData} updateSelected={updateSelected}/>
        )}
        {index === 1 && selectedTab === 1 && (
          <JobEmployer renderTabs={renderTabs} updateSelected={updateSelected}/>
        )}
        {index === 1 && selectedTab === 2 && (
          <CareerTasterEmployer renderTabs={renderTabs} updateSelected={updateSelected}/>
        )}
      </>
    );
  };

  const playVideoUrl = ()=>{
    navigate("PlayVideoLink", { url: companyData?.videoUrl });
  }

  const headerComponent = () => {
    {
      return (
        <View>
          <View mh={16} bgc={companyData?.primaryBrandColor} br={24} p={12}>
            <View fd="row" ai="center">
              <View>
                <Image
                  source={{ uri: companyData?.logo || profilePicturePlaceholder }}
                  w={100}
                  h={100}
                  br={100}
                />
              </View>
              <View ml={16}>
                <Text ftsz={18} weight="600" c={companyData?.primaryTextColor}>
                  {companyData?.name}
                </Text>
                <Text ftsz={14} weight="400" c={companyData?.primaryTextColor}>
                  {companyData?.industry}
                </Text>
                <View fd="row" mt={4} ai="center">
                  <Icons.LocationPin stroke={"#FFF"} width={18} height={18} />
                  <Text
                    ftsz={14}
                    weight="400"
                    ml={4}
                    c={companyData?.primaryTextColor}>
                    {companyData?.location}
                  </Text>
                </View>
              </View>
            </View>
            <View mv={16} br={12} jc="center">
              <TouchableOpacity onPress={playVideoUrl} asf="center" z={1} po="absolute">
                <ICONS.PlayButton width={70} height={70} />
              </TouchableOpacity>
              <Image
                source={{ uri: companyData?.videoThumbnail }}
                w={"100%"}
                h={220}
                br={12}
                resizeMode="cover"
              />
            </View>
            <ScrollView>
              <View fd="row" jc="center" fw="wrap" gap={8}>
                {companyData?.tags?.map(item => {
                  return (
                    <View
                      bgc={companyData?.secondaryBrandColor}
                      ph={12}
                      pv={2}
                      br={20}>
                      <Text
                        ftsz={12}
                        weight="500"
                        c={companyData?.secondaryTextColor}>
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
          <View
            mh={16}
            mt={16}
            bgc={companyData?.primaryBrandColor}
            br={16}
            ph={16}
            pv={16}>
            <Text ftsz={16} weight="600" c={companyData?.primaryTextColor}>
              {companyData?.headline}
            </Text>
            <Text ftsz={13} weight="400" c={companyData?.primaryTextColor}>
              {companyData?.shortDesc}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1}>
        <View mh={16} mv={16}>
          <View fd="row" ai="center">
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text ftsz={17} weight="500" c={"#141418"} f={1} ml={16}>
              Company Profile
            </Text>
          </View>
        </View>
        <View f={1}>
          <FlatList
            ref={flatlistRef}
            data={tabs}
            renderItem={renderItem}
            stickyHeaderIndices={[1]}
            ListHeaderComponent={headerComponent}
          />
        </View>
      </View>
    </MainLayout>
  );
};

export default EmployerProfile;
