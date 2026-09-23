// src/components/profile/ProfilePosts.jsx

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
    getPostFailure,
    getPostStart,
    getPostSuccess,

    createPostStart,
    createPostSuccess,
    createPostFailure,
} from "../../features/posts";

import PostService from "../../services/post";

import {
    getPostTypeIcon,
} from "../../utils/colorUtils";

import timeAgo from "../../utils/timeAgo";


// =========================================================
// CLEAN ARCHITECTURE
//
// ProfilePosts profile ichida qoladi.
// Postga tegishli modal esa posts ichida.
// =========================================================

import CreatePostModal from "../posts/CreatePostModal";


import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    FileText,
    Heart,
    MessageCircle,
    MessageSquarePlus,
    Plus,
    RefreshCcw,
    Search,
    Sparkles,
} from "lucide-react";


// =========================================================
// CONFIG
// =========================================================

const PAGE_SIZE = 5;


// =========================================================
// REDUX SELECTOR
// =========================================================

const selectPostState = (
    state
) => state.post;


// =========================================================
// POST TYPE NAME
// =========================================================

const getPostTypeDisplayName = (
    typeKey
) => {

    switch (
        typeKey
    ) {

        case "TEX":
            return "Texnologiya";

        case "SPO":
            return "Sport";

        case "BIZ":
            return "Biznes";

        case "ENT":
            return "O‘yin-kulgi";

        case "OTH":
            return "Boshqa";

        default:
            return "Noma’lum tur";
    }
};


// =========================================================
// POST TYPE STYLE
// =========================================================

const getPostTypeStyle = (
    typeKey
) => {

    switch (
        typeKey
    ) {

        case "TEX":

            return (
                "border-indigo-400/30 "
                +
                "bg-indigo-500/10 "
                +
                "text-indigo-300"
            );


        case "SPO":

            return (
                "border-emerald-400/30 "
                +
                "bg-emerald-500/10 "
                +
                "text-emerald-300"
            );


        case "BIZ":

            return (
                "border-yellow-400/30 "
                +
                "bg-yellow-500/10 "
                +
                "text-yellow-300"
            );


        case "ENT":

            return (
                "border-pink-400/30 "
                +
                "bg-pink-500/10 "
                +
                "text-pink-300"
            );


        case "OTH":

            return (
                "border-gray-500/30 "
                +
                "bg-gray-500/10 "
                +
                "text-gray-300"
            );


        default:

            return (
                "border-gray-600/30 "
                +
                "bg-gray-800/50 "
                +
                "text-gray-400"
            );
    }
};


// =========================================================
// STRIP HTML
// =========================================================

const stripHtml = (
    html = ""
) => {

    const text =
        String(
            html
        )
            .replace(
                /<style[^>]*>.*?<\/style>/gis,
                ""
            )
            .replace(
                /<script[^>]*>.*?<\/script>/gis,
                ""
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
                '"'
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


    return text;
};


// =========================================================
// TRUNCATE TEXT
// =========================================================

const truncateText = (
    text,
    maxLength = 190
) => {

    if (
        !text
    ) {

        return (
            "Post mazmuni hali mavjud emas."
        );
    }


    if (
        text.length
        <=
        maxLength
    ) {

        return text;
    }


    return (
        `${
            text
                .slice(
                    0,
                    maxLength
                )
                .trim()
        }...`
    );
};


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
// PAGINATION RESPONSE NORMALIZER
//
// Yangi backend:
// {
//     count,
//     next,
//     previous,
//     results
// }
//
// Eski backend array qaytarsa ham frontend yiqilmaydi.
// =========================================================

const normalizePostsResponse = (
    response
) => {

    if (
        Array.isArray(
            response
        )
    ) {

        return {

            count:
                response.length,

            next:
                null,

            previous:
                null,

            results:
                response,
        };
    }


    const results =
        Array.isArray(
            response?.results
        )

            ? response.results

            : [];


    return {

        count:
            safeNumber(
                response?.count
            ),

        next:
            response?.next
            ??
            null,

        previous:
            response?.previous
            ??
            null,

        results,
    };
};


// =========================================================
// PAGINATION ITEMS
//
// Masalan:
//
// 1 2 3 4 5
//
// yoki:
//
// 1 ... 4 5 6 ... 12
// =========================================================

const buildPaginationItems = (
    totalPages,
    currentPage
) => {

    if (
        totalPages <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) => index + 1
        );
    }


    const items = [
        1,
    ];


    const start =
        Math.max(
            2,
            currentPage - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    if (
        start > 2
    ) {

        items.push(
            "left-ellipsis"
        );
    }


    for (
        let page = start;
        page <= end;
        page += 1
    ) {

        items.push(
            page
        );
    }


    if (
        end < totalPages - 1
    ) {

        items.push(
            "right-ellipsis"
        );
    }


    items.push(
        totalPages
    );


    return items;
};


