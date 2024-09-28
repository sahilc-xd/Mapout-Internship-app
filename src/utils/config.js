import { Platform } from "react-native";

export const appLink = Platform.OS ==='android' ? "https://play.google.com/store/apps/details?id=com.mapout" : "https://play.google.com/store/apps/details?id=com.mapout";
export const codepush_version = 0;
export const version_code = 6;
export const version_name= Platform.OS ==='android' ?  "1.0.0" : "1.0.3";