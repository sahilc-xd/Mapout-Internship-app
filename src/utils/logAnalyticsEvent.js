import analytics from '@react-native-firebase/analytics';
import getCommonProperties from './getCommonProperties';

const logAnalyticsEvents =async(eventName="Unknown_Event", eventProperties={})=>{
  const getCommonProperty = getCommonProperties();
  const properties = { ...getCommonProperty, ...eventProperties }
  await analytics().logEvent(eventName, {...properties});
}

export default logAnalyticsEvents;