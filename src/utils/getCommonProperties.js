import { Platform } from "react-native";
import { store } from "../redux/store";
import { codepush_version, version_code, version_name } from "./config";
import {getBrand, getDeviceId} from 'react-native-device-info';

const getCommonProperties = ()=>{
    const state= store?.getState();
    const userDetails = state?.user
    const user_name = userDetails?.name || ""
    const user_email = userDetails?.email || ""
    const user_id = userDetails?.user_id || ""
    const timeStamp = (new Date).toString();
    const mobile= userDetails?.mobile ? `${userDetails?.mobile}` : "";
    const current_screen = state?.home?.currentScreen;
    const platform= Platform.OS == 'ios' ? 'ios' : 'android'
    const app_version = version_name + `(${version_code})`
    const codepush_v = codepush_version;
    const device_brand =  getBrand()
    const device_model = getDeviceId()
    const properties = {user_name, user_email, user_id, timeStamp, current_screen, platform, app_version, codepush_v, device_brand, device_model, mobile}
    return properties;
}

export default getCommonProperties;