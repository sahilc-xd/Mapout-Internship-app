import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions, Image as Img } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import FastImage from "react-native-fast-image";
import Icons from "../../constants/icons";
import MainLayout from "../../components/MainLayout";
import { popNavigation } from "../../utils/navigationService";
import { Text } from "../../components";
import Hyperlink from "react-native-hyperlink";

const ImageCarousel = props => {
  const { images = [], index = 0, text = "" } = props?.route?.params;
  const [showMore, setShowMore] = useState(false);
  const ref = useRef(null);
  const screenWidth = useWindowDimensions().width;
  const [imageIndex, setImageIndex] = useState(1);
  const [imgHeight, setImgHeight] = useState(
    images?.map(item => {
      return 200;
    }) || false,
  );

  const getImageHeight = () => {
    const heights = [];
    images?.map(item => {
      Img.getSize(item, (width, height) => {
        const computedHeight = height * (screenWidth / width);
        heights.push(computedHeight);
        if (heights?.length === images?.length) {
          setImgHeight([...heights]);
        }
      });
    });
  };

  useEffect(() => {
    getImageHeight();
  }, []);

  const next = () => {
    ref?.current?.next({ count: 1, animated: true });
  };

  const previous = () => {
    ref?.current?.prev({ count: 1, animated: true });
  };
  return (
    <MainLayout bgColor="#000" statusBar_bg="#FFF" statusBar_bs="lc">
      <View
        f={1}>
        <View ph={16} mv={8} ai="center" jc="center">
          <TouchableOpacity
            asf="flex-start"
            br={100}
            bgc={"#FFF"}
            onPress={() => {
              popNavigation();
            }}>
            <Icons.BackArrow width={32} height={32} />
          </TouchableOpacity>
          {images?.length>1 && <View po="absolute" jc="center" ai="center">
            <Text c={'#FFF'}>{imageIndex}/{images?.length}</Text>
          </View>}
        </View>
        <Carousel
          style={{ flex: 1 }}
          loop={false}
          ref={ref}
          width={screenWidth}
          // height={'100%'}
          data={[...images]}
          defaultIndex={index}
          scrollAnimationDuration={1000}
          onSnapToItem={index => setImageIndex(index + 1)}
          renderItem={({ item, index }) => (
            <View f={1} ai="center" jc="center">
              <FastImage
                style={{ width: screenWidth, height: imgHeight[index] }}
                source={{ uri: item }}
              />
            </View>
          )}
        />
        {text?.length > 0 && (
          <TouchableOpacity onPress={()=> text?.length > 100 && setShowMore(!showMore)}
            z={10}
            activeOpacity={1}
            w={"100%"}
            po="absolute"
            b={0}
            ph={16}
            bgc={"rgba(0,0,0,0.6)"}
            pv={6}
            btrr={12}
            btlr={12}>
            {!showMore && (
              <Hyperlink
                linkStyle={{ color: "#6691FF" }}
                onPress={(url, text) =>
                  Linking.openURL(url)
                    .then()
                    .catch(() => {})
                }>
                <Text ftsz={14} weight="400" c={"#FFF"}>
                  {text?.length > 100 ? `${text?.substring(0, 100)}...` : text}
                </Text>
              </Hyperlink>
            )}
            {showMore && (
              <ScrollView
                z={100}
                h={200}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>
                <TouchableOpacity activeOpacity={1} onPress={()=>setShowMore(!showMore)} onStartShouldSetResponder={() => true}>
                  <Hyperlink
                    linkStyle={{ color: "#6691FF" }}
                    onPress={(url, text) =>
                      Linking.openURL(url)
                        .then()
                        .catch(() => {})
                    }>
                    <Text ftsz={14} weight="400" c={"#FFF"}>
                      {text}
                    </Text>
                  </Hyperlink>
                </TouchableOpacity>
              </ScrollView>
            )}
            {text?.length > 100 && (
              <TouchableOpacity
                activeOpacity={0}
                z={10}
                fd="row"
                ai="center"
                jc="flex-end"
                mb={10}>
                <Text
                  onPress={() => {
                    setShowMore(!showMore);
                  }}
                  c={"#6691FF"}>
                  {showMore ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      </View>
    </MainLayout>
  );
};

export default ImageCarousel;
