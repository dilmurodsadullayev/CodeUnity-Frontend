import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    users: [], // Doim massiv bo'lishi kerak
    languages: [],
    userDetail: null,
    count: 0, // Doim raqam bo'lishi kerak
    next: null,
    previous: null,
    error: null // Xato holatini saqlash uchun
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
        }

   
    }
});

export const {
    getUserStart,
    getUserFailure,
    getUserSuccess

} = UserSlice.actions;

export default UserSlice.reducer;