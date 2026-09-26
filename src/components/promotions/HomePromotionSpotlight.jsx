// src/components/promotions/HomePromotionSpotlight.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Eye,
    FolderKanban,
    Loader2,
    Megaphone,
    RefreshCw,
    Star,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    getSidebarPromotionsFailure,
    getSidebarPromotionsStart,
    getSidebarPromotionsSuccess,
    selectPromotionState,
} from "../../features/promotions";

import PromotionService from "../../services/promotion";

import {
    BACKEND_URL,
} from "../../services/config";


// =========================================================
// CONFIG
// =========================================================

const PROMOTION_LIMIT =
    5;


const AUTO_ROTATE_DELAY =
    7000;


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value
) => {

    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? Math.max(
            0,
            number
        )
        : 0;
};


// =========================================================
// COMPACT NUMBER
// =========================================================

const formatCompactNumber = (
    value
) => {

    const number =
        safeNumber(
            value
        );


    if (
        number >=
        1_000_000
    ) {

        const formatted =
            number /
            1_000_000;


        return (
            `${formatted.toFixed(
                formatted >=
                10
                    ? 0
                    : 1
            )}M`
        );
    }


    if (
        number >=
        1_000
    ) {

        const formatted =
            number /
            1_000;


        return (
            `${formatted.toFixed(
                formatted >=
                10
                    ? 0
                    : 1
            )}K`
        );
    }


    return String(
        number
    );
};


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
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error
) => {

    const data =
        error?.response?.data;


    if (
        typeof data ===
        "string"
    ) {

        return data;
    }


    if (
        typeof data?.detail ===
        "string"
    ) {

        return data.detail;
    }


    if (
        typeof data?.message ===
        "string"
    ) {

        return data.message;
    }


    if (
        typeof data?.error ===
        "string"
    ) {

        return data.error;
    }


    return (
        error?.message
        ||
        "Promotion projectlarini yuklab bo‘lmadi."
    );
};


// =========================================================
// CANCEL REQUEST
// =========================================================

const isCanceledRequest = (
    error
) => {

    return (
        error?.code ===
        "ERR_CANCELED"
        ||
        error?.name ===
        "CanceledError"
        ||
        error?.name ===
        "AbortError"
    );
};


// =========================================================
// STACK
// =========================================================

const getProjectStack = (
    project
) => {

    const values =
        [];


    const addStack = (
        value
    ) => {

        const text =
            String(
                value
                ??
                ""
            ).trim();


        if (
            !text
        ) {

            return;
        }


        const exists =
            values.some(
                (
                    current
                ) =>
                    current.toLowerCase()
                    ===
                    text.toLowerCase()
            );


        if (
            exists
        ) {

            return;
        }


        values.push(
            text
        );
    };


    // Primary language

    addStack(
        project
            ?.language_data
            ?.name
    );


    // Primary technology

    addStack(
        project
            ?.technology_data
            ?.name
    );


    // Multiple languages fallback

    if (
        values.length <
        2
    ) {

        const languages =
            Array.isArray(
                project
                    ?.languages_data
            )
                ? project.languages_data
                : [];


        languages.forEach(
            (
                language
            ) => {

                if (
                    values.length <
                    2
                ) {

                    addStack(
                        language?.name
                    );
                }
            }
        );
    }


    // Multiple technologies fallback

    if (
        values.length <
        2
    ) {

        const technologies =
            Array.isArray(
                project
                    ?.technologies_data
            )
                ? project.technologies_data
                : [];


        technologies.forEach(
            (
                technology
            ) => {

                if (
                    values.length <
                    2
                ) {

                    addStack(
                        technology?.name
                    );
                }
            }
        );
    }


    return values.slice(
        0,
        2
    );
};


// =========================================================
// THUMBNAIL
// =========================================================

