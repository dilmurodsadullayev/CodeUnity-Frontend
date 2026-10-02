// src/components/profile/ProfileHero.jsx

import React from "react";

import {
    AlertCircle,
    Bot,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle,
    ExternalLink,
    FolderKanban,
    Github,
    Globe,
    Image as ImageIcon,
    Loader2,
    MapPin,
    Pencil,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

import FCoinIcon from "../../assests/coin/fcoin.png";

import {
    cleanUrlText,
    formatGithubUrl,
    formatUrl,
    getSkillBadgeClass,
    normalizeGithubText,
} from "./profileHelpers";


// =========================================================
// ACTION BUTTON
// =========================================================

const ActionButton = ({
    children,
    onClick,
    variant = "gray",
    className = "",
    disabled = false,
}) => {
    const variants = {
        gray:
            "border-gray-600/70 bg-gray-700/80 text-white hover:bg-gray-600",

        pink:
            "border-pink-500/60 bg-pink-600 text-white hover:bg-pink-500 shadow-pink-600/20",

        indigo:
            "border-indigo-500/60 bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20",
    };


    return (
        <button
            type="button"
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            className={`
                inline-flex
                items-center
                justify-center

                gap-2

                rounded-xl

                border

                px-4
                py-2.5

                font-display

                text-sm
                font-semibold

                tracking-[0.01em]

                shadow-lg

                transition-all
                duration-300

                hover:-translate-y-0.5

                active:translate-y-0
                active:scale-[0.98]

                disabled:pointer-events-none
                disabled:opacity-60

                ${
                    variants[
                        variant
                    ]
                    ||
                    variants.gray
                }

                ${className}
            `}
        >
            {children}
        </button>
    );
};


// =========================================================
// INFO PILL
// =========================================================

const InfoPill = ({
    icon: Icon,
    label,
    value,
    href,
}) => {
    const content = (
        <div
            className="
                group

                flex
                min-h-[78px]

                items-center

                gap-4

                rounded-2xl

                border
                border-gray-700/70

                bg-gray-900/35

                p-4

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-indigo-500/50
                hover:bg-gray-800/70
            "
        >
            {/* =============================================
                ICON
            ============================================== */}

            <div
                className="
                    flex
                    h-11
                    w-11

                    shrink-0

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-indigo-400/20

                    bg-indigo-500/10

                    text-indigo-300

                    transition-transform
                    duration-300

                    group-hover:scale-105
                "
            >
                <Icon
                    size={21}
                    strokeWidth={2}
                />
            </div>


            {/* =============================================
                TEXT
            ============================================== */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >
                <p
                    className="
                        font-display

                        text-[10px]
                        font-semibold

                        uppercase

                        tracking-[0.12em]

                        text-gray-500
                    "
                >
                    {label}
                </p>


                <div
                    className="
                        mt-1

                        flex
                        min-w-0

                        items-center

                        gap-1.5

                        font-sans

                        text-sm
                        font-semibold

                        text-gray-100
                    "
                >
                    {
                        value
                            ? (
                                <span
                                    className="
                                        truncate
                                    "
                                    title={
                                        String(
                                            value
                                        )
                                    }
                                >
                                    {value}
                                </span>
                            )
                            : (
                                <span
                                    className="
                                        text-gray-500
                                    "
                                >
                                    Hali mavjud emas
                                </span>
                            )
                    }


                    {
                        href
                        &&
                        (
                            <ExternalLink
                                size={13}
                                className="
                                    shrink-0

                                    text-gray-500

                                    transition-colors

                                    group-hover:text-indigo-300
                                "
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );


    if (
        !href
    ) {
        return content;
    }


    return (
        <a
            href={
                href
            }
            target="_blank"
            rel="noopener noreferrer"
            className="
                block
            "
        >
            {content}
        </a>
    );
};


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
    icon: Icon,
    image,
    label,
    value,
    tone = "indigo",
}) => {
    const toneClass = {
        yellow:
            "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

        red:
            "border-red-400/20 bg-red-500/10 text-red-300",

        blue:
            "border-sky-400/20 bg-sky-500/10 text-sky-300",

        purple:
            "border-purple-400/20 bg-purple-500/10 text-purple-300",

        indigo:
            "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",
    };


    return (
        <div
            className="
                group

                relative
                overflow-hidden

                border-b
                border-r
                border-gray-700/60

                bg-gray-900/35

                p-4

                text-center

                transition-all
                duration-300

                hover:bg-gray-800/70

                md:border-b-0

                last:border-r-0
            "
        >
            {/* =============================================
                HOVER GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    bottom-0

                    h-12

                    bg-gradient-to-t
                    from-indigo-500/[0.05]
                    to-transparent

                    opacity-0

                    transition-opacity

                    group-hover:opacity-100
                "
            />


            {/* =============================================
                ICON
            ============================================== */}

            <div
                className={`
                    relative
                    z-10

                    mx-auto
                    mb-2

                    flex
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-2xl

                    border

                    transition-transform
                    duration-300

                    group-hover:scale-105

                    ${
                        toneClass[
                            tone
                        ]
                        ||
                        toneClass.indigo
                    }
                `}
            >
                {
                    image
                        ? (
                            <img
                                src={
                                    image
                                }
                                alt={
                                    label
                                }
                                className="
                                    h-6
                                    w-6

                                    object-contain
                                "
                            />
                        )
                        : (
                            <Icon
                                size={20}
                                strokeWidth={2}
                            />
                        )
                }
            </div>


            {/* =============================================
                LABEL
            ============================================== */}

            <p
                className="
                    relative
                    z-10

                    font-display

                    text-[10px]
                    font-semibold

                    uppercase

                    tracking-[0.1em]

                    text-gray-500
                "
            >
                {label}
            </p>


            {/* =============================================
                VALUE
            ============================================== */}

            <p
                className="
                    relative
                    z-10

                    mt-1

                    font-display

                    text-2xl
                    font-bold

                    tracking-tight

                    text-white
                "
            >
                {
                    value
                    ??
                    0
                }
            </p>
        </div>
    );
};


// =========================================================
// PROFILE HERO
// =========================================================

const ProfileHero = ({
    currentUser,

    isOwner,

    botLoading,
    isTelegramLinked,

    onConnectTelegram,
    onEditCover,
    onEditProfile,
}) => {
    // =====================================================
    // LINKS
    // =====================================================

    const websiteHref =
        formatUrl(
            currentUser?.website
        );


    const githubHref =
        formatGithubUrl(
            currentUser?.github
        );


    return (
        <section
            className="
                font-sans

                overflow-hidden

                rounded-3xl

                border
                border-gray-700/70

                bg-gray-900/70

                text-gray-100

                shadow-2xl
                shadow-black/40
            "
        >
            {/* =============================================
                COVER
            ============================================== */}

            <div
                className="
                    relative

                    h-44

                    bg-cover
                    bg-center

                    sm:h-52
                    md:h-72
                "
                style={{
                    backgroundImage:
                        currentUser?.coverImage
                            ? `url("${currentUser.coverImage}")`
                            : undefined,
                }}
            >
                {/* =========================================
                    DARK OVERLAY
                ========================================== */}

                <div
                    className="
                        absolute
                        inset-0

                        bg-gradient-to-b
                        from-black/10
                        via-black/25
                        to-gray-900
                    "
                />


                {/* =========================================
                    COLOR GLOWS
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-0

                        bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.12),transparent_35%)]
                    "
                />


                {/* =========================================
                    COVER EDIT
                ========================================== */}

                {
                    isOwner
                    &&
                    (
                        <button
                            type="button"
                            onClick={
                                onEditCover
                            }
                            className="
                                absolute
                                right-3
                                top-3

                                inline-flex
                                h-11
                                w-11

                                items-center
                                justify-center

                                rounded-2xl

                                border
                                border-white/10

                                bg-black/45

                                font-display

                                text-sm
                                font-semibold

                                text-white

                                backdrop-blur-md

                                transition-all
                                duration-300

                                hover:-translate-y-0.5
                                hover:border-white/20
                                hover:bg-black/65

                                active:translate-y-0

                                sm:right-4
                                sm:top-4
                                sm:w-auto
                                sm:px-4
                            "
                        >
                            <ImageIcon
                                size={17}
                            />


                            <span
                                className="
                                    ml-2
                                    hidden

                                    sm:inline
                                "
                            >
                                Fon rasmi
                            </span>
                        </button>
                    )
                }
            </div>


            {/* =============================================
                PROFILE HEADER
            ============================================== */}

            <div
                className="
                    relative

                    px-4
                    pb-5

                    sm:px-6
                "
            >
                <div
                    className="
                        -mt-12

                        flex
                        items-end

                        gap-3

                        sm:-mt-16
                        sm:gap-5

                        lg:justify-between
                    "
                >
                    {/* =====================================
                        USER
                    ====================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1

                            items-end

                            gap-3

                            sm:gap-5
                        "
                    >
                        {/* =================================
                            AVATAR
                        ================================== */}

                        <div
                            className="
                                relative
                                shrink-0
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-0

                                    rounded-full

                                    bg-indigo-500/30

                                    blur-2xl
                                "
                            />


                            <img
                                src={
                                    currentUser?.profileImage
                                }
                                alt={
                                    currentUser?.fullName
                                        ? `${currentUser.fullName} profil rasmi`
                                        : "Profil rasmi"
                                }
                                className="
                                    relative

                                    h-24
                                    w-24

                                    rounded-full

                                    border-4
                                    border-gray-900

                                    object-cover

                                    shadow-2xl
                                    shadow-black/50

                                    sm:h-32
                                    sm:w-32
                                "
                            />


                            <span
                                className="
                                    absolute
                                    bottom-3
                                    right-1.5

                                    h-4
                                    w-4

                                    rounded-full

                                    border-2
                                    border-gray-900

                                    bg-emerald-400

                                    shadow-[0_0_16px_rgba(52,211,153,0.5)]

                                    sm:bottom-4
                                    sm:right-2
                                "
                            />
                        </div>


                        {/* =================================
                            PROFILE TEXT
                        ================================== */}

                        <div
                            className="
                                min-w-0

                                pb-1

                                text-left
                            "
                        >
                            {/* =============================
                                NAME + LEVEL
                            ============================== */}

                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-col

                                    items-start

                                    gap-2

                                    sm:flex-row
                                    sm:flex-wrap
                                    sm:items-center
                                "
                            >
                                <h1
                                    className="
                                        max-w-full

                                        truncate

                                        font-display

                                        text-2xl
                                        font-bold

                                        tracking-[-0.03em]

                                        text-white

                                        sm:text-3xl
                                        md:text-4xl
                                    "
                                >
                                    {
                                        currentUser?.fullName
                                    }
                                </h1>


                                {
                                    currentUser?.skillLevel
                                    &&
                                    (
                                        <span
                                            className={`
                                                inline-flex
                                                max-w-full

                                                items-center

                                                gap-2

                                                rounded-full

                                                border

                                                px-3
                                                py-1.5

                                                font-display

                                                text-[10px]
                                                font-semibold

                                                uppercase

                                                tracking-[0.08em]

                                                shadow-lg

                                                sm:text-[11px]

                                                ${getSkillBadgeClass(
                                                    currentUser?.rawSkillLevel
                                                )}
                                            `}
                                        >
                                            <Sparkles
                                                size={14}
                                            />


                                            <span
                                                className="
                                                    truncate
                                                "
                                            >
                                                {
                                                    currentUser.skillLevel
                                                }
                                            </span>
                                        </span>
                                    )
                                }
                            </div>


                            {/* =============================
                                POSITION / COMPANY / LOCATION
                            ============================== */}

                            <div
                                className="
                                    mt-2

                                    flex
                                    flex-wrap

                                    items-center

                                    gap-x-3
                                    gap-y-1.5

                                    font-sans

                                    text-xs
                                    font-medium

                                    text-gray-400

                                    sm:mt-3
                                    sm:text-sm
                                "
                            >
                                <span
                                    className="
                                        inline-flex
                                        items-center

                                        gap-1.5
                                    "
                                >
                                    <Briefcase
                                        size={15}
                                        className="
                                            text-indigo-300
                                        "
                                    />

                                    {
                                        currentUser?.position
                                        ||
                                        "Lavozim kiritilmagan"
                                    }
                                </span>


                                <span
                                    aria-hidden="true"
                                    className="
                                        hidden
                                        h-1
                                        w-1

                                        rounded-full

                                        bg-gray-600

                                        sm:inline-block
                                    "
                                />


                                <span
                                    className="
                                        inline-flex
                                        items-center

                                        gap-1.5
                                    "
                                >
                                    <ShieldCheck
                                        size={15}
                                        className="
                                            text-emerald-300
                                        "
                                    />

                                    {
                                        currentUser?.company
                                        ||
                                        "Kompaniya kiritilmagan"
                                    }
                                </span>


                                <span
                                    aria-hidden="true"
                                    className="
                                        hidden
                                        h-1
                                        w-1

                                        rounded-full

                                        bg-gray-600

                                        sm:inline-block
                                    "
                                />


                                <span
                                    className="
                                        inline-flex
                                        items-center

                                        gap-1.5
                                    "
                                >
                                    <MapPin
                                        size={15}
                                        className="
                                            text-pink-300
                                        "
                                    />

                                    {
                                        currentUser?.location
                                        ||
                                        "Manzil kiritilmagan"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* =====================================
                        DESKTOP ACTIONS
                    ====================================== */}

                    <div
                        className="
                            hidden
                            shrink-0

                            flex-wrap

                            items-center
                            justify-end

                            gap-2

                            lg:flex
                        "
                    >
                        {
                            isOwner
                            &&
                            (
                                <>
                                    <ActionButton
                                        variant={
                                            isTelegramLinked
                                                ? "indigo"
                                                : "gray"
                                        }
                                        onClick={
                                            onConnectTelegram
                                        }
                                        disabled={
                                            botLoading
                                        }
                                        className={
                                            isTelegramLinked
                                                ? (
                                                    "border-emerald-400/60 "
                                                    +
                                                    "bg-emerald-600/20 "
                                                    +
                                                    "text-emerald-200 "
                                                    +
                                                    "hover:bg-emerald-600/30"
                                                )
                                                : ""
                                        }
                                    >
                                        {
                                            botLoading
                                                ? (
                                                    <Loader2
                                                        size={17}
                                                        className="
                                                            animate-spin
                                                        "
                                                    />
                                                )
                                                : isTelegramLinked
                                                    ? (
                                                        <CheckCircle
                                                            size={17}
                                                        />
                                                    )
                                                    : (
                                                        <Bot
                                                            size={17}
                                                        />
                                                    )
                                        }


                                        {
                                            isTelegramLinked
                                                ? "Bot ulangan"
                                                : "Botni ulash"
                                        }
                                    </ActionButton>


                                    <ActionButton
                                        onClick={
                                            onEditCover
                                        }
                                    >
                                        <ImageIcon
                                            size={17}
                                        />

                                        Fon rasmi
                                    </ActionButton>


                                    <ActionButton
                                        variant="pink"
                                        onClick={
                                            onEditProfile
                                        }
                                    >
                                        <Pencil
                                            size={17}
                                        />

                                        Tahrirlash
                                    </ActionButton>
                                </>
                            )
                        }
                    </div>
                </div>


                {/* =========================================
                    MOBILE ACTIONS
                ========================================== */}

                {
                    isOwner
                    &&
                    (
                        <div
                            className="
                                mt-5

                                grid
                                grid-cols-3

                                gap-2

                                lg:hidden
                            "
                        >
                            <ActionButton
                                variant={
                                    isTelegramLinked
                                        ? "indigo"
                                        : "gray"
                                }
                                onClick={
                                    onConnectTelegram
                                }
                                disabled={
                                    botLoading
                                }
                                className={`
                                    w-full
                                    px-2

                                    ${
                                        isTelegramLinked
                                            ? (
                                                "border-emerald-400/60 "
                                                +
                                                "bg-emerald-600/20 "
                                                +
                                                "text-emerald-200"
                                            )
                                            : ""
                                    }
                                `}
                            >
                                {
                                    botLoading
                                        ? (
                                            <Loader2
                                                size={17}
                                                className="
                                                    animate-spin
                                                "
                                            />
                                        )
                                        : isTelegramLinked
                                            ? (
                                                <CheckCircle
                                                    size={17}
                                                />
                                            )
                                            : (
                                                <Bot
                                                    size={17}
                                                />
                                            )
                                }


                                <span
                                    className="
                                        truncate
                                    "
                                >
                                    {
                                        isTelegramLinked
                                            ? "Ulangan"
                                            : "Bot"
                                    }
                                </span>
                            </ActionButton>


                            <ActionButton
                                onClick={
                                    onEditCover
                                }
                                className="
                                    w-full
                                    px-2
                                "
                            >
                                <ImageIcon
                                    size={17}
                                />

                                Fon
                            </ActionButton>


                            <ActionButton
                                variant="pink"
                                onClick={
                                    onEditProfile
                                }
                                className="
                                    w-full
                                    px-2
                                "
                            >
                                <Pencil
                                    size={17}
                                />

                                Edit
                            </ActionButton>
                        </div>
                    )
                }


                {/* =========================================
                    INFO ROW
                ========================================== */}

                <div
                    className="
                        mt-6

                        grid

                        gap-3

                        sm:grid-cols-2
                        xl:grid-cols-5
                    "
                >
                    <InfoPill
                        icon={
                            Briefcase
                        }
                        label="Lavozim"
                        value={
                            currentUser?.position
                        }
                    />


                    <InfoPill
                        icon={
                            Building2
                        }
                        label="Kompaniya"
                        value={
                            currentUser?.company
                        }
                    />


                    <InfoPill
                        icon={
                            CalendarDays
                        }
                        label="A’zolik sanasi"
                        value={
                            currentUser?.memberSince
                        }
                    />


                    <InfoPill
                        icon={
                            Globe
                        }
                        label="Veb-sayt"
                        value={
                            currentUser?.website
                                ? cleanUrlText(
                                    currentUser.website
                                )
                                : null
                        }
                        href={
                            websiteHref
                        }
                    />


                    <InfoPill
                        icon={
                            Github
                        }
                        label="GitHub"
                        value={
                            currentUser?.github
                                ? normalizeGithubText(
                                    currentUser.github
                                )
                                : null
                        }
                        href={
                            githubHref
                        }
                    />
                </div>
            </div>


            {/* =============================================
                STATS
            ============================================== */}

            <div
                className="
                    grid
                    grid-cols-2

                    overflow-hidden

                    border-t
                    border-gray-700/70

                    bg-gray-950/30

                    md:grid-cols-5
                "
            >
                <StatCard
                    icon={
                        Star
                    }
                    label="Reyting"
                    value={
                        currentUser?.rating
                    }
                    tone="yellow"
                />


                <StatCard
                    image={
                        FCoinIcon
                    }
                    label="F Coin"
                    value={
                        currentUser?.fcoin
                    }
                    tone="yellow"
                />


                <StatCard
                    icon={
                        AlertCircle
                    }
                    label="Muammolar"
                    value={
                        currentUser?.problemCount
                    }
                    tone="red"
                />


                <StatCard
                    icon={
                        CheckCircle
                    }
                    label="Yechimlar"
                    value={
                        currentUser?.solutionCount
                    }
                    tone="blue"
                />


                <StatCard
                    icon={
                        FolderKanban
                    }
                    label="Loyihalar"
                    value={
                        currentUser?.projectsCount
                    }
                    tone="purple"
                />
            </div>
        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProfileHero;