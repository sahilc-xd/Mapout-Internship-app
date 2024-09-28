import React from 'react';
import { ImageBackground, Text } from "react-native-style-shorthand";
import { ICONS } from '../../../../constants';
import { navigate } from '../../../../utils/navigationService';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import Icons from '../../../../constants/icons';
import MainLayout from '../../../../components/MainLayout';
import { useWindowDimensions } from 'react-native';

const hardcodedData = [
  {
    exists: true,
    coverImgUrls: [{ url: "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/krati_tb_cover.png" }],
    name: "Food-delivery App",
    username: "Krati Mittal",
    description: "As part of the Google UX Design Professional Course, we were asked to select a prompt for developing an app that positions ourselves as a user while learning to think about design. So, I decided to design an online delivery app for my favourite bakery- Theobroma as I often order from there and have to go to third-party apps.",
    tags: ["CaseStudy", "UXDesign"],
    videoUrls: [],
    imageUrls: [{ "id": "78123729136123", "url": "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/krati_tb_project.png" }],
    hideButtons: true, 
  },
  {
    exists: true,
    coverImgUrls: [{ url: "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/nihal_tb_cover.jpg" }],
    name: "Strong-passowrd-check | NPM Package",
    username: "Nihal Avulan",
    description: "strong-password-check is a powerful package designed to check the strength of passwords in Node.js applications. It provides a simple and customizable way to evaluate the strength of a password based on various criteria such as length, character types (uppercase, lowercase, numbers, symbols), and repetition.",
    tags: ["TechNews", "Coding"],
    videoUrls: [],
    imageUrls: [{ "id": "78123721239136123", "url": "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/nihal_tb_project.jpg" }],
    hideButtons: true, 
  },
  {
    exists: true,
    coverImgUrls: [{ url: "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/hina_tb_cover_img.png" }],
    name: "Art for my heart!",
    username: "Hina Chopra",
    description: "I wasn't sure what to expect when I picked up my first watercolor brush.  But as I started to paint, I was immediately captivated by the way the colors danced on the paper.  With each stroke, I learned a new technique, and I was amazed at the effects I could create. I'm still learning how to paint with watercolors, but I'm having so much fun in the process.  It's my favourite way to relax and watch colours mix with water so effortlessly.",
    tags: ["tag5", "tag6"],
    videoUrls: [],
    imageUrls: [],
    imageUrls: [{ "id": "781222372116123", "url": "https://mapout-images.s3.us-east-2.amazonaws.com/sampleboards/hina_tb_project.jpg" }],
    hideButtons: true, 
  },
];

const Board = ({ data, talentBoardID }) => {
  const screenWidth = (useWindowDimensions().width-64)/3;

  const handleBoardClicked = () => {
    navigate("TalentBoardProject", { data, talentBoardID , hideButtons: data.hideButtons});
  };

  const coverImgUrl = data?.coverImgUrls[0]?.url;

  if (data?.exists) {
    return (
      <TouchableOpacity
        onPress={handleBoardClicked}
        style={{ borderRadius: 8, height: screenWidth, width: screenWidth }}
      >
        <Image
          source={typeof coverImgUrl === 'string' ? { uri: coverImgUrl } : coverImgUrl}
          resizeMode="cover"
          style={{ height: screenWidth, width: screenWidth }}
        />
        <View ph={4} bgc={'rgba(0, 0, 0, 0.25)'} pv={6} w={'100%'} po='absolute' b={0}>
          <Text numberOfLines={1}>{data?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};

const Samples = () => {
return (
  <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
    <ImageBackground
      f={1}
      source={require("./SamplesBackground.png")}
      resizeMode="cover"
    >
      <View style={{alignItems: 'center', paddingTop: 8, flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
        <TouchableOpacity
          onPress={() => {
            navigate('Profile');
          }}
          style={{ position: 'absolute', left: 16 }}
        >
          <Icons.BackArrow width={32} height={32} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '500', color: "black" }}>Sample Talent Board</Text>
      </View>
      <View mh={16} mt={16} style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {hardcodedData.map((data, index) => (
          <Board key={index} data={data} talentBoardID={`talentBoard${index}`} />
        ))}
      </View>
    </ImageBackground>
  </MainLayout>
);
}

export default Samples;
