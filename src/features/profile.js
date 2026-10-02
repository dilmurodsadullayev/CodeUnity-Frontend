// src/features/profile.js

import {
    createSlice,
} from "@reduxjs/toolkit";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    isLoading: false,

    profile: null,

    error: null,
};

// =========================================================
// PROFILE SLICE
// =========================================================

export const profileSlice =
    createSlice({
        name: "profile",

        initialState,

        reducers: {
            // =================================================
            // GET PROFILE
            // =================================================

            getProfileStart: (
                state
            ) => {
                state.isLoading =
                    true;

                state.error =
                    null;
            },

            getProfileSuccess: (
                state,
                action
            ) => {
                state.isLoading =
                    false;

                state.profile =
                    action.payload;

                state.error =
                    null;
            },

            getProfileFailure: (
                state,
                action
            ) => {
                state.isLoading =
                    false;

                state.error =
                    action.payload
                    ||
                    "Profilni yuklashda xatolik yuz berdi.";
            },

            // =================================================
            // CLEAR ERROR
            // =================================================

            clearProfileError: (
                state
            ) => {
                state.error =
                    null;
            },

            // =================================================
            // RESET PROFILE
            //
            // Logout yoki user almashganda foydali.
            // =================================================

            resetProfile: (
                state
            ) => {
                state.isLoading =
                    false;

                state.profile =
                    null;

                state.error =
                    null;
            },
        },
    });

// =========================================================
// ACTIONS
// =========================================================

export const {
    getProfileStart,
    getProfileSuccess,
    getProfileFailure,

    clearProfileError,
    resetProfile,
} = profileSlice.actions;

// =========================================================
// SELECTORS
// =========================================================

export const selectProfileState = (
    state
) => {
    return (
        state?.profile
        ||
        initialState
    );
};

export const selectProfile = (
    state
) => {
    return selectProfileState(
        state
    ).profile;
};

export const selectProfileLoading = (
    state
) => {
    return selectProfileState(
        state
    ).isLoading;
};

export const selectProfileError = (
    state
) => {
    return selectProfileState(
        state
    ).error;
};

// =========================================================
// REDUCER
// =========================================================

export default profileSlice.reducer;