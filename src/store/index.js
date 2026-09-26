// src/store/index.js

import {
    configureStore,
} from "@reduxjs/toolkit";


// =========================================================
// REDUCERS
// =========================================================

import AuthReducer from "../features/auth/Auth";

import CommentReducer from "../features/comments/Comment";

import ProblemReducer from "../features/problems/Problems";

import problemResponseReducer from "../features/problemResponse/problemResponse";

import UserReducer from "../features/users";

import FeedbackReducer from "../features/feedback";

import notificationReducer from "../features/notificationSlice";

import CoinReducer from "../features/coins";

import ProfileReducer from "../features/profile";

import ProjectReducer from "../features/projects";

import PostReducer from "../features/posts";

import RoadmapReducer from "../features/roadmap";

import BadgeReducer from "../features/badge";

import BotReducer from "../features/bot";
import promotionReducer from "../features/promotions";


// =========================================================
// SITE UPDATES / CHANGELOG
// =========================================================

import updatesReducer from "../features/updates/Updates";


// =========================================================
// MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";


// =========================================================
// STORE
// =========================================================

export const store = configureStore({

    reducer: {

        // =================================================
        // AUTH
        // =================================================

        auth:
            AuthReducer,


        // =================================================
        // COMMENTS
        // =================================================

        comment:
            CommentReducer,


        // =================================================
        // PROBLEMS
        // =================================================

        problem:
            ProblemReducer,


        problemResponse:
            problemResponseReducer,


        // =================================================
        // USERS
        // =================================================

        user:
            UserReducer,


        // =================================================
        // FEEDBACK
        // =================================================

        feedback:
            FeedbackReducer,


        // =================================================
        // NOTIFICATIONS
        // =================================================

        notifications:
            notificationReducer,


        // =================================================
        // COINS
        // =================================================

        coin:
            CoinReducer,


        // =================================================
        // PROFILE
        // =================================================

        profile:
            ProfileReducer,


        // =================================================
        // PROJECTS
        // =================================================

        project:
            ProjectReducer,


        // =================================================
        // POSTS
        // =================================================

        post:
            PostReducer,


        // =================================================
        // ROADMAP
        // =================================================

        roadmap:
            RoadmapReducer,


        // =================================================
        // BADGES
        // =================================================

        badge:
            BadgeReducer,


        // =================================================
        // TELEGRAM BOT
        // =================================================

        bot:
            BotReducer,


        // =================================================
        // SITE UPDATES / CHANGELOG
        // =================================================

        updates:
            updatesReducer,

        // PROMOTIONS
        promotion:
            promotionReducer,
    },


    // =====================================================
    // MIDDLEWARE
    // =====================================================

    middleware: (
        getDefaultMiddleware
    ) =>
        getDefaultMiddleware()
            .concat(
                notificationMiddleware
            ),


    // =====================================================
    // REDUX DEVTOOLS
    // =====================================================

    devTools:
        process.env.NODE_ENV !==
        "production",
});