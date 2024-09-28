import React, { useEffect, useState } from "react";
import { api } from "../../redux/api";
import usePagination from "../../hooks/usePagination";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native-style-shorthand";
import JobsCardSmall from "./JobsCardSmall";
import { Text } from "../../components";
import { useAppSelector } from "../../redux";
import { ClipPath } from "react-native-svg";

const SavedJobs = props => {
  const { updateSaved } = props;
  const user = useAppSelector(state => state?.user);
  const [allSavedJobs, setAllSavedJobs] = useState([]);
  const [savedJobsFinal, setSavedJobsFinal] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [
    getSavedJobs,
    {
      data: savedJobs,
      isSuccess: savedJobsSuccess,
      isFetching: isFetchingSavedJObs,
    },
  ] = api.useLazyFetchSavedJobsQuery();
  const {
    data: savedJobList,
    page: savedJobListPage,
    onReachedEnd: onReachedSavedJobsEnd,
    loadingMoreData: loadMoreSavedJobsData,
    reset,
  } = usePagination("", allSavedJobs, 10, 0);

  useEffect(() => {
    getSavedJobs({ user_id: user?.user_id, page: savedJobListPage });
  }, [savedJobListPage]);

  useEffect(() => {
    if (!isFetchingSavedJObs && savedJobsSuccess) {
      setRefreshing(false);
      if (savedJobs?.saved_jobs?.length > 0) {
        setAllSavedJobs([...savedJobs?.saved_jobs]);
        if (savedJobListPage === 0) {
          setSavedJobsFinal([...savedJobs?.saved_jobs]);
        } else {
          setSavedJobsFinal(prv => {
            return [...prv, ...savedJobs?.saved_jobs];
          });
        }
      }
    }
  }, [isFetchingSavedJObs]);

  const onRefresh = () => {
    reset();
  };

  const updateSavedFromSavedScreen = ({ url, save }) => {
    updateSaved({ url, save });
    const savedJobs = savedJobsFinal?.map(item => {
      let jobsData = { ...item };
      if (jobsData?.link === url) {
        jobsData = { ...item, isSaved: save ? 1 : 0, hide: true };
      }
      return jobsData;
    });
    setSavedJobsFinal([...savedJobs]);
  };

  return (
    <View f={1}>
      <View f={1} mt={16}>
        {isFetchingSavedJObs && savedJobListPage == 0 ? (
          <View f={1} jc="center" ai="center">
            <ActivityIndicator size={"large"} color={"#000"} />
          </View>
        ) : savedJobListPage == 0 && savedJobsFinal?.length === 0 ? (
          <View f={1} jc="center" ai="center">
            <Text
              ftsz={14}
              weight="600"
              ta="center"
              c={"#000"}>{`No Saved jobs found.`}</Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            data={[...savedJobsFinal]}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item, index }) => {
              return (
                <>
                  {item?.hide !== true && (
                    <View mb={16}>
                      <JobsCardSmall
                        item={item}
                        updateSaved={updateSavedFromSavedScreen}
                      />
                    </View>
                  )}
                </>
              );
            }}
            onEndReached={onReachedSavedJobsEnd}
            ListFooterComponent={() => {
              return (
                <View>
                  {loadMoreSavedJobsData && (
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
    </View>
  );
};

export default SavedJobs;
