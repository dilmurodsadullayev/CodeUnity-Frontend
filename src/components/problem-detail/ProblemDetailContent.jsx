// src/components/problem-detail/ProblemDetailContent.jsx

import React, {
    useState,
} from "react";

import {
    ArrowDown,
    ArrowUp,
    Check,
    Clipboard,
    Loader2,
    Sparkles,
    Star,
    Tags,
} from "lucide-react";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    ProblemDetailStackTag,
} from "./ProblemDetailHeader";


// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return fallback;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// PROBLEM DETAIL CONTENT
// =========================================================

const ProblemDetailContent = ({
    problemDetail,

    problemTechnologies = [],

    hasStarredProblem = false,

    isStarLoading = false,

    onAddStar,

    onRemoveStar,
}) => {

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        copied,
        setCopied,
    ] = useState(
        false
    );


    // =====================================================
    // SAFE DATA
    // =====================================================

    const problemId =
        problemDetail?.id
        ??
        null;


    const starCount =
        safeNumber(
            problemDetail?.star
        );


    const description =
        typeof problemDetail?.description ===
            "string"
            &&
            problemDetail.description.trim()
            ? problemDetail.description
            : "Muammo uchun tavsif mavjud emas.";


    const code =
        typeof problemDetail?.code ===
            "string"
            ? problemDetail.code
            : "";


    const technologies =
        Array.isArray(
            problemTechnologies
        )
            ? problemTechnologies
                .filter(
                    Boolean
                )
            : [];


    // =====================================================
    // COPY CODE
    // =====================================================

    const handleCopy =
        async () => {

            if (
                !code
            ) {

                siteToast.warning(
                    "Nusxalash uchun kod mavjud emas.",
                    {
                        title:
                            "Kod topilmadi",
                    }
                );


                return;
            }


            try {

                // =========================================
                // MODERN CLIPBOARD
                // =========================================

                if (
                    navigator
                        ?.clipboard
                        ?.writeText
                ) {

                    await navigator
                        .clipboard
                        .writeText(
                            code
                        );

                } else {

                    // =====================================
                    // LEGACY FALLBACK
                    // =====================================

                    const textarea =
                        document
                            .createElement(
                                "textarea"
                            );


                    textarea.value =
                        code;


                    textarea.style.position =
                        "fixed";


                    textarea.style.left =
                        "-9999px";


                    textarea.style.top =
                        "0";


                    textarea.setAttribute(
                        "readonly",
                        ""
                    );


                    document
                        .body
                        .appendChild(
                            textarea
                        );


                    textarea.select();


                    const success =
                        document.execCommand(
                            "copy"
                        );


                    textarea.remove();


                    if (
                        !success
                    ) {

                        throw new Error(
                            "Copy command failed."
                        );
                    }
                }


                // =========================================
                // SUCCESS
                // =========================================

                setCopied(
                    true
                );


                siteToast.success(
                    "Kod clipboardga nusxalandi.",
                    {
                        title:
                            "Nusxalandi",

                        duration:
                            2200,
                    }
                );


                window.setTimeout(
                    () => {

                        setCopied(
                            false
                        );
                    },
                    2000
                );

            } catch (
                error
            ) {

                console.error(
                    "Copy xato:",
                    error
                );


                siteToast.error(
                    "Kodni nusxalab bo‘lmadi.",
                    {
                        title:
                            "Nusxalash xatosi",
                    }
                );
            }
        };


    // =====================================================
    // ADD STAR
    // =====================================================

    const handleAddStar =
        () => {

            if (
                !problemId
                ||
                hasStarredProblem
                ||
                isStarLoading
            ) {
                return;
            }


            onAddStar?.(
                problemId
            );
        };


    // =====================================================
    // REMOVE STAR
    // =====================================================

    const handleRemoveStar =
        () => {

            if (
                !problemId
                ||
                !hasStarredProblem
                ||
                isStarLoading
            ) {
                return;
            }


            onRemoveStar?.(
                problemId
            );
        };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="
                flex
                gap-3

                md:gap-5
            "
        >

            {/* =============================================
                STAR SIDEBAR
            ============================================== */}

            <aside
                aria-label="Problem star boshqaruvi"

                className="
                    shrink-0
                "
            >

                <div
                    className="
                        sticky
                        top-28

                        flex
                        w-[58px]
                        flex-col
                        items-center

                        rounded-3xl

                        border
                        border-white/10

                        bg-[#111827]/90

                        p-2

                        shadow-xl
                        shadow-black/20

                        backdrop-blur-xl

                        sm:w-[70px]
                        sm:p-3
                    "
                >

                    {/* =====================================
                        ADD STAR
                    ====================================== */}

                    <button
                        type="button"

                        onClick={
                            handleAddStar
                        }

                        disabled={
                            hasStarredProblem
                            ||
                            isStarLoading
                            ||
                            !problemId
                        }

                        className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-2xl

                            border

                            transition-all
                            duration-200

                            sm:h-12
                            sm:w-12

                            ${
                                hasStarredProblem

                                    ? `
                                        cursor-not-allowed

                                        border-green-400/30

                                        bg-green-500/10

                                        text-green-300
                                    `

                                    : `
                                        border-green-400/20

                                        bg-green-500/10

                                        text-green-300

                                        hover:scale-105
                                        hover:bg-green-500/20

                                        active:scale-[0.95]
                                    `
                            }

                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        `}

                        title={
                            hasStarredProblem
                                ? "Siz allaqachon star bergansiz"
                                : "Star berish"
                        }

                        aria-label={
                            hasStarredProblem
                                ? "Star berilgan"
                                : "Muammoga star berish"
                        }
                    >

                        {isStarLoading ? (

                            <Loader2
                                size={18}

                                aria-hidden="true"

                                className="
                                    animate-spin
                                "
                            />

                        ) : (

                            <ArrowUp
                                size={20}
                                aria-hidden="true"
                            />
                        )}

                    </button>


                    {/* =====================================
                        STAR COUNT
                    ====================================== */}

                    <span
                        aria-label={
                            `${starCount} ta star`
                        }

                        className="
                            my-3

                            text-2xl
                            font-black
                            text-white

                            sm:text-3xl
                        "
                    >
                        {starCount}
                    </span>


                    {/* =====================================
                        REMOVE STAR
                    ====================================== */}

                    <button
                        type="button"

                        onClick={
                            handleRemoveStar
                        }

                        disabled={
                            !hasStarredProblem
                            ||
                            isStarLoading
                            ||
                            !problemId
                        }

                        className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-2xl

                            border

                            transition-all
                            duration-200

                            sm:h-12
                            sm:w-12

                            ${
                                hasStarredProblem

                                    ? `
                                        border-red-400/30

                                        bg-red-500/10

                                        text-red-300

                                        hover:scale-105
                                        hover:bg-red-500/20

                                        active:scale-[0.95]
                                    `

                                    : `
                                        cursor-not-allowed

                                        border-white/10

                                        bg-white/[0.035]

                                        text-gray-600
                                    `
                            }

                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        `}

                        title={
                            hasStarredProblem
                                ? "Starni olib tashlash"
                                : "Avval star bering"
                        }

                        aria-label={
                            hasStarredProblem
                                ? "Starni olib tashlash"
                                : "Star berilmagan"
                        }
                    >

                        {isStarLoading ? (

                            <Loader2
                                size={18}

                                aria-hidden="true"

                                className="
                                    animate-spin
                                "
                            />

                        ) : (

                            <ArrowDown
                                size={20}
                                aria-hidden="true"
                            />
                        )}

                    </button>


                    {/* =====================================
                        STAR STATE
                    ====================================== */}

                    <div
                        aria-hidden="true"

                        className={`
                            mt-3

                            flex
                            h-8
                            w-8
                            items-center
                            justify-center

                            rounded-xl

                            border

                            text-xs

                            sm:h-9
                            sm:w-9

                            ${
                                hasStarredProblem

                                    ? `
                                        border-yellow-400/30

                                        bg-yellow-400/10

                                        text-yellow-300
                                    `

                                    : `
                                        border-white/10

                                        bg-white/[0.035]

                                        text-gray-600
                                    `
                            }
                        `}
                    >

                        {hasStarredProblem ? (

                            <Check
                                size={14}
                            />

                        ) : (

                            <Star
                                size={14}
                            />
                        )}

                    </div>

                </div>

            </aside>


            {/* =============================================
                ARTICLE
            ============================================== */}

            <article
                className="
                    min-w-0
                    flex-1
                "
            >

                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <section
                    aria-labelledby="problem-description-title"

                    className="
                        rounded-3xl

                        border
                        border-white/10

                        bg-white/[0.035]

                        p-4

                        sm:p-5
                    "
                >

                    <h2
                        id="problem-description-title"

                        className="
                            mb-3

                            text-lg
                            font-black
                            text-white

                            sm:text-xl
                        "
                    >
                        Muammo tavsifi
                    </h2>


                    <p
                        className="
                            whitespace-pre-wrap
                            break-words

                            text-sm
                            leading-7
                            text-gray-300

                            sm:text-base

                            md:text-lg
                            md:leading-8
                        "
                    >
                        {description}
                    </p>


                    {/* =====================================
                        TECHNOLOGIES
                    ====================================== */}

                    {technologies.length > 0 && (

                        <div
                            className="
                                mt-5

                                border-t
                                border-white/[0.07]

                                pt-4
                            "
                        >

                            <div
                                className="
                                    mb-3

                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Tags
                                        size={13}

                                        aria-hidden="true"

                                        className="
                                            text-indigo-400
                                        "
                                    />


                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.18em]
                                            text-gray-600
                                        "
                                    >
                                        Teglar / Texnologiyalar
                                    </span>

                                </div>


                                <span
                                    className="
                                        rounded-full

                                        border
                                        border-white/[0.06]

                                        bg-white/[0.025]

                                        px-2
                                        py-0.5

                                        text-[8px]
                                        font-black
                                        text-gray-600
                                    "
                                >
                                    {technologies.length}
                                </span>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {technologies.map(
                                    (
                                        technology,
                                        index
                                    ) => (

                                        <ProblemDetailStackTag
                                            key={
                                                technology?.id
                                                ??
                                                technology?.name
                                                ??
                                                `technology-${index}`
                                            }

                                            item={
                                                technology
                                            }

                                            type="technology"
                                        />
                                    )
                                )}

                            </div>

                        </div>
                    )}

                </section>


                {/* =========================================
                    ERROR CODE
                ========================================== */}

                <section
                    aria-labelledby="problem-code-title"

                    className="
                        mt-6

                        overflow-hidden

                        rounded-3xl

                        border
                        border-white/10

                        bg-[#050816]

                        shadow-2xl
                        shadow-black/20
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            border-b
                            border-white/10

                            bg-white/[0.035]

                            px-4
                            py-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    font-black
                                    uppercase
                                    tracking-[0.2em]
                                    text-gray-500
                                "
                            >
                                Error Code
                            </p>


                            <h3
                                id="problem-code-title"

                                className="
                                    mt-0.5

                                    text-sm
                                    font-black
                                    text-white
                                "
                            >
                                ❌ Xatolik bo‘lgan kod
                            </h3>

                        </div>


                        {code && (

                            <button
                                type="button"

                                onClick={
                                    handleCopy
                                }

                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-xl

                                    border
                                    border-indigo-400/30

                                    bg-indigo-500/10

                                    px-4
                                    py-2

                                    text-xs
                                    font-black
                                    text-indigo-300

                                    transition-all
                                    duration-200

                                    hover:bg-indigo-500/20

                                    active:scale-[0.97]
                                "
                            >

                                {copied ? (

                                    <Check
                                        size={14}
                                        aria-hidden="true"
                                    />

                                ) : (

                                    <Clipboard
                                        size={14}
                                        aria-hidden="true"
                                    />
                                )}


                                {
                                    copied
                                        ? "Nusxalandi"
                                        : "Nusxalash"
                                }

                            </button>
                        )}

                    </div>


                    {code ? (

                        <pre
                            className="
                                max-h-[520px]

                                overflow-auto

                                bg-[#050816]

                                p-4

                                text-xs
                                leading-relaxed
                                text-gray-200

                                sm:p-5
                                sm:text-sm
                            "
                        >
                            <code>
                                {code}
                            </code>
                        </pre>

                    ) : (

                        <div
                            className="
                                p-6
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    italic
                                    text-gray-600
                                "
                            >
                                Kod mavjud emas.
                            </p>

                        </div>
                    )}

                </section>


                {/* =========================================
                    HINT
                ========================================== */}

                <aside
                    className="
                        mt-5

                        flex
                        items-start
                        gap-3

                        rounded-3xl

                        border
                        border-cyan-400/20

                        bg-cyan-400/10

                        p-4

                        sm:p-5
                    "
                >

                    <Sparkles
                        size={17}

                        aria-hidden="true"

                        className="
                            mt-0.5
                            shrink-0
                            text-yellow-300
                        "
                    />


                    <p
                        className="
                            text-sm
                            leading-6
                            text-cyan-100
                        "
                    >
                        Ushbu muammoni hal qilish uchun eng
                        to‘g‘ri yondashuv qanday? O‘z
                        yechimingizni pastda qoldiring.
                    </p>

                </aside>

            </article>

        </div>
    );
};


export default React.memo(
    ProblemDetailContent
);