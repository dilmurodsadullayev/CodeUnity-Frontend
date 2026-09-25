import React, {
    useMemo,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Code2,
    Eye,
    GitFork,
    MessageCircle,
    Rocket,
    Star,
} from "lucide-react";


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_PROJECT_IMAGE =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop";


const DEFAULT_STACK_COLOR =
    "#64748B";


const MAX_VISIBLE_STACK =
    4;


// =========================================================
// BACKEND URL
// =========================================================

const BACKEND_URL =
    (
        process.env.REACT_APP_BACKEND_URL
        ||
        window.location.origin
    ).replace(
        /\/+$/,
        ""
    );


// =========================================================
// PROJECT TITLE
// =========================================================

const getProjectTitle = (
    project
) => {

    return (
        project?.title
        ||
        project?.name
        ||
        "Noma’lum loyiha"
    );
};


// =========================================================
// PROJECT DESCRIPTION
// =========================================================

const getProjectDescription = (
    project
) => {

    return (
        project?.description
        ||
        project?.short_description
        ||
        "Bu loyiha uchun tavsif hali kiritilmagan."
    );
};


// =========================================================
// PROJECT IMAGE
// =========================================================

const getProjectImage = (
    project
) => {

    const image =
        project?.images?.[0]?.image
        ||
        project?.image;


    if (!image) {
        return DEFAULT_PROJECT_IMAGE;
    }


    if (
        typeof image ===
        "string"
        &&
        (
            image.startsWith(
                "http://"
            )
            ||
            image.startsWith(
                "https://"
            )
            ||
            image.startsWith(
                "blob:"
            )
            ||
            image.startsWith(
                "data:"
            )
        )
    ) {
        return image;
    }


    const normalizedPath =
        String(
            image
        ).startsWith("/")
            ? image
            : `/${image}`;


    return (
        `${BACKEND_URL}${normalizedPath}`
    );
};


// =========================================================
// TRUNCATE
// =========================================================

const truncateText = (
    text,
    max = 155
) => {

    const value =
        String(
            text
            ||
            ""
        ).trim();


    if (!value) {

        return (
            "Bu loyiha uchun tavsif hali kiritilmagan."
        );
    }


    if (
        value.length <=
        max
    ) {
        return value;
    }


    return (
        `${value
            .slice(
                0,
                max
            )
            .trim()}...`
    );
};


// =========================================================
// COLOR
// =========================================================

const getStackColor = (
    item
) => {

    const color =
        item?.color;


    if (
        typeof color ===
            "string"
        &&
        /^#[0-9A-Fa-f]{6}$/.test(
            color
        )
    ) {
        return color;
    }


    return DEFAULT_STACK_COLOR;
};


// =========================================================
// HEX + ALPHA
// =========================================================

const withAlpha = (
    color,
    alpha
) => {

    const safeColor =
        (
            typeof color ===
                "string"
            &&
            /^#[0-9A-Fa-f]{6}$/.test(
                color
            )
        )
            ? color
            : DEFAULT_STACK_COLOR;


    return (
        `${safeColor}${alpha}`
    );
};


// =========================================================
// NORMALIZE STACK ITEM
// =========================================================

const normalizeStackItem = (
    item,
    type,
    index
) => {

    if (!item) {
        return null;
    }


    if (
        typeof item ===
        "string"
    ) {

        return {

            id:
                `${type}-${item}-${index}`,

            name:
                item,

            color:
                DEFAULT_STACK_COLOR,

            type,
        };
    }


    return {

        ...item,

        id:
            item.id
            ??
            `${type}-${item.name || index}`,

        name:
            item.name
            ||
            item.title
            ||
            "Noma’lum",

        color:
            getStackColor(
                item
            ),

        type,
    };
};


// =========================================================
// GET LANGUAGES
//
// Yangi serializer:
//
// languages_data[]
//
// Eski compatibility:
//
// language_data
// =========================================================

const getProjectLanguages = (
    project
) => {

    if (
        Array.isArray(
            project?.languages_data
        )
        &&
        project.languages_data.length >
            0
    ) {

        return project.languages_data
            .map(
                (
                    item,
                    index
                ) =>
                    normalizeStackItem(
                        item,
                        "language",
                        index
                    )
            )
            .filter(
                Boolean
            );
    }


    if (
        project?.language_data
    ) {

        return [
            normalizeStackItem(
                project.language_data,
                "language",
                0
            ),
        ].filter(
            Boolean
        );
    }


    return [];
};


