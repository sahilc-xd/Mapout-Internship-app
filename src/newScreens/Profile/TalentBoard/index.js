import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native-style-shorthand";
import { ICONS } from "../../../constants";
import Icons from "../../../constants/icons";
import { api } from "../../../redux/api";
import { useAppSelector } from "../../../redux";
import CustomModal from "../../../components/CustomModal";
import { navigate } from "../../../utils/navigationService";
import { Text } from "../../../components";

const modalData = {
  heading: "Talent Board",
  text: "Showcase your skills and projects to the world and unlock admiration as well as world of opportunities. ",
};

const Board = ({ data, talentBoardID }) => {
  const handleBoardClicked = () => {
    navigate("TalentBoardProject", { data, talentBoardID });
  };

  if (data?.exists) {
    return (
      <TouchableOpacity
        onPress={handleBoardClicked}
        style={{ borderRadius: 8 }}>
        <Image
          source={{ uri: data?.coverImgUrls[0]?.url }}
          resizeMode="cover"
          style={{ height: 96, width: 96 }}
        />
      </TouchableOpacity>
    );
  }
};

const TalentBoard = () => {
  const user = useAppSelector(state => state.user);
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isBoardsViewReady, setIsBoardsViewReady] = useState(false);
  const [isFetchingState, setIsFetchingState] = useState(false);

  const { data, isSuccess, isLoading, isError, error, isFetching } =
    api.useFetchTalentBoardsQuery({ userId: user?._id });

  useEffect(() => {
    if (isError) {
      if (error?.status === 404) {
        setIsBoardsViewReady(true);
      }
    }
    if (isSuccess) {
      setupBoards();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isFetching) {
      setIsFetchingState(true);
    }
    if (!isFetching && isFetchingState) {
      setupBoards();
    }
  }, [isFetching]);

  const setupBoards = () => {
    let projects = data?.projects ? data?.projects : [];
    let newBoards = [];
    for (let i = 0; i < projects.length; i++) {
      newBoards.push({ ...projects[i], exists: true });
    }
    for (let j = projects.length; j < 6; j++) {
      newBoards.push({ id: j + 1, exists: false });
    }
    setBoards(newBoards);
    setIsBoardsViewReady(true);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!isBoardsViewReady) {
    return (
      <View mh={24} ph={16} br={12} bgc={"#FFFFFF"} pv={16}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <CustomModal
        showModal={showModal}
        heading={modalData?.heading}
        text={modalData?.text}
        closeModal={closeModal}
      />
      <View mh={24} ph={16} br={12} bgc={"#FFFFFF"} pv={16}>
        <View fd="row" jc="space-between" ai="center">
          <View fd="row" ai="center">
            <Text ftsz={14} weight="600">
              Talent Board
            </Text>
          </View>
          <TouchableOpacity
            br={8}
            bgc="#D8E3FC"
            onPress={() => navigate("Samples")}>
            <Text
              style={{
                paddingVertical: 6,
                paddingHorizontal: 15,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
              }}>
              Sample
            </Text>
          </TouchableOpacity>
        </View>
        <View pb={12}>
          <Text ftsz={10} c={"#525252"}>
            Showcase your skills and projects to the world.
          </Text>
        </View>
        {/* <View fd="row" ai="center">
            <Image
              source={require("../../../assets/gifs/FireAnimation.gif")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text ml={8} ftsz={12} weight="500" c={"#EFC019"}>
              Earn 25 points
            </Text>
          </View> */}
        {boards?.length > 0 &&
          boards?.filter(item => {
            if (item?.exists == true) {
              return true;
            }
          }).length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginHorizontal: 8, // Adjust negative margin to reduce horizontal space
              }}>
              {boards.map((board, index) => (
                <View key={index} style={{ width: "28%", marginVertical: 8 }}>
                  <Board data={board} talentBoardID={data?.talentBoardID} />
                </View>
              ))}
            </View>
          )}

        <TouchableOpacity
          onPress={() => navigate("AddProjectStep1")}
          style={{
            backgroundColor: "#000",
            paddingVertical: 15,
            paddingHorizontal: 2,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            width: "100%",
            marginTop: 2,
            marginBottom: 8,
          }}>
          <Text ftsz={13} weight="500" style={{ color: "#FFF" }}>
            Add a project/talent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("DraftedProjects")}
          style={{
            backgroundColor: "#D8E3FC",
            paddingVertical: 15,
            paddingHorizontal: 2,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            width: "100%",
            marginTop: 2,
          }}>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#000" }}>
            Drafts
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default TalentBoard;
