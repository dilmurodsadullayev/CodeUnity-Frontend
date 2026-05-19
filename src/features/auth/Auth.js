// src/features/auth/Auth.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    isLoggedIn: false,
    error: null,
    user: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signUserStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        signUserSuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload?.user || action.payload || null;
            state.error = null;
        },

        signUserFailure: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.user = null;
            state.error = action.payload || "Autentifikatsiya xatosi.";
        },

        // Eski typo nom. Eski kodlar buzilmasligi uchun qoldirildi.
        signUserFailer: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.user = null;
            state.error = action.payload || "Autentifikatsiya xatosi.";
        },

        checkAuthStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        checkAuthSuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload || null;
            state.error = null;
        },

        checkAuthFailure: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.user = null;
            state.error = null;
        },

        logoutUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.error = null;
        },

        clearAuthError: (state) => {
            state.error = null;
        },
    },
});

export const {
    signUserStart,
    signUserSuccess,
    signUserFailure,
    signUserFailer,

    checkAuthStart,
    checkAuthSuccess,
    checkAuthFailure,

    logoutUser,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;