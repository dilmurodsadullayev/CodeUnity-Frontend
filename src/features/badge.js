import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    userBadges: [],
    totalBadges: 0,
    error: null
};

export const BadgeSlice = createSlice({
    name: 'badge',
    initialState,
    reducers: {
        getBadgesStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        getBadgesSuccess: (state, action) => {
            state.isLoading = false;
            state.userBadges = action.payload.badges || [];
            state.totalBadges = action.payload.total_badges || 0;
        },
        getBadgesFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.userBadges = [];
        }
    }
});

export const { getBadgesStart, getBadgesSuccess, getBadgesFailure } = BadgeSlice.actions;
export default BadgeSlice.reducer;