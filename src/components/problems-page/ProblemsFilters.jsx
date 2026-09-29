// src/components/problems-page/ProblemsFilters.jsx

import React from "react";


// =========================================================
// FILTER SELECT
// =========================================================

const FilterSelect = ({
    label,
    value = "",
    onChange,
    children,
    disabled = false,
    isLoading = false,
}) => {

    return (

        <label
            className="
                block
                min-w-0
            "
        >

            {/* =============================================
                LABEL
            ============================================== */}

            <div
                className="
                    mb-1.5

                    flex
                    min-h-[16px]
                    items-center
                    justify-between
                    gap-2
                "
            >

                <span
                    className="
                        block

                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-600
                    "
                >
                    {label}
                </span>


                {isLoading && (

                    <span
                        className="
                            font-mono
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-cyan-400/50
                        "
                    >
                        loading
                    </span>
                )}

            </div>


            {/* =============================================
                SELECT
            ============================================== */}

            <select
                value={
                    String(
                        value ?? ""
                    )
                }

                onChange={(
                    event
                ) => {

                    onChange?.(
                        event.target.value
                    );
                }}

                disabled={
                    disabled
                    ||
                    isLoading
                }

                className="
                    h-11
                    w-full

                    cursor-pointer

                    rounded-xl

                    border
                    border-white/[0.08]

                    bg-[#0a0f18]

                    px-3

                    text-xs
                    font-bold
                    text-gray-300

                    outline-none

                    transition-all
                    duration-200

                    hover:border-white/[0.14]

                    focus:border-cyan-400/30

                    focus:ring-4
                    focus:ring-cyan-500/[0.06]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {children}
            </select>

        </label>
    );
};


// =========================================================
// PROBLEMS FILTERS
// =========================================================

const ProblemsFilters = ({
    status = "all",
    urgent = "all",

    language = "",
    technology = "",

    languages = [],
    technologies = [],

    languagesIsLoading = false,
    technologiesIsLoading = false,

    onStatusChange,
    onUrgentChange,
    onLanguageChange,
    onTechnologyChange,
}) => {

    // =====================================================
    // SAFE ARRAYS
    // =====================================================

    const safeLanguages =
        Array.isArray(
            languages
        )
            ? languages
            : [];


    const safeTechnologies =
        Array.isArray(
            technologies
        )
            ? technologies
            : [];


    // =====================================================
    // JSX
    //
    // "contents" sababli parent grid layout buzilmaydi.
    // Har bir select to‘g‘ridan-to‘g‘ri grid item bo‘ladi.
    // =====================================================

    return (

        <div
            className="
                contents
            "
        >

            {/* =============================================
                STATUS
            ============================================== */}

            <FilterSelect
                label="Holat"

                value={
                    status
                }

                onChange={
                    onStatusChange
                }
            >

                <option value="all">
                    Barcha holatlar
                </option>


                <option value="pending">
                    Jarayonda
                </option>


                <option value="solved">
                    Yechilgan
                </option>


                <option value="rejected">
                    Rad etilgan
                </option>

            </FilterSelect>


            {/* =============================================
                URGENT
            ============================================== */}

            <FilterSelect
                label="Turi"

                value={
                    urgent
                }

                onChange={
                    onUrgentChange
                }
            >

                <option value="all">
                    Barcha muammolar
                </option>


                <option value="true">
                    Faqat tezkor
                </option>


                <option value="false">
                    Oddiy muammolar
                </option>

            </FilterSelect>


            {/* =============================================
                LANGUAGE
            ============================================== */}

            <FilterSelect
                label="Dasturlash tili"

                value={
                    language
                }

                isLoading={
                    languagesIsLoading
                }

                onChange={
                    onLanguageChange
                }
            >

                <option value="">
                    Barcha tillar
                </option>


                {safeLanguages.map(
                    (
                        item
                    ) => {

                        if (
                            !item?.id
                        ) {
                            return null;
                        }


                        return (

                            <option
                                key={
                                    item.id
                                }

                                value={
                                    String(
                                        item.id
                                    )
                                }
                            >
                                {
                                    item.name
                                    ||
                                    `Til #${item.id}`
                                }
                            </option>
                        );
                    }
                )}

            </FilterSelect>


            {/* =============================================
                TECHNOLOGY
            ============================================== */}

            <FilterSelect
                label="Texnologiya"

                value={
                    technology
                }

                isLoading={
                    technologiesIsLoading
                }

                onChange={
                    onTechnologyChange
                }
            >

                <option value="">
                    Barcha texnologiyalar
                </option>


                {safeTechnologies.map(
                    (
                        item
                    ) => {

                        if (
                            !item?.id
                        ) {
                            return null;
                        }


                        return (

                            <option
                                key={
                                    item.id
                                }

                                value={
                                    String(
                                        item.id
                                    )
                                }
                            >
                                {
                                    item.name
                                    ||
                                    `Technology #${item.id}`
                                }
                            </option>
                        );
                    }
                )}

            </FilterSelect>

        </div>
    );
};


export default React.memo(
    ProblemsFilters
);