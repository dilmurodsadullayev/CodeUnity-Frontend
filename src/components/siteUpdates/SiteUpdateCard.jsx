import React from "react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import {
    Bug,
    CalendarDays,
    ChevronDown,
    Heart,
    Loader2,
    Megaphone,
    Newspaper,
    ShieldCheck,
    Sparkles,
    Wrench,
} from "lucide-react";


// =========================================================
// UPDATE TYPE NORMALIZER
// =========================================================

const normalizeUpdateType = (value) => {
    const type = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");

    if (
        [
            "feature",
            "new_feature",
            "new",
            "yangi",
            "yangi_imkoniyat",
        ].includes(type)
    ) {
        return "feature";
    }

    if (
        [
            "improvement",
            "improve",
            "enhancement",
            "upgrade",
            "yaxshilanish",
        ].includes(type)
    ) {
        return "improvement";
    }

    if (
        [
            "fix",
            "bug",
            "bug_fix",
            "bugfix",
            "fixed",
            "xato",
            "xatolik",
        ].includes(type)
    ) {
        return "fix";
    }

    if (
        [
            "security",
            "secure",
            "xavfsizlik",
        ].includes(type)
    ) {
        return "security";
    }

    if (
        [
            "announcement",
            "announce",
            "news",
            "elon",
            "e'lon",
        ].includes(type)
    ) {
        return "announcement";
    }

    return "default";
};


// =========================================================
// UPDATE TYPE CONFIG
// =========================================================

const UPDATE_TYPE_CONFIG = {
    feature: {
        label: "Yangi imkoniyat",
        shortLabel: "FEATURE",
        Icon: Sparkles,
        badgeClass:
            "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300",
        iconWrapperClass:
            "border-cyan-400/25 bg-gradient-to-br from-cyan-400/[0.15] to-cyan-400/[0.035] text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.08)]",
        iconGlowClass: "bg-cyan-400/20",
        dotClass: "bg-cyan-400",
        shortLabelClass: "text-cyan-400/70",
        titleHoverClass: "group-hover/item:text-cyan-200",
    },

    improvement: {
        label: "Yaxshilanish",
        shortLabel: "IMPROVEMENT",
        Icon: Wrench,
        badgeClass:
            "border-indigo-400/25 bg-indigo-400/[0.08] text-indigo-300",
        iconWrapperClass:
            "border-indigo-400/25 bg-gradient-to-br from-indigo-400/[0.15] to-indigo-400/[0.035] text-indigo-300 shadow-[0_0_24px_rgba(129,140,248,0.08)]",
        iconGlowClass: "bg-indigo-400/20",
        dotClass: "bg-indigo-400",
        shortLabelClass: "text-indigo-400/70",
        titleHoverClass: "group-hover/item:text-indigo-200",
    },

    fix: {
        label: "Bug fix",
        shortLabel: "FIX",
        Icon: Bug,
        badgeClass:
            "border-orange-400/25 bg-orange-400/[0.08] text-orange-300",
        iconWrapperClass:
            "border-orange-400/25 bg-gradient-to-br from-orange-400/[0.15] to-orange-400/[0.035] text-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.08)]",
        iconGlowClass: "bg-orange-400/20",
        dotClass: "bg-orange-400",
        shortLabelClass: "text-orange-400/70",
        titleHoverClass: "group-hover/item:text-orange-200",
    },

    security: {
        label: "Xavfsizlik",
        shortLabel: "SECURITY",
        Icon: ShieldCheck,
        badgeClass:
            "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300",
        iconWrapperClass:
            "border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.15] to-emerald-400/[0.035] text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.08)]",
        iconGlowClass: "bg-emerald-400/20",
        dotClass: "bg-emerald-400",
        shortLabelClass: "text-emerald-400/70",
        titleHoverClass: "group-hover/item:text-emerald-200",
    },

    announcement: {
        label: "E'lon",
        shortLabel: "ANNOUNCEMENT",
        Icon: Megaphone,
        badgeClass:
            "border-fuchsia-400/25 bg-fuchsia-400/[0.08] text-fuchsia-300",
        iconWrapperClass:
            "border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-400/[0.15] to-fuchsia-400/[0.035] text-fuchsia-300 shadow-[0_0_24px_rgba(232,121,249,0.08)]",
        iconGlowClass: "bg-fuchsia-400/20",
        dotClass: "bg-fuchsia-400",
        shortLabelClass: "text-fuchsia-400/70",
        titleHoverClass: "group-hover/item:text-fuchsia-200",
    },

    default: {
        label: "Yangilik",
        shortLabel: "UPDATE",
        Icon: Newspaper,
        badgeClass:
            "border-white/10 bg-white/[0.035] text-gray-300",
        iconWrapperClass:
            "border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-gray-300",
        iconGlowClass: "bg-white/10",
        dotClass: "bg-gray-400",
        shortLabelClass: "text-gray-500",
        titleHoverClass: "group-hover/item:text-white",
    },
};


// =========================================================
// GET CONFIG
// =========================================================

const getUpdateTypeConfig = (update) => {
    const type = normalizeUpdateType(
        update?.update_type
    );

    return (
        UPDATE_TYPE_CONFIG[type] ||
        UPDATE_TYPE_CONFIG.default
    );
};


// =========================================================
// DATE FORMAT
// =========================================================

const MONTHS = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
];


const formatUpdateDate = (value) => {
    if (!value) {
        return "Sana noma'lum";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Sana noma'lum";
    }

    return (
        `${date.getDate()} `
        + `${MONTHS[date.getMonth()]}, `
        + `${date.getFullYear()}`
    );
};


// =========================================================
// TYPE ICON
// =========================================================

const UpdateTypeIcon = ({
    update,
    large = false,
}) => {
    const config =
        getUpdateTypeConfig(update);

    const Icon =
        config.Icon;

    return (
        <div
            className={`
                group/icon
                relative
                grid
                flex-shrink-0
                place-items-center
                overflow-hidden
                border
                transition-all
                duration-300
                hover:scale-105
                ${large
                    ? "h-12 w-12 rounded-2xl"
                    : "h-9 w-9 rounded-xl"
                }
                ${config.iconWrapperClass}
            `}
        >
            <span
                className={`
                    pointer-events-none
                    absolute
                    h-8
                    w-8
                    rounded-full
                    blur-xl
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover/icon:opacity-100
                    ${config.iconGlowClass}
                `}
            />

            <Icon
                size={
                    large
                        ? 21
                        : 16
                }
                strokeWidth={2}
                className="
                    relative
                    z-10
                "
            />
        </div>
    );
};


// =========================================================
// TYPE BADGE
// =========================================================

const UpdateTypeBadge = ({
    update,
}) => {
    const config =
        getUpdateTypeConfig(update);

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[8px]
                font-black
                uppercase
                tracking-[0.13em]
                ${config.badgeClass}
            `}
        >
            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    shadow-[0_0_8px_currentColor]
                    ${config.dotClass}
                `}
            />

            {
                update?.update_type_label ||
                config.label
            }
        </span>
    );
};


// =========================================================
// LIKE BUTTON
// =========================================================

