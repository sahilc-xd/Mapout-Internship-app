import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import { Text } from "../../../components";
import { api } from "../../../redux/api";
import { navigate } from "../../../utils/navigationService";
import Icons from "../../../constants/icons";
import usePagination from "../../../hooks/usePagination";
import CareerTasterCard from "./careerTasterCard";


const getItemLayout= (data, index, size=420) => {
  return {length: size, offset: (size+8) * index, index}
}

const CareerTasterHome = props => {
  const [selectedItem, setselectedItem] = useState(1);
  const [allCareerTastersList, setAllCareerTastersList] = useState([]);
  const [getCareerTasters, { data, isSuccess, isFetching }] =
    api.useLazyGetCareerTastersQuery();
  const {
    data: allList,
    page: allPage,
    onReachedEnd: onReachedEndAll,
    loadingMoreData: loadingMoreDataAll,
    reset: resetAll,
  } = usePagination("", allCareerTastersList, 10, 1);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setAllCareerTastersList(data?.careerTasters);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    selectedItem === 1 && allPage > 1 && getCareerTasters({ page: allPage });
  }, [allPage]);

  const [onGoingCareerTastersList, setOnGoingCareerTastersList] = useState([]);
  const [
    getOnGoingCareerTasters,
    {
      data: dataOnGoing,
      isSuccess: isSuccessOnGoing,
      isFetching: isFetchingOnGoing,
    },
  ] = api.useLazyGetOnGoingCareerTastersQuery();
  const {
    data: onGoingList,
    page: onGoingPage,
    onReachedEnd: onReachedEndOnGoing,
    loadingMoreData: loadingMoreDataOnGoing,
    reset: resetOnGoing,
  } = usePagination("", onGoingCareerTastersList, 10, 1);

  useEffect(() => {
    if (isSuccessOnGoing && !isFetchingOnGoing) {
      setOnGoingCareerTastersList(dataOnGoing?.careerTasters);
    }
  }, [isSuccessOnGoing, isFetchingOnGoing]);

  useEffect(() => {
    selectedItem === 2 &&
      onGoingPage > 1 &&
      getOnGoingCareerTasters({ page: onGoingPage });
  }, [onGoingPage]);

  const [completedCareerTastersList, setCompletedCareerTastersList] = useState(
    [],
  );
  const [
    getCompletedCareerTasters,
    {
      data: dataCompleted,
      isSuccess: isSuccessCompleted,
      isFetching: isFetchingCompleted,
    },
  ] = api.useLazyGetCompletedCareerTastersQuery();
  const {
    data: completedList,
    page: completedPage,
    onReachedEnd: onReachedEndOnCompleted,
    loadingMoreData: loadingMoreDataCompleted,
    reset: resetCompleted,
  } = usePagination("", completedCareerTastersList, 10, 1);

  useEffect(() => {
    if (isSuccessCompleted && !isFetchingCompleted) {
      setCompletedCareerTastersList(dataCompleted?.careerTasters || []);
    }
  }, [isSuccessCompleted, isFetchingCompleted]);

  useEffect(() => {
    selectedItem === 3 &&
      completedPage > 1 &&
      getCompletedCareerTasters({ page: completedPage });
  }, [completedPage]);

  const [savedCareerTastersList, setSavedCareerTastersList] = useState([]);
  const [
    getSavedCareerTasters,
    { data: dataSaved, isSuccess: isSuccessSaved, isFetching: isFetchingSaved },
  ] = api.useLazyGetSavedCareerTastersQuery();
  const {
    data: savedList,
    page: savedPage,
    onReachedEnd: onReachedEndSaved,
    loadingMoreData: loadingMoreDataSaved,
    reset: resetSaved,
  } = usePagination("", savedCareerTastersList, 10, 1);

  useEffect(() => {
    if (isSuccessSaved && !isFetchingSaved) {
      setSavedCareerTastersList(dataSaved?.careerTasters || []);
    }
  }, [isSuccessSaved, isFetchingSaved]);

  useEffect(() => {
    selectedItem === 4 &&
      savedPage > 1 &&
      getSavedCareerTasters({ page: savedPage });
  }, [savedPage]);

  const selectionTabItems = [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Ongoing",
    },
    {
      id: 3,
      name: "Completed",
    },
    {
      id: 4,
      name: "Saved",
    },
  ];

  useEffect(() => {
    if (selectedItem === 1) {
      getCareerTasters({ page: 1 });
      setOnGoingCareerTastersList([]);
      setCompletedCareerTastersList([]);
      setSavedCareerTastersList([]);
      resetOnGoing();
      resetCompleted();
      resetSaved();
    } else if (selectedItem === 2) {
      getOnGoingCareerTasters({ page: 1 });
      setAllCareerTastersList([]);
      setCompletedCareerTastersList([]);
      setSavedCareerTastersList([]);
      resetAll();
      resetCompleted();
      resetSaved();
    } else if (selectedItem === 3) {
      getCompletedCareerTasters({ page: 1 });
      setAllCareerTastersList([]);
      setOnGoingCareerTastersList([]);
      setSavedCareerTastersList([]);
      resetAll();
      resetOnGoing();
      resetSaved();
    } else if (selectedItem === 4) {
      getSavedCareerTasters({ page: 1 });
      setAllCareerTastersList([]);
      setOnGoingCareerTastersList([]);
      setCompletedCareerTastersList([]);
      resetAll();
      resetOnGoing();
      resetCompleted();
    }
  }, [selectedItem]);

  return (
    <View f={1}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View gap={12} mv={8} fd="row">
            {selectionTabItems.map((item, index) => {
              return (
                <View key={index.toString()}>
                  {item?.name != "Saved" && (
                    <TouchableOpacity
                      onPress={() => setselectedItem(item?.id)}
                      key={item?.id}
                      ph={16}
                      bc={"#111"}
                      bgc={
                        selectedItem === item?.id ? "#D8E3FC" : "transparent"
                      }
                      style={{
                        borderRadius: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 8,
                        borderWidth: 0.4,
                      }}>
                      <Text ftsz={14} weight="500" c={"#222222"}>
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item?.name === "Saved" && (
                    <TouchableOpacity
                      onPress={() => setselectedItem(item?.id)}
                      key={item?.id}
                      bgc={
                        selectedItem === item?.id ? "#D8E3FC" : "transparent"
                      }
                      bc={"#111"}
                      bw={0.4}
                      jc="center"
                      ai="center"
                      p={8}
                      br={12}>
                      <Icons.SaveIcon />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View f={1}>
        {selectedItem === 1 &&
          (allPage === 1 && isFetching ? (
            <View f={1} jc="center" ai="center">
              <ActivityIndicator size={"large"} color={"#000"} />
            </View>
          ) : allList?.length > 0 ? (
            <FlatList
              onEndReachedThreshold={0.5}
              getItemLayout={(data, index)=>getItemLayout(data, index, 360)}
              initialNumToRender={10}
              onEndReached={() => {
                onReachedEndAll();
              }}
              showsVerticalScrollIndicator={false}
              data={[...allList]}
              ListHeaderComponent={() => {
                return (
                  <View f={1}>
                    <View
                      mb={8}
                      bgc={"rgba(102, 145, 255, 0.25)"}
                      br={12}
                      p={16}>
                      <Text ftsz={14} weight="600" c={"#222222"} ta="center">
                        Did you know that you are 2.5x likely to land a job
                        after completing a virtual experience program?
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() => {
                return (
                  <View>
                    {loadingMoreDataAll && (
                      <View mt={16}>
                        <ActivityIndicator size={"small"} color={"#000"} />
                      </View>
                    )}
                    <View mb={180} />
                  </View>
                );
              }}
              keyExtractor={(item, index) => {
                return item?._id?.toString();
              }}
              renderItem={({ item, index }) => (
                <CareerTasterCard item={item} index={index} show={false} size={360}/>
              )}
              ItemSeparatorComponent={() => {
                return <View h={8} />;
              }}
            />
          ) : (
            <View ai="center" jc="center" f={1}>
              <Text>No career taster found.</Text>
            </View>
          ))}
        {selectedItem === 2 &&
          (onGoingPage === 1 && isFetchingOnGoing ? (
            <View f={1} jc="center" ai="center">
              <ActivityIndicator size={"large"} color={"#000"} />
            </View>
          ) : onGoingList?.length > 0 ? (
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                onReachedEndOnGoing();
              }}
              getItemLayout={(data, index)=>getItemLayout(data, index, 420)}
              showsVerticalScrollIndicator={false}
              data={[...onGoingList]}
              ListFooterComponent={() => {
                return (
                  
                  <View>
                    {loadingMoreDataOnGoing && (
                      <View mt={16}>
                        <ActivityIndicator size={"small"} color={"#000"} />
                      </View>
                    )}
                    <View mb={180} />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <CareerTasterCard item={item} index={index} show={true} />
              )}
            />
          ) : (
            <View ai="center" jc="center" f={1}>
              <Text>No career taster found.</Text>
            </View>
          ))}
        {selectedItem === 3 &&
          (completedPage === 1 && isFetchingCompleted ? (
            <View f={1} jc="center" ai="center">
              <ActivityIndicator size={"large"} color={"#000"} />
            </View>
          ) : completedList?.length > 0 ? (
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                onReachedEndOnCompleted();
              }}
              getItemLayout={(data, index)=>getItemLayout(data, index, 420)}
              showsVerticalScrollIndicator={false}
              data={[...completedList]}
              ListFooterComponent={() => {
                return (
                  <View>
                    {loadingMoreDataCompleted && (
                      <View mt={16}>
                        <ActivityIndicator size={"small"} color={"#000"} />
                      </View>
                    )}
                    <View mb={180} />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <CareerTasterCard item={item} index={index} show={true} />
              )}
            />
          ) : (
            <View ai="center" jc="center" f={1}>
              <Text>No career taster found.</Text>
            </View>
          ))}
        {selectedItem === 4 &&
          (savedPage === 1 && isFetchingSaved ? (
            <View f={1} jc="center" ai="center">
              <ActivityIndicator size={"large"} color={"#000"} />
            </View>
          ) : savedList?.length > 0 ? (
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                onReachedEndSaved();
              }}
              getItemLayout={(data, index)=>getItemLayout(data, index, 420)}
              showsVerticalScrollIndicator={false}
              data={[...savedList]}
              ListFooterComponent={() => {
                return (
                  <View>
                    {loadingMoreDataSaved && (
                      <View mt={16}>
                        <ActivityIndicator size={"small"} color={"#000"} />
                      </View>
                    )}
                    <View mb={180} />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                gap: 8,
                flexGrow: 1,
                paddingBottom: 100,
              }}
              renderItem={({ item, index }) => (
                <CareerTasterCard item={item} index={index} show={true} />
              )}
            />
          ) : (
            <View ai="center" jc="center" f={1}>
              <Text>No career taster found.</Text>
            </View>
          ))}
      </View>
    </View>
  );
};

export default CareerTasterHome;
