// src/components/ProblemResponse.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
} from "react-router-dom";

import {
    AlertTriangle,
    Award,
    Check,
    CheckCircle2,
    Clipboard,
    Clock3,
    Code2,
    Edit3,
    Loader2,
    RefreshCw,
    Rocket,
    Sparkles,
    Star,
    Terminal,
    UserRound,
} from "lucide-react";

import {
    getProblemResponseStart,
    getProblemResponseSuccess,
} from "../features/problemResponse/problemResponse";

import ProblemResponseService from "../services/problemResponse";

import UserImage from "../assests/userImage.jpeg";

import timeAgo from "../utils/timeAgo";

import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// CONFIG
// =========================================================

const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL
    ||
    "http://127.0.0.1:8000";


// =========================================================
// NORMALIZE RESPONSES
// =========================================================

const normalizeResponses = (
    data
) => {
    if (
        Array.isArray(
            data
        )
    ) {
        return data;
    }


    if (
        Array.isArray(
            data?.results
        )
    ) {
        return data.results;
    }


    if (
        Array.isArray(
            data?.data
        )
    ) {
        return data.data;
    }


    if (
        data?.data
        &&
        typeof data.data ===
        "object"
    ) {
        return [
            data.data,
        ];
    }


    if (
        data
        &&
        typeof data ===
        "object"
        &&
        (
            data.id
            ||
            data.answer
        )
    ) {
        return [
            data,
        ];
    }


    return [];
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    const data =
        error?.serverData
        ||
        error?.response?.data;


    if (
        typeof data ===
        "string"
        &&
        data.trim()
    ) {
        return data;
    }


    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    if (
        data?.message
    ) {
        return String(
            data.message
        );
    }


    if (
        data?.error
    ) {
        return String(
            data.error
        );
    }


    if (
        data
        &&
        typeof data ===
        "object"
    ) {
        const firstValue =
            Object.values(
                data
            )[0];


        if (
            Array.isArray(
                firstValue
            )
            &&
            firstValue.length >
            0
        ) {
            return String(
                firstValue[0]
            );
        }


        if (
            typeof firstValue ===
            "string"
        ) {
            return firstValue;
        }
    }


    if (
        error?.message
    ) {
        return String(
            error.message
        );
    }


    return fallback;
};


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (
    image
) => {
    if (
        !image
    ) {
        return null;
    }


    const value =
        String(
            image
        ).trim();


    if (
        !value
    ) {
        return null;
    }


    if (
        value.startsWith(
            "http://"
        )
        ||
        value.startsWith(
            "https://"
        )
        ||
        value.startsWith(
            "blob:"
        )
        ||
        value.startsWith(
            "data:"
        )
    ) {
        return value;
    }


    const base =
        String(
            BACKEND_URL
            ||
            ""
        ).replace(
            /\/+$/,
            ""
        );


    const path =
        value.startsWith(
            "/"
        )
            ? value
            : `/${value}`;


    return `${base}${path}`;
};


// =========================================================
// LANGUAGE NAME
// =========================================================

const getLanguageName = (
    response
) => {
    if (
        response?.language_name
    ) {
        return String(
            response.language_name
        );
    }


    if (
        response?.language_data?.name
    ) {
        return String(
            response.language_data.name
        );
    }


    if (
        typeof response?.language ===
        "string"
    ) {
        return response.language;
    }


    if (
        response?.language?.name
    ) {
        return String(
            response.language.name
        );
    }


    if (
        Array.isArray(
            response?.language_data
        )
        &&
        response.language_data.length >
        0
    ) {
        return response
            .language_data
            .map(
                (
                    language
                ) =>
                    language?.name
            )
            .filter(
                Boolean
            )
            .join(
                ", "
            );
    }


    return "Kod";
};


// =========================================================
// STAR COUNT
// =========================================================

