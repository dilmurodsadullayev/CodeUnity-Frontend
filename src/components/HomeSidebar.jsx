import React, {
    useCallback,
    useEffect,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    Cake,
    LogIn,
    RefreshCw,
} from "lucide-react";

import UserService from "../services/user";

import {
    getBirthdayUsersFailure,
    getBirthdayUsersStart,
    getBirthdayUsersSuccess,
} from "../features/users";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../utils/imageUtils";


// =========================================================
// HOME SIDEBAR
// =========================================================

const HomeSidebar = ({
    isLoggedIn,
    user,
}) => {
    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        birthdayUsersLoading,
        birthdayUsers,
        birthdayUsersError,
        birthdayUsersCount,
    } = useSelector(
        (state) =>
            state.user
    );


    // =====================================================
    // FETCH BIRTHDAY USERS
    // =====================================================

    const fetchBirthdayUsers =
        useCallback(
            async () => {
                dispatch(
                    getBirthdayUsersStart()
                );


                try {
                    const response =
                        await UserService
                            .getMonthlyBirthdayUsers({
                                limit: 5,

                                excludeMe: true,

                                upcomingOnly: false,
                            });


                    dispatch(
                        getBirthdayUsersSuccess(
                            response
                        )
                    );

                } catch (
                    error
                ) {
                    dispatch(
                        getBirthdayUsersFailure(
                            error?.response
                                ?.data
                                ?.detail ||
                            error?.message ||
                            "Tug‘ilgan kunlarni yuklashda xatolik yuz berdi."
                        )
                    );
                }
            },
            [
                dispatch,
            ]
        );


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(
        () => {
            fetchBirthdayUsers();
        },
        [
            fetchBirthdayUsers,
        ]
    );


    // =====================================================
    // FULL NAME
    // =====================================================

    const getFullName = (
        item
    ) => {
        const fullName =
            item?.full_name ||
            `${item?.first_name || ""} ${item?.last_name || ""}`.trim();


        return (
            fullName ||
            item?.username ||
            "FSociety user"
        );
    };


    // =====================================================
    // BIRTHDAY BADGE
    // =====================================================

    const getBirthdayBadgeClass = (
        daysLeft
    ) => {
        if (
            daysLeft === 0
        ) {
            return (
                "border-pink-400/30 bg-pink-500/10 text-pink-300"
            );
        }


        if (
            daysLeft === 1
        ) {
            return (
                "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
            );
        }


        if (
            daysLeft > 1
        ) {
            return (
                "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
            );
        }


        return (
            "border-gray-400/20 bg-white/[0.035] text-gray-400"
        );
    };


    // =====================================================
    // SAFE USERS
    // =====================================================

    const safeBirthdayUsers =
        Array.isArray(
            birthdayUsers
        )
            ? birthdayUsers
            : [];


    const totalBirthdayUsers =
        birthdayUsersCount ||
        safeBirthdayUsers.length ||
        0;


    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            className="
                w-full

                lg:sticky
                lg:top-24
                lg:h-fit
            "
        >

            <div
                className="
                    space-y-5
                "
            >

                {/* =================================================
                    USER WELCOME CARD
                ================================================== */}

                <div
                    className="
                        relative

                        overflow-hidden

                        rounded-3xl

                        border
                        border-cyan-400/20

                        bg-[#0d1117]

                        p-5

                        shadow-2xl
                        shadow-cyan-500/5
                    "
                >

                    {/* BACKGROUND GLOW */}

                    <div
                        className="
                            pointer-events-none

                            absolute
                            -right-16
                            -top-16

                            h-40
                            w-40

                            rounded-full

                            bg-cyan-500/[0.06]

                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            z-10

                            text-left

                            font-mono
                        "
                    >

                        {/* SESSION */}

                        <p
                            className="
                                text-[12px]
                                font-black

                                uppercase
                                tracking-[0.35em]

                                text-gray-600
                            "
                        >
                            fsociety://session
                        </p>


                        {/* WELCOME */}

                        <h2
                            className="
                                mt-2

                                text-xl
                                font-black

                                tracking-tight

                                text-gray-100

                                md:text-2xl
                            "
                        >
                            Salom, xush kelibsiz{" "}

                            <span
                                className="
                                    text-white
                                "
                            >
                                @
                                {
                                    isLoggedIn &&
                                    user?.username
                                        ? user.username
                                        : "guest"
                                }
                            </span>


                            <span
                                className="
                                    ml-1

                                    animate-pulse

                                    text-gray-500
                                "
                            >
                                _
                            </span>

                        </h2>


                        {/* USER META */}

                        <div
                            className="
                                mt-2

                                flex
                                flex-wrap
                                items-center

                                gap-x-4
                                gap-y-2

                                text-xs
                                font-black

                                uppercase
                                tracking-[0.2em]

                                text-gray-500
                            "
                        >

                            {/* LEVEL */}

                            <span>
                                Level:{" "}

                                <span
                                    className="
                                        text-gray-200
                                    "
                                >
                                    {
                                        isLoggedIn
                                            ? user?.skill_level ||
                                              "developer"
                                            : "guest"
                                    }
                                </span>
                            </span>


                            <span
                                className="
                                    text-gray-700
                                "
                            >
                                /
                            </span>


                            {/* FCOIN */}

                            <span>
                                FCoin:{" "}

                                <span
                                    className="
                                        text-gray-200
                                    "
                                >
                                    {
                                        isLoggedIn
                                            ? user?.coins ??
                                              0
                                            : 0
                                    }
                                </span>
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        LOGIN
                    ================================================== */}

                    {!isLoggedIn && (

                        <Link
                            to="/login"

                            className="
                                relative
                                z-10

                                mt-5

                                inline-flex
                                w-full

                                items-center
                                justify-center

                                gap-2

                                rounded-xl

                                border
                                border-cyan-400/20

                                bg-cyan-400/10

                                px-4
                                py-3

                                text-sm
                                font-black

                                text-cyan-300

                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:border-cyan-400/40
                                hover:bg-cyan-400/20

                                active:translate-y-0
                            "
                        >

                            <LogIn
                                size={17}
                                strokeWidth={2.2}
                            />

                            Tizimga kirish

                        </Link>

                    )}

                </div>


                {/* =================================================
                    BIRTHDAY USERS CARD
                ================================================== */}

                <div
                    className="
                        overflow-hidden

                        rounded-3xl

                        border
                        border-white/10

                        bg-[#0d1117]

                        shadow-2xl
                        shadow-black/20
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div
                        className="
                            border-b
                            border-white/10

                            p-5
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
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        text-[11px]
                                        font-black

                                        uppercase
                                        tracking-[0.25em]

                                        text-gray-500
                                    "
                                >
                                    Community
                                </p>


                                <h3
                                    className="
                                        mt-1

                                        text-lg
                                        font-black

                                        text-white
                                    "
                                >
                                    Tug‘ilgan kuni yaqinlar
                                </h3>

                            </div>


                            {/* CAKE ICON */}

                            <div
                                className="
                                    grid

                                    h-11
                                    w-11

                                    flex-shrink-0

                                    place-items-center

                                    rounded-2xl

                                    border
                                    border-pink-400/30

                                    bg-pink-400/10

                                    text-pink-300
                                "
                            >

                                <Cake
                                    size={20}
                                    strokeWidth={2}
                                />

                            </div>

                        </div>


                        {/* COUNT */}

                        <div
                            className="
                                mt-3

                                flex
                                items-center
                                justify-between

                                gap-3

                                text-xs
                                font-bold

                                text-gray-500
                            "
                        >

                            <span>
                                Bu oy ichidagi userlar
                            </span>


                            <span
                                className="
                                    rounded-full

                                    border
                                    border-white/10

                                    bg-white/[0.035]

                                    px-2
                                    py-1

                                    text-[10px]
                                    font-black

                                    text-cyan-300
                                "
                            >
                                {
                                    totalBirthdayUsers
                                } ta
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        BODY
                    ================================================== */}

                    <div
                        className="
                            p-5
                        "
                    >

                        {/* =============================================
                            LOADING
                        ============================================== */}

                        {birthdayUsersLoading ? (

                            <div
                                className="
                                    space-y-3
                                "
                            >

                                {[...Array(3)].map(
                                    (
                                        _,
                                        index
                                    ) => (

                                    <div
                                        key={
                                            index
                                        }

                                        className="
                                            animate-pulse

                                            rounded-2xl

                                            border
                                            border-white/10

                                            bg-white/[0.035]

                                            p-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center

                                                gap-3
                                            "
                                        >

                                            {/* AVATAR SKELETON */}

                                            <div
                                                className="
                                                    h-12
                                                    w-12

                                                    shrink-0

                                                    rounded-2xl

                                                    bg-gray-700/60
                                                "
                                            />


                                            {/* CONTENT */}

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >

                                                <div
                                                    className="
                                                        mb-2

                                                        h-4
                                                        w-28

                                                        rounded

                                                        bg-gray-700/60
                                                    "
                                                />


                                                <div
                                                    className="
                                                        h-3
                                                        w-20

                                                        rounded

                                                        bg-gray-700/60
                                                    "
                                                />


                                                <div
                                                    className="
                                                        mt-3

                                                        flex
                                                        gap-2
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            h-5
                                                            w-20

                                                            rounded-full

                                                            bg-gray-700/60
                                                        "
                                                    />


                                                    <div
                                                        className="
                                                            h-5
                                                            w-14

                                                            rounded-full

                                                            bg-gray-700/60
                                                        "
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>


                        ) : birthdayUsersError ? (

                            /* =========================================
                                ERROR
                            ========================================== */

                            <div
                                className="
                                    rounded-2xl

                                    border
                                    border-red-400/20

                                    bg-red-500/10

                                    p-4

                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mx-auto
                                        mb-3

                                        grid

                                        h-12
                                        w-12

                                        place-items-center

                                        rounded-2xl

                                        border
                                        border-red-400/20

                                        bg-red-500/10

                                        text-red-300
                                    "
                                >

                                    <AlertTriangle
                                        size={20}
                                        strokeWidth={2}
                                    />

                                </div>


                                <p
                                    className="
                                        text-sm
                                        font-black

                                        text-red-300
                                    "
                                >
                                    Ma’lumot yuklanmadi
                                </p>


                                <p
                                    className="
                                        mt-1

                                        text-xs
                                        leading-5

                                        text-red-200/80
                                    "
                                >
                                    {
                                        birthdayUsersError
                                    }
                                </p>


                                {/* RETRY */}

                                <button
                                    type="button"

                                    onClick={
                                        fetchBirthdayUsers
                                    }

                                    className="
                                        mt-4

                                        inline-flex

                                        items-center
                                        justify-center

                                        gap-2

                                        rounded-xl

                                        border
                                        border-red-400/20

                                        bg-red-500/10

                                        px-4
                                        py-2

                                        text-xs
                                        font-black

                                        text-red-300

                                        transition-all
                                        duration-200

                                        hover:border-red-400/30
                                        hover:bg-red-500/20
                                    "
                                >

                                    <RefreshCw
                                        size={15}
                                        strokeWidth={2.2}
                                    />

                                    Qayta urinish

                                </button>

                            </div>


                        ) : safeBirthdayUsers.length > 0 ? (

                            /* =========================================
                                USERS
                            ========================================== */

                            <div
                                className="
                                    space-y-3
                                "
                            >

                                {safeBirthdayUsers.map(
                                    (
                                        item
                                    ) => {

                                    const imageSrc =
                                        getUserAvatarUrl(
                                            item
                                        );


                                    return (

                                        <Link
                                            key={
                                                item.id
                                            }

                                            to={`/${item.username}/profile`}

                                            className="
                                                group

                                                block

                                                rounded-2xl

                                                border
                                                border-white/10

                                                bg-white/[0.035]

                                                p-3

                                                transition-all
                                                duration-200

                                                hover:-translate-y-0.5
                                                hover:border-cyan-400/30
                                                hover:bg-cyan-400/10
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center

                                                    gap-3
                                                "
                                            >

                                                {/* =====================
                                                    USER AVATAR

                                                    image bor:
                                                    real image

                                                    image yo'q:
                                                    default userImage.jpeg

                                                    URL 404:
                                                    onError -> default
                                                ====================== */}

                                                <img
                                                    src={
                                                        imageSrc
                                                    }

                                                    alt={
                                                        item?.username
                                                            ? `${item.username} avatar`
                                                            : "User avatar"
                                                    }

                                                    onError={
                                                        handleUserImageError
                                                    }

                                                    className="
                                                        h-12
                                                        w-12

                                                        shrink-0

                                                        rounded-2xl

                                                        border
                                                        border-cyan-400/20

                                                        bg-[#161b22]

                                                        object-cover

                                                        transition-all
                                                        duration-200

                                                        group-hover:border-cyan-400/50
                                                    "
                                                />


                                                {/* =====================
                                                    USER INFO
                                                ====================== */}

                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >

                                                    {/* TOP */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between

                                                            gap-2
                                                        "
                                                    >

                                                        <h4
                                                            className="
                                                                truncate

                                                                text-sm
                                                                font-black

                                                                text-white

                                                                transition-colors

                                                                group-hover:text-cyan-300
                                                            "
                                                        >
                                                            {
                                                                getFullName(
                                                                    item
                                                                )
                                                            }
                                                        </h4>


                                                        {/* BIRTHDAY LABEL */}

                                                        <span
                                                            className={`
                                                                shrink-0

                                                                rounded-full

                                                                border

                                                                px-2
                                                                py-1

                                                                text-[10px]
                                                                font-black

                                                                ${getBirthdayBadgeClass(
                                                                    item.days_left
                                                                )}
                                                            `}
                                                        >
                                                            {
                                                                item
                                                                    .birthday_label ||
                                                                "Bu oy"
                                                            }
                                                        </span>

                                                    </div>


                                                    {/* USERNAME */}

                                                    <p
                                                        className="
                                                            mt-0.5

                                                            truncate

                                                            text-xs
                                                            font-bold

                                                            text-gray-500
                                                        "
                                                    >
                                                        @
                                                        {
                                                            item.username
                                                        }
                                                    </p>


                                                    {/* META */}

                                                    <div
                                                        className="
                                                            mt-2

                                                            flex
                                                            flex-wrap
                                                            items-center

                                                            gap-2
                                                        "
                                                    >

                                                        {/* LEVEL */}

                                                        <span
                                                            className="
                                                                rounded-full

                                                                bg-cyan-500/10

                                                                px-2
                                                                py-0.5

                                                                text-[10px]
                                                                font-bold

                                                                text-cyan-300
                                                            "
                                                        >
                                                            {
                                                                item
                                                                    .skill_level ||
                                                                "Developer"
                                                            }
                                                        </span>


                                                        {/* DAY */}

                                                        {item
                                                            .birthday_day && (

                                                            <span
                                                                className="
                                                                    rounded-full

                                                                    bg-pink-500/10

                                                                    px-2
                                                                    py-0.5

                                                                    text-[10px]
                                                                    font-bold

                                                                    text-pink-300
                                                                "
                                                            >
                                                                {
                                                                    item
                                                                        .birthday_day
                                                                }
                                                                -kun
                                                            </span>

                                                        )}


                                                        {/* FCOIN */}

                                                        <span
                                                            className="
                                                                rounded-full

                                                                bg-yellow-500/10

                                                                px-2
                                                                py-0.5

                                                                text-[10px]
                                                                font-bold

                                                                text-yellow-300
                                                            "
                                                        >
                                                            {
                                                                item?.coins ??
                                                                0
                                                            } FCoin
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </Link>

                                    );
                                })}

                            </div>


                        ) : (

                            /* =========================================
                                EMPTY STATE
                            ========================================== */

                            <div
                                className="
                                    rounded-2xl

                                    border
                                    border-dashed
                                    border-white/10

                                    bg-white/[0.025]

                                    p-5

                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mx-auto
                                        mb-3

                                        grid

                                        h-12
                                        w-12

                                        place-items-center

                                        rounded-2xl

                                        border
                                        border-pink-400/20

                                        bg-pink-500/10

                                        text-pink-300
                                    "
                                >

                                    <Cake
                                        size={20}
                                        strokeWidth={2}
                                    />

                                </div>


                                <p
                                    className="
                                        text-sm
                                        font-black

                                        text-white
                                    "
                                >
                                    Bu oy tug‘ilgan kun yo‘q
                                </p>


                                <p
                                    className="
                                        mt-1

                                        text-xs
                                        leading-5

                                        text-gray-500
                                    "
                                >
                                    Userlar profilida
                                    tug‘ilgan sana
                                    kiritilganda shu
                                    yerda ko‘rinadi.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </aside>
    );
};


export default HomeSidebar;