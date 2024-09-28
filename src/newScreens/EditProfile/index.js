import React, { useState } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import PersonalDetails from "./personal";
import EducationalDetails from "./educational";
import { Text } from "../../components";
import MainLayout from "../../components/MainLayout";
import WorkPreferenceDetails from "./workPreference";
import WorkExperience from "./workExperience";
import SkillDetails from "./skills";
import Icons from "../../constants/icons";
import PreviewProfile from "./previewProfile";
import { popNavigation } from "../../utils/navigationService";
import DownloadProfileModal from "./DownloadProfileModal";
import { PanResponder } from "react-native";
import Certifications from "./certifications";

const EditProfile = props => {
  const [selectedTab, setSelectedTab] = useState(props?.route?.params?.tab || "Edit");
  const [showPopup, setShowPopup] = useState(false);
  const [editType, setEditType] = useState(
    props?.route?.params?.type || "Personal",
  );

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleButtonPress = () => {
    if (editType === "Personal") {
      setEditType("Educational");
    } else if (editType === "Skills") {
      setEditType("WorkPreference");
    } else if (editType === "Educational") {
      setEditType("WorkExperience");
    } else if (editType === "WorkExperience") {
      setEditType("Skills");
    } else if (editType === "WorkPreference") {
      setEditType("Certifications");
    } else if (editType === "Certifications") {
      setEditType("Certifications");
    }
  };

  const edit = () => {
    switch (editType) {
      case "Personal": {
        return <PersonalDetails handleButtonPress={handleButtonPress} />;
      }

      case "Educational": {
        return <EducationalDetails handleButtonPress={handleButtonPress} />;
      }

      case "WorkPreference": {
        return <WorkPreferenceDetails handleButtonPress={handleButtonPress} />;
      }

      case "WorkExperience": {
        return <WorkExperience handleButtonPress={handleButtonPress} />;
      }

      case "Skills": {
        return <SkillDetails handleButtonPress={handleButtonPress} />;
      }
      case "Certifications":{
        return <Certifications handleButtonPress={handleButtonPress}/>;
      }
    }
  };

  const onPressNext = ()=>{
    setSelectedTab((prv)=>{
      if(prv === "Edit"){
        return "Preview"
      }
      else{
        return prv
      }
    })
  }

  const updateEditType= (val)=>{
     setEditType(val) 
  }

  const onPressPrevious = ()=>{
    setSelectedTab((prv)=>{
      if(prv === "Preview"){
        return "Edit"
      }
      else{
        return prv
      }
    })
  }

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
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
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("./EditProfileBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center" >
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            po="absolute"
            l={16}>
              <Icons.BackArrow width={32} height={32}/>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            {selectedTab === "Edit" ? (
              <>
                {editType === "Personal" ? "Personal Details" : ""}
                {editType === "Educational" ? "Educational Details" : ""}
                {editType === "WorkExperience" ? "Work Experience" : ""}
                {editType === "Skills" ? "Skills" : ""}
                {editType === "WorkPreference" ? "Work Preferences" : ""}
                {editType === "Certifications" ? "Certifications" : ""}
              </>
            ) : (
              "Preview"
            )}
          </Text>
          <View po="absolute" r={8} fd="row" ai="center">
            {selectedTab === "Edit" ? (
              <>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setShowPopup(true);
                  }}
                  hitSlop={16}
                  mr={8}
                  fd="row"
                  ai="center">
                  <View mh={2} h={5} w={5} br={4} bgc={"#000"} />
                  <View mh={2} h={5} w={5} br={4} bgc={"#000"} />
                  <View mh={2} h={5} w={5} br={4} bgc={"#000"} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View fd="row">
          <TouchableOpacity
            onPress={() => {
              setSelectedTab("Edit");
            }}
            f={1}
            ai="center"
            bc={selectedTab === "Edit" ? "#48A022" : "#7F8A8E"}
            bbw={selectedTab === "Edit" ? 2 : 1}
            pb={8}>
            <Text ftsz={14} weight="400">
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab("Preview");
            }}
            f={1}
            ai="center"
            bc={selectedTab === "Preview" ? "#48A022" : "#7F8A8E"}
            bbw={selectedTab === "Preview" ? 2 : 1}
            pb={8}>
            <Text ftsz={14} weight="400">
              Preview
            </Text>
          </TouchableOpacity>
        </View>
        <View f={1}>
          {selectedTab === "Edit" ? <View f={1} {...panResponder.panHandlers}>{edit()}</View> : <PreviewProfile updateEditType={updateEditType} type={editType}/>}
          {selectedTab === "Preview" && (
            <DownloadProfileModal showPopup={showPopup} closePopup={closePopup} />
          )}
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default EditProfile;
