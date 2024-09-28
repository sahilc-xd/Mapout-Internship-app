import { createSelector } from "reselect";

const selectHome = state => state.home;

export const makeSelectExploreBookmark = () => createSelector(
    selectHome,
    homeState => {
        return homeState?.isBookmarkedExplore || false
    }
)

export const makeSelectLODBookmark = () => createSelector(
    selectHome,
    homeState => {
        return homeState?.isBookmarkedLOD || false
    }
)

export const makeSelectDLBookmark = () => createSelector(
    selectHome,
    homeState => {
        return homeState?.isBookmarkedDL || false
    }
)

export const makeSelectGetMentorData = (mentorId)=>  createSelector(
    selectHome,
    homeState => {
        return homeState?.mentorsData?.find((mentor) => mentor._id === mentorId) || false
    }
)

export const makeSelectGetAllMentorData = ()=>  createSelector(
    selectHome,
    homeState => {
        if(homeState?.mentorsData?.length>0){
            return homeState?.mentorsData
        }
        return []
    }
)
