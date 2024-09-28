import { StackActions, useNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = useNavigationContainerRef();

export const navigate = (screenName, params={})=>{
    //for normal navigation which will replace if already screen exists
    if(navigationRef.isReady()){
        navigationRef.navigate(screenName, params);
    }
}

export const pushNavigation = (screenName, params={})=>{
    //this will push the screen on top of navigation irrespective of screen exists in stack
    if(navigationRef.isReady()){
        const pushAction = StackActions.push(screenName, params);
        navigationRef.dispatch(pushAction);
    }
}

export const popNavigation = ( noOfScreens = 1 )=>{
    // this will pop back to the specified number of screens, defaults to 1.
    if(navigationRef.isReady() && navigationRef.canGoBack()){
        const popAction = StackActions.pop(noOfScreens);
        navigationRef.dispatch(popAction);
    }
}