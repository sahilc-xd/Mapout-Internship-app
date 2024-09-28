import React, { useEffect, useState } from "react";
import { Text } from "../../components";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { useAppSelector } from "../../redux";
import Icons from "../../constants/icons";
import LinearGradient from "react-native-linear-gradient";
import { navigate } from "../../utils/navigationService";
import { profilePicturePlaceholder } from "../../utils/constants";
import { api } from "../../redux/api";
import { useWindowDimensions } from "react-native";
import logAnalyticsEvents from "../../utils/logAnalyticsEvent";

const PreviewProfile = props => {
  const { type = "Personal", updateEditType = false } = props;
  const user = useAppSelector(state => state?.user);
  const [talentboardData, setTalentBoardData] = useState([]);
  const [getTalentBoardData, { data, isSuccess, isFetching }] =
    api.useLazyFetchTalentBoardsQuery();

  useEffect(() => {
    getTalentBoardData({ userId: user?.user_id });
  }, []);

  useEffect(() => {
    if (!isFetching && isSuccess) {
      setTalentBoardData(data?.projects);
    }
  }, [isSuccess, isFetching]);
  const isProfileVideoUploaded =
    user?.profileVideo?.link?.length > 0 ? true : false;
  const tabs = [
    "Basic Info",
    "Work Pref.",
    "Talent Board",
    "Skills",
    "Experience & Education",
  ];
  const [selectedTab, setSelectedTab] = useState(
    type === "Personal"
      ? "Basic Info"
      : type === "Educational"
      ? "Experience & Education"
      : type === "WorkExperience"
      ? "Experience & Education"
      : type === "WorkPreference"
      ? "Work Pref."
      : type === "Skills"
      ? "Skills"
      : type === "TalentBoard"
      ? "Talent Board"
      : type === "Certifications"
      ? "Experience & Education"
      : "Basic Info",
  );

  const updateEditTab = () => {
    const val =
      selectedTab === "Basic Info"
        ? "Personal"
        : selectedTab === "Experience & Education"
        ? type === "Certifications"
          ? "Certifications"
          : type === "Educational"
          ? "Educational"
          : "WorkExperience"
        : selectedTab === "Work Pref."
        ? "WorkPreference"
        : selectedTab === "Skills"
        ? "Skills"
        : selectedTab === "Talent Board"
        ? "Personal"
        : "Personal";
    updateEditType && updateEditType(val);
  };

  useEffect(() => {
    logAnalyticsEvents("preview_profile", { selectedTab: selectedTab });
    updateEditTab();
  }, [selectedTab]);

  const techSkills =
    user?.skillAspirations?.[0]?.technical_skills?.map(item => {
      return {
        skill: item?.name,
        experience:
          item?.level === 1
            ? "Beginner"
            : item?.level === 2
            ? "Intermediate"
            : "Experienced",
      };
    }) || false;
  const educationDetails = user?.educationDetails;
  const certificates = [
    ...user?.allCertificates?.manualCertificates,
    ...user?.allCertificates?.careerTastersCertificates,
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const workData =
    user?.workDetails?.map(item => {
      const sDate = new Date(item?.start_date);
      const endDate = item?.still_pursuing ? false : new Date(item?.end_date);
      return {
        role: item?.role,
        company: item?.company,
        industry: item?.industry,
        employment_type: item?.employment_type,
        responsibilities: item?.responsibilities,
        startDate: sDate?.getDate(),
        startDateMonth: sDate?.getMonth() + 1,
        startDateYear: sDate?.getFullYear(),
        still_pursuing: item?.still_pursuing,
        endDateMonth: item?.still_pursuing ? "" : endDate?.getMonth() + 1,
        endDateYear: item?.still_pursuing ? "" : endDate?.getFullYear(),
        endDate: item?.still_pursuing ? "" : endDate?.getDate(),
      };
    }) || false;
  const educationData =
    educationDetails?.map(item => {
      const sDate = new Date(item?.start_date);
      const eDate = item?.still_pursuing ? false : new Date(item?.end_date);
      const sMonth = sDate.getMonth();
      const sYear = sDate.getFullYear();
      const eMonth = item?.still_pursuing ? "" : eDate?.getMonth();
      const eYear = item?.still_pursuing ? "" : eDate?.getFullYear();
      return {
        college: item?.college,
        specialisation: item?.specialisation,
        degree: item?.degree,
        marks_format: item?.marks_format,
        marks: item?.marks,
        still_pursuing: item?.still_pursuing,
        professors_studied_under: [...item?.professors_studied_under],
        subjects: [...item?.subjects],
        startDateMonth: `${sMonth}`,
        startDateYear: `${sYear}`,
        endDateMonth: `${eMonth}`,
        endDateYear: `${eYear}`,
      };
    }) || false;

  const screenWidth = useWindowDimensions().width - 64;

  return (
    <>
      {/* <DownloadProfileModal showPopup={showPopup} closePopup={closePopup}/> */}
      <ScrollView nestedScrollEnabled>
        <ScrollView
          horizontal
          mt={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}>
          {tabs?.map(item => {
            return (
              <>
                {selectedTab === item && (
                  <LinearGradient
                    colors={["#98B4FC", "#E3D0FB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      marginRight: 16,
                    }}>
                    <Text c={"#000"} ftsz={12} weight="500">
                      {item}
                    </Text>
                  </LinearGradient>
                )}
                {selectedTab !== item && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTab(item);
                    }}
                    style={{ paddingVertical: 12, marginRight: 12 }}>
                    <Text c={"#555555"} ftsz={12} weight="500">
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })}
        </ScrollView>
        <LinearGradient
          colors={["#98B4FC", "#E3D0FB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ marginTop: 8 }}>
          <View h={1} />
        </LinearGradient>
        {selectedTab === "Talent Board" && (
          <>
            <View pv={16} ph={16} gap={16} fw="wrap" fd="row" ai="center">
              {talentboardData?.length > 0 ? (
                talentboardData?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigate("TalentBoardProject", {
                          data: item,
                          talentBoardID: data?.talentBoardID,
                          hideButtons: true,
                        })
                      }
                      key={index.toString()}
                      w={screenWidth / 3}
                      h={screenWidth / 3}>
                      <Image
                        source={{ uri: item?.coverImgUrls?.[0]?.url }}
                        w={"100%"}
                        h={"100%"}
                      />
                      <View
                        pv={2}
                        bgc={"rgba(0, 0, 0, 0.25)"}
                        w={"100%"}
                        po="absolute"
                        b={0}>
                        <Text ftsz={12} weight="400" c={"#FFF"}>
                          {" "}
                          {item?.name}{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View
                  bgc={"rgba(217, 217, 217, 0.65)"}
                  w={"100%"}
                  ai="center"
                  jc="center"
                  pv={16}
                  br={12}
                  asf="center">
                  <Text ftsz={14} weight="600">
                    No projects to show yet.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        {selectedTab === "Basic Info" && (
          <>
            <View mt={4} h={250}>
              {isProfileVideoUploaded ? (
                <Image
                  source={{ uri: user?.profileVideo?.thumbnail }}
                  w={"100%"}
                  h={250}
                  resizeMode="cover"
                />
              ) : (
                <View h={"100%"} jc="center" ai="center">
                  <Text ftsz={15} weight="500" c={"#000"}>
                    No video profile found.
                  </Text>
                </View>
              )}
              {isProfileVideoUploaded && (
                <TouchableOpacity
                  onPress={() => {
                    logAnalyticsEvents("view_profile_video", {});
                    navigate("PlayVideoLink", {
                      url: user?.profileVideo?.link,
                    });
                  }}
                  po="absolute"
                  r={16}
                  b={16}
                  p={8}
                  bgc="rgba(0,0,0,0.4)"
                  br={100}>
                  <Icons.PlayButton width={40} height={40} />
                </TouchableOpacity>
              )}
            </View>
            <View
              bgc={"#FFF"}
              w={150}
              h={150}
              br={200}
              po="absolute"
              t={260}
              asf="center">
              <LinearGradient
                colors={["#B3C8FD", "#F3ECFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                useAngle={true}
                angle={0}
                angleCenter={{ x: 0.5, y: 0.5 }}
                style={{
                  zIndex: 1,
                  borderRadius: 75,
                  marginVertical: 4,
                  width: 150,
                  height: 150,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  defaultSource={{ uri: profilePicturePlaceholder }}
                  source={{
                    uri: user.profilePic
                      ? user.profilePic
                      : "https://mapout-calendly-mentor-img.s3.us-east-2.amazonaws.com/profile_paceholder.png",
                  }}
                  w={130}
                  h={130}
                  br={200}
                />
              </LinearGradient>
            </View>
            <View mh={16} mt={75 + 16}>
              <Text ftsz={20} weight="600" ta="center">
                {user?.name}
              </Text>
              <View mt={16} fd="row" ai="center">
                {user?.career_stage?.length > 0 && (
                  <View fd="row" ai="center" f={1} jc="center">
                    <Icons.Degree width={20} height={20} />
                    <Text numberOfLines={1} ml={8} ftsz={12} weight="400">
                      {user?.career_stage}
                    </Text>
                  </View>
                )}
                {user?.current_location?.length > 0 && (
                  <View fd="row" ai="center" f={1} jc="center">
                    <Icons.LocationPin width={18} height={18} />
                    <Text numberOfLines={1} ml={8} ftsz={12} weight="400">
                      {user?.current_location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View mh={24}>
              <View mt={16} fd="row">
                {user?.gender?.length > 0 && (
                  <View f={1.3}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Gender
                    </Text>
                    <Text mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.gender}
                    </Text>
                  </View>
                )}
                {user?.dob?.length > 0 && (
                  <View f={1}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Date of birth
                    </Text>
                    <Text mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.dob}
                    </Text>
                  </View>
                )}
              </View>
              <View mt={16} fd="row">
                {user?.ethnicity?.length > 0 && (
                  <View f={1.3}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Ethnicity
                    </Text>
                    <Text mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.ethnicity}
                    </Text>
                  </View>
                )}
                {user?.nationality?.length > 0 && (
                  <View f={1}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Nationality
                    </Text>
                    <Text mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.nationality}
                    </Text>
                  </View>
                )}
              </View>
              <View mt={16} fd="row">
                {user?.email?.length > 0 && (
                  <View f={1.3}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Email
                    </Text>
                    <Text pr={16} mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.email}
                    </Text>
                  </View>
                )}
                {user?.mobile && (
                  <View f={1}>
                    <Text ftsz={12} weight="300" c={"#444444"}>
                      Mobile no
                    </Text>
                    <Text mt={8} ftsz={14} weight="500" c={"#000"}>
                      {user?.mobile}
                    </Text>
                  </View>
                )}
              </View>
              {user?.hobbies_interests?.length > 0 && (
                <View mt={16}>
                  <Text ftsz={12} weight="300" c={"#444444"}>
                    Hobbies & Interests
                  </Text>
                  <View mt={8} fw="wrap" fd="row">
                    {user?.hobbies_interests?.map(item => {
                      return (
                        <View
                          mb={8}
                          bgc={"#D8E3FC"}
                          mr={8}
                          ph={10}
                          pv={8}
                          br={20}>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
              {user?.languages?.length > 0 && (
                <View mt={8}>
                  <Text ftsz={12} weight="300" c={"#444444"}>
                    Languages
                  </Text>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    mv={8}
                    horizontal>
                    {user?.languages?.map(item => {
                      return (
                        <View mr={32}>
                          <Text ftsz={14} weight="500">
                            {item?.name}
                          </Text>
                          <LinearGradient
                            colors={["#98B4FC", "#E3D0FB"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ marginRight: 16, marginVertical: 8 }}>
                            <View h={1} />
                          </LinearGradient>
                          <Text c={"#7F8A8E"} weight="500" ftsz={10}>
                            {item?.fluency}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          </>
        )}
        {selectedTab === "Work Pref." && (
          <View mh={24}>
            <View mt={16}>
              {user?.availability?.length > 0 && (
                <>
                  <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                    Available for
                  </Text>
                  {user?.availability?.map((item, index) => {
                    return (
                      <View mb={4} fd="row" ai="baseline">
                        <Text ftsz={12} weight="300" c={"#444444"}>
                          {index + 1}.{" "}
                        </Text>
                        <Text ftsz={14} weight="500">
                          {item.available_for}
                        </Text>
                        <Text ftsz={12} weight="300" c={"#444444"}>
                          {" "}
                          from{" "}
                        </Text>
                        <Text ftsz={14} weight="500">
                          {item.available_from}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
              {user?.work_preference?.length > 0 && (
                <View mt={16}>
                  <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                    Work Preferences
                  </Text>
                  <View fw="wrap" fd="row">
                    {user?.work_preference?.map(item => {
                      return (
                        <View
                          mb={8}
                          bgc={"#D8E3FC"}
                          mr={8}
                          ph={10}
                          pv={8}
                          br={20}>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
              {user?.industry_preferences?.length > 0 && (
                <View mt={16}>
                  <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                    Industry Preferences
                  </Text>
                  <View fw="wrap" fd="row">
                    {user?.industry_preferences?.map(item => {
                      return (
                        <View
                          mb={8}
                          bgc={"#D8E3FC"}
                          mr={8}
                          ph={10}
                          pv={8}
                          br={20}>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
              {user?.role_preferences?.length > 0 && (
                <View mt={16}>
                  <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                    Role Preferences
                  </Text>
                  <View fw="wrap" fd="row">
                    {user?.role_preferences?.map(item => {
                      return (
                        <View
                          mb={8}
                          bgc={"#D8E3FC"}
                          mr={8}
                          ph={10}
                          pv={8}
                          br={20}>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
              {user?.job_search_motivation?.length > 0 && (
                <View mt={16}>
                  <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                    Motivation for Job Search
                  </Text>
                  <View fw="wrap" fd="row">
                    {user?.job_search_motivation?.map(item => {
                      return (
                        <View
                          mb={8}
                          bgc={"#D8E3FC"}
                          mr={8}
                          ph={10}
                          pv={8}
                          br={20}>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        {selectedTab === "Skills" && (
          <View mh={24}>
            {techSkills?.length > 0 && (
              <View mt={16}>
                <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                  Technical Skills
                </Text>
                <View fw="wrap" fd="row" f={1}>
                  {techSkills?.map(item => {
                    return (
                      <View
                        fd="row"
                        ai="center"
                        mb={8}
                        bgc={"#D8E3FC"}
                        mr={8}
                        ph={10}
                        pv={12}
                        br={20}>
                        <Text
                          textBreakStrategy="highQuality"
                          ftsz={12}
                          weight="500"
                          c={"#000"}>
                          {item?.skill}
                          <Text ta="center" weight="600">
                            {" "}
                            |{" "}
                          </Text>{" "}
                          {item?.experience}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {user?.skillAspirations?.[0]?.soft_skills?.length > 0 && (
              <View mt={16}>
                <Text mb={8} ftsz={12} weight="300" c={"#444444"}>
                  Soft Skills
                </Text>
                <View fw="wrap" fd="row" f={1}>
                  {user?.skillAspirations?.[0]?.soft_skills?.map(item => {
                    return (
                      <View
                        mb={8}
                        bgc={"#D8E3FC"}
                        mr={8}
                        ph={10}
                        pv={12}
                        br={20}>
                        <Text ftsz={12} weight="500" c={"#000"}>
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
        {selectedTab === "Experience & Education" && (
          <View mh={24}>
            {workData?.length > 0 && (
              <View mv={16}>
                <Text ftsz={12} weight="300" c={"#444444"}>
                  Work Experience
                </Text>
                <View mt={16}>
                  {workData?.map((item, index) => {
                    return (
                      <View fd="row" ai="flex-start">
                        <View mt={index === 0 ? 10 : 0} ai="center" mr={16}>
                          {index > 0 && <View h={10} w={1} bgc={"#000"} />}
                          <View h={8} w={8} bgc={"#4772F4"} br={8} />
                          <View f={1} w={1} bgc={"#000"} />
                          {index + 1 === educationData?.length && (
                            <View h={8} w={8} bgc={"#7F8A8E"} br={8} />
                          )}
                        </View>
                        <View
                          f={1}
                          mb={index + 1 === educationData?.length ? 0 : 32}>
                          <Text ftsz={14} weight="500" mb={4}>
                            {item?.role}
                          </Text>
                          <Text ftsz={12} weight="500" mb={4}>
                            {item?.company}
                          </Text>
                          <View fd="row" fw="wrap" ai="center">
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>{`${
                              monthNames[parseInt(item?.startDateMonth - 1)]
                            }, ${item?.startDateYear} - ${
                              item?.still_pursuing
                                ? "Present"
                                : `${
                                    monthNames[parseInt(item?.endDateMonth - 1)]
                                  }, ${item?.endDateYear}`
                            }`}</Text>
                            {item?.industry?.length > 0 && (
                              <>
                                <View mh={8} h={4} w={4} br={4} bgc={"#000"} />
                                <Text ftsz={12} weight="400" c={"#7F8A8E"}>
                                  {item?.industry}
                                </Text>
                              </>
                            )}
                            <View mh={8} h={4} w={4} br={4} bgc={"#000"} />
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>
                              {item?.employment_type}
                            </Text>
                          </View>
                          <View mt={8}>
                            {item?.responsibilities?.map(response => {
                              return (
                                <View mb={4} fd="row">
                                  <View mt={5}>
                                    <Icons.Responsiblity />
                                  </View>
                                  <Text mr={16} ml={8} ftsz={11} weight="400">
                                    {response}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {educationData?.length > 0 && (
              <View mv={16}>
                <Text ftsz={12} weight="300" c={"#444444"}>
                  Education
                </Text>
                <View mt={16}>
                  {educationData?.map((item, index) => {
                    return (
                      <View fd="row" ai="flex-start">
                        <View mt={index === 0 ? 10 : 0} ai="center" mr={16}>
                          {index > 0 && <View h={10} w={1} bgc={"#000"} />}
                          <View h={8} w={8} bgc={"#4772F4"} br={8} />
                          <View f={1} w={1} bgc={"#000"} />
                          {index + 1 === educationData?.length && (
                            <View h={8} w={8} bgc={"#7F8A8E"} br={8} />
                          )}
                        </View>
                        <View
                          f={1}
                          mb={index + 1 === educationData?.length ? 0 : 32}>
                          <Text ftsz={14} weight="500" mb={4}>
                            {item?.college}
                          </Text>
                          {item?.specialisation?.length > 0 && (
                            <Text ftsz={12} weight="500" mb={4}>
                              {item?.specialisation}
                            </Text>
                          )}
                          <View fd="row" fw="wrap" ai="center">
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>
                              {item?.degree}
                            </Text>
                            <View mh={8} h={4} w={4} br={4} bgc={"#000"} />
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>
                              {item?.marks_format}:{" "}
                            </Text>
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>
                              {item?.marks}{" "}
                              {item?.marks_format === "Percentage" ? "%" : ""}
                            </Text>
                            <View mh={8} h={4} w={4} br={4} bgc={"#000"} />
                            <Text ftsz={12} weight="400" c={"#7F8A8E"}>{`${
                              monthNames[item?.startDateMonth]
                            }, ${item?.startDateYear} - ${
                              item?.still_pursuing
                                ? "Present"
                                : `${monthNames[item?.endDateMonth]}, ${
                                    item?.endDateYear
                                  }`
                            }`}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {certificates?.length > 0 && (
              <View mv={16}>
                <Text ftsz={12} weight="300" c={"#444444"}>
                  Certificates
                </Text>
                <View mt={16}>
                  {certificates?.map((item, index) => {
                    return (
                      <View fd="row" ai="flex-start">
                        <View mt={index === 0 ? 10 : 0} ai="center" mr={16}>
                          {index > 0 && <View h={10} w={1} bgc={"#000"} />}
                          <View h={8} w={8} bgc={"#4772F4"} br={8} />
                          <View f={1} w={1} bgc={"#000"} />
                          {index + 1 === certificates?.length && (
                            <View h={8} w={8} bgc={"#7F8A8E"} br={8} />
                          )}
                        </View>
                        <View
                          f={1}
                          mb={index + 1 === certificates?.length ? 0 : 32}>
                          <Text
                            ftsz={15}
                            weight="500"
                            mb={4}
                            style={{ textDecorationLine: "underline" }}>
                            {item?.name}
                          </Text>
                          <Text ftsz={12} weight="500" mb={4}>
                            {item?.organisation}
                          </Text>
                          <Text ftsz={12} c={"#7F8A8E"} weight="500" mb={4}>
                            {monthNames[new Date(item?.issueDate)?.getMonth()]},{" "}
                            {new Date(item?.issueDate)?.getFullYear()}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default PreviewProfile;
