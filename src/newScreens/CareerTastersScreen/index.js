import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import LinearGradient from "react-native-linear-gradient";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from "../../constants/icons";
import { Text } from "../../components";
import { navigate, popNavigation } from "../../utils/navigationService";
import { profilePicturePlaceholder } from "../../utils/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { api } from "../../redux/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Share from "react-native-share";

const Tabs = ["About", "Tasks", "Reviews"];

const Stepper = () => {
  return (
    <View fd="row" ph={32} jc="space-between">
      <View h={14} bgc={"#FFF"} w={4} />
      <View h={14} bgc={"#FFF"} w={4} />
    </View>
  );
};

const CareerTasterScreen = props => {
  const { id = false } = props?.route?.params;
  const [selectedTab, setSelectedTab] = useState("About");
  const { bgcColor = "rgba(102, 145, 255, 0.4)" } = props;
  const flatlistRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [allData, setAllData] = useState(false);
  const [getDetails, { data, isSuccess, isFetching, isError }] =
    api.useLazyGetCareerTasterByIdQuery();
  const [
    register,
    { isSuccess: isSuccessRegister, isLoading: isLoadingRegister },
  ] = api.useRegisterCareerTasterMutation();

  useEffect(() => {
    if (isError) {
      popNavigation();
    }
  }, [isError]);

  const { careerTaster: details = false, feedbacks: reviews = [] } = allData;

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setAllData(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    id && getDetails({ careerTasterId: id });
  }, []);

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View br={18} p={3} bgc={"#FFF"}>
          <View fd="row" br={18}>
            {Tabs.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTab(item)}
                  pv={12}
                  bgc={selectedTab === item ? "#000" : "#FFF"}
                  key={item?.toString()}
                  f={1}
                  br={18}
                  jc="center"
                  ai="center">
                  <Text
                    c={selectedTab === item ? "#FFF" : "#000"}
                    ftsz={14}
                    weight="600">
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }
    if (index === 1) {
      if (selectedTab === "About") {
        return (
          <View>
            <Stepper />
            <View bgc={"rgba(102, 145, 255, 0.3)"} br={16} ph={16} pv={16}>
              <Text ftsz={12} weight="600" ta="center" c={"#17171F"}>
                {details?.description}
              </Text>
            </View>
            <Stepper />
            <View p={16} bgc={"rgba(255, 255, 255, 0.75)"} br={16}>
              <Text ftsz={16} weight="600" c={"#0F0F10"}>
                About this program
              </Text>
              <Text mt={8} ftsz={13} weight="400" c={"#0F0F10"}>
                {details?.about?.overview}
              </Text>
              <Text mt={16} ftsz={16} weight="600" c={"#0F0F10"}>
                Skills you will gain & showcase
              </Text>
              <View mt={8} fd="row" fw="wrap" gap={8}>
                {details?.about?.skills?.map(item => {
                  return (
                    <View
                      key={item?.toString()}
                      bgc={"rgba(102, 145, 255, 0.5)"}
                      pv={4}
                      ph={12}
                      br={8}>
                      <Text>{item}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <Stepper />
            <View p={16} bgc={"rgba(255, 255, 255, 0.75)"} br={16}>
              <Text ftsz={16} weight="600" c={"#0F0F10"}>
                Who is this program for:
              </Text>
              {details?.about?.targetAudience?.map((item, index) => {
                return (
                  <Text
                    key={index.toString()}
                    mt={index === 0 ? 8 : 2}
                    ftsz={13}
                    weight="400"
                    c={"#0F0F10"}>
                    {item}
                  </Text>
                );
              })}
            </View>
            <Stepper />
            <View p={16} bgc={"rgba(255, 255, 255, 0.75)"} br={16}>
              <Text ftsz={16} weight="600" c={"#0F0F10"}>
                What you’ll need
              </Text>
              <View mt={8} fd="row" fw="wrap" gap={8}>
                {details?.about?.requirements?.map((item, index) => {
                  return (
                    <View
                      key={index?.toString()}
                      bgc={"rgba(102, 145, 255, 0.5)"}
                      pv={4}
                      ph={12}
                      br={8}>
                      <Text>{item}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <Stepper />
            <View p={16} bgc={"rgba(255, 255, 255, 0.75)"} br={16}>
              <Text ftsz={16} weight="600" c={"#0F0F10"}>
                What you’ll do
              </Text>
              <View mt={8}>
                {details?.about?.activities?.map((item, index) => {
                  return (
                    <View
                      key={index?.toString()}
                      fd="row"
                      mt={index === 0 ? 0 : 4}>
                      <View mt={10} h={4} w={4} bgc={"#000"} br={4} mr={8} />
                      <Text f={1} ftsz={13} weight="400" c={"#0F0F10"}>
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        );
      } else if (selectedTab === "Tasks") {
        return (
          <>
            {details?.tasks?.map((item, index) => {
              return (
                <View key={index.toString()}>
                  <Stepper />
                  <View bgc={"rgba(255, 255, 255, 0.75)"} p={16} br={16}>
                    <View fd="row" ai="flex-start" jc="space-between">
                      <Text f={1} ftsz={16} weight="600" c={"#0F0F10"}>
                        Task {index + 1}: {item?.title}
                      </Text>
                      <View
                        bgc={"rgba(102, 145, 255, 0.5)"}
                        pv={4}
                        ph={8}
                        br={8}>
                        <Text>{item?.estimatedCompletionTime}</Text>
                      </View>
                    </View>
                    <View mt={8}>
                      <Text c={"#0F0F10"} ftsz={16} weight="600">
                        What you’ll learn
                      </Text>
                      <Text mt={4} c={"#0F0F10"} ftsz={13} weight="400">
                        {item?.whatYoullLearn}
                      </Text>
                      <Text mt={16} c={"#0F0F10"} ftsz={16} weight="600">
                        What you’ll do
                      </Text>
                      <View mt={4}>
                        {item?.whatYoullDo?.map((item, index) => {
                          return (
                            <View
                              key={index?.toString()}
                              fd="row"
                              mt={index === 0 ? 0 : 4}>
                              <View
                                mt={10}
                                h={4}
                                w={4}
                                bgc={"#000"}
                                br={4}
                                mr={8}
                              />
                              <Text f={1} ftsz={13} weight="400" c={"#0F0F10"}>
                                {item}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        );
      } else if (selectedTab === "Reviews") {
        return (
          <>
            {reviews?.length > 0 ? (
              reviews?.map((item, index) => {
                return (
                  <View key={index?.toString()}>
                    <Stepper />
                    <View>
                      <View
                        bgc={"rgba(102, 145, 255, 0.3)"}
                        ph={16}
                        h={80}
                        btrr={16}
                        btlr={16}
                        jc="flex-end">
                        <View fd="row" asf="flex-end" mb={8}>
                          {[...Array(item?.rating)]?.map((item, index) => {
                            return (
                              <Icon
                                key={index.toString()}
                                name="star"
                                size={16}
                                color="#FFC107"
                              />
                            );
                          })}
                          {[...Array(5 - item?.rating)]?.map((item, index) => {
                            return (
                              <Icon
                                key={index.toString()}
                                name="star"
                                size={16}
                                color="#FFFFFF"
                              />
                            );
                          })}
                        </View>
                      </View>
                      <View
                        bgc={"rgba(255, 255, 255, 0.75)"}
                        ph={16}
                        bblr={16}
                        bbrr={16}>
                        <Image
                          source={{
                            uri:
                              item?.user?.profilePic ||
                              profilePicturePlaceholder,
                          }}
                          h={64}
                          w={64}
                          br={32}
                          mt={-32}
                        />
                        <View pv={16}>
                          <Text c={"#0F0F10"} ftsz={16} weight="600">
                            {item?.user?.name}
                          </Text>
                          <Text mt={4} c={"#0F0F10"} ftsz={13} weight="400">
                            {item?.comment}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <>
                <Stepper />
                <View
                  bgc={"#FFF"}
                  w={"100%"}
                  ai="center"
                  jc="center"
                  pv={16}
                  br={12}>
                  <Text ftsz={14} weight="600">
                    No reviews found.
                  </Text>
                </View>
              </>
            )}
          </>
        );
      }
    }
  };

  useEffect(() => {
    flatlistRef?.current?.scrollToIndex({ index: 0, animated: true });
  }, [selectedTab]);

  const closeModal = () => {
    setShowModal(false);
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isSuccessRegister && !isLoadingRegister) {
      closeModal();
      setAllData(prv => {
        let data = prv;
        data["isStarted"] = true;
        return data;
      });
    }
  }, [isSuccessRegister, isLoadingRegister]);

  const registerModal = () => {
    return (
      <Modal
        onRequestClose={closeModal}
        animationType="fade"
        transparent
        visible={showModal}>
        <View bgc={"rgba(0,0,0,0.3)"} f={1}>
          <TouchableOpacity activeOpacity={1} onPress={closeModal} f={1} />
          <View bgc={"#FFF"} btrr={24} btlr={24} pt={16} ph={32}>
            <TouchableOpacity onPress={closeModal} asf="flex-end" t={0}>
              <IconAntDesign name="close" size={18} color={"#000"} />
            </TouchableOpacity>
            {isLoadingRegister ? (
              <View h={150} ai="center" jc="center">
                <ActivityIndicator size={"large"} color={"#000"} />
              </View>
            ) : (
              <>
                <Text mt={8} ftsz={14} weight="500" ta="center">
                  Please note that this is not a work experience or an
                  internship by MapOut or the employer. You will recieve a
                  completion certificate for this virtual experience program.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // navigate("TaskTypeUpload", { taskDetails: details?.tasks[1] });
                    register({ careerTaster_id: allData?.careerTaster?._id });
                  }}
                  mt={16}
                  bgc={"#000"}
                  pv={12}
                  ai="center"
                  jc="center"
                  br={16}>
                  <Text c={"#FFF"} ftsz={12} weight="500">
                    Continue
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <View h={insets?.bottom} />
          </View>
        </View>
      </Modal>
    );
  };

  const updateData = data => {
    setAllData({ ...data });
  };

  const handleContinue = () => {
    const index = allData?.careerTaster?.tasks?.findIndex(
      task => task?.isCompleted === false,
    );
    index != -1 &&
      navigate("TaskTypeUpload", {
        data: allData,
        updateData: updateData,
        index: index,
      });
    index == -1 &&
      navigate("CareerTasterFeedback", {
        data: allData,
        updateData: updateData,
      });
  };

  const shareCareerTaster = () => {
    const options = {
      message: `https://mapout.com/career-taster/${allData?.careerTaster?._id}`,
    };
    !isFetching &&
      Share.open(options)
        .then(res => {
          // console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <View f={1} w={"100%"} h={"100%"}>
        <LinearGradient
          colors={["#FFFFFF", bgcColor, "#FFFFFF"]}
          useAngle={true}
          angle={135}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0.3, 0.65, 1]}
          style={{ flex: 1 }}>
          {registerModal()}
          <View fd="row" mh={16} mv={8} ai="center" jc="space-between">
            <TouchableOpacity onPress={() => popNavigation()}>
              <Icons.BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text ftsz={17} weight="500">
              Career Taster
            </Text>
            <TouchableOpacity onPress={shareCareerTaster}>
              <Icons.ShareIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
          {isFetching ? (
            <View f={1} ac="center" jc="center">
              <ActivityIndicator size={"large"} color={"#000"} />
            </View>
          ) : (
            <FlatList
              ph={16}
              ref={flatlistRef}
              data={["Tabs", "Details"]}
              renderItem={renderItem}
              stickyHeaderIndices={[1]}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={() => {
                return (
                  <View mv={16}>
                    <View br={16} bgc={"rgba(255, 255, 255, 0.75)"}>
                      <View w={"100%"} h={150} jc="center" ai="center">
                        <Image
                          source={{ uri: allData?.careerTaster?.coverImg }}
                          w={"100%"}
                          h={150}
                          btrr={16}
                          btlr={16}
                          resizeMode="cover"
                        />
                        {allData?.careerTaster?.isIntroVideo && (
                          <TouchableOpacity
                            z={1}
                            po="absolute"
                            p={4}
                            br={100}
                            bgc={"rgba(0,0,0,0.3)"}>
                            <Icons.PlayButton width={54} height={54} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View p={16}>
                        <View fd="row" ai="center">
                          <TouchableOpacity
                            onPress={() => {
                              navigate("EmployerProfile");
                            }}
                            f={1}
                            fd="row"
                            ai="center">
                            <Image
                              h={48}
                              w={48}
                              br={32}
                              source={{
                                uri:
                                  details?.Employerlogo ||
                                  profilePicturePlaceholder,
                              }}
                            />
                            <Text ftsz={15} weight="600" f={1} ml={16}>
                              {details?.employerName}
                            </Text>
                          </TouchableOpacity>
                          <View fd="row" ai="center">
                            <Text ftsz={12} weight="400">
                              {details?.timePeriod}
                            </Text>
                            <View mh={4} h={3} w={3} bgc={"#000"} br={4} />
                            <Text ftsz={12} weight="400">
                              {details?.tasterMode}
                            </Text>
                          </View>
                        </View>
                        <Text
                          mt={16}
                          asf="baseline"
                          ftsz={16}
                          weight="700"
                          style={{ textDecorationLine: "underline" }}
                          c={"#17171F"}>
                          {details?.name}
                        </Text>
                        <Text ftsz={16} weight="600" c={"#17171F"}>
                          Free Virtual Experience Program
                        </Text>
                      </View>
                    </View>
                    {allData?.isCompleted ? (
                      <TouchableOpacity
                        onPress={() => {
                          navigate("CompleteTaskOverview", { data: allData });
                        }}
                        jc="center"
                        ai="center"
                        bgc={"#000"}
                        mt={16}
                        pv={12}
                        br={16}>
                        <Text ftsz={14} weight="500" c={"#FFF"}>
                          Completed
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          allData?.isStarted
                            ? handleContinue()
                            : setShowModal(true)
                        }
                        jc="center"
                        ai="center"
                        bgc={"#000"}
                        mt={16}
                        pv={12}
                        br={16}>
                        <Text ftsz={14} weight="500" c={"#FFF"}>
                          {allData?.isStarted ? "Continue" : "Get Started"}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => navigate("HowThisWorks")}
                      jc="center"
                      ai="center"
                      bgc={"#FFF"}
                      mt={16}
                      pv={12}
                      br={16}>
                      <Text ftsz={14} weight="500">
                        How this works
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              ListFooterComponent={() => {
                return <View h={32} />;
              }}
            />
          )}
        </LinearGradient>
      </View>
    </MainLayout>
  );
};

export default CareerTasterScreen;
