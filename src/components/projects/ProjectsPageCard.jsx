// src/components/projects/ProjectsPageCard.jsx

import React, {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowUpRight,
    Code2,
    Eye,
    FolderKanban,
    GitFork,
    Layers3,
    Star,
    Zap,
} from "lucide-react";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

import {
    formatCompactNumber,
    formatProjectDate,
    getProjectImageUrl,
    isProjectPromoted,
    safeNumber,
    truncateText,
} from "./projectHelpers";


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_STACK_COLOR =
    "#64748B";


const MAX_VISIBLE_STACK =
    5;


// =========================================================
// COLOR VALIDATION
// =========================================================

const isValidHexColor = (
    value
) => {

    return (
        typeof value ===
        "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            value
        )
    );
};


// =========================================================
// SAFE COLOR
// =========================================================

const getSafeColor = (
    value
) => {

    if (
        isValidHexColor(
            value
        )
    ) {

        return value;
    }


    return DEFAULT_STACK_COLOR;
};


// =========================================================
// HEX ALPHA
//
// #3776AB + 20 -> #3776AB20
// =========================================================

const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        getSafeColor(
            color
        );


    return (
        `${safeColor}${alpha}`
    );
};


// =========================================================
// NORMALIZE STACK ITEM
// =========================================================

const normalizeStackItem = (
    item,
    type
) => {

    if (
        !item
    ) {

        return null;
    }


    // =====================================================
    // STRING FALLBACK
    // =====================================================

    if (
        typeof item ===
        "string"
    ) {

        const name =
            item.trim();


        if (
            !name
        ) {

            return null;
        }


        return {
            id:
                `${type}-${name}`,

            name,

            type,

            color:
                DEFAULT_STACK_COLOR,

            iconKey:
                "",
        };
    }


    // =====================================================
    // OBJECT
    // =====================================================

    const name =
        String(
            item?.name
            ||
            item?.title
            ||
            ""
        ).trim();


    if (
        !name
    ) {

        return null;
    }


    return {
        id:
            item?.id
            ??
            `${type}-${name}`,

        name,

        type,

        color:
            getSafeColor(
                item?.color
            ),

        iconKey:
            String(
                item?.icon_key
                ||
                ""
            ).trim(),
    };
};


// =========================================================
// COLORED PROJECT STACK
//
// MUHIM:
//
// Endi string qaytarmaydi.
//
// {
//
//     id,
//     name,
//     type,
//     color,
//     iconKey,
//
// }
//
// qaytaradi.
//
// Shu sabab bazadagi color frontendgacha saqlanadi.
// =========================================================

const getColoredProjectStack = (
    project
) => {

    const result =
        [];


    const addedNames =
        new Set();


    const addItem = (
        item,
        type
    ) => {

        const normalized =
            normalizeStackItem(
                item,
                type
            );


        if (
            !normalized
        ) {

            return;
        }


        const key =
            normalized
                .name
                .toLowerCase();


        if (
            addedNames.has(
                key
            )
        ) {

            return;
        }


        addedNames.add(
            key
        );


        result.push(
            normalized
        );
    };


    // =====================================================
    // PRIMARY LANGUAGE
    // =====================================================

    addItem(
        project?.language_data,
        "language"
    );


    // =====================================================
    // PRIMARY TECHNOLOGY
    // =====================================================

    addItem(
        project?.technology_data,
        "technology"
    );


    // =====================================================
    // LANGUAGES
    // =====================================================

    const languages =
        Array.isArray(
            project?.languages_data
        )
            ? project.languages_data
            : [];


    languages.forEach(
        (
            language
        ) => {

            addItem(
                language,
                "language"
            );
        }
    );


    // =====================================================
    // TECHNOLOGIES
    // =====================================================

    const technologies =
        Array.isArray(
            project?.technologies_data
        )
            ? project.technologies_data
            : [];


    technologies.forEach(
        (
            technology
        ) => {

            addItem(
                technology,
                "technology"
            );
        }
    );


    return result;
};


