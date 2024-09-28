import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native-style-shorthand";
import { navigate } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { Text } from "../../../components";
import { api } from "../../../redux/api";

const CareerTasterCard = ({ item, index, show = true, size=420 }) => {
  const [saved, setSaved] = useState(item?.isSaved);
  const [toggleSave, {isSuccess, isLoading}] = api.useToggleSaveCareerTasterMutation();

  useEffect(()=>{
    if(isSuccess && !isLoading){
      setSaved(!saved);
    }
  },[isSuccess, isLoading])

  const handleSaveButton=()=>{
    toggleSave({careerTaster_id: item?._id, isSaved: !saved});
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigate("CareerTasterScreen", { id: item?._id })}
      w={"100%"}
      bc={"#111"}
      br={8}
      h={size}
      bw={0.2}
      f={1}
      jc="center"
      ph={14}
      pv={12}
      bgc={"#fff"}>
      <View w={"100%"} h={143}>
        <Image
          source={{
            uri: item?.coverImg,
          }}
          style={{ width: "100%", height: 143 }}
          br={12}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={handleSaveButton}
          po="absolute"
          p={8}
          bgc={"rgba(0, 0, 0, 0.4)"}
          br={8}
          r={8}
          t={8}>
          <Icons.SaveJob width={20} height={20} stroke={"#FFF"} fill={saved ? "#000" : "transparent"} />
        </TouchableOpacity>
      </View>

      <View mt={16} fd="row" jc="space-between">
        <TouchableOpacity onPress={()=>{
          navigate('EmployerProfile')
        }} fd="row" f={1} ai="center">
          <Image
            source={{ uri: item?.Employerlogo }}
            h={48}
            w={48}
            br={32}
            resizeMode="contain"
          />
          <Text f={1} ml={10} ftsz={15} style={{ fontWeight: "600" }}>
            {item?.employerName}
          </Text>
        </TouchableOpacity>
        <View fd="row" style={{ gap: 2 }}>
          <Text c={"#414143cc"}>{item?.timePeriod}</Text>
          <Text c={"#323236cc"}>•</Text>
          <Text c={"#323236cc"}>{item?.tasterMode}</Text>
        </View>
      </View>

      <View f={1}>
        <Text
          numberOfLines={1}
          mt={16}
          ftsz={16}
          c={"#323236"}
          style={{
            fontWeight: "600",
            textDecorationLine: "underline",
          }}>
          {item?.name}
        </Text>
        <Text numberOfLines={1} mt={0} ftsz={16} c={"#17171F"} style={{ fontWeight: "600" }}>
          Free Virtual Experience Program
        </Text>
        <Text f={1} numberOfLines={2} mt={18} ftsz={12} c={"#17171F"} style={{ fontWeight: "500" }}>
          {item?.description}
        </Text>
      </View>

      {show && (
        <TouchableOpacity
          onPress={() => navigate("CareerTasterScreen", { id: item?._id })}
          br={12}
          bw={1}
          mt={16}
          pv={12}
          ai="center"
          jc="center"
          bgc={"#111"}>
          <Text c={"#FFF"}>Continue</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CareerTasterCard;
