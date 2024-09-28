import {createSlice} from '@reduxjs/toolkit';
import {api} from './api';

interface Question {
  questionId: string;
  question: string;
  options: string[];
}

interface Answer {
  questionId: string;
  answer: string;
}

interface CareerTest {
  testId: string;
  questions: Question[];
  answers: Answer[];
  result: {};
}

const initialState: CareerTest | {} = {};

export const careerTestSlice = createSlice({
  name: 'careerTest',
  initialState: initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase("auth/logout", () => initialState);
    builder.addMatcher(
      api.endpoints.createPersonalityTest.matchFulfilled,
      (state, action) => ({
        ...state,
        testId: action.payload.testId,
      })
    );
    builder.addMatcher(
      api.endpoints.getTestQuestions.matchFulfilled,
      (state, action) => ({
        ...state,
        questions: action.payload?.questions,
      })
    );
    builder.addMatcher(
      api.endpoints.getCareerTestResult.matchFulfilled,
      (state, action) => ({
        ...state,
        result: {
          resultGenarated: true,
          mbti: action.payload?.mbtiData,
          riasec: action.payload?.riasecData,
        },
      })
    );
  },
});

export const careerTestActions = careerTestSlice.actions;

export default careerTestSlice.reducer;