// =========================================================
// STACK BADGE
// =========================================================

const StackBadge = ({
    item,
}) => {

    const color =
        getSafeColor(
            item?.color
        );


    return (

        <span
            title={
                item?.type ===
                "language"

                    ? (
                        `Dasturlash tili: ${item.name}`
                    )

                    : (
                        `Texnologiya: ${item.name}`
                    )
            }

            style={{
                color,

                borderColor:
                    withAlpha(
                        color,
                        "55"
                    ),

                backgroundColor:
                    withAlpha(
                        color,
                        "12"
                    ),

                boxShadow:
                    `inset 0 0 0 1px ${
                        withAlpha(
                            color,
                            "08"
                        )
                    }`,
            }}

            className="
                group/stack

                inline-flex
                max-w-[120px]
                items-center

                gap-1.5

                truncate

                rounded-md

                border

                px-2
                py-1

                font-mono

                text-[8px]
                font-black

                transition-all
                duration-200

                hover:-translate-y-px
            "
        >

            {/* COLOR DOT */}

            <span
                style={{
                    backgroundColor:
                        color,

                    boxShadow:
                        `0 0 7px ${
                            withAlpha(
                                color,
                                "80"
                            )
                        }`,
                }}

                className="
                    h-1.5
                    w-1.5

                    flex-shrink-0

                    rounded-full
                "
            />


            {/* NAME */}

            <span
                className="
                    truncate
                "
            >
                {item.name}
            </span>

        </span>
    );
};


// =========================================================
// PROJECT IMAGE
// =========================================================

