import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    users: [], // Doim massiv bo'lishi kerak
    languages: [],
    userDetail: null,
    count: 0, // Doim raqam bo'lishi kerak
    next: null,
    previous: null,
    error: null, // Xato holatini saqlash uchun
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
    name: 'user',
    initialState,
    reducers: {
     

        getUserStart: state => {
            state.isLoading = true;
            state.error = null; // Yangi so'rov boshlanganda xatoni tozalash
        },
        getUserSuccess: (state, actions) => {
            state.isLoading = false;
            state.users = actions.payload.results|| []; // actions.payload.results Agar results bo'lmasa, bo'sh massivga o'rnatamiz
            state.count = actions.payload.count || 0;     // Agar count bo'lmasa, 0 ga o'rnatamiz
            state.next = actions.payload.next;
            state.previous = actions.payload.previous;
            state.error = null; // Muvaffaqiyatli bo'lsa xatoni tozalash
        },
        getUserFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.users = []; // Xato bo'lganda ham problems ni bo'sh massivga o'rnatish
            state.count = 0;     // count ni ham 0 ga o'rnatish
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

            state.birthdayUsers = action.payload?.results || [];
            state.birthdayUsersCount = action.payload?.count || 0;
            state.birthdayUsersToday = action.payload?.today || null;
            state.birthdayUsersMonth = action.payload?.month || null;
            state.birthdayUsersLimit = action.payload?.limit || 0;

            state.birthdayUsersError = null;
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

   
    }
});

export const {
    getUserStart,
    getUserFailure,
    getUserSuccess,

    getBirthdayUsersStart,
    getBirthdayUsersSuccess,
    getBirthdayUsersFailure,

} = UserSlice.actions;

export default UserSlice.reducer;