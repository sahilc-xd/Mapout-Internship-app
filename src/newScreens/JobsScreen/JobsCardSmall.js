import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native-style-shorthand";
import { ICONS } from "../../constants";
import { Text } from "../../components";
import Icons from "../../constants/icons";
import { Linking, useWindowDimensions } from "react-native";
import { navigate } from "../../utils/navigationService";
import { useAppSelector } from "../../redux";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";
import { api } from "../../redux/api";
import { companyLogoPlaceholder } from "../../utils/constants";
import { useDebounceClick } from "../../hooks/useDebounceClick";

const JobsCardSmall = props => {
  const { updateSaved = false, hideScore = false } = props;
  const width = useWindowDimensions().width - 32;
  const user = useAppSelector(state => state?.user);
  const size = props?.size || 1;
  const {
    company,
    title,
    logo,
    location,
    required_experience,
    via,
    thumbnail,
    job_id,
    isViewed,
    score = false,
    isSaved = 0,
    role_type = "",
  } = props?.item;
  const [viewed, setViewed] = useState(
    props?.item?.isViewed?.is_viewed || false,
  );
  const [viewedDate, setViewedDate] = useState(
    new Date(props?.item?.isViewed?.viewed_at) || null,
  );
  const [setJobViewed, { isSuccess }] = api.useViewedJobsMutation();
  const [saveJob, { isSuccess: jobSaveSuccess }] = api.useSaveJobMutation();
  const [unSaveJob, { isSuccess: jobUnSaveSuccess }] =
    api.useUnSaveJobMutation();

  useEffect(() => {
    if (isSuccess) {
      setViewed(true);
      setViewedDate(new Date());
    }
  }, [isSuccess]);

  useEffect(() => {
    if (jobSaveSuccess) {
      logAnalyticsEvents("job_saved", { job_id: props?.item?.link });
      updateSaved && updateSaved({ url: props?.item?.link, save: 1 });
    }
  }, [jobSaveSuccess]);

  useEffect(() => {
    if (jobUnSaveSuccess) {
      updateSaved && updateSaved({ url: props?.item?.link, save: 0 });
    }
  }, [jobUnSaveSuccess]);

  const bgColor = score > 75 ? "#3F8F61" : score > 50 ? "#F6CA53" : "#FD8A53";
  const textColor = score > 75 ? "#FFF" : "#000";

  const viewJob = () => {
    setJobViewed({ user_id: user?.user_id, link: props?.item?.link });
  };

  const handleApplyNowClicked = () => {
    viewJob();
    let url = props?.item?.link;
    logAnalyticsEvents("clicked_apply_now", { url: url });
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  };

  const handleSaveJob = () => {
    const APIdata = {
      user_id: user?.user_id,
      link: props?.item?.link,
    };
    if (isSaved) {
      logAnalyticsEvents("unsave_job", { link: props?.item?.link });
      unSaveJob(APIdata);
    } else {
      logAnalyticsEvents("save_job", { link: props?.item?.link });
      saveJob(APIdata);
    }
  };

  const cardClicked = useDebounceClick(() => {
    setJobViewed({ user_id: user?.user_id, link: props?.item?.link });
    navigate("JobDetailsScreen", {
      data: props?.item,
      updateSaved: updateSaved,
      hideScore: false,
    });
  }, 200)

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={cardClicked}
      pv={8}
      ph={16}
      h={240}
      jc="center"
      asf="flex-start"
      mr={16}
      w={width * size}
      bw={0.4}
      br={20}
      bc={"#7F8A8E"}
      bgc={"rgba(255, 255, 255, 0.4)"}>
      <View fd="row" jc="space-between">
        <View f={1} fd="row" ai="center">
          <View fd="row">
            <View w={45} h={45} br={23} bgc={'#FFF'}>
            <Image
              source={{ uri: logo?.length>0 ? logo : companyLogoPlaceholder }}
              style={{ width: 45, height: 45, borderRadius: 23 }}
              resizeMode="contain"
            />
            </View>
          </View>
          <Text
            ftsz={14}
            weight="400"
            c={"#17171F"}
            ml={8}
            f={1}
            numberOfLines={1}>
            {company}
          </Text>
        </View>
        {!hideScore && (
          <View ml={8}>
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
          </View>
        )}
      </View>
      <View mv={8}>
        <Text numberOfLines={1} c={"#17171F"} ftsz={16} weight="500">
          {title}
        </Text>
        <View fd="row" ai="center" w={"100%"} of="hidden">
          <Text ftsz={12} c={"rgba(23, 23, 31, 0.5)"} weight="400">
            {location}
          </Text>
          <View mh={4} h={4} w={4} bgc={"rgba(23, 23, 31, 0.5)"} br={4} />
          <Text
            numberOfLines={1}
            ftsz={12}
            c={"rgba(23, 23, 31, 0.5)"}
            weight="400">
            {role_type}
          </Text>
          {via?.length > 0 && (
            <>
              <View mh={4} h={4} w={4} bgc={"rgba(23, 23, 31, 0.5)"} br={4} />
              <Text
                f={1}
                numberOfLines={1}
                ftsz={12}
                c={"rgba(23, 23, 31, 0.5)"}
                weight="400">
                via {via}
              </Text>
            </>
          )}
        </View>
        <View jc="center" h={40} mv={8}>
          {viewed && viewedDate ? (
            <>
              <View
                pv={4}
                bgc={"#D8E3FC"}
                ph={8}
                br={16}
                asf="flex-start"
                fd="row"
                ai="center">
                <Icons.Eye width={20} height={20} />
                <Text c={"#333333"} ftsz={12} weight="400" ml={4}>
                  Last viewed on {viewedDate?.getDate()}.
                  {viewedDate?.getMonth() + 1}.{viewedDate?.getFullYear()}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
        <View fd="row">
          <TouchableOpacity
            onPress={handleSaveJob}
            jc="center"
            ai="center"
            p={8}
            bw={1}
            br={12}
            bc={"#D8E3FC"}>
            {props?.item?.isSaved ? (
              <Icons.SaveJob
                width={20}
                height={20}
                stroke={"#000"}
                fill={"#000"}
              />
            ) : (
              <Icons.SaveJob width={20} height={20} stroke={"#000"} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApplyNowClicked}
            pv={8}
            br={12}
            jc="center"
            ai="center"
            bgc={"#000"}
            ml={8}
            f={1}>
            <Text ftsz={16} weight="500" c={"#FFF"}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobsCardSmall;
