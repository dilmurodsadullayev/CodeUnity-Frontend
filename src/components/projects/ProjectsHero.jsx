// src/components/projects/ProjectsHero.jsx

import React from "react";

import {
    FolderKanban,
    Loader2,
    Search,
    Sparkles,
    Terminal,
    X,
} from "lucide-react";


// =========================================================
// PROJECTS HERO
// =========================================================

const ProjectsHero = ({

    searchTerm,

    searchInputRef,

    onSearchChange,

    onClearSearch,

    isLoading,

    count,

    activeSearch,

}) => {

    return (

        <header
            className="
                relative
                mb-10
                overflow-hidden
                rounded-[32px]
                border
                border-white/[0.06]
                bg-[#0b0f15]/85
                px-5
                py-8
                shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                backdrop-blur-xl

                sm:px-8
                sm:py-10

                lg:px-12
                lg:py-12
            "
        >

            {/* =================================================
                DECORATION
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    right-[-120px]
                    top-[-160px]
                    h-[360px]
                    w-[360px]
                    rounded-full
                    bg-indigo-500/[0.10]
                    blur-[100px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-[-180px]
                    left-[10%]
                    h-[300px]
                    w-[500px]
                    rounded-full
                    bg-purple-500/[0.06]
                    blur-[120px]
                "
            />


            {/* TERMINAL TOP BAR */}

            <div
                className="
                    relative
                    mb-8
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-white/[0.05]
                    pb-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-red-400/60
                        "
                    />

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-yellow-400/60
                        "
                    />

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-emerald-400/60
                        "
                    />

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-gray-700
                    "
                >

                    <Terminal
                        size={12}
                    />

                    fsociety://project-directory

                </div>

            </div>


            {/* =================================================
                HERO CONTENT
            ================================================== */}

            <div
                className="
                    relative
                    grid
                    gap-9

                    lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]
                    lg:items-end
                "
            >

                {/* LEFT */}

                <div>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-indigo-400/15
                            bg-indigo-500/[0.06]
                            px-3
                            py-1.5
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-indigo-300
                        "
                    >

                        <FolderKanban
                            size={13}
                        />

                        Community projects

                    </div>


                    <h1
                        className="
                            mt-5
                            max-w-4xl
                            text-4xl
                            font-black
                            leading-[0.95]
                            tracking-[-0.04em]
                            text-white

                            sm:text-5xl

                            lg:text-7xl
                        "
                    >

                        BUILD.

                        <br />

                        <span
                            className="
                                bg-gradient-to-r
                                from-indigo-300
                                via-purple-400
                                to-cyan-300
                                bg-clip-text
                                text-transparent
                            "
                        >
                            BREAK.
                        </span>

                        {" "}

                        SHARE.

                    </h1>


                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-sm
                            font-medium
                            leading-7
                            text-gray-500

                            sm:text-base
                        "
                    >
                        F.Society dasturchilari yaratgan real loyihalar,
                        tajribalar va texnologik g‘oyalarni bir joyda
                        kashf eting.
                    </p>


                    <div
                        className="
                            mt-6
                            flex
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
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-white/[0.025]
                                px-3
                                py-2
                                font-mono
                                text-[9px]
                                font-bold
                                text-gray-500
                            "
                        >

                            <Sparkles
                                size={12}
                                className="
                                    text-indigo-400
                                "
                            />

                            {count} projects indexed

                        </span>


                        <span
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
                                font-mono
                                text-[9px]
                                font-bold
                                text-emerald-400/60
                            "
                        >

                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-400
                                    shadow-[0_0_8px_rgba(52,211,153,0.7)]
                                "
                            />

                            directory online

                        </span>

                    </div>

                </div>


                {/* =================================================
                    SEARCH TERMINAL
                ================================================== */}

                <div
                    className="
                        relative
                    "
                >

                    <div
                        className="
                            absolute
                            -inset-1
                            rounded-[24px]
                            bg-gradient-to-r
                            from-indigo-500/30
                            via-purple-500/20
                            to-cyan-500/20
                            opacity-30
                            blur-xl
                        "
                    />


                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-white/[0.07]
                            bg-[#080b10]/95
                            shadow-2xl
                            shadow-black/30
                        "
                    >

                        {/* SEARCH HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-white/[0.05]
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-[9px]
                                    font-bold
                                    text-gray-600
                                "
                            >
                                root@fsociety:~$
                            </p>


                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-1
                                    rounded-lg
                                    border
                                    border-white/[0.05]
                                    bg-white/[0.025]
                                    px-2
                                    py-1
                                    font-mono
                                    text-[8px]
                                    font-bold
                                    text-gray-700

                                    sm:flex
                                "
                            >
                                CTRL
                                <span>+</span>
                                K
                            </div>

                        </div>


                        {/* INPUT */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-4
                            "
                        >

                            {isLoading ? (

                                <Loader2
                                    size={17}
                                    className="
                                        shrink-0
                                        animate-spin
                                        text-indigo-400
                                    "
                                />

                            ) : (

                                <Search
                                    size={17}
                                    className="
                                        shrink-0
                                        text-gray-600
                                    "
                                />
                            )}


                            <input
                                ref={
                                    searchInputRef
                                }

                                type="text"

                                value={
                                    searchTerm
                                }

                                onChange={
                                    onSearchChange
                                }

                                placeholder="search --project --developer --stack"

                                className="
                                    min-w-0
                                    flex-1
                                    border-none
                                    bg-transparent
                                    font-mono
                                    text-xs
                                    font-semibold
                                    text-white
                                    outline-none

                                    placeholder:text-gray-700

                                    focus:ring-0

                                    sm:text-sm
                                "
                            />


                            {searchTerm && (

                                <button
                                    type="button"

                                    onClick={
                                        onClearSearch
                                    }

                                    className="
                                        grid
                                        h-8
                                        w-8
                                        shrink-0
                                        place-items-center
                                        rounded-lg
                                        text-gray-600
                                        transition

                                        hover:bg-white/[0.05]
                                        hover:text-white
                                    "
                                >

                                    <X
                                        size={14}
                                    />

                                </button>
                            )}

                        </div>


                        {/* SEARCH STATUS */}

                        <div
                            className="
                                border-t
                                border-white/[0.04]
                                px-4
                                py-2.5
                            "
                        >

                            <p
                                className="
                                    truncate
                                    font-mono
                                    text-[8px]
                                    font-bold
                                    text-gray-700
                                "
                            >

                                {activeSearch

                                    ? `query="${activeSearch}" // ${count} result(s)`

                                    : `query="*" // ${count} project(s)`
                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
};


export default ProjectsHero;