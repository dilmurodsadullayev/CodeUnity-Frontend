// src/components/projects/ProjectGridCard.jsx

import React, {
    useMemo,
} from "react";

import {
    ArrowUpRight,
    Code2,
    Eye,
    FolderKanban,
    MessageCircle,
    Star,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import UserImage from "../../assests/userImage.jpeg";

import {
    BACKEND_URL,
} from "../../services/config";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

import {
    isProjectPromoted,
} from "../../utils/promotion";

import PromotionBadge from "../promotions/PromotionBadge";


// =========================================================
// IMAGE URL
// =========================================================

const getProjectImageUrl = (
    image
) => {

    if (
        !image
    ) {
        return null;
    }


    const value =
        String(
            image
        ).trim();


    if (
        !value
    ) {
        return null;
    }


    if (
        /^https?:\/\//i.test(
            value
        )
        ||
        value.startsWith(
            "blob:"
        )
        ||
        value.startsWith(
            "data:"
        )
    ) {

        return value;
    }


    const base =
        String(
            BACKEND_URL
            ||
            ""
        ).replace(
            /\/+$/,
            ""
        );


    return (
        `${base}${
            value.startsWith(
                "/"
            )

                ? value

                : `/${value}`
        }`
    );
};


// =========================================================
// STACK TAGS
// =========================================================

const getProjectTags = (
    project
) => {

    const tags =
        [];


    const addTag = (
        item,
        type
    ) => {

        if (
            !item?.name
        ) {
            return;
        }


        const key =
            `${type}-${item.id ?? item.name}`;


        if (
            tags.some(
                (
                    tag
                ) =>
                tag.key ===
                key
            )
        ) {
            return;
        }


        tags.push({

            key,

            name:
                item.name,

            type,

        });
    };


    addTag(
        project?.language_data,
        "language"
    );


    addTag(
        project?.technology_data,
        "technology"
    );


    (
        project?.languages_data
        ||
        []
    ).forEach(
        (
            item
        ) => {

            if (
                tags.length <
                3
            ) {

                addTag(
                    item,
                    "language"
                );
            }
        }
    );


    (
        project?.technologies_data
        ||
        []
    ).forEach(
        (
            item
        ) => {

            if (
                tags.length <
                3
            ) {

                addTag(
                    item,
                    "technology"
                );
            }
        }
    );


    return tags.slice(
        0,
        3
    );
};


// =========================================================
// PROJECT CARD
// =========================================================

const ProjectGridCard = ({

    project,

    index = 1,

}) => {

    // =====================================================
    // PROMOTED
    // =====================================================

    const promoted =
        isProjectPromoted(
            project
        );


    // =====================================================
    // IMAGE
    // =====================================================

    const projectImage =
        getProjectImageUrl(
            project
                ?.images
                ?.[0]
                ?.image
        );


    // =====================================================
    // AVATAR
    // =====================================================

    const avatar =
        project?.user

            ? getUserAvatarUrl(
                project.user
            )

            : UserImage;


    // =====================================================
    // TAGS
    // =====================================================

    const tags =
        useMemo(
            () => {

                return getProjectTags(
                    project
                );

            },
            [
                project,
            ]
        );


    // =====================================================
    // OWNER
    // =====================================================

    const ownerName =

        project
            ?.user
            ?.first_name

        ||

        project
            ?.user
            ?.username

        ||

        "Foydalanuvchi";


    // =====================================================
    // NUMBER
    // =====================================================

    const projectNumber =
        String(
            index
        ).padStart(
            3,
            "0"
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Link
            to={
                `/project/${project.id}/detail`
            }

            className="
                group
                relative
                block
                h-full
                min-w-0
            "
        >

            {/* =================================================
                PROMOTED OUTER GLOW
            ================================================== */}

            {promoted && (

                <div
                    className="
                        pointer-events-none
                        absolute
                        -inset-[1px]
                        rounded-[29px]
                        bg-gradient-to-br
                        from-indigo-400/50
                        via-purple-500/30
                        to-cyan-400/20
                        opacity-50
                        blur-[8px]
                        transition
                        duration-500

                        group-hover:opacity-90
                    "
                />
            )}


            {/* =================================================
                CARD
            ================================================== */}

            <article
                className={`
                    relative
                    flex
                    h-full
                    min-h-[500px]
                    flex-col
                    overflow-hidden
                    rounded-[28px]
                    border
                    bg-[#0c1016]
                    shadow-[0_25px_70px_rgba(0,0,0,0.22)]
                    transition-all
                    duration-500

                    group-hover:-translate-y-1.5
                    group-hover:shadow-[0_35px_90px_rgba(0,0,0,0.35)]

                    ${
                        promoted

                            ? (
                                "border-indigo-400/20 "
                                +
                                "group-hover:border-indigo-300/35"
                            )

                            : (
                                "border-white/[0.06] "
                                +
                                "group-hover:border-white/[0.14]"
                            )
                    }
                `}
            >

                {/* =================================================
                    TOP SYSTEM BAR
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-white/[0.045]
                        bg-black/15
                        px-4
                        py-2.5
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className={`
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full

                                ${
                                    promoted

                                        ? (
                                            "bg-emerald-400 "
                                            +
                                            "shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                                        )

                                        : "bg-gray-700"
                                }
                            `}
                        />


                        <p
                            className="
                                truncate
                                font-mono
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.13em]
                                text-gray-700
                            "
                        >
                            project://{project.id}
                        </p>

                    </div>


                    <span
                        className="
                            font-mono
                            text-[8px]
                            font-black
                            text-gray-700
                        "
                    >
                        #{projectNumber}
                    </span>

                </div>


                {/* =================================================
                    IMAGE
                ================================================== */}

                <div
                    className="
                        relative
                        h-56
                        overflow-hidden
                        bg-[#080b10]
                    "
                >

                    {/* FALLBACK */}

                    <div
                        className="
                            absolute
                            inset-0
                            grid
                            place-items-center
                            bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.09),transparent_65%)]
                        "
                    >

                        <div
                            className="
                                text-center
                            "
                        >

                            <FolderKanban
                                size={38}
                                className="
                                    mx-auto
                                    text-indigo-400/20
                                "
                            />


                            <p
                                className="
                                    mt-2
                                    font-mono
                                    text-[8px]
                                    uppercase
                                    tracking-[0.15em]
                                    text-gray-800
                                "
                            >
                                preview unavailable
                            </p>

                        </div>

                    </div>


                    {projectImage && (

                        <img
                            src={
                                projectImage
                            }

                            alt={
                                project.name
                            }

                            className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                                opacity-60
                                transition-all
                                duration-700

                                group-hover:scale-[1.06]
                                group-hover:opacity-85
                            "

                            onError={(
                                event
                            ) => {

                                event
                                    .currentTarget
                                    .style
                                    .display =
                                    "none";
                            }}
                        />
                    )}


                    {/* OVERLAY */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#0c1016]
                            via-[#0c1016]/10
                            to-black/25
                        "
                    />


                    {/* GRID OVER IMAGE */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
                            bg-[size:28px_28px]
                            opacity-40
                        "
                    />


                    {/* TAGS */}

                    <div
                        className="
                            absolute
                            left-4
                            top-4
                            flex
                            max-w-[68%]
                            flex-wrap
                            gap-1.5
                        "
                    >

                        {tags.map(
                            (
                                tag
                            ) => (

                                <span
                                    key={
                                        tag.key
                                    }

                                    className={`
                                        inline-flex
                                        max-w-[145px]
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        px-2.5
                                        py-1.5
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.08em]
                                        backdrop-blur-md

                                        ${
                                            tag.type ===
                                            "technology"

                                                ? (
                                                    "border-purple-400/20 "
                                                    +
                                                    "bg-purple-500/15 "
                                                    +
                                                    "text-purple-200"
                                                )

                                                : (
                                                    "border-cyan-400/15 "
                                                    +
                                                    "bg-cyan-500/10 "
                                                    +
                                                    "text-cyan-200"
                                                )
                                        }
                                    `}
                                >

                                    <Code2
                                        size={9}
                                        className="
                                            shrink-0
                                        "
                                    />


                                    <span
                                        className="
                                            truncate
                                        "
                                    >
                                        {tag.name}
                                    </span>

                                </span>
                            )
                        )}

                    </div>


                    {/* PROMOTION */}

                    {promoted && (

                        <div
                            className="
                                absolute
                                right-4
                                top-4
                            "
                        >

                            <PromotionBadge
                                isPromoted

                                expiresAt={
                                    project
                                        ?.promotion_expires_at
                                }

                                compact

                                showTimer={
                                    false
                                }
                            />

                        </div>
                    )}


                    {/* OPEN CTA */}

                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/30
                            opacity-0
                            transition-all
                            duration-300

                            group-hover:opacity-100
                        "
                    >

                        <div
                            className="
                                flex
                                translate-y-3
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/15
                                bg-black/70
                                px-5
                                py-2.5
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.10em]
                                text-white
                                shadow-xl
                                backdrop-blur-xl
                                transition-transform
                                duration-300

                                group-hover:translate-y-0
                            "
                        >

                            Open project

                            <ArrowUpRight
                                size={13}
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        flex
                        flex-1
                        flex-col
                        p-5

                        sm:p-6
                    "
                >

                    {/* TITLE */}

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
                                min-w-0
                                flex-1
                            "
                        >

                            <p
                                className="
                                    mb-1.5
                                    font-mono
                                    text-[8px]
                                    font-black
                                    uppercase
                                    tracking-[0.14em]
                                    text-gray-700
                                "
                            >
                                repository
                            </p>


                            <h3
                                className="
                                    break-words
                                    text-xl
                                    font-black
                                    leading-tight
                                    tracking-[-0.02em]
                                    text-white
                                    transition

                                    group-hover:text-indigo-300

                                    sm:text-2xl
                                "
                            >
                                {project.name}
                            </h3>

                        </div>


                        <div
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-yellow-400/10
                                bg-yellow-400/[0.035]
                                px-2.5
                                py-1.5
                                text-yellow-300
                            "
                        >

                            <Star
                                size={13}
                                fill="currentColor"
                            />


                            <span
                                className="
                                    text-[10px]
                                    font-black
                                "
                            >
                                {
                                    project
                                        ?.stars_count
                                    ??
                                    0
                                }
                            </span>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mb-6
                            mt-4
                            line-clamp-3
                            text-[13px]
                            font-medium
                            leading-6
                            text-gray-600
                        "
                    >
                        {
                            project.description

                            ||

                            "Ushbu loyiha F.Society dasturchilar hamjamiyatida taqdim etilgan."
                        }
                    </p>


                    {/* =================================================
                        AUTHOR
                    ================================================== */}

                    <div
                        className="
                            mt-auto
                            border-t
                            border-white/[0.05]
                            pt-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
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
                                        relative
                                        shrink-0
                                    "
                                >

                                    <div
                                        className="
                                            absolute
                                            -inset-1
                                            rounded-xl
                                            bg-gradient-to-br
                                            from-indigo-500
                                            to-purple-600
                                            opacity-20
                                            blur
                                            transition

                                            group-hover:opacity-55
                                        "
                                    />


                                    <img
                                        src={
                                            avatar
                                        }

                                        alt={
                                            project
                                                ?.user
                                                ?.username
                                            ||
                                            "User"
                                        }

                                        onError={
                                            handleUserImageError
                                        }

                                        className="
                                            relative
                                            h-10
                                            w-10
                                            rounded-xl
                                            border
                                            border-white/[0.07]
                                            bg-gray-900
                                            object-cover
                                        "
                                    />

                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <p
                                        className="
                                            max-w-[140px]
                                            truncate
                                            text-xs
                                            font-black
                                            text-gray-200
                                        "
                                    >
                                        {ownerName}
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            truncate
                                            font-mono
                                            text-[8px]
                                            font-bold
                                            text-gray-700
                                        "
                                    >
                                        @{
                                            project
                                                ?.user
                                                ?.username
                                            ||
                                            "unknown"
                                        }
                                    </p>

                                </div>

                            </div>


                            <ArrowUpRight
                                size={15}
                                className="
                                    shrink-0
                                    text-gray-700
                                    transition-all

                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                    group-hover:text-indigo-300
                                "
                            />

                        </div>


                        {/* STATS */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-2
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-white/[0.045]
                                    bg-white/[0.018]
                                    px-3
                                    py-2.5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        text-gray-600
                                    "
                                >

                                    <Eye
                                        size={12}
                                    />

                                    <span
                                        className="
                                            font-mono
                                            text-[8px]
                                            uppercase
                                        "
                                    >
                                        views
                                    </span>

                                </div>


                                <span
                                    className="
                                        text-[10px]
                                        font-black
                                        text-gray-300
                                    "
                                >
                                    {
                                        project
                                            ?.views_count
                                        ??
                                        0
                                    }
                                </span>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-white/[0.045]
                                    bg-white/[0.018]
                                    px-3
                                    py-2.5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        text-gray-600
                                    "
                                >

                                    <MessageCircle
                                        size={12}
                                    />

                                    <span
                                        className="
                                            font-mono
                                            text-[8px]
                                            uppercase
                                        "
                                    >
                                        comments
                                    </span>

                                </div>


                                <span
                                    className="
                                        text-[10px]
                                        font-black
                                        text-gray-300
                                    "
                                >
                                    {
                                        project
                                            ?.comments_count
                                        ??
                                        0
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </article>

        </Link>
    );
};


export default ProjectGridCard;