import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { ICONS } from "../../constants";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { popNavigation } from "../../utils/navigationService";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { Linking } from "react-native";
import { api } from "../../redux/api";
import { useAppSelector } from "../../redux";

const JobDetailsScreen = props => {
  const data = props?.route?.params?.data;
  const updateSaved = props?.route?.params?.updateSaved || false;
  const hideScore = props?.route?.params?.hideScore || false;
  const user = useAppSelector(state => state?.user);
  const {
    company,
    title,
    logo,
    location,
    required_experience,
    via,
    thumbnail,
    job_id,
    role_type,
    score = false,
    description,
    isSaved,
  } = data;
  const [imgLoadSuccess, setImgLoadSuccess] = useState(false);
  const bgColor = score > 75 ? "#3F8F61" : score > 50 ? "#F6CA53" : "#FD8A53";
  const textColor = score > 75 ? "#FFF" : "#000";
  const [setJobViewed, { isSuccess }] = api.useViewedJobsMutation();
  const [saved, setSaved] = useState(isSaved || false);
  const viewJob = () => {
    setJobViewed({ user_id: user?.user_id, link: data?.link });
  };
  const [saveJob, { isSuccess: jobSaveSuccess }] = api.useSaveJobMutation();
  const [unSaveJob, { isSuccess: jobUnSaveSuccess }] =
    api.useUnSaveJobMutation();

  const handleSaveJob = () => {
    const APIdata = {
      user_id: user?.user_id,
      link: data?.link,
    };
    if (saved) {
      logAnalyticsEvents('unsave_job', {link: data?.link});
      unSaveJob(APIdata);
    } else {
      logAnalyticsEvents('save_job', {link: data?.link});
      saveJob(APIdata);
    }
  };

  useEffect(() => {
    if (jobSaveSuccess) {
      logAnalyticsEvents("job_saved", {job_id: data?.link});
      setSaved(!saved);
      updateSaved && updateSaved({ url: data?.link, save: 1 });
    }
  }, [jobSaveSuccess]);

  useEffect(() => {
    if (jobUnSaveSuccess) {
      setSaved(!saved);
      updateSaved && updateSaved({ url: data?.link, save: 0 });
    }
  }, [jobUnSaveSuccess]);

  const handleApplyNowClicked = () => {
    viewJob();
    let url = data?.link;
    logAnalyticsEvents("clicked_apply_now", { url: url });
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./JobsBackground.png")}
        resizeMode="cover">
        <View mt={16} f={1} mh={24}>
          <View mb={16} fd="row" jc="space-between" ai="center">
            <TouchableOpacity
              onPress={() => {
                popNavigation();
              }}>
                <Icons.BackArrow width={32} height={32}/>
            </TouchableOpacity>
            <Text ftsz={17} weight="500">
              Job description
            </Text>
            <TouchableOpacity onPress={handleSaveJob}>
              {saved ? <Icons.SaveJob fill={'#000'}/> : <Icons.SaveJob/>}
            </TouchableOpacity>
          </View>
          <View fd="row" ai="center">
            <View f={1} fd="row" ai="center">
              <View mr={8}>
                {logo?.length > 0 && (
                  <Image
                    onLoad={() => setImgLoadSuccess(true)}
                    source={{ uri: logo }}
                    style={{ width: 45, height: 45, borderRadius: 23 }}
                    resizeMode="contain"
                  />
                )}
                {!imgLoadSuccess && (
                  <View
                    bgc={"#F8F8F8"}
                    w={45}
                    h={45}
                    br={45}
                    jc="center"
                    ai="center">
                    <ICONS.ExperienceIcon width={20} height={20} />
                  </View>
                )}
              </View>
              <View f={1}>
                <Text ftsz={12} weight="500">
                  {company}
                </Text>
                <Text>{title}</Text>
                <Text>via {via}</Text>
              </View>
            </View>
            {!hideScore && <View ml={8}>
              <View w={45} h={45} mr={4}>
                {score && (
                  <View
                    bgc={bgColor}
                    w={45}
                    h={45}
                    br={45}
                    jc="center"
                    ai="center">
                    <Text
                      ph={6}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      ftsz={10}
                      style={{ color: textColor, textAlign: "center" }}>
                      {`${score} %`}
                    </Text>
                    <Text
                      ph={8}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      ftsz={10}
                      style={{ color: textColor, textAlign: "center" }}>
                      {`Match`}
                    </Text>
                  </View>
                )}
              </View>
            </View>}
          </View>
          <View mt={16} fd="row" ai="center">
            <Text c={"#333333"} ftsz={11} weight="400">
              {location}
            </Text>
            <View mh={8} h={4} w={4} bgc={"#000"} br={4} />
            <Text c={"#333333"} ftsz={11} weight="400">
              {role_type}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleApplyNowClicked}
            mt={16}
            br={12}
            pv={12}
            bgc={"#000"}
            ai="center"
            jc="center">
            <Text ftsz={14} weight="500" c={"#FFF"}>
              Apply now
            </Text>
          </TouchableOpacity>
          <View mv={16} w={"100%"} bw={1} bc={"#FFF"} />
          <Text mb={8} ftsz={14} weight="500">
            Job Description
          </Text>
          <ScrollView>
            <Text ftsz={12} weight="400" pb={64} mt={16}>
              {description}
            </Text>
          </ScrollView>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default JobDetailsScreen;
