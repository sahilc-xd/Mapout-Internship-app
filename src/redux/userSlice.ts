import {createSlice} from '@reduxjs/toolkit';
import {api} from './api';

interface User {}

const initialState: User | {} = {};

const updateFieldReducer = (field) => (state, action) => {
  return {
    ...state,
    [field]: action.payload,
  };
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    saveCareerStage: (state, action) => {
      return {
        ...state,
        career_stage: action.payload,
      };
    },
    saveFlow: (state, action) => {
      return {
        ...state,
        flow: action.payload,
      };
    },
    saveCareer: (state, action) => {
      return {
        ...state,
        career: action.payload,
      };
    },
    updateLastUpdateStatus: (state, action) => {
      if(state?.lastUpdate === 'Dashboard' || state?.lastUpdate === 'Jobs' || state?.lastUpdate === 'Coaching'){
        return{
          ...state
        }
      }
      else{
        return {
          ...state,
          lastUpdate : action.payload
        }
      }
    },
    updatePreference: (state, action) => {
        return {
          ...state,
          lastUpdate : action.payload
        }
    },
    saveChatToken: (state, action) => {
      return {
        ...state,
        chatToken: action.payload
      }
    },
    changeProfilePic: updateFieldReducer('profilePic'),
    changeCareerJourneyDay: updateFieldReducer('careerJourneyDay'),
    saveProfile: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase("auth/logout", () => initialState);

    builder.addMatcher(api.endpoints.googleSignIn.matchFulfilled, (state, action) => ({
      ...state,
      ...action.payload.data,
    }));


    builder.addMatcher(api.endpoints.appleSignIn.matchFulfilled, (state, action) => ({
      ...state,
      ...action.payload.data,
    }));
    
    builder.addMatcher(api.endpoints.parseCV.matchFulfilled, (state, action) => ({
      ...state,
      cvParserData: action.payload?.data,
    }));

    builder.addMatcher(
      api.endpoints.verifyOtp.matchFulfilled,
      (state, action) => action.payload?.data
    );

    builder.addMatcher(
      api.endpoints.getUserProfile.matchFulfilled,
      (state, action) => ({
        ...state,
        ...action.payload?.data[0],
      })
    );
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
