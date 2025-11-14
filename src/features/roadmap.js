import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // READ (List) holati
    roadmap_isLoading: false,
    roadmaps: [],
    roadmap_error: null,
    
    // CREATE (Post) holati
    isCreating: false,
    createError: null,

    // UPDATE (Put/Patch) holati
    isUpdating: false,
    updateError: null,

    // DELETE holati
    isDeleting: false,
    deleteError: null,
     // LIKE/UNLIKE holati
    isLiking: false,
    likeError: null,
}

export const RoadmapSlice  = createSlice({
    name: 'roadmap',
    initialState,
    reducers: {
        // ------------------------------------
        // GET (LIST) Reducer'lar
        // ------------------------------------
        getRoadMapStart: state => {
            state.roadmap_isLoading = true
            state.roadmap_error = null // Yangi so'rov boshlanganda xatoni tozalash
        },
        getRoadMapSuccess: (state, actions) => {
            state.roadmap_isLoading = false
            state.roadmaps = actions.payload
            state.roadmap_error = null
        },
        getRoadMapFailure: (state, action) => {
            state.roadmap_isLoading = false
            state.roadmap_error = action.payload
        },
        
        // ------------------------------------
        // POST (CREATE) Reducer'lar
        // ------------------------------------
        createRoadMapStart: state => {
            state.isCreating = true
            state.createError = null
        },
        createRoadMapSuccess: (state, action) => {
            state.isCreating = false
            // Yangi yaratilgan roadmap'ni ro'yxatning boshiga qo'shish (ixtiyoriy, API tartibiga bog'liq)
            state.roadmaps.unshift(action.payload);
            state.createError = null
        },
        createRoadMapFailure: (state, action) => {
            state.isCreating = false
            state.createError = action.payload
        },

        // ------------------------------------
        // PUT/PATCH (UPDATE) Reducer'lar
        // ------------------------------------
        updateRoadMapStart: state => {
            state.isUpdating = true
            state.updateError = null
        },
        updateRoadMapSuccess: (state, action) => {
            state.isUpdating = false
            state.updateError = null
            // Yangilangan ob'ektni ro'yxatda topib, yangilash
            const index = state.roadmaps.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.roadmaps[index] = action.payload;
            }
        },
        updateRoadMapFailure: (state, action) => {
            state.isUpdating = false
            state.updateError = action.payload
        },

        // ------------------------------------
        // DELETE Reducer'lar
        // ------------------------------------
        deleteRoadMapStart: state => {
            state.isDeleting = true
            state.deleteError = null
        },
        deleteRoadMapSuccess: (state, action) => {
            state.isDeleting = false
            state.deleteError = null
            // O'chirilgan ob'ektni ro'yxatdan olib tashlash (payload o'chirilgan ID bo'lishi kerak)
            state.roadmaps = state.roadmaps.filter(r => r.id !== action.payload);
        },
        deleteRoadMapFailure: (state, action) => {
            state.isDeleting = false
            state.deleteError = action.payload
        },

        toggleLikeRoadmapStart: state => {
            state.isLiking = true
            state.likeError = null
        },
        // Success: API'dan qaytgan yangilangan Roadmap ob'ektini qabul qiladi
        toggleLikeRoadmapSuccess: (state, action) => {
            state.isLiking = false
            state.likeError = null
            // Yangilangan ob'ektni ro'yxatda topib, yangilash (likeCount va liked holatlari yangilanadi)
            const index = state.roadmaps.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.roadmaps[index] = action.payload;
            }
        },
        toggleLikeRoadmapFailure: (state, action) => {
            state.isLiking = false
            state.likeError = action.payload
        },
    }
})

export const {
    // GET
    getRoadMapStart,
    getRoadMapSuccess,
    getRoadMapFailure,
    // POST
    createRoadMapStart,
    createRoadMapSuccess,
    createRoadMapFailure,
    // PUT/PATCH
    updateRoadMapStart,
    updateRoadMapSuccess,
    updateRoadMapFailure,
    // DELETE
    deleteRoadMapStart,
    deleteRoadMapSuccess,
    deleteRoadMapFailure,
    
    // Like Unilike
    toggleLikeRoadmapStart,
    toggleLikeRoadmapSuccess,
    toggleLikeRoadmapFailure

    } = RoadmapSlice.actions
    
export default RoadmapSlice.reducer