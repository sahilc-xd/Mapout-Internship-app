import {createSlice} from '@reduxjs/toolkit';
import {api} from './api';

interface HomeState {
  feed_sequence: string[]
  isBookmarkedLOD: Boolean
  isBookmarkedExplore: Boolean,
  isBookmarkedDL: Boolean,
  mentorsData: object[],
  apiCallStatus: {
    dailyLearning: boolean;
    QOD: boolean;
    LOD: boolean;
    Explore: boolean;
  };
  currentScreen: string,
  update_popup: {},
  network_logger: string[],
  isDeviceOffline: boolean,
  showNotificationIcon: boolean,
  newJobsCount: number,
  personalCoach: {},
  userFollowingStatus: object[],
  posts: object[],
  followingsCount: number,
  referralCode: string,
}

const initialState: HomeState = {
  feed_sequence: [
    "Insights",
    "Daily Learning",
    "Explore and LOD",
    "Quote"
  ],
  isBookmarkedLOD: false,
  isBookmarkedExplore: false,
  isBookmarkedDL: false,
  mentorsData: [],
  apiCallStatus: {
    dailyLearning: false,
    QOD: false,
    LOD: false,
    Explore: false
  },
  currentScreen: "",
  update_popup: 
    {
      hard_update: {
        enable: false,
        version: []
      },
      soft_update: {
        enable: true,
        version: []
      }
    
  },
  network_logger: [],
  isDeviceOffline: false,
  showNotificationIcon: false,
  newJobsCount: 0,
  personalCoach: {},
  userFollowingStatus: [],
  posts: [],
  followingsCount: 0,
  referralCode: "",
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    remoteConfigData: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    updateCurrentScreen: (state, action)=>{
      return{
        ...state,
        currentScreen: action?.payload
      }
    },
    updateLODBookmark: (state, action)=> {
      return{
        ...state,
        isBookmarkedLOD: action?.payload
      }
    },
    updateExploreBookmark: (state, action)=> {
      return{
        ...state,
        isBookmarkedExplore: action?.payload
      }
    },
    updateDLBookmark: (state, action)=> {
      return{
        ...state,
        isBookmarkedDL: action?.payload
      }
    },
    setMentorsData: (state, action)=>{
      return{
        ...state,
        mentorsData: action?.payload
      }
    },
    updateApiCallStatus: (state, action) => {
      const { apiName, status } = action?.payload;
      return { ...state, apiCallStatus: { ...state.apiCallStatus, [apiName]: status } };
    },
    updateDeviceOffline:(state, action)=>{
      return{
        ...state,
        isDeviceOffline: action?.payload
      }
    },
    updateShowNotificationIcon: (state, action)=>{
      return{
        ...state,
        showNotificationIcon: action?.payload
      }
    },
    updateJobsCount: (state, action)=>{
      return{
        ...state,
        newJobsCount: action?.payload
      }
    },
    updatePersonalCoach: (state, action)=>{
      return{
        ...state,
        personalCoach: action?.payload
      }
    },
    updatePosts: (state, action)=>{
      return{
        ...state,
        posts: action?.payload
      }
    },
    updateUserFollowingStatus: (state, action)=>{
      return{
        ...state,
        userFollowingStatus: action?.payload
      }
    },
    setReferralCode: (state,action)=>{
      return{
        ...state,
        referralCode: action?.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getQuoteOfTheDay.matchFulfilled, (state, action) => {
      state.apiCallStatus.QOD = true;
    });
    builder.addMatcher(api.endpoints.getLetterOfTheDay.matchFulfilled, (state, action) => {
      state.apiCallStatus.LOD = true;
    });
    builder.addMatcher(api.endpoints.getDailyLearning.matchFulfilled, (state, action) => {
      state.apiCallStatus.dailyLearning = true;
    });
    builder.addMatcher(api.endpoints.getExploreData.matchFulfilled, (state, action) => {
      state.apiCallStatus.Explore = true;
    });
    builder.addMatcher(api.endpoints.getFollowings.matchFulfilled, (state, action) => {
      state.followingsCount = action?.payload?.totalFollowings;
      let followersStatus = [...state.userFollowingStatus] || [];
      action?.payload?.userFollowings?.forEach((item)=>{
        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: true
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: true
          }
          followersStatus.push(updatedFollower);
        }
      })
      state.userFollowingStatus = followersStatus;
    });
    builder.addMatcher(api.endpoints.getFollowers.matchFulfilled, (state, action) => {
      let followersStatus = [...state.userFollowingStatus] || [];
      action?.payload?.userFollowers?.forEach((item)=>{
        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item?.followBack
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item?.followBack
          }
          followersStatus.push(updatedFollower);
        }
      })
      state.userFollowingStatus = followersStatus;
    });
    builder.addMatcher(api.endpoints.getPosts.matchFulfilled, (state, action) => {
      let posts = state.posts || [];
      let followersStatus = [...state.userFollowingStatus] || [];
      action?.payload?.posts?.forEach((item, index)=>{
        const ind = posts?.findIndex(i=> i?._id === item._id);
        if(ind>=0){
          posts[ind] = item;
        }else{
          posts.push(item);
        }

        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus.push(updatedFollower);
        }
      })
      state.userFollowingStatus = followersStatus;
      state.posts = posts;
    });
    builder.addMatcher(api.endpoints.getUsersPosts.matchFulfilled, (state, action) => {
      let posts = state.posts || [];
      let followersStatus = [...state.userFollowingStatus] || [];
      action?.payload?.posts?.forEach((item, index)=>{
        const ind = posts?.findIndex(i=> i?._id === item._id);
        if(ind>=0){
          posts[ind] = item;
        }else{
          posts.push(item);
        }

        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus.push(updatedFollower);
        }
      })
      state.userFollowingStatus = followersStatus;
      state.posts = posts;
    });
    builder.addMatcher(api.endpoints.getSavedPosts.matchFulfilled, (state, action) => {
      let posts = state.posts || [];
      let followersStatus = [...state.userFollowingStatus] || [];
      action?.payload?.posts?.forEach((item, index)=>{
        const ind = posts?.findIndex(i=> i?._id === item._id);
        if(ind>=0){
          posts[ind] = item;
        }else{
          posts.push(item);
        }

        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus.push(updatedFollower);
        }
      })
      state.userFollowingStatus = followersStatus;
      state.posts = posts;
    });
    builder.addMatcher(api.endpoints.getUserProfileData.matchFulfilled, (state, action) => {
      let followersStatus = [...state.userFollowingStatus] || [];
      const data = {user_id: action?.payload?.data?.userId, isFollowed: action?.payload?.data?.isUserFollowingOtherUser || false};
      const index = followersStatus?.findIndex((i)=>i.user_id === data?.user_Id);
      if(index>=0){
        followersStatus[index] = data;
      }
      else{
        followersStatus.push(data);
      }
      state.userFollowingStatus = followersStatus;
    });
    builder.addMatcher(api.endpoints.getSharedUserProfileData.matchFulfilled, (state, action) => {
      let followersStatus = [...state.userFollowingStatus] || [];
      const data = {user_id: action?.payload?.data?.userId, isFollowed: action?.payload?.data?.isUserFollowingOtherUser || false};
      const index = followersStatus?.findIndex((i)=>i.user_id === data?.user_Id);
      if(index>=0){
        followersStatus[index] = data;
      }
      else{
        followersStatus.push(data);
      }
      state.userFollowingStatus = followersStatus;
    });
    builder.addMatcher(api.endpoints.getUserProfile.matchFulfilled, (state, action) => {
      state.followingsCount = action?.payload?.data?.[0]?.followCountDetails?.totalFollowings || 0;
    });
    builder.addMatcher(api.endpoints.followUser.matchFulfilled, (state, action) => {
      state.followingsCount = state.followingsCount+1;
    });
    builder.addMatcher(api.endpoints.unfollowUser.matchFulfilled, (state, action) => {
      state.followingsCount = state.followingsCount-1;
    });
    builder.addMatcher(api.endpoints.getPostById.matchFulfilled, (state, action) => {
      let posts = state.posts || [];
      let followersStatus = [...state.userFollowingStatus] || [];
      const item = action?.payload
        const ind = posts?.findIndex(i=> i?._id === item._id);
        if(ind>=0){
          posts[ind] = item;
        }else{
          posts.push(item);
        }
        const fIndex = followersStatus?.findIndex(i=> i?.user_id === item.user_id);
        if(fIndex>=0){
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus[fIndex] = updatedFollower;
        }
        else{
          const updatedFollower = {
            user_id: item.user_id,
            isFollowed: item.isFollowed || false
          }
          followersStatus.push(updatedFollower);
        }
      state.userFollowingStatus = followersStatus;
      state.posts = posts;
    });
  },
});

export const homeActions = homeSlice.actions;

export default homeSlice.reducer;
