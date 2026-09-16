// src/components/Footer.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowUp,
    Bell,
    Braces,
    Bug,
    Coins,
    Code2,
    ExternalLink,
    FolderKanban,
    Github,
    Heart,
    History,
    Linkedin,
    MessageSquareText,
    Send,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";

import {
    APP_CREATED_YEAR,
    APP_DESCRIPTION,
    APP_FULL_NAME,
    APP_LOGO,
    APP_NAME,
    APP_VERSION,
    DEVELOPER_NAME,
    DEVELOPER_URL,
    GITHUB_URL,
    LINKEDIN_URL,
    POWERED_BY,
    RELEASE_CHANNEL,
    TELEGRAM_URL,
} from "../config/appMeta";


// =========================================================
// NAVIGATION
// =========================================================

const FOOTER_GROUPS = [

    {
        title:
            "Platforma",

        links: [

            {
                label:
                    "Muammolar",

                to:
                    "/problems",

                Icon:
                    Bug,
            },

            {
                label:
                    "Loyihalar",

                to:
                    "/projects",

                Icon:
                    FolderKanban,
            },

            {
                label:
                    "Developerlar",

                to:
                    "/users",

                Icon:
                    Users,
            },

            {
                label:
                    "Feedback",

                to:
                    "/feedback",

                Icon:
                    MessageSquareText,
            },

        ],
    },


    {
        title:
            "Ecosystem",

        links: [

            {
                label:
                    "FCoin",

                to:
                    "/fcoin-history",

                Icon:
                    Coins,
            },

            {
                label:
                    "Bildirishnomalar",

                to:
                    "/notifications",

                Icon:
                    Bell,
            },

            {
                label:
                    "Changelog",

                href:
                    "/#changelog",

                Icon:
                    History,
            },

        ],
    },

];


// =========================================================
// RELEASE CHANNEL
// =========================================================

const getReleaseChannelData = (
    channel
) => {

    const map = {

        stable: {
            label:
                "Stable",

            className:
                `
                    border-emerald-400/15
                    bg-emerald-400/[0.05]
                    text-emerald-300
                `,
        },


        beta: {
            label:
                "Beta",

            className:
                `
                    border-indigo-400/15
                    bg-indigo-400/[0.05]
                    text-indigo-300
                `,
        },


        alpha: {
            label:
                "Alpha",

            className:
                `
                    border-orange-400/15
                    bg-orange-400/[0.05]
                    text-orange-300
                `,
        },


        dev: {
            label:
                "Development",

            className:
                `
                    border-fuchsia-400/15
                    bg-fuchsia-400/[0.05]
                    text-fuchsia-300
                `,
        },


        community: {
            label:
                "Community",

            className:
                `
                    border-cyan-400/15
                    bg-cyan-400/[0.05]
                    text-cyan-300
                `,
        },

    };


    return (
        map[channel] ||
        map.beta
    );
};


// =========================================================
// POWERED BY ICON
// =========================================================

const getTechnologyIcon = (
    key
) => {

    if (
        key ===
        "react"
    ) {
        return (
            <Sparkles
                size={15}
                strokeWidth={2}
            />
        );
    }


    if (
        key ===
        "django"
    ) {
        return (
            <Braces
                size={15}
                strokeWidth={2}
            />
        );
    }


    return (
        <Code2
            size={15}
            strokeWidth={2}
        />
    );
};


// =========================================================
// FOOTER LINK
// =========================================================

const FooterLink = ({
    item,
}) => {

    const Icon =
        item.Icon;


    const className = `
        group/link

        inline-flex
        w-fit

        items-center

        gap-2

        text-sm
        font-semibold

        text-gray-500

        transition-all
        duration-200

        hover:translate-x-0.5
        hover:text-cyan-300
    `;


    if (
        item.href
    ) {

        return (

            <a
                href={
                    item.href
                }

                className={
                    className
                }
            >

                <Icon
                    size={14}
                    strokeWidth={2}

                    className="
                        text-gray-700

                        transition-colors
                        duration-200

                        group-hover/link:text-cyan-300
                    "
                />


                {
                    item.label
                }

            </a>

        );
    }


    return (

        <Link
            to={
                item.to
            }

            className={
                className
            }
        >

            <Icon
                size={14}
                strokeWidth={2}

                className="
                    text-gray-700

                    transition-colors
                    duration-200

                    group-hover/link:text-cyan-300
                "
            />


            {
                item.label
            }

        </Link>

    );
};


