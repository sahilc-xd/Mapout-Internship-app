import React from "react";
import { View } from "react-native-style-shorthand";
import { Text } from "../../components";
import { monthNames } from "../../utils/constants";

const UserProfileDetails = props => {
  const workDetails = props?.data?.workDetails;
  const educationDetails = props?.data?.educationDetails;
  const technicalSkills = props?.data?.technicalSkills;
  return (
    <View f={1} ph={16} mt={16}>
        {
            (!workDetails?.length>0 || !educationDetails?.length>0 || !technicalSkills?.length>0) && <View bgc={'rgba(217, 217, 217, 0.65)'} w={'100%'} ai='center' jc='center' pv={16} br={12} asf='center'>
                <Text ftsz={14} weight='600'>Nothing to see here.</Text>
            </View>
        }
      {workDetails?.length > 0 && (
        <>
          <Text ftsz={13} weight="300" c={"#444444"}>
            Work Experience
          </Text>
            {
                workDetails?.map((item, index)=>{
                    return(
                        <View mt={8} key={index?.toString()} fd="row">
                            <View mt={8} mr={8} h={7} w={7} br={7} bgc={'#4772F4'}/>
                            <View>
                                <Text ftsz={14} weight="500">{item?.role}</Text>
                                <Text mt={6} ftsz={12} weight="500">{item?.company}</Text>
                                <View mt={6} pr={16} fd="row" ai="center" fw="wrap">
                                    <Text ftsz={12} weight="400" c={'#7F8A8E'}>{monthNames[new Date(item?.start_date)?.getMonth()+1]}, {new Date(item?.start_date)?.getFullYear()} - {item?.still_pursuing ? "Present" : `${monthNames[new Date(item?.end_date)?.getMonth()+1]}, ${new Date(item?.end_date)?.getFullYear()}`}</Text>
                                    {item?.industry && 
                                      <>
                                      <View mh={8} h={4} w={4} br={6} bgc={'#000'}/>
                                      <Text ftsz={12} weight="400" c={'#7F8A8E'}>{item?.industry}</Text>
                                      </>
                                    }
                                    {item?.employment_type &&
                                      <>
                                      <View mh={8} h={4} w={4} br={6} bgc={'#000'}/>
                                      <Text ftsz={12} weight="400" c={'#7F8A8E'}>{item?.employment_type}</Text>
                                      </>
                                    }
                                </View>
                            </View>
                        </View>
                    )
                })
            }
        </>
      )}
      {educationDetails?.length > 0 && (
        <>
          <Text mt={32} ftsz={13} weight="300" c={"#444444"}>
            Education
          </Text>
            {
                educationDetails?.map((item, index)=>{
                    return(
                        <View mt={8} key={index?.toString()} fd="row">
                            <View mt={8} mr={8} h={7} w={7} br={7} bgc={'#4772F4'}/>
                            <View>
                                <Text ftsz={14} weight="500">{item?.college}</Text>
                                {item?.specialisation?.length>0 && <Text mt={6} ftsz={12} weight="500">{item?.specialisation}</Text>}
                                <View mt={6} pr={16} fd="row" ai="center" fw="wrap">
                                <Text ftsz={12} weight="400" c={'#7F8A8E'}>{item?.degree}</Text>
                                    <View mh={8} h={4} w={4} br={6} bgc={'#000'}/>
                                    <Text ftsz={12} weight="400" c={'#7F8A8E'}>{monthNames[new Date(item?.start_date)?.getMonth()+1]}, {new Date(item?.start_date)?.getFullYear()} - {item?.still_pursuing ? "Present" : `${monthNames[new Date(item?.end_date)?.getMonth()+1]}, ${new Date(item?.end_date)?.getFullYear()}`}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })
            }
        </>
      )}
      {technicalSkills?.length > 0 && (
        <>
          <Text mt={32} ftsz={13} weight="300" c={"#444444"}>
            Technical Skills
          </Text>
          <View mt={8} fw="wrap" fd="row" f={1}>
          {technicalSkills?.map(item => {
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
                          {item?.name}
                          {item?.level > 0 && <Text ta="center" weight="600">
                            {" "}
                            |{" "}
                          </Text>}{" "}
                          {item?.level === 1 && "Beginner"}
                          {item?.level === 2 && "Intermediate"}
                          {item?.level === 3 && "Experienced"}
                        </Text>
                      </View>
                    );
                  })}
                  </View>
        </>
      )}
    </View>
  );
};

export default UserProfileDetails;
