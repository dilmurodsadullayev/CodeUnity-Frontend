// ./features/auth/Auth.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true, // Ilova birinchi marta yuklanganda autentifikatsiya tekshirilayotganini bildirish uchun
    isLoggedIn: false,
    error: null,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signUserStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        signUserSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        },
        signUserFailer: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.error = action.payload;
            state.user = null;
        },
        logoutUser: state => {
            state.user = null;
            state.isLoggedIn = false;
            state.isLoading = false; // Logout bo'lganda ham yuklanish holati tugaydi
            state.error = null;
            // Cookie'ni server tomoni o'chiradi yoki AuthService o'chirishi kerak
        }
    }
});

export const { signUserStart, signUserFailer, signUserSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;