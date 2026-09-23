// src/components/posts/PostDetail.jsx

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
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    AlertTriangle,
    Bookmark,
    BookOpen,
    Check,
    Clock,
    Copy,
    Edit3,
    Eye,
    FileText,
    Globe2,
    Heart,
    Link2,
    Loader2,
    MessageCircle,
    Settings2,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserRound,
} from "lucide-react";

import PostService from "../../services/post";

import {
    getPostDetailFailure,
    getPostDetailStart,
    getPostDetailSuccess,
    togglePostLikeFailure,
    togglePostLikeStart,
    togglePostLikeSuccess,
    updatePostDetailLocal,
} from "../../features/posts";

import timeAgo from "../../utils/timeAgo";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

import {
    siteToast,
} from "../ui/AuthToast";

import DeleteConfirmationModal from "../DeleteConfirmationModal";

import CreatePostModal from "./CreatePostModal";

import {
    PostCommentsSection,
} from "./comments";


// =========================================================
// SELECTORS
// =========================================================

const selectPostState = (state) =>
    state.post;

const selectAuthState = (state) =>
    state.auth;


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value
) => {
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
// STRIP HTML
// =========================================================

const stripHtml = (
    html = ""
) => {
    return String(
        html
    )
        .replace(
            /<style[^>]*>.*?<\/style>/gis,
            " "
        )
        .replace(
            /<script[^>]*>.*?<\/script>/gis,
            " "
        )
        .replace(
            /<[^>]+>/g,
            " "
        )
        .replace(
            /&nbsp;/g,
            " "
        )
        .replace(
            /&amp;/g,
            "&"
        )
        .replace(
            /&lt;/g,
            "<"
        )
        .replace(
            /&gt;/g,
            ">"
        )
        .replace(
            /&quot;/g,
            "\""
        )
        .replace(
            /&#039;/g,
            "'"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    const data =
        error?.serverData ||
        error?.response?.data;

    if (
        typeof data === "string" &&
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
        data &&
        typeof data === "object"
    ) {
        const firstValue =
            Object.values(
                data
            )[0];

        if (
            Array.isArray(
                firstValue
            ) &&
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
// POST TYPE
// =========================================================

const getPostTypeDisplay = (
    typeKey
) => {
    switch (
        typeKey
    ) {
        case "TEX":
            return {
                name:
                    "Texnologiya",

                icon:
                    "fa-solid fa-microchip",

                className:
                    "border-indigo-400/30 bg-indigo-500/10 text-indigo-300",
            };

        case "SPO":
            return {
                name:
                    "Sport",

                icon:
                    "fa-solid fa-dumbbell",

                className:
                    "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
            };

        case "BIZ":
            return {
                name:
                    "Biznes",

                icon:
                    "fa-solid fa-briefcase",

                className:
                    "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
            };

        case "ENT":
            return {
                name:
                    "O‘yin-kulgi",

                icon:
                    "fa-solid fa-gamepad",

                className:
                    "border-pink-400/30 bg-pink-500/10 text-pink-300",
            };

        case "OTH":
            return {
                name:
                    "Boshqa",

                icon:
                    "fa-solid fa-layer-group",

                className:
                    "border-gray-500/30 bg-gray-500/10 text-gray-300",
            };

        default:
            return {
                name:
                    "Noma’lum",

                icon:
                    "fa-solid fa-circle-question",

                className:
                    "border-gray-600/30 bg-gray-800/50 text-gray-400",
            };
    }
};


// =========================================================
// AUTHOR NAME
// =========================================================

const getAuthorName = (
    author
) => {
    const fullName =
        `${
            author?.first_name ||
            ""
        } ${
            author?.last_name ||
            ""
        }`
            .trim();

    return (
        fullName ||
        author?.username ||
        "Anonim foydalanuvchi"
    );
};


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    tone = "indigo",
}) => {
    const tones = {
        pink:
            "border-pink-400/20 bg-pink-500/10 text-pink-300",

        cyan:
            "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",

        emerald:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

        indigo:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",
    };

    return (
        <div
            className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-4
                transition-all
                duration-200
                hover:border-white/[0.11]
                hover:bg-white/[0.04]
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >
                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        ${
                            tones[tone] ||
                            tones.indigo
                        }
                    `}
                >
                    <Icon
                        size={20}
                    />
                </div>

                <div
                    className="
                        min-w-0
                    "
                >
                    <p
                        className="
                            text-xl
                            font-black
                            text-white
                        "
                    >
                        {
                            safeNumber(
                                value
                            )
                                .toLocaleString()
                        }
                    </p>

                    <p
                        className="
                            mt-0.5
                            text-xs
                            font-semibold
                            text-gray-500
                        "
                    >
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// ARTICLE META
//
// MUHIM:
// Bu CARD EMAS.
// Hero qismida yengil metadata qatori.
// =========================================================

const ArticleMeta = ({
    wordCount,
    readingTime,
    copied,
    onCopy,
}) => {
    return (
        <div
            className="
                flex
                flex-wrap
                items-center
                justify-start
                gap-x-4
                gap-y-3
                text-[11px]
                font-bold
                text-gray-500
                lg:justify-end
            "
        >

            {/* READ TIME */}

            <div
                className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    transition
                    hover:text-indigo-300
                "
                title="Taxminiy o‘qish vaqti"
            >
                <BookOpen
                    size={14}
                    className="
                        text-indigo-400
                    "
                />

                <span
                    className="
                        text-gray-300
                    "
                >
                    {
                        readingTime
                    }
                </span>

                <span>
                    min read
                </span>
            </div>


            {/* DIVIDER */}

            <span
                className="
                    hidden
                    h-4
                    w-px
                    bg-white/[0.08]
                    sm:block
                "
            />


            {/* WORDS */}

            <div
                className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    transition
                    hover:text-purple-300
                "
                title="Postdagi so‘zlar soni"
            >
                <FileText
                    size={14}
                    className="
                        text-purple-400
                    "
                />

                <span
                    className="
                        text-gray-300
                    "
                >
                    {
                        wordCount
                            .toLocaleString()
                    }
                </span>

                <span>
                    words
                </span>
            </div>


            {/* DIVIDER */}

            <span
                className="
                    hidden
                    h-4
                    w-px
                    bg-white/[0.08]
                    sm:block
                "
            />


            {/* PUBLIC */}

            <div
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-gray-500
                "
                title="Post hammaga ochiq"
            >
                <Globe2
                    size={14}
                    className="
                        text-emerald-400
                    "
                />

                <span
                    className="
                        text-gray-300
                    "
                >
                    Public
                </span>
            </div>


            {/* DIVIDER */}

            <span
                className="
                    hidden
                    h-4
                    w-px
                    bg-white/[0.08]
                    sm:block
                "
            />


            {/* COPY */}

            <button
                type="button"
                onClick={
                    onCopy
                }
                title="Post havolasini nusxalash"
                className={`
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    px-1
                    py-1
                    transition-all

                    ${
                        copied
                            ? "text-emerald-300"
                            : "text-gray-500 hover:text-indigo-300"
                    }
                `}
            >
                {copied ? (
                    <Check
                        size={14}
                    />
                ) : (
                    <Link2
                        size={14}
                    />
                )}

                <span>
                    {
                        copied
                            ? "Nusxalandi"
                            : "Copy link"
                    }
                </span>
            </button>

        </div>
    );
};


// =========================================================
// OWNER ACTION PANEL
// =========================================================

const OwnerActionPanel = ({
    onEdit,
    onDelete,
    isUpdating,
    isDeleting,
    compact = false,
}) => {
    return (
        <section
            className={`
                relative
                overflow-hidden
                border
                border-indigo-400/15
                bg-gradient-to-br
                from-indigo-500/[0.08]
                via-[#101522]/90
                to-purple-500/[0.05]
                shadow-xl
                shadow-black/20

                ${
                    compact
                        ? "rounded-2xl p-4"
                        : "rounded-3xl p-5"
                }
            `}
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-indigo-500/15
                    blur-[55px]
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
                        flex
                        items-start
                        justify-between
                        gap-4
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
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-indigo-400/20
                                bg-indigo-500/10
                                text-indigo-300
                            "
                        >
                            <Settings2
                                size={19}
                            />
                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    font-black
                                    text-white
                                "
                            >
                                Maqolani boshqarish
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                Bu post sizga tegishli
                            </p>
                        </div>

                    </div>


                    <span
                        className="
                            hidden
                            rounded-full
                            border
                            border-emerald-400/20
                            bg-emerald-500/[0.08]
                            px-2.5
                            py-1
                            text-[8px]
                            font-black
                            uppercase
                            tracking-wider
                            text-emerald-300
                            sm:inline-flex
                        "
                    >
                        Owner
                    </span>

                </div>


                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                    "
                >

                    {/* EDIT */}

                    <button
                        type="button"
                        onClick={
                            onEdit
                        }
                        disabled={
                            isUpdating ||
                            isDeleting
                        }
                        className="
                            inline-flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-400/20
                            bg-indigo-500/[0.08]
                            px-3
                            py-2.5
                            text-[10px]
                            font-black
                            text-indigo-200
                            transition-all
                            duration-200

                            hover:border-indigo-400/40
                            hover:bg-indigo-500/[0.14]
                            hover:text-white

                            active:scale-[0.97]

                            disabled:cursor-not-allowed
                            disabled:opacity-45
                        "
                    >
                        {isUpdating ? (
                            <Loader2
                                size={15}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <Edit3
                                size={15}
                            />
                        )}

                        {
                            isUpdating
                                ? "Saqlanmoqda"
                                : "Tahrirlash"
                        }
                    </button>


                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={
                            onDelete
                        }
                        disabled={
                            isDeleting ||
                            isUpdating
                        }
                        className="
                            inline-flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/20
                            bg-red-500/[0.07]
                            px-3
                            py-2.5
                            text-[10px]
                            font-black
                            text-red-300
                            transition-all
                            duration-200

                            hover:border-red-400/40
                            hover:bg-red-500/[0.13]
                            hover:text-red-200

                            active:scale-[0.97]

                            disabled:cursor-not-allowed
                            disabled:opacity-45
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

                        {
                            isDeleting
                                ? "O‘chirilmoqda"
                                : "O‘chirish"
                        }
                    </button>

                </div>

            </div>

        </section>
    );
};


// =========================================================
// SKELETON
// =========================================================

const PostDetailSkeleton = () => {
    return (
        <div
            className="
                min-h-screen
                bg-[#05070a]
                px-4
                py-24
                text-white
            "
        >
            <div
                className="
                    container
                    mx-auto
                    max-w-[1320px]
                "
            >
                <div
                    className="
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-gray-800
                        bg-gray-900/60
                        p-6
                    "
                >
                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-12
                        "
                    >
                        <div
                            className="
                                lg:col-span-8
                            "
                        >
                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        h-16
                                        w-16
                                        animate-pulse
                                        rounded-2xl
                                        bg-gray-800
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
                                            h-5
                                            w-48
                                            animate-pulse
                                            rounded-xl
                                            bg-gray-800
                                        "
                                    />

                                    <div
                                        className="
                                            h-4
                                            w-32
                                            animate-pulse
                                            rounded-xl
                                            bg-gray-800
                                        "
                                    />
                                </div>
                            </div>


                            <div
                                className="
                                    mt-8
                                    h-10
                                    w-3/4
                                    animate-pulse
                                    rounded-2xl
                                    bg-gray-800
                                "
                            />


                            <div
                                className="
                                    mt-8
                                    space-y-4
                                "
                            >
                                <div
                                    className="
                                        h-4
                                        w-full
                                        animate-pulse
                                        rounded-xl
                                        bg-gray-800
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-11/12
                                        animate-pulse
                                        rounded-xl
                                        bg-gray-800
                                    "
                                />
                            </div>
                        </div>


                        <div
                            className="
                                lg:col-span-4
                            "
                        >
                            <div
                                className="
                                    h-64
                                    animate-pulse
                                    rounded-3xl
                                    bg-gray-800
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// =========================================================
// POST DETAIL
// =========================================================

const PostDetail = () => {
    // =====================================================
    // ROUTER
    // =====================================================

    const {
        username,
        slug,
    } = useParams();


    const navigate =
        useNavigate();


    const dispatch =
        useDispatch();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
        user: currentUser,
    } = useSelector(
        selectAuthState
    );


    // =====================================================
    // POST STATE
    // =====================================================

    const {
        postDetail: postData,
        detail_isLoading: isLoading,
        detail_error: error,
    } = useSelector(
        selectPostState
    );


    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        isLiking,
        setIsLiking,
    ] = useState(
        false
    );


    const [
        isEditModalOpen,
        setIsEditModalOpen,
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
        isUpdating,
        setIsUpdating,
    ] = useState(
        false
    );


    const [
        isLinkCopied,
        setIsLinkCopied,
    ] = useState(
        false
    );


    // =====================================================
    // AUTHOR
    // =====================================================

    const author =
        postData?.user ||
        {};


    const authorName =
        getAuthorName(
            author
        );


    const authorImage =
        useMemo(
            () => {
                return getUserAvatarUrl(
                    author
                );
            },
            [
                author,
            ]
        );


    // =====================================================
    // OWNER
    // =====================================================

    const isOwner =
        useMemo(
            () => {
                if (
                    !currentUser ||
                    !author
                ) {
                    return false;
                }


                if (
                    currentUser?.id &&
                    author?.id
                ) {
                    return (
                        Number(
                            currentUser.id
                        )
                        ===
                        Number(
                            author.id
                        )
                    );
                }


                return Boolean(
                    currentUser?.username &&
                    author?.username &&
                    currentUser.username ===
                        author.username
                );
            },
            [
                currentUser,
                author,
            ]
        );


    // =====================================================
    // POST TYPE
    // =====================================================

    const typeDisplay =
        useMemo(
            () => {
                return getPostTypeDisplay(
                    postData?.post_type
                );
            },
            [
                postData?.post_type,
            ]
        );


    // =====================================================
    // ARTICLE META
    // =====================================================

    const articleMeta =
        useMemo(
            () => {
                const plainText =
                    stripHtml(
                        postData?.content ||
                        ""
                    );


                const words =
                    plainText
                        ? plainText
                            .split(/\s+/)
                            .filter(Boolean)
                            .length
                        : 0;


                return {
                    words,

                    readingTime:
                        Math.max(
                            1,
                            Math.ceil(
                                words / 200
                            )
                        ),
                };
            },
            [
                postData?.content,
            ]
        );


    // =====================================================
    // LOAD DETAIL
    // =====================================================

    const getDetail =
        useCallback(
            async () => {
                if (
                    !username ||
                    !slug
                ) {
                    return;
                }


                dispatch(
                    getPostDetailStart()
                );


                try {
                    const response =
                        await PostService
                            .getPostDetail(
                                username,
                                slug
                            );


                    dispatch(
                        getPostDetailSuccess(
                            response
                        )
                    );

                } catch (
                    requestError
                ) {
                    console.error(
                        "Post detail olishda xato:",
                        requestError
                    );


                    dispatch(
                        getPostDetailFailure(
                            getErrorMessage(
                                requestError,
                                "Postni yuklashda xato yuz berdi."
                            )
                        )
                    );
                }
            },
            [
                username,
                slug,
                dispatch,
            ]
        );


    useEffect(
        () => {
            getDetail();
        },
        [
            getDetail,
        ]
    );


    // =====================================================
    // COPY LINK
    // =====================================================

    const handleCopyPostLink =
        async () => {
            const postUrl =
                window.location.href;


            try {
                if (
                    navigator
                        ?.clipboard
                        ?.writeText
                ) {
                    await navigator
                        .clipboard
                        .writeText(
                            postUrl
                        );
                } else {
                    const input =
                        document.createElement(
                            "textarea"
                        );

                    input.value =
                        postUrl;

                    input.style.position =
                        "fixed";

                    input.style.opacity =
                        "0";

                    document.body.appendChild(
                        input
                    );

                    input.select();

                    document.execCommand(
                        "copy"
                    );

                    document.body.removeChild(
                        input
                    );
                }


                setIsLinkCopied(
                    true
                );


                siteToast.success(
                    "Post havolasi nusxalandi.",
                    {
                        title:
                            "Havola nusxalandi",

                        duration:
                            2600,
                    }
                );


                window.setTimeout(
                    () => {
                        setIsLinkCopied(
                            false
                        );
                    },
                    1800
                );

            } catch (
                copyError
            ) {
                console.error(
                    "Link copy xato:",
                    copyError
                );


                siteToast.error(
                    "Post havolasini nusxalab bo‘lmadi.",
                    {
                        title:
                            "Nusxalashda xato",
                    }
                );
            }
        };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleUpdatePost =
        async (
            formData
        ) => {
            if (
                !isOwner ||
                !postData?.id ||
                isUpdating
            ) {
                return false;
            }


            setIsUpdating(
                true
            );


            const toastId =
                siteToast.loading(
                    "Postdagi o‘zgarishlar saqlanmoqda...",
                    {
                        title:
                            "Post yangilanmoqda",
                    }
                );


            try {
                const updatedPost =
                    await PostService
                        .updatePost(
                            username,
                            postData.slug,
                            formData
                        );


                dispatch(
                    getPostDetailSuccess(
                        updatedPost
                    )
                );


                setIsEditModalOpen(
                    false
                );


                siteToast.success(
                    "Postingizdagi o‘zgarishlar muvaffaqiyatli saqlandi.",
                    {
                        id:
                            toastId,

                        title:
                            "Post yangilandi",

                        duration:
                            3600,
                    }
                );


                if (
                    updatedPost?.slug &&
                    updatedPost.slug !==
                        slug
                ) {
                    navigate(
                        `/${username}/post/${updatedPost.slug}/`,
                        {
                            replace:
                                true,
                        }
                    );
                }


                return true;

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError,
                        "Postni tahrirlashda xato yuz berdi."
                    );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Post yangilanmadi",

                        duration:
                            5000,
                    }
                );


                throw requestError;

            } finally {
                setIsUpdating(
                    false
                );
            }
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleConfirmDelete =
        async () => {
            if (
                !isOwner ||
                !postData?.id ||
                isDeleting
            ) {
                return;
            }


            setIsDeleting(
                true
            );


            const toastId =
                siteToast.loading(
                    "Post o‘chirilmoqda...",
                    {
                        title:
                            "Post o‘chirilmoqda",
                    }
                );


            try {
                await PostService
                    .deletePost(
                        username,
                        postData.slug
                    );


                setIsDeleteModalOpen(
                    false
                );


                siteToast.success(
                    "Postingiz muvaffaqiyatli o‘chirildi.",
                    {
                        id:
                            toastId,

                        title:
                            "Post o‘chirildi",

                        duration:
                            3500,
                    }
                );


                navigate(
                    `/${
                        currentUser?.username ||
                        username
                    }/profile/`,
                    {
                        replace:
                            true,
                    }
                );

            } catch (
                requestError
            ) {
                const message =
                    getErrorMessage(
                        requestError,
                        "Postni o‘chirishda xato yuz berdi."
                    );


                siteToast.error(
                    message,
                    {
                        id:
                            toastId,

                        title:
                            "Post o‘chirilmadi",

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
    // LIKE
    // =====================================================

    const handleLikeToggle =
        async () => {
            if (
                !isLoggedIn
            ) {
                siteToast.warning(
                    "Like bosish uchun avval tizimga kiring.",
                    {
                        title:
                            "Kirish talab qilinadi",
                    }
                );

                return;
            }


            if (
                !postData?.id ||
                isLiking
            ) {
                return;
            }


            const oldIsLiked =
                Boolean(
                    postData
                        ?.is_liked_by_user
                );


            const oldLikesCount =
                safeNumber(
                    postData
                        ?.likes_count
                );


            const nextIsLiked =
                !oldIsLiked;


            const nextLikesCount =
                Math.max(
                    0,
                    oldLikesCount +
                    (
                        nextIsLiked
                            ? 1
                            : -1
                    )
                );


            setIsLiking(
                true
            );


            dispatch(
                togglePostLikeStart()
            );


            dispatch(
                updatePostDetailLocal({
                    is_liked_by_user:
                        nextIsLiked,

                    likes_count:
                        nextLikesCount,
                })
            );


            try {
                const response =
                    await PostService
                        .togglePostLike(
                            postData.id
                        );


                const serverIsLiked =
                    response
                        ?.is_liked_by_user
                    ??
                    response
                        ?.is_liked
                    ??
                    nextIsLiked;


                const serverLikesCount =
                    safeNumber(
                        response
                            ?.likes_count
                        ??
                        response
                            ?.like_count
                        ??
                        nextLikesCount
                    );


                dispatch(
                    togglePostLikeSuccess({
                        post_id:
                            postData.id,

                        is_liked_by_user:
                            Boolean(
                                serverIsLiked
                            ),

                        likes_count:
                            serverLikesCount,
                    })
                );

            } catch (
                requestError
            ) {
                dispatch(
                    updatePostDetailLocal({
                        is_liked_by_user:
                            oldIsLiked,

                        likes_count:
                            oldLikesCount,
                    })
                );


                const message =
                    getErrorMessage(
                        requestError,
                        "Like holatini o‘zgartirishda xato yuz berdi."
                    );


                dispatch(
                    togglePostLikeFailure(
                        message
                    )
                );


                siteToast.error(
                    message,
                    {
                        title:
                            "Like saqlanmadi",
                    }
                );

            } finally {
                setIsLiking(
                    false
                );
            }
        };


    // =====================================================
    // BOOKMARK
    // =====================================================

    const handleBookmarkClick =
        () => {
            siteToast.info(
                "Postni saqlab qolish funksiyasini keyingi bosqichda backend bilan ulaymiz.",
                {
                    title:
                        "Saqlab qolish",
                }
            );
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        isLoading
    ) {
        return (
            <PostDetailSkeleton />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error ||
        !postData
    ) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#05070a]
                    px-4
                    pt-40
                    text-white
                "
            >
                <div
                    className="
                        mx-auto
                        max-w-xl
                        rounded-3xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        p-8
                        text-center
                    "
                >
                    <AlertTriangle
                        className="
                            mx-auto
                            mb-4
                            text-red-300
                        "
                        size={52}
                    />

                    <h1
                        className="
                            text-2xl
                            font-black
                        "
                    >
                        Maqola topilmadi yoki xato yuz berdi
                    </h1>

                    <p
                        className="
                            mt-3
                            text-sm
                            font-semibold
                            text-red-200/80
                        "
                    >
                        {
                            error ||
                            "Noma’lum xato"
                        }
                    </p>

                    <button
                        type="button"
                        onClick={
                            getDetail
                        }
                        className="
                            mt-6
                            rounded-2xl
                            bg-red-600
                            px-5
                            py-3
                            text-sm
                            font-black
                            transition
                            hover:bg-red-500
                        "
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const {
        post_type,
        title,
        content,
        created_at,
        likes_count,
        views_count,
        comments_count,
        is_liked_by_user,
    } = postData;


    const postLikesCount =
        safeNumber(
            likes_count
        );


    const postViewsCount =
        safeNumber(
            views_count
        );


    const postCommentsCount =
        safeNumber(
            comments_count
        );


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#05070a]
                text-white
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
                    bg-[linear-gradient(rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.035)_1px,transparent_1px)]
                    bg-[size:58px_58px]
                    [mask-image:radial-gradient(circle_at_center,black_0%,transparent_75%)]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    left-[24%]
                    top-20
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-indigo-600/[0.08]
                    blur-[130px]
                "
            />


            {/* =================================================
                MAIN
            ================================================== */}

            <main
                className="
                    container
                    relative
                    z-10
                    mx-auto
                    max-w-[1320px]
                    px-4
                    py-24
                "
            >

                <div
                    className="
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-white/[0.07]
                        bg-[#0b1018]/90
                        shadow-[0_40px_110px_rgba(0,0,0,0.45)]
                        backdrop-blur-xl
                    "
                >

                    <div
                        className="
                            grid
                            lg:grid-cols-[minmax(0,1fr)_350px]
                        "
                    >

                        {/* =====================================
                            LEFT CONTENT
                        ====================================== */}

                        <div
                            className="
                                p-5
                                sm:p-8
                                lg:border-r
                                lg:border-white/[0.06]
                                lg:p-10
                            "
                        >

                            {/* =================================
                                HERO
                            ================================== */}

                            <section>

                                {/* AUTHOR + META */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-6
                                        lg:flex-row
                                        lg:items-start
                                        lg:justify-between
                                    "
                                >

                                    {/* AUTHOR */}

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-4
                                        "
                                    >

                                        <Link
                                            to={`/${author?.username}/profile/`}
                                            className="
                                                shrink-0
                                            "
                                        >
                                            <img
                                                src={
                                                    authorImage
                                                }
                                                alt={
                                                    author?.username ||
                                                    "User"
                                                }
                                                onError={
                                                    handleUserImageError
                                                }
                                                className="
                                                    h-14
                                                    w-14
                                                    rounded-2xl
                                                    border
                                                    border-white/[0.09]
                                                    bg-gray-900
                                                    object-cover
                                                    shadow-xl
                                                    shadow-black/30
                                                    sm:h-16
                                                    sm:w-16
                                                "
                                            />
                                        </Link>


                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <Link
                                                to={`/${author?.username}/profile/`}
                                                className="
                                                    block
                                                    truncate
                                                    text-lg
                                                    font-black
                                                    text-white
                                                    transition
                                                    hover:text-indigo-300
                                                    sm:text-xl
                                                "
                                            >
                                                {
                                                    authorName
                                                }
                                            </Link>


                                            <div
                                                className="
                                                    mt-1.5
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-x-3
                                                    gap-y-1
                                                    text-xs
                                                    font-semibold
                                                    text-gray-500
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                    "
                                                >
                                                    <Clock
                                                        size={13}
                                                    />

                                                    {
                                                        timeAgo(
                                                            created_at
                                                        )
                                                    }
                                                </span>


                                                <span
                                                    className="
                                                        h-1
                                                        w-1
                                                        rounded-full
                                                        bg-gray-700
                                                    "
                                                />


                                                <span>
                                                    @{
                                                        author?.username ||
                                                        "unknown"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        CLEAN ARTICLE META
                                        NO CARD
                                    ================================== */}

                                    <ArticleMeta
                                        wordCount={
                                            articleMeta.words
                                        }
                                        readingTime={
                                            articleMeta.readingTime
                                        }
                                        copied={
                                            isLinkCopied
                                        }
                                        onCopy={
                                            handleCopyPostLink
                                        }
                                    />

                                </div>


                                {/* CATEGORY */}

                                <div
                                    className="
                                        mt-7
                                    "
                                >
                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            ${typeDisplay.className}
                                        `}
                                    >
                                        <i
                                            className={
                                                typeDisplay.icon
                                            }
                                        />

                                        {
                                            typeDisplay.name
                                        }
                                    </span>
                                </div>


                                {/* TITLE */}

                                <h1
                                    className="
                                        mt-5
                                        max-w-4xl
                                        bg-gradient-to-r
                                        from-white
                                        via-indigo-100
                                        to-purple-300
                                        bg-clip-text
                                        text-3xl
                                        font-black
                                        leading-[1.1]
                                        tracking-tight
                                        text-transparent
                                        sm:text-4xl
                                        xl:text-5xl
                                    "
                                >
                                    {title}
                                </h1>


                                {/* MOBILE OWNER */}

                                {isOwner && (
                                    <div
                                        className="
                                            mt-6
                                            lg:hidden
                                        "
                                    >
                                        <OwnerActionPanel
                                            compact
                                            onEdit={() =>
                                                setIsEditModalOpen(
                                                    true
                                                )
                                            }
                                            onDelete={() =>
                                                setIsDeleteModalOpen(
                                                    true
                                                )
                                            }
                                            isUpdating={
                                                isUpdating
                                            }
                                            isDeleting={
                                                isDeleting
                                            }
                                        />
                                    </div>
                                )}

                            </section>


                            {/* =================================
                                ARTICLE
                            ================================== */}

                            <article
                                className="
                                    mt-9
                                    max-w-none
                                    rounded-[26px]
                                    border
                                    border-white/[0.07]
                                    bg-black/20
                                    p-5
                                    text-gray-300
                                    shadow-xl
                                    shadow-black/20
                                    sm:p-7

                                    [&_a]:font-bold
                                    [&_a]:text-indigo-300
                                    [&_a:hover]:underline

                                    [&_blockquote]:my-6
                                    [&_blockquote]:rounded-r-xl
                                    [&_blockquote]:border-l-4
                                    [&_blockquote]:border-indigo-400
                                    [&_blockquote]:bg-indigo-500/[0.04]
                                    [&_blockquote]:py-2
                                    [&_blockquote]:pl-4

                                    [&_code]:rounded-md
                                    [&_code]:bg-pink-500/10
                                    [&_code]:px-1.5
                                    [&_code]:py-0.5
                                    [&_code]:text-pink-300

                                    [&_h1]:text-3xl
                                    [&_h1]:font-black
                                    [&_h1]:text-white

                                    [&_h2]:mt-8
                                    [&_h2]:border-b
                                    [&_h2]:border-white/[0.07]
                                    [&_h2]:pb-2
                                    [&_h2]:text-2xl
                                    [&_h2]:font-black
                                    [&_h2]:text-white

                                    [&_h3]:mt-6
                                    [&_h3]:text-xl
                                    [&_h3]:font-black
                                    [&_h3]:text-white

                                    [&_li]:my-1.5

                                    [&_ol]:list-decimal
                                    [&_ol]:pl-6

                                    [&_p]:my-4
                                    [&_p]:leading-8

                                    [&_pre]:my-5
                                    [&_pre]:overflow-x-auto
                                    [&_pre]:rounded-2xl
                                    [&_pre]:border
                                    [&_pre]:border-white/[0.06]
                                    [&_pre]:bg-black/50
                                    [&_pre]:p-4

                                    [&_strong]:text-white

                                    [&_ul]:list-disc
                                    [&_ul]:pl-6
                                "
                                dangerouslySetInnerHTML={{
                                    __html:
                                        content ||
                                        "",
                                }}
                            />


                            {/* =================================
                                COMMENTS
                            ================================== */}

                            <PostCommentsSection
                                postId={
                                    postData.id
                                }
                                postAuthorUsername={
                                    author?.username
                                }
                                currentUser={
                                    currentUser
                                }
                                isLoggedIn={
                                    isLoggedIn
                                }
                            />

                        </div>


                        {/* =====================================
                            SIDEBAR
                        ====================================== */}

                        <aside
                            className="
                                bg-black/[0.08]
                                p-5
                                sm:p-7
                            "
                        >

                            <div
                                className="
                                    space-y-5
                                    lg:sticky
                                    lg:top-24
                                "
                            >

                                {/* =================================
                                    OWNER MANAGEMENT
                                ================================== */}

                                {isOwner && (
                                    <div
                                        className="
                                            hidden
                                            lg:block
                                        "
                                    >
                                        <OwnerActionPanel
                                            onEdit={() =>
                                                setIsEditModalOpen(
                                                    true
                                                )
                                            }
                                            onDelete={() =>
                                                setIsDeleteModalOpen(
                                                    true
                                                )
                                            }
                                            isUpdating={
                                                isUpdating
                                            }
                                            isDeleting={
                                                isDeleting
                                            }
                                        />
                                    </div>
                                )}


                                {/* =================================
                                    STATISTICS
                                ================================== */}

                                <section
                                    className="
                                        rounded-3xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            mb-4
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
                                                border-indigo-400/20
                                                bg-indigo-500/10
                                                text-indigo-300
                                            "
                                        >
                                            <ShieldCheck
                                                size={19}
                                            />
                                        </div>


                                        <div>
                                            <h3
                                                className="
                                                    text-sm
                                                    font-black
                                                    text-white
                                                "
                                            >
                                                Statistika
                                            </h3>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[10px]
                                                    text-gray-600
                                                "
                                            >
                                                Post faolligi
                                            </p>
                                        </div>
                                    </div>


                                    <div
                                        className="
                                            space-y-3
                                        "
                                    >

                                        {/* LIKE */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleLikeToggle
                                            }
                                            disabled={
                                                isLiking
                                            }
                                            aria-pressed={
                                                Boolean(
                                                    is_liked_by_user
                                                )
                                            }
                                            className={`
                                                group
                                                w-full
                                                rounded-2xl
                                                border
                                                p-4
                                                text-left
                                                transition-all

                                                active:scale-[0.98]

                                                disabled:cursor-not-allowed
                                                disabled:opacity-70

                                                ${
                                                    is_liked_by_user
                                                        ? `
                                                            border-pink-400/30
                                                            bg-pink-500/[0.11]
                                                        `
                                                        : `
                                                            border-white/[0.07]
                                                            bg-white/[0.025]

                                                            hover:border-pink-400/25
                                                            hover:bg-pink-500/[0.06]
                                                        `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                "
                                            >

                                                <div
                                                    className={`
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        border

                                                        ${
                                                            is_liked_by_user
                                                                ? `
                                                                    border-pink-400/30
                                                                    bg-pink-500/15
                                                                    text-pink-300
                                                                `
                                                                : `
                                                                    border-white/[0.07]
                                                                    bg-black/20
                                                                    text-gray-500
                                                                    group-hover:text-pink-300
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {isLiking ? (
                                                        <Loader2
                                                            size={20}
                                                            className="
                                                                animate-spin
                                                            "
                                                        />
                                                    ) : (
                                                        <Heart
                                                            size={21}
                                                            className={
                                                                is_liked_by_user
                                                                    ? "fill-pink-400 text-pink-400"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>


                                                <div>
                                                    <p
                                                        className="
                                                            text-xl
                                                            font-black
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            postLikesCount
                                                                .toLocaleString()
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-xs
                                                            font-semibold
                                                            text-gray-500
                                                        "
                                                    >
                                                        {
                                                            is_liked_by_user
                                                                ? "Sizga yoqdi"
                                                                : "Like bosish"
                                                        }
                                                    </p>
                                                </div>

                                            </div>

                                        </button>


                                        <StatCard
                                            icon={
                                                Eye
                                            }
                                            label="marta ko‘rilgan"
                                            value={
                                                postViewsCount
                                            }
                                            tone="cyan"
                                        />


                                        <StatCard
                                            icon={
                                                MessageCircle
                                            }
                                            label="ta sharh"
                                            value={
                                                postCommentsCount
                                            }
                                            tone="emerald"
                                        />

                                    </div>

                                </section>


                                {/* =================================
                                    AUTHOR
                                ================================== */}

                                <section
                                    className="
                                        rounded-3xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <UserRound
                                            size={17}
                                            className="
                                                text-indigo-300
                                            "
                                        />

                                        <h3
                                            className="
                                                text-sm
                                                font-black
                                            "
                                        >
                                            Muallif
                                        </h3>
                                    </div>


                                    <Link
                                        to={`/${author?.username}/profile/`}
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-4
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-black/20
                                            p-4
                                            transition

                                            hover:border-indigo-400/25
                                            hover:bg-indigo-500/[0.04]
                                        "
                                    >

                                        <img
                                            src={
                                                authorImage
                                            }
                                            alt={
                                                author?.username ||
                                                "User"
                                            }
                                            onError={
                                                handleUserImageError
                                            }
                                            className="
                                                h-14
                                                w-14
                                                shrink-0
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
                                                    text-sm
                                                    font-black
                                                    text-white
                                                    transition
                                                    group-hover:text-indigo-300
                                                "
                                            >
                                                {
                                                    authorName
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-[10px]
                                                    font-semibold
                                                    text-gray-600
                                                "
                                            >
                                                @{
                                                    author?.username ||
                                                    "unknown"
                                                }
                                            </p>
                                        </div>

                                    </Link>

                                </section>


                                {/* =================================
                                    BOOKMARK
                                ================================== */}

                                <button
                                    type="button"
                                    onClick={
                                        handleBookmarkClick
                                    }
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-5
                                        py-3
                                        text-xs
                                        font-black
                                        text-gray-400
                                        transition-all

                                        hover:border-indigo-400/25
                                        hover:bg-indigo-500/[0.06]
                                        hover:text-indigo-300

                                        active:scale-[0.98]
                                    "
                                >
                                    <Bookmark
                                        size={17}
                                    />

                                    Saqlab qolish
                                </button>


                                {/* =================================
                                    FSOCIETY INFO
                                ================================== */}

                                <section
                                    className="
                                        rounded-3xl
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.045]
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Sparkles
                                            size={17}
                                            className="
                                                text-indigo-300
                                            "
                                        />

                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.16em]
                                                text-indigo-300
                                            "
                                        >
                                            F.Society Knowledge
                                        </p>
                                    </div>


                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Bilim ulashish community kuchini oshiradi.
                                        Foydali postlarga like bosing va muhokamada
                                        qatnashing.
                                    </p>

                                </section>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>


            {/* =================================================
                EDIT MODAL
            ================================================== */}

            {isOwner && (
                <CreatePostModal
                    isOpen={
                        isEditModalOpen
                    }
                    onClose={() => {
                        if (
                            !isUpdating
                        ) {
                            setIsEditModalOpen(
                                false
                            );
                        }
                    }}
                    onSubmit={
                        handleUpdatePost
                    }
                    initialData={{
                        post_type:
                            post_type,

                        title:
                            title,

                        content:
                            content,
                    }}
                    isSubmitting={
                        isUpdating
                    }
                />
            )}


            {/* =================================================
                DELETE MODAL
            ================================================== */}

            {isOwner && (
                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }
                    onClose={() => {
                        if (
                            !isDeleting
                        ) {
                            setIsDeleteModalOpen(
                                false
                            );
                        }
                    }}
                    onConfirm={
                        handleConfirmDelete
                    }
                    itemTitle={
                        title
                    }
                    isProcessing={
                        isDeleting
                    }
                />
            )}

        </div>
    );
};


export default PostDetail;