// =========================================================
// GET TECHNOLOGIES
//
// Yangi serializer:
//
// technologies_data[]
//
// Eski compatibility:
//
// technology_data
// =========================================================

const getProjectTechnologies = (
    project
) => {

    if (
        Array.isArray(
            project?.technologies_data
        )
        &&
        project.technologies_data.length >
            0
    ) {

        return project.technologies_data
            .map(
                (
                    item,
                    index
                ) =>
                    normalizeStackItem(
                        item,
                        "technology",
                        index
                    )
            )
            .filter(
                Boolean
            );
    }


    if (
        project?.technology_data
    ) {

        return [
            normalizeStackItem(
                project.technology_data,
                "technology",
                0
            ),
        ].filter(
            Boolean
        );
    }


    return [];
};


// =========================================================
// REMOVE DUPLICATE STACK
//
// Masalan primary Django va
// technologies_data ichida Django qayta kelib qolsa
// bitta marta ko‘rsatamiz.
// =========================================================

const uniqueStack = (
    items
) => {

    const map =
        new Map();


    items.forEach(
        (
            item
        ) => {

            if (!item) {
                return;
            }


            const key =
                `${item.type}-${item.id || item.name}`;


            if (
                !map.has(
                    key
                )
            ) {
                map.set(
                    key,
                    item
                );
            }
        }
    );


    return Array.from(
        map.values()
    );
};


// =========================================================
// STACK BADGE
// =========================================================

const StackBadge = ({
    item,
}) => {

    const color =
        getStackColor(
            item
        );


    return (

        <span
            title={
                item?.name
            }

            className="
                inline-flex
                max-w-[160px]
                items-center
                gap-1.5
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-black
                transition
                duration-300

                hover:-translate-y-[1px]
            "

            style={{

                color,

                borderColor:
                    withAlpha(
                        color,
                        "45"
                    ),

                backgroundColor:
                    withAlpha(
                        color,
                        "14"
                    ),

                boxShadow:
                    `0 0 12px ${withAlpha(
                        color,
                        "0D"
                    )}`,
            }}
        >

            <span
                className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                "

                style={{
                    backgroundColor:
                        color,
                }}
            />


            <span
                className="
                    truncate
                "
            >
                {item?.name}
            </span>

        </span>
    );
};


// =========================================================
// MORE STACK BADGE
// =========================================================

const MoreStackBadge = ({
    items,
}) => {

    if (
        !items.length
    ) {
        return null;
    }


    const title =
        items
            .map(
                (
                    item
                ) =>
                    item?.name
            )
            .filter(
                Boolean
            )
            .join(", ");


    return (

        <span
            title={
                title
            }

            className="
                inline-flex
                items-center
                rounded-full
                border
                border-gray-700
                bg-gray-950/50
                px-3
                py-1.5
                text-xs
                font-black
                text-gray-400
                transition

                hover:border-gray-600
                hover:text-white
            "
        >
            +{items.length}
        </span>
    );
};


// =========================================================
// PROJECT CARD
// =========================================================

