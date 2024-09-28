import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../newScreens/OnboardingScreen';
import SignUpScreen from '../newScreens/SignUpScreen';
import OTPScreen from '../newScreens/OTPScreen';
import EnterLoginInfoScreen from '../newScreens/EnterLoginInfoScreen';
import SignUpForm from '../newScreens/SignUpForm';
import IntroScreen from '../newScreens/IntroScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {headerShown: false, animation: 'slide_from_right'};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}>
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Welcome" component={OnboardingScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* <Stack.Screen name="Login" component={Login} /> */}
      <Stack.Screen name="VerifyOTP" component={OTPScreen} />
      <Stack.Screen name="EnterLoginInfo" component={EnterLoginInfoScreen} />
      <Stack.Screen name="SignUpForm" component={SignUpForm} options={{gestureEnabled: false}}/>
    </Stack.Navigator>
  );
}

export default AuthStack;
