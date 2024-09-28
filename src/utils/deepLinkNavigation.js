import React from "react";
import { URL } from "@env";
import { navigate, pushNavigation } from "./navigationService";
import { store } from "../redux/store";
import homeSlice, { homeActions } from "../redux/homeSlice";

const DeepLinkNavigation = link => {
  const [base, param, slug, ...rest] = link?.split(URL)[1]?.split("/") || [];
  const state = store?.getState();
  const { token } = state.auth;
  if (!base) {
    navigate("BottomTab", { screen: "Dashboard" });
  } else {
    if (base && base[0] == "?") {
      navigate("BottomTab", { screen: "Dashboard" });
    } else {
      const [newbase, newParam] = [base, param].map(
        str =>
          str &&
          ["&", "#", "?"].reduce((acc, ele) => acc.split(ele)[0] || acc, str),
      );
      if (token) {
        switch (newbase) {
          case "jobs": {
            navigate("BottomTab", { screen: "Jobs" });
            break;
          }
          case "dashboard": {
            navigate("BottomTab", { screen: "Dashboard" });
            break;
          }
          case "feed": {
            navigate("BottomTab", { screen: "Feed" });
            break;
          }
          case "profile": {
            if (!newParam) {
              navigate("Profile");
            } else {
              navigate("UserProfile", { sharedId: newParam });
            }
            break;
          }
          case "post": {
            if (!newParam) {
              navigate("BottomTab", { screen: "Feed" });
            } else {
              pushNavigation("ViewPostScreen", {
                showFollow: true,
                post_id: newParam,
              });
            }
            break;
          }
          case "career-taster": {
            newParam?.length > 0
              ? navigate("CareerTasterScreen", { id: newParam })
              : navigate("BottomTab", {
                  screen: "Jobs",
                  params: { tab: "CareerTaster" },
                });
            break;
          }
          case "refer": {
            newParam?.length > 0 &&
              store.dispatch(homeActions.setReferralCode(newParam));
            break;
          }
          default: {
            navigate("BottomTab", { screen: "Dashboard" });
            break;
          }
        }
      } else {
        switch (newbase) {
          case "refer": {
            newParam?.length > 0 &&
              store.dispatch(homeActions.setReferralCode(newParam));
            break;
          }
          default: {
            navigate("Welcome");
            break;
          }
        }
      }
    }
  }
};

export default DeepLinkNavigation;
