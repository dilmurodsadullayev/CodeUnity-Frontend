import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,

    users: [],
    count: 0,
    next: null,
    previous: null,

    languages: [],
    userDetail: null,

    error: null,

    // Birthday users
    birthdayUsersLoading: false,
    birthdayUsers: [],
    birthdayUsersCount: 0,
    birthdayUsersToday: null,
    birthdayUsersMonth: null,
    birthdayUsersLimit: 0,
    birthdayUsersError: null,
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // =========================
        // USERS LIST / PAGINATION
        // =========================
        getUserStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        getUserSuccess: (state, action) => {
            state.isLoading = false;
            state.error = null;

            const payload = action.payload;

            // Backend pagination response:
            // { count, next, previous, results }
            if (payload && Array.isArray(payload.results)) {
                state.users = payload.results;
                state.count = Number(payload.count || 0);
                state.next = payload.next || null;
                state.previous = payload.previous || null;
                return;
            }

            // Agar backend oddiy array qaytarsa ham buzilmasin
            if (Array.isArray(payload)) {
                state.users = payload;
                state.count = payload.length;
                state.next = null;
                state.previous = null;
                return;
            }

            state.users = [];
            state.count = 0;
            state.next = null;
            state.previous = null;
        },

        getUserFailure: (state, action) => {
            state.isLoading = false;
            state.error =
                action.payload || "Foydalanuvchilarni olishda xatolik yuz berdi.";

            state.users = [];
            state.count = 0;
            state.next = null;
            state.previous = null;
        },

        // =========================
        // BIRTHDAY USERS THIS MONTH
        // =========================
        getBirthdayUsersStart: (state) => {
            state.birthdayUsersLoading = true;
            state.birthdayUsersError = null;
        },

        getBirthdayUsersSuccess: (state, action) => {
            state.birthdayUsersLoading = false;
            state.birthdayUsersError = null;

            const payload = action.payload || {};

            state.birthdayUsers = Array.isArray(payload.results)
                ? payload.results
                : [];

            state.birthdayUsersCount = Number(payload.count || 0);
            state.birthdayUsersToday = payload.today || null;
            state.birthdayUsersMonth = payload.month || null;
            state.birthdayUsersLimit = Number(payload.limit || 0);
        },

        getBirthdayUsersFailure: (state, action) => {
            state.birthdayUsersLoading = false;

            state.birthdayUsers = [];
            state.birthdayUsersCount = 0;
            state.birthdayUsersToday = null;
            state.birthdayUsersMonth = null;
            state.birthdayUsersLimit = 0;

            state.birthdayUsersError =
                action.payload || "Tug‘ilgan kunlarni olishda xatolik yuz berdi.";
        },

        clearUserErrors: (state) => {
            state.error = null;
            state.birthdayUsersError = null;
        },
    },
});

export const {
    getUserStart,
    getUserFailure,
    getUserSuccess,

    getBirthdayUsersStart,
    getBirthdayUsersSuccess,
    getBirthdayUsersFailure,

    clearUserErrors,
} = UserSlice.actions;

export default UserSlice.reducer;