import React, {
    useEffect,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    Bug,
    ChevronRight,
    Coins,
    LogIn,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";

import FSocietyLogo from "../assests/logo/f_society.png";
import UserImage from "../assests/userImage.jpeg";


// =========================================================
// SIDEBAR ANIMATION
// =========================================================

const sidebarVariants = {
    hidden: {
        x: "-100%",
    },

    visible: {
        x: 0,

        transition: {
            type: "spring",
            stiffness: 260,
            damping: 28,
        },
    },

    exit: {
        x: "-100%",

        transition: {
            duration: 0.2,
            ease: "easeInOut",
        },
    },
};


const overlayVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,

        transition: {
            duration: 0.2,
        },
    },

    exit: {
        opacity: 0,

        transition: {
            duration: 0.18,
        },
    },
};


// =========================================================
// MOBILE NAVBAR SIDEBAR
// =========================================================

const MobileNavbarSidebar = ({
    isOpen,
    setIsOpen,
    navLinks,
    isActive,
    isLoggedIn,
    user,
    avatarUrl,
    handleLogout,
}) => {

    // =====================================================
    // LOCK BODY SCROLL
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";


        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [
        isOpen,
    ]);


    // =====================================================
    // ESC CLOSE
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }


        const handleEscape = (
            event
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                setIsOpen(
                    false
                );
            }
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
    }, [
        isOpen,
        setIsOpen,
    ]);


    // =====================================================
    // AVATAR ERROR
    // =====================================================

    const handleAvatarError = (
        event
    ) => {
        event.currentTarget.onerror =
            null;

        event.currentTarget.src =
            UserImage;
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <AnimatePresence>

            {isOpen && (

                <>

                    {/* =====================================
                        OVERLAY
                    ====================================== */}

                    <motion.button
                        type="button"

                        aria-label="Menyuni yopish"

                        className="
                            fixed
                            inset-0
                            z-[80]
                            cursor-default
                            bg-black/75
                            backdrop-blur-sm
                            lg:hidden
                        "

                        variants={
                            overlayVariants
                        }

                        initial="hidden"

                        animate="visible"

                        exit="exit"

                        onClick={() =>
                            setIsOpen(
                                false
                            )
                        }
                    />


                    {/* =====================================
                        SIDEBAR
                    ====================================== */}

                    <motion.aside
                        className="
                            fixed
                            left-0
                            top-0
                            z-[90]
                            flex
                            h-[100dvh]
                            w-[86%]
                            max-w-[360px]
                            flex-col
                            overflow-hidden
                            border-r
                            border-cyan-400/10
                            bg-[#080d18]/[0.99]
                            shadow-[25px_0_80px_rgba(0,0,0,0.65)]
                            backdrop-blur-2xl
                            lg:hidden
                        "

                        variants={
                            sidebarVariants
                        }

                        initial="hidden"

                        animate="visible"

                        exit="exit"
                    >

                        {/* =================================
                            HEADER
                        ================================== */}

                        <div
                            className="
                                relative
                                flex-shrink-0
                                overflow-hidden
                                border-b
                                border-white/[0.07]
                                p-4
                            "
                        >

                            {/* BACKGROUND GLOW */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-12
                                    -top-12
                                    h-36
                                    w-36
                                    rounded-full
                                    bg-cyan-500/15
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -bottom-12
                                    -left-12
                                    h-36
                                    w-36
                                    rounded-full
                                    bg-indigo-500/15
                                    blur-3xl
                                "
                            />


                            {/* TOP */}

                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <Link
                                    to="/"

                                    onClick={() =>
                                        setIsOpen(
                                            false
                                        )
                                    }

                                    className="
                                        flex
                                        min-w-0
                                        flex-1
                                        items-center
                                        gap-3
                                    "
                                >

                                    <motion.img
                                        src={
                                            FSocietyLogo
                                        }

                                        alt="F.Society"

                                        className="
                                            h-11
                                            w-11
                                            flex-shrink-0
                                            object-contain
                                        "

                                        whileHover={{
                                            rotate: 360,
                                        }}

                                        transition={{
                                            duration: 0.5,
                                        }}
                                    />


                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <h2
                                            className="
                                                truncate
                                                text-[23px]
                                                font-bold
                                                tracking-[-0.05em]
                                                text-white
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

                                        </h2>


                                        <p
                                            className="
                                                truncate
                                                font-mono
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-[0.25em]
                                                text-cyan-300/60
                                            "
                                        >
                                            Fix Society
                                        </p>

                                    </div>

                                </Link>


                                {/* CLOSE */}

                                <button
                                    type="button"

                                    onClick={() =>
                                        setIsOpen(
                                            false
                                        )
                                    }

                                    className="
                                        grid
                                        h-10
                                        w-10
                                        flex-shrink-0
                                        place-items-center
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.035]
                                        text-gray-500
                                        transition-all
                                        hover:border-red-400/30
                                        hover:bg-red-500/[0.08]
                                        hover:text-red-300
                                    "

                                    aria-label="Menyuni yopish"
                                >

                                    <X
                                        size={19}
                                        strokeWidth={2}
                                    />

                                </button>

                            </div>


                            {/* =============================
                                CURRENT USER
                            ============================== */}

                            {isLoggedIn && (

                                <div
                                    className="
                                        relative
                                        z-10
                                        mt-5
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-cyan-400/15
                                        bg-cyan-400/[0.045]
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

                                        {/* AVATAR */}

                                        <div
                                            className="
                                                relative
                                                h-12
                                                w-12
                                                flex-shrink-0
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                border-white/10
                                                bg-[#11161e]
                                            "
                                        >

                                            <img
                                                src={
                                                    avatarUrl ||
                                                    UserImage
                                                }

                                                alt={
                                                    user?.username
                                                        ? `${user.username} avatar`
                                                        : "User avatar"
                                                }

                                                onError={
                                                    handleAvatarError
                                                }

                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                        </div>


                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.22em]
                                                    text-gray-600
                                                "
                                            >
                                                Current user
                                            </p>


                                            <h3
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-[15px]
                                                    font-bold
                                                    text-white
                                                "
                                            >
                                                @
                                                {
                                                    user?.username ||
                                                    "user"
                                                }
                                            </h3>


                                            <div
                                                className="
                                                    mt-1.5
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-[10px]
                                                    font-semibold
                                                    text-gray-500
                                                "
                                            >

                                                <span
                                                    className="
                                                        uppercase
                                                    "
                                                >
                                                    {
                                                        user?.skill_level ||
                                                        user?.level ||
                                                        "developer"
                                                    }
                                                </span>


                                                <span
                                                    className="
                                                        text-gray-700
                                                    "
                                                >
                                                    /
                                                </span>


                                                <span
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1
                                                        text-amber-300
                                                    "
                                                >

                                                    <Coins
                                                        size={12}
                                                    />

                                                    {
                                                        user?.coins ??
                                                        0
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================
                            SCROLL AREA
                        ================================== */}

                        <div
                            className="
                                flex-1
                                overflow-y-auto
                            "
                        >

                            {/* =============================
                                NAVIGATION
                            ============================== */}

                            <nav
                                className="
                                    space-y-1.5
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        mb-3
                                        px-2
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.25em]
                                        text-gray-700
                                    "
                                >
                                    Navigation
                                </p>


                                {navLinks.map(
                                    (
                                        link
                                    ) => {
                                        const Icon =
                                            link.Icon;


                                        const active =
                                            isActive(
                                                link.path
                                            );


                                        return (
                                            <Link
                                                key={
                                                    link.path
                                                }

                                                to={
                                                    link.path
                                                }

                                                onClick={() =>
                                                    setIsOpen(
                                                        false
                                                    )
                                                }

                                                className={`
                                                    group
                                                    flex
                                                    items-center
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    px-3
                                                    py-3
                                                    transition-all
                                                    duration-200

                                                    ${
                                                        active

                                                            ? `
                                                                border-indigo-400/25
                                                                bg-indigo-500/10
                                                                text-indigo-200
                                                                shadow-[inset_0_0_0_1px_rgba(99,102,241,0.05)]
                                                            `

                                                            : `
                                                                border-transparent
                                                                text-gray-500
                                                                hover:border-white/[0.06]
                                                                hover:bg-white/[0.035]
                                                                hover:text-gray-200
                                                            `
                                                    }
                                                `}
                                            >

                                                {/* ICON */}

                                                <span
                                                    className={`
                                                        grid
                                                        h-10
                                                        w-10
                                                        flex-shrink-0
                                                        place-items-center
                                                        rounded-xl
                                                        border
                                                        transition-all

                                                        ${
                                                            active

                                                                ? `
                                                                    border-indigo-400/15
                                                                    bg-indigo-500/10
                                                                    text-indigo-300
                                                                `

                                                                : `
                                                                    border-white/[0.05]
                                                                    bg-white/[0.025]
                                                                    text-gray-600
                                                                    group-hover:text-cyan-300
                                                                `
                                                        }
                                                    `}
                                                >

                                                    {Icon && (

                                                        <Icon
                                                            size={17}
                                                            strokeWidth={2}
                                                        />

                                                    )}

                                                </span>


                                                {/* TEXT */}

                                                <span
                                                    className="
                                                        flex-1
                                                        text-[12px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.08em]
                                                    "
                                                >
                                                    {
                                                        link.text
                                                    }
                                                </span>


                                                <ChevronRight
                                                    size={15}

                                                    className="
                                                        text-gray-700
                                                        transition-transform
                                                        duration-200
                                                        group-hover:translate-x-0.5
                                                        group-hover:text-gray-500
                                                    "
                                                />

                                            </Link>
                                        );
                                    }
                                )}

                            </nav>


                            {/* =============================
                                ACCOUNT
                            ============================== */}

                            {isLoggedIn && (

                                <div
                                    className="
                                        px-4
                                        pb-4
                                    "
                                >

                                    <p
                                        className="
                                            mb-3
                                            px-2
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.25em]
                                            text-gray-700
                                        "
                                    >
                                        Account
                                    </p>


                                    <div
                                        className="
                                            space-y-1.5
                                        "
                                    >

                                        {/* PROFILE */}

                                        <Link
                                            to={`/${user?.username || "user"}/profile`}

                                            onClick={() =>
                                                setIsOpen(
                                                    false
                                                )
                                            }

                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-transparent
                                                px-3
                                                py-3
                                                text-gray-500
                                                transition-all
                                                hover:border-indigo-400/10
                                                hover:bg-indigo-500/[0.06]
                                                hover:text-indigo-300
                                            "
                                        >

                                            <span
                                                className="
                                                    grid
                                                    h-10
                                                    w-10
                                                    place-items-center
                                                    rounded-xl
                                                    bg-indigo-500/[0.07]
                                                    text-indigo-400
                                                "
                                            >
                                                <UserCircle
                                                    size={18}
                                                />
                                            </span>

                                            <span
                                                className="
                                                    text-[13px]
                                                    font-semibold
                                                "
                                            >
                                                Profilim
                                            </span>

                                            <ChevronRight
                                                size={15}
                                                className="ml-auto text-gray-700"
                                            />

                                        </Link>


                                        {/* PROBLEMS */}

                                        <Link
                                            to="/my-problems"

                                            onClick={() =>
                                                setIsOpen(
                                                    false
                                                )
                                            }

                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-transparent
                                                px-3
                                                py-3
                                                text-gray-500
                                                transition-all
                                                hover:border-cyan-400/10
                                                hover:bg-cyan-500/[0.05]
                                                hover:text-cyan-300
                                            "
                                        >

                                            <span
                                                className="
                                                    grid
                                                    h-10
                                                    w-10
                                                    place-items-center
                                                    rounded-xl
                                                    bg-cyan-500/[0.06]
                                                    text-cyan-400
                                                "
                                            >
                                                <Bug
                                                    size={18}
                                                />
                                            </span>

                                            <span
                                                className="
                                                    text-[13px]
                                                    font-semibold
                                                "
                                            >
                                                Muammolarim
                                            </span>

                                            <ChevronRight
                                                size={15}
                                                className="ml-auto text-gray-700"
                                            />

                                        </Link>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================
                            BOTTOM
                        ================================== */}

                        <div
                            className="
                                flex-shrink-0
                                border-t
                                border-white/[0.06]
                                bg-black/10
                                p-4
                            "
                        >

                            {isLoggedIn ? (

                                <button
                                    type="button"

                                    onClick={
                                        handleLogout
                                    }

                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2.5
                                        rounded-xl
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.07]
                                        px-4
                                        py-3.5
                                        text-[12px]
                                        font-bold
                                        uppercase
                                        tracking-[0.1em]
                                        text-red-300
                                        transition-all
                                        hover:border-red-400/25
                                        hover:bg-red-500/[0.12]
                                    "
                                >

                                    <LogOut
                                        size={17}
                                        strokeWidth={2}
                                    />

                                    Chiqish

                                </button>

                            ) : (

                                <Link
                                    to="/login"

                                    onClick={() =>
                                        setIsOpen(
                                            false
                                        )
                                    }

                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2.5
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-indigo-600
                                        to-violet-600
                                        px-4
                                        py-3.5
                                        text-[12px]
                                        font-bold
                                        uppercase
                                        tracking-[0.1em]
                                        text-white
                                        shadow-lg
                                        shadow-indigo-600/15
                                        transition-all
                                        hover:brightness-110
                                    "
                                >

                                    <LogIn
                                        size={17}
                                        strokeWidth={2}
                                    />

                                    Kirish

                                </Link>

                            )}

                        </div>

                    </motion.aside>

                </>

            )}

        </AnimatePresence>
    );
};


export default MobileNavbarSidebar;