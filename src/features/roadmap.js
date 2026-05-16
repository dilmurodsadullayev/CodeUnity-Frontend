import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // READ / LIST
    roadmap_isLoading: false,
    roadmaps: [],
    roadmap_error: null,

    // CREATE
    isCreating: false,
    createError: null,

    // UPDATE
    isUpdating: false,
    updateError: null,

    // DELETE
    isDeleting: false,
    deleteError: null,

    // LIKE / UNLIKE
    isLiking: false,
    likingRoadmapId: null,
    likeError: null,
};

export const RoadmapSlice = createSlice({
    name: "roadmap",
    initialState,
    reducers: {
        // =========================
        // GET ROADMAPS
        // =========================
        getRoadMapStart: (state) => {
            state.roadmap_isLoading = true;
            state.roadmap_error = null;
        },

        getRoadMapSuccess: (state, action) => {
            state.roadmap_isLoading = false;
            state.roadmaps = Array.isArray(action.payload) ? action.payload : [];
            state.roadmap_error = null;
        },

        getRoadMapFailure: (state, action) => {
            state.roadmap_isLoading = false;
            state.roadmap_error =
                action.payload || "Roadmaplarni olishda xato yuz berdi.";
        },

        // =========================
        // CREATE ROADMAP
        // =========================
        createRoadMapStart: (state) => {
            state.isCreating = true;
            state.createError = null;
        },

        createRoadMapSuccess: (state, action) => {
            state.isCreating = false;
            state.createError = null;

            const currentRoadmaps = Array.isArray(state.roadmaps)
                ? state.roadmaps
                : [];

            state.roadmaps = [action.payload, ...currentRoadmaps].filter(Boolean);
        },

        createRoadMapFailure: (state, action) => {
            state.isCreating = false;
            state.createError =
                action.payload || "Roadmap yaratishda xato yuz berdi.";
        },

        // =========================
        // UPDATE ROADMAP
        // =========================
        updateRoadMapStart: (state) => {
            state.isUpdating = true;
            state.updateError = null;
        },

        updateRoadMapSuccess: (state, action) => {
            state.isUpdating = false;
            state.updateError = null;

            const updatedRoadmap = action.payload;

            if (!updatedRoadmap?.id) return;

            state.roadmaps = state.roadmaps.map((roadmap) =>
                roadmap.id === updatedRoadmap.id
                    ? {
                          ...roadmap,
                          ...updatedRoadmap,
                      }
                    : roadmap
            );
        },

        updateRoadMapFailure: (state, action) => {
            state.isUpdating = false;
            state.updateError =
                action.payload || "Roadmap tahrirlashda xato yuz berdi.";
        },

        // =========================
        // DELETE ROADMAP
        // =========================
        deleteRoadMapStart: (state) => {
            state.isDeleting = true;
            state.deleteError = null;
        },

        deleteRoadMapSuccess: (state, action) => {
            state.isDeleting = false;
            state.deleteError = null;

            const deletedId = action.payload;

            state.roadmaps = state.roadmaps.filter(
                (roadmap) => roadmap.id !== deletedId
            );
        },

        deleteRoadMapFailure: (state, action) => {
            state.isDeleting = false;
            state.deleteError =
                action.payload || "Roadmap o‘chirishda xato yuz berdi.";
        },

        // =========================
        // LIKE / UNLIKE
        // =========================
        toggleLikeRoadmapStart: (state, action) => {
            state.isLiking = true;
            state.likingRoadmapId = action.payload || null;
            state.likeError = null;
        },

        toggleLikeRoadmapSuccess: (state, action) => {
            state.isLiking = false;
            state.likingRoadmapId = null;
            state.likeError = null;

            const updatedRoadmap = action.payload;

            if (!updatedRoadmap?.id) return;

            state.roadmaps = state.roadmaps.map((roadmap) =>
                roadmap.id === updatedRoadmap.id
                    ? {
                          ...roadmap,
                          ...updatedRoadmap,
                          is_liked: Boolean(updatedRoadmap.is_liked),
                          like_count: Number(updatedRoadmap.like_count || 0),
                      }
                    : roadmap
            );
        },

        toggleLikeRoadmapFailure: (state, action) => {
            state.isLiking = false;
            state.likingRoadmapId = null;
            state.likeError =
                action.payload || "Roadmap like bosishda xato yuz berdi.";
        },

        // =========================
        // OPTIMISTIC LOCAL UPDATE
        // =========================
        updateRoadmapLocal: (state, action) => {
            const { id, changes } = action.payload || {};

            if (!id) return;

            state.roadmaps = state.roadmaps.map((roadmap) =>
                roadmap.id === id
                    ? {
                          ...roadmap,
                          ...changes,
                      }
                    : roadmap
            );
        },

        clearRoadmapErrors: (state) => {
            state.roadmap_error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
            state.likeError = null;
        },
    },
});

export const {
    // GET
    getRoadMapStart,
    getRoadMapSuccess,
    getRoadMapFailure,

    // CREATE
    createRoadMapStart,
    createRoadMapSuccess,
    createRoadMapFailure,

    // UPDATE
    updateRoadMapStart,
    updateRoadMapSuccess,
    updateRoadMapFailure,

    // DELETE
    deleteRoadMapStart,
    deleteRoadMapSuccess,
    deleteRoadMapFailure,

    // LIKE
    toggleLikeRoadmapStart,
    toggleLikeRoadmapSuccess,
    toggleLikeRoadmapFailure,

    // LOCAL
    updateRoadmapLocal,
    clearRoadmapErrors,
} = RoadmapSlice.actions;

export default RoadmapSlice.reducer;