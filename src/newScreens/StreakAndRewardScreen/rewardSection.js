import React, { useState } from "react";
import { Text } from "../../components";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";

const productCard = (item, collected="false") => {
  return (
    <View p={8} w={"50%"}>
      <View bw={0.4} bc={"#7F8A8E"} bgc={"#FFF"} br={12}>
        <Image
          mt={4}
          source={{ uri: item?.imgUrl }}
          asf="center"
          w={"100%"}
          h={150}
          resizeMode="contain"
        />
        <View mb={12} w={"90%"} asf="center" ai="center">
          <Text ftsz={12} numberOfLines={1} weight="600">
            {item?.productName}
          </Text>
        </View>
        <Text ph={8} adjustsFontSizeToFit ftsz={11} weight="400" ta="center">
          Redeem for {item?.redeemPoints} points
        </Text>
        {collected ? <TouchableOpacity
          activeOpacity={1}
          mt={8}
          mb={16}
          mh={24}
          pv={12}
          br={12}
          bgc="#FFF6C6"
          ai="center"
          jc="center">
          <Text ftsz={12} weight="600">
            Collected
          </Text>
        </TouchableOpacity> : <TouchableOpacity
          activeOpacity={item?.active ? 0 : 1}
          mt={8}
          mb={16}
          mh={24}
          pv={12}
          br={12}
          bgc={item?.active ? "#FFD439" : "#FFF6C6"}
          ai="center"
          jc="center">
          <Text ftsz={12} weight="600">
            Choose
          </Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

const RewardsSection = () => {
  const [section, setSection] = useState("All");

  const data = [
    {
      imgUrl:
        "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
      productName: "Apple Airpods",
      redeemPoints: "10000",
      active: true,
    },
    {
      imgUrl:
        "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
      productName: "Apple Airpods",
      redeemPoints: "10000",
      active: false,
    },
    {
      imgUrl:
        "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
      productName: "Apple Airpods",
      redeemPoints: "10000",
      active: true,
    },
    {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: true,
      },
      {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: false,
      },
      {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: true,
      },
      {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: true,
      },
      {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: false,
      },
      {
        imgUrl:
          "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
        productName: "Apple Airpods",
        redeemPoints: "10000",
        active: true,
      },
  ];

  const collectedData = [
    {
      imgUrl:
        "https://w7.pngwing.com/pngs/801/441/png-transparent-airpods-pro-thumbnail.png",
      productName: "Apple Airpods",
      redeemPoints: "10000",
      active: true,
    },
]
  return (
    <>
      {section === "All" ? <View f={1}>
        <TouchableOpacity mh={16} onPress={()=>{
            setSection("Collected");
        }} asf="flex-end" mv={8} bbw={1} bc={"rgba(0,0,0,0.5)"}>
          <Text>Collected Rewards</Text>
        </TouchableOpacity>
        <FlatList
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
          ph={16}
          data={data}
          numColumns={2}
          renderItem={({ item }) => {
            return <>{productCard(item, collected=false)}</>;
          }}
        />
      </View> : <View f={1}>
        <TouchableOpacity mh={16} onPress={()=>{
            setSection("All");
        }} asf="flex-end" mv={8} bbw={1} bc={"rgba(0,0,0,0.5)"}>
          <Text>All Rewards</Text>
        </TouchableOpacity>
        <FlatList
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
          ph={16}
          data={collectedData}
          numColumns={2}
          renderItem={({ item }) => {
            return <>{productCard(item, collected=true)}</>;
          }}
        />
      </View>}
    </>
  );
};

export default RewardsSection;
