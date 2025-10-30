import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading: false,
    isLoggedIn: false,
    error: null,
    user: null
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signUserStart: state => {
            state.isLoading = true
        },
        signUserSuccess: (state, action) => {
            state.loggedIn = true
            state.isLoading = false
            state.user = action.payload
            
            
        },
        signUserFailer: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        logoutUser: state => {
            state.user = null
            state.loggedIn = false
        }

    }

})


export const {signUserStart, signUserFailer, signUserSuccess, logoutUser} = authSlice.actions
export default authSlice.reducer;