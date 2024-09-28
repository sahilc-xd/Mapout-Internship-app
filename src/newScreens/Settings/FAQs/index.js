import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { Text } from "../../../components";
import { api } from "../../../redux/api";
import { duration } from "moment";

const FAQs = ({route}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(false);
  const { data: faqlists, isLoading, isSuccess } = api.useGetFaqsQuery();

  const flatListRef = useRef(null);
  useEffect(() => {
    if (isSuccess && route.params && route.params.scrollToHeading) {
      scrollToItem(route.params.scrollToHeading);
    }
  }, [isSuccess]);

  const scrollToItem = (heading) => {
    const index = faqlists.data.findIndex((item) => item.heading === heading);

    if (index !== -1) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ animated: true, index });
      }, 200);
    }
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../SettingsBackground.png")}
        resizeMode="cover">
        <View ai="center" pv={16} jc="center">
          <TouchableOpacity
            onPress={() => {
              popNavigation();
            }}
            po="absolute"
            l={16}>
            <Icons.BackArrow width={32} height={32} />
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            FAQs
          </Text>
        </View>
        {isLoading ? (
          <View f={1} ai="center" jc="center">
            <ActivityIndicator size={"large"} color={"#000"} />
          </View>
        ) : (
          <View f={1} mh={16} pv={16} br={12} bgc={"rgba(255, 255, 255, 0.65)"}>
            <FlatList
              ref={flatListRef}
              f={1}
              ListFooterComponent={() => {
                return (
                  <TouchableOpacity onPress={() => navigate("ContactUs")}>
                    <Text ftsz={14} weight="500" c={"#4772F4"}>
                      Didn’t find the answer you were looking for?
                    </Text>
                    <Text
                      bbw={1}
                      asf="baseline"
                      bc={"#4772F4"}
                      ftsz={14}
                      weight="500"
                      c={"#4772F4"}>
                      Contact Us.
                    </Text>
                  </TouchableOpacity>
                );
              }}
              data={faqlists.data}
              renderItem={({ item }) => {
                return (
                  <View ph={16}>
                    <Text ftsz={15} weight="600" c={"#222222"}>
                      {item?.heading}
                    </Text>
                    {item?.QA?.length > 0 && (
                      <FlatList
                        mv={16}
                        ItemSeparatorComponent={() => {
                          return <View h={12} />;
                        }}
                        data={item?.QA}
                        renderItem={({ item }) => {
                          return (
                            <>
                              <TouchableOpacity
                                onPress={() => {
                                  if (selectedQuestion === item?.question) {
                                    setSelectedQuestion(false);
                                  } else {
                                    setSelectedQuestion(item?.question);
                                  }
                                }}
                                fd="row"
                                ai="center"
                                br={12}
                                bgc={"rgba(255, 255, 255, 0.5)"}
                                bw={0.5}
                                bc={"#D5D5D5"}
                                pv={12}
                                bblr={
                                  selectedQuestion === item?.question ? 0 : 12
                                }
                                bbrr={
                                  selectedQuestion === item?.question ? 0 : 12
                                }>
                                <Text f={1} ph={16}>
                                  {item?.question}
                                </Text>
                                <View mh={12}>
                                  <Icons.ChevronLeft
                                    width={24}
                                    height={24}
                                    fill={"#000"}
                                    style={{
                                      transform: [
                                        {
                                          rotate:
                                            selectedQuestion === item?.question
                                              ? "90deg"
                                              : "270deg",
                                        },
                                      ],
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>
                              {selectedQuestion === item?.question && (
                                <View
                                  br={12}
                                  bgc={"rgba(255, 255, 255, 0.5)"}
                                  bw={0.5}
                                  bc={"#D5D5D5"}
                                  btlr={
                                    selectedQuestion === item?.question ? 0 : 12
                                  }
                                  btrr={
                                    selectedQuestion === item?.question ? 0 : 12
                                  }>
                                  <Text
                                    ph={16}
                                    pv={8}
                                    c={"#17171F"}
                                    ftsz={13}
                                    weight="400">
                                    {item?.answer}
                                  </Text>
                                </View>
                              )}
                            </>
                          );
                        }}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}
      </ImageBackground>
    </MainLayout>
  );
};

export default FAQs;
