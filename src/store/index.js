import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from '../features/auth/Auth'
import CommentReducer from '../features/comments/Comment'
import ProblemReducer from '../features/problems/Problems'
import problemResponse from '../features/problemResponse/problemResponse'
import UserReducer from '../features/users'
import FeedbackReducer from '../features/feedback'
import ProblemNotification from '../features/notificationSlice'

export default configureStore({
  reducer: {
    auth: AuthReducer,
    comment: CommentReducer,
    problem: ProblemReducer,
    problemResponse: problemResponse,
    user: UserReducer,
    feedback: FeedbackReducer,
    notification: ProblemNotification

  },
  devTools: process.env.NODE_ENV !== 'production',
})