// =========================================================
// PROFILE POSTS
// =========================================================

const ProfilePosts = ({
    username,
}) => {

    // =====================================================
    // REDUX
    // =====================================================

    const dispatch =
        useDispatch();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (
            state
        ) => state.auth
    );


    // =====================================================
    // POST STATE
    // =====================================================

    const {
        posts,
        post_isLoading,
        post_error,

        create_isLoading,
        create_error,
    } = useSelector(
        selectPostState
    );


    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        isModalOpen,
        setIsModalOpen,
    ] = useState(
        false
    );


    const [
        search,
        setSearch,
    ] = useState(
        ""
    );


    // =====================================================
    // PAGINATION STATE
    // =====================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(
        1
    );


    const [
        totalPosts,
        setTotalPosts,
    ] = useState(
        0
    );


    const [
        hasNextPage,
        setHasNextPage,
    ] = useState(
        false
    );


    const [
        hasPreviousPage,
        setHasPreviousPage,
    ] = useState(
        false
    );


    // =====================================================
    // REFS
    // =====================================================

    const sectionRef =
        useRef(
            null
        );


    const previousUsernameRef =
        useRef(
            username
        );


    // =====================================================
    // SAFE POSTS
    // =====================================================

    const safePosts =
        Array.isArray(
            posts
        )

            ? posts

            : [];


    // =====================================================
    // CURRENT PROFILE OWNER
    // =====================================================

    const isCurrentUser =
        Boolean(
            isLoggedIn
            &&
            user?.username
            &&
            username
        )
        &&
        user.username
            .toLowerCase()
        ===
        username
            .toLowerCase();


    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages =
        Math.max(
            1,

            Math.ceil(
                totalPosts
                /
                PAGE_SIZE
            )
        );


    // =====================================================
    // POSTS RANGE
    // =====================================================

    const rangeStart =
        totalPosts === 0

            ? 0

            : (
                (
                    currentPage - 1
                )
                *
                PAGE_SIZE
            )
            +
            1;


    const rangeEnd =
        Math.min(
            currentPage
            *
            PAGE_SIZE,

            totalPosts
        );


    // =====================================================
    // FETCH POSTS
    // =====================================================

    const getPost =
        useCallback(
            async (
                page = 1,
                shouldScroll = false
            ) => {

                if (
                    !username
                ) {
                    return;
                }


                dispatch(
                    getPostStart()
                );


                try {

                    const response =
                        await PostService
                            .getPosts(
                                username,
                                page,
                                PAGE_SIZE
                            );


                    const normalized =
                        normalizePostsResponse(
                            response
                        );


                    // =====================================
                    // REDUX'DA FAQAT ARRAY SAQLAYMIZ
                    // =====================================

                    dispatch(
                        getPostSuccess(
                            normalized.results
                        )
                    );


                    // =====================================
                    // PAGINATION META LOCAL STATE
                    // =====================================

                    setTotalPosts(
                        normalized.count
                    );


                    setHasNextPage(
                        Boolean(
                            normalized.next
                        )
                    );


                    setHasPreviousPage(
                        Boolean(
                            normalized.previous
                        )
                    );


                    // =====================================
                    // INVALID PAGE GUARD
                    //
                    // Masalan:
                    // page=5 edi, oxirgi post o‘chirildi
                    // va endi jami 4 page qoldi.
                    // =====================================

                    const calculatedTotalPages =
                        Math.max(
                            1,

                            Math.ceil(
                                normalized.count
                                /
                                PAGE_SIZE
                            )
                        );


                    if (
                        normalized.count > 0
                        &&
                        page > calculatedTotalPages
                    ) {

                        setCurrentPage(
                            calculatedTotalPages
                        );

                        return;
                    }


                    // =====================================
                    // SCROLL
                    // =====================================

                    if (
                        shouldScroll
                    ) {

                        window
                            .requestAnimationFrame(
                                () => {

                                    sectionRef
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

                } catch (
                    error
                ) {

                    console.error(
                        "Post olishda xato:",
                        error
                    );


                    dispatch(
                        getPostFailure(
                            error?.message
                            ||
                            "Postlarni yuklashda xato yuz berdi."
                        )
                    );
                }
            },
            [
                dispatch,
                username,
            ]
        );


    // =====================================================
    // USERNAME CHANGE
    // =====================================================

    useEffect(
        () => {

            if (
                previousUsernameRef.current
                !==
                username
            ) {

                previousUsernameRef.current =
                    username;


                setSearch(
                    ""
                );


                setTotalPosts(
                    0
                );


                setHasNextPage(
                    false
                );


                setHasPreviousPage(
                    false
                );


                if (
                    currentPage !== 1
                ) {

                    setCurrentPage(
                        1
                    );

                    return;
                }
            }


            getPost(
                currentPage,
                false
            );

        },
        [
            username,
            currentPage,
            getPost,
        ]
    );


    // =====================================================
    // CREATE POST
    // =====================================================

    const handleCreatePost =
        useCallback(
            async (
                postDataFromModal
            ) => {

                if (
                    !isCurrentUser
                ) {

                    return false;
                }


                dispatch(
                    createPostStart()
                );


                try {

                    const newPost =
                        await PostService
                            .createPost(
                                postDataFromModal
                            );


                    dispatch(
                        createPostSuccess(
                            newPost
                        )
                    );


                    setIsModalOpen(
                        false
                    );


                    setSearch(
                        ""
                    );


                    // =====================================
                    // YANGI POST ENG BOSHIDA BO‘LADI
                    // =====================================

                    if (
                        currentPage !== 1
                    ) {

                        setCurrentPage(
                            1
                        );

                    } else {

                        await getPost(
                            1,
                            true
                        );
                    }


                    return true;

                } catch (
                    error
                ) {

                    const message =
                        error?.message
                        ||
                        "Post yaratishda xato yuz berdi.";


                    dispatch(
                        createPostFailure(
                            message
                        )
                    );


                    throw new Error(
                        message
                    );
                }
            },
            [
                isCurrentUser,
                dispatch,
                currentPage,
                getPost,
            ]
        );


    // =====================================================
    // SEARCH
    //
    // Hozir server search yo‘q.
    // Shu sabab search faqat joriy yuklangan 5 ta postda.
    //
    // Keyin xohlasak backendga ?search= qo‘shamiz.
    // =====================================================

    const filteredPosts =
        useMemo(
            () => {

                const query =
                    search
                        .trim()
                        .toLowerCase();


                if (
                    !query
                ) {

                    return safePosts;
                }


                return safePosts
                    .filter(
                        (
                            post
                        ) => {

                            const title =
                                String(
                                    post?.title
                                    ||
                                    ""
                                )
                                    .toLowerCase();


                            const type =
                                getPostTypeDisplayName(
                                    post?.post_type
                                )
                                    .toLowerCase();


                            const content =
                                stripHtml(
                                    post?.content
                                )
                                    .toLowerCase();


                            return (
                                title.includes(
                                    query
                                )
                                ||
                                type.includes(
                                    query
                                )
                                ||
                                content.includes(
                                    query
                                )
                            );
                        }
                    );

            },
            [
                safePosts,
                search,
            ]
        );


    // =====================================================
    // CURRENT PAGE STATS
    //
    // total = backenddagi barcha postlar
    //
    // likes/views/comments = hozirgi sahifadagi
    // 5 ta post statistikasi.
    // =====================================================

    const stats =
        useMemo(
            () => {

                return {

                    total:
                        totalPosts,

                    likes:
                        safePosts.reduce(
                            (
                                sum,
                                post
                            ) => {

                                return (
                                    sum
                                    +
                                    safeNumber(
                                        post
                                            ?.likes_count
                                    )
                                );
                            },
                            0
                        ),

                    views:
                        safePosts.reduce(
                            (
                                sum,
                                post
                            ) => {

                                return (
                                    sum
                                    +
                                    safeNumber(
                                        post
                                            ?.views_count
                                    )
                                );
                            },
                            0
                        ),

                    comments:
                        safePosts.reduce(
                            (
                                sum,
                                post
                            ) => {

                                return (
                                    sum
                                    +
                                    safeNumber(
                                        post
                                            ?.comments_count
                                    )
                                );
                            },
                            0
                        ),
                };

            },
            [
                safePosts,
                totalPosts,
            ]
        );


    // =====================================================
    // PAGINATION ITEMS
    // =====================================================

    const paginationItems =
        useMemo(
            () => {

                return buildPaginationItems(
                    totalPages,
                    currentPage
                );

            },
            [
                totalPages,
                currentPage,
            ]
        );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (
            page
        ) => {

            if (
                post_isLoading
            ) {
                return;
            }


            if (
                page < 1
                ||
                page > totalPages
                ||
                page === currentPage
            ) {

                return;
            }


            setSearch(
                ""
            );


            setCurrentPage(
                page
            );


            window
                .requestAnimationFrame(
                    () => {

                        sectionRef
                            .current
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",

                                block:
                                    "start",
                            });
                    }
                );
        };


    // =====================================================
    // RETRY
    // =====================================================

    const handleRetry =
        () => {

            getPost(
                currentPage,
                false
            );
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        post_isLoading
        &&
        safePosts.length === 0
    ) {

        return (
            <PostsSkeleton />
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        post_error
        &&
        safePosts.length === 0
    ) {

        return (

            <div
                className="
                    rounded-3xl
                    border
                    border-red-500/30
                    bg-red-500/10
                    p-8
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
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-red-400/25
                        bg-red-500/10
                        text-red-300
                    "
                >

                    <AlertTriangle
                        size={42}
                    />

                </div>


                <h3
                    className="
                        text-2xl
                        font-black
                        text-white
                    "
                >
                    Postlar yuklanmadi
                </h3>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-xl
                        text-sm
                        font-semibold
                        leading-7
                        text-red-200/80
                    "
                >
                    {post_error}
                </p>


                <button
                    type="button"
                    onClick={
                        handleRetry
                    }
                    className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-red-400/40
                        bg-red-600
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-white
                        transition
                        hover:bg-red-500
                    "
                >

                    <RefreshCcw
                        size={17}
                    />

                    Qayta urinish

                </button>

            </div>
        );
    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            ref={
                sectionRef
            }
            className="
                scroll-mt-28
                space-y-5
            "
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-700/70
                    bg-gray-900/70
                    p-5
                    shadow-xl
                    shadow-black/30
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-indigo-500/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-52
                        w-52
                        rounded-full
                        bg-pink-500/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    {/* =========================================
                        TITLE
                    ========================================== */}

                    <div>

                        <div
                            className="
                                mb-3
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-indigo-400/30
                                bg-indigo-500/10
                                px-3
                                py-1
                                text-[11px]
                                font-black
                                uppercase
                                tracking-wider
                                text-indigo-300
                            "
                        >

                            <Sparkles
                                size={14}
                            />

                            Profile Posts

                        </div>


                        <h3
                            className="
                                text-2xl
                                font-black
                                text-white
                            "
                        >
                            Postlar / Javoblar
                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-gray-500
                            "
                        >
                            Foydalanuvchining maqolalari,
                            fikrlari va kontentlari
                        </p>

                    </div>


                    {/* =========================================
                        SEARCH + CREATE
                    ========================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <div
                            className="
                                relative
                            "
                        >

                            <Search
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />


                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={
                                    (
                                        event
                                    ) => {

                                        setSearch(
                                            event
                                                .target
                                                .value
                                        );
                                    }
                                }
                                placeholder="
                                    Joriy sahifada qidirish...
                                "
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-700
                                    bg-gray-950/60
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-gray-600
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-500/20
                                    sm:w-64
                                "
                            />

                        </div>


                        {isCurrentUser && (

                            <button
                                type="button"
                                onClick={() =>
                                    setIsModalOpen(
                                        true
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-indigo-400/40
                                    bg-indigo-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-black
                                    text-white
                                    shadow-lg
                                    shadow-indigo-600/20
                                    transition
                                    hover:bg-indigo-500
                                    active:scale-95
                                "
                            >

                                <Plus
                                    size={18}
                                />

                                Yangi Post

                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                CREATE ERROR
            ================================================== */}

            {create_error && !isModalOpen && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        p-4
                        text-sm
                        font-semibold
                        text-red-300
                    "
                >

                    <AlertTriangle
                        size={17}
                        className="
                            mr-2
                            inline-block
                        "
                    />

                    Post yaratishda xato:
                    {" "}
                    {create_error}

                </div>

            )}


            {/* =================================================
                LOAD ERROR WITH EXISTING POSTS
            ================================================== */}

            {post_error && safePosts.length > 0 && (

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-red-500/20
                        bg-red-500/10
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
                            text-sm
                            font-semibold
                            text-red-300
                        "
                    >

                        <AlertTriangle
                            size={18}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <span>
                            {post_error}
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleRetry
                        }
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/30
                            bg-red-500/10
                            px-3
                            py-2
                            text-xs
                            font-black
                            text-red-200
                            transition
                            hover:bg-red-500/20
                        "
                    >

                        <RefreshCcw
                            size={14}
                        />

                        Qayta urinish

                    </button>

                </div>

            )}


            {/* =================================================
                STATS
            ================================================== */}

            {totalPosts > 0 && (

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <MiniStat
                        icon={
                            FileText
                        }
                        label="
                            Jami postlar
                        "
                        hint="
                            barcha sahifalar
                        "
                        value={
                            stats.total
                        }
                        tone="
                            indigo
                        "
                    />


                    <MiniStat
                        icon={
                            Heart
                        }
                        label="
                            Layklar
                        "
                        hint="
                            joriy sahifa
                        "
                        value={
                            stats.likes
                        }
                        tone="
                            pink
                        "
                    />


                    <MiniStat
                        icon={
                            Eye
                        }
                        label="
                            Ko‘rishlar
                        "
                        hint="
                            joriy sahifa
                        "
                        value={
                            stats.views
                        }
                        tone="
                            cyan
                        "
                    />


                    <MiniStat
                        icon={
                            MessageCircle
                        }
                        label="
                            Sharhlar
                        "
                        hint="
                            joriy sahifa
                        "
                        value={
                            stats.comments
                        }
                        tone="
                            emerald
                        "
                    />

                </section>

            )}


            {/* =================================================
                PAGE INFORMATION
            ================================================== */}

            {totalPosts > 0 && (

                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        rounded-2xl
                        border
                        border-gray-800
                        bg-gray-950/30
                        px-4
                        py-3
                        text-xs
                        font-bold
                        text-gray-500
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <span>

                        {
                            rangeStart
                        }
                        {" – "}
                        {
                            rangeEnd
                        }
                        {" / "}
                        {
                            totalPosts
                                .toLocaleString()
                        }
                        {" ta post"}

                    </span>


                    <span>

                        Sahifa
                        {" "}
                        <strong
                            className="
                                text-indigo-300
                            "
                        >
                            {currentPage}
                        </strong>

                        {" / "}

                        {
                            totalPages
                        }

                    </span>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================== */}

            {totalPosts === 0 && (

                <EmptyPosts
                    isCurrentUser={
                        isCurrentUser
                    }
                    onCreate={() =>
                        setIsModalOpen(
                            true
                        )
                    }
                    message={
                        isCurrentUser

                            ? (
                                "Siz hali post yozmagansiz. "
                                +
                                "Birinchi maqolangizni qo‘shing."
                            )

                            : (
                                "Foydalanuvchi hali biron bir "
                                +
                                "maqola chop etmagan."
                            )
                    }
                />

            )}


            {/* =================================================
                SEARCH EMPTY
            ================================================== */}

            {
                totalPosts > 0
                &&
                safePosts.length > 0
                &&
                filteredPosts.length === 0
                &&
                (

                    <div
                        className="
                            rounded-3xl
                            border
                            border-dashed
                            border-gray-700/70
                            bg-gray-900/50
                            p-8
                            text-center
                        "
                    >

                        <Search
                            className="
                                mx-auto
                                mb-3
                                text-gray-600
                            "
                            size={42}
                        />


                        <h4
                            className="
                                text-xl
                                font-black
                                text-white
                            "
                        >
                            Qidiruv bo‘yicha
                            post topilmadi
                        </h4>


                        <p
                            className="
                                mt-2
                                text-sm
                                font-semibold
                                text-gray-500
                            "
                        >
                            Joriy sahifada mos post yo‘q.
                            Boshqa kalit so‘z yoki boshqa
                            sahifani tekshirib ko‘ring.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                setSearch(
                                    ""
                                )
                            }
                            className="
                                mt-5
                                rounded-xl
                                border
                                border-gray-700
                                bg-gray-900
                                px-4
                                py-2
                                text-xs
                                font-black
                                text-gray-300
                                transition
                                hover:border-indigo-400/30
                                hover:text-white
                            "
                        >
                            Qidiruvni tozalash
                        </button>

                    </div>

                )
            }


            {/* =================================================
                POSTS
            ================================================== */}

            {filteredPosts.length > 0 && (

                <div
                    id="posts"
                    className="
                        relative
                        grid
                        gap-5
                    "
                >

                    {/* =========================================
                        PAGE REFRESH OVERLAY
                    ========================================== */}

                    {post_isLoading && (

                        <div
                            className="
                                absolute
                                inset-0
                                z-20
                                flex
                                items-start
                                justify-center
                                rounded-3xl
                                bg-[#05070a]/45
                                pt-8
                                backdrop-blur-[2px]
                            "
                        >

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-indigo-400/20
                                    bg-gray-950/90
                                    px-4
                                    py-2
                                    text-xs
                                    font-black
                                    text-indigo-300
                                    shadow-xl
                                "
                            >

                                <RefreshCcw
                                    size={14}
                                    className="
                                        animate-spin
                                    "
                                />

                                Postlar yuklanmoqda...

                            </div>

                        </div>

                    )}


                    {filteredPosts.map(
                        (
                            post,
                            index
                        ) => (

                            <PostCard
                                key={
                                    post?.id
                                    ??
                                    `${currentPage}-${index}`
                                }
                                post={
                                    post
                                }
                                username={
                                    username
                                }
                                index={
                                    index
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* =================================================
                PAGINATION
            ================================================== */}

            {
                totalPosts > 0
                &&
                totalPages > 1
                &&
                (

                    <PostPagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages
                        }
                        paginationItems={
                            paginationItems
                        }
                        hasPreviousPage={
                            hasPreviousPage
                            ||
                            currentPage > 1
                        }
                        hasNextPage={
                            hasNextPage
                            ||
                            currentPage < totalPages
                        }
                        isLoading={
                            post_isLoading
                        }
                        onPageChange={
                            handlePageChange
                        }
                    />

                )
            }


            {/* =================================================
                CREATE POST MODAL
            ================================================== */}

            <CreatePostModal
                isOpen={
                    isModalOpen
                }
                onClose={() => {

                    if (
                        !create_isLoading
                    ) {

                        setIsModalOpen(
                            false
                        );
                    }
                }}
                onSubmit={
                    handleCreatePost
                }
                isSubmitting={
                    create_isLoading
                }
            />

        </div>
    );
};


// =========================================================
// PAGINATION COMPONENT
// =========================================================

const PostPagination = ({
    currentPage,
    totalPages,
    paginationItems,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    onPageChange,
}) => {

    return (

        <section
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-gray-700/70
                bg-gray-900/60
                p-4
                shadow-xl
                shadow-black/20
            "
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-28
                    w-72
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-500/5
                    blur-3xl
                "
            />


            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    justify-between
                    gap-4
                    sm:flex-row
                "
            >

                {/* =========================================
                    PREVIOUS
                ========================================== */}

                <button
                    type="button"
                    disabled={
                        !hasPreviousPage
                        ||
                        isLoading
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage - 1
                        )
                    }
                    className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-gray-700
                        bg-gray-950/50
                        px-4
                        py-3
                        text-xs
                        font-black
                        text-gray-300
                        transition
                        hover:border-indigo-400/30
                        hover:bg-indigo-500/10
                        hover:text-indigo-300
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                        sm:w-auto
                    "
                >

                    <ChevronLeft
                        size={17}
                    />

                    Oldingi

                </button>


                {/* =========================================
                    PAGE NUMBERS
                ========================================== */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    {paginationItems.map(
                        (
                            item
                        ) => {

                            if (
                                typeof item
                                ===
                                "string"
                            ) {

                                return (

                                    <span
                                        key={
                                            item
                                        }
                                        className="
                                            flex
                                            h-10
                                            min-w-8
                                            items-center
                                            justify-center
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >
                                        ...
                                    </span>

                                );
                            }


                            const isActive =
                                item
                                ===
                                currentPage;


                            return (

                                <button
                                    key={
                                        item
                                    }
                                    type="button"
                                    disabled={
                                        isLoading
                                    }
                                    aria-current={
                                        isActive
                                            ? "page"
                                            : undefined
                                    }
                                    onClick={() =>
                                        onPageChange(
                                            item
                                        )
                                    }
                                    className={`
                                        flex
                                        h-10
                                        min-w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        px-3
                                        text-xs
                                        font-black
                                        transition
                                        active:scale-95
                                        disabled:cursor-not-allowed

                                        ${
                                            isActive

                                                ? `
                                                    border-indigo-400/50
                                                    bg-indigo-600
                                                    text-white
                                                    shadow-lg
                                                    shadow-indigo-600/20
                                                `

                                                : `
                                                    border-gray-700
                                                    bg-gray-950/50
                                                    text-gray-400
                                                    hover:border-indigo-400/30
                                                    hover:bg-indigo-500/10
                                                    hover:text-indigo-300
                                                `
                                        }
                                    `}
                                >
                                    {item}
                                </button>

                            );
                        }
                    )}

                </div>


                {/* =========================================
                    NEXT
                ========================================== */}

                <button
                    type="button"
                    disabled={
                        !hasNextPage
                        ||
                        isLoading
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage + 1
                        )
                    }
                    className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-gray-700
                        bg-gray-950/50
                        px-4
                        py-3
                        text-xs
                        font-black
                        text-gray-300
                        transition
                        hover:border-indigo-400/30
                        hover:bg-indigo-500/10
                        hover:text-indigo-300
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                        sm:w-auto
                    "
                >

                    Keyingi

                    <ChevronRight
                        size={17}
                    />

                </button>

            </div>


            <div
                className="
                    relative
                    z-10
                    mt-4
                    text-center
                    text-[11px]
                    font-bold
                    text-gray-600
                "
            >

                Sahifa
                {" "}
                <span
                    className="
                        text-indigo-300
                    "
                >
                    {currentPage}
                </span>

                {" / "}

                {totalPages}

            </div>

        </section>
    );
};


// =========================================================
// POSTS SKELETON
// =========================================================

const PostsSkeleton = () => {

    return (

        <div
            className="
                space-y-5
            "
        >

            {/* HEADER */}

            <div
                className="
                    rounded-3xl
                    border
                    border-gray-700/70
                    bg-gray-900/70
                    p-5
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div
                        className="
                            space-y-3
                        "
                    >

                        <div
                            className="
                                h-5
                                w-32
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />


                        <div
                            className="
                                h-8
                                w-56
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />


                        <div
                            className="
                                h-4
                                w-80
                                max-w-full
                                animate-pulse
                                rounded-xl
                                bg-gray-800
                            "
                        />

                    </div>


                    <div
                        className="
                            h-12
                            w-40
                            animate-pulse
                            rounded-2xl
                            bg-gray-800
                        "
                    />

                </div>

            </div>


            {/* STATS */}

            <div
                className="
                    grid
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {[1, 2, 3, 4].map(
                    (
                        item
                    ) => (

                        <div
                            key={
                                item
                            }
                            className="
                                h-24
                                animate-pulse
                                rounded-3xl
                                border
                                border-gray-800
                                bg-gray-900/60
                            "
                        />

                    )
                )}

            </div>


            {/* POSTS */}

            {[1, 2, 3].map(
                (
                    item
                ) => (

                    <div
                        key={
                            item
                        }
                        className="
                            rounded-3xl
                            border
                            border-gray-700/70
                            bg-gray-900/60
                            p-5
                            shadow-xl
                            shadow-black/20
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
                                    h-8
                                    w-28
                                    animate-pulse
                                    rounded-full
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


                        <div
                            className="
                                space-y-4
                            "
                        >

                            <div
                                className="
                                    h-7
                                    w-3/4
                                    animate-pulse
                                    rounded-xl
                                    bg-gray-800
                                "
                            />


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
                                    w-5/6
                                    animate-pulse
                                    rounded-xl
                                    bg-gray-800
                                "
                            />


                            <div
                                className="
                                    h-12
                                    w-full
                                    animate-pulse
                                    rounded-2xl
                                    bg-gray-800
                                "
                            />

                        </div>

                    </div>

                )
            )}

        </div>
    );
};


// =========================================================
// EMPTY POSTS
// =========================================================

const EmptyPosts = ({
    message,
    isCurrentUser,
    onCreate,
}) => {

    return (

        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-dashed
                border-gray-700/70
                bg-gray-900/60
                p-8
                text-center
                shadow-2xl
                shadow-black/30
            "
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-52
                    w-52
                    rounded-full
                    bg-indigo-500/10
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24
                    h-52
                    w-52
                    rounded-full
                    bg-pink-500/10
                    blur-3xl
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
                        mb-5
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gray-700
                        bg-gray-950/70
                        text-gray-500
                    "
                >

                    <MessageSquarePlus
                        size={42}
                    />

                </div>


                <h4
                    className="
                        text-2xl
                        font-black
                        text-white
                    "
                >
                    Hech qanday post mavjud emas
                </h4>


                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-xl
                        text-sm
                        font-semibold
                        leading-7
                        text-gray-500
                    "
                >
                    {message}
                </p>


                {isCurrentUser && (

                    <button
                        type="button"
                        onClick={
                            onCreate
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-indigo-400/40
                            bg-indigo-600
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-white
                            shadow-lg
                            shadow-indigo-600/20
                            transition
                            hover:bg-indigo-500
                            active:scale-95
                        "
                    >

                        <Plus
                            size={18}
                        />

                        Yangi Post

                    </button>

                )}

            </div>

        </div>
    );
};


// =========================================================
// MINI STAT
// =========================================================

const MiniStat = ({
    icon: Icon,
    label,
    hint,
    value,
    tone = "indigo",
}) => {

    const tones = {

        indigo:
            (
                "border-indigo-400/20 "
                +
                "bg-indigo-500/10 "
                +
                "text-indigo-300"
            ),

        pink:
            (
                "border-pink-400/20 "
                +
                "bg-pink-500/10 "
                +
                "text-pink-300"
            ),

        cyan:
            (
                "border-cyan-400/20 "
                +
                "bg-cyan-500/10 "
                +
                "text-cyan-300"
            ),

        emerald:
            (
                "border-emerald-400/20 "
                +
                "bg-emerald-500/10 "
                +
                "text-emerald-300"
            ),
    };


    return (

        <div
            className="
                rounded-3xl
                border
                border-gray-700/70
                bg-gray-900/60
                p-4
                shadow-xl
                shadow-black/20
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
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        ${
                            tones[tone]
                            ||
                            tones.indigo
                        }
                    `}
                >

                    <Icon
                        size={22}
                    />

                </div>


                <div
                    className="
                        min-w-0
                    "
                >

                    <p
                        className="
                            text-2xl
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
                            truncate
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                        "
                    >
                        {label}
                    </p>


                    {hint && (

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                font-semibold
                                text-gray-700
                            "
                        >
                            {hint}
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
};


// =========================================================
// POST CARD
// =========================================================

const PostCard = ({
    post,
    username,
    index,
}) => {

    const typeLabel =
        getPostTypeDisplayName(
            post?.post_type
        );


    const typeStyle =
        getPostTypeStyle(
            post?.post_type
        );


    const preview =
        truncateText(
            stripHtml(
                post?.content
            )
        );


    const likesCount =
        safeNumber(
            post?.likes_count
        );


    const viewsCount =
        safeNumber(
            post?.views_count
        );


    const commentsCount =
        safeNumber(
            post?.comments_count
        );


    return (

        <Link
            to={`/${username}/post/${post?.slug}/`}
            className="
                group
                relative
                block
                overflow-hidden
                rounded-3xl
                border
                border-gray-700/70
                bg-gray-900/70
                p-5
                shadow-xl
                shadow-black/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-400/40
                hover:bg-gray-900/90
                hover:shadow-indigo-500/10
            "
            style={{
                animationDelay:
                    `${index * 80}ms`,
            }}
        >

            {/* =============================================
                GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-indigo-500/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10
                "
            >

                {/* =========================================
                    TYPE + DATE
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
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1
                            text-[11px]
                            font-black
                            uppercase
                            tracking-wider
                            ${typeStyle}
                        `}
                    >

                        <i
                            className={
                                getPostTypeIcon(
                                    post
                                        ?.post_type
                                )
                            }
                        />


                        {typeLabel}

                    </span>


                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-bold
                            text-gray-500
                        "
                    >

                        <Clock
                            size={14}
                        />

                        {
                            timeAgo(
                                post
                                    ?.created_at
                            )
                        }

                    </span>

                </div>


                {/* =========================================
                    TITLE
                ========================================== */}

                <h4
                    className="
                        text-xl
                        font-black
                        leading-tight
                        text-white
                        transition-colors
                        group-hover:text-indigo-300
                        sm:text-2xl
                    "
                >
                    {
                        post?.title
                        ||
                        "Noma’lum post"
                    }
                </h4>


                {/* =========================================
                    CONTENT PREVIEW
                ========================================== */}

                <p
                    className="
                        mt-3
                        line-clamp-3
                        border-l-2
                        border-gray-700
                        pl-4
                        text-sm
                        font-medium
                        leading-7
                        text-gray-400
                        transition
                        group-hover:border-indigo-400/60
                    "
                >
                    {preview}
                </p>


                {/* =========================================
                    FOOTER
                ========================================== */}

                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-gray-700/70
                        pt-4
                    "
                >

                    {/* STATS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                            text-sm
                            font-bold
                            text-gray-400
                        "
                    >

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-pink-300
                            "
                        >

                            <Heart
                                size={16}
                                className="
                                    fill-pink-400/20
                                "
                            />

                            {
                                likesCount
                                    .toLocaleString()
                            }

                        </span>


                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-cyan-300
                            "
                        >

                            <Eye
                                size={16}
                            />

                            {
                                viewsCount
                                    .toLocaleString()
                            }

                        </span>


                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-emerald-300
                            "
                        >

                            <MessageCircle
                                size={16}
                            />

                            {
                                commentsCount
                                    .toLocaleString()
                            }

                        </span>

                    </div>


                    {/* DETAIL */}

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-indigo-400/20
                            bg-indigo-500/10
                            px-4
                            py-2
                            text-xs
                            font-black
                            text-indigo-300
                            transition
                            group-hover:bg-indigo-500/20
                        "
                    >

                        Batafsil o‘qish

                        <i
                            className="
                                fa-solid
                                fa-arrow-right
                                transition-transform
                                group-hover:translate-x-1
                            "
                        />

                    </span>

                </div>

            </div>

        </Link>
    );
};


export default ProfilePosts;