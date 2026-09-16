import React, {
    useMemo,
} from "react";

import {
    motion,
} from "framer-motion";

import {
    useSelector,
} from "react-redux";

import "./FCoin.css";

import FCoinImage from "../assests/coin/fcoin.png";

import {
    ArrowUpRight,
    BadgeCheck,
    Banknote,
    BookOpen,
    Bot,
    Bug,
    CheckCircle2,
    Crown,
    Gem,
    Gift,
    Heart,
    Lightbulb,
    Lock,
    Megaphone,
    MessageCircleMore,
    MessageSquareText,
    Palette,
    PenLine,
    Rocket,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    ThumbsUp,
    TrendingUp,
    Trophy,
    UploadCloud,
    Wallet,
    Zap,
} from "lucide-react";


// =========================================================
// FCOIN REWARD CONFIG
// =========================================================
//
// MUHIM:
//
// Bu frontendda FOYDALANUVCHIGA KO'RSATILADIGAN
// qiymatlar.
//
// Backenddagi haqiqiy reward:
//
// coins/reward_config.py
//
// bilan bir xil bo'lishi kerak.
//
// =========================================================

const FCOIN_REWARDS = {

    // =====================================================
    // CONTENT
    // =====================================================

    POST_UPLOAD:
        20,

    PROJECT_UPLOAD:
        100,


    // =====================================================
    // PROBLEMS
    // =====================================================

    PROBLEM_UPLOAD:
        5,

    PROBLEM_RESPONSE:
        5,

    PROBLEM_RESPONSE_STAR:
        2,

    BEST_SOLUTION:
        50,


    // =====================================================
    // COMMUNITY
    // =====================================================

    POST_COMMENT:
        2,

    ROADMAP_LIKE:
        5,

    COMMENT_ADMIN_LIKE:
        10,


    // =====================================================
    // SYSTEM
    // =====================================================

    DAILY_LOGIN:
        1,


    // =====================================================
    // FEEDBACK
    // =====================================================

    FEEDBACK: {

        BUG:
            40,

        SUGGESTION:
            25,

        PRAISE:
            10,

        OTHER:
            10,
    },
};


// =========================================================
// EARN WAYS
// =========================================================

const earnWays = [

    {
        icon:
            PenLine,

        title:
            "Yangi post yozish",

        desc:
            "Foydali maqola yoki tajriba ulashing.",

        bonus:
            FCOIN_REWARDS.POST_UPLOAD,

        tone:
            "emerald",
    },


    {
        icon:
            UploadCloud,

        title:
            "Muammo yuklash",

        desc:
            "Dasturlash muammosini community bilan ulashing.",

        bonus:
            FCOIN_REWARDS.PROBLEM_UPLOAD,

        tone:
            "blue",
    },


    {
        icon:
            BookOpen,

        title:
            "Muammoga javob yozish",

        desc:
            "Boshqa dasturchilarga foydali yechim bering.",

        bonus:
            FCOIN_REWARDS.PROBLEM_RESPONSE,

        tone:
            "emerald",
    },


    {
        icon:
            Star,

        title:
            "Yechimga star",

        desc:
            "Foydali yechimlar star orqali qo‘llab-quvvatlanadi.",

        bonus:
            FCOIN_REWARDS.PROBLEM_RESPONSE_STAR,

        tone:
            "yellow",
    },


    {
        icon:
            Crown,

        title:
            "Eng yaxshi yechim",

        desc:
            "Javobingiz accepted solution deb topilsa.",

        bonus:
            FCOIN_REWARDS.BEST_SOLUTION,

        tone:
            "yellow",
    },


    {
        icon:
            Rocket,

        title:
            "Loyiha yuklash",

        desc:
            "Portfolio uchun real loyiha qo‘shing.",

        bonus:
            FCOIN_REWARDS.PROJECT_UPLOAD,

        tone:
            "purple",
    },


    {
        icon:
            MessageCircleMore,

        title:
            "Postga comment yozish",

        desc:
            "Muhokamada foydali fikr qoldiring.",

        bonus:
            FCOIN_REWARDS.POST_COMMENT,

        tone:
            "cyan",
    },


    {
        icon:
            ThumbsUp,

        title:
            "Roadmap like olish",

        desc:
            "Roadmapingiz boshqa foydalanuvchi tomonidan yoqtirilsa.",

        bonus:
            FCOIN_REWARDS.ROADMAP_LIKE,

        tone:
            "pink",
    },


    {
        icon:
            BadgeCheck,

        title:
            "Admin commentni yoqtirsa",

        desc:
            "Admin foydali commentingizni maxsus belgilasa.",

        bonus:
            FCOIN_REWARDS.COMMENT_ADMIN_LIKE,

        tone:
            "indigo",
    },


    {
        icon:
            Zap,

        title:
            "Kunlik kirish",

        desc:
            "Platformaga muntazam kirib boring.",

        bonus:
            FCOIN_REWARDS.DAILY_LOGIN,

        tone:
            "blue",
    },
];