// =========================================================
// FOOTER
// =========================================================

const Footer = () => {

    // =====================================================
    // CURRENT YEAR
    // =====================================================

    const currentYear =
        new Date()
            .getFullYear();


    // =====================================================
    // RELEASE
    // =====================================================

    const release =
        getReleaseChannelData(
            RELEASE_CHANNEL
        );


    // =====================================================
    // SCROLL TOP
    // =====================================================

    const scrollToTop =
        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth",

            });
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <footer
            className="
                relative

                overflow-hidden

                border-t
                border-white/[0.055]

                bg-[#05080d]

                text-white
            "
        >

            {/* =================================================
                GRID BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    opacity-[0.018]

                    [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]

                    [background-size:36px_36px]
                "
            />


            {/* =================================================
                LEFT GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute

                    -left-24
                    top-0

                    h-72
                    w-72

                    rounded-full

                    bg-lime-500/[0.045]

                    blur-[110px]
                "
            />


            {/* =================================================
                RIGHT GLOW
            ================================================== */}

            <div
                className="
                    pointer-events-none

                    absolute

                    -right-24
                    bottom-0

                    h-72
                    w-72

                    rounded-full

                    bg-indigo-500/[0.055]

                    blur-[110px]
                "
            />


            {/* =================================================
                MAIN CONTAINER
            ================================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    max-w-[1540px]

                    px-4

                    sm:px-6
                    xl:px-8
                "
            >

                {/* =================================================
                    MAIN GRID
                ================================================== */}

                <div
                    className="
                        grid

                        gap-10

                        py-12

                        lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]

                        lg:py-14
                    "
                >

                    {/* =================================================
                        BRAND SIDE
                    ================================================== */}

                    <div
                        className="
                            max-w-xl
                        "
                    >

                        {/* =============================================
                            LOGO + BRAND
                        ============================================== */}

                        <Link
                            to="/"

                            className="
                                group/brand

                                inline-flex

                                items-center

                                gap-4
                            "
                        >

                            {/* LOGO */}

                            <div
                                className="
                                    relative

                                    flex

                                    h-[72px]
                                    w-[72px]

                                    items-center
                                    justify-center

                                    overflow-hidden

                                    rounded-2xl

                                    border
                                    border-lime-400/10

                                    bg-black/20

                                    transition-all
                                    duration-300

                                    group-hover/brand:border-lime-400/25

                                    group-hover/brand:shadow-[0_0_35px_rgba(163,230,53,0.08)]
                                "
                            >

                                <img
                                    src={
                                        APP_LOGO
                                    }

                                    alt={
                                        `${APP_FULL_NAME} logo`
                                    }

                                    className="
                                        h-full
                                        w-full

                                        scale-[1.15]

                                        object-contain

                                        transition-all
                                        duration-500

                                        group-hover/brand:scale-[1.22]
                                    "
                                />

                            </div>


                            {/* BRAND TEXT */}

                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-black

                                        tracking-[-0.045em]

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
                                        mt-0.5

                                        font-mono

                                        text-[8px]
                                        font-black

                                        uppercase
                                        tracking-[0.19em]

                                        text-gray-700
                                    "
                                >
                                    Fix Society
                                    {" // "}
                                    Developer Network
                                </p>

                            </div>

                        </Link>


                        {/* =============================================
                            DESCRIPTION
                        ============================================== */}

                        <p
                            className="
                                mt-6

                                max-w-lg

                                text-sm
                                leading-7

                                text-gray-500
                            "
                        >
                            {
                                APP_DESCRIPTION
                            }
                        </p>


                        {/* =============================================
                            CREATED BY
                        ============================================== */}

                        <div
                            className="
                                mt-5

                                flex
                                flex-wrap

                                items-center

                                gap-x-2
                                gap-y-1

                                text-xs
                                font-semibold

                                text-gray-600
                            "
                        >

                            <span>
                                Created in{" "}
                                <span
                                    className="
                                        font-black

                                        text-gray-300
                                    "
                                >
                                    {
                                        APP_CREATED_YEAR
                                    }
                                </span>
                            </span>


                            <span
                                className="
                                    text-gray-800
                                "
                            >
                                /
                            </span>


                            <span>
                                Developed by{" "}

                                {DEVELOPER_URL ? (

                                    <a
                                        href={
                                            DEVELOPER_URL
                                        }

                                        target="_blank"
                                        rel="noreferrer"

                                        className="
                                            font-black

                                            text-indigo-300

                                            transition-colors

                                            hover:text-cyan-300
                                        "
                                    >
                                        {
                                            DEVELOPER_NAME
                                        }
                                    </a>

                                ) : (

                                    <span
                                        className="
                                            font-black

                                            text-indigo-300
                                        "
                                    >
                                        {
                                            DEVELOPER_NAME
                                        }
                                    </span>

                                )}

                            </span>

                        </div>


                        {/* =============================================
                            STATUS / VERSION
                        ============================================== */}

                        <div
                            className="
                                mt-6

                                flex
                                flex-wrap

                                items-center

                                gap-2.5
                            "
                        >

                            {/* SYSTEM ONLINE */}

                            <div
                                className="
                                    inline-flex

                                    items-center

                                    gap-2

                                    rounded-xl

                                    border
                                    border-emerald-400/10

                                    bg-emerald-400/[0.03]

                                    px-3
                                    py-2
                                "
                            >

                                <span
                                    className="
                                        relative

                                        flex

                                        h-2
                                        w-2
                                    "
                                >

                                    <span
                                        className="
                                            absolute

                                            inline-flex

                                            h-full
                                            w-full

                                            animate-ping

                                            rounded-full

                                            bg-emerald-400

                                            opacity-50
                                        "
                                    />


                                    <span
                                        className="
                                            relative

                                            inline-flex

                                            h-2
                                            w-2

                                            rounded-full

                                            bg-emerald-400
                                        "
                                    />

                                </span>


                                <span
                                    className="
                                        font-mono

                                        text-[9px]
                                        font-black

                                        uppercase
                                        tracking-[0.13em]

                                        text-emerald-300
                                    "
                                >
                                    System online
                                </span>

                            </div>


                            {/* VERSION */}

                            <a
                                href="/#changelog"

                                className="
                                    group/version

                                    inline-flex

                                    items-center

                                    gap-2

                                    rounded-xl

                                    border
                                    border-indigo-400/10

                                    bg-indigo-400/[0.035]

                                    px-3
                                    py-2

                                    transition-all
                                    duration-200

                                    hover:border-indigo-400/20

                                    hover:bg-indigo-400/[0.06]
                                "
                            >

                                <History
                                    size={13}
                                    strokeWidth={2}

                                    className="
                                        text-indigo-300
                                    "
                                />


                                <span
                                    className="
                                        font-mono

                                        text-[9px]
                                        font-black

                                        uppercase
                                        tracking-[0.12em]

                                        text-gray-500
                                    "
                                >
                                    Version
                                </span>


                                <span
                                    className="
                                        font-mono

                                        text-[9px]
                                        font-black

                                        text-indigo-300
                                    "
                                >
                                    {
                                        APP_VERSION
                                    }
                                </span>


                                <span
                                    className={`
                                        rounded-md

                                        border

                                        px-1.5
                                        py-0.5

                                        font-mono

                                        text-[7px]
                                        font-black

                                        uppercase
                                        tracking-[0.1em]

                                        ${release.className}
                                    `}
                                >
                                    {
                                        release.label
                                    }
                                </span>

                            </a>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT AREA
                    ================================================== */}

                    <div
                        className="
                            grid

                            gap-8

                            sm:grid-cols-2

                            lg:grid-cols-[1fr_1fr_auto]
                        "
                    >

                        {/* =============================================
                            LINKS
                        ============================================== */}

                        {FOOTER_GROUPS.map(
                            (
                                group
                            ) => (

                                <div
                                    key={
                                        group.title
                                    }
                                >

                                    <p
                                        className="
                                            font-mono

                                            text-[9px]
                                            font-black

                                            uppercase
                                            tracking-[0.17em]

                                            text-gray-700
                                        "
                                    >
                                        {
                                            group.title
                                        }
                                    </p>


                                    <div
                                        className="
                                            mt-4

                                            flex
                                            flex-col

                                            gap-3
                                        "
                                    >

                                        {group.links.map(
                                            (
                                                item
                                            ) => (

                                                <FooterLink
                                                    key={
                                                        item.label
                                                    }

                                                    item={
                                                        item
                                                    }
                                                />

                                            )
                                        )}

                                    </div>

                                </div>

                            )
                        )}


                        {/* =============================================
                            CONNECT
                        ============================================== */}

                        <div>

                            <p
                                className="
                                    font-mono

                                    text-[9px]
                                    font-black

                                    uppercase
                                    tracking-[0.17em]

                                    text-gray-700
                                "
                            >
                                Connect
                            </p>


                            {/* SOCIAL BUTTONS */}

                            <div
                                className="
                                    mt-4

                                    flex
                                    flex-wrap

                                    items-center

                                    gap-2
                                "
                            >

                                {/* GITHUB */}

                                <a
                                    href={
                                        GITHUB_URL
                                    }

                                    target="_blank"
                                    rel="noreferrer"

                                    aria-label="GitHub"

                                    className="
                                        grid

                                        h-10
                                        w-10

                                        place-items-center

                                        rounded-xl

                                        border
                                        border-white/[0.065]

                                        bg-white/[0.025]

                                        text-gray-500

                                        transition-all
                                        duration-200

                                        hover:-translate-y-0.5

                                        hover:border-white/[0.13]

                                        hover:bg-white/[0.05]

                                        hover:text-white
                                    "
                                >

                                    <Github
                                        size={17}
                                        strokeWidth={2}
                                    />

                                </a>


                                {/* TELEGRAM */}

                                <a
                                    href={
                                        TELEGRAM_URL
                                    }

                                    target="_blank"
                                    rel="noreferrer"

                                    aria-label="Telegram"

                                    className="
                                        grid

                                        h-10
                                        w-10

                                        place-items-center

                                        rounded-xl

                                        border
                                        border-cyan-400/10

                                        bg-cyan-400/[0.035]

                                        text-cyan-300/70

                                        transition-all
                                        duration-200

                                        hover:-translate-y-0.5

                                        hover:border-cyan-400/20

                                        hover:bg-cyan-400/[0.07]

                                        hover:text-cyan-300
                                    "
                                >

                                    <Send
                                        size={17}
                                        strokeWidth={2}
                                    />

                                </a>


                                {/* LINKEDIN */}

                                {LINKEDIN_URL && (

                                    <a
                                        href={
                                            LINKEDIN_URL
                                        }

                                        target="_blank"
                                        rel="noreferrer"

                                        aria-label="LinkedIn"

                                        className="
                                            grid

                                            h-10
                                            w-10

                                            place-items-center

                                            rounded-xl

                                            border
                                            border-blue-400/10

                                            bg-blue-400/[0.03]

                                            text-blue-300/70

                                            transition-all
                                            duration-200

                                            hover:-translate-y-0.5

                                            hover:border-blue-400/20

                                            hover:bg-blue-400/[0.07]

                                            hover:text-blue-300
                                        "
                                    >

                                        <Linkedin
                                            size={17}
                                            strokeWidth={2}
                                        />

                                    </a>

                                )}

                            </div>


                            {/* SOURCE */}

                            <a
                                href={
                                    GITHUB_URL
                                }

                                target="_blank"
                                rel="noreferrer"

                                className="
                                    group/source

                                    mt-4

                                    inline-flex

                                    items-center

                                    gap-1.5

                                    text-[10px]
                                    font-semibold

                                    text-gray-700

                                    transition-colors

                                    hover:text-gray-400
                                "
                            >

                                Source code


                                <ExternalLink
                                    size={11}

                                    className="
                                        transition-transform

                                        group-hover/source:-translate-y-0.5

                                        group-hover/source:translate-x-0.5
                                    "
                                />

                            </a>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    POWERED BY
                ================================================== */}

                <div
                    className="
                        border-t
                        border-white/[0.055]

                        py-5
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

                        {/* LEFT */}

                        <div
                            className="
                                flex
                                flex-wrap

                                items-center

                                gap-3
                            "
                        >

                            <span
                                className="
                                    font-mono

                                    text-[8px]
                                    font-black

                                    uppercase
                                    tracking-[0.17em]

                                    text-gray-700
                                "
                            >
                                Powered by
                            </span>


                            {POWERED_BY.map(
                                (
                                    technology
                                ) => (

                                    <a
                                        key={
                                            technology.key
                                        }

                                        href={
                                            technology.url
                                        }

                                        target="_blank"
                                        rel="noreferrer"

                                        className="
                                            group/tech

                                            inline-flex

                                            items-center

                                            gap-1.5

                                            rounded-lg

                                            border
                                            border-white/[0.055]

                                            bg-white/[0.02]

                                            px-2.5
                                            py-1.5

                                            text-[9px]
                                            font-bold

                                            text-gray-600

                                            transition-all
                                            duration-200

                                            hover:-translate-y-0.5

                                            hover:border-cyan-400/10

                                            hover:bg-cyan-400/[0.03]

                                            hover:text-gray-300
                                        "
                                    >

                                        <span
                                            className="
                                                text-cyan-300/70

                                                transition-colors

                                                group-hover/tech:text-cyan-300
                                            "
                                        >
                                            {
                                                getTechnologyIcon(
                                                    technology.key
                                                )
                                            }
                                        </span>


                                        {
                                            technology.name
                                        }

                                    </a>

                                )
                            )}

                        </div>


                        {/* CREATED */}

                        <p
                            className="
                                text-[9px]
                                font-medium

                                text-gray-700
                            "
                        >
                            Building since{" "}

                            <span
                                className="
                                    font-black

                                    text-gray-500
                                "
                            >
                                {
                                    APP_CREATED_YEAR
                                }
                            </span>
                        </p>

                    </div>

                </div>


                {/* =================================================
                    BOTTOM BAR
                ================================================== */}

                <div
                    className="
                        flex
                        flex-col

                        gap-4

                        border-t
                        border-white/[0.055]

                        py-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* =============================================
                        COPYRIGHT
                    ============================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center

                            gap-x-2
                            gap-y-1

                            text-[10px]
                            font-medium

                            text-gray-700
                        "
                    >

                        <span>
                            © {
                                APP_CREATED_YEAR
                            }–{
                                currentYear
                            }{" "}

                            {
                                APP_NAME
                            }.
                        </span>


                        <span
                            className="
                                hidden
                                text-gray-800
                                sm:inline
                            "
                        >
                            /
                        </span>


                        <span>
                            Barcha huquqlar
                            himoyalangan.
                        </span>


                        <span
                            className="
                                hidden
                                text-gray-800
                                sm:inline
                            "
                        >
                            /
                        </span>


                        <span
                            className="
                                inline-flex

                                items-center

                                gap-1.5
                            "
                        >
                            Built with

                            <Heart
                                size={11}
                                strokeWidth={2}

                                className="
                                    fill-pink-400/50

                                    text-pink-400/70
                                "
                            />

                            by{" "}

                            <span
                                className="
                                    font-black

                                    text-indigo-300
                                "
                            >
                                {
                                    DEVELOPER_NAME
                                }
                            </span>

                        </span>

                    </div>


                    {/* =============================================
                        RIGHT
                    ============================================== */}

                    <div
                        className="
                            flex

                            items-center

                            gap-3
                        "
                    >

                        <div
                            className="
                                hidden

                                items-center

                                gap-1.5

                                font-mono

                                text-[8px]
                                font-bold

                                uppercase
                                tracking-[0.13em]

                                text-gray-800

                                md:flex
                            "
                        >

                            <ShieldCheck
                                size={11}
                            />


                            community driven

                        </div>


                        {/* TOP */}

                        <button
                            type="button"

                            onClick={
                                scrollToTop
                            }

                            aria-label="Tepaga qaytish"

                            className="
                                group/top

                                grid

                                h-9
                                w-9

                                cursor-pointer

                                place-items-center

                                rounded-xl

                                border
                                border-white/[0.065]

                                bg-white/[0.025]

                                text-gray-600

                                transition-all
                                duration-200

                                hover:-translate-y-0.5

                                hover:border-cyan-400/15

                                hover:bg-cyan-400/[0.04]

                                hover:text-cyan-300
                            "
                        >

                            <ArrowUp
                                size={15}
                                strokeWidth={2.2}

                                className="
                                    transition-transform

                                    group-hover/top:-translate-y-0.5
                                "
                            />

                        </button>

                    </div>

                </div>

            </div>

        </footer>
    );
};


export default Footer;