const ProjectsPageCardImage = ({
    project,
}) => {

    const [
        imageFailed,
        setImageFailed,
    ] = useState(
        false
    );


    const imageUrl =
        getProjectImageUrl(
            project
                ?.images
                ?.[0]
                ?.image
        );


    // =====================================================
    // FALLBACK
    // =====================================================

    if (
        !imageUrl
        ||
        imageFailed
    ) {

        return (

            <div
                className="
                    relative

                    flex
                    h-[170px]
                    w-full

                    items-center
                    justify-center

                    overflow-hidden

                    border-b
                    border-white/[0.06]

                    bg-[#080b10]

                    md:h-[180px]
                "
            >

                {/* GRID */}

                <div
                    className="
                        pointer-events-none

                        absolute
                        inset-0

                        opacity-[0.16]

                        [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]

                        [background-size:20px_20px]
                    "
                />


                {/* GLOW */}

                <div
                    className="
                        pointer-events-none

                        absolute

                        left-1/2
                        top-1/2

                        h-28
                        w-28

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-cyan-500/[0.07]

                        blur-3xl
                    "
                />


                {/* ICON */}

                <div
                    className="
                        relative
                        z-10

                        grid
                        h-14
                        w-14

                        place-items-center

                        rounded-2xl

                        border
                        border-cyan-400/10

                        bg-cyan-500/[0.04]

                        text-cyan-300/40
                    "
                >

                    <FolderKanban
                        size={23}
                        strokeWidth={1.5}
                    />

                </div>


                <div
                    className="
                        absolute
                        bottom-3
                        left-3

                        font-mono

                        text-[7px]
                        font-black

                        uppercase
                        tracking-[0.16em]

                        text-gray-800
                    "
                >
                    preview://unavailable
                </div>

            </div>
        );
    }


    // =====================================================
    // REAL IMAGE
    // =====================================================

    return (

        <div
            className="
                relative

                h-[170px]
                w-full

                overflow-hidden

                border-b
                border-white/[0.06]

                bg-[#070a0f]

                md:h-[180px]
            "
        >

            {/* =================================================
                BLURRED BACKGROUND
            ================================================== */}

            <img
                src={
                    imageUrl
                }

                alt=""

                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-0

                    h-full
                    w-full

                    scale-110

                    object-cover

                    opacity-[0.20]

                    blur-2xl

                    saturate-50
                "
            />


            {/* DARK OVERLAY */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-[#080b10]/45
                "
            />


            {/* GRID */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    opacity-[0.08]

                    [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]

                    [background-size:20px_20px]
                "
            />


            {/* =================================================
                MAIN SCREENSHOT
            ================================================== */}

            <img
                src={
                    imageUrl
                }

                alt={
                    project?.name
                    ||
                    "Project preview"
                }

                onError={
                    () => {

                        setImageFailed(
                            true
                        );
                    }
                }

                className="
                    relative
                    z-10

                    h-full
                    w-full

                    object-contain

                    p-2

                    transition-transform
                    duration-500

                    group-hover/project-card:scale-[1.015]

                    md:p-3
                "
            />


            {/* TOP SHADOW */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0
                    z-20

                    h-10

                    bg-gradient-to-b

                    from-black/30
                    to-transparent
                "
            />


            {/* BOTTOM SHADOW */}

            <div
                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    bottom-0
                    z-20

                    h-10

                    bg-gradient-to-t

                    from-black/35
                    to-transparent
                "
            />


            {/* LABEL */}

            <div
                className="
                    pointer-events-none

                    absolute
                    bottom-2.5
                    left-3
                    z-30

                    rounded-md

                    border
                    border-black/20

                    bg-black/30

                    px-2
                    py-1

                    font-mono

                    text-[7px]
                    font-black

                    uppercase
                    tracking-[0.14em]

                    text-white/30

                    backdrop-blur-md
                "
            >
                project.preview
            </div>

        </div>
    );
};


// =========================================================
// PROJECTS PAGE CARD
// =========================================================

const ProjectsPageCard = ({
    project,
    index = 0,
}) => {

    // =====================================================
    // PROMOTION
    // =====================================================

    const promoted =
        isProjectPromoted(
            project
        );


    // =====================================================
    // FULL COLORED STACK
    // =====================================================

    const fullStack =
        useMemo(
            () => {

                return getColoredProjectStack(
                    project
                );

            },
            [
                project,
            ]
        );


    // =====================================================
    // VISIBLE STACK
    // =====================================================

    const visibleStack =
        fullStack.slice(
            0,
            MAX_VISIBLE_STACK
        );


    const hiddenStackCount =
        Math.max(
            0,

            fullStack.length -
            MAX_VISIBLE_STACK
        );


    // =====================================================
    // USER
    // =====================================================

    const username =
        project
            ?.user
            ?.username

        ||

        "developer";


    // =====================================================
    // NUMBER
    // =====================================================

    const projectNumber =
        String(
            index + 1
        ).padStart(
            2,
            "0"
        );


    // =====================================================
    // STATS
    // =====================================================

    const stars =
        formatCompactNumber(
            project?.stars_count
        );


    const views =
        formatCompactNumber(
            project?.views_count
        );


    const collaborations =
        safeNumber(
            project
                ?.collaborations_count
        );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <article
            className={`
                group/project-card

                relative

                overflow-hidden

                rounded-2xl

                border

                ${
                    promoted

                        ? (
                            "border-cyan-400/25 "
                            +
                            "bg-cyan-500/[0.02]"
                        )

                        : (
                            "border-white/[0.07] "
                            +
                            "bg-[#0d1117]"
                        )
                }

                shadow-lg
                shadow-black/10

                transition-all
                duration-300

                hover:-translate-y-0.5

                hover:border-cyan-400/20

                hover:shadow-xl
                hover:shadow-cyan-950/10
            `}
        >

            {/* =================================================
                PROMOTION GLOW
            ================================================== */}

            {promoted && (

                <div
                    className="
                        pointer-events-none

                        absolute
                        -right-16
                        -top-16

                        h-36
                        w-36

                        rounded-full

                        bg-cyan-400/[0.055]

                        blur-3xl
                    "
                />

            )}


            {/* =================================================
                TOP BAR
            ================================================== */}

            <div
                className="
                    relative

                    flex
                    h-10

                    items-center
                    justify-between

                    gap-3

                    border-b
                    border-white/[0.055]

                    px-4
                "
            >

                {/* LEFT */}

                <div
                    className="
                        flex
                        min-w-0
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

                            text-gray-700
                        "
                    >
                        project://{projectNumber}
                    </span>


                    {promoted && (

                        <span
                            className="
                                inline-flex
                                items-center

                                gap-1

                                rounded-full

                                border
                                border-cyan-400/15

                                bg-cyan-500/[0.06]

                                px-2
                                py-0.5

                                font-mono

                                text-[7px]
                                font-black

                                uppercase
                                tracking-[0.12em]

                                text-cyan-300
                            "
                        >

                            <Zap
                                size={8}
                                fill="currentColor"
                            />

                            promoted

                        </span>
                    )}

                </div>


                {/* STATS */}

                <div
                    className="
                        flex
                        flex-shrink-0
                        items-center

                        gap-3

                        font-mono

                        text-[9px]
                        font-black

                        text-gray-500
                    "
                >

                    <span
                        className="
                            inline-flex
                            items-center

                            gap-1
                        "
                    >

                        <Star
                            size={10}

                            fill="currentColor"

                            className="
                                text-yellow-300
                            "
                        />

                        {stars}

                    </span>


                    <span
                        className="
                            inline-flex
                            items-center

                            gap-1
                        "
                    >

                        <Eye
                            size={10}

                            className="
                                text-cyan-300
                            "
                        />

                        {views}

                    </span>

                </div>

            </div>


            {/* =================================================
                IMAGE
            ================================================== */}

            <ProjectsPageCardImage
                project={
                    project
                }
            />


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    relative

                    flex
                    min-h-[205px]
                    flex-col

                    p-4
                "
            >

                {/* =================================================
                    USER + DATE
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between

                        gap-3
                    "
                >

                    <Link
                        to={
                            `/${username}/profile`
                        }

                        className="
                            inline-flex
                            min-w-0
                            items-center

                            gap-2

                            text-[10px]
                            font-bold

                            text-gray-500

                            transition-colors

                            hover:text-cyan-300
                        "
                    >

                        <img
                            src={
                                getUserAvatarUrl(
                                    project?.user
                                )
                            }

                            alt={
                                username
                            }

                            onError={
                                handleUserImageError
                            }

                            className="
                                h-5
                                w-5

                                flex-shrink-0

                                rounded-full

                                border
                                border-white/10

                                object-cover
                            "
                        />


                        <span
                            className="
                                truncate
                            "
                        >
                            @{username}
                        </span>

                    </Link>


                    <span
                        className="
                            flex-shrink-0

                            font-mono

                            text-[8px]
                            font-bold

                            text-gray-700
                        "
                    >
                        {
                            formatProjectDate(
                                project
                                    ?.created_at
                            )
                        }
                    </span>

                </div>


                {/* =================================================
                    TITLE
                ================================================== */}

                <Link
                    to={
                        `/project/${project.id}/detail`
                    }

                    className="
                        mt-3

                        block
                        truncate

                        text-[18px]
                        font-black

                        tracking-tight

                        text-gray-100

                        transition-colors
                        duration-200

                        group-hover/project-card:text-cyan-300
                    "
                >
                    {
                        project?.name
                        ||
                        "Nomsiz loyiha"
                    }
                </Link>


                {/* =================================================
                    MAIN FEATURES
                ================================================== */}

                {project
                    ?.main_features && (

                    <div
                        className="
                            mt-1.5

                            flex
                            min-w-0
                            items-center

                            gap-1.5
                        "
                    >

                        <Code2
                            size={10}

                            className="
                                flex-shrink-0

                                text-violet-300/60
                            "
                        />


                        <p
                            className="
                                truncate

                                text-[9px]
                                font-bold

                                uppercase
                                tracking-[0.08em]

                                text-violet-300/60
                            "
                        >
                            {
                                project.main_features
                            }
                        </p>

                    </div>

                )}


                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <p
                    className="
                        mt-2

                        line-clamp-2

                        text-[11px]
                        leading-[1.65]

                        text-gray-500
                    "
                >
                    {
                        truncateText(
                            project
                                ?.description
                        )
                    }
                </p>


                {/* =================================================
                    BOTTOM
                ================================================== */}

                <div
                    className="
                        mt-auto

                        pt-4
                    "
                >

                    {/* =================================================
                        COLORED STACK
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-end
                            justify-between

                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                flex-1
                                flex-wrap

                                gap-1.5
                            "
                        >

                            {visibleStack.length >
                            0 ? (

                                <>

                                    {visibleStack.map(
                                        (
                                            item
                                        ) => (

                                            <StackBadge
                                                key={
                                                    `${
                                                        item.type
                                                    }-${
                                                        item.id
                                                    }`
                                                }

                                                item={
                                                    item
                                                }
                                            />

                                        )
                                    )}


                                    {/* =================================
                                        HIDDEN COUNT
                                    ================================== */}

                                    {hiddenStackCount >
                                    0 && (

                                        <span
                                            title={
                                                `${hiddenStackCount} ta qo‘shimcha stack`
                                            }

                                            className="
                                                inline-flex
                                                items-center

                                                rounded-md

                                                border
                                                border-white/[0.07]

                                                bg-white/[0.025]

                                                px-2
                                                py-1

                                                font-mono

                                                text-[8px]
                                                font-black

                                                text-gray-600
                                            "
                                        >
                                            +{
                                                hiddenStackCount
                                            }
                                        </span>

                                    )}

                                </>

                            ) : (

                                <span
                                    className="
                                        font-mono

                                        text-[8px]
                                        font-bold

                                        text-gray-700
                                    "
                                >
                                    stack://unknown
                                </span>

                            )}

                        </div>


                        {/* DETAIL */}

                        <Link
                            to={
                                `/project/${project.id}/detail`
                            }

                            aria-label={
                                `${project?.name || "Project"} batafsil`
                            }

                            className="
                                grid
                                h-8
                                w-8

                                flex-shrink-0

                                place-items-center

                                rounded-lg

                                border
                                border-white/[0.07]

                                bg-white/[0.025]

                                text-gray-500

                                transition-all
                                duration-200

                                hover:border-cyan-400/25

                                hover:bg-cyan-500/[0.07]

                                hover:text-cyan-300
                            "
                        >

                            <ArrowUpRight
                                size={13}
                            />

                        </Link>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            mt-3

                            flex
                            items-center
                            justify-between

                            gap-3

                            border-t
                            border-white/[0.045]

                            pt-2.5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center

                                gap-4

                                font-mono

                                text-[8px]
                                font-bold

                                uppercase
                                tracking-[0.09em]

                                text-gray-700
                            "
                        >

                            {/* COLLAB */}

                            <span
                                className="
                                    inline-flex
                                    items-center

                                    gap-1.5
                                "
                            >

                                <GitFork
                                    size={9}
                                />

                                {collaborations}

                                collab

                            </span>


                            {/* STACK COUNT */}

                            <span
                                className="
                                    inline-flex
                                    items-center

                                    gap-1.5
                                "
                            >

                                <Layers3
                                    size={9}
                                />

                                {
                                    fullStack.length
                                }

                                stack

                            </span>

                        </div>


                        {/* PUBLIC */}

                        <div
                            className="
                                inline-flex
                                items-center

                                gap-1.5

                                font-mono

                                text-[7px]
                                font-black

                                uppercase
                                tracking-[0.12em]

                                text-emerald-400/40
                            "
                        >

                            <span
                                className="
                                    h-1
                                    w-1

                                    rounded-full

                                    bg-emerald-400/70
                                "
                            />

                            public

                        </div>

                    </div>

                </div>

            </div>

        </article>
    );
};


export default ProjectsPageCard;