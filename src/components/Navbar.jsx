import React, {
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
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    Bug,
    ChevronDown,
    Coins,
    FolderKanban,
    LogIn,
    LogOut,
    Menu,
    MessageSquareText,
    Puzzle,
    UserCircle,
    Users,
} from "lucide-react";

import FSocietyLogo from "../assests/logo/f_society.png";
import FCoinIcon from "../assests/coin/fcoin.png";

import NotificationDropdown from "./NotificationDropdown";
import MobileNavbarSidebar from "./MobileNavbarSidebar";

import {
    logoutUser,
} from "../features/auth/Auth";

import AuthService from "../services/auth";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../utils/imageUtils";


// =========================================================
// NAVIGATION
// =========================================================

const NAV_LINKS = [
    {
        path: "/projects",
        text: "Projects",
        Icon: FolderKanban,
    },

    {
        path: "/feedback",
        text: "Feedback",
        Icon: MessageSquareText,
    },

    {
        path: "/problems",
        text: "Problems",
        Icon: Puzzle,
    },

    {
        path: "/users",
        text: "Users",
        Icon: Users,
    },

    {
        path: "/fcoin",
        text: "F Coin",
        Icon: Coins,
    },
];


// =========================================================
// DROPDOWN ANIMATION
// =========================================================

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.96,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.18,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -8,
        scale: 0.96,

        transition: {
            duration: 0.14,
            ease: "easeIn",
        },
    },
};


// =========================================================
// NAVBAR
// =========================================================

