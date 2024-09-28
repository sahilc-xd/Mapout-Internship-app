
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueId, syncUniqueId } from "react-native-device-info";
import { setDeviceUniqueId } from "../redux/authSlice";
import { store } from "../redux/store";
import { Platform } from "react-native";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    // console.log("Authorization status:", authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async () => {
  let checkToken = await AsyncStorage.getItem("notificationToken");
  if (!checkToken || checkToken === '') {
    try {
      const fcmToken = await messaging().getToken();
      if (!!fcmToken) {
        await AsyncStorage.setItem("notificationToken", fcmToken);
      }
    } catch (error) {
      alert(error?.message);
    }
  }
};

export const getDeviceUniqueId=async()=>{
  const state = store.getState().auth;
  const uniqueDeviceToken = state.deviceUniqueId;
  if(!uniqueDeviceToken?.length > 0){
    const t = Platform.OS === 'ios' ? await syncUniqueId() :  await getUniqueId();
    console.log(t);
    store.dispatch(setDeviceUniqueId(t));
  }
}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification,
    );
    console.log("backgrund state", remoteMessage.notification);
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification,
        );
        console.log("remote message", remoteMessage.notification);
      }
    });
};
