import React from "react";
import MainLayout from "../../../components/MainLayout";
import {
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import { Text } from "../../../components";
import { useAppSelector } from "../../../redux";

const AccountManagement = () => {
  const user = useAppSelector(state => state.user);
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
            Account Management
          </Text>
        </View>
        <View w={"100%"} f={1}>
          <View mt={16} mh={16} bgc={"rgba(255, 255, 255, 0.65)"} ph={8} pt={16} pb={8} br={12}>
            <Text c={"#333333"} ftsz={16} weight="600">
              Personal information
            </Text>
            <View ph={8}>
              <Text mt={16} ftsz={10} weight="500" c={"#666666"}>
                User name
              </Text>
              <View mt={8} bw={0.5} bc={"#D5D5D5"} ph={8} pv={12}>
                <Text numberOfLines={1} ftsz={14} weight="500" c={"#333333"}>
                  {user?.name}
                </Text>
              </View>
              <Text mt={16} ftsz={10} weight="500" c={"#666666"}>
                Contact number
              </Text>
              <View mt={8} bw={0.5} bc={"#D5D5D5"} ph={8} pv={12}>
                <Text numberOfLines={1} ftsz={14} weight="500" c={"#333333"}>
                  {user?.mobile}
                </Text>
              </View>
              {user?.email?.length > 0 && (
                <>
                  <Text mt={16} ftsz={10} weight="500" c={"#666666"}>
                    Email
                  </Text>
                  <View mt={8} bw={0.5} bc={"#D5D5D5"} ph={8} pv={12}>
                    <Text
                      numberOfLines={1}
                      ftsz={14}
                      weight="500"
                      c={"#333333"}>
                      {user?.email}
                    </Text>
                  </View>
                </>
              )}
              <View mt={16} mb={8} fd="row" jc="flex-end">
                <Text c={"#4772F4"} ftsz={12} weight="500">
                  Want to change something?{" "}
                </Text>
                <TouchableOpacity onPress={()=>navigate('ContactUs')} bbw={1} bc={"#4772F4"} asf="flex-end">
                  <Text c={"#4772F4"} ftsz={12} weight="500">
                    Contact Us.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View mt={16} mh={16} bgc={"rgba(255, 255, 255, 0.65)"} ph={8} pt={16} pb={8} br={12}>
            <Text c={"#333333"} ftsz={16} weight="600">
              Manage your account
            </Text>
            <TouchableOpacity onPress={()=>navigate('ManageAccount')} ph={8} fd="row" mt={16} ai="center">
              <View f={1}>
                <Text ftsz={14} weight="500" c={"#333333"}>
                  Deactivate or delete account
                </Text>
                <Text mt={4} ftsz={10} weight="300" c={"#333333"}>
                  Deactivate account temporarily or delete account permanantly.
                </Text>
              </View>
              <View ph={8} jc="center" ai="center">
                <Icons.ChevronLeft
                  width={24}
                  height={24}
                  fill={"#000"}
                  style={{
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default AccountManagement;
