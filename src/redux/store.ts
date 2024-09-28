import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {persistReducer} from 'redux-persist';

import {api} from './api';
import authReducer from './authSlice';
import userReducer from './userSlice';
import careerTestReducer from './careerTestSlice';
import homeReducer from './homeSlice';
import chatReducer from './chatSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  blacklist: ['api', 'home'],
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  user: userReducer,
  careerTest: careerTestReducer,
  home: homeReducer,
  chat: chatReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let createDebugger: any = () => {};
let middleware = [api.middleware];
if (__DEV__) {
  createDebugger = require('redux-flipper').default;
  middleware.push(createDebugger());
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
