import React, { useEffect } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { navigate, popNavigation } from "../../../utils/navigationService";
import { useAppSelector } from "../../../redux";
import { ActivityIndicator } from "react-native";
import { api } from "../../../redux/api";
import { Text } from "../../../components";
import { ICONS } from "../../../constants";
import Toast from "react-native-toast-message";

const Draft = () => {
  const user = useAppSelector(state => state.user);
  const [
    deleteProject,
    {
      isSuccess: isDeleteSuccess,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
    },
  ] = api.useDeleteTalentBoardProjectMutation();
  const { data, isSuccess, isFetching } = api.useFetchTalentBoardsQuery({
    userId: user?._id,
    isDrafted: true,
  });

  useEffect(() => {
    if (isDeleteSuccess) {
      Toast.show({
        type: "success",
        text1: "Project Deleted successfully",
        text2: "Your Project has been Deleted successfully",
      });
    }
  }, [isDeleteSuccess]);

  const handleDeleteClicked = ({ talentBoardID, projectID }) => {
    deleteProject({
      talentBoardID: talentBoardID,
      projectID: projectID,
    });
  };

  const handleUpdateClicked = ({ data, talentBoardID }) => {
    navigate("EditProjectStep1", { data, talentBoardID });
  };

  return (
    <MainLayout bgColor="#FFF" statusBar_bg="#FFF" statusBar_bs="dc">
      <ImageBackground
        f={1}
        source={require("../ProfileBackground.png")}
        resizeMode="cover">
        <View>
          <TouchableOpacity
            onPress={() => popNavigation()}
            style={{ paddingLeft: 20 }}>
            <ICONS.BackArrow width={32} height={32} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Drafts({data?.projectsCount ? data?.projectsCount : 0})
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            flexWrap: "wrap",
            padding: 15,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          {data?.projects.map(el => (
            <View
              style={{
                borderRadius: 8,
                width: "47%",
                display: "flex",
                flexDirection: "column",
              }}>
              <Image
                source={{ uri: el?.coverImgUrls[0]?.url }}
                resizeMode="cover"
                style={{ height: 180, width: "100%", borderRadius: 16 }}
              />
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  padding: 8,
                  justifyContent: "space-between",
                }}>
                <TouchableOpacity
                  disabled={isDeleteLoading}
                  onPress={() =>
                    handleUpdateClicked({
                      talentBoardID: data?.talentBoardID,
                      data: el,
                    })
                  }>
                  <Text style={{ fontSize: 14, fontWeight: "500" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isDeleteLoading}
                  onPress={() =>
                    handleDeleteClicked({
                      talentBoardID: data?.talentBoardID,
                      projectID: el._id,
                    })
                  }>
                  {isDeleteLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#FF4C00",
                      }}>
                      Delete
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ImageBackground>
    </MainLayout>
  );
};

export default Draft;