// =========================================================
// FEEDBACK REWARDS
// =========================================================

const feedbackRewards = [

    {
        icon:
            Bug,

        title:
            "Bug report",

        desc:
            "Haqiqiy xatoni toping va aniq tushuntiring. Admin tasdiqlasa reward beriladi.",

        bonus:
            FCOIN_REWARDS
                .FEEDBACK
                .BUG,

        tone:
            "red",

        badge:
            "Eng katta feedback reward",
    },


    {
        icon:
            Lightbulb,

        title:
            "Foydali taklif",

        desc:
            "Platformani yaxshilash uchun real va foydali g‘oya yuboring.",

        bonus:
            FCOIN_REWARDS
                .FEEDBACK
                .SUGGESTION,

        tone:
            "yellow",

        badge:
            "Admin tasdiqlaydi",
    },


    {
        icon:
            Heart,

        title:
            "Maqtov / ijobiy fikr",

        desc:
            "Platformadagi yaxshi jihatlar haqida sifatli feedback yuboring.",

        bonus:
            FCOIN_REWARDS
                .FEEDBACK
                .PRAISE,

        tone:
            "emerald",

        badge:
            "Admin tasdiqlaydi",
    },


    {
        icon:
            MessageSquareText,

        title:
            "Boshqa feedback",

        desc:
            "Bug yoki taklifga kirmaydigan, lekin platforma uchun foydali feedback.",

        bonus:
            FCOIN_REWARDS
                .FEEDBACK
                .OTHER,

        tone:
            "indigo",

        badge:
            "Admin tasdiqlaydi",
    },
];


// =========================================================
// SPEND WAYS
// =========================================================

const spendWays = [

    {
        icon:
            BadgeCheck,

        title:
            "Avatar ramkalari",

        desc:
            "Profil rasmingizga premium frame qo‘shing.",

        price:
            "250",
    },


    {
        icon:
            Palette,

        title:
            "Eksklyuziv profil temalari",

        desc:
            "Profil sahifangizni boshqalardan ajrating.",

        price:
            "500",
    },


    {
        icon:
            Megaphone,

        title:
            "Loyihani TOP-ga chiqarish",

        desc:
            "Loyihangizni ko‘proq foydalanuvchiga ko‘rsating.",

        price:
            "800",
    },


    {
        icon:
            Trophy,

        title:
            "Premium badge",

        desc:
            "Faolligingiz uchun maxsus nishonlar.",

        price:
            "1200",
    },
];


// =========================================================
// RULES
// =========================================================

const rules = [

    {
        icon:
            ShieldCheck,

        title:
            "Shaffoflik",

        desc:
            "Har bir FCoin harakati tarixda saqlanadi va profil hamyonida ko‘rinadi.",
    },


    {
        icon:
            Lock,

        title:
            "Ichki iqtisodiyot",

        desc:
            "FCoin haqiqiy valyuta emas. U FSociety ichidagi motivatsion aktiv hisoblanadi.",
    },


    {
        icon:
            Bot,

        title:
            "Anti-spam",

        desc:
            "Spam, bot yoki soxta faoliyat orqali yig‘ilgan FCoin bekor qilinishi mumkin.",
    },


    {
        icon:
            CheckCircle2,

        title:
            "Moderatsiya",

        desc:
            "Feedback reward faqat admin tasdiqlaganidan keyin beriladi.",
    },
];


// =========================================================
// ROADMAP
// =========================================================

const roadmap = [
    "FCoin history / transaction sahifasi",
    "Premium profil dizaynlari",
    "Loyihani boost qilish",
    "Badge shop va avatar frame",
];


// =========================================================
// TONE CLASSES
// =========================================================

