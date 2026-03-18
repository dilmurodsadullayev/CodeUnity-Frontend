// features/user/UserCoinsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coins: 0,
};

export const UserCoinsSlice = createSlice({
    name: "userCoins",
    initialState,
    reducers: {
        setCoins: (state, action) => {
            state.coins = action.payload;
        },
        incrementCoins: (state, action) => {
            state.coins += action.payload; // + coins qo'shish
        },
        decrementCoins: (state, action) => {
            state.coins -= action.payload; // - coins
        }
    },
});

export const { setCoins, incrementCoins, decrementCoins } = UserCoinsSlice.actions;
export default UserCoinsSlice.reducer;