const getStarCount = (
    response
) => {
    const value =
        response?.total_stars
        ??
        response?.stars_count
        ??
        response?.star
        ??
        0;


    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return 0;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// DATE
// =========================================================

const getTimeLabel = (
    date
) => {
    if (
        !date
    ) {
        return "Hozirgina";
    }


    try {
        return timeAgo(
            date
        );

    } catch {
        return "Hozirgina";
    }
};


// =========================================================
// SKILL LEVEL
// =========================================================

const getSkillLevel = (
    level
) => {
    if (
        !level
    ) {
        return "Developer";
    }


    const labels = {
        beginner:
            "Beginner developer",

        intermediate:
            "Intermediate developer",

        advanced:
            "Advanced developer",

        pro:
            "Pro developer",

        legend:
            "Legend developer",
    };


    return (
        labels[
            String(
                level
            ).toLowerCase()
        ]
        ||
        `${String(level).charAt(0).toUpperCase()}${String(level).slice(1)} developer`
    );
};


// =========================================================
// SKELETON ITEM
// =========================================================

const ResponseSkeleton = () => {
    return (
        <div
            className="
                animate-pulse
                overflow-hidden
                rounded-[26px]
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-5

                md:p-6
            "
        >

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
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-12
                            w-12
                            rounded-2xl
                            bg-white/[0.06]
                        "
                    />


                    <div>
                        <div
                            className="
                                h-4
                                w-32
                                rounded
                                bg-white/[0.06]
                            "
                        />


                        <div
                            className="
                                mt-2
                                h-3
                                w-20
                                rounded
                                bg-white/[0.04]
                            "
                        />
                    </div>

                </div>


                <div
                    className="
                        h-8
                        w-24
                        rounded-xl
                        bg-white/[0.05]
                    "
                />

            </div>


            <div
                className="
                    mt-6
                    space-y-3
                "
            >
                <div
                    className="
                        h-4
                        w-full
                        rounded
                        bg-white/[0.05]
                    "
                />

                <div
                    className="
                        h-4
                        w-[92%]
                        rounded
                        bg-white/[0.05]
                    "
                />

                <div
                    className="
                        h-4
                        w-[65%]
                        rounded
                        bg-white/[0.04]
                    "
                />
            </div>


            <div
                className="
                    mt-6
                    flex
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        h-10
                        w-32
                        rounded-xl
                        bg-white/[0.05]
                    "
                />

                <div
                    className="
                        h-3
                        w-20
                        rounded
                        bg-white/[0.04]
                    "
                />
            </div>

        </div>
    );
};


// =========================================================
// PROBLEM RESPONSE
// =========================================================

const ProblemResponse = ({
    id,

    isOwner = false,

    isSolved = false,

    onAcceptSolution,

    /*
        Form yangi yechim yaratganda
        ushbu response shu yerga keladi.

        Bu orqali serverdan qayta GET kutmasdan
        yangi yechimni DARHOL UI ga qo‘shamiz.
    */

    newResponse = null,

    /*
        Form submitdan keyin increment qilinadi.

        Shunda backgroundda serverdan
        canonical list qayta olinadi.
    */

    refreshKey = 0,
}) => {
    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        problemResponses,
        isLoading,
    } = useSelector(
        (
            state
        ) =>
            state.problemResponse
    );


    const {
        user: authUser,
        isLoggedIn,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        fetchError,
        setFetchError,
    ] = useState(
        ""
    );


    const [
        starLoadingIds,
        setStarLoadingIds,
    ] = useState(
        {}
    );


    const [
        freshResponseId,
        setFreshResponseId,
    ] = useState(
        null
    );


    // =====================================================
    // CURRENT RESPONSES
    // =====================================================

    const responsesArray =
        useMemo(
            () =>
                normalizeResponses(
                    problemResponses
                ),
            [
                problemResponses,
            ]
        );


    // =====================================================
    // REF
    //
    // Fetch error bo‘lsa mavjud listni yo‘qotmaslik uchun.
    // =====================================================

    const responsesRef =
        useRef(
            []
        );


    useEffect(
        () => {
            responsesRef.current =
                responsesArray;
        },
        [
            responsesArray,
        ]
    );


    // =====================================================
    // SORT
    //
    // 1. Accepted solution birinchi
    // 2. Yangi response yuqorida
    // =====================================================

    const sortedResponses =
        useMemo(
            () => {
                return [
                    ...responsesArray,
                ].sort(
                    (
                        a,
                        b
                    ) => {
                        const aSelected =
                            Boolean(
                                a?.is_selected
                            );


                        const bSelected =
                            Boolean(
                                b?.is_selected
                            );


                        if (
                            aSelected !==
                            bSelected
                        ) {
                            return bSelected -
                                aSelected;
                        }


                        const aTime =
                            a?.created_at
                                ? new Date(
                                    a.created_at
                                ).getTime()
                                : 0;


                        const bTime =
                            b?.created_at
                                ? new Date(
                                    b.created_at
                                ).getTime()
                                : 0;


                        if (
                            aTime !==
                            bTime
                        ) {
                            return bTime -
                                aTime;
                        }


                        return (
                            Number(
                                b?.id
                                ||
                                0
                            )
                            -
                            Number(
                                a?.id
                                ||
                                0
                            )
                        );
                    }
                );
            },
            [
                responsesArray,
            ]
        );


    // =====================================================
    // FETCH RESPONSES
    // =====================================================

    const getProblemResponses =
        useCallback(
            async ({
                silent = false,
            } = {}) => {
                if (
                    !id
                ) {
                    return;
                }


                setFetchError(
                    ""
                );


                if (
                    !silent
                ) {
                    dispatch(
                        getProblemResponseStart()
                    );
                }


                try {
                    const response =
                        await ProblemResponseService
                            .getProblemResponse(
                                id
                            );


                    const fetchedResponses =
                        normalizeResponses(
                            response
                        );


                    dispatch(
                        getProblemResponseSuccess(
                            fetchedResponses
                        )
                    );

                } catch (
                    error
                ) {
                    console.error(
                        "Yechimlarni yuklashda xatolik:",
                        error
                    );


                    const message =
                        getErrorMessage(
                            error,
                            "Yechimlarni serverdan yuklab bo‘lmadi."
                        );


                    setFetchError(
                        message
                    );


                    /*
                        Agar initial loading bo‘lsa
                        reducerdagi isLoading=true qolib
                        ketmasligi uchun mavjud listni
                        success orqali qaytaramiz.
                    */

                    if (
                        !silent
                    ) {
                        dispatch(
                            getProblemResponseSuccess(
                                responsesRef.current
                            )
                        );
                    }


                    siteToast.error(
                        message,
                        {
                            title:
                                "Yechimlar yuklanmadi",

                            duration:
                                4500,
                        }
                    );
                }
            },
            [
                id,
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD + REFRESH
    //
    // refreshKey o‘zgarsa yangi yechimdan keyin
    // list serverdan qayta olinadi.
    //
    // isSolved o‘zgarsa accepted solution statusi ham
    // serverdan qayta olinadi.
    // =====================================================

    useEffect(
        () => {
            getProblemResponses({
                silent:
                    responsesRef
                        .current
                        .length >
                    0,
            });
        },
        [
            getProblemResponses,
            refreshKey,
            isSolved,
        ]
    );


    // =====================================================
    // INSTANT NEW RESPONSE
    //
    // POST response keldi →
    // Redux listga darhol qo‘shamiz.
    //
    // Background refresh key esa keyin server bilan
    // sync qilib beradi.
    // =====================================================

    useEffect(
        () => {
            const normalized =
                normalizeResponses(
                    newResponse
                );


            const created =
                normalized[0];


            if (
                !created?.id
            ) {
                return undefined;
            }


            const current =
                responsesRef.current;


            const exists =
                current.some(
                    (
                        response
                    ) =>
                        Number(
                            response?.id
                        )
                        ===
                        Number(
                            created.id
                        )
                );


            const updated =
                exists
                    ? current.map(
                        (
                            response
                        ) =>
                            Number(
                                response?.id
                            )
                            ===
                            Number(
                                created.id
                            )
                                ? {
                                    ...response,
                                    ...created,
                                }
                                : response
                    )
                    : [
                        created,
                        ...current,
                    ];


            dispatch(
                getProblemResponseSuccess(
                    updated
                )
            );


            setFreshResponseId(
                created.id
            );


            const timer =
                window.setTimeout(
                    () => {
                        setFreshResponseId(
                            null
                        );
                    },
                    6000
                );


            return () => {
                window.clearTimeout(
                    timer
                );
            };
        },
        [
            newResponse,
            dispatch,
        ]
    );


    // =====================================================
    // COPY
    // =====================================================

    const handleCopyCode =
        async (
            code
        ) => {
            if (
                !code
            ) {
                siteToast.warning(
                    "Nusxalash uchun kod mavjud emas.",
                    {
                        title:
                            "Kod topilmadi",
                    }
                );

                return;
            }


            try {
                if (
                    navigator
                        ?.clipboard
                        ?.writeText
                ) {
                    await navigator
                        .clipboard
                        .writeText(
                            code
                        );

                } else {
                    const textarea =
                        document
                            .createElement(
                                "textarea"
                            );


                    textarea.value =
                        code;


                    textarea.style.position =
                        "fixed";


                    textarea.style.opacity =
                        "0";


                    document.body
                        .appendChild(
                            textarea
                        );


                    textarea.select();


                    document.execCommand(
                        "copy"
                    );


                    textarea.remove();
                }


                siteToast.success(
                    "Yechim kodi clipboardga nusxalandi.",
                    {
                        title:
                            "Kod nusxalandi",

                        duration:
                            2200,
                    }
                );

            } catch (
                error
            ) {
                console.error(
                    "Kod nusxalashda xatolik:",
                    error
                );


                siteToast.error(
                    "Kodni nusxalab bo‘lmadi.",
                    {
                        title:
                            "Nusxalash xatosi",

                        duration:
                            4000,
                    }
                );
            }
        };


    // =====================================================
    // STAR LOADING
    // =====================================================

    const setResponseStarLoading =
        (
            responseId,
            loading
        ) => {
            setStarLoadingIds(
                (
                    previous
                ) => ({
                    ...previous,

                    [
                        responseId
                    ]:
                        loading,
                })
            );
        };


    // =====================================================
    // STAR
    // =====================================================

    const handleStarClick =
        async (
            responseId
        ) => {
            if (
                !authUser
                &&
                !isLoggedIn
            ) {
                siteToast.warning(
                    "Yechimga star berish uchun tizimga kiring.",
                    {
                        title:
                            "Kirish talab qilinadi",
                    }
                );

                return;
            }


            if (
                starLoadingIds[
                    responseId
                ]
            ) {
                return;
            }


            const currentResponses =
                responsesRef.current;


            const currentResponse =
                currentResponses.find(
                    (
                        response
                    ) =>
                        Number(
                            response?.id
                        )
                        ===
                        Number(
                            responseId
                        )
                );


            if (
                !currentResponse
            ) {
                siteToast.error(
                    "Ushbu yechim topilmadi.",
                    {
                        title:
                            "Yechim mavjud emas",
                    }
                );

                return;
            }


            const alreadyStarred =
                Boolean(
                    currentResponse
                        ?.star_by_user
                );


            const oldStarCount =
                getStarCount(
                    currentResponse
                );


            // =================================================
            // OPTIMISTIC UPDATE
            // =================================================

            const optimisticResponse = {
                ...currentResponse,

                star_by_user:
                    !alreadyStarred,

                total_stars:
                    alreadyStarred
                        ? Math.max(
                            oldStarCount -
                            1,
                            0
                        )
                        : oldStarCount +
                        1,
            };


            const optimisticList =
                currentResponses.map(
                    (
                        response
                    ) =>
                        Number(
                            response?.id
                        )
                        ===
                        Number(
                            responseId
                        )
                            ? optimisticResponse
                            : response
                );


            dispatch(
                getProblemResponseSuccess(
                    optimisticList
                )
            );


            setResponseStarLoading(
                responseId,
                true
            );


            try {
                if (
                    alreadyStarred
                ) {
                    await ProblemResponseService
                        .removeStar(
                            responseId
                        );


                    siteToast.info(
                        "Star olib tashlandi.",
                        {
                            title:
                                "Star bekor qilindi",

                            duration:
                                2200,
                        }
                    );

                } else {
                    await ProblemResponseService
                        .addStar(
                            responseId
                        );


                    siteToast.success(
                        "Yechimga star berildi.",
                        {
                            title:
                                "Star qo‘shildi",

                            duration:
                                2200,
                        }
                    );
                }

            } catch (
                error
            ) {
                console.error(
                    "Yechim star xatosi:",
                    error
                );


                /*
                    API xato bo‘lsa optimistic update rollback.
                */

                dispatch(
                    getProblemResponseSuccess(
                        currentResponses
                    )
                );


                siteToast.error(
                    getErrorMessage(
                        error,
                        "Star holatini o‘zgartirib bo‘lmadi."
                    ),
                    {
                        title:
                            "Star xatosi",

                        duration:
                            4500,
                    }
                );

            } finally {
                setResponseStarLoading(
                    responseId,
                    false
                );
            }
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        isLoading
        &&
        responsesArray.length ===
        0
    ) {
        return (
            <div
                className="
                    space-y-4
                "
            >
                {Array.from({
                    length:
                        3,
                }).map(
                    (
                        _,
                        index
                    ) => (
                        <ResponseSkeleton
                            key={
                                index
                            }
                        />
                    )
                )}
            </div>
        );
    }


    // =====================================================
    // ERROR + EMPTY
    // =====================================================

    if (
        responsesArray.length ===
        0
    ) {
        if (
            fetchError
        ) {
            return (
                <div
                    className="
                        rounded-[26px]
                        border
                        border-red-400/15
                        bg-red-500/[0.04]
                        px-6
                        py-10
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            grid
                            h-14
                            w-14
                            place-items-center
                            rounded-2xl
                            border
                            border-red-400/15
                            bg-red-500/[0.07]
                            text-red-300
                        "
                    >
                        <AlertTriangle
                            size={23}
                        />
                    </div>


                    <h3
                        className="
                            mt-4
                            text-lg
                            font-black
                            text-white
                        "
                    >
                        Yechimlarni yuklab bo‘lmadi
                    </h3>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-xs
                            font-medium
                            leading-6
                            text-gray-500
                        "
                    >
                        {
                            fetchError
                        }
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            getProblemResponses({
                                silent:
                                    false,
                            })
                        }
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/20
                            bg-red-500/[0.07]
                            px-4
                            py-2.5
                            text-xs
                            font-black
                            text-red-200
                            transition-all

                            hover:bg-red-500/[0.12]

                            active:scale-[0.97]
                        "
                    >
                        <RefreshCw
                            size={14}
                        />

                        Qayta urinish
                    </button>

                </div>
            );
        }


        return (
            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-dashed
                    border-cyan-400/15
                    bg-cyan-500/[0.025]
                    px-5
                    py-12
                    text-center
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-48
                        w-48
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-cyan-500/[0.05]
                        blur-[70px]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                    "
                >

                    <div
                        className="
                            mx-auto
                            grid
                            h-16
                            w-16
                            place-items-center
                            rounded-[20px]
                            border
                            border-cyan-400/15
                            bg-cyan-500/[0.06]
                            text-cyan-300
                        "
                    >
                        <Rocket
                            size={25}
                        />
                    </div>


                    <h3
                        className="
                            mt-5
                            text-xl
                            font-black
                            text-white
                        "
                    >
                        Hali yechim yo‘q
                    </h3>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-sm
                            font-medium
                            leading-6
                            text-gray-600
                        "
                    >
                        Birinchi bo‘lib o‘z yechimingizni yozing.
                        Tushunarli va sifatli javob community uchun
                        ko‘proq foyda beradi.
                    </p>


                    <div
                        className="
                            mx-auto
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/[0.06]
                            bg-white/[0.02]
                            px-3
                            py-1.5
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.13em]
                            text-gray-600
                        "
                    >
                        <Sparkles
                            size={11}
                        />

                        First solution
                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                space-y-4
            "
        >

            {/* =================================================
                BACKGROUND REFRESH STATUS
            ================================================== */}

            {isLoading && (
                <div
                    className="
                        flex
                        items-center
                        justify-end
                        gap-2
                        px-1
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.14em]
                        text-gray-700
                    "
                >
                    <Loader2
                        size={11}
                        className="
                            animate-spin
                            text-cyan-400
                        "
                    />

                    Yangilanmoqda
                </div>
            )}


            {/* =================================================
                FETCH WARNING
            ================================================== */}

            {fetchError && (
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-amber-400/10
                        bg-amber-500/[0.035]
                        p-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >
                        <AlertTriangle
                            size={15}
                            className="
                                mt-0.5
                                shrink-0
                                text-amber-300
                            "
                        />


                        <p
                            className="
                                text-[11px]
                                font-medium
                                leading-5
                                text-amber-100/60
                            "
                        >
                            Server bilan sinxronlashda muammo bo‘ldi.
                            Hozirgi ro‘yxat saqlab qolindi.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            getProblemResponses({
                                silent:
                                    true,
                            })
                        }
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-amber-400/15
                            bg-amber-500/[0.05]
                            px-3
                            py-2
                            text-[9px]
                            font-black
                            text-amber-200
                            transition

                            hover:bg-amber-500/[0.10]
                        "
                    >
                        <RefreshCw
                            size={12}
                        />

                        Yangilash
                    </button>

                </div>
            )}


            {/* =================================================
                RESPONSES
            ================================================== */}

            {sortedResponses.map(
                (
                    response,
                    index
                ) => {
                    const responseId =
                        response?.id;


                    const isCurrentSolution =
                        Boolean(
                            response
                                ?.is_selected
                        );


                    const isStarredByUser =
                        Boolean(
                            response
                                ?.star_by_user
                        );


                    const isStarLoading =
                        Boolean(
                            starLoadingIds[
                                responseId
                            ]
                        );


                    const username =
                        response
                            ?.user
                            ?.username
                        ||
                        "";


                    const authUserId =
                        authUser
                            ?.id;


                    const responseUserId =
                        response
                            ?.user
                            ?.id;


                    const isResponseOwner =
                        authUserId
                        &&
                        responseUserId
                            ? Number(
                                authUserId
                            )
                            ===
                            Number(
                                responseUserId
                            )
                            : Boolean(
                                authUser
                                    ?.username
                                &&
                                username
                                &&
                                authUser
                                    .username
                                ===
                                username
                            );


                    const showAcceptButton =
                        Boolean(
                            isOwner
                            &&
                            !isSolved
                            &&
                            !isCurrentSolution
                            &&
                            typeof onAcceptSolution ===
                            "function"
                        );


                    const userImage =
                        getImageUrl(
                            response
                                ?.user
                                ?.image
                        );


                    const languageName =
                        getLanguageName(
                            response
                        );


                    const starCount =
                        getStarCount(
                            response
                        );


                    const isFresh =
                        Number(
                            freshResponseId
                        )
                        ===
                        Number(
                            responseId
                        );


                    return (
                        <article
                            key={
                                responseId
                                ||
                                index
                            }
                            className={`
                                group
                                relative
                                overflow-hidden
                                rounded-[26px]
                                border
                                p-5
                                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                                transition-all
                                duration-300

                                md:p-6

                                ${
                                    isCurrentSolution
                                        ? `
                                            border-emerald-400/25
                                            bg-emerald-500/[0.055]
                                            shadow-emerald-500/[0.04]
                                        `
                                        : isFresh
                                            ? `
                                                border-cyan-400/30
                                                bg-cyan-500/[0.055]
                                                shadow-cyan-500/[0.08]
                                            `
                                            : `
                                                border-white/[0.07]
                                                bg-white/[0.022]

                                                hover:border-white/[0.12]
                                                hover:bg-white/[0.032]
                                            `
                                }
                            `}
                        >

                            {/* =========================================
                                GLOW
                            ========================================== */}

                            <div
                                className={`
                                    pointer-events-none
                                    absolute
                                    -right-24
                                    -top-24
                                    h-56
                                    w-56
                                    rounded-full
                                    blur-[90px]

                                    ${
                                        isCurrentSolution
                                            ? "bg-emerald-500/[0.09]"
                                            : "bg-cyan-500/[0.06]"
                                    }
                                `}
                            />


                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -bottom-28
                                    -left-24
                                    h-56
                                    w-56
                                    rounded-full
                                    bg-indigo-500/[0.05]
                                    blur-[90px]
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                "
                            >

                                {/* =====================================
                                    TOP LABELS
                                ====================================== */}

                                <div
                                    className="
                                        mb-4
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-full
                                            border
                                            border-white/[0.06]
                                            bg-black/15
                                            px-2.5
                                            py-1
                                            font-mono
                                            text-[8px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-700
                                        "
                                    >
                                        solution #
                                        {
                                            String(
                                                index +
                                                1
                                            ).padStart(
                                                2,
                                                "0"
                                            )
                                        }
                                    </span>


                                    {isCurrentSolution && (
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-emerald-400/20
                                                bg-emerald-500/[0.08]
                                                px-2.5
                                                py-1
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-emerald-300
                                            "
                                        >
                                            <CheckCircle2
                                                size={11}
                                            />

                                            Qabul qilingan yechim
                                        </span>
                                    )}


                                    {isFresh && (
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-cyan-400/20
                                                bg-cyan-500/[0.07]
                                                px-2.5
                                                py-1
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-cyan-300
                                            "
                                        >
                                            <Sparkles
                                                size={10}
                                            />

                                            Yangi
                                        </span>
                                    )}


                                    {isResponseOwner && (
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-indigo-400/15
                                                bg-indigo-500/[0.055]
                                                px-2.5
                                                py-1
                                                text-[8px]
                                                font-black
                                                text-indigo-300
                                            "
                                        >
                                            <UserRound
                                                size={10}
                                            />

                                            Sizning yechimingiz
                                        </span>
                                    )}

                                </div>


                                {/* =====================================
                                    HEADER
                                ====================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4

                                        md:flex-row
                                        md:items-start
                                        md:justify-between
                                    "
                                >

                                    {/* =================================
                                        USER
                                    ================================== */}

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3.5
                                        "
                                    >

                                        {username ? (
                                            <Link
                                                to={`/${username}/profile`}
                                                className="
                                                    shrink-0
                                                "
                                            >
                                                <img
                                                    src={
                                                        userImage
                                                        ||
                                                        UserImage
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event
                                                            .currentTarget
                                                            .onerror =
                                                            null;


                                                        event
                                                            .currentTarget
                                                            .src =
                                                            UserImage;
                                                    }}
                                                    className="
                                                        h-[50px]
                                                        w-[50px]
                                                        rounded-2xl
                                                        border
                                                        border-white/[0.08]
                                                        object-cover
                                                        shadow-lg
                                                        shadow-black/20
                                                        transition

                                                        group-hover:border-cyan-400/25
                                                    "
                                                    alt={`${username} avatari`}
                                                />
                                            </Link>
                                        ) : (
                                            <img
                                                src={
                                                    UserImage
                                                }
                                                className="
                                                    h-[50px]
                                                    w-[50px]
                                                    shrink-0
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.08]
                                                    object-cover
                                                "
                                                alt="User"
                                            />
                                        )}


                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            {username ? (
                                                <Link
                                                    to={`/${username}/profile`}
                                                    className="
                                                        block
                                                        truncate
                                                        text-sm
                                                        font-black
                                                        text-white
                                                        transition-colors

                                                        hover:text-cyan-300

                                                        sm:text-base
                                                    "
                                                >
                                                    @
                                                    {
                                                        username
                                                    }
                                                </Link>
                                            ) : (
                                                <p
                                                    className="
                                                        text-sm
                                                        font-black
                                                        text-white
                                                    "
                                                >
                                                    Noma’lum developer
                                                </p>
                                            )}


                                            <div
                                                className="
                                                    mt-1
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-x-2.5
                                                    gap-y-1
                                                    text-[10px]
                                                    font-bold
                                                    text-gray-600
                                                "
                                            >
                                                <span>
                                                    {
                                                        getSkillLevel(
                                                            response
                                                                ?.user
                                                                ?.skill_level
                                                        )
                                                    }
                                                </span>


                                                <span
                                                    className="
                                                        text-gray-800
                                                    "
                                                >
                                                    /
                                                </span>


                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                    "
                                                >
                                                    <Clock3
                                                        size={10}
                                                    />

                                                    {
                                                        getTimeLabel(
                                                            response
                                                                ?.created_at
                                                        )
                                                    }
                                                </span>
                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        ACTIONS
                                    ================================== */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        {showAcceptButton && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onAcceptSolution(
                                                        responseId
                                                    )
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-[37px]
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-emerald-400/20
                                                    bg-emerald-500/[0.07]
                                                    px-3.5
                                                    py-2
                                                    text-[10px]
                                                    font-black
                                                    text-emerald-300
                                                    transition-all

                                                    hover:border-emerald-400/30
                                                    hover:bg-emerald-500/[0.12]

                                                    active:scale-[0.97]
                                                "
                                            >
                                                <Award
                                                    size={14}
                                                />

                                                Qabul qilish
                                            </button>
                                        )}


                                        {isResponseOwner
                                            &&
                                            !isSolved && (
                                                <Link
                                                    to={`/problem/${id}/solution/${responseId}/edit`}
                                                    className="
                                                        inline-flex
                                                        min-h-[37px]
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        border
                                                        border-indigo-400/15
                                                        bg-indigo-500/[0.055]
                                                        px-3.5
                                                        py-2
                                                        text-[10px]
                                                        font-black
                                                        text-indigo-300
                                                        transition-all

                                                        hover:border-indigo-400/25
                                                        hover:bg-indigo-500/[0.10]

                                                        active:scale-[0.97]
                                                    "
                                                >
                                                    <Edit3
                                                        size={13}
                                                    />

                                                    Tahrirlash
                                                </Link>
                                            )
                                        }

                                    </div>

                                </div>


                                {/* =====================================
                                    ANSWER
                                ====================================== */}

                                <div
                                    className="
                                        mt-5
                                        rounded-[20px]
                                        border
                                        border-white/[0.06]
                                        bg-black/15
                                        p-4

                                        md:p-5
                                    "
                                >

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Check
                                            size={13}
                                            className="
                                                text-cyan-300
                                            "
                                        />


                                        <span
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-gray-600
                                            "
                                        >
                                            Qisqa yechim
                                        </span>
                                    </div>


                                    <p
                                        className="
                                            whitespace-pre-wrap
                                            break-words
                                            text-sm
                                            font-semibold
                                            leading-7
                                            text-gray-300

                                            md:text-[15px]
                                        "
                                    >
                                        {
                                            response
                                                ?.answer
                                            ||
                                            "Yechim matni kiritilmagan."
                                        }
                                    </p>

                                </div>


                                {/* =====================================
                                    DESCRIPTION
                                ====================================== */}

                                {response
                                    ?.description && (
                                        <div
                                            className="
                                                mt-3
                                                rounded-[20px]
                                                border
                                                border-indigo-400/10
                                                bg-indigo-500/[0.035]
                                                p-4

                                                md:p-5
                                            "
                                        >

                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <Sparkles
                                                    size={12}
                                                    className="
                                                        text-indigo-300
                                                    "
                                                />


                                                <span
                                                    className="
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.16em]
                                                        text-indigo-400
                                                    "
                                                >
                                                    Batafsil tushuntirish
                                                </span>
                                            </div>


                                            <p
                                                className="
                                                    whitespace-pre-wrap
                                                    break-words
                                                    text-sm
                                                    font-medium
                                                    leading-7
                                                    text-gray-400
                                                "
                                            >
                                                {
                                                    response
                                                        .description
                                                }
                                            </p>

                                        </div>
                                    )
                                }


                                {/* =====================================
                                    CODE
                                ====================================== */}

                                {response
                                    ?.code && (
                                        <div
                                            className="
                                                mt-4
                                                overflow-hidden
                                                rounded-[20px]
                                                border
                                                border-white/[0.07]
                                                bg-[#060a11]
                                                shadow-xl
                                                shadow-black/20
                                            "
                                        >

                                            {/* =========================
                                                CODE HEADER
                                            ========================== */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-3
                                                    border-b
                                                    border-white/[0.06]
                                                    bg-white/[0.018]
                                                    px-4
                                                    py-3

                                                    sm:flex-row
                                                    sm:items-center
                                                    sm:justify-between
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                bg-red-400/80
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                bg-amber-400/80
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                bg-emerald-400/80
                                                            "
                                                        />
                                                    </div>


                                                    <span
                                                        className="
                                                            h-5
                                                            w-px
                                                            bg-white/[0.06]
                                                        "
                                                    />


                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <Terminal
                                                            size={12}
                                                            className="
                                                                text-indigo-400
                                                            "
                                                        />


                                                        <span
                                                            className="
                                                                text-[9px]
                                                                font-black
                                                                text-gray-500
                                                            "
                                                        >
                                                            {
                                                                languageName
                                                            }
                                                        </span>
                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyCode(
                                                            response
                                                                .code
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        min-h-[34px]
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        border
                                                        border-indigo-400/15
                                                        bg-indigo-500/[0.055]
                                                        px-3
                                                        py-2
                                                        text-[9px]
                                                        font-black
                                                        text-indigo-300
                                                        transition-all

                                                        hover:border-indigo-400/25
                                                        hover:bg-indigo-500/[0.10]

                                                        active:scale-[0.97]
                                                    "
                                                >
                                                    <Clipboard
                                                        size={12}
                                                    />

                                                    Nusxalash
                                                </button>

                                            </div>


                                            {/* =========================
                                                CODE BODY
                                            ========================== */}

                                            <pre
                                                className="
                                                    max-h-[430px]
                                                    overflow-auto
                                                    p-4
                                                    font-mono
                                                    text-xs
                                                    leading-6
                                                    text-gray-300

                                                    sm:p-5
                                                    sm:text-[13px]
                                                "
                                            >
                                                <code>
                                                    {
                                                        response
                                                            .code
                                                    }
                                                </code>
                                            </pre>


                                            {/* =========================
                                                CODE FOOTER
                                            ========================== */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    border-t
                                                    border-white/[0.05]
                                                    bg-black/10
                                                    px-4
                                                    py-2.5
                                                "
                                            >
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.13em]
                                                        text-gray-700
                                                    "
                                                >
                                                    <Code2
                                                        size={10}
                                                    />

                                                    Solution code
                                                </span>


                                                <span
                                                    className="
                                                        font-mono
                                                        text-[8px]
                                                        font-bold
                                                        text-gray-700
                                                    "
                                                >
                                                    {
                                                        response
                                                            .code
                                                            .length
                                                    }
                                                    {" "}
                                                    chars
                                                </span>
                                            </div>

                                        </div>
                                    )
                                }


                                {/* =====================================
                                    FOOTER
                                ====================================== */}

                                <div
                                    className="
                                        mt-5
                                        flex
                                        flex-col
                                        gap-3
                                        border-t
                                        border-white/[0.055]
                                        pt-4

                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    {/* =================================
                                        STAR
                                    ================================== */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStarClick(
                                                responseId
                                            )
                                        }
                                        disabled={
                                            isStarLoading
                                        }
                                        className={`
                                            inline-flex
                                            min-h-[40px]
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            px-3.5
                                            py-2
                                            text-[10px]
                                            font-black
                                            transition-all

                                            active:scale-[0.97]

                                            disabled:cursor-not-allowed
                                            disabled:opacity-60

                                            ${
                                                isStarredByUser
                                                    ? `
                                                        border-yellow-400/20
                                                        bg-yellow-500/[0.07]
                                                        text-yellow-300

                                                        hover:bg-yellow-500/[0.11]
                                                    `
                                                    : `
                                                        border-white/[0.07]
                                                        bg-white/[0.02]
                                                        text-gray-500

                                                        hover:border-yellow-400/20
                                                        hover:bg-yellow-500/[0.06]
                                                        hover:text-yellow-300
                                                    `
                                            }
                                        `}
                                    >

                                        {isStarLoading ? (
                                            <Loader2
                                                size={14}
                                                className="
                                                    animate-spin
                                                "
                                            />
                                        ) : (
                                            <Star
                                                size={14}
                                                className={
                                                    isStarredByUser
                                                        ? "fill-yellow-300"
                                                        : ""
                                                }
                                            />
                                        )}


                                        <span>
                                            {isStarredByUser
                                                ? "Star berilgan"
                                                : "Star berish"}
                                        </span>


                                        <span
                                            className="
                                                inline-flex
                                                min-w-6
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-white/[0.06]
                                                bg-black/15
                                                px-1.5
                                                py-0.5
                                                text-[8px]
                                                text-current
                                            "
                                        >
                                            {
                                                starCount
                                            }
                                        </span>

                                    </button>


                                    {/* =================================
                                        DATE
                                    ================================== */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            text-[9px]
                                            font-bold
                                            text-gray-700

                                            sm:justify-end
                                        "
                                    >
                                        <Clock3
                                            size={11}
                                            className="
                                                text-cyan-500
                                            "
                                        />

                                        <span>
                                            {
                                                getTimeLabel(
                                                    response
                                                        ?.created_at
                                                )
                                            }
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </article>
                    );
                }
            )}

        </div>
    );
};


export default React.memo(
    ProblemResponse
);