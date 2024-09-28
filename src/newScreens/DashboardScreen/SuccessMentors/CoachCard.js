import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native-style-shorthand';
import { navigate } from '../../../utils/navigationService';
import { ICONS } from '../../../constants';
import { Text } from '../../../components';
import { Linking } from 'react-native';
import Icons from '../../../constants/icons';
import logAnalyticsEvents from '../../../utils/logAnalyticsEvent';

const CoachCard = ({ coachText = "", name = "", rating = 0, reviews = 0, img = "", video = "", openModal, linkedInUrl }) => {
    return (
      <View fd="row" jc="space-between">
        <View fd="row" ai="center" f={1}>
          <TouchableOpacity
            onPress={() => {
              if (video?.length > 0) {
                logAnalyticsEvents('coach_video_viewed',{coachName: name || ""});
                navigate("PlayVideoLink", { url: video });
              }
            }}>
            <Image
              w={110}
              h={130}
              br={12}
              defaultSource={{
                uri: "https://mapout-calendly-mentor-img.s3.us-east-2.amazonaws.com/profile_paceholder.png",
              }}
              source={{ uri: img }}
            />
            <TouchableOpacity
              onPress={() => {
                if (video?.length > 0) {
                  logAnalyticsEvents('coach_video_viewed',{coachName: name || ""});
                  navigate("PlayVideoLink", { url: video });
                }
              }}
              po="absolute"
              bgc={"#FFF"}
              asf="center"
              b={8}
              br={100}>
              <ICONS.PlayVideo width={32} height={32} fill={'#000'}/>
            </TouchableOpacity>
          </TouchableOpacity>
          <View ml={12} f={1}>
            <Text ftsz={12} weight="400" c={"#000"}>
              {coachText}
            </Text>
            <View fd="row" ai="center" mv={4} pr={8}>
              <Text numberOfLines={1} mr={4} ftsz={20} weight="700" c={"#17171F"}>
                {name}
              </Text>
              <TouchableOpacity f={1} onPress={() => {
                              logAnalyticsEvents('coach_linkedin_visited',{coachName: name || ""})
                              Linking.openURL(
                                linkedInUrl?.length>0 ?  linkedInUrl :
                                  "https://www.linkedin.com/company/mapoutglobal/",
                              );
                            }}>
                <ICONS.LinkedInIcon width={22} height={22}/>
              </TouchableOpacity>
            </View>
            <View fd="row" ai="center">
              <Icons.Star width={14} height={14} fill={"#F6CA53"} />
              <Text ml={4} ftsz={12} weight="400" c={"#17171F"}>
                {rating}
              </Text>
              <Text c={"rgba(23, 23, 31, 0.5)"} ftsz={12} weight="400">
                {" "}
                ({reviews} reviews)
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          po="absolute"
          r={0}
          onPress={() => {
            openModal();
          }}>
          <ICONS.Info width={24} height={24} fill={"#FFF"} />
        </TouchableOpacity>
      </View>
    );
  };

  export default CoachCard;