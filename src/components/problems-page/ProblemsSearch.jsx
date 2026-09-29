// src/components/problems-page/ProblemsSearch.jsx

import React from "react";

import {
    Loader2,
    Search,
    X,
} from "lucide-react";


// =========================================================
// PROBLEMS SEARCH
// =========================================================

const ProblemsSearch = ({
    value = "",
    onChange,
    onClear,
    isLoading = false,
    placeholder = "Muammo, Python, React, Django...",
}) => {

    const hasValue =
        Boolean(
            String(
                value ?? ""
            ).trim()
        );


    return (

        <div
            className="
                group
                relative
                min-w-0
                flex-1
            "
        >

            {/* =============================================
                SEARCH ICON
            ============================================== */}

            <Search
                size={18}

                className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-600

                    transition-colors
                    duration-200

                    group-focus-within:text-cyan-400
                "
            />


            {/* =============================================
                INPUT
            ============================================== */}

            <input
                type="search"

                value={
                    value
                }

                onChange={(
                    event
                ) => {

                    onChange?.(
                        event.target.value
                    );
                }}

                placeholder={
                    placeholder
                }

                autoComplete="off"

                spellCheck="false"

                aria-label="Muammolarni qidirish"

                className="
                    h-12
                    w-full

                    rounded-2xl

                    border
                    border-white/[0.08]

                    bg-white/[0.035]

                    pl-11
                    pr-24

                    text-sm
                    font-medium
                    text-gray-100

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-gray-700

                    hover:border-white/[0.13]

                    focus:border-cyan-400/30
                    focus:bg-[#0d1320]

                    focus:ring-4
                    focus:ring-cyan-500/[0.06]

                    [&::-webkit-search-cancel-button]:hidden
                "
            />


            {/* =============================================
                RIGHT ACTIONS
            ============================================== */}

            <div
                className="
                    absolute
                    right-3
                    top-1/2

                    flex
                    -translate-y-1/2
                    items-center
                    gap-2
                "
            >

                {/* =========================================
                    LOADING
                ========================================== */}

                {isLoading && (

                    <Loader2
                        size={16}

                        className="
                            animate-spin
                            text-cyan-400
                        "
                    />
                )}


                {/* =========================================
                    CLEAR
                ========================================== */}

                {hasValue && (

                    <button
                        type="button"

                        onClick={() => {

                            onClear?.();
                        }}

                        aria-label="Qidiruvni tozalash"

                        title="Qidiruvni tozalash"

                        className="
                            grid
                            h-7
                            w-7
                            place-items-center

                            rounded-lg

                            border
                            border-white/[0.07]

                            bg-white/[0.03]

                            text-gray-600

                            transition-all
                            duration-200

                            hover:border-red-400/20
                            hover:bg-red-500/[0.07]
                            hover:text-red-300

                            active:scale-[0.94]
                        "
                    >
                        <X
                            size={14}
                        />
                    </button>
                )}
            </div>


            {/* =============================================
                FOCUS GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-6
                    -bottom-px

                    h-px

                    origin-center
                    scale-x-0

                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400/70
                    to-transparent

                    transition-transform
                    duration-300

                    group-focus-within:scale-x-100
                "
            />

        </div>
    );
};


export default React.memo(
    ProblemsSearch
);