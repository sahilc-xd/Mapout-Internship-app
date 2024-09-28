import { createSelector } from "reselect";

const selectUser = state => state.user;

export const makeSelectUserCareerJourneyDay = () => createSelector(
    selectUser,
    userState => {
        if(userState?.careerJourneyDay){
            return userState?.careerJourneyDay;
        }
        return 1
    }
)

export const makeSelectUserId = () => createSelector(
    selectUser,
    userState => {
        if(userState?.user_id){
            return userState?.user_id;
        }
        return false
    }
)

export const makeSelectUserRole = () => createSelector(
    selectUser,
    userState => {
        if(userState?.workDetails?.[0]?.role){
            return userState?.workDetails?.[0]?.role;
        }
        return false
    }
)