const LikeButton = ({
    update,
    loading,
    onLike,
}) => {
    const isLiked =
        Boolean(
            update?.is_liked
        );

    const likesCount =
        Number(
            update?.likes_count ??
            0
        );

    const handleClick = (
        event
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (loading) {
            return;
        }

        if (
            typeof onLike ===
            "function"
        ) {
            onLike(
                update.id
            );
        }
    };

    return (
        <motion.button
            type="button"
            whileHover={
                loading
                    ? {}
                    : {
                        scale: 1.04,
                    }
            }
            whileTap={
                loading
                    ? {}
                    : {
                        scale: 0.94,
                    }
            }
            onClick={
                handleClick
            }
            aria-label={
                isLiked
                    ? "Likeni olib tashlash"
                    : "Like bosish"
            }
            aria-busy={
                loading
            }
            className={`
                group/like
                relative
                inline-flex
                h-9
                min-w-[62px]
                flex-shrink-0
                items-center
                justify-center
                gap-1.5
                overflow-hidden
                rounded-xl
                border
                px-3
                font-mono
                text-[11px]
                font-bold
                outline-none
                transition-all
                duration-200
                ${loading
                    ? "cursor-wait opacity-75"
                    : "cursor-pointer"
                }
                ${isLiked
                    ? `
                        border-pink-400/30
                        bg-gradient-to-r
                        from-pink-500/[0.13]
                        to-rose-500/[0.08]
                        text-pink-300
                        shadow-[0_0_20px_rgba(244,114,182,0.08)]
                        hover:border-pink-400/45
                        hover:bg-pink-500/[0.16]
                        hover:shadow-[0_0_24px_rgba(244,114,182,0.13)]
                    `
                    : `
                        border-white/[0.07]
                        bg-white/[0.025]
                        text-gray-500
                        hover:border-pink-400/25
                        hover:bg-pink-500/[0.07]
                        hover:text-pink-300
                        hover:shadow-[0_0_20px_rgba(244,114,182,0.07)]
                    `
                }
            `}
        >
            <span
                className="
                    pointer-events-none
                    absolute
                    h-10
                    w-10
                    rounded-full
                    bg-pink-500/20
                    blur-xl
                    opacity-0
                    transition-all
                    duration-300
                    group-hover/like:scale-150
                    group-hover/like:opacity-100
                "
            />

            {loading ? (
                <Loader2
                    size={14}
                    strokeWidth={2}
                    className="
                        relative
                        z-10
                        animate-spin
                        text-pink-300
                    "
                />
            ) : (
                <Heart
                    size={14}
                    strokeWidth={2}
                    className={`
                        relative
                        z-10
                        transition-all
                        duration-200
                        ${isLiked
                            ? "scale-110 fill-current text-pink-300"
                            : "group-hover/like:scale-110 group-hover/like:text-pink-300"
                        }
                    `}
                />
            )}

            <span
                className="
                    relative
                    z-10
                    min-w-[8px]
                    text-center
                "
            >
                {
                    likesCount
                }
            </span>
        </motion.button>
    );
};


// =========================================================
// FEATURED / LATEST CARD
// =========================================================

const FeaturedUpdateCard = ({
    update,
    likeLoading,
    onLike,
}) => {
    const config =
        getUpdateTypeConfig(update);

    const releaseLabel =
        update?.is_featured
            ? "Featured release"
            : "Latest release";

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
            }}
            className="
                group/latest
                relative
                overflow-hidden
                rounded-3xl
                border
                border-cyan-400/15
                bg-gradient-to-r
                from-cyan-400/[0.045]
                via-white/[0.018]
                to-indigo-500/[0.035]
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            "
        >
            <div
                className={`
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    blur-[90px]
                    opacity-30
                    ${config.iconGlowClass}
                `}
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    left-0
                    right-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-cyan-400/70
                    via-indigo-400/40
                    to-transparent
                "
            />

            <div
                className="
                    relative
                    flex
                    flex-col
                    gap-5
                    p-5
                    sm:p-6
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-4
                    "
                >
                    <UpdateTypeIcon
                        update={
                            update
                        }
                        large
                    />

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
                                gap-2
                            "
                        >
                            <span
                                className="
                                    font-mono
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-gray-600
                                "
                            >
                                {
                                    releaseLabel
                                }
                            </span>

                            {update?.version && (
                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-2
                                        py-1
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        text-gray-400
                                    "
                                >
                                    {
                                        update.version
                                    }
                                </span>
                            )}

                            <UpdateTypeBadge
                                update={
                                    update
                                }
                            />

                            {update?.is_featured && (
                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-yellow-400/20
                                        bg-yellow-400/[0.065]
                                        px-2
                                        py-1
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.12em]
                                        text-yellow-300
                                    "
                                >
                                    Featured
                                </span>
                            )}
                        </div>

                        <h3
                            className="
                                mt-3
                                text-lg
                                font-black
                                leading-snug
                                tracking-tight
                                text-white
                                sm:text-xl
                            "
                        >
                            {
                                update?.title ||
                                "Saytdagi yangi o‘zgarish"
                            }
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            {
                                update?.description ||
                                "Bu yangilik haqida batafsil ma’lumot mavjud emas."
                            }
                        </p>

                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                text-[10px]
                                font-medium
                                text-gray-600
                            "
                        >
                            <CalendarDays
                                size={13}
                                strokeWidth={1.8}
                            />

                            {
                                formatUpdateDate(
                                    update?.published_at
                                )
                            }
                        </div>
                    </div>
                </div>

                <LikeButton
                    update={
                        update
                    }
                    loading={
                        likeLoading
                    }
                    onLike={
                        onLike
                    }
                />
            </div>
        </motion.article>
    );
};


// =========================================================
// COMPACT / ACCORDION CARD
// =========================================================

