import {createSlice} from '@reduxjs/toolkit';
import {api} from './api';

interface ChatState {
  token: string | null;
}

const initialState: ChatState = {
  token: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    saveChatToken: (state, action) => {
      state.token = action.payload;
    }
    // googleLogin: (state, action) => {
    //   state.token = action.payload.idToken;
    //   state.email = action.payload.user.email;
    // },
    // logout: state => {
    //   state.token = null;
    //   state.email = null;
    // },
  },
  // extraReducers: builder => {
  //   builder.addMatcher(
  //     api.endpoints.verifyOtp.matchFulfilled,
  //     (state, action) => {
  //       state.token = action.payload?.data?.token;
  //       state.email = action.payload?.data?.email;
  //       return state;
  //     },
  //   );
  //   builder.addMatcher(
  //     api.endpoints.googleSignIn.matchFulfilled,
  //     (state, action) => {
  //       state.token = action.payload?.data?.token;
  //       state.email = action.payload?.data?.email;
  //       return state;
  //     },
  //   );
  //   builder.addMatcher(
  //     api.endpoints.appleSignIn.matchFulfilled,
  //     (state, action) => {
  //       state.token = action.payload?.data?.token;
  //       state.email = action.payload?.data?.email;
  //       return state;
  //     },
  //   );
  // },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
