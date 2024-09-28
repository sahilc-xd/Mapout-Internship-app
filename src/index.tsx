import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import Toast from "react-native-toast-message";
import RNBootSplash from "react-native-bootsplash";
import { PersistGate } from "redux-persist/integration/react";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme, useNavigationContainerRef } from "@react-navigation/native";
// import { initStripe } from '@stripe/stripe-react-native';

import { api } from "./redux/api";
import { store } from "./redux/store";
import AppNavigator from "./navigator";

import { Linking, PermissionsAndroid, Platform, Text, TouchableOpacity } from "react-native";
import { getFcmToken, notificationListener, requestUserPermission } from "./utils/notification";
import crashlytics from "@react-native-firebase/crashlytics";
import withCodePush from "./utils/codepush";
import { startNetworkLogging } from 'react-native-network-logger';
import ErrorBoundary from "./screens/ErrorBoundary";
import { navigationRef } from "./utils/navigationService";
import { SafeAreaProvider } from "react-native-safe-area-context";
import logAnalyticsEvents from "./utils/logAnalyticsEvent";
import { homeActions } from "./redux/homeSlice";
import analytics from '@react-native-firebase/analytics';
// import {STRIPE_KEY} from '@env';

const navigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#000",
  },
};

let persistor = persistStore(store);
// Comment this line to reset the redux store
// persistor.purge();

const App = () => {
  const hideSplashScreen = () => {
    RNBootSplash.hide({ fade: true, duration: 250 });
  };
  
  startNetworkLogging();

  const requesNotificationPermission = () => {
    if(Platform.OS == "android" && Platform.Version > 32){
       PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(res => {
          if (!!res && res == "granted") {
            requestUserPermission();
            notificationListener();
          }else{
            getFcmToken();
          }
        })
        .catch(error => {
          console.log(error,"something wrong in notification permission check");
        });
    }
    else if(Platform.OS == "android"){
      getFcmToken();
    }
    else{
      requestUserPermission();
      notificationListener();
    }
  }

  useEffect(() => {
    requesNotificationPermission();
  }, []);

  // useEffect(() => {
  //   initStripe({
  //     publishableKey: STRIPE_KEY,
  //   });
  // }, []);

  const routeNameRef = useRef();

  const onNavigationStateChange = async() => {
    const previousRouteName = routeNameRef?.current;
    const currentRouteName = navigationRef?.getCurrentRoute()?.name;
    const updateState = {
      previousRouteName: previousRouteName,
      currentRouteName: currentRouteName,
    }
    if (previousRouteName !== currentRouteName) {
      crashlytics().log(JSON.stringify(updateState));
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
      logAnalyticsEvents("screen_visited", {currentScreen : currentRouteName, previousScreen: previousRouteName} );
    }
    routeNameRef.current = currentRouteName;
  }
  
  Linking.getInitialURL()
  .then(url => {
    if (url) {
      // Parse and handle the deep link URL here
      // You can use React Navigation to navigate to the appropriate screen
      // if (url.includes('details')) {
      //   navigationRef.navigate('details');
      // }
    }
  })
  .catch(error => console.error('Error handling deep link', error));


  return (
    <SafeAreaProvider>
      <ErrorBoundary>
      <ApiProvider api={api}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer
              ref={navigationRef}
              theme={navigatorTheme}
              onReady={()=>{
                hideSplashScreen()
                routeNameRef.current = navigationRef.getCurrentRoute().name;
                }}
              onStateChange={()=>{
                store?.dispatch(homeActions?.updateCurrentScreen(navigationRef?.getCurrentRoute()?.name));
                onNavigationStateChange()}}>
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </PersistGate>
        </Provider>
      </ApiProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default withCodePush(gestureHandlerRootHOC(App));
