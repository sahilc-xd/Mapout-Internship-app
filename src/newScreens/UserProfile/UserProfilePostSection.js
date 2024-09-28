import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
} from "react-native-style-shorthand";
import PostCard from "../Feed/PostCard";
import { api } from "../../redux/api";
import usePagination from "../../hooks/usePagination";
import { useAppSelector } from "../../redux";
import { Text } from "../../components";

const UserProfilePostSection = ({
  postList = [],
  isFetching,
  postListPage = 1,
}) => {
  return (
    <View f={1}>
      {isFetching && postListPage === 1 ? (
        <View f={1} jc="center" ai="center">
          <ActivityIndicator mt={32} size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {postList?.length > 0 ? (
            <FlatList
              data={postList}
              keyExtractor={(item, index) => item?._id?.toString()}
              renderItem={({ item }) => (
                <PostCard item={item} showFollow={false} />
              )}
              initialNumToRender={20}
            />
          ) : (
              <View
              f={1}
                bgc={"rgba(217, 217, 217, 0.65)"}
                mt={16}
                mh={16}
                ai="center"
                jc="center"
                pv={16}
                br={12}>
                <Text ftsz={14} weight="600">
                  No posts yet.
                </Text>
              </View>
          )}
        </>
      )}
    </View>
  );
};

export default UserProfilePostSection;
