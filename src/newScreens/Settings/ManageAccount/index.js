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

const ManageAccount = () => {
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
            Manage your account
          </Text>
        </View>
        <View w={"100%"} f={1}>
          <View mt={16} mh={16} bgc={"rgba(255, 255, 255, 0.65)"} ph={8} pt={16} pb={8} br={12}>
            <Text c={"#333333"} ftsz={16} weight="600">
              Manage account
            </Text>
            <TouchableOpacity onPress={()=>navigate('DeactivateAccount')} ph={8} fd="row" mt={16} ai="center">
              <View f={1}>
                <Text ftsz={14} weight="500" c={"#333333"}>
                  Deactivate account
                </Text>
                <Text mt={4} ftsz={10} weight="300" c={"#333333"} pr={8}>
                    Temporarily deactivate your account instead of permanently deleting it
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
            <TouchableOpacity onPress={()=>navigate('DeleteAccount')} ph={8} fd="row" mt={16} mb={8} ai="center">
              <View f={1}>
                <Text ftsz={14} weight="500" c={"#333333"}>
                Delete account
                </Text>
                <Text mt={4} ftsz={10} weight="300" c={"#333333"} pr={8}>
                Permanently remove all data and access by deleting your account. You cannot be use this account again.
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

export default ManageAccount;
