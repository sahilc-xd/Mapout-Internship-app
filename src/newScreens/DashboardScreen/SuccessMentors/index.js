
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native-style-shorthand';
import { Text } from '../../../components';
import { navigate } from '../../../utils/navigationService';
import { api } from '../../../redux/api';
import CustomModal from '../../../components/CustomModal';
import logAnalyticsEvents from '../../../utils/logAnalyticsEvent';
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { homeActions } from "../../../redux/homeSlice";
import CoachCard from './CoachCard';

const SuccessMentors = () => {
  const dispatch = useDispatch();
  const [careerAdvisorData, setCareerAdvisorData] = useState(false);
  const [brandCoachData, setBranchCoachData] = useState(false);
  const [getCareerAdvisor, { data, isSuccess }] =
    api.useLazyGetCareerAdvisorQuery();
  const [
    getBrandCoach,
    { data: brandCoachDetails, isSuccess: brandCoachSuccess },
  ] = api.useLazyGetBrandCoachQuery();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    heading: "Career advisor",
    text: "Your Career Advisor is an HR expert dedicated to your success. With their deep understanding of employers expectations, they work alongside you to enhance your resume, boost your interview skills, tailor a job search plan for you, and provide in-the-moment career advice to ensure you land the opportunities you seek.",
  });

  const closeModal = () => {
    setShowModal(false);
  };

  const openModalCareerAdvisor = () => {
    logAnalyticsEvents('info_career_coach',{});
    setModalData({
      heading: "Career advisor",
      text: "Your Career Advisor is an HR expert dedicated to your success. With their deep understanding of employers expectations, they work alongside you to enhance your resume, boost your interview skills, tailor a job search plan for you, and provide in-the-moment career advice to ensure you land the opportunities you seek.",
    });
    setShowModal(true);
  };

  const openModalBrandCoach = () => {
    logAnalyticsEvents('info_brand_coach',{});
    setModalData({
      heading: "Personal Brand Coach",
      text: "7 seconds. That’s all it takes to form a first impression. With Your Personal Brand Coach, master the art of seizing these crucial moments with impactful body language, refined communication skills, and compelling self-presentation. Make every second count to leave an unforgettable impression on employers and excel in your career journey.",
    });
    setShowModal(true);
  };

  useEffect(() => {
    getCareerAdvisor();
    getBrandCoach();
  }, []);
  
  useEffect(() => {
    if (isSuccess) {
      setCareerAdvisorData(data);
      dispatch(homeActions.updatePersonalCoach(data))
    }
  }, [isSuccess]);
  
  useEffect(() => {
    if (brandCoachSuccess) {
      setBranchCoachData(brandCoachDetails);
    }
  }, [brandCoachSuccess]);

  const handleBCSessionClicked = () => {
      logAnalyticsEvents("Book_Session_BC", {});
      navigate("Booking_page", {
      source: brandCoachData?.bookingLink,
    });
  }

  const handleCCSessionClicked = () => {
      logAnalyticsEvents("Book_Session_CC", {});
      navigate("Booking_page", {
        source: careerAdvisorData?.bookingLink,
      });
  }

  return (
    <>
      <CustomModal
        showModal={showModal}
        heading={modalData?.heading}
        text={modalData?.text}
        closeModal={closeModal}
      />
      {careerAdvisorData && brandCoachData && (
        <View mv={16} mh={24}>
          <Text ftsz={18} weight="400" c={"#17171F"} mv={8}>
            Your Success Coaches
          </Text>
          <LinearGradient colors={["#C2ECCC","#FFFFFF"]} useAngle={true} angle={135} angleCenter={{x:0.5,y:0.5}} style={{borderRadius: 12}}>
          <TouchableOpacity
            onPress={() => {
              navigate("CoachingScreen", {
                type: "career-coach",
                tab: "Profile",
                data: { ...careerAdvisorData },
              });
            }}
            pv={24}
            ph={16}
            br={20}>
            <CoachCard
              openModal={openModalCareerAdvisor}
              video={careerAdvisorData?.video}
              img={careerAdvisorData?.picture}
              coachText={"Your  personal career coach"}
              name={`${careerAdvisorData?.firstName} ${careerAdvisorData?.lastName}`}
              rating={careerAdvisorData?.ratings}
              reviews={careerAdvisorData?.reviews}
              linkedInUrl= {careerAdvisorData?.linkedInUrl}
            />
            <View fd="row" gap={8} mt={16}>
              <TouchableOpacity
                onPress={handleCCSessionClicked}
                br={12}
                jc="center"
                ai="center"
                pv={12}
                bgc={"#000"}
                f={1}>
                <Text ftsz={14} weight="400" c={"#FFF"}>
                  Book 1-1 session
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => {
                navigate("CoachingScreen", {
                    type: "career-coach",
                    tab: "Chat",
                    data: { ...careerAdvisorData },
                  });
                }}
                fd="row"
                br={12}
                jc="center"
                ai="center"
                pv={12}
                bgc={"#000000"}
                f={1}>
                <Text mr={4} ftsz={14} weight="400" c={"#FFF"}>
                  Chat
                </Text>
              </TouchableOpacity> */}
            </View>
          </TouchableOpacity>
          </LinearGradient>
          <View mh={64} fd="row" jc="space-between">
            <View h={16} w={4} bgc={"#FFF"} />
            <View h={16} w={4} bgc={"#FFF"} />
          </View>
          <LinearGradient colors={["rgba(225, 203, 255, 0.8)","rgba(255, 255, 255, 1)"]} useAngle={true} angle={115} angleCenter={{x:0.5,y:0.5}} style={{borderRadius: 12}}>
          <TouchableOpacity
            onPress={() => {
              navigate("CoachingScreen", {
                type: "brand-coach",
                tab: "Profile",
                data: { ...brandCoachData },
              });
            }}
            pv={24}
            ph={16}
            br={20}>
            <CoachCard
              openModal={openModalBrandCoach}
              video={brandCoachData?.video}
              img={brandCoachData?.picture}
              coachText={"Your personal brand coach"}
              name={`${brandCoachData?.firstName} ${brandCoachData?.lastName}`}
              rating={brandCoachData?.ratings}
              reviews={brandCoachData?.reviews}
              linkedInUrl= {brandCoachData?.linkedInUrl}
            />
            <View fd="row" gap={8} mt={16}>
              <TouchableOpacity
                onPress={handleBCSessionClicked}
                br={12}
                jc="center"
                ai="center"
                pv={12}
                bgc={"#000000"}
                f={1}>
                <Text ftsz={14} weight="500" c={"#FFF"}>
                  Book 1-1 session
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </>
  );
};

export default SuccessMentors;
