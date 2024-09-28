import React, {useEffect, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {GOOGLE_WEB_CLIENT_ID} from '@env';
import AuthStack from './AuthStack';
import { useAppSelector } from '../redux';
import AuthorisedStack from './AuthorisedStack';
import NetworkLogs from '../screens/NetworkLogs';
import remoteConfig from '@react-native-firebase/remote-config';
import {  useDispatch } from 'react-redux';
import { homeActions } from '../redux/homeSlice';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Text, TouchableOpacity, View } from 'react-native-style-shorthand';
import logAnalyticsEvents from '../utils/logAnalyticsEvent';
import UpdatePopup from '../components/UpdatePopup';
import { navigate, navigationRef } from '../utils/navigationService';
import { addEventListener } from "@react-native-community/netinfo";
import NoInternetScreen from '../screens/NoInternetScreen';
import { API_URL } from "@env";
import { getDeviceUniqueId } from '../utils/notification';

const Stack = createNativeStackNavigator();

const AppNavigator=(props)=> {

  useEffect(()=>{
    logAnalyticsEvents("app_start",{});
    getDeviceUniqueId();
  },[])

  const {token} = useAppSelector((state) => state.auth);
  const {email = false} = useAppSelector((state) => state.user);
  const {network_logger} = useAppSelector((state) => state.home);
  const {isDeviceOffline} = useAppSelector((state) => state.home);
  const dispatch = useDispatch();
  let remoteData= {}

  useEffect(()=>{
    const unsubscribe = addEventListener(state => {
      if(state.isConnected || state.isInternetReachable){
        dispatch(homeActions.updateDeviceOffline(false));
      }
      else{
        dispatch(homeActions.updateDeviceOffline(true));
        navigate('NoInternetScreen');
      }
    });

    return ()=>{
      unsubscribe();
    }
  },[])

  const getRemoteConfigData=()=>{
    remoteConfig().fetch(0)
    .then(() => remoteConfig().activate())
    .then(fetchedRemotely => {
      return remoteConfig().getAll()
    }).then((snapshot)=>{
      Object.entries(snapshot).forEach((val)=>{
        const [key, entry] = val;
        remoteData[key] = JSON.parse(entry.asString());
      })
      dispatch(homeActions.remoteConfigData(remoteData));
    }).catch(()=>{
      // console.log("errrr");
    })
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
    getRemoteConfigData();
  }, []);

  return (
    <View style={{ flex: 1}}>
      <BottomSheetModalProvider>
      {(network_logger?.includes(email) || API_URL?.includes('dev')) && <TouchableOpacity style={{position: 'absolute', bottom:50, zIndex: 10, borderRadius: 10, backgroundColor: '#f5f', left: 0}} onPress={()=>{
        navigationRef?.navigate('NetworkLogs');
      }}>
        <Text style={{padding: 4}}>Logs</Text>
      </TouchableOpacity>}
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
          }}>
          {
            isDeviceOffline ? (<Stack.Screen name="NoInternetScreen" component={NoInternetScreen} />) :
          <>{!token ? (
            <Stack.Screen name="Auth" component={AuthStack} />
          ) : (
            <Stack.Screen name="Authorised" component={AuthorisedStack} />
          )}
            <Stack.Screen name="NetworkLogs" component={NetworkLogs} />
          </>
          }
        </Stack.Navigator>
      </BottomSheetModalProvider>
      <UpdatePopup/>
    </View>
  );
}

export default AppNavigator;
