import {createSlice} from '@reduxjs/toolkit';
import {api} from './api';

interface AuthState {
  token: string | null;
  chatToken: string | null;
  firstTimeUser: boolean;
  email: string | null;
  deviceUniqueId: string | null;
}

const initialState: AuthState = {
  token: null,
  chatToken: null,
  email: null,
  firstTimeUser: true,
  deviceUniqueId: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    googleLogin: (state, action) => {
      state.token = action.payload.idToken;
      state.email = action.payload.user.email;
    },
    logout: state => {
      state.token = null;
      state.email = null;
      state.chatToken = null;
    },
    saveChatToken: (state, action) => {
      state.chatToken = action.payload;
    },
    setDeviceUniqueId: (state, action) => {
      state.deviceUniqueId = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      api.endpoints.verifyOtp.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.data?.token;
        state.email = action.payload?.data?.email;
        return state;
      },
    );
    builder.addMatcher(
      api.endpoints.googleSignIn.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.data?.token;
        state.email = action.payload?.data?.email;
        return state;
      },
    );
    builder.addMatcher(
      api.endpoints.appleSignIn.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.data?.token;
        state.email = action.payload?.data?.email;
        return state;
      },
    );
  },
});

export const {logout, googleLogin, saveChatToken, setDeviceUniqueId} = authSlice.actions;

export default authSlice.reducer;