const CompactUpdateCard = ({
    update,
    opened,
    onToggle,
    likeLoading,
    onLike,
}) => {
    const config =
        getUpdateTypeConfig(update);

    return (
        <article
            className="
                group/item
                overflow-hidden
                border-b
                border-white/[0.05]
                last:border-b-0
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    transition-all
                    duration-200
                    hover:bg-white/[0.025]
                    sm:px-5
                "
            >
                <button
                    type="button"
                    onClick={
                        onToggle
                    }
                    className="
                        flex
                        min-w-0
                        flex-1
                        cursor-pointer
                        items-center
                        gap-3
                        text-left
                        outline-none
                    "
                >
                    <UpdateTypeIcon
                        update={
                            update
                        }
                    />

                    <div
                        className="
                            min-w-0
                            flex-1
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
                            {update?.version && (
                                <span
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-gray-600
                                    "
                                >
                                    {
                                        update.version
                                    }
                                </span>
                            )}

                            <span
                                className={`
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.13em]
                                    ${config.shortLabelClass}
                                `}
                            >
                                {
                                    config.shortLabel
                                }
                            </span>
                        </div>

                        <h4
                            className={`
                                mt-1
                                truncate
                                text-[13px]
                                font-bold
                                text-gray-300
                                transition-colors
                                duration-200
                                sm:text-sm
                                ${config.titleHoverClass}
                            `}
                        >
                            {
                                update?.title ||
                                "Sayt yangiligi"
                            }
                        </h4>
                    </div>

                    <span
                        className="
                            hidden
                            flex-shrink-0
                            text-[9px]
                            font-medium
                            text-gray-700
                            lg:block
                        "
                    >
                        {
                            formatUpdateDate(
                                update?.published_at
                            )
                        }
                    </span>
                </button>

                <LikeButton
                    update={
                        update
                    }
                    loading={
                        likeLoading
                    }
                    onLike={
                        onLike
                    }
                />

                <button
                    type="button"
                    onClick={
                        onToggle
                    }
                    aria-label={
                        opened
                            ? "Yangilikni yopish"
                            : "Yangilikni ochish"
                    }
                    className={`
                        grid
                        h-9
                        w-9
                        flex-shrink-0
                        cursor-pointer
                        place-items-center
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        ${opened
                            ? `
                                border-indigo-400/20
                                bg-indigo-400/[0.07]
                                text-indigo-300
                            `
                            : `
                                border-white/[0.06]
                                bg-white/[0.02]
                                text-gray-600
                                hover:border-white/[0.1]
                                hover:text-gray-300
                            `
                        }
                    `}
                >
                    <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`
                            transition-transform
                            duration-300
                            ${opened
                                ? "rotate-180"
                                : ""
                            }
                        `}
                    />
                </button>
            </div>

            <AnimatePresence
                initial={false}
            >
                {opened && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                        className="
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                ml-[64px]
                                mr-4
                                border-l
                                border-white/[0.06]
                                pb-5
                                pl-4
                                sm:mr-5
                            "
                        >
                            <p
                                className="
                                    max-w-3xl
                                    text-sm
                                    leading-6
                                    text-gray-500
                                "
                            >
                                {
                                    update?.description ||
                                    "Bu yangilik haqida batafsil ma’lumot mavjud emas."
                                }
                            </p>

                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >
                                <UpdateTypeBadge
                                    update={
                                        update
                                    }
                                />

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-[9px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    <CalendarDays
                                        size={12}
                                        strokeWidth={1.8}
                                    />

                                    {
                                        formatUpdateDate(
                                            update?.published_at
                                        )
                                    }
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
};


// =========================================================
// MAIN REUSABLE CARD
// =========================================================

const SiteUpdateCard = ({
    variant = "featured",
    update,
    opened = false,
    onToggle,
    likeLoading = false,
    onLike,
}) => {
    if (!update) {
        return null;
    }

    if (
        variant ===
        "compact"
    ) {
        return (
            <CompactUpdateCard
                update={
                    update
                }
                opened={
                    opened
                }
                onToggle={
                    onToggle
                }
                likeLoading={
                    likeLoading
                }
                onLike={
                    onLike
                }
            />
        );
    }

    return (
        <FeaturedUpdateCard
            update={
                update
            }
            likeLoading={
                likeLoading
            }
            onLike={
                onLike
            }
        />
    );
};


export default SiteUpdateCard;
