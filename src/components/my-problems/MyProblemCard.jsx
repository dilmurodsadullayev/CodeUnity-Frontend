// src/components/my-problems/MyProblemCard.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    limitText,
} from "../../utils/limitText";

import timeAgo from "../../utils/timeAgo";

import {
    formatCompactNumber,
    getDeadlineInfo,
    getLanguageColor,
    getMyProblemUserImage,
    normalizeProblemLanguages,
    withAlpha,
} from "./myProblemHelpers";


// =========================================================
// LANGUAGE BADGE
// =========================================================

const LanguageBadge = ({
    language,
}) => {

    const name =
        typeof language ===
        "string"

            ? language

            : (
                language?.name
                ||
                "Noma’lum"
            );


    const color =
        getLanguageColor(
            language
        );


    return (

        <span
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
                        "15"
                    ),
            }}

            className="
                inline-flex
                items-center

                gap-1.5

                rounded-full

                border

                px-3
                py-1

                text-[11px]
                font-black

                transition-all
                duration-200

                hover:-translate-y-px
            "
        >

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

                    rounded-full
                "
            />


            {name}

        </span>
    );
};


// =========================================================
// STAT ITEM
// =========================================================

const ProblemStat = ({
    value,
    label,
    valueClassName,
    active = false,
}) => {

    return (

        <div
            className={`
                rounded-2xl

                border

                p-3

                text-center

                ${
                    active

                        ? (
                            "border-cyan-400/20 "
                            +
                            "bg-cyan-400/10"
                        )

                        : (
                            "border-white/10 "
                            +
                            "bg-white/[0.035]"
                        )
                }
            `}
        >

            <p
                className={`
                    text-base
                    font-black

                    ${
                        valueClassName
                        ||
                        "text-gray-200"
                    }
                `}
            >
                {
                    formatCompactNumber(
                        value
                    )
                }
            </p>


            <p
                className="
                    mt-1

                    text-[10px]
                    font-black

                    uppercase
                    tracking-[0.14em]

                    text-gray-500
                "
            >
                {label}
            </p>

        </div>
    );
};


// =========================================================
// MY PROBLEM CARD
// =========================================================

const MyProblemCard = ({
    id,

    username,

    firstName,

    lastName,

    image,

    name,

    status,

    views,

    languages,

    createdAt,

    star,

    responseCount,

    deadline,

    isUrgent,
}) => {

    // =====================================================
    // DEADLINE
    // =====================================================

    const deadlineInfo =
        getDeadlineInfo(
            deadline
        );


    // =====================================================
    // FULL NAME
    // =====================================================

    const fullName =
        firstName
        ||
        lastName

            ? `${
                firstName
                ||
                ""
            } ${
                lastName
                ||
                ""
            }`.trim()

            : (
                username
                ||
                "Unknown user"
            );


    // =====================================================
    // LANGUAGES
    // =====================================================

    const normalizedLanguages =
        normalizeProblemLanguages(
            languages
        );


    // =====================================================
    // IMAGE
    // =====================================================

    const imageSrc =
        getMyProblemUserImage(
            image
        );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="
                animate-fade-in-up

                h-full
            "
        >

            <Link
                to={
                    `/problem/${id}/detail`
                }

                className="
                    group

                    relative

                    flex
                    h-full
                    flex-col

                    overflow-hidden

                    rounded-3xl

                    border
                    border-white/10

                    bg-[#0d1117]

                    p-5

                    shadow-2xl
                    shadow-black/20

                    transition-all
                    duration-300

                    hover:-translate-y-1

                    hover:border-cyan-400/40

                    hover:shadow-cyan-500/10
                "
            >

                {/* =================================================
                    GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none

                        absolute
                        -right-16
                        -top-16

                        h-40
                        w-40

                        rounded-full

                        bg-cyan-500/10

                        blur-3xl

                        transition-all
                        duration-300

                        group-hover:bg-cyan-500/20
                    "
                />


                <div
                    className="
                        pointer-events-none

                        absolute
                        -bottom-20
                        -left-20

                        h-44
                        w-44

                        rounded-full

                        bg-indigo-500/10

                        blur-3xl

                        transition-all
                        duration-300

                        group-hover:bg-indigo-500/20
                    "
                />


                <div
                    className="
                        relative
                        z-10

                        flex
                        h-full
                        flex-col
                    "
                >

                    {/* =================================================
                        TOP BADGES
                    ================================================== */}

                    <div
                        className="
                            mb-4

                            flex
                            items-start
                            justify-between

                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center

                                gap-2
                            "
                        >

                            <span
                                className="
                                    inline-flex
                                    items-center

                                    gap-2

                                    rounded-full

                                    border
                                    border-cyan-400/20

                                    bg-cyan-400/10

                                    px-3
                                    py-1

                                    text-[11px]
                                    font-black

                                    uppercase
                                    tracking-[0.16em]

                                    text-cyan-300
                                "
                            >

                                <i
                                    className="
                                        fa-solid
                                        fa-terminal
                                    "
                                />

                                FSociety

                            </span>


                            {isUrgent && (

                                <span
                                    className="
                                        inline-flex
                                        items-center

                                        gap-2

                                        rounded-full

                                        border
                                        border-yellow-400/30

                                        bg-yellow-400/10

                                        px-3
                                        py-1

                                        text-[11px]
                                        font-black

                                        uppercase
                                        tracking-[0.14em]

                                        text-yellow-300
                                    "
                                >

                                    <i
                                        className="
                                            fas
                                            fa-bolt
                                        "
                                    />

                                    Tezkor

                                </span>

                            )}

                        </div>


                        {/* STATUS */}

                        <span
                            className={`
                                shrink-0

                                rounded-full

                                border

                                px-3
                                py-1

                                text-[11px]
                                font-black

                                ${
                                    status

                                        ? (
                                            "border-green-400/30 "
                                            +
                                            "bg-green-500/10 "
                                            +
                                            "text-green-300"
                                        )

                                        : (
                                            "border-red-400/30 "
                                            +
                                            "bg-red-500/10 "
                                            +
                                            "text-red-300"
                                        )
                                }
                            `}
                        >
                            {
                                status
                                    ? "Yechilgan"
                                    : "Yechilmagan"
                            }
                        </span>

                    </div>


                    {/* =================================================
                        USER
                    ================================================== */}

                    <div
                        className="
                            mb-5

                            flex
                            items-center

                            gap-3

                            rounded-2xl

                            border
                            border-white/10

                            bg-white/[0.035]

                            p-3
                        "
                    >

                        <img
                            src={
                                imageSrc
                            }

                            alt={
                                `${username || "User"} avatar`
                            }

                            onError={
                                (
                                    event
                                ) => {

                                    event.currentTarget.src =
                                        getMyProblemUserImage(
                                            null
                                        );
                                }
                            }

                            className="
                                h-12
                                w-12

                                shrink-0

                                rounded-2xl

                                border
                                border-cyan-400/20

                                object-cover

                                transition-all
                                duration-300

                                group-hover:border-cyan-400/50
                            "
                        />


                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >

                            <h4
                                className="
                                    truncate

                                    text-sm
                                    font-black

                                    text-white
                                "
                            >
                                {fullName}
                            </h4>


                            <div
                                className="
                                    mt-1

                                    flex
                                    flex-wrap
                                    items-center

                                    gap-x-3
                                    gap-y-1

                                    text-[11px]
                                    font-bold

                                    text-gray-500
                                "
                            >

                                <span
                                    className="
                                        truncate
                                    "
                                >
                                    @{username || "user"}
                                </span>


                                <span
                                    className="
                                        hidden

                                        text-gray-700

                                        sm:inline
                                    "
                                >
                                    /
                                </span>


                                <span>
                                    {
                                        timeAgo(
                                            createdAt
                                        )
                                    }
                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                h-10
                                w-10

                                shrink-0
                                items-center
                                justify-center

                                rounded-2xl

                                border
                                border-white/10

                                bg-black/20

                                text-gray-500

                                transition-all

                                group-hover:border-cyan-400/30
                                group-hover:text-cyan-300
                            "
                        >

                            <i
                                className="
                                    fas
                                    fa-code
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================== */}

                    <h3
                        className="
                            mb-4

                            text-xl
                            font-black

                            leading-7

                            text-white

                            transition-colors
                            duration-300

                            group-hover:text-cyan-300
                        "
                    >
                        {
                            limitText(
                                name
                                ||
                                "Nomsiz muammo",

                                75
                            )
                        }
                    </h3>


                    {/* =================================================
                        DEADLINE
                    ================================================== */}

                    {deadlineInfo && (

                        <div
                            className={`
                                mb-4

                                inline-flex
                                w-fit
                                items-center

                                gap-2

                                rounded-2xl

                                border

                                px-3
                                py-2

                                text-sm
                                font-black

                                shadow-lg

                                ${
                                    deadlineInfo
                                        .className
                                }
                            `}
                        >

                            <i
                                className={
                                    deadlineInfo.icon
                                }
                            />


                            <span>
                                {
                                    deadlineInfo.text
                                }
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        LANGUAGES
                    ================================================== */}

                    <div
                        className="
                            mb-5

                            flex
                            flex-wrap

                            gap-2
                        "
                    >

                        {normalizedLanguages.length >
                        0 ? (

                            normalizedLanguages.map(
                                (
                                    language,
                                    index
                                ) => (

                                    <LanguageBadge
                                        key={
                                            language?.id
                                            ??
                                            `${
                                                language?.name
                                                ||
                                                language
                                            }-${index}`
                                        }

                                        language={
                                            language
                                        }
                                    />

                                )
                            )

                        ) : (

                            <span
                                className="
                                    rounded-full

                                    border
                                    border-gray-700

                                    bg-white/[0.035]

                                    px-3
                                    py-1

                                    text-[11px]
                                    font-bold

                                    text-gray-500
                                "
                            >
                                Til belgilanmagan
                            </span>

                        )}

                    </div>


                    <div
                        className="
                            flex-grow
                        "
                    />


                    {/* =================================================
                        STATS
                    ================================================== */}

                    <div
                        className="
                            mt-2

                            grid
                            grid-cols-3

                            gap-3

                            border-t
                            border-white/10

                            pt-4
                        "
                    >

                        <ProblemStat
                            value={
                                views
                            }

                            label="Views"

                            valueClassName="
                                text-cyan-300
                            "
                        />


                        <ProblemStat
                            value={
                                star
                            }

                            label="Stars"

                            valueClassName="
                                text-yellow-300
                            "
                        />


                        <ProblemStat
                            value={
                                responseCount
                            }

                            label="Answers"

                            valueClassName="
                                text-cyan-300
                            "

                            active
                        />

                    </div>


                    {/* =================================================
                        BOTTOM ACTION
                    ================================================== */}

                    <div
                        className="
                            mt-4

                            flex
                            items-center
                            justify-between

                            gap-3
                        "
                    >

                        <p
                            className="
                                min-w-0

                                truncate

                                text-xs
                                font-bold

                                text-gray-500
                            "
                        >

                            <i
                                className="
                                    fas
                                    fa-shield-halved

                                    mr-1

                                    text-cyan-300
                                "
                            />

                            My problem archive

                        </p>


                        <span
                            className="
                                inline-flex
                                shrink-0
                                items-center

                                gap-2

                                rounded-2xl

                                border
                                border-cyan-400/20

                                bg-cyan-400/10

                                px-4
                                py-2

                                text-xs
                                font-black

                                text-cyan-300

                                transition-all
                                duration-300

                                group-hover:border-cyan-400/40

                                group-hover:bg-cyan-400/20
                            "
                        >

                            Batafsil


                            <i
                                className="
                                    fas
                                    fa-arrow-right

                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                            />

                        </span>

                    </div>

                </div>

            </Link>

        </div>
    );
};


export default MyProblemCard;