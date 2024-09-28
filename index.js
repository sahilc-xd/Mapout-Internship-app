import { AppRegistry, Platform, Text, TextInput } from "react-native";
import "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import PushNotification from 'react-native-push-notification';

import App from "./src";
import { name as appName } from "./app.json";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Message handled in the background!", remoteMessage);
  
  if (Platform.OS === "android") {
    const channelConfig = {
      channelId: "123456",
      channelName: "MapOut Push Notification",
      channelDescription: "A channel to categorize your notifications",
      playSound: false,
      soundName: "default",
      importance: 4,
      vibrate: true,
    };
  
    PushNotification.createChannel(channelConfig, created => {
      console.log(`createChannel returned '${created}' for config:`, channelConfig);
    });
   }

  const navigateToScreen = remoteMessage.data?.navigateToScreen;
  if (navigateToScreen) {
    switch (navigateToScreen) {
      case 'Settings':
        // Implement your navigation logic to redirect to the Settings screen
        break;
      case 'Profile':
        // Implement your navigation logic to redirect to the Profile screen
        break;
      // Add more cases as needed
      default:
        // Handle unknown screen name
        break;
    }
  }
  
  // Handle the background message as needed
  const notificationColor = "#000000";
  PushNotification.localNotification({
    channelId: "123456",
    title: remoteMessage.data.title,
    message: remoteMessage.data.body,
    color: notificationColor, // Set the background color
    smallIcon: 'ic_notification', 
    largeIcon: 'ic_notification', 
  });
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.fontFamily = 'Manrope';
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);
