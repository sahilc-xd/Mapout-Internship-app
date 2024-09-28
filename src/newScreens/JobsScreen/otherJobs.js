import React, { useEffect, useState } from "react";
import { api } from "../../redux/api";
import usePagination from "../../hooks/usePagination";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import JobsCardSmall from "./JobsCardSmall";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import { navigate } from "../../utils/navigationService";

const OtherJobs = props => {
  const { updateSaved } = props;
  const user = useAppSelector(state => state?.user);
  const [allOtherJobs, setAllOtherJobs] = useState([]);
  const [otherJobsFinal, setOtherJobsFinal] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [
    getOtherJobs,
    {
      data: otherJobs,
      isSuccess: otherJobsSuccess,
      isFetching: isFetchingOtherJobs,
    },
  ] = api.useLazyGetOtherJobsQuery();
  const {
    data: otherJobList,
    page: otherJobListPage,
    onReachedEnd: onReachedOtherJobsEnd,
    loadingMoreData: loadMoreOtherJobsData,
    reset,
  } = usePagination("", allOtherJobs, 25, 0);

  useEffect(() => {
    getOtherJobs({ user_id: user?.user_id, page_number: otherJobListPage });
  }, [otherJobListPage]);

  useEffect(() => {
    if (!isFetchingOtherJobs && otherJobsSuccess) {
      setRefreshing(false);
      setAllOtherJobs(otherJobs?.jobs);
      if (otherJobListPage === 0) {
        setOtherJobsFinal(otherJobs?.jobs);
      } else {
        setOtherJobsFinal(prv => {
          return [...prv, ...otherJobs?.jobs];
        });
      }
    }
  }, [isFetchingOtherJobs, otherJobsSuccess]);

  const onRefresh = () => {
    reset();
  };

  const updateOtherFromOtherScreen = ({ url, save }) => {
    updateSaved({ url, save });
    const otherJobs = otherJobsFinal?.map(item => {
      let jobsData = { ...item };
      if (jobsData?.link === url) {
        jobsData = { ...item, isSaved: save ? 1 : 0 };
      }
      return jobsData;
    });
    setOtherJobsFinal(otherJobs);
  };

  return (
    <View f={1}>
      <View f={1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View f={1}>
            <Text
              mt={16}
              z={1}
              po="absolute"
              bgc={"#B9E4A6"}
              ph={8}
              br={15}
              pv={4}
              r={12}
              ftsz={11}
              weight="600"
              c={'#222222'}
              t={-12}>
              Beta feature
            </Text>
            <View
              mt={16}
              mb={16}
              bgc={"rgba(102, 145, 255, 0.25)"}
              ph={12}
              br={8}
              pv={16}>
              <Text ftsz={11} weight="400" c={'#222222'}>
                Discover alternative career paths with our "Other Jobs to
                Explore" feature. Based on your skills and experience, these are
                exciting new roles that could be a perfect fit for you.
              </Text>
            </View>
            {isFetchingOtherJobs && otherJobListPage == 0 ? (
              <View f={1} jc="center" ai="center">
                <ActivityIndicator size={"large"} color={"#000"} />
              </View>
            ) : otherJobListPage == 0 && otherJobsFinal?.length === 0 ? (
              <View f={1} jc="center" ai="center">
                <Text
                  ftsz={14}
                  weight="600"
                  ta="center"
                  c={"#000"}>{`No Other jobs found.`}</Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                data={[...otherJobsFinal]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                keyExtractor={(item,index)=> index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {
                        index === 3 && user?.overAllPercentage < 75 && 
                          <TouchableOpacity mb={16} ph={16} pv={16} br={16} bgc={'rgba(255, 255, 255, 0.75)'} onPress={()=>{navigate('Profile')}}>
                            <Text ftsz={12} weight="500">Not satisfied with our recommendations? Complete your <Text ftsz={13} weight="500">MapOut profile</Text> to get the best results.</Text>
                          </TouchableOpacity>
                      }
                      <View mb={16}>
                        <JobsCardSmall
                          item={item}
                          updateSaved={updateOtherFromOtherScreen}
                          hideScore={true}
                        />
                      </View>
                    </>
                  );
                }}
                onEndReached={onReachedOtherJobsEnd}
                ListFooterComponent={() => {
                  return (
                    <View>
                      {loadMoreOtherJobsData && (
                        <View z={50} mt={20}>
                          <ActivityIndicator color={"#000"} />
                        </View>
                      )}
                      <View mb={180} />
                    </View>
                  );
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OtherJobs;
