import {
    createSlice,
} from "@reduxjs/toolkit";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    // =====================================================
    // DATA
    // =====================================================

    updates: [],

    count: 0,


    // =====================================================
    // LIST STATE
    // =====================================================

    isLoading: false,

    error: null,


    // =====================================================
    // LIKE STATE
    // =====================================================

    likingUpdateIds: [],

    likeError: null,
};


// =========================================================
// SLICE
// =========================================================

export const updatesSlice =
    createSlice({

        name:
            "updates",

        initialState,

        reducers: {

            // =================================================
            // GET UPDATES
            // =================================================

            getUpdatesStart: (
                state
            ) => {
                state.isLoading =
                    true;

                state.error =
                    null;
            },


            getUpdatesSuccess: (
                state,
                action
            ) => {
                state.isLoading =
                    false;


                const payload =
                    action.payload;


                // Backend response:
                //
                // {
                //     count: 2,
                //     results: [...]
                // }

                if (
                    Array.isArray(
                        payload
                    )
                ) {
                    state.updates =
                        payload;

                    state.count =
                        payload.length;

                } else {
                    state.updates =
                        Array.isArray(
                            payload?.results
                        )
                            ? payload.results
                            : [];


                    state.count =
                        typeof payload?.count ===
                        "number"
                            ? payload.count
                            : state.updates.length;
                }


                state.error =
                    null;
            },


            getUpdatesFailure: (
                state,
                action
            ) => {
                state.isLoading =
                    false;

                state.error =
                    action.payload ||
                    (
                        "Sayt yangiliklarini "
                        + "yuklashda xatolik yuz berdi."
                    );
            },


            // =================================================
            // LIKE START
            // =================================================

            toggleUpdateLikeStart: (
                state,
                action
            ) => {
                const updateId =
                    action.payload;


                state.likeError =
                    null;


                if (
                    !state
                        .likingUpdateIds
                        .includes(
                            updateId
                        )
                ) {
                    state
                        .likingUpdateIds
                        .push(
                            updateId
                        );
                }
            },


            // =================================================
            // LIKE SUCCESS
            // =================================================

            toggleUpdateLikeSuccess: (
                state,
                action
            ) => {
                const {
                    id,
                    is_liked,
                    likes_count,
                } = action.payload ||
                    {};


                // =============================================
                // UPDATE CARD
                // =============================================

                const update =
                    state.updates.find(
                        (
                            item
                        ) =>
                            item.id ===
                            id
                    );


                if (
                    update
                ) {
                    update.is_liked =
                        Boolean(
                            is_liked
                        );


                    update.likes_count =
                        Number(
                            likes_count ??
                            update.likes_count ??
                            0
                        );
                }


                // =============================================
                // REMOVE LOADING STATE
                // =============================================

                state.likingUpdateIds =
                    state
                        .likingUpdateIds
                        .filter(
                            (
                                itemId
                            ) =>
                                itemId !==
                                id
                        );


                state.likeError =
                    null;
            },


            // =================================================
            // LIKE FAILURE
            // =================================================

            toggleUpdateLikeFailure: (
                state,
                action
            ) => {
                const {
                    id,
                    error,
                } =
                    action.payload ||
                    {};


                if (
                    id !==
                    undefined
                ) {
                    state.likingUpdateIds =
                        state
                            .likingUpdateIds
                            .filter(
                                (
                                    itemId
                                ) =>
                                    itemId !==
                                    id
                            );
                }


                state.likeError =
                    error ||
                    (
                        "Like yuborishda "
                        + "xatolik yuz berdi."
                    );
            },


            // =================================================
            // LOCAL UPDATE
            // =================================================

            updateSiteUpdateLocal: (
                state,
                action
            ) => {
                const {
                    id,
                    ...changes
                } =
                    action.payload ||
                    {};


                const item =
                    state.updates.find(
                        (
                            update
                        ) =>
                            update.id ===
                            id
                    );


                if (
                    item
                ) {
                    Object.assign(
                        item,
                        changes
                    );
                }
            },


            // =================================================
            // CLEAR ERROR
            // =================================================

            clearUpdatesError: (
                state
            ) => {
                state.error =
                    null;

                state.likeError =
                    null;
            },


            // =================================================
            // RESET
            // =================================================

            resetUpdates: (
                state
            ) => {
                state.updates =
                    [];

                state.count =
                    0;

                state.isLoading =
                    false;

                state.error =
                    null;

                state.likingUpdateIds =
                    [];

                state.likeError =
                    null;
            },

        },
    });


// =========================================================
// ACTIONS
// =========================================================

export const {

    getUpdatesStart,

    getUpdatesSuccess,

    getUpdatesFailure,

    toggleUpdateLikeStart,

    toggleUpdateLikeSuccess,

    toggleUpdateLikeFailure,

    updateSiteUpdateLocal,

    clearUpdatesError,

    resetUpdates,

} = updatesSlice.actions;


// =========================================================
// REDUCER
// =========================================================

export default updatesSlice.reducer;