const Navbar = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const location =
        useLocation();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) =>
            state.auth
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        openUserMenu,
        setOpenUserMenu,
    ] = useState(false);


    const [
        openNotifications,
        setOpenNotifications,
    ] = useState(false);


    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);


    // =====================================================
    // REFS
    // =====================================================

    const userMenuRef =
        useRef(null);

    const notificationsRef =
        useRef(null);


    // =====================================================
    // USER AVATAR
    // =====================================================

    const avatarUrl =
        useMemo(
            () =>
                getUserAvatarUrl(
                    user
                ),
            [
                user,
            ]
        );


    // =====================================================
    // ACTIVE ROUTE
    // =====================================================

    const isActive = (
        path
    ) => {
        if (
            path === "/"
        ) {
            return (
                location.pathname === "/"
            );
        }


        return (
            location.pathname === path ||
            location.pathname.startsWith(
                `${path}/`
            )
        );
    };


    // =====================================================
    // ROUTE CHANGE
    // =====================================================

    useEffect(
        () => {
            setOpenUserMenu(false);

            setOpenNotifications(false);

            setIsMobileMenuOpen(false);
        },
        [
            location.pathname,
        ]
    );


    // =====================================================
    // CLICK OUTSIDE
    // =====================================================

    useEffect(
        () => {
            const handleClickOutside = (
                event
            ) => {
                if (
                    userMenuRef.current &&
                    !userMenuRef.current.contains(
                        event.target
                    )
                ) {
                    setOpenUserMenu(
                        false
                    );
                }


                if (
                    notificationsRef.current &&
                    !notificationsRef.current.contains(
                        event.target
                    )
                ) {
                    setOpenNotifications(
                        false
                    );
                }
            };


            document.addEventListener(
                "mousedown",
                handleClickOutside
            );


            return () => {
                document.removeEventListener(
                    "mousedown",
                    handleClickOutside
                );
            };
        },
        []
    );


    // =====================================================
    // ESCAPE
    // =====================================================

    useEffect(
        () => {
            const handleEscape = (
                event
            ) => {
                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }


                setOpenUserMenu(false);

                setOpenNotifications(false);

                setIsMobileMenuOpen(false);
            };


            window.addEventListener(
                "keydown",
                handleEscape
            );


            return () => {
                window.removeEventListener(
                    "keydown",
                    handleEscape
                );
            };
        },
        []
    );


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout =
        async () => {
            setOpenUserMenu(false);

            setOpenNotifications(false);

            setIsMobileMenuOpen(false);


            try {
                await AuthService
                    .userLogout();

            } catch (
                error
            ) {
                console.error(
                    "Logout error:",
                    error
                );

            } finally {
                dispatch(
                    logoutUser()
                );


                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );
            }
        };


    // =====================================================
    // MOBILE MENU
    // =====================================================

    const toggleMobileMenu =
        () => {
            setOpenUserMenu(false);

            setOpenNotifications(false);


            setIsMobileMenuOpen(
                (previous) =>
                    !previous
            );
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <>

            {/* =================================================
                NAVBAR
            ================================================== */}

            <header
                className="
                    sticky
                    left-0
                    right-0
                    top-0
                    z-50

                    border-b
                    border-white/[0.06]

                    bg-[#080c12]/95

                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1440px]

                        px-4
                        sm:px-6
                    "
                >

                    <div
                        className="
                            flex
                            min-h-[72px]

                            items-center
                            justify-between

                            gap-4
                        "
                    >


                        {/* =====================================
                            BRAND
                        ====================================== */}

                        <Link
                            to="/"

                            className="
                                group
                                relative
                                z-50

                                flex
                                flex-shrink-0
                                items-center

                                gap-3
                            "
                        >

                            {/* =================================
                                LOGO
                            ================================== */}

                            <div
                                className="
                                    relative

                                    flex
                                    h-12
                                    w-12

                                    flex-shrink-0

                                    items-center
                                    justify-center
                                "
                            >

                                {/* GLOW */}

                                <span
                                    className="
                                        pointer-events-none

                                        absolute
                                        inset-1

                                        rounded-full

                                        bg-indigo-500/0

                                        blur-xl

                                        transition-all
                                        duration-500

                                        group-hover:scale-125
                                        group-hover:bg-indigo-500/25
                                    "
                                />


                                <img
                                    src={
                                        FSocietyLogo
                                    }

                                    alt="F.Society"

                                    className="
                                        relative
                                        z-10

                                        h-11
                                        w-auto

                                        object-contain

                                        transition-all
                                        duration-500

                                        ease-[cubic-bezier(0.16,1,0.3,1)]

                                        group-hover:rotate-[360deg]
                                        group-hover:scale-105
                                    "
                                />

                            </div>


                            {/* =================================
                                FSOCIETY -> FIX SOCIETY
                            ================================== */}

                            <div
                                className="
                                    relative

                                    hidden

                                    h-[36px]
                                    w-[145px]

                                    overflow-hidden

                                    sm:block
                                "
                            >

                                {/* FSOCIETY */}

                                <span
                                    className="
                                        absolute
                                        left-0
                                        top-1/2

                                        -translate-y-1/2

                                        whitespace-nowrap

                                        text-[24px]
                                        font-bold
                                        leading-none

                                        tracking-[-0.055em]

                                        text-white

                                        opacity-100

                                        transition-all
                                        duration-500

                                        ease-[cubic-bezier(0.16,1,0.3,1)]

                                        group-hover:-translate-y-[160%]
                                        group-hover:opacity-0
                                    "
                                >
                                    F

                                    <span
                                        className="
                                            text-indigo-400
                                        "
                                    >
                                        Society
                                    </span>

                                </span>


                                {/* FIX SOCIETY */}

                                <span
                                    className="
                                        absolute
                                        left-0
                                        top-1/2

                                        translate-y-[70%]

                                        whitespace-nowrap

                                        text-[24px]
                                        font-bold
                                        leading-none

                                        tracking-[-0.055em]

                                        text-indigo-400

                                        opacity-0

                                        transition-all
                                        duration-500

                                        ease-[cubic-bezier(0.16,1,0.3,1)]

                                        group-hover:-translate-y-1/2
                                        group-hover:opacity-100
                                    "
                                >
                                    Fix{" "}

                                    <span
                                        className="
                                            text-white
                                        "
                                    >
                                        Society
                                    </span>

                                </span>

                            </div>

                        </Link>


                        {/* =====================================
                            DESKTOP NAVIGATION
                        ====================================== */}

                        <nav
                            className="
                                hidden

                                items-center

                                gap-1

                                rounded-2xl

                                border
                                border-white/[0.06]

                                bg-white/[0.025]

                                p-1.5

                                lg:flex
                            "
                        >

                            {NAV_LINKS.map(
                                ({
                                    path,
                                    text,
                                    Icon,
                                }) => {
                                    const active =
                                        isActive(
                                            path
                                        );


                                    return (
                                        <Link
                                            key={
                                                path
                                            }

                                            to={
                                                path
                                            }

                                            className={`
                                                flex
                                                items-center

                                                gap-2

                                                rounded-xl

                                                px-4
                                                py-2.5

                                                text-[12px]
                                                font-bold

                                                uppercase
                                                tracking-[0.08em]

                                                transition-all
                                                duration-200

                                                ${
                                                    active
                                                        ? `
                                                            bg-indigo-500/15
                                                            text-indigo-300

                                                            shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]
                                                        `
                                                        : `
                                                            text-gray-500

                                                            hover:bg-white/[0.035]
                                                            hover:text-gray-200
                                                        `
                                                }
                                            `}
                                        >

                                            <Icon
                                                size={15}
                                                strokeWidth={2}
                                            />


                                            <span>
                                                {
                                                    text
                                                }
                                            </span>

                                        </Link>
                                    );
                                }
                            )}

                        </nav>


                        {/* =====================================
                            RIGHT
                        ====================================== */}

                        <div
                            className="
                                flex
                                items-center

                                gap-2
                                sm:gap-3
                            "
                        >

                            {isLoggedIn ? (

                                <>

                                    {/* =========================
                                        FCOIN
                                    ========================== */}

                                    <Link
                                        to="/fcoin-history"

                                        className="
                                            hidden

                                            items-center

                                            gap-2

                                            rounded-full

                                            border
                                            border-amber-400/15

                                            bg-amber-400/[0.035]

                                            py-1
                                            pl-1
                                            pr-3

                                            transition-all
                                            duration-200

                                            hover:border-amber-400/30
                                            hover:bg-amber-400/[0.07]

                                            sm:flex
                                        "
                                    >

                                        <motion.div
                                            whileHover={{
                                                rotate: 8,
                                                scale: 1.08,
                                            }}

                                            transition={{
                                                duration: 0.2,
                                            }}

                                            className="
                                                grid
                                                h-9
                                                w-9

                                                place-items-center

                                                rounded-full

                                                border
                                                border-amber-400/20

                                                bg-amber-400/[0.06]
                                            "
                                        >

                                            <img
                                                src={
                                                    FCoinIcon
                                                }

                                                alt="FCoin"

                                                className="
                                                    h-6
                                                    w-6

                                                    object-contain
                                                "
                                            />

                                        </motion.div>


                                        <span
                                            className="
                                                text-[15px]
                                                font-bold

                                                tracking-tight

                                                text-amber-300
                                            "
                                        >
                                            {
                                                user?.coins ??
                                                0
                                            }
                                        </span>

                                    </Link>


                                    {/* =========================
                                        NOTIFICATIONS
                                    ========================== */}

                                    <NotificationDropdown
                                        openNotifications={
                                            openNotifications
                                        }

                                        setOpenNotifications={
                                            setOpenNotifications
                                        }

                                        notificationsRef={
                                            notificationsRef
                                        }
                                    />


                                    {/* =========================
                                        USER
                                    ========================== */}

                                    <div
                                        ref={
                                            userMenuRef
                                        }

                                        className="
                                            relative
                                        "
                                    >

                                        <button
                                            type="button"

                                            onClick={() => {
                                                setOpenNotifications(
                                                    false
                                                );


                                                setOpenUserMenu(
                                                    (previous) =>
                                                        !previous
                                                );
                                            }}

                                            aria-label="Foydalanuvchi menyusi"

                                            aria-expanded={
                                                openUserMenu
                                            }

                                            className="
                                                group/user

                                                flex
                                                items-center

                                                gap-2

                                                rounded-full

                                                border
                                                border-white/[0.07]

                                                bg-white/[0.035]

                                                p-1
                                                pr-2

                                                outline-none

                                                transition-all
                                                duration-200

                                                hover:border-indigo-400/30
                                                hover:bg-indigo-400/[0.055]

                                                sm:pr-3
                                            "
                                        >

                                            {/* =================
                                                AVATAR
                                            ================== */}

                                            <div
                                                className="
                                                    relative

                                                    h-9
                                                    w-9

                                                    flex-shrink-0

                                                    overflow-hidden

                                                    rounded-full

                                                    border
                                                    border-white/10

                                                    bg-[#161b22]

                                                    sm:h-10
                                                    sm:w-10
                                                "
                                            >

                                                <img
                                                    src={
                                                        avatarUrl
                                                    }

                                                    alt={
                                                        user?.username
                                                            ? `${user.username} avatar`
                                                            : "User avatar"
                                                    }

                                                    onError={
                                                        handleUserImageError
                                                    }

                                                    className="
                                                        h-full
                                                        w-full

                                                        object-cover
                                                    "
                                                />


                                                <span
                                                    className="
                                                        pointer-events-none

                                                        absolute
                                                        inset-0

                                                        rounded-full

                                                        ring-1
                                                        ring-inset
                                                        ring-white/[0.04]
                                                    "
                                                />

                                            </div>


                                            {/* =================
                                                USERNAME
                                            ================== */}

                                            <span
                                                className="
                                                    hidden

                                                    max-w-[110px]

                                                    truncate

                                                    text-[13px]
                                                    font-semibold

                                                    text-gray-200

                                                    transition-colors
                                                    duration-200

                                                    group-hover/user:text-indigo-200

                                                    md:block
                                                "
                                            >
                                                @
                                                {
                                                    user?.username ||
                                                    "user"
                                                }
                                            </span>


                                            {/* =================
                                                ARROW
                                            ================== */}

                                            <ChevronDown
                                                size={15}
                                                strokeWidth={2}

                                                className={`
                                                    hidden

                                                    text-gray-600

                                                    transition-transform
                                                    duration-200

                                                    sm:block

                                                    ${
                                                        openUserMenu
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                `}
                                            />

                                        </button>


                                        {/* =====================
                                            USER DROPDOWN
                                        ====================== */}

                                        <AnimatePresence>

                                            {openUserMenu && (

                                                <motion.div
                                                    variants={
                                                        dropdownVariants
                                                    }

                                                    initial="hidden"

                                                    animate="visible"

                                                    exit="exit"

                                                    className="
                                                        absolute
                                                        right-0
                                                        z-[60]

                                                        mt-3

                                                        w-[260px]

                                                        overflow-hidden

                                                        rounded-2xl

                                                        border
                                                        border-white/[0.07]

                                                        bg-[#11161e]/[0.98]

                                                        shadow-[0_25px_70px_rgba(0,0,0,0.55)]

                                                        backdrop-blur-xl
                                                    "
                                                >

                                                    {/* =================
                                                        USER INFO
                                                    ================== */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center

                                                            gap-3

                                                            border-b
                                                            border-white/[0.06]

                                                            bg-white/[0.02]

                                                            p-4
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                avatarUrl
                                                            }

                                                            alt={
                                                                user?.username
                                                                    ? `${user.username} avatar`
                                                                    : "User avatar"
                                                            }

                                                            onError={
                                                                handleUserImageError
                                                            }

                                                            className="
                                                                h-11
                                                                w-11

                                                                flex-shrink-0

                                                                rounded-full

                                                                border
                                                                border-white/10

                                                                bg-[#161b22]

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

                                                                    text-[14px]
                                                                    font-bold

                                                                    text-white
                                                                "
                                                            >
                                                                {
                                                                    user?.first_name

                                                                        ? `${user.first_name} ${user?.last_name || ""}`

                                                                        : user?.username ||
                                                                          "User"
                                                                }
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5

                                                                    truncate

                                                                    font-mono

                                                                    text-[10px]

                                                                    text-indigo-400
                                                                "
                                                            >
                                                                @
                                                                {
                                                                    user?.username ||
                                                                    "user"
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* =================
                                                        LINKS
                                                    ================== */}

                                                    <div
                                                        className="
                                                            p-2
                                                        "
                                                    >

                                                        {/* PROFILE */}

                                                        <Link
                                                            to={`/${user?.username || "user"}/profile`}

                                                            onClick={() =>
                                                                setOpenUserMenu(
                                                                    false
                                                                )
                                                            }

                                                            className="
                                                                flex
                                                                items-center

                                                                gap-3

                                                                rounded-xl

                                                                px-3
                                                                py-3

                                                                text-[13px]
                                                                font-semibold

                                                                text-gray-400

                                                                transition-all
                                                                duration-200

                                                                hover:bg-indigo-500/10
                                                                hover:text-indigo-300
                                                            "
                                                        >

                                                            <UserCircle
                                                                size={18}
                                                                strokeWidth={2}
                                                            />

                                                            Profilim

                                                        </Link>


                                                        {/* MY PROBLEMS */}

                                                        <Link
                                                            to="/my-problems"

                                                            onClick={() =>
                                                                setOpenUserMenu(
                                                                    false
                                                                )
                                                            }

                                                            className="
                                                                flex
                                                                items-center

                                                                gap-3

                                                                rounded-xl

                                                                px-3
                                                                py-3

                                                                text-[13px]
                                                                font-semibold

                                                                text-gray-400

                                                                transition-all
                                                                duration-200

                                                                hover:bg-cyan-400/[0.07]
                                                                hover:text-cyan-300
                                                            "
                                                        >

                                                            <Bug
                                                                size={18}
                                                                strokeWidth={2}
                                                            />

                                                            Muammolarim

                                                        </Link>


                                                        {/* FCOIN HISTORY */}

                                                        <Link
                                                            to="/fcoin-history"

                                                            onClick={() =>
                                                                setOpenUserMenu(
                                                                    false
                                                                )
                                                            }

                                                            className="
                                                                flex
                                                                items-center

                                                                gap-3

                                                                rounded-xl

                                                                px-3
                                                                py-3

                                                                text-[13px]
                                                                font-semibold

                                                                text-gray-400

                                                                transition-all
                                                                duration-200

                                                                hover:bg-amber-400/[0.07]
                                                                hover:text-amber-300
                                                            "
                                                        >

                                                            <Coins
                                                                size={18}
                                                                strokeWidth={2}
                                                            />

                                                            FCoin tarixi

                                                        </Link>


                                                        <div
                                                            className="
                                                                my-2
                                                                h-px

                                                                bg-white/[0.05]
                                                            "
                                                        />


                                                        {/* LOGOUT */}

                                                        <button
                                                            type="button"

                                                            onClick={
                                                                handleLogout
                                                            }

                                                            className="
                                                                flex
                                                                w-full

                                                                items-center

                                                                gap-3

                                                                rounded-xl

                                                                px-3
                                                                py-3

                                                                text-left

                                                                text-[13px]
                                                                font-semibold

                                                                text-red-400

                                                                transition-all
                                                                duration-200

                                                                hover:bg-red-500/[0.08]
                                                                hover:text-red-300
                                                            "
                                                        >

                                                            <LogOut
                                                                size={18}
                                                                strokeWidth={2}
                                                            />

                                                            Chiqish

                                                        </button>

                                                    </div>

                                                </motion.div>

                                            )}

                                        </AnimatePresence>

                                    </div>

                                </>

                            ) : (

                                /* =============================
                                    LOGIN
                                ============================== */

                                <Link
                                    to="/login"

                                    className="
                                        flex
                                        items-center

                                        gap-2

                                        rounded-xl

                                        bg-indigo-600

                                        px-4
                                        py-2.5

                                        text-[13px]
                                        font-bold

                                        text-white

                                        transition-all
                                        duration-200

                                        hover:bg-indigo-500
                                    "
                                >

                                    <LogIn
                                        size={17}
                                        strokeWidth={2}
                                    />


                                    <span
                                        className="
                                            hidden
                                            sm:inline
                                        "
                                    >
                                        Kirish
                                    </span>

                                </Link>

                            )}


                            {/* =================================
                                MOBILE SIDEBAR BUTTON
                            ================================== */}

                            <button
                                type="button"

                                onClick={
                                    toggleMobileMenu
                                }

                                aria-label="Mobil menyuni ochish"

                                aria-expanded={
                                    isMobileMenuOpen
                                }

                                className="
                                    grid

                                    h-10
                                    w-10

                                    place-items-center

                                    rounded-xl

                                    border
                                    border-cyan-400/10

                                    bg-cyan-400/[0.05]

                                    text-cyan-300

                                    transition-all
                                    duration-200

                                    hover:border-cyan-400/25
                                    hover:bg-cyan-400/[0.09]

                                    lg:hidden
                                "
                            >

                                <Menu
                                    size={20}
                                    strokeWidth={2}
                                />

                            </button>

                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                MOBILE SIDEBAR
            ================================================== */}

            <MobileNavbarSidebar
                isOpen={
                    isMobileMenuOpen
                }

                setIsOpen={
                    setIsMobileMenuOpen
                }

                navLinks={
                    NAV_LINKS
                }

                isActive={
                    isActive
                }

                isLoggedIn={
                    isLoggedIn
                }

                user={
                    user
                }

                avatarUrl={
                    avatarUrl
                }

                handleLogout={
                    handleLogout
                }
            />

        </>
    );
};


export default Navbar;