const toneClasses = {

    emerald:
        "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10",

    pink:
        "border-pink-400/20 bg-pink-500/10 text-pink-300 shadow-pink-500/10",

    yellow:
        "border-yellow-400/20 bg-yellow-500/10 text-yellow-300 shadow-yellow-500/10",

    purple:
        "border-purple-400/20 bg-purple-500/10 text-purple-300 shadow-purple-500/10",

    blue:
        "border-sky-400/20 bg-sky-500/10 text-sky-300 shadow-sky-500/10",

    cyan:
        "border-cyan-400/20 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/10",

    indigo:
        "border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-indigo-500/10",

    red:
        "border-red-400/20 bg-red-500/10 text-red-300 shadow-red-500/10",
};


// =========================================================
// MOTION CARD
// =========================================================

const MotionCard = ({
    children,
    delay = 0,
    className = "",
}) => (

    <motion.div

        initial={{
            y:
                35,

            opacity:
                0,
        }}

        whileInView={{
            y:
                0,

            opacity:
                1,
        }}

        viewport={{
            once:
                true,

            margin:
                "-80px",
        }}

        transition={{
            duration:
                0.55,

            delay,
        }}

        className={
            className
        }
    >

        {children}

    </motion.div>
);


// =========================================================
// REWARD ROW
// =========================================================

