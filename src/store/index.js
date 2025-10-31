// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
// Fayl yo'llarini tuzatish: `./features/...` o'rniga `../features/...`
import AuthReducer from '../features/auth/Auth'
import CommentReducer from '../features/comments/Comment'
import ProblemReducer from '../features/problems/Problems'
import problemResponseReducer from '../features/problemResponse/problemResponse'
import UserReducer from '../features/users' // Agar bu katalog bo'lsa, indeks fayl borligini tekshiring
import FeedbackReducer from '../features/feedback'
import notificationReducer from '../features/notificationSlice'
import notificationMiddleware from '../middleware/notificationMiddleware'

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    comment: CommentReducer,
    problem: ProblemReducer,
    problemResponse: problemResponseReducer,
    user: UserReducer,
    feedback: FeedbackReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});