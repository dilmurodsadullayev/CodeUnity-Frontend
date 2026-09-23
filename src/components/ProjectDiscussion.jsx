// src/components/ProjectDiscussion.jsx

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
    Link,
} from "react-router-dom";

import {
    AlertTriangle,
    Check,
    ChevronDown,
    ChevronUp,
    Clock3,
    Edit3,
    Loader2,
    MessageCircle,
    MessageSquareText,
    RefreshCw,
    Send,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";

import {
    getProjectCommentFailure,
    getProjectCommentStart,
    getProjectCommentSuccess,
} from "../features/projects";

import ProjectService from "../services/project";

import timeAgo from "../utils/timeAgo";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../utils/imageUtils";

import {
    siteToast,
} from "./ui/AuthToast";

import DeleteConfirmationModal from "./DeleteConfirmationModal";


// =========================================================
// SELECTORS
// =========================================================

const selectProjectState =
    (state) => state.project;


// =========================================================
// CONSTANTS
// =========================================================

const COMMENT_PREVIEW_LIMIT =
    320;


// =========================================================
// ERROR PARSER
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
        data?.body
    ) {

        return Array.isArray(
            data.body
        )

            ? data.body.join(
                ", "
            )

            : String(
                data.body
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
                parsed?.body
            ) {

                return Array.isArray(
                    parsed.body
                )

                    ? parsed.body.join(
                        ", "
                    )

                    : String(
                        parsed.body
                    );
            }


            const firstValue =
                Object.values(
                    parsed
                )[0];


            if (
                Array.isArray(
                    firstValue
                )
            ) {

                return String(
                    firstValue[0]
                    ||
                    fallback
                );
            }


            if (
                typeof firstValue ===
                "string"
            ) {

                return firstValue;
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
// NORMALIZE COMMENTS
// =========================================================

const normalizeComments = (
    response
) => {

    if (
        Array.isArray(
            response
        )
    ) {

        return response;
    }


    if (
        Array.isArray(
            response?.results
        )
    ) {

        return response.results;
    }


    return [];
};


// =========================================================
// AUTHOR NAME
// =========================================================

const getAuthorName = (
    author
) => {

    const fullName =
        `${
            author?.first_name
            ||
            ""
        } ${
            author?.last_name
            ||
            ""
        }`
            .trim();


    return (
        fullName
        ||
        author?.username
        ||
        "Foydalanuvchi"
    );
};


// =========================================================
// COMMENT BODY
// =========================================================

const CommentBody = ({
    text = "",
}) => {

    const parts =
        String(
            text
        ).split(
            /(\$[a-zA-Z0-9_-]+)/g
        );


    const handleTagClick =
        (
            event,
            tag
        ) => {

            event.stopPropagation();


            siteToast.info(
                `${tag} belgisi tanlandi.`,
                {
                    title:
                        "Project tag",

                    duration:
                        2200,
                }
            );
        };


    return (
        <>
            {parts.map(
                (
                    part,
                    index
                ) => {

                    if (
                        part.startsWith(
                            "$"
                        )
                    ) {

                        return (
                            <button
                                key={
                                    `${part}-${index}`
                                }
                                type="button"
                                onClick={(
                                    event
                                ) =>
                                    handleTagClick(
                                        event,
                                        part
                                    )
                                }
                                className="
                                    mx-0.5
                                    inline-flex
                                    items-center
                                    rounded-md
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.08]
                                    px-1.5
                                    py-0.5
                                    font-bold
                                    text-indigo-300
                                    transition

                                    hover:border-indigo-400/20
                                    hover:bg-indigo-500/[0.15]
                                    hover:text-indigo-200
                                "
                            >
                                {part}
                            </button>
                        );
                    }


                    return (
                        <React.Fragment
                            key={
                                `text-${index}`
                            }
                        >
                            {part}
                        </React.Fragment>
                    );
                }
            )}
        </>
    );
};


// =========================================================
// COMMENT CARD
// =========================================================

const ProjectCommentCard = ({
    comment,
    currentUser,
    isLoggedIn,
    onEdit,
    onDelete,
}) => {

    const [
        expanded,
        setExpanded,
    ] = useState(
        false
    );


    const body =
        String(
            comment?.body
            ||
            ""
        );


    const isLong =
        body.length >
        COMMENT_PREVIEW_LIMIT;


    const displayedBody =
        expanded

            ? body

            : (
                isLong

                    ? `${
                        body
                            .slice(
                                0,
                                COMMENT_PREVIEW_LIMIT
                            )
                            .trim()
                    }...`

                    : body
            );


    const author =
        comment?.user
        ||
        {};


    const avatar =
        getUserAvatarUrl(
            author
        );


    const isAuthor =
        Boolean(
            isLoggedIn
            &&
            currentUser?.id
            &&
            author?.id
            &&
            Number(
                currentUser.id
            )
            ===
            Number(
                author.id
            )
        );


    return (
        <article
            className="
                group
                relative
                w-full
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.06]
                bg-white/[0.018]
                transition-all
                duration-200

                hover:border-white/[0.10]
                hover:bg-white/[0.027]
            "
        >

            {/* =================================================
                HOVER GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-24
                    h-48
                    w-48
                    rounded-full
                    bg-indigo-500/[0.05]
                    opacity-0
                    blur-[75px]
                    transition-opacity
                    duration-300

                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10
                    p-4

                    sm:p-5
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3

                        sm:gap-4
                    "
                >

                    {/* =========================================
                        AVATAR
                    ========================================== */}

                    <Link
                        to={`/${author?.username}/profile/`}
                        className="
                            shrink-0
                        "
                    >

                        <img
                            src={
                                avatar
                            }
                            alt={
                                author?.username
                                ||
                                "User"
                            }
                            onError={
                                handleUserImageError
                            }
                            className="
                                h-11
                                w-11
                                rounded-xl
                                border
                                border-white/[0.08]
                                bg-gray-900
                                object-cover
                                shadow-lg
                                shadow-black/20

                                sm:h-12
                                sm:w-12
                            "
                        />

                    </Link>


                    {/* =========================================
                        CONTENT
                    ========================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        {/* =====================================
                            TOP
                        ====================================== */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-3

                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >

                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-2
                                        gap-y-1
                                    "
                                >

                                    <Link
                                        to={`/${author?.username}/profile/`}
                                        className="
                                            truncate
                                            text-sm
                                            font-black
                                            text-white
                                            transition

                                            hover:text-indigo-300
                                        "
                                    >
                                        {
                                            getAuthorName(
                                                author
                                            )
                                        }
                                    </Link>


                                    <span
                                        className="
                                            hidden
                                            h-1
                                            w-1
                                            rounded-full
                                            bg-gray-700

                                            sm:block
                                        "
                                    />


                                    <span
                                        className="
                                            truncate
                                            text-[10px]
                                            font-semibold
                                            text-gray-600
                                        "
                                    >
                                        @{
                                            author?.username
                                            ||
                                            "unknown"
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        mt-1.5
                                        flex
                                        items-center
                                        gap-1.5
                                        text-[10px]
                                        font-semibold
                                        text-gray-600
                                    "
                                >

                                    <Clock3
                                        size={12}
                                    />

                                    <span>
                                        {
                                            timeAgo(
                                                comment
                                                    ?.created_at
                                            )
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* =====================================
                                ACTIONS
                            ====================================== */}

                            {isAuthor && (
                                <div
                                    className="
                                        flex
                                        shrink-0
                                        items-center
                                        gap-1
                                        self-start
                                        rounded-xl
                                        border
                                        border-white/[0.05]
                                        bg-black/20
                                        p-1
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onEdit(
                                                comment
                                            )
                                        }
                                        title="Sharhni tahrirlash"
                                        className="
                                            grid
                                            h-8
                                            w-8
                                            place-items-center
                                            rounded-lg
                                            text-gray-500
                                            transition-all

                                            hover:bg-indigo-500/[0.10]
                                            hover:text-indigo-300

                                            active:scale-[0.92]
                                        "
                                    >
                                        <Edit3
                                            size={14}
                                        />
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(
                                                comment
                                            )
                                        }
                                        title="Sharhni o‘chirish"
                                        className="
                                            grid
                                            h-8
                                            w-8
                                            place-items-center
                                            rounded-lg
                                            text-gray-500
                                            transition-all

                                            hover:bg-red-500/[0.10]
                                            hover:text-red-300

                                            active:scale-[0.92]
                                        "
                                    >
                                        <Trash2
                                            size={14}
                                        />
                                    </button>

                                </div>
                            )}

                        </div>


                        {/* =====================================
                            BODY
                        ====================================== */}

                        <div
                            className="
                                mt-4
                                max-w-5xl
                                whitespace-pre-wrap
                                break-words
                                text-sm
                                font-medium
                                leading-7
                                text-gray-400
                            "
                        >
                            <CommentBody
                                text={
                                    displayedBody
                                }
                            />
                        </div>


                        {/* =====================================
                            READ MORE
                        ====================================== */}

                        {isLong && (
                            <button
                                type="button"
                                onClick={() =>
                                    setExpanded(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                                className="
                                    mt-3
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    px-1
                                    py-1
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-indigo-400
                                    transition

                                    hover:text-indigo-300
                                "
                            >

                                {expanded ? (
                                    <>
                                        <ChevronUp
                                            size={13}
                                        />

                                        Qisqartirish
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown
                                            size={13}
                                        />

                                        To‘liq o‘qish
                                    </>
                                )}

                            </button>
                        )}

                    </div>

                </div>

            </div>

        </article>
    );
};


// =========================================================
// COMMENT EDIT MODAL
// =========================================================

const CommentEditModal = ({
    isOpen,
    comment,
    value,
    onChange,
    onClose,
    onSave,
    isUpdating,
    error,
}) => {

    useEffect(
        () => {

            if (
                !isOpen
            ) {
                return undefined;
            }


            const oldOverflow =
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
                        !isUpdating
                    ) {

                        onClose();
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
                    oldOverflow;


                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };

        },
        [
            isOpen,
            isUpdating,
            onClose,
        ]
    );


    if (
        !isOpen
        ||
        !comment
    ) {
        return null;
    }


    const author =
        comment?.user
        ||
        {};


    const avatar =
        getUserAvatarUrl(
            author
        );


    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
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
                    !isUpdating
                ) {

                    onClose();
                }
            }}
        >

            <div
                className="
                    relative
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-[#0c1119]
                    shadow-[0_35px_100px_rgba(0,0,0,0.65)]
                "
            >

                {/* =============================================
                    GLOW
                ============================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-indigo-500/[0.10]
                        blur-[90px]
                    "
                />


                {/* =============================================
                    HEADER
                ============================================== */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-white/[0.06]
                        px-5
                        py-5

                        sm:px-6
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                grid
                                h-11
                                w-11
                                shrink-0
                                place-items-center
                                rounded-xl
                                border
                                border-indigo-400/20
                                bg-indigo-500/[0.08]
                                text-indigo-300
                            "
                        >
                            <Edit3
                                size={19}
                            />
                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <h3
                                className="
                                    text-lg
                                    font-black
                                    text-white

                                    sm:text-xl
                                "
                            >
                                Sharhni tahrirlash
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    font-medium
                                    text-gray-600
                                "
                            >
                                Fikringizni yangilang va o‘zgarishlarni saqlang.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            isUpdating
                        }
                        className="
                            grid
                            h-9
                            w-9
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-500
                            transition

                            hover:bg-white/[0.06]
                            hover:text-white

                            active:scale-[0.94]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <X
                            size={17}
                        />
                    </button>

                </div>


                {/* =============================================
                    BODY
                ============================================== */}

                <div
                    className="
                        relative
                        z-10
                        p-5

                        sm:p-6
                    "
                >

                    {/* AUTHOR */}

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white/[0.06]
                            bg-white/[0.02]
                            p-3
                        "
                    >

                        <img
                            src={
                                avatar
                            }
                            alt={
                                author?.username
                                ||
                                "User"
                            }
                            onError={
                                handleUserImageError
                            }
                            className="
                                h-10
                                w-10
                                rounded-xl
                                border
                                border-white/[0.08]
                                object-cover
                            "
                        />


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    truncate
                                    text-xs
                                    font-black
                                    text-white
                                "
                            >
                                {
                                    getAuthorName(
                                        author
                                    )
                                }
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[9px]
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                @{
                                    author?.username
                                    ||
                                    "unknown"
                                }
                            </p>

                        </div>

                    </div>


                    {/* TEXTAREA */}

                    <div
                        className="
                            relative
                        "
                    >

                        <textarea
                            value={
                                value
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    event.target.value
                                )
                            }
                            rows={7}
                            disabled={
                                isUpdating
                            }
                            autoFocus
                            placeholder="Sharh matnini kiriting..."
                            className="
                                min-h-[180px]
                                w-full
                                resize-none
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-black/25
                                px-4
                                py-4
                                text-sm
                                font-medium
                                leading-7
                                text-white
                                outline-none
                                transition

                                placeholder:text-gray-700

                                focus:border-indigo-400/35
                                focus:bg-black/35
                                focus:ring-4
                                focus:ring-indigo-500/[0.06]

                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        />


                        <span
                            className="
                                absolute
                                bottom-3
                                right-3
                                rounded-lg
                                bg-black/50
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-gray-600
                            "
                        >
                            {
                                value.length
                            }
                            {" "}
                            belgi
                        </span>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-red-400/20
                                bg-red-500/[0.06]
                                p-3
                                text-xs
                                font-semibold
                                leading-5
                                text-red-300
                            "
                        >

                            <AlertTriangle
                                size={16}
                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />


                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                </div>


                {/* =============================================
                    FOOTER
                ============================================== */}

                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-white/[0.06]
                        bg-black/10
                        px-5
                        py-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-end
                        sm:px-6
                    "
                >

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            isUpdating
                        }
                        className="
                            inline-flex
                            min-h-[42px]
                            items-center
                            justify-center
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
                        Bekor qilish
                    </button>


                    <button
                        type="button"
                        onClick={
                            onSave
                        }
                        disabled={
                            isUpdating
                            ||
                            !value.trim()
                        }
                        className="
                            inline-flex
                            min-h-[42px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-400/30
                            bg-indigo-600
                            px-5
                            py-2.5
                            text-xs
                            font-black
                            text-white
                            shadow-lg
                            shadow-indigo-600/20
                            transition

                            hover:bg-indigo-500

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:border-white/[0.05]
                            disabled:bg-white/[0.04]
                            disabled:text-gray-600
                            disabled:shadow-none
                        "
                    >

                        {isUpdating ? (
                            <>
                                <Loader2
                                    size={15}
                                    className="
                                        animate-spin
                                    "
                                />

                                Saqlanmoqda...
                            </>
                        ) : (
                            <>
                                <Check
                                    size={15}
                                />

                                O‘zgarishlarni saqlash
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};


// =========================================================
// PROJECT DISCUSSION
// =========================================================

const ProjectDiscussion = ({
    projectId,
}) => {

    const dispatch =
        useDispatch();


    const {
        projectComments,
        project_comment_isLoading,
        project_comment_error,
    } = useSelector(
        selectProjectState
    );


    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) =>
            state.auth
    );


    // =====================================================
    // COMMENTS
    // =====================================================

    const comments =
        useMemo(
            () => {

                if (
                    Array.isArray(
                        projectComments
                    )
                ) {
                    return projectComments;
                }


                if (
                    Array.isArray(
                        projectComments?.results
                    )
                ) {
                    return projectComments.results;
                }


                return [];

            },
            [
                projectComments,
            ]
        );


    // =====================================================
    // CREATE STATE
    // =====================================================

    const [
        newCommentText,
        setNewCommentText,
    ] = useState(
        ""
    );


    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(
        false
    );


    const [
        submitError,
        setSubmitError,
    ] = useState(
        ""
    );


    // =====================================================
    // EDIT STATE
    // =====================================================

    const [
        isEditModalOpen,
        setIsEditModalOpen,
    ] = useState(
        false
    );


    const [
        editingComment,
        setEditingComment,
    ] = useState(
        null
    );


    const [
        editCommentText,
        setEditCommentText,
    ] = useState(
        ""
    );


    const [
        isUpdating,
        setIsUpdating,
    ] = useState(
        false
    );


    const [
        updateError,
        setUpdateError,
    ] = useState(
        ""
    );


    // =====================================================
    // DELETE STATE
    // =====================================================

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(
        false
    );


    const [
        commentToDelete,
        setCommentToDelete,
    ] = useState(
        null
    );


    const [
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    // =====================================================
    // CURRENT USER AVATAR
    // =====================================================

    const currentUserAvatar =
        getUserAvatarUrl(
            user
        );


    // =====================================================
    // LOAD COMMENTS
    // =====================================================

    const getProjectComments =
        useCallback(
            async () => {

                if (
                    !projectId
                ) {
                    return;
                }


                dispatch(
                    getProjectCommentStart()
                );


                try {

                    const response =
                        await ProjectService
                            .getProjectComments(
                                projectId
                            );


                    dispatch(
                        getProjectCommentSuccess(
                            normalizeComments(
                                response
                            )
                        )
                    );

                } catch (
                    requestError
                ) {

                    const message =
                        getErrorMessage(
                            requestError,
                            "Sharhlarni yuklashda xato yuz berdi."
                        );


                    console.error(
                        "Project comments xato:",
                        requestError
                    );


                    dispatch(
                        getProjectCommentFailure(
                            message
                        )
                    );
                }
            },
            [
                projectId,
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            getProjectComments();

        },
        [
            getProjectComments,
        ]
    );


    // =====================================================
    // ADD COMMENT
    // =====================================================

    const addProjectComment =
        async () => {

            if (
                !isLoggedIn
            ) {

                siteToast.warning(
                    "Sharh qoldirish uchun avval tizimga kiring.",
                    {
                        title:
                            "Kirish talab qilinadi",
                    }
                );

                return;
            }


            const cleanText =
                newCommentText
                    .trim();


            if (
                !cleanText
            ) {

                const message =
                    "Sharh matnini kiriting.";


                setSubmitError(
                    message
                );


                siteToast.warning(
                    message,
                    {
                        title:
                            "Sharh yozilmadi",
                    }
                );

                return;
            }


            if (
                isSubmitting
            ) {
                return;
            }


            setSubmitError(
                ""
            );


            setIsSubmitting(
                true
            );


            const toastId =
                siteToast.loading(
                    "Sharhingiz yuborilmoqda...",
                    {
                        title:
                            "Sharh yuborilmoqda",
                    }
                );


            try {

                await ProjectService
                    .projectCommentCreate(
                        projectId,
                        {
                            body:
                                cleanText,
                        }
                    );


                setNewCommentText(
                    ""
                );


                await getProjectComments();


                siteToast.success(
                    "Sharhingiz muvaffaqiyatli qo‘shildi.",
                    {
                        id:
                            toastId,

                        title:
                            "Sharh qo‘shildi",

                        duration:
                            3000,
                    }
                );

            } catch (
                requestError
            ) {

                const message =
                    getErrorMessage(
                        requestError,
                        "Sharhni yuborishda xato yuz berdi."
                    );


                setSubmitError(
                    message
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Sharh yuborilmadi",

                        duration:
                            4500,
                    }
                );

            } finally {

                setIsSubmitting(
                    false
                );
            }
        };


    // =====================================================
    // EDIT OPEN
    // =====================================================

    const handleEditClick =
        (
            comment
        ) => {

            setEditingComment(
                comment
            );


            setEditCommentText(
                comment?.body
                ||
                ""
            );


            setUpdateError(
                ""
            );


            setIsEditModalOpen(
                true
            );
        };


    // =====================================================
    // EDIT CLOSE
    // =====================================================

    const handleCloseEditModal =
        useCallback(
            () => {

                if (
                    isUpdating
                ) {
                    return;
                }


                setIsEditModalOpen(
                    false
                );


                setEditingComment(
                    null
                );


                setEditCommentText(
                    ""
                );


                setUpdateError(
                    ""
                );

            },
            [
                isUpdating,
            ]
        );


    // =====================================================
    // UPDATE COMMENT
    // =====================================================

    const handleUpdateComment =
        async () => {

            if (
                !editingComment?.id
                ||
                isUpdating
            ) {
                return;
            }


            const cleanText =
                editCommentText
                    .trim();


            if (
                !cleanText
            ) {

                const message =
                    "Sharh matnini bo‘sh qoldirib bo‘lmaydi.";


                setUpdateError(
                    message
                );


                siteToast.warning(
                    message,
                    {
                        title:
                            "Sharh saqlanmadi",
                    }
                );

                return;
            }


            setIsUpdating(
                true
            );


            setUpdateError(
                ""
            );


            const toastId =
                siteToast.loading(
                    "Sharhdagi o‘zgarishlar saqlanmoqda...",
                    {
                        title:
                            "Sharh yangilanmoqda",
                    }
                );


            try {

                await ProjectService
                    .projectCommentUpdate(
                        projectId,
                        editingComment.id,
                        {
                            body:
                                cleanText,
                        }
                    );


                await getProjectComments();


                setIsEditModalOpen(
                    false
                );


                setEditingComment(
                    null
                );


                setEditCommentText(
                    ""
                );


                siteToast.success(
                    "Sharh muvaffaqiyatli yangilandi.",
                    {
                        id:
                            toastId,

                        title:
                            "Sharh yangilandi",

                        duration:
                            3000,
                    }
                );

            } catch (
                requestError
            ) {

                const message =
                    getErrorMessage(
                        requestError,
                        "Sharhni tahrirlashda xato yuz berdi."
                    );


                setUpdateError(
                    message
                );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Sharh yangilanmadi",

                        duration:
                            4500,
                    }
                );

            } finally {

                setIsUpdating(
                    false
                );
            }
        };


    // =====================================================
    // DELETE OPEN
    // =====================================================

    const handleDeleteClick =
        (
            comment
        ) => {

            setCommentToDelete(
                comment
            );


            setIsDeleteModalOpen(
                true
            );
        };


    // =====================================================
    // DELETE CLOSE
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


            setCommentToDelete(
                null
            );
        };


    // =====================================================
    // DELETE COMMENT
    // =====================================================

    const handleConfirmDelete =
        async () => {

            if (
                !commentToDelete?.id
                ||
                isDeleting
            ) {
                return;
            }


            setIsDeleting(
                true
            );


            const toastId =
                siteToast.loading(
                    "Sharh o‘chirilmoqda...",
                    {
                        title:
                            "Sharh o‘chirilmoqda",
                    }
                );


            try {

                await ProjectService
                    .projectCommentDelete(
                        projectId,
                        commentToDelete.id
                    );


                await getProjectComments();


                setIsDeleteModalOpen(
                    false
                );


                setCommentToDelete(
                    null
                );


                siteToast.success(
                    "Sharh muvaffaqiyatli o‘chirildi.",
                    {
                        id:
                            toastId,

                        title:
                            "Sharh o‘chirildi",

                        duration:
                            3000,
                    }
                );

            } catch (
                requestError
            ) {

                const message =
                    getErrorMessage(
                        requestError,
                        "Sharhni o‘chirishda xato yuz berdi."
                    );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Sharh o‘chirilmadi",

                        duration:
                            4500,
                    }
                );

            } finally {

                setIsDeleting(
                    false
                );
            }
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            className="
                w-full
                border-t
                border-white/[0.07]
                bg-black/[0.05]
            "
        >

            {/* =================================================
                FULL WIDTH CONTENT
            ================================================== */}

            <div
                className="
                    w-full
                    px-5
                    py-8

                    sm:px-8
                    sm:py-10

                    xl:px-10
                    xl:py-12
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-4

                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
                >

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <div
                            className="
                                mb-2
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-indigo-400/15
                                bg-indigo-500/[0.06]
                                px-3
                                py-1.5
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-indigo-300
                            "
                        >
                            <MessageSquareText
                                size={13}
                            />

                            Discussion
                        </div>


                        <h2
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                                text-2xl
                                font-black
                                text-white

                                sm:text-3xl
                            "
                        >
                            Loyiha muhokamasi

                            <span
                                className="
                                    inline-flex
                                    h-7
                                    min-w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-indigo-400/15
                                    bg-indigo-500/[0.07]
                                    px-2
                                    text-xs
                                    font-black
                                    text-indigo-300
                                "
                            >
                                {
                                    comments.length
                                }
                            </span>
                        </h2>


                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-xs
                                font-medium
                                leading-6
                                text-gray-600
                            "
                        >
                            Loyiha haqida fikr bildiring, savol bering yoki muhokamaga qo‘shiling.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            getProjectComments
                        }
                        disabled={
                            project_comment_isLoading
                        }
                        className="
                            inline-flex
                            min-h-[38px]
                            items-center
                            justify-center
                            gap-2
                            self-start
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-3.5
                            py-2
                            text-[10px]
                            font-black
                            text-gray-500
                            transition

                            hover:border-indigo-400/20
                            hover:bg-indigo-500/[0.05]
                            hover:text-indigo-300

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            md:self-auto
                        "
                    >
                        <RefreshCw
                            size={14}
                            className={
                                project_comment_isLoading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Yangilash
                    </button>

                </div>


                {/* =================================================
                    DISCUSSION LAYOUT
                ================================================== */}

                <div
                    className="
                        mt-7
                        grid
                        w-full
                        gap-6

                        xl:grid-cols-[minmax(0,1fr)_320px]
                        xl:items-start
                    "
                >

                    {/* =================================================
                        LEFT — COMMENT FORM + COMMENTS
                    ================================================== */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                        {/* =============================================
                            COMMENT FORM
                        ============================================== */}

                        <div
                            className="
                                relative
                                w-full
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-white/[0.07]
                                bg-white/[0.018]
                                p-4

                                sm:p-5
                            "
                        >

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-20
                                    -top-20
                                    h-44
                                    w-44
                                    rounded-full
                                    bg-indigo-500/[0.06]
                                    blur-[70px]
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    items-start
                                    gap-3

                                    sm:gap-4
                                "
                            >

                                <img
                                    src={
                                        currentUserAvatar
                                    }
                                    alt={
                                        user?.username
                                        ||
                                        "Current user"
                                    }
                                    onError={
                                        handleUserImageError
                                    }
                                    className="
                                        h-11
                                        w-11
                                        shrink-0
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-gray-900
                                        object-cover

                                        sm:h-12
                                        sm:w-12
                                    "
                                />


                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    <div
                                        className="
                                            relative
                                        "
                                    >

                                        <textarea
                                            rows={4}
                                            value={
                                                newCommentText
                                            }
                                            onChange={(
                                                event
                                            ) => {

                                                setNewCommentText(
                                                    event.target.value
                                                );


                                                if (
                                                    submitError
                                                ) {

                                                    setSubmitError(
                                                        ""
                                                    );
                                                }
                                            }}
                                            disabled={
                                                isSubmitting
                                                ||
                                                !isLoggedIn
                                            }
                                            placeholder={
                                                isLoggedIn

                                                    ? "Loyiha haqida fikringizni yozing..."

                                                    : "Sharh qoldirish uchun tizimga kiring..."
                                            }
                                            className="
                                                min-h-[120px]
                                                w-full
                                                resize-none
                                                rounded-2xl
                                                border
                                                border-white/[0.07]
                                                bg-black/20
                                                px-4
                                                py-3.5
                                                text-sm
                                                font-medium
                                                leading-6
                                                text-white
                                                outline-none
                                                transition

                                                placeholder:text-gray-700

                                                focus:border-indigo-400/30
                                                focus:bg-black/30
                                                focus:ring-4
                                                focus:ring-indigo-500/[0.05]

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        />


                                        {isLoggedIn && (
                                            <span
                                                className="
                                                    absolute
                                                    bottom-3
                                                    right-3
                                                    rounded-lg
                                                    bg-black/50
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    newCommentText.length
                                                }
                                            </span>
                                        )}

                                    </div>


                                    {/* ERROR */}

                                    {submitError && (
                                        <div
                                            className="
                                                mt-3
                                                flex
                                                items-start
                                                gap-2
                                                rounded-xl
                                                border
                                                border-red-400/20
                                                bg-red-500/[0.06]
                                                p-3
                                                text-xs
                                                font-semibold
                                                text-red-300
                                            "
                                        >
                                            <AlertTriangle
                                                size={15}
                                                className="
                                                    shrink-0
                                                "
                                            />

                                            {
                                                submitError
                                            }
                                        </div>
                                    )}


                                    {/* FOOTER */}

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            flex-col
                                            gap-3

                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-[10px]
                                                font-medium
                                                text-gray-700
                                            "
                                        >
                                            <Sparkles
                                                size={13}
                                                className="
                                                    text-indigo-500
                                                "
                                            />

                                            `$tag` orqali mavzuni ajratib ko‘rsatishingiz mumkin.
                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                addProjectComment
                                            }
                                            disabled={
                                                isSubmitting
                                                ||
                                                !isLoggedIn
                                                ||
                                                !newCommentText
                                                    .trim()
                                            }
                                            className="
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
                                                transition

                                                hover:bg-indigo-500

                                                active:scale-[0.98]

                                                disabled:cursor-not-allowed
                                                disabled:border-white/[0.05]
                                                disabled:bg-white/[0.04]
                                                disabled:text-gray-600
                                                disabled:shadow-none
                                            "
                                        >

                                            {isSubmitting ? (
                                                <Loader2
                                                    size={15}
                                                    className="
                                                        animate-spin
                                                    "
                                                />
                                            ) : (
                                                <Send
                                                    size={15}
                                                />
                                            )}


                                            {
                                                isLoggedIn

                                                    ? (
                                                        isSubmitting

                                                            ? "Yuborilmoqda..."

                                                            : "Sharh yuborish"
                                                    )

                                                    : "Kirish kerak"
                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =============================================
                            COMMENTS
                        ============================================== */}

                        <div
                            className="
                                mt-6
                                w-full
                            "
                        >

                            {project_comment_error ? (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-red-400/20
                                        bg-red-500/[0.05]
                                        px-5
                                        py-10
                                        text-center
                                    "
                                >

                                    <AlertTriangle
                                        size={36}
                                        className="
                                            mx-auto
                                            text-red-300
                                        "
                                    />


                                    <h3
                                        className="
                                            mt-4
                                            text-base
                                            font-black
                                            text-white
                                        "
                                    >
                                        Sharhlarni yuklab bo‘lmadi
                                    </h3>


                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            font-medium
                                            text-red-300/70
                                        "
                                    >
                                        {
                                            project_comment_error
                                        }
                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            getProjectComments
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
                                            transition

                                            hover:bg-red-500/[0.12]
                                        "
                                    >
                                        <RefreshCw
                                            size={14}
                                        />

                                        Qayta urinish
                                    </button>

                                </div>

                            ) : project_comment_isLoading ? (

                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        py-16
                                    "
                                >
                                    <Loader2
                                        size={30}
                                        className="
                                            animate-spin
                                            text-indigo-400
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-xs
                                            font-semibold
                                            text-gray-600
                                        "
                                    >
                                        Sharhlar yuklanmoqda...
                                    </p>
                                </div>

                            ) : comments.length === 0 ? (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-dashed
                                        border-white/[0.07]
                                        bg-white/[0.012]
                                        px-5
                                        py-14
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
                                            border-indigo-400/15
                                            bg-indigo-500/[0.05]
                                            text-indigo-400
                                        "
                                    >
                                        <MessageCircle
                                            size={25}
                                        />
                                    </div>


                                    <h3
                                        className="
                                            mt-4
                                            text-base
                                            font-black
                                            text-white
                                        "
                                    >
                                        Hozircha sharh yo‘q
                                    </h3>


                                    <p
                                        className="
                                            mx-auto
                                            mt-2
                                            max-w-md
                                            text-xs
                                            font-medium
                                            leading-6
                                            text-gray-600
                                        "
                                    >
                                        Loyiha bo‘yicha birinchi bo‘lib fikringizni bildiring.
                                    </p>

                                </div>

                            ) : (

                                <div
                                    className="
                                        space-y-3
                                    "
                                >

                                    {comments.map(
                                        (
                                            comment
                                        ) => (
                                            <ProjectCommentCard
                                                key={
                                                    comment.id
                                                }
                                                comment={
                                                    comment
                                                }
                                                currentUser={
                                                    user
                                                }
                                                isLoggedIn={
                                                    isLoggedIn
                                                }
                                                onEdit={
                                                    handleEditClick
                                                }
                                                onDelete={
                                                    handleDeleteClick
                                                }
                                            />
                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT INFO

                        Bu card commentlarni siqmaydi:
                        faqat XL ekranda chiqadi.
                    ================================================== */}

                    <aside
                        className="
                            hidden

                            xl:block
                        "
                    >

                        <div
                            className="
                                sticky
                                top-24
                                space-y-4
                            "
                        >

                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.018]
                                    p-5
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
                                            grid
                                            h-10
                                            w-10
                                            place-items-center
                                            rounded-xl
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            text-indigo-300
                                        "
                                    >
                                        <MessageSquareText
                                            size={18}
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
                                            Discussion
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[10px]
                                                font-medium
                                                text-gray-600
                                            "
                                        >
                                            Community feedback
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        border-t
                                        border-white/[0.06]
                                        pt-5
                                    "
                                >

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                            text-white
                                        "
                                    >
                                        {
                                            comments.length
                                        }
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-gray-600
                                        "
                                    >
                                        Jami sharh
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    rounded-[22px]
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.035]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-indigo-300
                                    "
                                >
                                    <Sparkles
                                        size={15}
                                    />

                                    <span
                                        className="
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                        "
                                    >
                                        F.Society tip
                                    </span>
                                </div>


                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        font-medium
                                        leading-6
                                        text-gray-600
                                    "
                                >
                                    Fikr yozayotganda loyiha muallifiga aniq savol yoki konstruktiv taklif qoldirishga harakat qiling.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>


            {/* =================================================
                EDIT MODAL
            ================================================== */}

            <CommentEditModal
                isOpen={
                    isEditModalOpen
                }
                comment={
                    editingComment
                }
                value={
                    editCommentText
                }
                onChange={
                    setEditCommentText
                }
                onClose={
                    handleCloseEditModal
                }
                onSave={
                    handleUpdateComment
                }
                isUpdating={
                    isUpdating
                }
                error={
                    updateError
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
                    commentToDelete?.body

                        ? `${
                            commentToDelete
                                .body
                                .slice(
                                    0,
                                    55
                                )
                        }${
                            commentToDelete
                                .body
                                .length >
                            55

                                ? "..."

                                : ""
                        }`

                        : "Sharh"
                }
                isProcessing={
                    isDeleting
                }
            />

        </section>
    );
};


export default ProjectDiscussion;