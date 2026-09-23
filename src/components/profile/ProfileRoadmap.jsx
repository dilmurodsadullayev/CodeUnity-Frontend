// src/components/profile/ProfileRoadmap.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    Loader2,
    Map,
    MapPinned,
    Plus,
    RefreshCw,
    Route,
    Sparkles,
} from "lucide-react";


import {
    getRoadMapFailure,
    getRoadMapStart,
    getRoadMapSuccess,

    deleteRoadMapStart,
    deleteRoadMapSuccess,
    deleteRoadMapFailure,

    toggleLikeRoadmapStart,
    toggleLikeRoadmapSuccess,
    toggleLikeRoadmapFailure,

    updateRoadmapLocal,
} from "../../features/roadmap";


import RoadmapService from "../../services/roadmap";

import RoadmapItem from "./RoadmapItem";

import DeleteConfirmationModal from "../DeleteConfirmationModal";

import RoadmapFormModal from "./RoadmapCreateModal";

import {
    siteToast,
} from "../ui/AuthToast";


// =========================================================
// SELECTORS
// =========================================================

const selectRoadmapState =
    (state) =>
        state.roadmap;


const selectAuthUsername =
    (state) =>
        state.auth.user?.username;


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Kutilmagan xatolik yuz berdi."
) => {

    const data =
        error?.serverData
        ||
        error?.response?.data;


    // =====================================================
    // STRING RESPONSE
    // =====================================================

    if (
        typeof data === "string"
        &&
        data.trim()
    ) {
        return data;
    }


    // =====================================================
    // DRF DETAIL
    // =====================================================

    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    // =====================================================
    // DRF ERROR
    // =====================================================

    if (
        data?.error
    ) {
        return String(
            data.error
        );
    }


    // =====================================================
    // DRF MESSAGE
    // =====================================================

    if (
        data?.message
    ) {
        return String(
            data.message
        );
    }


    // =====================================================
    // FIELD ERRORS
    // =====================================================

    if (
        data
        &&
        typeof data === "object"
    ) {

        const fieldLabels = {
            title:
                "Sarlavha",

            type:
                "Roadmap turi",

            description:
                "Tavsif",

            started_at:
                "Boshlanish sanasi",

            finished_at:
                "Tugash sanasi",
        };


        for (
            const [
                key,
                value,
            ]
            of Object.entries(
                data
            )
        ) {

            const label =
                fieldLabels[key]
                ||
                key;


            if (
                Array.isArray(
                    value
                )
                &&
                value.length
            ) {

                return (
                    `${label}: ${value[0]}`
                );
            }


            if (
                typeof value ===
                "string"
            ) {

                return (
                    `${label}: ${value}`
                );
            }
        }
    }


    // =====================================================
    // ERROR.MESSAGE
    // =====================================================

    if (
        error?.message
    ) {

        try {

            const parsed =
                JSON.parse(
                    error.message
                );


            if (
                parsed?.detail
            ) {

                return String(
                    parsed.detail
                );
            }


            const firstEntry =
                Object.entries(
                    parsed
                )[0];


            if (
                firstEntry
            ) {

                const [
                    key,
                    value,
                ] =
                    firstEntry;


                const fieldLabels = {
                    title:
                        "Sarlavha",

                    type:
                        "Roadmap turi",

                    description:
                        "Tavsif",

                    started_at:
                        "Boshlanish sanasi",

                    finished_at:
                        "Tugash sanasi",
                };


                const label =
                    fieldLabels[key]
                    ||
                    key;


                if (
                    Array.isArray(
                        value
                    )
                ) {

                    return (
                        `${label}: ${
                            value[0]
                            ||
                            fallback
                        }`
                    );
                }


                if (
                    typeof value ===
                    "string"
                ) {

                    return (
                        `${label}: ${value}`
                    );
                }
            }

        } catch {

            return String(
                error.message
            );
        }
    }


    return fallback;
};


// =========================================================
// SORT ROADMAPS
// =========================================================

const sortRoadmaps = (
    items = []
) => {

    return [
        ...items,
    ].sort(
        (
            first,
            second
        ) => {

            const firstDate =
                String(
                    first?.started_at
                    ||
                    ""
                );


            const secondDate =
                String(
                    second?.started_at
                    ||
                    ""
                );


            return secondDate.localeCompare(
                firstDate
            );
        }
    );
};


