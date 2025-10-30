import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    problemResponses: [],
    error: null
}

export const problemResponseSlice  = createSlice({
    name: 'problemResponse',
    initialState,
    reducers: {
        getProblemResponseStart: state => {
            state.isLoading = true
        },
        getProblemResponseSuccess: (state, actions) => {
            state.isLoading = false
            state.problemResponses = actions.payload
        },
        getProblemResponseFailure: (state, action) => {
            state.error = action.payload
        },

        postSolutionStart: state => {
            state.isLoading = true
        },
        postSolutionSuccess: (state) => {
            state.isLoading = false
        },
        postSolutionFailure: (state) => {
            state.isLoading = false
            state.error = 'Error'   
        },
  
        

    }
})

export const {
    getProblemResponseStart,
    getProblemResponseSuccess,
    getProblemResponseFailure
}
     = problemResponseSlice.actions
export default problemResponseSlice.reducer