const ProjectThumbnail = ({
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


    if (
        !imageUrl
        ||
        imageFailed
    ) {

        return (

            <div
                className="
                    grid
                    h-11
                    w-11
                    flex-shrink-0
                    place-items-center
                    rounded-xl

                    border
                    border-indigo-400/20

                    bg-indigo-500/[0.08]

                    text-indigo-300/60
                "
            >

                <FolderKanban
                    size={18}
                    strokeWidth={2}
                />

            </div>
        );
    }


    return (

        <img
            src={
                imageUrl
            }

            alt={
                project?.name
                ||
                "Project"
            }

            onError={
                () => {

                    setImageFailed(
                        true
                    );
                }
            }

            className="
                h-11
                w-11
                flex-shrink-0

                rounded-xl

                border
                border-white/10

                bg-[#090c11]

                object-cover
            "
        />
    );
};


// =========================================================
// HOME PROMOTION SPOTLIGHT
// =========================================================

const HomePromotionSpotlight = () => {

    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {

        sidebarProjects,

        sidebarLoading,

        sidebarError,

    } = useSelector(
        selectPromotionState
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(
        0
    );


    const [
        isHovered,
        setIsHovered,
    ] = useState(
        false
    );


    // =====================================================
    // PROJECTS
    // =====================================================

    const projects =
        useMemo(
            () => {

                if (
                    !Array.isArray(
                        sidebarProjects
                    )
                ) {

                    return [];
                }


                return sidebarProjects;

            },
            [
                sidebarProjects,
            ]
        );


    // =====================================================
    // CURRENT PROJECT
    // =====================================================

    const currentProject =
        projects[
            currentIndex
        ]
        ??
        null;


    // =====================================================
    // CURRENT STACK
    // =====================================================

    const currentStack =
        useMemo(
            () => {

                return getProjectStack(
                    currentProject
                );

            },
            [
                currentProject,
            ]
        );


    // =====================================================
    // LOAD PROMOTIONS
    // =====================================================

    const loadPromotions =
        useCallback(
            async (
                signal
            ) => {

                dispatch(
                    getSidebarPromotionsStart()
                );


                try {

                    const response =
                        await PromotionService
                            .getHomeSidebarProjects({

                                limit:
                                    PROMOTION_LIMIT,

                                signal,

                            });


                    dispatch(
                        getSidebarPromotionsSuccess(
                            response
                        )
                    );


                } catch (
                    error
                ) {

                    if (
                        isCanceledRequest(
                            error
                        )
                    ) {

                        return;
                    }


                    dispatch(
                        getSidebarPromotionsFailure(
                            getErrorMessage(
                                error
                            )
                        )
                    );
                }
            },
            [
                dispatch,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            const controller =
                new AbortController();


            loadPromotions(
                controller.signal
            );


            return () => {

                controller.abort();
            };

        },
        [
            loadPromotions,
        ]
    );


    // =====================================================
    // KEEP INDEX VALID
    // =====================================================

    useEffect(
        () => {

            if (
                projects.length ===
                0
            ) {

                setCurrentIndex(
                    0
                );

                return;
            }


            if (
                currentIndex >=
                projects.length
            ) {

                setCurrentIndex(
                    0
                );
            }

        },
        [
            projects.length,
            currentIndex,
        ]
    );


    // =====================================================
    // AUTO ROTATE
    // =====================================================

    useEffect(
        () => {

            if (
                projects.length <=
                1
                ||
                isHovered
            ) {

                return undefined;
            }


            const timer =
                window.setInterval(
                    () => {

                        setCurrentIndex(
                            (
                                previous
                            ) => {

                                return (
                                    (
                                        previous +
                                        1
                                    )
                                    %
                                    projects.length
                                );
                            }
                        );

                    },
                    AUTO_ROTATE_DELAY
                );


            return () => {

                window.clearInterval(
                    timer
                );
            };

        },
        [
            projects.length,
            isHovered,
        ]
    );


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious =
        () => {

            if (
                projects.length <=
                1
            ) {

                return;
            }


            setCurrentIndex(
                (
                    previous
                ) => {

                    if (
                        previous <=
                        0
                    ) {

                        return (
                            projects.length -
                            1
                        );
                    }


                    return (
                        previous -
                        1
                    );
                }
            );
        };


    // =====================================================
    // NEXT
    // =====================================================

    const handleNext =
        () => {

            if (
                projects.length <=
                1
            ) {

                return;
            }


            setCurrentIndex(
                (
                    previous
                ) => {

                    return (
                        (
                            previous +
                            1
                        )
                        %
                        projects.length
                    );
                }
            );
        };


    // =====================================================
    // EMPTY
    //
    // Aktiv reklama bo'lmasa hech narsa
    // ko'rinmaydi.
    // =====================================================

    if (
        !sidebarLoading
        &&
        !sidebarError
        &&
        projects.length ===
        0
    ) {

        return null;
    }


    // =====================================================
// LOADING
//
// Promotion yuklanayotgan paytda:
// - final card o'lchami saqlanadi
// - hech qanday "loading" yozuvi yo'q
// - layout sakramaydi
// - skeleton Birthday card uslubiga mos
// =====================================================

if (
    sidebarLoading
    &&
    projects.length === 0
) {
    return (

        <section
            className="
                relative
                overflow-hidden

                rounded-2xl

                border
                border-white/10

                bg-[#0d1117]

                shadow-xl
                shadow-black/10
            "
        >

            {/* =================================================
                TOP SKELETON
            ================================================== */}

            <div
                className="
                    flex
                    h-8
                    items-center
                    justify-between

                    border-b
                    border-white/[0.06]

                    px-3.5
                "
            >

                <div
                    className="
                        h-2
                        w-20

                        animate-pulse

                        rounded-full

                        bg-white/[0.06]
                    "
                />


                <div
                    className="
                        h-2
                        w-8

                        animate-pulse

                        rounded-full

                        bg-white/[0.04]
                    "
                />

            </div>


            {/* =================================================
                PROJECT SKELETON
            ================================================== */}

            <div
                className="
                    px-3.5
                    py-3
                "
            >

                <div
                    className="
                        flex
                        items-center

                        gap-3
                    "
                >

                    {/* IMAGE */}

                    <div
                        className="
                            h-11
                            w-11

                            flex-shrink-0

                            animate-pulse

                            rounded-xl

                            border
                            border-white/[0.06]

                            bg-white/[0.055]
                        "
                    />


                    {/* CONTENT */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        <div
                            className="
                                h-3
                                w-2/3

                                animate-pulse

                                rounded-full

                                bg-white/[0.07]
                            "
                        />


                        <div
                            className="
                                mt-2

                                h-2
                                w-20

                                animate-pulse

                                rounded-full

                                bg-white/[0.04]
                            "
                        />


                        <div
                            className="
                                mt-2

                                flex
                                items-center

                                gap-2
                            "
                        >

                            <div
                                className="
                                    h-2
                                    w-14

                                    animate-pulse

                                    rounded-full

                                    bg-white/[0.04]
                                "
                            />


                            <div
                                className="
                                    h-1
                                    w-1

                                    rounded-full

                                    bg-white/[0.05]
                                "
                            />


                            <div
                                className="
                                    h-2
                                    w-12

                                    animate-pulse

                                    rounded-full

                                    bg-white/[0.04]
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    STATS SKELETON
                ================================================== */}

                <div
                    className="
                        mt-2.5

                        flex
                        items-center
                        justify-between

                        border-t
                        border-white/[0.055]

                        pt-2.5
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
                                h-3
                                w-16

                                animate-pulse

                                rounded-full

                                bg-white/[0.05]
                            "
                        />


                        <div
                            className="
                                h-3
                                w-16

                                animate-pulse

                                rounded-full

                                bg-white/[0.05]
                            "
                        />

                    </div>


                    <div
                        className="
                            h-2
                            w-5

                            animate-pulse

                            rounded-full

                            bg-white/[0.035]
                        "
                    />

                </div>

            </div>

        </section>
    );
}
    // =====================================================
    // ERROR
    // =====================================================

    if (
        sidebarError
        &&
        projects.length ===
        0
    ) {

        return (

            <div
                className="
                    flex
                    items-center
                    justify-between

                    gap-3

                    rounded-2xl

                    border
                    border-red-400/20

                    bg-[#0d1117]

                    px-4
                    py-3
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <p
                        className="
                            text-[10px]
                            font-black

                            text-red-300
                        "
                    >
                        Promotion yuklanmadi
                    </p>


                    <p
                        className="
                            mt-0.5

                            truncate

                            text-[8px]

                            text-gray-600
                        "
                    >
                        {sidebarError}
                    </p>

                </div>


                <button
                    type="button"

                    onClick={
                        () => {

                            loadPromotions();
                        }
                    }

                    className="
                        grid
                        h-8
                        w-8
                        flex-shrink-0
                        place-items-center

                        rounded-lg

                        border
                        border-red-400/20

                        bg-red-500/10

                        text-red-300

                        transition-all

                        hover:bg-red-500/20
                    "
                >

                    <RefreshCw
                        size={12}
                    />

                </button>

            </div>
        );
    }


    if (
        !currentProject
    ) {

        return null;
    }


    // =====================================================
    // DATA
    // =====================================================

    const projectName =
        currentProject?.name
        ||
        "Untitled project";


    const username =
        currentProject
            ?.user
            ?.username

        ||

        "developer";


    const stars =
        formatCompactNumber(
            currentProject
                ?.stars_count
        );


    const views =
        formatCompactNumber(
            currentProject
                ?.views_count
        );


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            onMouseEnter={
                () => {

                    setIsHovered(
                        true
                    );
                }
            }

            onMouseLeave={
                () => {

                    setIsHovered(
                        false
                    );
                }
            }

            className="
                group/promo
                relative

                overflow-hidden

                rounded-2xl

                border
                border-white/10

                bg-[#0d1117]

                shadow-xl
                shadow-black/10

                transition-all
                duration-200

                hover:border-indigo-400/25
            "
        >

            {/* =================================================
                SUBTLE BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14

                    h-28
                    w-28

                    rounded-full

                    bg-indigo-500/[0.05]

                    blur-3xl
                "
            />


            {/* =================================================
                PROMOTION BAR
            ================================================== */}

            <div
                className="
                    relative

                    flex
                    h-8
                    items-center
                    justify-between

                    gap-2

                    border-b
                    border-white/[0.06]

                    px-3.5
                "
            >

                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >

                    <Megaphone
                        size={10}
                        strokeWidth={2.2}
                        className="
                            text-indigo-300
                        "
                    />


                    <span
                        className="
                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.17em]

                            text-indigo-300/70
                        "
                    >
                        promoted
                    </span>


                    <span
                        className="
                            h-1
                            w-1

                            rounded-full

                            bg-emerald-400

                            shadow-[0_0_7px_rgba(52,211,153,0.8)]
                        "
                    />

                </div>


                {projects.length >
                1 && (

                    <span
                        className="
                            font-mono

                            text-[8px]
                            font-black

                            text-gray-700
                        "
                    >
                        {
                            String(
                                currentIndex +
                                1
                            ).padStart(
                                2,
                                "0"
                            )
                        }

                        {" / "}

                        {
                            String(
                                projects.length
                            ).padStart(
                                2,
                                "0"
                            )
                        }
                    </span>
                )}

            </div>


            {/* =================================================
                PROJECT LINK
            ================================================== */}

            <Link
                to={
                    `/project/${currentProject.id}/detail`
                }

                className="
                    relative
                    block

                    px-3.5
                    py-3
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

                    {/* THUMBNAIL */}

                    <ProjectThumbnail
                        key={
                            currentProject.id
                        }

                        project={
                            currentProject
                        }
                    />


                    {/* PROJECT INFO */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between

                                gap-2
                            "
                        >

                            <h4
                                className="
                                    min-w-0
                                    flex-1

                                    truncate

                                    text-[13px]
                                    font-black

                                    text-white

                                    transition-colors

                                    group-hover/promo:text-indigo-300
                                "
                            >
                                {projectName}
                            </h4>


                            <ArrowUpRight
                                size={13}
                                strokeWidth={2}

                                className="
                                    flex-shrink-0

                                    text-gray-700

                                    transition-all
                                    duration-200

                                    group-hover/promo:-translate-y-0.5
                                    group-hover/promo:translate-x-0.5
                                    group-hover/promo:text-indigo-300
                                "
                            />

                        </div>


                        {/* USERNAME */}

                        <p
                            className="
                                mt-0.5

                                truncate

                                text-[9px]
                                font-bold

                                text-gray-600
                            "
                        >
                            @{username}
                        </p>


                        {/* STACK */}

                        {currentStack.length >
                        0 && (

                            <div
                                className="
                                    mt-1.5

                                    flex
                                    min-w-0
                                    items-center

                                    gap-1.5
                                "
                            >

                                {currentStack.map(
                                    (
                                        stack,
                                        index
                                    ) => (

                                        <React.Fragment
                                            key={
                                                `${stack}-${index}`
                                            }
                                        >

                                            <span
                                                className="
                                                    max-w-[95px]

                                                    truncate

                                                    text-[8px]
                                                    font-black

                                                    text-gray-500
                                                "
                                            >
                                                {stack}
                                            </span>


                                            {index <
                                            currentStack.length -
                                            1 && (

                                                <span
                                                    className="
                                                        text-[7px]

                                                        text-gray-800
                                                    "
                                                >
                                                    /
                                                </span>
                                            )}

                                        </React.Fragment>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>


                {/* =================================================
                    STARS + VIEWS
                ================================================== */}

                <div
                    className="
                        mt-2.5

                        flex
                        items-center
                        justify-between

                        gap-3

                        border-t
                        border-white/[0.055]

                        pt-2.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center

                            gap-4
                        "
                    >

                        {/* STAR */}

                        <span
                            className="
                                inline-flex
                                items-center

                                gap-1.5

                                text-[9px]
                                font-black

                                text-gray-300
                            "
                        >

                            <Star
                                size={11}
                                strokeWidth={2}
                                fill="currentColor"

                                className="
                                    text-yellow-300
                                "
                            />

                            {stars}

                            <span
                                className="
                                    font-mono

                                    text-[7px]
                                    font-bold

                                    uppercase

                                    text-gray-700
                                "
                            >
                                stars
                            </span>

                        </span>


                        {/* VIEW */}

                        <span
                            className="
                                inline-flex
                                items-center

                                gap-1.5

                                text-[9px]
                                font-black

                                text-gray-300
                            "
                        >

                            <Eye
                                size={11}
                                strokeWidth={2}

                                className="
                                    text-cyan-300
                                "
                            />

                            {views}

                            <span
                                className="
                                    font-mono

                                    text-[7px]
                                    font-bold

                                    uppercase

                                    text-gray-700
                                "
                            >
                                views
                            </span>

                        </span>

                    </div>


                    <span
                        className="
                            font-mono

                            text-[7px]
                            font-black

                            uppercase
                            tracking-[0.1em]

                            text-indigo-400/40
                        "
                    >
                        ad
                    </span>

                </div>

            </Link>


            {/* =================================================
                MULTIPLE PROMOTIONS NAVIGATION
            ================================================== */}

            {projects.length >
            1 && (

                <div
                    className="
                        relative

                        flex
                        h-8
                        items-center
                        justify-between

                        gap-2

                        border-t
                        border-white/[0.05]

                        px-3
                    "
                >

                    {/* DOTS */}

                    <div
                        className="
                            flex
                            items-center

                            gap-1
                        "
                    >

                        {projects.map(
                            (
                                project,
                                index
                            ) => {

                                const active =
                                    currentIndex ===
                                    index;


                                return (

                                    <button
                                        key={
                                            project.id
                                            ??
                                            index
                                        }

                                        type="button"

                                        onClick={
                                            () => {

                                                setCurrentIndex(
                                                    index
                                                );
                                            }
                                        }

                                        aria-label={
                                            `${index + 1}-reklama`
                                        }

                                        className={`
                                            h-1.5

                                            rounded-full

                                            transition-all
                                            duration-200

                                            ${
                                                active

                                                    ? (
                                                        "w-4 "
                                                        +
                                                        "bg-indigo-400"
                                                    )

                                                    : (
                                                        "w-1.5 "
                                                        +
                                                        "bg-white/10 "
                                                        +
                                                        "hover:bg-white/25"
                                                    )
                                            }
                                        `}
                                    />
                                );
                            }
                        )}

                    </div>


                    {/* BUTTONS */}

                    <div
                        className="
                            flex
                            items-center

                            gap-1
                        "
                    >

                        <button
                            type="button"

                            onClick={
                                handlePrevious
                            }

                            aria-label="Oldingi promotion"

                            className="
                                grid
                                h-6
                                w-6
                                place-items-center

                                rounded-md

                                text-gray-700

                                transition-all

                                hover:bg-white/[0.05]
                                hover:text-gray-400
                            "
                        >

                            <ArrowLeft
                                size={11}
                            />

                        </button>


                        <button
                            type="button"

                            onClick={
                                handleNext
                            }

                            aria-label="Keyingi promotion"

                            className="
                                grid
                                h-6
                                w-6
                                place-items-center

                                rounded-md

                                text-gray-700

                                transition-all

                                hover:bg-white/[0.05]
                                hover:text-gray-400
                            "
                        >

                            <ArrowRight
                                size={11}
                            />

                        </button>

                    </div>

                </div>
            )}

        </section>
    );
};


export default HomePromotionSpotlight;