// =========================================================
// PROFILE ROADMAP
// =========================================================

const ProfileRoadmap = ({
    username,
}) => {

    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        roadmaps,
        roadmap_isLoading,
        roadmap_error,

        isDeleting,
        deleteError,

        isLiking,
        likingRoadmapId,
        likeError,
    } = useSelector(
        selectRoadmapState
    );


    const currentAuthUsername =
        useSelector(
            selectAuthUsername
        );


    // =====================================================
    // OWNER
    // =====================================================

    const isOwner =
        Boolean(
            currentAuthUsername
            &&
            username
            &&
            currentAuthUsername ===
            username
        );


    // =====================================================
    // FORM MODAL
    // =====================================================

    const [
        isFormModalOpen,
        setIsFormModalOpen,
    ] = useState(
        false
    );


    const [
        editingRoadmap,
        setEditingRoadmap,
    ] = useState(
        null
    );


    const [
        isFormSubmitting,
        setIsFormSubmitting,
    ] = useState(
        false
    );


    // =====================================================
    // DELETE MODAL
    // =====================================================

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    const [
        deletingRoadmap,
        setDeletingRoadmap,
    ] = useState(
        null
    );


    // =====================================================
    // SAFE ROADMAPS
    // =====================================================

    const safeRoadmaps =
        useMemo(
            () => {

                return Array.isArray(
                    roadmaps
                )
                    ? roadmaps
                    : [];

            },
            [
                roadmaps,
            ]
        );


    // =====================================================
    // ROADMAP STATISTICS
    // =====================================================

    const roadmapStats =
        useMemo(
            () => {

                const learning =
                    safeRoadmaps.filter(
                        (
                            item
                        ) =>
                            item?.type ===
                            "learning"
                    ).length;


                const experience =
                    safeRoadmaps.filter(
                        (
                            item
                        ) =>
                            item?.type ===
                            "experience"
                    ).length;


                const completed =
                    safeRoadmaps.filter(
                        (
                            item
                        ) =>
                            Boolean(
                                item
                                    ?.finished_at
                            )
                    ).length;


                return {
                    total:
                        safeRoadmaps.length,

                    learning,

                    experience,

                    completed,
                };

            },
            [
                safeRoadmaps,
            ]
        );


    // =====================================================
    // GET ROADMAPS
    // =====================================================

    const getRoadmap =
        useCallback(
            async (
                {
                    silent = false,
                } = {}
            ) => {

                if (
                    !username
                ) {
                    return [];
                }


                if (
                    !silent
                ) {

                    dispatch(
                        getRoadMapStart()
                    );
                }


                try {

                    const response =
                        await RoadmapService
                            .getRoadmap(
                                username
                            );


                    const nextRoadmaps =
                        Array.isArray(
                            response
                        )
                            ? response

                            : Array.isArray(
                                response
                                    ?.results
                            )
                                ? response.results
                                : [];


                    dispatch(
                        getRoadMapSuccess(
                            nextRoadmaps
                        )
                    );


                    return nextRoadmaps;

                } catch (
                    requestError
                ) {

                    console.error(
                        "Roadmap olishda xato:",
                        requestError
                    );


                    const errorMessage =
                        getErrorMessage(
                            requestError,
                            "Roadmaplarni olishda xato yuz berdi."
                        );


                    if (
                        !silent
                    ) {

                        dispatch(
                            getRoadMapFailure(
                                errorMessage
                            )
                        );
                    }


                    throw requestError;
                }

            },
            [
                dispatch,
                username,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            getRoadmap()
                .catch(
                    () => {
                        // Error Redux orqali UI da ko‘rsatiladi.
                    }
                );

        },
        [
            getRoadmap,
        ]
    );


    // =====================================================
    // OPEN CREATE
    // =====================================================

    const handleCreateClick =
        () => {

            if (
                !isOwner
            ) {

                siteToast.warning(
                    "Faqat o‘z profilingizga roadmap qo‘sha olasiz.",
                    {
                        title:
                            "Ruxsat yo‘q",

                        duration:
                            3500,
                    }
                );


                return;
            }


            setEditingRoadmap(
                null
            );


            setIsFormModalOpen(
                true
            );
        };


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleEditClick =
        (
            roadmap
        ) => {

            if (
                !isOwner
            ) {

                siteToast.warning(
                    "Bu roadmapni tahrirlash huquqingiz yo‘q.",
                    {
                        title:
                            "Ruxsat yo‘q",
                    }
                );


                return;
            }


            if (
                !roadmap?.id
            ) {
                return;
            }


            setEditingRoadmap(
                roadmap
            );


            setIsFormModalOpen(
                true
            );
        };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const handleCloseFormModal =
        () => {

            if (
                isFormSubmitting
            ) {
                return;
            }


            setIsFormModalOpen(
                false
            );


            setEditingRoadmap(
                null
            );
        };


    // =====================================================
    // CREATE / UPDATE
    //
    // Toast RoadmapCreateModal ichida boshqariladi.
    // Shu sabab bu yerda success/error toast YO‘Q.
    // =====================================================

    const handleRoadmapSubmit =
        async (
            payload
        ) => {

            if (
                !username
            ) {

                throw new Error(
                    "Profil username topilmadi."
                );
            }


            if (
                !isOwner
            ) {

                throw new Error(
                    "Faqat o‘z profilingizdagi roadmapni boshqarishingiz mumkin."
                );
            }


            if (
                isFormSubmitting
            ) {
                return false;
            }


            setIsFormSubmitting(
                true
            );


            try {

                // =================================================
                // UPDATE
                // =================================================

                if (
                    editingRoadmap?.id
                ) {

                    const response =
                        await RoadmapService
                            .updateRoadmap(
                                username,
                                editingRoadmap.id,
                                payload
                            );


                    const updatedRoadmap =
                        response?.roadmap
                        ||
                        response;


                    if (
                        updatedRoadmap?.id
                    ) {

                        const nextRoadmaps =
                            safeRoadmaps.map(
                                (
                                    item
                                ) => {

                                    if (
                                        Number(
                                            item.id
                                        )
                                        !==
                                        Number(
                                            editingRoadmap.id
                                        )
                                    ) {
                                        return item;
                                    }


                                    return {
                                        ...item,
                                        ...updatedRoadmap,
                                    };
                                }
                            );


                        dispatch(
                            getRoadMapSuccess(
                                sortRoadmaps(
                                    nextRoadmaps
                                )
                            )
                        );

                    } else {

                        // Response formati boshqacha bo‘lsa
                        // serverdan qayta olamiz.

                        await getRoadmap({
                            silent:
                                true,
                        });
                    }


                    return updatedRoadmap;
                }


                // =================================================
                // CREATE
                // =================================================

                const response =
                    await RoadmapService
                        .createRoadmap(
                            username,
                            payload
                        );


                const createdRoadmap =
                    response?.roadmap
                    ||
                    response;


                if (
                    createdRoadmap?.id
                ) {

                    const withoutDuplicate =
                        safeRoadmaps.filter(
                            (
                                item
                            ) =>
                                Number(
                                    item.id
                                )
                                !==
                                Number(
                                    createdRoadmap.id
                                )
                        );


                    dispatch(
                        getRoadMapSuccess(
                            sortRoadmaps([
                                createdRoadmap,
                                ...withoutDuplicate,
                            ])
                        )
                    );

                } else {

                    await getRoadmap({
                        silent:
                            true,
                    });
                }


                return createdRoadmap;

            } catch (
                requestError
            ) {

                console.error(
                    editingRoadmap?.id

                        ? "Roadmap update xato:"

                        : "Roadmap create xato:",

                    requestError
                );


                /*
                    MUHIM:

                    Xatoni bu yerda yutib yubormaymiz.

                    RoadmapCreateModal catch qiladi
                    va siteToast orqali chiqaradi.
                */

                throw requestError;

            } finally {

                setIsFormSubmitting(
                    false
                );
            }
        };


    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick =
        (
            roadmap
        ) => {

            if (
                !isOwner
            ) {

                siteToast.warning(
                    "Bu roadmapni o‘chirish huquqingiz yo‘q.",
                    {
                        title:
                            "Ruxsat yo‘q",
                    }
                );


                return;
            }


            if (
                !roadmap?.id
            ) {
                return;
            }


            setDeletingRoadmap(
                roadmap
            );


            setIsDeleteModalOpen(
                true
            );
        };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleCloseDeleteModal =
        () => {

            if (
                isDeleting
            ) {
                return;
            }


            setIsDeleteModalOpen(
                false
            );


            setDeletingRoadmap(
                null
            );
        };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirmDelete =
        async () => {

            if (
                !deletingRoadmap?.id
                ||
                isDeleting
            ) {
                return;
            }


            dispatch(
                deleteRoadMapStart()
            );


            const toastId =
                siteToast.loading(
                    `"${deletingRoadmap.title}" roadmap o‘chirilmoqda...`,
                    {
                        title:
                            "Roadmap o‘chirilmoqda",
                    }
                );


            try {

                await RoadmapService
                    .deleteRoadmap(
                        username,
                        deletingRoadmap.id
                    );


                /*
                    API 204 qaytarsa response body bo‘lmasligi
                    mumkin. Shu sabab reducerga o‘zimiz bilgan
                    roadmap ID ni yuboramiz.
                */

                dispatch(
                    deleteRoadMapSuccess(
                        deletingRoadmap.id
                    )
                );


                setIsDeleteModalOpen(
                    false
                );


                setDeletingRoadmap(
                    null
                );


                siteToast.success(
                    "Roadmap muvaffaqiyatli o‘chirildi.",
                    {
                        id:
                            toastId,

                        title:
                            "Roadmap o‘chirildi",

                        duration:
                            3200,
                    }
                );

            } catch (
                requestError
            ) {

                console.error(
                    "Roadmap o‘chirishda xato:",
                    requestError
                );


                const errorMessage =
                    getErrorMessage(
                        requestError,
                        "Roadmapni o‘chirishda xato yuz berdi."
                    );


                dispatch(
                    deleteRoadMapFailure(
                        errorMessage
                    )
                );


                siteToast.error(
                    errorMessage,
                    {
                        id:
                            toastId,

                        title:
                            "Roadmap o‘chirilmadi",

                        duration:
                            5000,
                    }
                );
            }
        };


    // =====================================================
    // TOGGLE LIKE
    // =====================================================

    const handleToggleLike =
        async (
            roadmap
        ) => {

            if (
                !roadmap?.id
            ) {
                return;
            }


            // =================================================
            // AUTH
            // =================================================

            if (
                !currentAuthUsername
            ) {

                siteToast.warning(
                    "Roadmapni yoqtirish uchun avval tizimga kiring.",
                    {
                        title:
                            "Kirish talab qilinadi",

                        duration:
                            3500,
                    }
                );


                return;
            }


            // =================================================
            // BUSY
            // =================================================

            if (
                isLiking
                ||
                isDeleting
                ||
                roadmap_isLoading
            ) {
                return;
            }


            dispatch(
                toggleLikeRoadmapStart(
                    roadmap.id
                )
            );


            // =================================================
            // OLD VALUES
            // =================================================

            const oldIsLiked =
                Boolean(
                    roadmap.is_liked
                );


            const oldLikeCount =
                Number(
                    roadmap.like_count
                    ||
                    0
                );


            // =================================================
            // OPTIMISTIC VALUES
            // =================================================

            const nextIsLiked =
                !oldIsLiked;


            const nextLikeCount =
                Math.max(
                    0,

                    nextIsLiked
                        ? oldLikeCount + 1
                        : oldLikeCount - 1
                );


            // =================================================
            // OPTIMISTIC UI
            // =================================================

            dispatch(
                updateRoadmapLocal({
                    id:
                        roadmap.id,

                    changes: {
                        is_liked:
                            nextIsLiked,

                        like_count:
                            nextLikeCount,
                    },
                })
            );


            try {

                const response =
                    await RoadmapService
                        .toggleLikeRoadmap(
                            roadmap.id
                        );


                dispatch(
                    toggleLikeRoadmapSuccess({
                        ...response,

                        id:
                            response?.id
                            ||
                            roadmap.id,

                        is_liked:
                            typeof response
                                ?.is_liked ===
                            "boolean"

                                ? response.is_liked

                                : nextIsLiked,

                        like_count:
                            Number(
                                response
                                    ?.like_count
                                ??
                                nextLikeCount
                            ),
                    })
                );


                /*
                    Like bosilganda har safar success toast
                    chiqarish shart emas.

                    Aks holda user tez-tez like/unlike qilganda
                    toast juda ko‘payib ketadi.
                */

            } catch (
                requestError
            ) {

                console.error(
                    "Roadmap like bosishda xato:",
                    requestError
                );


                // =================================================
                // ROLLBACK
                // =================================================

                dispatch(
                    updateRoadmapLocal({
                        id:
                            roadmap.id,

                        changes: {
                            is_liked:
                                oldIsLiked,

                            like_count:
                                oldLikeCount,
                        },
                    })
                );


                const errorMessage =
                    getErrorMessage(
                        requestError,
                        "Roadmapni yoqtirishda xato yuz berdi."
                    );


                dispatch(
                    toggleLikeRoadmapFailure(
                        errorMessage
                    )
                );


                siteToast.error(
                    errorMessage,
                    {
                        title:
                            "Like amalga oshmadi",

                        duration:
                            4200,
                    }
                );
            }
        };


    // =====================================================
    // RETRY
    // =====================================================

    const handleRetry =
        async () => {

            try {

                await getRoadmap();

            } catch {
                // Redux state orqali error ko‘rsatiladi.
            }
        };


    // =====================================================
    // EMPTY / ERROR COMPONENT
    // =====================================================

    const EmptyRoadmap = ({
        errorMode = false,
    }) => {

        const message =
            errorMode

                ? roadmap_error
                    ||
                    "Roadmaplarni yuklab bo‘lmadi."

                : isOwner

                    ? "O‘rganayotgan texnologiyalaringiz, tajribangiz va rivojlanish bosqichlaringizni roadmap orqali ko‘rsating."

                    : "Foydalanuvchi hali o‘z rivojlanish yo‘lini qo‘shmagan.";


        return (
            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.07]
                    bg-[#0b1018]/80
                    p-6
                    shadow-2xl
                    shadow-black/20

                    sm:p-8
                "
            >

                {/* =============================================
                    GLOWS
                ============================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-56
                        w-56
                        rounded-full
                        bg-indigo-500/[0.08]
                        blur-[80px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-20
                        -left-20
                        h-56
                        w-56
                        rounded-full
                        bg-violet-500/[0.06]
                        blur-[80px]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        flex
                        max-w-2xl
                        flex-col
                        items-center
                        py-8
                        text-center

                        sm:py-12
                    "
                >

                    {/* =========================================
                        ICON
                    ========================================== */}

                    <div
                        className={`
                            relative
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-[24px]
                            border

                            ${
                                errorMode

                                    ? `
                                        border-red-400/15
                                        bg-red-500/[0.06]
                                        text-red-300
                                    `

                                    : `
                                        border-indigo-400/15
                                        bg-indigo-500/[0.07]
                                        text-indigo-300
                                    `
                            }
                        `}
                    >

                        {errorMode ? (
                            <AlertTriangle
                                size={31}
                            />
                        ) : (
                            <MapPinned
                                size={32}
                            />
                        )}


                        {!errorMode && (
                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    h-4
                                    w-4
                                    rounded-full
                                    border-[3px]
                                    border-[#0b1018]
                                    bg-emerald-400
                                    shadow-[0_0_12px_rgba(52,211,153,0.7)]
                                "
                            />
                        )}

                    </div>


                    {/* =========================================
                        TEXT
                    ========================================== */}

                    <div
                        className="
                            mt-5
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.22em]
                                text-indigo-400
                            "
                        >
                            F.Society Journey
                        </p>


                        <h3
                            className="
                                mt-2
                                text-xl
                                font-black
                                tracking-tight
                                text-white

                                sm:text-2xl
                            "
                        >
                            {errorMode
                                ? "Roadmaplarni yuklab bo‘lmadi"
                                : "Rivojlanish yo‘li hali boshlanmagan"}
                        </h3>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-lg
                                text-xs
                                font-medium
                                leading-6
                                text-gray-600

                                sm:text-sm
                            "
                        >
                            {message}
                        </p>

                    </div>


                    {/* =========================================
                        ACTION
                    ========================================== */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        {errorMode && (
                            <button
                                type="button"
                                onClick={
                                    handleRetry
                                }
                                className="
                                    inline-flex
                                    min-h-[42px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.035]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-black
                                    text-gray-300
                                    transition

                                    hover:border-indigo-400/20
                                    hover:bg-indigo-500/[0.06]
                                    hover:text-indigo-200

                                    active:scale-[0.97]
                                "
                            >
                                <RefreshCw
                                    size={15}
                                />

                                Qayta urinish
                            </button>
                        )}


                        {!errorMode
                            &&
                            isOwner
                            && (
                                <button
                                    type="button"
                                    onClick={
                                        handleCreateClick
                                    }
                                    className="
                                        group
                                        inline-flex
                                        min-h-[42px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-indigo-400/25
                                        bg-indigo-600
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-black
                                        text-white
                                        shadow-lg
                                        shadow-indigo-600/20
                                        transition-all

                                        hover:-translate-y-0.5
                                        hover:bg-indigo-500
                                        hover:shadow-indigo-500/25

                                        active:translate-y-0
                                        active:scale-[0.97]
                                    "
                                >
                                    <Plus
                                        size={16}
                                        className="
                                            transition-transform
                                            group-hover:rotate-90
                                        "
                                    />

                                    Birinchi roadmapni qo‘shish
                                </button>
                            )
                        }

                    </div>

                </div>

            </div>
        );
    };


    // =====================================================
    // INITIAL LOADING
    // =====================================================

    if (
        roadmap_isLoading
        &&
        safeRoadmaps.length ===
        0
    ) {

        return (
            <div
                id="roadmap"
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.07]
                    bg-[#0b1018]/80
                    p-5

                    sm:p-7
                "
            >

                {/* =========================================
                    HEADER SKELETON
                ========================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <div
                        className="
                            space-y-2
                        "
                    >
                        <div
                            className="
                                h-6
                                w-40
                                animate-pulse
                                rounded-lg
                                bg-white/[0.06]
                            "
                        />

                        <div
                            className="
                                h-3
                                w-64
                                max-w-full
                                animate-pulse
                                rounded-lg
                                bg-white/[0.035]
                            "
                        />
                    </div>


                    <div
                        className="
                            h-10
                            w-28
                            animate-pulse
                            rounded-xl
                            bg-white/[0.05]
                        "
                    />
                </div>


                {/* =========================================
                    TIMELINE SKELETON
                ========================================== */}

                <div
                    className="
                        relative
                        mt-8
                        space-y-8
                    "
                >

                    <div
                        className="
                            absolute
                            bottom-5
                            left-[17px]
                            top-5
                            w-px
                            bg-white/[0.06]
                        "
                    />


                    {[1, 2, 3].map(
                        (
                            item
                        ) => (
                            <div
                                key={
                                    item
                                }
                                className="
                                    relative
                                    flex
                                    gap-5
                                    pl-12
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        left-0
                                        top-1
                                        h-9
                                        w-9
                                        animate-pulse
                                        rounded-full
                                        border-4
                                        border-[#0b1018]
                                        bg-white/[0.08]
                                    "
                                />


                                <div
                                    className="
                                        flex-1
                                        space-y-3
                                    "
                                >
                                    <div
                                        className="
                                            h-3
                                            w-28
                                            animate-pulse
                                            rounded-lg
                                            bg-white/[0.04]
                                        "
                                    />

                                    <div
                                        className="
                                            h-6
                                            w-2/3
                                            animate-pulse
                                            rounded-lg
                                            bg-white/[0.07]
                                        "
                                    />

                                    <div
                                        className="
                                            h-3
                                            w-full
                                            animate-pulse
                                            rounded-lg
                                            bg-white/[0.04]
                                        "
                                    />

                                    <div
                                        className="
                                            h-3
                                            w-3/4
                                            animate-pulse
                                            rounded-lg
                                            bg-white/[0.035]
                                        "
                                    />
                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        roadmap_error
        &&
        safeRoadmaps.length ===
        0
    ) {

        return (
            <div
                id="roadmap"
            >
                <EmptyRoadmap
                    errorMode
                />
            </div>
        );
    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        safeRoadmaps.length ===
        0
    ) {

        return (
            <div
                id="roadmap"
            >

                <EmptyRoadmap />


                <RoadmapFormModal
                    isOpen={
                        isFormModalOpen
                    }
                    onClose={
                        handleCloseFormModal
                    }
                    onSubmit={
                        handleRoadmapSubmit
                    }
                    initialData={
                        editingRoadmap
                    }
                    isSubmitting={
                        isFormSubmitting
                    }
                />

            </div>
        );
    }


    // =====================================================
    // MAIN
    // =====================================================

    return (
        <div
            id="roadmap"
            className="
                space-y-5
            "
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-white/[0.07]
                    bg-[#0b1018]/80
                    p-5
                    shadow-xl
                    shadow-black/20

                    sm:p-6
                "
            >

                {/* GLOW */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        h-48
                        w-48
                        rounded-full
                        bg-indigo-500/[0.08]
                        blur-[75px]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* =========================================
                        TITLE
                    ========================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-indigo-400/15
                                bg-indigo-500/[0.07]
                                text-indigo-300
                            "
                        >
                            <Route
                                size={22}
                            />
                        </div>


                        <div>

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <h3
                                    className="
                                        text-xl
                                        font-black
                                        tracking-tight
                                        text-white

                                        sm:text-2xl
                                    "
                                >
                                    Yo‘l xaritasi
                                </h3>


                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.06]
                                        px-2.5
                                        py-1
                                        text-[9px]
                                        font-black
                                        text-indigo-300
                                    "
                                >
                                    {
                                        roadmapStats.total
                                    }
                                    {" "}
                                    ta
                                </span>
                            </div>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                    text-gray-600
                                "
                            >
                                O‘rganish, tajriba va rivojlanish timeline’i
                            </p>

                        </div>

                    </div>


                    {/* =========================================
                        ACTIONS
                    ========================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                handleRetry
                            }
                            disabled={
                                roadmap_isLoading
                            }
                            title="Roadmaplarni yangilash"
                            className="
                                inline-flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                text-gray-500
                                transition

                                hover:border-indigo-400/20
                                hover:bg-indigo-500/[0.06]
                                hover:text-indigo-300

                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    roadmap_isLoading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>


                        {isOwner && (
                            <button
                                type="button"
                                onClick={
                                    handleCreateClick
                                }
                                className="
                                    group
                                    inline-flex
                                    min-h-[40px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-indigo-400/25
                                    bg-indigo-600
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition-all

                                    hover:-translate-y-0.5
                                    hover:bg-indigo-500

                                    active:translate-y-0
                                    active:scale-[0.97]
                                "
                            >
                                <Plus
                                    size={15}
                                    className="
                                        transition-transform
                                        group-hover:rotate-90
                                    "
                                />

                                Roadmap qo‘shish
                            </button>
                        )}

                    </div>

                </div>


                {/* =================================================
                    SMALL STATS
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mt-5
                        grid
                        grid-cols-2
                        gap-2

                        sm:grid-cols-4
                    "
                >

                    <div
                        className="
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-black/15
                            px-3
                            py-2.5
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-700
                            "
                        >
                            Jami
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-white
                            "
                        >
                            {
                                roadmapStats.total
                            }
                        </p>
                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-indigo-400/[0.08]
                            bg-indigo-500/[0.025]
                            px-3
                            py-2.5
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-700
                            "
                        >
                            Learning
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-indigo-300
                            "
                        >
                            {
                                roadmapStats.learning
                            }
                        </p>
                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-emerald-400/[0.08]
                            bg-emerald-500/[0.025]
                            px-3
                            py-2.5
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-700
                            "
                        >
                            Experience
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-emerald-300
                            "
                        >
                            {
                                roadmapStats.experience
                            }
                        </p>
                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-violet-400/[0.08]
                            bg-violet-500/[0.025]
                            px-3
                            py-2.5
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-700
                            "
                        >
                            Yakunlangan
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-black
                                text-violet-300
                            "
                        >
                            {
                                roadmapStats.completed
                            }
                        </p>
                    </div>

                </div>

            </div>


            {/* =================================================
                REDUX ERRORS
            ================================================== */}

            {(deleteError || likeError) && (
                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-400/15
                        bg-red-500/[0.05]
                        p-4
                    "
                >

                    <AlertTriangle
                        size={17}
                        className="
                            mt-0.5
                            shrink-0
                            text-red-300
                        "
                    />


                    <div>
                        <p
                            className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                text-red-300
                            "
                        >
                            Xatolik
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                font-medium
                                leading-5
                                text-red-200/70
                            "
                        >
                            {
                                deleteError
                                ||
                                likeError
                            }
                        </p>
                    </div>

                </div>
            )}


            {/* =================================================
                TIMELINE
            ================================================== */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.07]
                    bg-[#0b1018]/75
                    p-5
                    shadow-2xl
                    shadow-black/20

                    md:p-8
                "
            >

                {/* GLOWS */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-56
                        w-56
                        rounded-full
                        bg-indigo-500/[0.06]
                        blur-[90px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-56
                        w-56
                        rounded-full
                        bg-violet-500/[0.05]
                        blur-[90px]
                    "
                />


                {/* TIMELINE */}

                <div
                    className="
                        relative
                        z-10
                    "
                >

                    <div
                        className="
                            absolute
                            bottom-5
                            left-4
                            top-5
                            w-px
                            bg-gradient-to-b
                            from-indigo-400/30
                            via-white/[0.06]
                            to-violet-400/20
                        "
                    />


                    {safeRoadmaps.map(
                        (
                            event,
                            index
                        ) => (
                            <RoadmapItem
                                key={
                                    event.id
                                }
                                event={
                                    event
                                }
                                index={
                                    index
                                }
                                isLikeLoading={
                                    isLiking
                                    &&
                                    likingRoadmapId ===
                                    event.id
                                }
                                onEdit={
                                    handleEditClick
                                }
                                onDelete={
                                    handleDeleteClick
                                }
                                onToggleLike={
                                    handleToggleLike
                                }
                            />
                        )
                    )}

                </div>


                {/* =============================================
                    BOTTOM TIP
                ============================================== */}

                {isOwner && (
                    <div
                        className="
                            relative
                            z-10
                            mt-5
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-indigo-400/[0.08]
                            bg-indigo-500/[0.025]
                            px-4
                            py-3
                        "
                    >

                        <Sparkles
                            size={15}
                            className="
                                mt-0.5
                                shrink-0
                                text-indigo-400
                            "
                        />


                        <p
                            className="
                                text-[10px]
                                font-medium
                                leading-5
                                text-gray-600
                            "
                        >
                            Roadmap profilingizdagi texnik rivojlanish tarixini ko‘rsatadi.
                            Yangi texnologiya yoki ish tajribasini boshlaganingizda timeline’ga qo‘shib boring.
                        </p>

                    </div>
                )}

            </div>


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================== */}

            <RoadmapFormModal
                isOpen={
                    isFormModalOpen
                }
                onClose={
                    handleCloseFormModal
                }
                onSubmit={
                    handleRoadmapSubmit
                }
                initialData={
                    editingRoadmap
                }
                isSubmitting={
                    isFormSubmitting
                }
            />


            {/* =================================================
                DELETE MODAL
            ================================================== */}

            <DeleteConfirmationModal
                isOpen={
                    isDeleteModalOpen
                }
                onClose={
                    handleCloseDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                itemTitle={
                    deletingRoadmap
                        ?.title
                    ||
                    ""
                }
                isProcessing={
                    isDeleting
                }
            />


            {/* =================================================
                DELETE PROCESS OVERLAY
            ================================================== */}

            {isDeleting && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[90]
                        flex
                        items-center
                        justify-center
                        bg-black/65
                        p-4
                        backdrop-blur-sm
                    "
                >

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-[#0c1119]/95
                            px-6
                            py-5
                            shadow-2xl
                            shadow-black/50
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-10
                                -top-10
                                h-24
                                w-24
                                rounded-full
                                bg-indigo-500/[0.10]
                                blur-[35px]
                            "
                        />


                        <div
                            className="
                                relative
                                z-10
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-indigo-400/15
                                    bg-indigo-500/[0.07]
                                    text-indigo-300
                                "
                            >
                                <Loader2
                                    size={19}
                                    className="
                                        animate-spin
                                    "
                                />
                            </div>


                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    Roadmap o‘chirilmoqda
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        max-w-xs
                                        truncate
                                        text-[10px]
                                        font-medium
                                        text-gray-600
                                    "
                                >
                                    {
                                        deletingRoadmap
                                            ?.title
                                        ||
                                        "Iltimos kuting..."
                                    }
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};


export default ProfileRoadmap;