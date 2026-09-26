// src/components/ProblemDetail.jsx

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Check,
    CheckCircle2,
    Clipboard,
    Clock3,
    Code2,
    Coins,
    Eye,
    Hammer,
    Loader2,
    Pencil,
    ShieldCheck,
    Sparkles,
    Star,
    Tags,
    Trash2,
    X,
} from "lucide-react";

import {
    deleteProblemStarFailure,
    deleteProblemStarStart,
    deleteProblemStarSuccess,

    getProblemDetailFailure,
    getProblemDetailStart,
    getProblemDetailSuccess,

    postProblemStarStart,
    postProblemStarSuccess,

    acceptSolutionStart,
    acceptSolutionSuccess,
    acceptSolutionFailure,
} from "../features/problems/Problems";

import ProblemService from "../services/problems";

import UserImage from "../assests/userImage.jpeg";

import ProblemResponse from "./ProblemResponse";

import ProblemResponseForm from "./ProblemResponseForm";

import CountdownTimer from "../utils/countdowntimer";

import timeAgo from "../utils/timeAgo";

import SimilarProblems from "./SimilarProblems";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

import {
    siteToast,
} from "./ui/AuthToast";


// =========================================================
// BACKEND
// =========================================================

const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL
    ||
    "http://127.0.0.1:8000";


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
        typeof data === "string"
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
        typeof data === "object"
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
            firstValue.length > 0
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


            if (
                parsed?.message
            ) {
                return String(
                    parsed.message
                );
            }


            if (
                parsed?.error
            ) {
                return String(
                    parsed.error
                );
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
// STACK COLOR HELPERS
// =========================================================

const DEFAULT_STACK_COLOR =
    "#64748B";


const getStackColor = (
    item
) => {

    const color =
        item?.color;


    if (
        typeof color === "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            color
        )
    ) {
        return color;
    }


    return DEFAULT_STACK_COLOR;
};


const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        (
            typeof color === "string"
            &&
            /^#[0-9A-Fa-f]{6}$/.test(
                color
            )
        )
            ? color
            : DEFAULT_STACK_COLOR;


    return `${safeColor}${alpha}`;
};


// =========================================================
// STACK TAG
// =========================================================

const StackTag = ({
    item,
    type = "language",
}) => {

    if (
        !item
    ) {
        return null;
    }


    const color =
        getStackColor(
            item
        );


    return (

        <span
            title={
                item?.name
            }

            className="
                group/tag
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-black
                transition-all
                duration-300

                hover:-translate-y-0.5
            "

            style={{
                color,

                borderColor:
                    withAlpha(
                        color,
                        "45"
                    ),

                backgroundColor:
                    withAlpha(
                        color,
                        "14"
                    ),

                boxShadow:
                    `0 8px 22px ${
                        withAlpha(
                            color,
                            "0D"
                        )
                    }`,
            }}
        >

            <span
                className="
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                "

                style={{
                    backgroundColor:
                        color,

                    boxShadow:
                        `0 0 9px ${
                            withAlpha(
                                color,
                                "AA"
                            )
                        }`,
                }}
            />


            <span
                className="
                    truncate
                "
            >
                {item?.name
                ||
                "Noma’lum"}
            </span>


            {type ===
                "technology"
                &&
                item?.category && (

                <span
                    className="
                        hidden
                        rounded-full
                        border
                        border-white/[0.07]
                        bg-black/10
                        px-1.5
                        py-0.5
                        font-mono
                        text-[8px]
                        uppercase
                        tracking-wider
                        opacity-60

                        sm:inline
                    "
                >
                    {item.category_display
                    ||
                    item.category}
                </span>
            )}

        </span>
    );
};


// =========================================================
// ACCEPT SOLUTION MODAL
// =========================================================

const AcceptSolutionConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    isProcessing = false,
}) => {

    // =====================================================
    // ESC + BODY LOCK
    // =====================================================

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            const previousOverflow =
                document
                    .body
                    .style
                    .overflow;


            document
                .body
                .style
                .overflow =
                "hidden";


            const handleKeyDown =
                (
                    event
                ) => {

                    if (
                        event.key ===
                            "Escape"
                        &&
                        !isProcessing
                    ) {

                        onClose?.();
                    }
                };


            window.addEventListener(
                "keydown",
                handleKeyDown
            );


            return () => {

                document
                    .body
                    .style
                    .overflow =
                    previousOverflow;


                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };

        },
        [
            isOpen,
            isProcessing,
            onClose,
        ]
    );


    if (
        !isOpen
    ) {
        return null;
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/80
                p-4
                backdrop-blur-md
            "

            onMouseDown={(
                event
            ) => {

                if (
                    event.target ===
                    event.currentTarget
                    &&
                    !isProcessing
                ) {

                    onClose?.();
                }
            }}
        >

            {/* =================================================
                GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    left-1/2
                    top-1/2
                    h-[420px]
                    w-[420px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-emerald-500/[0.08]
                    blur-[130px]
                "
            />


            {/* =================================================
                MODAL
            ================================================== */}

            <div
                role="dialog"

                aria-modal="true"

                aria-labelledby="accept-solution-title"

                className="
                    relative
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-[#0b1018]/95
                    shadow-[0_35px_110px_rgba(0,0,0,0.65)]
                    backdrop-blur-2xl
                "

                onMouseDown={(
                    event
                ) =>
                    event.stopPropagation()
                }
            >

                {/* DECORATION */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-56
                        w-56
                        rounded-full
                        bg-emerald-500/[0.10]
                        blur-[90px]
                    "
                />


                {/* CLOSE */}

                <button
                    type="button"

                    onClick={
                        onClose
                    }

                    disabled={
                        isProcessing
                    }

                    aria-label="Modalni yopish"

                    className="
                        absolute
                        right-4
                        top-4
                        z-20
                        grid
                        h-9
                        w-9
                        place-items-center
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-black/20
                        text-gray-600
                        transition

                        hover:bg-white/[0.05]
                        hover:text-white

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >

                    <X
                        size={16}
                    />

                </button>


                <div
                    className="
                        relative
                        z-10
                        px-6
                        pb-6
                        pt-9

                        sm:px-7
                        sm:pb-7
                    "
                >

                    {/* ICON */}

                    <div
                        className="
                            relative
                            mx-auto
                            grid
                            h-16
                            w-16
                            place-items-center
                            rounded-[20px]
                            border
                            border-emerald-400/15
                            bg-emerald-500/[0.06]
                            text-emerald-300
                        "
                    >

                        <div
                            className="
                                absolute
                                inset-3
                                rounded-xl
                                bg-emerald-400/[0.10]
                                blur-xl
                            "
                        />


                        {isProcessing ? (

                            <Loader2
                                size={25}
                                className="
                                    relative
                                    z-10
                                    animate-spin
                                "
                            />

                        ) : (

                            <CheckCircle2
                                size={26}
                                className="
                                    relative
                                    z-10
                                "
                            />
                        )}

                    </div>


                    {/* TITLE */}

                    <div
                        className="
                            mt-5
                            text-center
                        "
                    >

                        <div
                            className="
                                mb-2
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-emerald-400/10
                                bg-emerald-500/[0.04]
                                px-2.5
                                py-1
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-emerald-400
                            "
                        >

                            <ShieldCheck
                                size={11}
                            />

                            Accept solution

                        </div>


                        <h3
                            id="accept-solution-title"

                            className="
                                text-xl
                                font-black
                                tracking-tight
                                text-white

                                sm:text-2xl
                            "
                        >
                            {isProcessing
                                ? "Yechim qabul qilinmoqda..."
                                : "Yechimni qabul qilasizmi?"
                            }
                        </h3>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-sm
                                text-sm
                                font-medium
                                leading-6
                                text-gray-500
                            "
                        >
                            Ushbu javob muammoning{" "}

                            <span
                                className="
                                    font-black
                                    text-emerald-300
                                "
                            >
                                to‘g‘ri yechimi
                            </span>

                            {" "}sifatida belgilanadi.
                        </p>

                    </div>


                    {/* NOTICE */}

                    <div
                        className="
                            mt-5
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-amber-400/10
                            bg-amber-500/[0.035]
                            p-4
                        "
                    >

                        <AlertTriangle
                            size={16}
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
                                text-gray-600
                            "
                        >
                            Muammo yechilgan deb belgilangandan keyin
                            yangi yechim yuborish yopiladi.
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div
                        className="
                            mt-6
                            grid
                            gap-2.5

                            sm:grid-cols-2
                        "
                    >

                        <button
                            type="button"

                            onClick={
                                onClose
                            }

                            disabled={
                                isProcessing
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-4
                                py-2.5
                                text-xs
                                font-black
                                text-gray-400
                                transition

                                hover:bg-white/[0.05]
                                hover:text-white

                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >

                            <X
                                size={15}
                            />

                            Bekor qilish

                        </button>


                        <button
                            type="button"

                            onClick={
                                onConfirm
                            }

                            disabled={
                                isProcessing
                            }

                            className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-emerald-400/20
                                bg-emerald-600
                                px-4
                                py-2.5
                                text-xs
                                font-black
                                text-white
                                shadow-lg
                                shadow-emerald-600/15
                                transition

                                hover:bg-emerald-500

                                active:scale-[0.97]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {isProcessing ? (

                                <>
                                    <Loader2
                                        size={15}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Qabul qilinmoqda...
                                </>

                            ) : (

                                <>
                                    <Check
                                        size={15}
                                    />

                                    Ha, qabul qilish
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};


// =========================================================
// OWNER ACTIONS
// =========================================================

const OwnerActions = ({
    onEdit,
    onDelete,
    isDeleting,
}) => {

    return (

        <div
            className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-2xl
                border
                border-white/[0.07]
                bg-black/20
                p-1.5
                shadow-lg
                shadow-black/20
                backdrop-blur-xl
            "
        >

            <div
                className="
                    hidden
                    items-center
                    gap-2
                    px-3
                    font-mono
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-gray-600

                    lg:flex
                "
            >

                <Sparkles
                    size={13}
                    className="
                        text-cyan-400
                    "
                />

                Owner tools

            </div>


            <span
                className="
                    hidden
                    h-6
                    w-px
                    bg-white/[0.07]

                    lg:block
                "
            />


            {/* EDIT */}

            <button
                type="button"

                onClick={
                    onEdit
                }

                disabled={
                    isDeleting
                }

                className="
                    group
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-transparent
                    px-3.5
                    py-2
                    text-xs
                    font-black
                    text-indigo-300
                    transition-all

                    hover:border-indigo-400/20
                    hover:bg-indigo-500/[0.08]
                    hover:text-indigo-200

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >

                <Pencil
                    size={15}
                />

                Tahrirlash

            </button>


            {/* DELETE */}

            <button
                type="button"

                onClick={
                    onDelete
                }

                disabled={
                    isDeleting
                }

                className="
                    group
                    inline-flex
                    min-h-[38px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-transparent
                    px-3.5
                    py-2
                    text-xs
                    font-black
                    text-red-400
                    transition-all

                    hover:border-red-400/20
                    hover:bg-red-500/[0.08]
                    hover:text-red-300

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >

                {isDeleting ? (

                    <Loader2
                        size={15}
                        className="
                            animate-spin
                        "
                    />

                ) : (

                    <Trash2
                        size={15}
                    />
                )}


                {isDeleting
                    ? "O‘chirilmoqda"
                    : "O‘chirish"
                }

            </button>

        </div>
    );
};


// =========================================================
// PROBLEM DETAIL
// =========================================================

const ProblemDetail = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const {
        id,
    } = useParams();


    const navigate =
        useNavigate();


    const dispatch =
        useDispatch();


    // =====================================================
    // REFS
    // =====================================================

    const responseFormRef =
        useRef(
            null
        );


    const responsesSectionRef =
        useRef(
            null
        );


    // =====================================================
    // REDUX
    // =====================================================

    const {
        problemDetail,
        isLoading,
    } = useSelector(
        (
            state
        ) =>
            state.problem
    );


    const {
        user,
        isLoggedIn,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        copied,
        setCopied,
    ] = useState(
        false
    );


    const [
        detailError,
        setDetailError,
    ] = useState(
        ""
    );


    const [
        isStarLoading,
        setIsStarLoading,
    ] = useState(
        false
    );


    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    const [
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    const [
        isAcceptModalOpen,
        setIsAcceptModalOpen,
    ] = useState(
        false
    );


    const [
        solutionToAccept,
        setSolutionToAccept,
    ] = useState(
        null
    );


    const [
        isAcceptingSolution,
        setIsAcceptingSolution,
    ] = useState(
        false
    );


    // =====================================================
    // SOLUTION REFRESH KEY
    // =====================================================

    const [
        responsesRefreshKey,
        setResponsesRefreshKey,
    ] = useState(
        0
    );


    // =====================================================
    // OWNER
    // =====================================================

    const isOwner = (
        user?.id
        &&
        problemDetail?.user?.id
    )
        ? (
            Number(
                user.id
            )
            ===
            Number(
                problemDetail.user.id
            )
        )
        : (
            Boolean(
                user?.username
                &&
                problemDetail
                    ?.user
                    ?.username
            )
            &&
            String(
                user.username
            )
            ===
            String(
                problemDetail
                    .user
                    .username
            )
        );


    // =====================================================
    // GET DETAIL
    // =====================================================

    const getProblemDetail =
        useCallback(
            async () => {

                if (
                    !id
                ) {
                    return;
                }


                setDetailError(
                    ""
                );


                dispatch(
                    getProblemDetailStart()
                );


                try {

                    const response =
                        await ProblemService
                            .getProblemDetail(
                                id
                            );


                    dispatch(
                        getProblemDetailSuccess(
                            response
                        )
                    );


                    return response;

                } catch (
                    error
                ) {

                    console.error(
                        "Problem detail olishda xatolik:",
                        error
                    );


                    const message =
                        getErrorMessage(
                            error,
                            "Muammoni yuklashda xatolik yuz berdi."
                        );


                    setDetailError(
                        message
                    );


                    dispatch(
                        getProblemDetailFailure(
                            message
                        )
                    );


                    throw error;
                }
            },
            [
                id,
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            getProblemDetail()
                .catch(
                    () => {
                        // Error yuqorida boshqarildi.
                    }
                );

        },
        [
            getProblemDetail,
        ]
    );


    // =====================================================
    // NEW SOLUTION CREATED
    // =====================================================

    const handleSolutionCreated =
        useCallback(
            async (
                createdSolution
            ) => {

                try {

                    await getProblemDetail();


                    setResponsesRefreshKey(
                        (
                            previous
                        ) =>
                            previous + 1
                    );


                    window.requestAnimationFrame(
                        () => {

                            window.requestAnimationFrame(
                                () => {

                                    responsesSectionRef
                                        .current
                                        ?.scrollIntoView({
                                            behavior:
                                                "smooth",

                                            block:
                                                "start",
                                        });
                                }
                            );
                        }
                    );


                    return createdSolution;

                } catch (
                    error
                ) {

                    console.error(
                        "Yechim yuborilgandan keyin sahifani yangilashda xatolik:",
                        error
                    );


                    setResponsesRefreshKey(
                        (
                            previous
                        ) =>
                            previous + 1
                    );


                    siteToast.warning(
                        "Yechim saqlandi, lekin sahifa ma’lumotlarini to‘liq yangilab bo‘lmadi.",
                        {
                            title:
                                "Yechim saqlandi",

                            duration:
                                4000,
                        }
                    );


                    return createdSolution;
                }
            },
            [
                getProblemDetail,
            ]
        );


    // =====================================================
    // COPY CODE
    // =====================================================

    const handleCopy =
        async () => {

            const code =
                problemDetail
                    ?.code;


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


                    document
                        .body
                        .appendChild(
                            textarea
                        );


                    textarea.select();


                    document.execCommand(
                        "copy"
                    );


                    textarea.remove();
                }


                setCopied(
                    true
                );


                siteToast.success(
                    "Kod clipboardga nusxalandi.",
                    {
                        title:
                            "Nusxalandi",

                        duration:
                            2200,
                    }
                );


                window.setTimeout(
                    () => {

                        setCopied(
                            false
                        );

                    },
                    2000
                );


            } catch (
                error
            ) {

                console.error(
                    "Copy xato:",
                    error
                );


                siteToast.error(
                    "Kodni nusxalab bo‘lmadi.",
                    {
                        title:
                            "Nusxalash xatosi",
                    }
                );
            }
        };


    // =====================================================
    // ADD STAR
    // =====================================================

    const handleStarClick =
        async (
            problemId
        ) => {

            if (
                !isLoggedIn
                ||
                !user
            ) {

                siteToast.warning(
                    "Star berish uchun avval tizimga kiring.",
                    {
                        title:
                            "Kirish talab qilinadi",
                    }
                );


                return;
            }


            if (
                problemDetail
                    ?.star_by_user
                ||
                isStarLoading
            ) {
                return;
            }


            setIsStarLoading(
                true
            );


            dispatch(
                postProblemStarStart()
            );


            try {

                const response =
                    await ProblemService
                        .addStar(
                            problemId
                        );


                dispatch(
                    postProblemStarSuccess(
                        response
                    )
                );


                siteToast.success(
                    "Muammoga star berildi.",
                    {
                        title:
                            "Star berildi",

                        duration:
                            2500,
                    }
                );


                await getProblemDetail();


            } catch (
                error
            ) {

                console.error(
                    "Star qo‘shishda xatolik:",
                    error
                );


                siteToast.error(
                    getErrorMessage(
                        error,
                        "Star berishda xatolik yuz berdi."
                    ),
                    {
                        title:
                            "Star berilmadi",

                        duration:
                            4200,
                    }
                );


            } finally {

                setIsStarLoading(
                    false
                );
            }
        };


    // =====================================================
    // REMOVE STAR
    // =====================================================

    const handleStarDeleteClick =
        async (
            problemId
        ) => {

            if (
                !problemDetail
                    ?.star_by_user
                ||
                isStarLoading
            ) {
                return;
            }


            setIsStarLoading(
                true
            );


            dispatch(
                deleteProblemStarStart()
            );


            try {

                const response =
                    await ProblemService
                        .removeStar(
                            problemId
                        );


                dispatch(
                    deleteProblemStarSuccess(
                        response
                    )
                );


                siteToast.info(
                    "Star olib tashlandi.",
                    {
                        title:
                            "Star bekor qilindi",

                        duration:
                            2300,
                    }
                );


                await getProblemDetail();


            } catch (
                error
            ) {

                const message =
                    getErrorMessage(
                        error,
                        "Starni olib tashlashda xatolik yuz berdi."
                    );


                dispatch(
                    deleteProblemStarFailure(
                        message
                    )
                );


                console.error(
                    "Star olib tashlashda xatolik:",
                    error
                );


                siteToast.error(
                    message,
                    {
                        title:
                            "Star olib tashlanmadi",

                        duration:
                            4200,
                    }
                );


            } finally {

                setIsStarLoading(
                    false
                );
            }
        };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEditProblem =
        () => {

            if (
                !isOwner
                ||
                isDeleting
            ) {
                return;
            }


            navigate(
                `/problem/${id}/edit`
            );
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleOpenDeleteModal =
        () => {

            if (
                !isOwner
                ||
                isDeleting
            ) {
                return;
            }


            setIsDeleteModalOpen(
                true
            );
        };


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
        };


    const handleConfirmDelete =
        async () => {

            if (
                !id
                ||
                isDeleting
            ) {
                return;
            }


            setIsDeleting(
                true
            );


            const problemTitle =
                problemDetail
                    ?.problem
                ||
                "Muammo";


            const toastId =
                siteToast.loading(
                    `"${problemTitle}" o‘chirilmoqda...`,
                    {
                        title:
                            "Muammo o‘chirilmoqda",
                    }
                );


            try {

                await ProblemService
                    .deleteProblem(
                        id
                    );


                setIsDeleteModalOpen(
                    false
                );


                siteToast.success(
                    `"${problemTitle}" muvaffaqiyatli o‘chirildi.`,
                    {
                        id:
                            toastId,

                        title:
                            "Muammo o‘chirildi",

                        duration:
                            3500,
                    }
                );


                navigate(
                    "/problems",
                    {
                        replace:
                            true,
                    }
                );


            } catch (
                error
            ) {

                console.error(
                    "Muammoni o‘chirishda xatolik:",
                    error
                );


                siteToast.error(
                    getErrorMessage(
                        error,
                        "Muammoni o‘chirishda xatolik yuz berdi."
                    ),
                    {
                        id:
                            toastId,

                        title:
                            "Muammo o‘chirilmadi",

                        duration:
                            5000,
                    }
                );


            } finally {

                setIsDeleting(
                    false
                );
            }
        };


    // =====================================================
    // WORK
    // =====================================================

    const handleWorkClick =
        () => {

            if (
                problemDetail
                    ?.is_solved
            ) {

                siteToast.info(
                    "Bu muammo allaqachon yechilgan.",
                    {
                        title:
                            "Muammo yopilgan",
                    }
                );


                return;
            }


            responseFormRef
                .current
                ?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start",
                });
        };


    // =====================================================
    // ACCEPT SOLUTION
    // =====================================================

    const handleAcceptSolution =
        (
            solutionId
        ) => {

            if (
                !isOwner
            ) {

                siteToast.warning(
                    "Faqat muammo egasi yechimni qabul qila oladi.",
                    {
                        title:
                            "Ruxsat yo‘q",
                    }
                );


                return;
            }


            if (
                problemDetail
                    ?.is_solved
            ) {

                siteToast.info(
                    "Bu muammo allaqachon yechilgan.",
                    {
                        title:
                            "Muammo yechilgan",
                    }
                );


                return;
            }


            if (
                !solutionId
            ) {

                siteToast.error(
                    "Yechim ID topilmadi.",
                    {
                        title:
                            "Yechim tanlanmadi",
                    }
                );


                return;
            }


            setSolutionToAccept(
                solutionId
            );


            setIsAcceptModalOpen(
                true
            );
        };


    const handleCloseAcceptModal =
        useCallback(
            () => {

                if (
                    isAcceptingSolution
                ) {
                    return;
                }


                setIsAcceptModalOpen(
                    false
                );


                setSolutionToAccept(
                    null
                );

            },
            [
                isAcceptingSolution,
            ]
        );


    const handleConfirmAcceptSolution =
        async () => {

            if (
                !solutionToAccept
                ||
                isAcceptingSolution
            ) {
                return;
            }


            setIsAcceptingSolution(
                true
            );


            dispatch(
                acceptSolutionStart()
            );


            const toastId =
                siteToast.loading(
                    "Tanlangan yechim qabul qilinmoqda...",
                    {
                        title:
                            "Yechim tekshirilmoqda",
                    }
                );


            try {

                const response =
                    await ProblemService
                        .acceptSolution(
                            id,
                            solutionToAccept
                        );


                dispatch(
                    acceptSolutionSuccess(
                        response
                    )
                );


                setIsAcceptModalOpen(
                    false
                );


                setSolutionToAccept(
                    null
                );


                siteToast.success(
                    "Yechim muvaffaqiyatli qabul qilindi.",
                    {
                        id:
                            toastId,

                        title:
                            "Muammo yechildi",

                        duration:
                            3500,
                    }
                );


                await getProblemDetail();


                setResponsesRefreshKey(
                    (
                        previous
                    ) =>
                        previous + 1
                );


            } catch (
                error
            ) {

                const message =
                    getErrorMessage(
                        error,
                        "Yechimni qabul qilishda xato yuz berdi."
                    );


                dispatch(
                    acceptSolutionFailure(
                        message
                    )
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Yechim qabul qilinmadi",

                        duration:
                            5000,
                    }
                );


            } finally {

                setIsAcceptingSolution(
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
        !problemDetail
    ) {

        return (

            <main
                className="
                    min-h-screen
                    bg-[#050816]
                    px-4
                    py-20
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-4xl
                        rounded-[2rem]
                        border
                        border-white/10
                        bg-[#0d1117]
                        p-10
                        text-center
                        shadow-2xl
                        shadow-black/30
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-5
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-cyan-300
                        "
                    >

                        <Loader2
                            size={27}
                            className="
                                animate-spin
                            "
                        />

                    </div>


                    <h2
                        className="
                            text-xl
                            font-black
                            text-white
                        "
                    >
                        Muammo yuklanmoqda...
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                        "
                    >
                        Iltimos, bir necha soniya kuting.
                    </p>

                </div>

            </main>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        detailError
        &&
        !problemDetail
    ) {

        return (

            <main
                className="
                    min-h-screen
                    bg-[#050816]
                    px-4
                    py-28
                    text-white
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-xl
                        rounded-[28px]
                        border
                        border-red-400/20
                        bg-[#0d1117]
                        p-8
                        text-center
                        shadow-2xl
                        shadow-black/30
                    "
                >

                    <div
                        className="
                            mx-auto
                            grid
                            h-16
                            w-16
                            place-items-center
                            rounded-2xl
                            border
                            border-red-400/20
                            bg-red-500/[0.08]
                            text-red-300
                        "
                    >

                        <AlertTriangle
                            size={27}
                        />

                    </div>


                    <h2
                        className="
                            mt-5
                            text-2xl
                            font-black
                        "
                    >
                        Muammoni yuklab bo‘lmadi
                    </h2>


                    <p
                        className="
                            mt-3
                            text-sm
                            font-medium
                            leading-6
                            text-red-200/70
                        "
                    >
                        {detailError}
                    </p>


                    <button
                        type="button"

                        onClick={() =>
                            getProblemDetail()
                                .catch(
                                    () => {}
                                )
                        }

                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/20
                            bg-red-600
                            px-5
                            py-2.5
                            text-xs
                            font-black
                            text-white
                            transition

                            hover:bg-red-500
                        "
                    >
                        Qayta urinish
                    </button>

                </div>

            </main>
        );
    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        !problemDetail
    ) {
        return null;
    }


    // =====================================================
    // DERIVED
    // =====================================================

    const authorImage =
        getImageUrl(
            problemDetail
                ?.user
                ?.image
        );


    const responseCount =
        Number(
            problemDetail
                ?.total_responses

            ??

            problemDetail
                ?.response_count

            ??

            problemDetail
                ?.responses_count

            ??

            problemDetail
                ?.responses
                ?.length

            ??

            0
        );


    const problemLanguages =
        Array.isArray(
            problemDetail
                ?.language_data
        )
            ? problemDetail
                .language_data
                .filter(
                    Boolean
                )

            : [];


    const problemTechnologies =
        Array.isArray(
            problemDetail
                ?.technology_data
        )
            ? problemDetail
                .technology_data
                .filter(
                    Boolean
                )

            : [];


    // =====================================================
    // JSX
    // =====================================================

    return (

        <>

            <main
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-[#050816]
                    px-4
                    py-8
                    text-white

                    lg:py-12
                "
            >

                {/* =================================================
                    BACKGROUND
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)]
                        bg-[size:60px_60px]
                        [mask-image:radial-gradient(circle_at_center,black_0%,transparent_76%)]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-40
                        top-24
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-cyan-500/[0.06]
                        blur-[130px]
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-40
                        top-[30%]
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-indigo-500/[0.08]
                        blur-[130px]
                    "
                />


                {/* =================================================
                    CONTAINER
                ================================================== */}

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        w-full
                        max-w-[1500px]
                    "
                >

                    <div
                        className="
                            grid
                            gap-8

                            lg:grid-cols-12
                            lg:gap-10
                        "
                    >

                        {/* =================================================
                            MAIN
                        ================================================== */}

                        <div
                            className="
                                min-w-0

                                lg:col-span-8
                            "
                        >

                            {/* =================================================
                                PROBLEM CARD
                            ================================================== */}

                            <section
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-[2rem]
                                    border
                                    border-white/10
                                    bg-[#0d1117]
                                    p-5
                                    shadow-2xl
                                    shadow-black/30

                                    md:p-7

                                    lg:p-8
                                "
                            >

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -right-24
                                        -top-24
                                        h-72
                                        w-72
                                        rounded-full
                                        bg-cyan-500/10
                                        blur-[100px]
                                    "
                                />


                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -bottom-28
                                        -left-28
                                        h-72
                                        w-72
                                        rounded-full
                                        bg-indigo-500/10
                                        blur-[100px]
                                    "
                                />


                                <div
                                    className="
                                        relative
                                        z-10
                                    "
                                >

                                    {/* =========================================
                                        STATUS BADGES
                                    ========================================== */}

                                    <div
                                        className="
                                            mb-5
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        {problemDetail
                                            ?.is_solved ? (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    border-green-400/30
                                                    bg-green-500/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-green-300
                                                "
                                            >

                                                <CheckCircle2
                                                    size={14}
                                                />

                                                Yechilgan

                                            </span>

                                        ) : (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    border-red-400/30
                                                    bg-red-500/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-red-300
                                                "
                                            >

                                                <Clock3
                                                    size={14}
                                                />

                                                Yechilmagan

                                            </span>
                                        )}


                                        {problemDetail
                                            ?.star_by_user && (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    border-yellow-400/30
                                                    bg-yellow-400/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-yellow-300
                                                "
                                            >

                                                <Star
                                                    size={13}
                                                    className="
                                                        fill-yellow-300
                                                    "
                                                />

                                                Siz star berdingiz

                                            </span>
                                        )}


                                        {problemDetail
                                            ?.is_urgent && (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    border-amber-400/30
                                                    bg-amber-500/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-amber-300
                                                "
                                            >
                                                ⚡ Tezkor
                                            </span>
                                        )}


                                        {Number(
                                            problemDetail
                                                ?.offered_coins
                                            ||
                                            0
                                        ) > 0 && (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    border-yellow-400/30
                                                    bg-yellow-400/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-yellow-300
                                                "
                                            >

                                                <Coins
                                                    size={14}
                                                />


                                                {problemDetail
                                                    .offered_coins}

                                                {" "}FCoin

                                            </span>
                                        )}

                                    </div>


                                    {/* =========================================
                                        LANGUAGES
                                    ========================================== */}

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
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-white/[0.06]
                                                bg-white/[0.025]
                                                px-2.5
                                                py-1.5
                                                font-mono
                                                text-[9px]
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-gray-600
                                            "
                                        >

                                            <Code2
                                                size={12}
                                            />

                                            Til

                                        </span>


                                        {problemLanguages.length > 0 ? (

                                            problemLanguages.map(
                                                (
                                                    language,
                                                    index
                                                ) => (

                                                    <StackTag
                                                        key={
                                                            language?.id
                                                            ||
                                                            language?.name
                                                            ||
                                                            `language-${index}`
                                                        }

                                                        item={
                                                            language
                                                        }

                                                        type="language"
                                                    />
                                                )
                                            )

                                        ) : (

                                            <span
                                                className="
                                                    rounded-full
                                                    border
                                                    border-white/[0.06]
                                                    bg-white/[0.025]
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-bold
                                                    text-gray-600
                                                "
                                            >
                                                Til belgilanmagan
                                            </span>
                                        )}

                                    </div>


                                    {/* =========================================
                                        TITLE + OWNER
                                    ========================================== */}

                                    <div
                                        className="
                                            mb-6
                                            flex
                                            flex-col
                                            gap-5

                                            xl:flex-row
                                            xl:items-start
                                            xl:justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <p
                                                className="
                                                    mb-2
                                                    font-mono
                                                    text-[11px]
                                                    font-black
                                                    uppercase
                                                    tracking-[0.3em]
                                                    text-gray-600
                                                "
                                            >
                                                fsociety://problem/
                                                {problemDetail?.id}
                                            </p>


                                            <h1
                                                className="
                                                    break-words
                                                    text-3xl
                                                    font-black
                                                    leading-tight
                                                    text-white

                                                    md:text-4xl

                                                    lg:text-5xl
                                                "
                                            >
                                                {problemDetail?.problem}
                                            </h1>

                                        </div>


                                        {isOwner && (

                                            <div
                                                className="
                                                    shrink-0
                                                "
                                            >

                                                <OwnerActions
                                                    onEdit={
                                                        handleEditProblem
                                                    }

                                                    onDelete={
                                                        handleOpenDeleteModal
                                                    }

                                                    isDeleting={
                                                        isDeleting
                                                    }
                                                />

                                            </div>
                                        )}

                                    </div>


                                    {/* =========================================
                                        AUTHOR
                                    ========================================== */}

                                    <div
                                        className="
                                            mb-7
                                            flex
                                            flex-col
                                            gap-4
                                            rounded-3xl
                                            border
                                            border-white/10
                                            bg-white/[0.035]
                                            p-4
                                            text-sm
                                            text-gray-400

                                            sm:flex-row
                                            sm:items-center
                                        "
                                    >

                                        <img
                                            src={
                                                authorImage
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
                                                h-12
                                                w-12
                                                shrink-0
                                                rounded-2xl
                                                border
                                                border-cyan-400/20
                                                object-cover
                                            "

                                            alt={
                                                problemDetail
                                                    ?.user
                                                    ?.username
                                                ||
                                                "Avatar"
                                            }
                                        />


                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            {problemDetail
                                                ?.user
                                                ?.username ? (

                                                <Link
                                                    to={`/${problemDetail.user.username}/profile/`}

                                                    className="
                                                        block
                                                        truncate
                                                        text-base
                                                        font-black
                                                        text-white
                                                        transition

                                                        hover:text-cyan-300
                                                    "
                                                >
                                                    @{problemDetail
                                                        .user
                                                        .username}
                                                </Link>

                                            ) : (

                                                <p
                                                    className="
                                                        text-base
                                                        font-black
                                                        text-white
                                                    "
                                                >
                                                    Noma’lum foydalanuvchi
                                                </p>
                                            )}


                                            <div
                                                className="
                                                    mt-1
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-x-3
                                                    gap-y-1
                                                    text-xs
                                                    font-bold
                                                    text-gray-500
                                                "
                                            >

                                                {problemDetail
                                                    ?.created_at && (

                                                    <span>
                                                        {timeAgo(
                                                            problemDetail
                                                                .created_at
                                                        )}

                                                        {" "}so‘ralgan
                                                    </span>
                                                )}


                                                <span
                                                    className="
                                                        hidden
                                                        text-gray-700

                                                        sm:inline
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

                                                    <Eye
                                                        size={12}
                                                    />


                                                    {problemDetail
                                                        ?.total_views
                                                    ||
                                                    0}

                                                    {" "}marta ko‘rilgan

                                                </span>


                                                <span
                                                    className="
                                                        hidden
                                                        text-gray-700

                                                        sm:inline
                                                    "
                                                >
                                                    /
                                                </span>


                                                <span
                                                    className="
                                                        text-cyan-400
                                                    "
                                                >
                                                    {responseCount}
                                                    {" "}ta yechim
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =========================================
                                        URGENT INFO
                                    ========================================== */}

                                    {(
                                        problemDetail
                                            ?.is_urgent

                                        ||

                                        Number(
                                            problemDetail
                                                ?.offered_coins
                                            ||
                                            0
                                        ) > 0

                                        ||

                                        problemDetail
                                            ?.deadline

                                    ) && (

                                        <div
                                            className={`
                                                mb-8
                                                flex
                                                flex-col
                                                items-stretch
                                                justify-between
                                                gap-5
                                                rounded-3xl
                                                border
                                                p-5

                                                lg:flex-row
                                                lg:items-center

                                                ${
                                                    problemDetail
                                                        ?.is_urgent

                                                        ? `
                                                            border-red-400/25
                                                            bg-red-500/[0.07]
                                                            shadow-xl
                                                            shadow-red-500/[0.04]
                                                        `

                                                        : `
                                                            border-white/10
                                                            bg-white/[0.035]
                                                        `
                                                }
                                            `}
                                        >

                                            {/* LEFT INFO */}

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >

                                                {/* BADGES */}

                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    {problemDetail
                                                        ?.is_urgent && (

                                                        <div
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-full
                                                                border
                                                                border-red-400/30
                                                                bg-red-500/10
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                font-black
                                                                text-red-300
                                                            "
                                                        >

                                                            <span
                                                                aria-hidden="true"
                                                            >
                                                                ⚡
                                                            </span>

                                                            Favqulodda muammo

                                                        </div>
                                                    )}


                                                    {Number(
                                                        problemDetail
                                                            ?.offered_coins
                                                        ||
                                                        0
                                                    ) > 0 && (

                                                        <div
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-full
                                                                border
                                                                border-yellow-400/30
                                                                bg-yellow-400/10
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                font-black
                                                                text-yellow-300
                                                            "
                                                        >

                                                            <Coins
                                                                size={15}
                                                            />


                                                            <span>
                                                                Mukofot:{" "}
                                                                {problemDetail
                                                                    .offered_coins}
                                                                {" "}FCoin
                                                            </span>

                                                        </div>
                                                    )}

                                                </div>


                                                {/* =================================
                                                    UNIVERSAL COUNTDOWN
                                                ================================== */}

                                                {problemDetail
                                                    ?.deadline && (

                                                    <div
                                                        className="
                                                            mt-4
                                                            w-fit
                                                            max-w-full
                                                            rounded-[22px]
                                                            border
                                                            border-indigo-400/20
                                                            bg-indigo-500/[0.055]
                                                            p-3.5
                                                            shadow-lg
                                                            shadow-indigo-500/[0.04]
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                mb-2.5
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <Clock3
                                                                size={14}
                                                                className="
                                                                    shrink-0
                                                                    text-indigo-300
                                                                "
                                                            />


                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    font-black
                                                                    uppercase
                                                                    tracking-[0.14em]
                                                                    text-indigo-300/70
                                                                "
                                                            >
                                                                Muddat
                                                            </span>

                                                        </div>


                                                        <CountdownTimer
                                                            targetDate={
                                                                problemDetail
                                                                    .deadline
                                                            }

                                                            variant="cards"

                                                            tone="emerald"

                                                            size="sm"

                                                            showLabel={
                                                                false
                                                            }

                                                            showIcon={
                                                                false
                                                            }

                                                            expiredText="Muammo muddati tugagan"
                                                        />


                                                        <div
                                                            className="
                                                                mt-2.5
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                text-[8px]
                                                                font-semibold
                                                                text-indigo-300/40
                                                            "
                                                        >

                                                            <Clock3
                                                                size={10}
                                                                className="
                                                                    shrink-0
                                                                "
                                                            />

                                                            Muammo muddati tugashigacha qolgan vaqt

                                                        </div>

                                                    </div>
                                                )}

                                            </div>


                                            {/* WORK BUTTON */}

                                            {!problemDetail
                                                ?.is_solved && (

                                                <button
                                                    type="button"

                                                    onClick={
                                                        handleWorkClick
                                                    }

                                                    className="
                                                        inline-flex
                                                        min-h-[46px]
                                                        w-full
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-2xl
                                                        bg-gradient-to-r
                                                        from-cyan-500
                                                        to-indigo-600
                                                        px-6
                                                        py-3
                                                        text-sm
                                                        font-black
                                                        text-white
                                                        shadow-lg
                                                        shadow-cyan-500/20
                                                        transition-all

                                                        hover:-translate-y-0.5
                                                        hover:shadow-cyan-500/40

                                                        active:translate-y-0
                                                        active:scale-[0.98]

                                                        lg:w-auto
                                                    "
                                                >

                                                    <Hammer
                                                        size={16}
                                                    />

                                                    Men ishlayman!

                                                </button>
                                            )}

                                        </div>
                                    )}


                                    {/* =========================================
                                        CONTENT
                                    ========================================== */}

                                    <div
                                        className="
                                            flex
                                            gap-3

                                            md:gap-5
                                        "
                                    >

                                        {/* STAR COLUMN */}

                                        <aside
                                            className="
                                                shrink-0
                                            "
                                        >

                                            <div
                                                className="
                                                    sticky
                                                    top-28
                                                    flex
                                                    w-[58px]
                                                    flex-col
                                                    items-center
                                                    rounded-3xl
                                                    border
                                                    border-white/10
                                                    bg-[#111827]/90
                                                    p-2
                                                    shadow-xl
                                                    shadow-black/20

                                                    sm:w-[70px]
                                                    sm:p-3
                                                "
                                            >

                                                {/* ADD */}

                                                <button
                                                    type="button"

                                                    onClick={() =>
                                                        handleStarClick(
                                                            problemDetail.id
                                                        )
                                                    }

                                                    disabled={
                                                        problemDetail
                                                            ?.star_by_user
                                                        ||
                                                        isStarLoading
                                                    }

                                                    className={`
                                                        flex
                                                        h-11
                                                        w-11
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        border
                                                        transition-all

                                                        sm:h-12
                                                        sm:w-12

                                                        ${
                                                            problemDetail
                                                                ?.star_by_user

                                                                ? `
                                                                    cursor-not-allowed
                                                                    border-green-400/30
                                                                    bg-green-500/10
                                                                    text-green-300
                                                                `

                                                                : `
                                                                    border-green-400/20
                                                                    bg-green-500/10
                                                                    text-green-300

                                                                    hover:scale-105
                                                                    hover:bg-green-500/20
                                                                `
                                                        }
                                                    `}

                                                    title={
                                                        problemDetail
                                                            ?.star_by_user
                                                            ? "Siz allaqachon star bergansiz"
                                                            : "Star berish"
                                                    }
                                                >

                                                    {isStarLoading ? (

                                                        <Loader2
                                                            size={18}
                                                            className="
                                                                animate-spin
                                                            "
                                                        />

                                                    ) : (

                                                        <ArrowUp
                                                            size={20}
                                                        />
                                                    )}

                                                </button>


                                                {/* COUNT */}

                                                <span
                                                    className="
                                                        my-3
                                                        text-2xl
                                                        font-black
                                                        text-white

                                                        sm:text-3xl
                                                    "
                                                >
                                                    {problemDetail?.star
                                                    ??
                                                    0}
                                                </span>


                                                {/* REMOVE */}

                                                <button
                                                    type="button"

                                                    onClick={() =>
                                                        handleStarDeleteClick(
                                                            problemDetail.id
                                                        )
                                                    }

                                                    disabled={
                                                        !problemDetail
                                                            ?.star_by_user
                                                        ||
                                                        isStarLoading
                                                    }

                                                    className={`
                                                        flex
                                                        h-11
                                                        w-11
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        border
                                                        transition-all

                                                        sm:h-12
                                                        sm:w-12

                                                        ${
                                                            problemDetail
                                                                ?.star_by_user

                                                                ? `
                                                                    border-red-400/30
                                                                    bg-red-500/10
                                                                    text-red-300

                                                                    hover:scale-105
                                                                    hover:bg-red-500/20
                                                                `

                                                                : `
                                                                    cursor-not-allowed
                                                                    border-white/10
                                                                    bg-white/[0.035]
                                                                    text-gray-600
                                                                `
                                                        }
                                                    `}

                                                    title={
                                                        problemDetail
                                                            ?.star_by_user
                                                            ? "Starni olib tashlash"
                                                            : "Avval star bering"
                                                    }
                                                >

                                                    {isStarLoading ? (

                                                        <Loader2
                                                            size={18}
                                                            className="
                                                                animate-spin
                                                            "
                                                        />

                                                    ) : (

                                                        <ArrowDown
                                                            size={20}
                                                        />
                                                    )}

                                                </button>


                                                {/* STAR STATUS */}

                                                <div
                                                    className={`
                                                        mt-3
                                                        flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        border
                                                        text-xs

                                                        sm:h-9
                                                        sm:w-9

                                                        ${
                                                            problemDetail
                                                                ?.star_by_user

                                                                ? `
                                                                    border-yellow-400/30
                                                                    bg-yellow-400/10
                                                                    text-yellow-300
                                                                `

                                                                : `
                                                                    border-white/10
                                                                    bg-white/[0.035]
                                                                    text-gray-600
                                                                `
                                                        }
                                                    `}
                                                >

                                                    {problemDetail
                                                        ?.star_by_user ? (

                                                        <Check
                                                            size={14}
                                                        />

                                                    ) : (

                                                        <Star
                                                            size={14}
                                                        />
                                                    )}

                                                </div>

                                            </div>

                                        </aside>


                                        {/* ARTICLE */}

                                        <article
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            {/* DESCRIPTION */}

                                            <div
                                                className="
                                                    rounded-3xl
                                                    border
                                                    border-white/10
                                                    bg-white/[0.035]
                                                    p-4

                                                    sm:p-5
                                                "
                                            >

                                                <h2
                                                    className="
                                                        mb-3
                                                        text-lg
                                                        font-black
                                                        text-white

                                                        sm:text-xl
                                                    "
                                                >
                                                    Muammo tavsifi
                                                </h2>


                                                <p
                                                    className="
                                                        whitespace-pre-wrap
                                                        break-words
                                                        text-sm
                                                        leading-7
                                                        text-gray-300

                                                        sm:text-base

                                                        md:text-lg
                                                        md:leading-8
                                                    "
                                                >
                                                    {problemDetail
                                                        ?.description}
                                                </p>


                                                {/* TECHNOLOGIES */}

                                                {problemTechnologies.length >
                                                    0 && (

                                                    <div
                                                        className="
                                                            mt-5
                                                            border-t
                                                            border-white/[0.07]
                                                            pt-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                mb-3
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                justify-between
                                                                gap-2
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                                <Tags
                                                                    size={13}
                                                                    className="
                                                                        text-indigo-400
                                                                    "
                                                                />


                                                                <span
                                                                    className="
                                                                        font-mono
                                                                        text-[9px]
                                                                        font-black
                                                                        uppercase
                                                                        tracking-[0.18em]
                                                                        text-gray-600
                                                                    "
                                                                >
                                                                    Teglar / Texnologiyalar
                                                                </span>

                                                            </div>


                                                            <span
                                                                className="
                                                                    rounded-full
                                                                    border
                                                                    border-white/[0.06]
                                                                    bg-white/[0.025]
                                                                    px-2
                                                                    py-0.5
                                                                    text-[8px]
                                                                    font-black
                                                                    text-gray-600
                                                                "
                                                            >
                                                                {problemTechnologies.length}
                                                            </span>

                                                        </div>


                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                gap-2
                                                            "
                                                        >

                                                            {problemTechnologies.map(
                                                                (
                                                                    technology,
                                                                    index
                                                                ) => (

                                                                    <StackTag
                                                                        key={
                                                                            technology?.id
                                                                            ||
                                                                            technology?.name
                                                                            ||
                                                                            `technology-${index}`
                                                                        }

                                                                        item={
                                                                            technology
                                                                        }

                                                                        type="technology"
                                                                    />
                                                                )
                                                            )}

                                                        </div>

                                                    </div>
                                                )}

                                            </div>


                                            {/* ERROR CODE */}

                                            <div
                                                className="
                                                    mt-6
                                                    overflow-hidden
                                                    rounded-3xl
                                                    border
                                                    border-white/10
                                                    bg-[#050816]
                                                    shadow-2xl
                                                    shadow-black/20
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-3
                                                        border-b
                                                        border-white/10
                                                        bg-white/[0.035]
                                                        px-4
                                                        py-3

                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                font-black
                                                                uppercase
                                                                tracking-[0.2em]
                                                                text-gray-500
                                                            "
                                                        >
                                                            Error Code
                                                        </p>


                                                        <h3
                                                            className="
                                                                mt-0.5
                                                                text-sm
                                                                font-black
                                                                text-white
                                                            "
                                                        >
                                                            ❌ Xatolik bo‘lgan kod
                                                        </h3>

                                                    </div>


                                                    {problemDetail
                                                        ?.code && (

                                                        <button
                                                            type="button"

                                                            onClick={
                                                                handleCopy
                                                            }

                                                            className="
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                rounded-xl
                                                                border
                                                                border-indigo-400/30
                                                                bg-indigo-500/10
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-black
                                                                text-indigo-300
                                                                transition-all

                                                                hover:bg-indigo-500/20

                                                                active:scale-[0.97]
                                                            "
                                                        >

                                                            {copied ? (

                                                                <Check
                                                                    size={14}
                                                                />

                                                            ) : (

                                                                <Clipboard
                                                                    size={14}
                                                                />
                                                            )}


                                                            {copied
                                                                ? "Nusxalandi"
                                                                : "Nusxalash"
                                                            }

                                                        </button>
                                                    )}

                                                </div>


                                                {problemDetail
                                                    ?.code ? (

                                                    <pre
                                                        className="
                                                            max-h-[520px]
                                                            overflow-auto
                                                            bg-[#050816]
                                                            p-4
                                                            text-xs
                                                            leading-relaxed
                                                            text-gray-200

                                                            sm:p-5
                                                            sm:text-sm
                                                        "
                                                    >

                                                        <code>
                                                            {problemDetail
                                                                .code}
                                                        </code>

                                                    </pre>

                                                ) : (

                                                    <div
                                                        className="
                                                            p-6
                                                            text-center
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                italic
                                                                text-gray-600
                                                            "
                                                        >
                                                            Kod mavjud emas.
                                                        </p>

                                                    </div>
                                                )}

                                            </div>


                                            {/* TIP */}

                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    items-start
                                                    gap-3
                                                    rounded-3xl
                                                    border
                                                    border-cyan-400/20
                                                    bg-cyan-400/10
                                                    p-4

                                                    sm:p-5
                                                "
                                            >

                                                <Sparkles
                                                    size={17}
                                                    className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-yellow-300
                                                    "
                                                />


                                                <p
                                                    className="
                                                        text-sm
                                                        leading-6
                                                        text-cyan-100
                                                    "
                                                >
                                                    Ushbu muammoni hal qilish uchun eng
                                                    to‘g‘ri yondashuv qanday? O‘z
                                                    yechimingizni pastda qoldiring.
                                                </p>

                                            </div>

                                        </article>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                RESPONSES
                            ================================================== */}

                            <section
                                ref={
                                    responsesSectionRef
                                }

                                className="
                                    mt-8
                                    scroll-mt-28
                                    overflow-hidden
                                    rounded-[2rem]
                                    border
                                    border-white/10
                                    bg-[#0d1117]
                                    shadow-2xl
                                    shadow-black/30
                                "
                            >

                                {/* HEADER */}

                                <div
                                    className="
                                        border-b
                                        border-white/10
                                        bg-[#0d1117]/95
                                        px-5
                                        py-5
                                        backdrop-blur

                                        md:px-7
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-4

                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    font-mono
                                                    text-[11px]
                                                    font-black
                                                    uppercase
                                                    tracking-[0.28em]
                                                    text-gray-600
                                                "
                                            >
                                                fsociety://solutions
                                            </p>


                                            <h2
                                                className="
                                                    mt-1
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                    text-2xl
                                                    font-black
                                                    text-white
                                                "
                                            >
                                                Yechimlar


                                                <span
                                                    className="
                                                        inline-flex
                                                        h-7
                                                        min-w-7
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        border-cyan-400/20
                                                        bg-cyan-400/10
                                                        px-2
                                                        text-xs
                                                        text-cyan-300
                                                    "
                                                >
                                                    {responseCount}
                                                </span>

                                            </h2>


                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-gray-500
                                                "
                                            >
                                                Community tomonidan yozilgan
                                                barcha yechimlar.
                                            </p>

                                        </div>


                                        {!problemDetail
                                            ?.is_solved && (

                                            <button
                                                type="button"

                                                onClick={
                                                    handleWorkClick
                                                }

                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-cyan-400/30
                                                    bg-cyan-400/10
                                                    px-5
                                                    py-3
                                                    text-sm
                                                    font-black
                                                    text-cyan-300
                                                    transition-all

                                                    hover:bg-cyan-400/20

                                                    active:scale-[0.98]
                                                "
                                            >

                                                <Pencil
                                                    size={15}
                                                />

                                                Yechim yozish

                                            </button>
                                        )}

                                    </div>

                                </div>


                                {/* RESPONSE LIST */}

                                <div
                                    className="
                                        max-h-[780px]
                                        overflow-y-auto
                                        px-4
                                        py-5

                                        md:px-6

                                        lg:max-h-[850px]
                                    "
                                >

                                    <ProblemResponse
                                        key={`problem-responses-${id}-${responsesRefreshKey}`}

                                        id={
                                            id
                                        }

                                        isOwner={
                                            isOwner
                                        }

                                        isSolved={
                                            problemDetail
                                                ?.is_solved
                                        }

                                        onAcceptSolution={
                                            handleAcceptSolution
                                        }
                                    />

                                </div>

                            </section>


                            {/* =================================================
                                RESPONSE FORM
                            ================================================== */}

                            {!problemDetail
                                ?.is_solved ? (

                                <section
                                    ref={
                                        responseFormRef
                                    }

                                    className="
                                        mt-8
                                        scroll-mt-28
                                        overflow-hidden
                                        rounded-[2rem]
                                        border
                                        border-cyan-400/20
                                        bg-[#0d1117]
                                        p-5
                                        shadow-2xl
                                        shadow-cyan-500/5

                                        md:p-7
                                    "
                                >

                                    <div
                                        className="
                                            mb-5
                                        "
                                    >

                                        <p
                                            className="
                                                font-mono
                                                text-[11px]
                                                font-black
                                                uppercase
                                                tracking-[0.28em]
                                                text-gray-600
                                            "
                                        >
                                            fsociety://new-solution
                                        </p>


                                        <h2
                                            className="
                                                mt-1
                                                text-2xl
                                                font-black
                                                text-white
                                            "
                                        >
                                            O‘z yechimingizni yozing
                                        </h2>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                leading-6
                                                text-gray-500
                                            "
                                        >
                                            Kodingizni, tushuntirishingizni
                                            va xatoni qanday tuzatganingizni
                                            aniq yozing.
                                        </p>

                                    </div>


                                    <ProblemResponseForm
                                        id={
                                            id
                                        }

                                        problemLanguages={
                                            problemLanguages
                                        }

                                        onSuccess={
                                            handleSolutionCreated
                                        }
                                    />

                                </section>

                            ) : (

                                <section
                                    className="
                                        mt-8
                                        rounded-[2rem]
                                        border
                                        border-green-400/20
                                        bg-green-500/[0.07]
                                        p-6
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            mb-3
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-green-400/15
                                            bg-green-500/10
                                            text-green-300
                                        "
                                    >

                                        <CheckCircle2
                                            size={25}
                                        />

                                    </div>


                                    <h3
                                        className="
                                            text-xl
                                            font-black
                                            text-white
                                        "
                                    >
                                        Bu muammo yechilgan
                                    </h3>


                                    <p
                                        className="
                                            mx-auto
                                            mt-2
                                            max-w-lg
                                            text-sm
                                            leading-6
                                            text-gray-400
                                        "
                                    >
                                        Yangi yechim yozish yopilgan.
                                        Mavjud yechimlarni yuqoridagi
                                        blokda ko‘rishingiz mumkin.
                                    </p>

                                </section>
                            )}

                        </div>


                        {/* =================================================
                            RIGHT SIDEBAR
                        ================================================== */}

                        <aside
                            className="
                                min-w-0

                                lg:col-span-4
                            "
                        >

                            <div
                                className="
                                    lg:sticky
                                    lg:top-28
                                "
                            >

                                <SimilarProblems
                                    problemId={
                                        id
                                    }
                                />

                            </div>

                        </aside>

                    </div>

                </div>

            </main>


            {/* =================================================
                DELETE MODAL
            ================================================== */}

            {isOwner && (

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
                        problemDetail
                            ?.problem
                        ||
                        "Muammo"
                    }

                    isProcessing={
                        isDeleting
                    }
                />
            )}


            {/* =================================================
                ACCEPT SOLUTION MODAL
            ================================================== */}

            <AcceptSolutionConfirmationModal
                isOpen={
                    isAcceptModalOpen
                }

                onClose={
                    handleCloseAcceptModal
                }

                onConfirm={
                    handleConfirmAcceptSolution
                }

                isProcessing={
                    isAcceptingSolution
                }
            />

        </>
    );
};


export default ProblemDetail;