const ProjectCard = ({
    project,
    index = 0,
}) => {

    // =====================================================
    // BASIC
    // =====================================================

    const title =
        getProjectTitle(
            project
        );


    const description =
        truncateText(
            getProjectDescription(
                project
            )
        );


    const projectImage =
        getProjectImage(
            project
        );


    // =====================================================
    // STACK
    // =====================================================

    const stack =
        useMemo(
            () => {

                const languages =
                    getProjectLanguages(
                        project
                    );


                const technologies =
                    getProjectTechnologies(
                        project
                    );


                return uniqueStack([
                    ...languages,
                    ...technologies,
                ]);

            },
            [
                project,
            ]
        );


    const visibleStack =
        stack.slice(
            0,
            MAX_VISIBLE_STACK
        );


    const hiddenStack =
        stack.slice(
            MAX_VISIBLE_STACK
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <article
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-gray-700/70
                bg-gray-900/70
                shadow-xl
                shadow-black/20
                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-indigo-400/40
                hover:bg-gray-900/90
                hover:shadow-indigo-500/10
            "

            style={{
                animationDelay:
                    `${index * 80}ms`,
            }}
        >

            {/* =================================================
                IMAGE
            ================================================== */}

            <div
                className="
                    relative
                    h-52
                    overflow-hidden
                    bg-gray-950
                "
            >

                <img
                    src={
                        projectImage
                    }

                    alt={
                        title
                    }

                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700

                        group-hover:scale-110
                    "

                    onError={
                        (
                            event
                        ) => {

                            event.currentTarget.src =
                                DEFAULT_PROJECT_IMAGE;
                        }
                    }
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-gray-950
                        via-black/20
                        to-transparent
                    "
                />


                {/* PROJECT LABEL */}

                <div
                    className="
                        absolute
                        left-4
                        top-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/10
                        bg-black/45
                        px-3
                        py-1.5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-white
                        backdrop-blur-md
                    "
                >
                    <Rocket
                        size={14}
                    />

                    Project
                </div>


                {/* CODE ICON */}

                <div
                    className="
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-indigo-400/20
                        bg-indigo-500/20
                        text-indigo-200
                        backdrop-blur-md
                    "
                >
                    <Code2
                        size={21}
                    />
                </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    relative
                    p-5
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-16
                        h-36
                        w-36
                        rounded-full
                        bg-indigo-500/10
                        opacity-0
                        blur-3xl
                        transition-opacity
                        duration-300

                        group-hover:opacity-100
                    "
                />


                <div
                    className="
                        relative
                        z-10
                    "
                >

                    {/* TITLE */}

                    <h4
                        className="
                            line-clamp-2
                            text-xl
                            font-black
                            leading-tight
                            text-white
                            transition-colors

                            group-hover:text-indigo-300
                        "
                    >
                        {title}
                    </h4>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-3
                            line-clamp-3
                            text-sm
                            font-medium
                            leading-7
                            text-gray-400
                        "
                    >
                        {description}
                    </p>


                    {/* =================================================
                        STACK TAGS

                        Dizayn eski holicha:
                        bitta flex row.

                        Faqat endi:
                        languages_data +
                        technologies_data

                        ishlaydi.

                        Ko‘p bo‘lsa +N.
                    ================================================== */}

                    <div
                        className="
                            mt-4
                            flex
                            min-h-[30px]
                            flex-wrap
                            gap-2
                        "
                    >

                        {visibleStack.map(
                            (
                                item
                            ) => (

                                <StackBadge
                                    key={
                                        `${item.type}-${item.id}`
                                    }

                                    item={
                                        item
                                    }
                                />
                            )
                        )}


                        <MoreStackBadge
                            items={
                                hiddenStack
                            }
                        />


                        {stack.length === 0 && (

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-gray-700
                                    bg-gray-950/50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-black
                                    text-gray-500
                                "
                            >
                                Texnologiyalar kiritilmagan
                            </span>
                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            mt-5
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-4
                            border-t
                            border-gray-700/70
                            pt-4
                        "
                    >

                        {/* STATS */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                                text-sm
                                font-bold
                                text-gray-400
                            "
                        >

                            {/* STARS */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-yellow-300
                                "
                                title="Yulduzlar"
                            >
                                <Star
                                    size={16}
                                    className="
                                        fill-yellow-400/20
                                    "
                                />

                                {Number(
                                    project?.stars_count
                                    ||
                                    0
                                ).toLocaleString()}
                            </span>


                            {/* COLLABORATIONS */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-purple-300
                                "
                                title="Collaborations"
                            >
                                <GitFork
                                    size={16}
                                />

                                {Number(
                                    project?.collaborations_count
                                    ||
                                    0
                                ).toLocaleString()}
                            </span>


                            {/* COMMENTS */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-emerald-300
                                "
                                title="Izohlar"
                            >
                                <MessageCircle
                                    size={16}
                                />

                                {Number(
                                    project?.comments_count
                                    ||
                                    0
                                ).toLocaleString()}
                            </span>


                            {/* VIEWS */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-cyan-300
                                "
                                title="Ko‘rishlar"
                            >
                                <Eye
                                    size={16}
                                />

                                {Number(
                                    project?.views_count
                                    ||
                                    0
                                ).toLocaleString()}
                            </span>

                        </div>


                        {/* DETAIL */}

                        <Link
                            to={
                                `/project/${project.id}/detail`
                            }

                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-indigo-400/20
                                bg-indigo-500/10
                                px-4
                                py-2
                                text-xs
                                font-black
                                text-indigo-300
                                transition

                                hover:bg-indigo-500/20
                            "
                        >
                            Batafsil

                            <i
                                className="
                                    fa-solid
                                    fa-arrow-right
                                    transition-transform

                                    group-hover:translate-x-1
                                "
                            />
                        </Link>

                    </div>

                </div>

            </div>

        </article>
    );
};


export default ProjectCard;