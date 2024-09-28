import React from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../components";
import { navigate } from "../../utils/navigationService";
import Animated from "react-native-reanimated";
import { PanResponder } from "react-native";

const AboutEmployer = props => {
  const { companyData = {}, updateSelected= false } = props;

  const handleImageClick = index => {
    navigate("ImageCarousel", {
      images: companyData?.about?.images,
      index: index,
    });
  };

  const onPressNext=()=>{
    updateSelected && updateSelected(1)
  }

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log("gestureState", gestureState)
        if(gestureState.dy > 5 ||  gestureState.dy < -5 || (gestureState.dx <= 10 && gestureState.dx >= -10)){
          return false;
        }
        return true
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          onPressNext()
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} style={{flex:1, paddingHorizontal: 16}}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View bw={1} ph={16} br={16} pv={16}>
          <Text ftsz={16} weight="600">
            Who we are & what we do
          </Text>
          <Text ftsz={14} weight="400" mt={4}>
            {companyData?.about?.work}
          </Text>
        </View>
        <View mt={16} bw={1} ph={16} br={16} pv={16}>
          <Text ftsz={16} weight="600">
            Our Core Values
          </Text>
          <View mt={8} fd="row" fw="wrap" gap={8}>
            {companyData?.about?.coreValues?.map(item => {
              return (
                <View
                  ph={12}
                  pv={2}
                  br={8}
                  bgc={companyData?.secondaryBrandColor}>
                  <Text
                    ftsz={14}
                    weight="500"
                    c={companyData?.secondaryTextColor}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View mt={16}>
          <Text pl={8} ftsz={16} weight="600">
            An Inside Look at Us
          </Text>
          <Text mt={8} pl={8} ftsz={14} weight="400">
            {companyData?.about?.insider}
          </Text>
          <View mt={16}>
            {companyData?.about?.images?.length === 1 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleImageClick(0)}>
                <Image
                  source={{ uri: companyData?.about?.images?.[0] }}
                  w={"100%"}
                  h={250}
                  br={12}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {companyData?.about?.images?.length === 2 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleImageClick(0)}
                  w={"48.5%"}>
                  <Image
                    source={{ uri: companyData?.about?.images[0] }}
                    w={"100%"}
                    h={250}
                    br={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleImageClick(1)}
                  w={"48.5%"}>
                  <Image
                    source={{ uri: companyData?.about?.images[1] }}
                    w={"100%"}
                    h={250}
                    br={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}

            {companyData?.about?.images?.length === 3 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleImageClick(0)}
                  w={"48.5%"}>
                  <Image
                    source={{ uri: companyData?.about?.images[0] }}
                    w={"100%"}
                    h={250}
                    br={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View w={"48.5%"} jc="space-between">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleImageClick(1)}
                    w={"100%"}>
                    <Image
                      source={{ uri: companyData?.about?.images[1] }}
                      w={"100%"}
                      h={120}
                      br={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleImageClick(2)}
                    w={"100%"}>
                    <Image
                      source={{ uri: companyData?.about?.images[2] }}
                      w={"100%"}
                      h={120}
                      br={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {companyData?.about?.images?.length > 3 && (
              <View jc="space-between" fd="row" w={"100%"}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleImageClick(0)}
                  w={"48.5%"}>
                  <Image
                    source={{ uri: companyData?.about?.images[0] }}
                    w={"100%"}
                    h={250}
                    br={12}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View w={"48.5%"} jc="space-between">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleImageClick(1)}
                    w={"100%"}>
                    <Image
                      bw={1}
                      source={{ uri: companyData?.about?.images[1] }}
                      w={"100%"}
                      h={120}
                      br={12}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleImageClick(2)}>
                    <Image
                      source={{ uri: companyData?.about?.images[2] }}
                      w={"100%"}
                      h={120}
                      br={12}
                      resizeMode="cover"
                    />
                    <View
                      br={12}
                      po="absolute"
                      w={"100%"}
                      h={120}
                      bgc={"rgba(0,0,0,0.5)"}
                      ai="center"
                      jc="center">
                      <Text ftsz={28} weight="600" c={"#FFF"}>
                        +{companyData?.about?.images?.length - 2}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        <View mt={16} ph={16} bw={1} br={16} pv={16}>
          <Text ftsz={16} weight="600">
            Qualities we seek in candidates
          </Text>
          <View mt={8} fd="row" fw="wrap" gap={8}>
            {companyData?.about?.qualities?.map(item => {
              return (
                <View
                  ph={12}
                  pv={2}
                  br={8}
                  bgc={companyData?.secondaryBrandColor}>
                  <Text c={companyData?.secondaryTextColor} ftsz={14} weight="500">
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View mt={16} ph={16} bw={1} br={16} pv={16}>
          <Text ftsz={16} weight="600">
            Perks & Benefits
          </Text>
          <View mt={8} fd="row" fw="wrap" gap={8}>
            {companyData?.about?.perks?.map(item => {
              return (
                <View
                  ph={12}
                  pv={2}
                  br={8}
                  bgc={companyData?.secondaryBrandColor}>
                  <Text c={companyData?.secondaryTextColor} ftsz={14} weight="500">
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(AboutEmployer);
