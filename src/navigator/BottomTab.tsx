import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from './TabBar';
import DashboardScreen from '../newScreens/DashboardScreen';
import JobsScreen from '../newScreens/JobsScreen';
import Feed from '../newScreens/Feed';

const Tab = createBottomTabNavigator();

export function BottomTab(props) {
  const initialScreen =  props?.route?.params?.initialScreen || 'Dashboard';
  
  return (
    <Tab.Navigator
      initialRouteName= {initialScreen}
      backBehavior='none'
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true, 
      }} 
       
      tabBar={(props)=> {
        return(
          <MyTabBar {...props} />
        )
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen}/>
      <Tab.Screen name="Jobs" component={JobsScreen}/>
      <Tab.Screen name="Feed" component={Feed}/>
    </Tab.Navigator>
  );
}