const RewardRow = ({
    item,
    index,
}) => {

    const Icon =
        item.icon;


    return (

        <motion.div

            initial={{
                x:
                    -20,

                opacity:
                    0,
            }}

            whileInView={{
                x:
                    0,

                opacity:
                    1,
            }}

            viewport={{
                once:
                    true,
            }}

            transition={{
                delay:
                    index * 0.05,
            }}

            whileHover={{
                scale:
                    1.012,
            }}

            className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-white/5
                bg-white/[0.035]
                p-4
                transition-all
                hover:border-emerald-400/25
                hover:bg-emerald-500/[0.06]
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
                    shadow-lg
                    ${
                        toneClasses[
                            item.tone
                        ]
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
                    flex-1
                "
            >

                <h3
                    className="
                        truncate
                        text-sm
                        font-black
                        text-white
                        sm:text-base
                    "
                >
                    {item.title}
                </h3>


                <p
                    className="
                        mt-1
                        line-clamp-2
                        text-xs
                        font-medium
                        leading-5
                        text-gray-500
                        sm:text-sm
                    "
                >
                    {item.desc}
                </p>

            </div>


            <span
                className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-emerald-400/25
                    bg-emerald-500/15
                    px-3
                    py-1.5
                    text-sm
                    font-black
                    text-emerald-200
                "
            >

                <img
                    src={
                        FCoinImage
                    }
                    alt=""
                    className="
                        h-4
                        w-4
                        object-contain
                    "
                />

                +
                {
                    item.bonus
                }

            </span>

        </motion.div>
    );
};


// =========================================================
// FEEDBACK REWARD CARD
// =========================================================

const FeedbackRewardCard = ({
    item,
    index,
}) => {

    const Icon =
        item.icon;


    return (

        <motion.div

            initial={{
                opacity:
                    0,

                y:
                    20,
            }}

            whileInView={{
                opacity:
                    1,

                y:
                    0,
            }}

            viewport={{
                once:
                    true,
            }}

            transition={{
                delay:
                    index * 0.06,
            }}

            whileHover={{
                y:
                    -4,
            }}

            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.06]
                bg-[#090c12]/75
                p-5
                transition-all
                hover:border-cyan-400/20
                hover:bg-cyan-500/[0.035]
            "
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-32
                    w-32
                    rounded-full
                    bg-cyan-500/[0.06]
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
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className={`
                            grid
                            h-12
                            w-12
                            place-items-center
                            rounded-2xl
                            border
                            ${
                                toneClasses[
                                    item.tone
                                ]
                            }
                        `}
                    >

                        <Icon
                            size={22}
                        />

                    </div>


                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-yellow-400/20
                            bg-yellow-500/10
                            px-3
                            py-1.5
                            text-sm
                            font-black
                            text-yellow-300
                        "
                    >

                        <img
                            src={
                                FCoinImage
                            }
                            alt=""
                            className="
                                h-4
                                w-4
                                object-contain
                            "
                        />

                        +
                        {
                            item.bonus
                        }

                    </span>

                </div>


                <h3
                    className="
                        mt-5
                        text-lg
                        font-black
                        text-white
                    "
                >
                    {item.title}
                </h3>


                <p
                    className="
                        mt-2
                        text-sm
                        font-medium
                        leading-6
                        text-gray-500
                    "
                >
                    {item.desc}
                </p>


                <div
                    className="
                        mt-4
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-cyan-400/15
                        bg-cyan-500/[0.06]
                        px-3
                        py-1
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider
                        text-cyan-300
                    "
                >

                    <ShieldCheck
                        size={12}
                    />

                    {item.badge}

                </div>

            </div>

        </motion.div>
    );
};


// =========================================================
// FCOIN PAGE
// =========================================================

const FCoin = () => {

    const {
        user,
    } = useSelector(
        (
            state
        ) =>
            state.auth
            || {}
    );


    const currentCoins =
        user?.coins
        ?? 0;


    // =====================================================
    // MAX BONUS
    // =====================================================

    const biggestReward =
        useMemo(
            () => {

                const general =
                    earnWays.map(
                        (
                            item
                        ) =>
                            item.bonus
                    );


                const feedback =
                    feedbackRewards.map(
                        (
                            item
                        ) =>
                            item.bonus
                    );


                return Math.max(
                    ...general,
                    ...feedback
                );

            },
            []
        );


    // =====================================================
    // FLOATING COINS
    // =====================================================

    const floatingCoins =
        useMemo(
            () => {

                return Array
                    .from({
                        length:
                            14,
                    })
                    .map(
                        (
                            _,
                            index
                        ) => ({

                            id:
                                index,

                            size:
                                22
                                +
                                (
                                    (
                                        index
                                        * 13
                                    )
                                    % 42
                                ),

                            left:
                                (
                                    index
                                    * 19
                                )
                                % 100,

                            delay:
                                (
                                    index
                                    * 0.55
                                )
                                % 6,

                            duration:
                                12
                                +
                                (
                                    (
                                        index
                                        * 7
                                    )
                                    % 10
                                ),

                            blur:
                                index % 3 === 0
                                    ? "1.5px"
                                    : "0px",

                            opacity:
                                index % 2 === 0
                                    ? 0.18
                                    : 0.1,
                        })
                    );

            },
            []
        );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="
                fcoin-page
                relative
                min-h-screen
                overflow-hidden
                bg-[#05070a]
                text-white
            "
        >

            {/* =============================================
                BACKGROUND
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    fcoin-grid-bg
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-24
                    h-[420px]
                    w-[420px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/15
                    blur-[120px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    top-1/3
                    h-[360px]
                    w-[360px]
                    rounded-full
                    bg-yellow-500/10
                    blur-[110px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    bottom-20
                    h-[360px]
                    w-[360px]
                    rounded-full
                    bg-emerald-500/10
                    blur-[110px]
                "
            />


            {/* =============================================
                FLOATING COINS
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >

                {floatingCoins.map(
                    (
                        coin
                    ) => (

                        <motion.img
                            key={
                                coin.id
                            }
                            src={
                                FCoinImage
                            }
                            alt=""
                            className="
                                absolute
                                bottom-[-90px]
                                select-none
                            "
                            initial={{
                                y:
                                    0,

                                opacity:
                                    0,

                                rotate:
                                    0,
                            }}
                            animate={{
                                y:
                                    "-125vh",

                                opacity: [
                                    0,
                                    coin.opacity,
                                    coin.opacity,
                                    0,
                                ],

                                rotate:
                                    360,
                            }}
                            transition={{
                                duration:
                                    coin.duration,

                                repeat:
                                    Infinity,

                                delay:
                                    coin.delay,

                                ease:
                                    "linear",
                            }}
                            style={{
                                width:
                                    `${coin.size}px`,

                                left:
                                    `${coin.left}%`,

                                filter:
                                    `blur(${coin.blur}) drop-shadow(0 0 16px rgba(250, 204, 21, 0.35))`,
                            }}
                        />

                    )
                )}

            </div>


            {/* =============================================
                MAIN
            ============================================== */}

            <main
                className="
                    container
                    relative
                    z-10
                    mx-auto
                    px-4
                    py-12
                    sm:py-16
                "
            >

                {/* =========================================
                    HERO
                ========================================== */}

                <section
                    className="
                        mx-auto
                        max-w-6xl
                        pt-6
                        text-center
                    "
                >

                    <motion.div
                        initial={{
                            scale:
                                0.7,

                            opacity:
                                0,

                            rotateY:
                                -120,
                        }}
                        animate={{
                            scale:
                                1,

                            opacity:
                                1,

                            rotateY:
                                0,
                        }}
                        transition={{
                            type:
                                "spring",

                            stiffness:
                                110,

                            damping:
                                14,

                            delay:
                                0.1,
                        }}
                        className="
                            relative
                            mx-auto
                            flex
                            h-44
                            w-44
                            items-center
                            justify-center
                            sm:h-56
                            sm:w-56
                        "
                    >

                        <div
                            className="
                                absolute
                                inset-0
                                rounded-full
                                bg-yellow-400/20
                                blur-[55px]
                                fcoin-pulse
                            "
                        />


                        <div
                            className="
                                absolute
                                h-[78%]
                                w-[78%]
                                rounded-full
                                border
                                border-yellow-300/20
                            "
                        />


                        <div
                            className="
                                absolute
                                h-[98%]
                                w-[98%]
                                rounded-full
                                border
                                border-indigo-300/10
                            "
                        />


                        <motion.img
                            src={
                                FCoinImage
                            }
                            alt="FCoin"
                            className="
                                relative
                                z-10
                                h-32
                                w-32
                                object-contain
                                drop-shadow-[0_0_42px_rgba(250,204,21,0.45)]
                                sm:h-44
                                sm:w-44
                            "
                            animate={{
                                y: [
                                    0,
                                    -8,
                                    0,
                                ],

                                rotateY: [
                                    0,
                                    8,
                                    0,
                                ],
                            }}
                            transition={{
                                duration:
                                    4,

                                repeat:
                                    Infinity,

                                ease:
                                    "easeInOut",
                            }}
                        />

                    </motion.div>


                    <motion.div
                        initial={{
                            y:
                                25,

                            opacity:
                                0,
                        }}
                        animate={{
                            y:
                                0,

                            opacity:
                                1,
                        }}
                        transition={{
                            delay:
                                0.2,
                        }}
                        className="
                            mt-6
                        "
                    >

                        <div
                            className="
                                mx-auto
                                mb-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-yellow-400/20
                                bg-yellow-500/10
                                px-4
                                py-2
                                text-xs
                                font-black
                                uppercase
                                tracking-[0.25em]
                                text-yellow-300
                                shadow-lg
                                shadow-yellow-500/10
                                sm:text-sm
                            "
                        >

                            <Sparkles
                                size={16}
                            />

                            FixCoin Economy

                        </div>


                        <h1
                            className="
                                text-4xl
                                font-black
                                tracking-tight
                                text-white
                                sm:text-6xl
                                lg:text-7xl
                            "
                        >

                            FCoin{" "}

                            <span
                                className="
                                    fcoin-title-gradient
                                    italic
                                "
                            >
                                iqtisodiyoti
                            </span>

                        </h1>


                        <p
                            className="
                                mx-auto
                                mt-6
                                max-w-3xl
                                text-sm
                                font-medium
                                leading-7
                                text-gray-400
                                sm:text-lg
                                sm:leading-8
                            "
                        >
                            FCoin — FSociety ichidagi
                            motivatsion aktiv. Muammo yeching,
                            post yozing, loyiha yuklang,
                            foydali feedback yuboring va
                            communityga qo‘shgan hissangizni
                            raqamli qiymatga aylantiring.
                        </p>

                    </motion.div>


                    {/* =====================================
                        WALLET SUMMARY
                    ====================================== */}

                    <motion.div
                        initial={{
                            y:
                                30,

                            opacity:
                                0,
                        }}
                        animate={{
                            y:
                                0,

                            opacity:
                                1,
                        }}
                        transition={{
                            delay:
                                0.35,
                        }}
                        className="
                            mx-auto
                            mt-10
                            grid
                            max-w-5xl
                            gap-4
                            md:grid-cols-3
                        "
                    >

                        {/* WALLET */}

                        <div
                            className="
                                fcoin-glass-card
                                rounded-3xl
                                p-5
                                text-left
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
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-yellow-400/20
                                        bg-yellow-500/10
                                        text-yellow-300
                                    "
                                >

                                    <Wallet
                                        size={24}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Sizning hamyoningiz
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-white
                                        "
                                    >

                                        {
                                            currentCoins
                                        }
                                        {" "}

                                        <span
                                            className="
                                                text-base
                                                text-yellow-300
                                            "
                                        >
                                            FCoin
                                        </span>

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* BIGGEST */}

                        <div
                            className="
                                fcoin-glass-card
                                rounded-3xl
                                p-5
                                text-left
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
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-emerald-400/20
                                        bg-emerald-500/10
                                        text-emerald-300
                                    "
                                >

                                    <TrendingUp
                                        size={24}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Eng katta fixed bonus
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-white
                                        "
                                    >

                                        +
                                        {
                                            biggestReward
                                        }
                                        {" "}

                                        <span
                                            className="
                                                text-base
                                                text-emerald-300
                                            "
                                        >
                                            FCoin
                                        </span>

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FEEDBACK */}

                        <div
                            className="
                                fcoin-glass-card
                                rounded-3xl
                                p-5
                                text-left
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
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-cyan-400/20
                                        bg-cyan-500/10
                                        text-cyan-300
                                    "
                                >

                                    <Bug
                                        size={24}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Bug reward
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-white
                                        "
                                    >

                                        +
                                        {
                                            FCOIN_REWARDS
                                                .FEEDBACK
                                                .BUG
                                        }
                                        {" "}

                                        <span
                                            className="
                                                text-base
                                                text-cyan-300
                                            "
                                        >
                                            FCoin
                                        </span>

                                    </p>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </section>


                {/* =========================================
                    EARN + SPEND
                ========================================== */}

                <section
                    className="
                        mt-16
                        grid
                        gap-8
                        lg:grid-cols-2
                    "
                >

                    {/* =====================================
                        EARN
                    ====================================== */}

                    <MotionCard
                        className="
                            fcoin-panel
                            earning-panel
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-emerald-400/15
                            bg-gray-900/50
                            shadow-2xl
                            shadow-black/40
                            backdrop-blur-md
                        "
                    >

                        <div
                            className="
                                relative
                                p-5
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-20
                                    -top-20
                                    h-56
                                    w-56
                                    rounded-full
                                    bg-emerald-500/10
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    mb-8
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            mb-3
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-emerald-400/20
                                            bg-emerald-500/10
                                            px-3
                                            py-1
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-widest
                                            text-emerald-300
                                        "
                                    >

                                        <ArrowUpRight
                                            size={15}
                                        />

                                        Earn FCoin

                                    </div>


                                    <h2
                                        className="
                                            text-2xl
                                            font-black
                                            text-white
                                            sm:text-3xl
                                        "
                                    >
                                        FCoin ishlash yo‘llari
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-gray-400
                                        "
                                    >
                                        Platformaga foyda keltiring
                                        va har bir foydali hissangiz
                                        uchun reward oling.
                                    </p>

                                </div>


                                <div
                                    className="
                                        hidden
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        border
                                        border-emerald-400/20
                                        bg-emerald-500/10
                                        text-emerald-300
                                        sm:flex
                                    "
                                >

                                    <Banknote
                                        size={30}
                                    />

                                </div>

                            </div>


                            <div
                                className="
                                    relative
                                    z-10
                                    space-y-3
                                "
                            >

                                {earnWays.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <RewardRow
                                            key={
                                                item.title
                                            }
                                            item={
                                                item
                                            }
                                            index={
                                                index
                                            }
                                        />

                                    )
                                )}

                            </div>

                        </div>

                    </MotionCard>


                    {/* =====================================
                        SPEND
                    ====================================== */}

                    <MotionCard
                        delay={
                            0.08
                        }
                        className="
                            fcoin-panel
                            spending-panel
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-indigo-400/15
                            bg-gray-900/50
                            shadow-2xl
                            shadow-black/40
                            backdrop-blur-md
                        "
                    >

                        <div
                            className="
                                relative
                                p-5
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-20
                                    -top-20
                                    h-56
                                    w-56
                                    rounded-full
                                    bg-indigo-500/10
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    mb-8
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            mb-3
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-indigo-400/20
                                            bg-indigo-500/10
                                            px-3
                                            py-1
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-widest
                                            text-indigo-300
                                        "
                                    >

                                        <ShoppingCart
                                            size={15}
                                        />

                                        Spend FCoin

                                    </div>


                                    <h2
                                        className="
                                            text-2xl
                                            font-black
                                            text-white
                                            sm:text-3xl
                                        "
                                    >
                                        FCoin sarflash
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-gray-400
                                        "
                                    >
                                        Profil, loyiha va
                                        platformadagi
                                        imkoniyatlaringizni
                                        kuchaytiring.
                                    </p>

                                </div>


                                <div
                                    className="
                                        hidden
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-500/10
                                        text-indigo-300
                                        sm:flex
                                    "
                                >

                                    <Gift
                                        size={30}
                                    />

                                </div>

                            </div>


                            <div
                                className="
                                    relative
                                    z-10
                                    grid
                                    gap-3
                                    sm:grid-cols-2
                                "
                            >

                                {spendWays.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const Icon =
                                            item.icon;


                                        return (

                                            <motion.div

                                                key={
                                                    item.title
                                                }

                                                initial={{
                                                    y:
                                                        18,

                                                    opacity:
                                                        0,
                                                }}

                                                whileInView={{
                                                    y:
                                                        0,

                                                    opacity:
                                                        1,
                                                }}

                                                viewport={{
                                                    once:
                                                        true,
                                                }}

                                                transition={{
                                                    delay:
                                                        index
                                                        * 0.06,
                                                }}

                                                whileHover={{
                                                    y:
                                                        -4,
                                                }}

                                                className="
                                                    group
                                                    rounded-2xl
                                                    border
                                                    border-white/5
                                                    bg-white/[0.035]
                                                    p-4
                                                    transition-all
                                                    hover:border-indigo-400/30
                                                    hover:bg-indigo-500/10
                                                "
                                            >

                                                <div
                                                    className="
                                                        mb-4
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-11
                                                            w-11
                                                            items-center
                                                            justify-center
                                                            rounded-2xl
                                                            border
                                                            border-indigo-400/20
                                                            bg-indigo-500/10
                                                            text-indigo-300
                                                        "
                                                    >

                                                        <Icon
                                                            size={21}
                                                        />

                                                    </div>


                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            rounded-xl
                                                            border
                                                            border-yellow-400/20
                                                            bg-yellow-500/10
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-black
                                                            text-yellow-300
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                FCoinImage
                                                            }
                                                            alt=""
                                                            className="
                                                                h-4
                                                                w-4
                                                                object-contain
                                                            "
                                                        />

                                                        {
                                                            item.price
                                                        }

                                                    </span>

                                                </div>


                                                <h3
                                                    className="
                                                        text-base
                                                        font-black
                                                        text-white
                                                    "
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </h3>


                                                <p
                                                    className="
                                                        mt-2
                                                        text-sm
                                                        font-medium
                                                        leading-6
                                                        text-gray-400
                                                    "
                                                >
                                                    {
                                                        item.desc
                                                    }
                                                </p>

                                            </motion.div>
                                        );
                                    }
                                )}

                            </div>


                            <div
                                className="
                                    relative
                                    z-10
                                    mt-6
                                    rounded-3xl
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500/10
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        leading-7
                                        text-indigo-200
                                    "
                                >
                                    Kelajakda FCoin orqali
                                    avatar frame, premium badge,
                                    loyiha boost va FSociety
                                    brend sovg‘alarini olish
                                    imkoniyati qo‘shiladi.
                                </p>

                            </div>

                        </div>

                    </MotionCard>

                </section>


                {/* =========================================
                    FEEDBACK REWARDS
                ========================================== */}

                <section
                    className="
                        mt-10
                    "
                >

                    <MotionCard
                        className="
                            relative
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-cyan-400/15
                            bg-cyan-500/[0.025]
                            p-5
                            shadow-2xl
                            shadow-black/35
                            backdrop-blur-md
                            sm:p-8
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-32
                                -top-32
                                h-80
                                w-80
                                rounded-full
                                bg-cyan-500/[0.08]
                                blur-[100px]
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
                                    mb-8
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-cyan-400/20
                                            bg-cyan-500/10
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-widest
                                            text-cyan-300
                                        "
                                    >

                                        <MessageSquareText
                                            size={14}
                                        />

                                        Feedback Rewards

                                    </div>


                                    <h2
                                        className="
                                            mt-4
                                            text-2xl
                                            font-black
                                            text-white
                                            sm:text-3xl
                                        "
                                    >
                                        Feedback yuborib
                                        FCoin ishlang
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            max-w-3xl
                                            text-sm
                                            font-medium
                                            leading-7
                                            text-gray-400
                                        "
                                    >
                                        Feedback reward oddiy
                                        activitydan farq qiladi.
                                        Avval admin tekshiradi.
                                        Faqat tasdiqlangan,
                                        haqiqatan foydali feedback
                                        uchun FCoin beriladi.
                                    </p>

                                </div>


                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        border
                                        border-yellow-400/20
                                        bg-yellow-500/[0.08]
                                        px-4
                                        py-3
                                        text-xs
                                        font-bold
                                        text-yellow-200
                                    "
                                >

                                    <ShieldCheck
                                        size={17}
                                    />

                                    Admin approval required

                                </div>

                            </div>


                            <div
                                className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                    xl:grid-cols-4
                                "
                            >

                                {feedbackRewards.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <FeedbackRewardCard
                                            key={
                                                item.title
                                            }
                                            item={
                                                item
                                            }
                                            index={
                                                index
                                            }
                                        />

                                    )
                                )}

                            </div>

                        </div>

                    </MotionCard>

                </section>


                {/* =========================================
                    RULES + ROADMAP
                ========================================== */}

                <section
                    className="
                        mt-10
                        grid
                        gap-8
                        lg:grid-cols-[1.35fr_0.65fr]
                    "
                >

                    {/* RULES */}

                    <MotionCard
                        className="
                            rounded-[32px]
                            border
                            border-gray-700/70
                            bg-gray-900/55
                            p-5
                            shadow-2xl
                            shadow-black/35
                            backdrop-blur-md
                            sm:p-8
                        "
                    >

                        <div
                            className="
                                mb-8
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500/10
                                    text-indigo-300
                                "
                            >

                                <ShieldCheck
                                    size={28}
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                        sm:text-3xl
                                    "
                                >
                                    Tizim qoidalari
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-gray-500
                                    "
                                >
                                    FCoin adolatli va shaffof
                                    ishlashi uchun.
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >

                            {rules.map(
                                (
                                    rule
                                ) => {

                                    const Icon =
                                        rule.icon;


                                    return (

                                        <div
                                            key={
                                                rule.title
                                            }
                                            className="
                                                rounded-3xl
                                                border
                                                border-gray-700/60
                                                bg-gray-950/35
                                                p-5
                                                transition
                                                hover:border-indigo-400/30
                                                hover:bg-gray-900
                                            "
                                        >

                                            <div
                                                className="
                                                    mb-4
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    border
                                                    border-indigo-400/20
                                                    bg-indigo-500/10
                                                    text-indigo-300
                                                "
                                            >

                                                <Icon
                                                    size={22}
                                                />

                                            </div>


                                            <h3
                                                className="
                                                    text-lg
                                                    font-black
                                                    text-white
                                                "
                                            >
                                                {
                                                    rule.title
                                                }
                                            </h3>


                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    font-medium
                                                    leading-6
                                                    text-gray-400
                                                "
                                            >
                                                {
                                                    rule.desc
                                                }
                                            </p>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </MotionCard>


                    {/* ROADMAP */}

                    <MotionCard
                        delay={
                            0.08
                        }
                        className="
                            rounded-[32px]
                            border
                            border-yellow-400/15
                            bg-yellow-500/[0.045]
                            p-5
                            shadow-2xl
                            shadow-black/35
                            backdrop-blur-md
                            sm:p-8
                        "
                    >

                        <div
                            className="
                                mb-6
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    border
                                    border-yellow-400/20
                                    bg-yellow-500/10
                                    text-yellow-300
                                "
                            >

                                <Star
                                    size={27}
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                    "
                                >
                                    Keyingi bosqich
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-gray-500
                                    "
                                >
                                    FCoin uchun roadmap
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                space-y-4
                            "
                        >

                            {roadmap.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={
                                            item
                                        }
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            rounded-2xl
                                            border
                                            border-white/5
                                            bg-white/[0.035]
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-yellow-400/20
                                                bg-yellow-500/10
                                                text-xs
                                                font-black
                                                text-yellow-300
                                            "
                                        >
                                            {
                                                index
                                                + 1
                                            }
                                        </div>


                                        <p
                                            className="
                                                text-sm
                                                font-bold
                                                leading-6
                                                text-gray-300
                                            "
                                        >
                                            {item}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </MotionCard>

                </section>

            </main>

        </div>
    );
};


export default FCoin;