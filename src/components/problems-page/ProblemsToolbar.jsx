// src/components/problems-page/ProblemsToolbar.jsx

import React, {
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Plus,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";

import ProblemsSearch
    from "./ProblemsSearch";

import ProblemsFilters
    from "./ProblemsFilters";

import ProblemsSort
    from "./ProblemsSort";


// =========================================================
// PROBLEMS TOOLBAR
// =========================================================

const ProblemsToolbar = ({
    // =====================================================
    // SEARCH
    // =====================================================

    searchValue = "",

    onSearchChange,
    onSearchClear,

    isSearching = false,


    // =====================================================
    // FILTER VALUES
    // =====================================================

    status = "all",
    urgent = "all",

    language = "",
    technology = "",

    ordering = "newest",


    // =====================================================
    // CATALOG DATA
    // =====================================================

    languages = [],
    technologies = [],

    languagesIsLoading = false,
    technologiesIsLoading = false,


    // =====================================================
    // FILTER HANDLERS
    // =====================================================

    onStatusChange,
    onUrgentChange,

    onLanguageChange,
    onTechnologyChange,

    onOrderingChange,


    // =====================================================
    // RESET
    // =====================================================

    hasActiveFilters = false,

    onResetFilters,


    // =====================================================
    // CREATE
    // =====================================================

    createHref = "/problem-create",
}) => {

    // =====================================================
    // FILTER VISIBILITY
    //
    // UI-only state.
    // URL/filter data parentda qoladi.
    // =====================================================

    const [
        showFilters,
        setShowFilters,
    ] = useState(
        true
    );


    // =====================================================
    // TOGGLE
    // =====================================================

    const handleToggleFilters =
        () => {

            setShowFilters(
                (
                    previous
                ) =>
                    !previous
            );
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="
                relative

                mx-auto
                my-10

                max-w-6xl
            "
        >

            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -inset-4

                    rounded-[2rem]

                    bg-gradient-to-r
                    from-indigo-500/10
                    via-purple-500/[0.04]
                    to-cyan-500/10

                    blur-2xl
                "
            />


            {/* =============================================
                PANEL
            ============================================== */}

            <div
                className="
                    relative
                    overflow-hidden

                    rounded-3xl

                    border
                    border-white/[0.08]

                    bg-[#090e18]/95

                    p-3

                    shadow-2xl
                    shadow-black/30

                    backdrop-blur-xl
                "
            >

                {/* =========================================
                    TOP ROW
                ========================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-3

                        lg:flex-row
                        lg:items-center
                    "
                >

                    {/* =====================================
                        SEARCH
                    ====================================== */}

                    <ProblemsSearch
                        value={
                            searchValue
                        }

                        onChange={
                            onSearchChange
                        }

                        onClear={
                            onSearchClear
                        }

                        isLoading={
                            isSearching
                        }
                    />


                    {/* =====================================
                        FILTER TOGGLE
                    ====================================== */}

                    <button
                        type="button"

                        onClick={
                            handleToggleFilters
                        }

                        aria-expanded={
                            showFilters
                        }

                        aria-controls="problem-filter-panel"

                        className={`
                            relative

                            inline-flex
                            h-12
                            shrink-0
                            items-center
                            justify-center
                            gap-2

                            rounded-2xl

                            border

                            px-4

                            text-xs
                            font-black

                            transition-all
                            duration-200

                            active:scale-[0.98]

                            ${
                                showFilters
                                    ? `
                                        border-indigo-400/25

                                        bg-indigo-500/[0.08]

                                        text-indigo-200
                                    `
                                    : `
                                        border-white/[0.08]

                                        bg-white/[0.035]

                                        text-gray-300

                                        hover:border-indigo-400/25
                                        hover:bg-indigo-500/[0.07]
                                        hover:text-indigo-200
                                    `
                            }
                        `}
                    >

                        <SlidersHorizontal
                            size={16}
                        />


                        <span>
                            Filtrlar
                        </span>


                        {/* ACTIVE INDICATOR */}

                        {hasActiveFilters && (

                            <span
                                aria-hidden="true"

                                className="
                                    h-1.5
                                    w-1.5

                                    rounded-full

                                    bg-cyan-400

                                    shadow-[0_0_8px_rgba(34,211,238,0.9)]
                                "
                            />
                        )}

                    </button>


                    {/* =====================================
                        CREATE
                    ====================================== */}

                    <Link
                        to={
                            createHref
                        }

                        className="
                            relative

                            inline-flex
                            h-12
                            shrink-0
                            items-center
                            justify-center
                            gap-2

                            overflow-hidden

                            rounded-2xl

                            border
                            border-indigo-400/30

                            bg-gradient-to-r
                            from-indigo-600
                            to-purple-600

                            px-5

                            text-sm
                            font-black
                            text-white

                            shadow-lg
                            shadow-indigo-950/30

                            transition-all
                            duration-300

                            hover:-translate-y-[1px]
                            hover:from-indigo-500
                            hover:to-purple-500

                            active:translate-y-0
                            active:scale-[0.98]
                        "
                    >

                        <Plus
                            size={17}
                        />

                        Yangi Muammo

                    </Link>

                </div>


                {/* =========================================
                    FILTER PANEL
                ========================================== */}

                {showFilters && (

                    <div
                        id="problem-filter-panel"

                        className="
                            mt-3

                            border-t
                            border-white/[0.07]

                            pt-3
                        "
                    >

                        {/* =================================
                            FILTER GRID
                        ================================== */}

                        <div
                            className="
                                grid
                                gap-3

                                sm:grid-cols-2

                                lg:grid-cols-5
                            "
                        >

                            <ProblemsFilters
                                status={
                                    status
                                }

                                urgent={
                                    urgent
                                }

                                language={
                                    language
                                }

                                technology={
                                    technology
                                }

                                languages={
                                    languages
                                }

                                technologies={
                                    technologies
                                }

                                languagesIsLoading={
                                    languagesIsLoading
                                }

                                technologiesIsLoading={
                                    technologiesIsLoading
                                }

                                onStatusChange={
                                    onStatusChange
                                }

                                onUrgentChange={
                                    onUrgentChange
                                }

                                onLanguageChange={
                                    onLanguageChange
                                }

                                onTechnologyChange={
                                    onTechnologyChange
                                }
                            />


                            <ProblemsSort
                                value={
                                    ordering
                                }

                                onChange={
                                    onOrderingChange
                                }
                            />

                        </div>


                        {/* =================================
                            FILTER FOOTER
                        ================================== */}

                        <div
                            className="
                                mt-3

                                flex
                                flex-col
                                gap-3

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    font-medium
                                    leading-5
                                    text-gray-700
                                "
                            >
                                Muammo nomi, foydalanuvchi,
                                dasturlash tili va texnologiya
                                bo‘yicha qidirish mumkin.
                            </p>


                            {/* RESET */}

                            {hasActiveFilters && (

                                <button
                                    type="button"

                                    onClick={
                                        onResetFilters
                                    }

                                    className="
                                        inline-flex
                                        shrink-0
                                        items-center
                                        justify-center
                                        gap-2

                                        self-start

                                        rounded-xl

                                        border
                                        border-white/[0.08]

                                        bg-white/[0.03]

                                        px-3
                                        py-2

                                        text-[11px]
                                        font-black
                                        text-gray-500

                                        transition-all
                                        duration-200

                                        hover:border-red-400/20
                                        hover:bg-red-500/[0.06]
                                        hover:text-red-300

                                        active:scale-[0.97]

                                        sm:self-auto
                                    "
                                >

                                    <RotateCcw
                                        size={13}
                                    />

                                    Filtrlarni tozalash

                                </button>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};


export default React.memo(
    ProblemsToolbar
);