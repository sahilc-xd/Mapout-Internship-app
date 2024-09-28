import React from "react";
import MainLayout from "../../../components/MainLayout";
import {
    FlatList,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { Text } from "../../../components";

const PaymentHistory = () => {
    // const data = [{
    //     orderDetails: "Chat with Career Advisor: 1 day",
    //     amount: 99,
    //     date: "18th March, 2024",
    //     time: "9:00am"
    // }, {
    //     orderDetails: "Session with Career Advisor",
    //     amount: 499,
    //     date: "12th December, 2024",
    //     time: "7:00pm"
    // }]

    const data = [];
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
              <Icons.BackArrow width={32} height={32}/>
          </TouchableOpacity>
          <Text ftsz={16} weight="600" ta="center">
            Payment history
          </Text>
        </View>
        <View f={1} ph={16}>
                <FlatList
                    f={1}
                    data={data}
                    ListEmptyComponent={()=>{
                        return(
                        <View jc="center" ai="center" bgc={'rgba(255, 255, 255, 0.65)'} pv={16} br={12}>
                            <Text c={'#333333'} ftsz={16} weight="600">No payments yet.</Text>
                        </View>
                        )
                    }}
                    renderItem={({item})=>{
                        return(
                            <View mt={16} jc="center" ph={8} bgc={'rgba(255, 255, 255, 0.65)'} pv={16} br={12}>
                                <Text mb={8} c={'#333333'} ftsz={16} weight="600">{item?.orderDetails}</Text>
                                <Text mv={8} c={'#333333'} ftsz={14} weight="500">You paid INR {item?.amount}/-</Text>
                                <Text c={'#333333'} ftsz={10} weight="300">{item?.time}, {item?.date}</Text>
                            </View>
                        )
                    }}
                />
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default PaymentHistory;
