import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native-style-shorthand";
import { Text } from "../../../components";
import { ICONS } from "../../../constants";
import CVUploadATS from "./CVUploadATS";
import LinearGradient from "react-native-linear-gradient";

const ResumeATSCard = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const previouslyTaken = true;

  return (
    <>
      <CVUploadATS showModal={showModal} closeModal={toggleModal} />
      {previouslyTaken ? (
        <View
          mt={16}
          mh={24}
          bgc={"rgba(255,255,255,0.75)"}
          pv={16}
          ph={16}
          br={20}>
          <Text ftsz={18} weight="600">
            CV Analysis - Get your ATS Score
          </Text>
          <Text mt={8} ftsz={13} weight="400" c={"rgba(23, 23, 31, 0.5)"}>
            Identify the{" "}
            <Text ftsz={13} weight="400" c={"#000"}>
              strengths and weaknesses in your CV
            </Text>{" "}
            to determine if it can successfully pass through Applicant Tracking
            Systems (ATS) and reach employers.
          </Text>
          <View mt={8} fd="row" ai="center" jc="space-between">
            <Text ftsz={12} weight="400" c={"#FF8C6B"}>
              3-5 minutes
            </Text>
            <View fd="row" ai="center">
              <ICONS.Star width={16} height={16} fill={"#FFD439"} />
              <Text ml={4} ftsz={12} weight="600">
                5.0
              </Text>
              <Text c={"rgba(23, 23, 31, 0.5)"} ml={4} ftsz={12} weight="400">
                (25+ reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleModal}
            br={12}
            mt={12}
            bgc={"#000"}
            w={"100%"}
            jc="center"
            ai="center"
            ph={64}
            pv={12}>
            <Text ftsz={14} weight="500" c={"#FFF"}>
              Discover
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LinearGradient
          colors={["#FFFFFF", "#E5D1FF", "#D4E0FF"]}
          useAngle={true}
          angle={135}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.1, 0.6, 1]}
          style={{
            marginTop: 16,
            marginHorizontal: 24,
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}>
          <Text ftsz={18} weight="600">
            CV Analysis - Get your ATS Score
          </Text>
          <View mv={8} fd="row" ai="center" jc="space-between">
            <Text ftsz={12} weight="400" c={"#FF8C6B"}>
              3-5 minutes
            </Text>
            <View fd="row" ai="center">
              <ICONS.Star width={16} height={16} fill={"#FFD439"} />
              <Text ml={4} ftsz={12} weight="600">
                5.0
              </Text>
              <Text c={"rgba(23, 23, 31, 0.5)"} ml={4} ftsz={12} weight="400">
                (25+ reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            br={12}
            mt={16}
            bgc={"#000"}
            w={"100%"}
            jc="center"
            ai="center"
            ph={64}
            pv={12}>
            <Text ftsz={14} weight="500" c={"#FFF"}>
              View results
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            br={12}
            mt={12}
            bgc={"#FFF"}
            w={"100%"}
            jc="center"
            ai="center"
            ph={64}
            pv={12}>
            <Text ftsz={14} weight="500" c={"#000"}>
              Retake
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </>
  );
};

export default ResumeATSCard;
