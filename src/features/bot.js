import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    telegramProfile: null,
    error: null,
};

export const BotSlice = createSlice({
    name: "bot",
    initialState,
    reducers: {
        getTelegramProfileStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        getTelegramProfileSuccess: (state, action) => {
            state.isLoading = false;
            state.telegramProfile = action.payload?.data || action.payload;
            state.error = null;
        },

        getTelegramProfileFailure: (state, action) => {
            state.isLoading = false;
            state.telegramProfile = null;
            state.error =
                action.payload || "Telegram profilni olishda xatolik yuz berdi.";
        },

        clearBotError: (state) => {
            state.error = null;
        },
    },
});

export const {
    getTelegramProfileStart,
    getTelegramProfileSuccess,
    getTelegramProfileFailure,
    clearBotError,
} = BotSlice.actions;

export default BotSlice.reducer;