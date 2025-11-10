import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roadmap_isLoading: false,
    roadmaps: [],
    roadmap_error: null
}

export const RoadmapSlice  = createSlice({
    name: 'roadmap',
    initialState,
    reducers: {
        getRoadMapStart: state => {
            state.roadmap_isLoading = true
        },
        getRoadMapSuccess: (state, actions) => {
            state.roadmap_isLoading = false
            state.roadmaps = actions.payload
        },
        getRoadMapFailure: (state, action) => {
            state.roadmap_error = action.payload
        },
        // postCommentStart: state => {
        //     state.isLoading = true
        // },
        // postCommentSuccess: (state) => {
        //     state.isLoading = false
        // },
        // postCommentFailure: (state) => {
        //     state.isLoading = false
        //     state.error = 'Error'   
        // },
    }
})

export const {
    
    getRoadMapStart,
    getRoadMapSuccess,
    getRoadMapFailure
    
    } = RoadmapSlice.actions
export default RoadmapSlice.reducer