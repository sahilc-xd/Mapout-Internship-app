import {API_URL, API_KEY} from '@env';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import { logout } from './authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, {getState}: {getState: () => any}) => {
    const token = getState().auth.token;
    const uniqueId = getState().auth.deviceUniqueId;
    headers.set('api-key', API_KEY);
    if(uniqueId){
      headers.set('uniqueId', `${uniqueId}`);
    }
    if(!headers.has('x-api-version')){
      headers.set('x-api-version', '1');
    }
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  refetchOnFocus: true,
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['user', 'notification', 'talentBoard'],
  endpoints: builder => ({
    getUserProfile: builder.query({
      query: (user_id) => `mapout-node/api/profile/${user_id}`,
      providesTags: ['user'],
    }),
    sendOtp: builder.mutation({
      query: ({email="", phoneNumber, country_code}) => ({
        url: '/mapout-authentication/mapout/auth/otp/start',
        method: 'POST',
        body: {email, requestFrom: "app", phoneNumber, country_code: country_code},
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/mapout-authentication/mapout/auth/otp/candidate/complete',
        method: 'POST',
        body: {...data, requestFrom: "app"},
      }),
      invalidatesTags: ['user']
    }),
    verifyNew: builder.mutation({
      query: (data) => ({
        url: '/mapout-authentication/mapout/auth/otp/candidate/complete',
        method: 'POST',
        body: {...data, requestFrom: "app"},
      }),
    }),
    getCoachingGoals: builder.query({
      query: () => `mapout-node/api/calendly-mentors/goals`,
    }),
    saveCareerStage: builder.mutation({
      query: ({user_id, career_stage , updateState}) => ({
        url: '/mapout-node/api/career-stage',
        method: 'PATCH',
        body: {user_id, career_stage , updateState},
      }),
      invalidatesTags: ['user']
    }),
    saveProfile: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    saveEducationWorkDetails: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/profile/education-work',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    saveSkills: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/profile/skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    createPersonalityTest: builder.mutation({
      query: (userId) => ({
        url: '/mapout-node/api/careerTest',
        method: 'POST',
        body: {userId},
      }),
    }),
    getTestQuestions: builder.query({
      query: ({userId, testId}) => ({
        url: `/mapout-node/api/getquestion/${userId}/${testId}`,
      }),
    }),
    saveTestAnswer: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/save_answer',
        method: 'POST',
        body: data,
      }),
    }),
    getCareerTestResult: builder.query({
      query: ({userId, testId}) => ({
        url: `/mapout-node/api/careerTestResult/${userId}/${testId}`,
      }),
    }),
    getEducationWorkDetails: builder.query({
      query: ({search, type, page=1, user_id=""}) => ({
        url: `/mapout-node/api/education-work-details/?search=${search ? search : ""}&type=${type}&page=${page}&user_id=${user_id}`,
      }),
    }),
    getAllLanguages: builder.query({
      query: () => ({
        url: `/mapout-node/language/get-all`,
      }),
    }),
    getTechnicalSkills: builder.query({
      query: ({search, page=1}) => ({
        url: `/mapout-node/api/technical-skills?page=${page}&name=${search}`,
      }),
    }),
    googleSignIn: builder.mutation({
      query: (object) => ({
        url: '/mapout-authentication/social-login/auth/google',
        method: 'POST',
        body: {...object, requestFrom: "app"},
      }),
    }),
    skillAssessment: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/skills-assessment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user']
    }),
    requestToAddData: builder.mutation({
      query: (data) => ({
        url: `/mapout-node/api/education-work-details/save-new-data?type=${data.type}&newData=${data.newData}&user_id=${data.user_id}`,
        method: 'PUT',
      }),
    }),
    getMentorsList: builder.query<Object, void>({
      query: () => ({
        url: `mapout-node/api/calendly-mentors`,
      }),
    }),
    getCareerInsights: builder.query({
      query: ({career}) => ({
        url: `/mapout-chatgpt/api/career/insight?career=${career}`,
      }),
    }),
    getQuoteOfTheDay: builder.query({
      query: ({ userId}) => ({
        url: `/mapout-chatgpt/api/feed/quoteOfTheDay?userId=${userId}`,
      }),
    }),
    getLetterOfTheDay: builder.query({
      query: ({userId, bookmarkId=""}) => ({
        url: `/mapout-chatgpt/api/feed/letterOfTheDay?userId=${userId}&bookmarkedID=${bookmarkId}`,
      }),
    }),
    getDailyLearning: builder.query({
      query: ({userID, bookmarkId=""}) => ({
        url: `/mapout-chatgpt/api/feed/dailyLearning?userID=${userID}&bookmarkedID=${bookmarkId}`,
      }),
    }),
    getExploreData: builder.query({
      query: ({userId, bookmarkId=""}) => ({
        url: `/mapout-chatgpt/api/feed/explore?userId=${userId}&bookmarkedID=${bookmarkId}`,
      }),
    }),
    getNotifications: builder.query({
      query: ({userId, currentPage=1}) => ({
        url: `/mapout-node/api/notifications?userid=${userId}&currentPage=${currentPage}`,
      }),
      providesTags: ['notification'],
    }),
    markNotificationAsRead: builder.mutation({
      query: ({notificationId, userid}) => ({
        url: `mapout-node/api/notifications/read?id=${notificationId}&userid=${userid}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['notification'],
    }),
    getIdealCareers: builder.query({
      query: ({userId}) => {
          return ({
            url: `/mapout-chatgpt/api/generateIdealCareers?userId=${userId}`,
            headers: {
              'x-api-version' : '2'
            },
          })
      }
    }),
    uploadImage: builder.mutation({
      invalidatesTags: ['user'],
      query: (bodyFormData) => {
        return ({
          url: `mapout-node/api/setProfilePic`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: bodyFormData,
        });
      },
    }),
    uploadCV: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-upload/api/upload`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });
      }
    }),
    parseCV: builder.mutation({
      query: ({url, userID}) => ({
        url: '/mapout-parser/api/resumeParser',
        method: 'POST',
        body: { url, userID },
      }),
    }),
    getLanguages: builder.query({
      query: () => ({
        url: `/mapout-node/api/language/get-all`,
      }),
    }),
    getFaqs: builder.query({
      query: () => ({
        url: `/mapout-node/api/config/getFaqs`,
      }),
    }),
    getCitys : builder.query({
      query: ({citysearch="", page=0}) =>({
        url: `/mapout-node/api/getCity?search=${citysearch}&page=${page}`,
      })
    }),
    fetchGoogleJobs: builder.mutation({
      query: (data) => ({
        url: `/mapout-employability/get-jobs`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data
      }),
    }),
    viewedJobs: builder.mutation({
      query: (data) => ({
        url: `/mapout-employability/update-viewed-jobs`,
        method: 'POST',
        body: data
      }),
    }),
    deleteRecentJob : builder.mutation({
      query: ({user_id, id}) => ({
        url: `mapout-employability/delete_preference/${user_id}/${id}`,
        method: 'DELETE',
      }),
    }),
    fetchJobLink: builder.query({
      query: ({ jobId }) => ({
        url: `mapout-node/api/google-jobs-applylinks?job_id=${jobId}`
      })
    }),
    fetchRegisteredCTforUser: builder.query({
      query: ({ userId }) => ({
        url: `mapout-node/api/career-tasters?userId=${userId}`
      })
    }),
    registerForCT: builder.mutation({
      query: (data) => ({
        url: `/mapout-node/api/career-tasters`,
        method: 'POST',
        body: data
      })
    }),
    liked: builder.mutation({
      query: ({ user_id, content_id, type, career, word_id = "", operation, isLikedOrSaved, explore_type="", subject= ""}) => ({
        url: '/mapout-chatgpt/api/feed/likeOrSave',
        method: 'PUT',
        body: { user_id, content_id, type, career, word_id, operation, isLikedOrSaved, explore_type, subject },
      }),
    }),
    savedItems: builder.query({
      query: ({ userId }) => ({
        url: `mapout-chatgpt/api/feed/savedItems?user_id=${userId}`
      }),
    }),
    getWorkshops: builder.query({
      query: ({ userId }) => ({
        url: `mapout-node/api/calendly-mentors/workshop?userId=${userId}`
      }),
    }),
    registerForWorkshop: builder.mutation({
      query: ({ userId, workshopId, email}) => ({
        url: `mapout-node/api/calendly-mentors/workshop/register`,
        method: 'PUT',
        body: { userId, workshopId, email},
      }),
    }),
    feedbackQuestions: builder.query({
      query: ({ user_id, day, feedback_for }) => ({
        url: `/mapout-node/api/feedback/questions?user_id=${user_id}&day=${day}&feedback_for=${feedback_for}`
      })
    }),
    submitFeedback: builder.mutation({
      query: ({ user_id, feedback_questions_id, day, answers }) => ({
        url: `/mapout-node/api/feedback`,
        method: 'POST',
        body: { user_id, feedback_questions_id, day, answers }
      })
    }),
    submitFeedbackReminder: builder.mutation({
      query: ({ whenToRemind,feedback_questions_id,user_id }) => ({
        url: `mapout-node/api/feedback/handle-reminders`,
        method: 'POST',
        body: { whenToRemind,feedback_questions_id,user_id }
      })
    }),
    updateUserFeedSeen: builder.mutation({
      query: ({ userId}) => ({
        url: `mapout-chatgpt/api/feed/seen`,
        method: 'PUT',
        body: { userId},
      }),
    }),
    locationFilters: builder.query({
      query: () => ({
        url: `/mapout-jobscraper/location-filters`
      }),
    }),
    careerPreference : builder.query({
      query: ({userId, preference}) => ({
        url: `/mapout-chatgpt/api/careerPreference?userId=${userId}&preference=${preference}`
      }),
    }),
    jobResponsibilities : builder.query({
      query: ({jobTitle}) => ({
        url: `/mapout-node/api/profile-suggestions/responsibilities?job_title=${jobTitle}`
      }),
    }),
    rephraseResponsibilities : builder.query({
      query: ({text}) => ({
        url: `/mapout-node/api/profile-suggestions/rephrase?text=${text}`
      }),
    }),
    skillSuggestions : builder.query({
      query: ({jobTitle , degree , skills}) => ({
        url: `/mapout-node/api/profile-suggestions/skills?job_titles=${jobTitle ? jobTitle : ''}&degrees=${degree ? degree : ''}&skills=${skills ? skills : ''}`
      }),
    }),
    careerRating: builder.query({
      query: ({userId, rating}) => ({
        url: `/mapout-chatgpt/api/careerRating?userId=${userId}&rating=${rating}`
      }),
    }),
    reportBug: builder.mutation({
      query: (data) => ({
        url: `/mapout-node/api/bug-report`,
        method: 'POST',
        body: data,
      }),
    }),
    saveCoachingGoal: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/coaching-goals`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updatePreference: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/last-status-update`,
        method: 'PATCH',
        body: data,
      })
    }),
    signUp: builder.mutation({
      query: (bodyFormData) => {
        return ({
          url: `mapout-node/api/profile/onboarding`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: bodyFormData,
        });
      },
      invalidatesTags: ['user'],
    }),
    uploadVideo: builder.mutation({
      invalidatesTags: ['user'],
      query: (bodyFormData) => {
        return ({
          url: `mapout-upload/api/setProfileVideo`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: bodyFormData,
        });
      },
    }),
    appleSignIn: builder.mutation({
      query: (object) => ({
        url: '/mapout-authentication/social-login/auth/apple',
        method: 'POST',
        body: {...object, requestFrom: "app"},
      }),
    }),
    getCareerAdvisor: builder.query({
      query: () => ({ url: `/mapout-node/api/career-advisors` })
    }),
    getBrandCoach: builder.query({
      query: () => ({ url: `/mapout-node/api/personal-brand-coach` })
    }),
    getDailyTask: builder.query({
      query: ({userId}) => ({
        url: `/mapout-node/api/task/fetch?userID=${userId}`
      }),
    }),
    saveProfileSkill: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/profile/skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    saveProfileWorkExperience: builder.mutation({
      query: (data) => ({
        url: '/mapout-node/api/profile/education-work',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    cvAutoFill: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-parser-v2/parse-cv-data`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });
      },
      invalidatesTags: ['user']
    }),
    videoAnalysis: builder.mutation({
      query: (data) => {
        return ({
          url: `/mapout-analysis/calculate_scores`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });
      },
    }),
    submitTask: builder.mutation({
      invalidatesTags: ['user'],
      query: (data) => {
        return ({
          url: `/mapout-node/api/task/submit`,
          method: 'PUT',
          body: data,
        });
      },
    }),
    submitVideoFeedback: builder.mutation({
      query: (data) => {
        return ({
          url: `/mapout-node/api/video_analysis/feedback`,
          method: 'PUT',
          body: data,
        });
      },
    }),
    saveJob: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-employability/save-job`,
          method: 'POST',
          body: data,
        });
      },
    }),
    unSaveJob: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-employability/unsave-job`,
          method: 'POST',
          body: data,
        });
      },
    }),
    fetchSavedJobs: builder.query({
      query: ({user_id, page=0}) => `mapout-employability/fetch-saved-jobs?user_id=${user_id}&page=${page}`,
    }),
    getRecommendedJobs: builder.query({
      query: ({user_id, page_number=1, role="", location=""}) => ({
        url: `mapout-employability/best-matches?user_id=${user_id}&keyword=${role}&qlocation=${location}&page=${page_number}`
      }),
    }),
    getOtherJobs: builder.query({
      query: ({user_id, page_number=0}) => ({
        url: `/mapout-employability/recommend?user_id=${user_id}&page_number=${page_number}`
      }),
    }),
    downloadProfile: builder.query({
      query: ({userId}) => ({
        url: `pdf-service/api/profile/download/${userId}`
      }),
    }),
    deleteAccountOTP: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-authentication/mapout/auth/acc_manage/otp/send`,
          method: 'POST',
          body: data,
        });
      },
    }),
    deleteAccount: builder.mutation({
      query: ({user_id, phone, otp}) => {
        return ({
          url: `mapout-authentication/mapout/auth/acc_manage/delete/${user_id}`,
          method: 'DELETE',
          body: {phoneNumber: phone, otp: otp},
        });
      },
    }),
    deactivateAccountOTP: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-authentication/mapout/auth/acc_manage/otp/send`,
          method: 'POST',
          body: data,
        });
      },
    }),
    deactivateAccount: builder.mutation({
      query: ({user_id, phone, otp}) => {
        return ({
          url: `mapout-authentication/mapout/auth/acc_manage/deactivate/${user_id}`,
          method: 'PUT',
          body: {phoneNumber: phone, otp: otp},
        });
      },
    }),
    getCountryCode: builder.query({
      query: () => ({
        url: `mapout-node/api/countryCodes/get-all`
      }),
    }),
    submitContactUsForm: builder.mutation({
      query: (bodyFormData) => {
        return ({
          url: `mapout-node/api/contact-us`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: bodyFormData,
        });
      },
    }),
    refreshScore: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-employability/schedule-score-refresh`,
          method: 'POST',
          body: data,
        });
      },
    }),
    startStreak: builder.query({
      query: ({user_id}) => ({
        url: `mapout-node/api/task/startStreak/?userID=${user_id}`
      })
    }),
    getChat : builder.query({
      query: ({ userId }) =>({
        url: `/mapout-node/api/chat/get?userId=${userId}`,
      })
    }),
    getAccessToken: builder.query({
      query: ({ userId }) => ({
        url: `/mapout-node/api/chat/generateAccessToken?userId=${userId}`
      })
    }),
    createChat: builder.query({
      query: ({ userId, advisorId }) => ({
        url: `/mapout-node/api/chat/create?userId=${userId}&advisorId=${advisorId}`
      })
    }),
    generateOrder: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-payments/api/orderid`,
          method: 'POST',
          body: data,
        });
      },
    }),
    orderSuccess: builder.mutation({
      invalidatesTags: ['user'],
      query: (data) => {
        return({
          url: `mapout-payments/api/success`,
          method: 'POST',
          body: data
        })
      }
    }),
    fetchTalentBoards: builder.query({
      providesTags: ['talentBoard'],
      query: ({ userId, isDrafted = false, talentBoardID, projectID }) => {
        let url = `/mapout-node/api/profile/talent-board/fetch-all?userId=${userId}&isDrafted=${isDrafted}`;
        if (talentBoardID) {
          url += `&talentBoardID=${talentBoardID}`;
        }
        if (projectID) {
          url += `&projectID=${projectID}`;
        }
        return { url };
      }
    }),
    manageTalentBoard: builder.mutation({
      invalidatesTags: ['talentBoard'],
      query: (data) => {
        return ({
          url: `mapout-node/api/profile/talent-board/create-or-edit`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });
      }
    }),
    deleteTalentBoardProject: builder.mutation({
      invalidatesTags: ['talentBoard'],
      query: (data) => {
        return ({
          url: `/mapout-node/api/profile/talent-board/delete`,
          method: 'PUT',
          body: data,
        });
      },
    }),
    fetchAllTags: builder.query({
      query: () => ({
        url: `/mapout-node/api/tags/getAll`
      })
    }),
     markedNotifcationsAsRead: builder.query({
      query: ({userid}) => ({
        url: `mapout-node/api/notifications/read-all?userid=${userid}`
      })
    }),
    getPosts: builder.query({
      query: ({page =1,userId, category=""}) => ({
        url: `/mapout-node/api/posts?category=${category}&page=${page}&userId=${userId}`,
      }),
    }),
    getUsersPosts: builder.query({
      query: ({page =1,userId, targetId}) => ({
        url: `/mapout-node/api/posts?page=${page}&userId=${userId}&targetId=${targetId}`,
      }),
    }),
    likeAPost: builder.mutation({
      query: (data) => {
        return ({
          url: `/mapout-node/api/like`,
          method: 'POST',
          body: data,
        });
      },
    }),
    addPostComment: builder.mutation({
      query: (data) => {
        return ({
          url: `/mapout-node/api/comments`,
          method: 'POST',
          body: data,
        });
      },
    }),
    addPostCommentReply: builder.mutation({
      query: (data) => {
        return ({
          url: `/mapout-node/api/comments`,
          method: 'PATCH',
          body: data,
        });
      },
    }),
    fetchRewards: builder.query({
      query: (user_id) => ({
        url: `/mapout-node/api/reward/fetch?userID=${user_id}`,
      }),
    }),
    participateInReward : builder.mutation({
      query: ({user_id, reward_id}) => ({
        url: `/mapout-node/api/reward/participate?userID=${user_id}&rewardID=${reward_id}`,
        method: 'PUT',
      }),
    }),
    stripePaymentIntent: builder.mutation({
      query: (data) => ({
        url: `/mapout-payments/stripe/create-payment-intent`,
        method: 'POST',
        body: data,
      }),
    }),
    updateTaskToInProgress: builder.mutation({
      query: ({userID, taskID}) => ({
        url: `/mapout-node/api/task/updateStatus?userID=${userID}&taskID=${taskID}`,
        method: 'PUT',
      }),
      invalidatesTags: ['user']
    }),
    markAllNotificationsAsRead: builder.mutation({
    query: ({ userid }) => ({
      url: `/mapout-node/api/notifications/read-all?userid=${userid}`,
      method: 'PATCH',
      invalidatesTags: ['notification'],
    }),
}),

    confirmStripePayment: builder.mutation({
      query: (data) => ({
        url: `/mapout-payments/stripe/get-payment-status`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['user']
    }),
    getUserProfileData: builder.query({
      query: ({profileUserId}) => ({
        url: `mapout-node/api/otherUser/profile/details?profileUserID=${profileUserId}`,
      }),
    }),
    getSharedUserProfileData: builder.query({
      query: ({shareID}) => ({
        url: `mapout-node/api/otherUser/profile/details?shareID=${shareID}`,
      }),
    }),
    followUser: builder.mutation({
      query: (data) => ({
        url: `/mapout-node/api/user/follow`,
        method: 'PUT',
        body: data
      })
    }),
    unfollowUser: builder.mutation({
      query: (data) => ({
        url: `/mapout-node/api/user/unfollow`,
        method: 'PUT',
        body: data
      })
    }),
    getPostComments: builder.query({
      query: ({postId,userId, page}) => ({
        url: `mapout-node/api/comments/${postId}/${userId}?page=${page}`,
      }),
    }),
    getPostCommentsReplies: builder.query({
      query: ({postId, userId, commentId, page}) => ({
        url: `mapout-node/api/comments/${postId}/${userId}/${commentId}/replies?page=${page}`,
      }),
    }),
    getPostUserComments: builder.query({
      query: ({postId,userId}) => ({
        url: `mapout-node/api/comments/user/${postId}/${userId}`,
      }),
    }),
    getPostUserCommentsReplies: builder.query({
      query: ({postId, userId, commentId}) => ({
        url: `mapout-node/api/comments/user/${postId}/${userId}/${commentId}/replies`,
      }),
    }),
    addFeedPost: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-node/api/posts`,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });
      }
    }),
    likeAComment: builder.mutation({
      query: (data) => {
        return ({
          url: `mapout-node/api/comments/like`,
          method: 'PATCH',
          body: data,
        });
      }
    }),
    savePost: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/posts/saved`,
        method: 'PATCH',
        body: data
      })
    }),
    removeSavedPost: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/posts/saved`,
        method: 'DELETE',
        body: data
      })
    }),
    getSavedPosts: builder.query({
      query: ({userId, page}) => ({
        url: `mapout-node/api/posts/saved?userId=${userId}&page=${page}`,
      }),
    }),
    getFollowings: builder.query({
      query: ({userId,searchKey="",page}) => ({
        url: `mapout-node/api/user/followings?userId=${userId}&search=${searchKey}&limit=20&page=${page}`,
      }),
    }),
    getFollowers: builder.query({
      query: ({userId,searchKey="",page}) => ({
        url: `mapout-node/api/user/followers?userId=${userId}&search=${searchKey}&limit=20&page=${page}`,
      }),
    }),
    getPreviousLearnings: builder.query({
      query: ({userId}) => ({
        url: `mapout-node/api/task/completed-tasks?userID=${userId}`,
      }),
    }),
    getPostById: builder.query({
      query: ({postId}) => ({
        url: `mapout-node/api/post?postId=${postId}`,
      }),
    }),
    postNotInterested: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/posts/notinterested`,
        method: 'PATCH',
        body: data
      })
    }),
    getCareerTasters: builder.query({
      query: ({page=1}) => ({
        url: `/mapout-node/api/career-tasters/fetch-all?limit=10&page=${page}`
      }),
    }),
    getOnGoingCareerTasters: builder.query({
      query: ({page=1}) => ({
        url: `/mapout-node/api/career-tasters/fetch-all?onGoing=true&limit=10&page=${page}`
      }),
    }),
    getCompletedCareerTasters: builder.query({
      query: ({page=1}) => ({
        url: `/mapout-node/api/career-tasters/fetch-all?isCompleted=true&limit=10&page=${page}`
      }),
    }),
    getSavedCareerTasters: builder.query({
      query: ({page=1}) => ({
        url: `/mapout-node/api/career-tasters/fetch-all?isSaved=true&limit=10&page=${page}`
      }),
    }),
    getCareerTasterById: builder.query({
      query: ({careerTasterId}) => ({
        url: `mapout-node/api/career-tasters/fetch?careerTaster_id=${careerTasterId}`
      }),
    }),
    postTaskFeedback: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/taskFeedback`,
        method: 'POST',
        body: data
      })
    }),
    registerCareerTaster: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/career-tasters/register`,
        method: 'POST',
        body: data
      })
    }),
    toggleSaveCareerTaster: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/career-tasters/save`,
        method: 'POST',
        body: data
      })
    }),
    submitCareerTasterTask: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/career-tasters/submit-task`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data
      })
    }),
    submitCareerTasterFeedback: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/career-tasters/feedback`,
        method: 'POST',
        body: data
      })
    }),
    updateCertificates: builder.mutation({
      query: (data) => ({
        url: `mapout-node/api/profile/certificate`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['user']
    }),
    sendOtpForMobileVerification: builder.mutation({
      query: ({email="", phoneNumber, country_code}) => ({
        url: '/mapout-authentication/mapout/auth/verify/otp/start',
        method: 'POST',
        body: {email, requestFrom: "app", phoneNumber, country_code: country_code},
      }),
    }),
    verifyOtpForMobileVerification: builder.mutation({
      query: (data) => ({
        url: '/mapout-authentication/mapout/auth/verify/otp/complete',
        method: 'POST',
        body: {...data, requestFrom: "app"},
      }),
      invalidatesTags: ['user']
    }),
  }),
});