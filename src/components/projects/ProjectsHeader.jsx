// src/components/projects/ProjectsHeader.jsx

import React from "react";

import {
    Search,
    Sparkles,
    Terminal,
    X,
} from "lucide-react";


const ProjectsHeader = ({
    searchInputRef,
    searchTerm,
    onSearchChange,
    onClearSearch,
}) => {

    return (

        <section
            className="
                overflow-hidden

                rounded-3xl

                border
                border-white/[0.07]

                bg-[#0d1117]
            "
        >

            {/* =================================================
                TERMINAL BAR
            ================================================== */}

            <div
                className="
                    flex
                    min-h-10
                    items-center
                    justify-between

                    gap-4

                    border-b
                    border-white/[0.055]

                    px-4
                "
            >

                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >

                    <Terminal
                        size={11}

                        className="
                            text-cyan-300/70
                        "
                    />


                    <span
                        className="
                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.2em]

                            text-gray-600
                        "
                    >
                        fsociety://project_hub
                    </span>

                </div>


                <div
                    className="
                        flex
                        items-center

                        gap-2

                        font-mono

                        text-[8px]
                        font-black

                        uppercase
                        tracking-[0.14em]

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

                    live registry

                </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    grid
                    gap-8

                    p-5

                    md:p-7

                    lg:grid-cols-[1fr_430px]
                    lg:items-end

                    xl:p-8
                "
            >

                <div>

                    <div
                        className="
                            mb-3

                            inline-flex
                            items-center

                            gap-2

                            rounded-full

                            border
                            border-cyan-400/10

                            bg-cyan-500/[0.04]

                            px-2.5
                            py-1

                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.16em]

                            text-cyan-300/70
                        "
                    >

                        <Sparkles
                            size={10}
                        />

                        community builds

                    </div>


                    <h1
                        className="
                            max-w-2xl

                            text-3xl
                            font-black

                            tracking-[-0.04em]

                            text-gray-100

                            sm:text-4xl

                            lg:text-5xl
                        "
                    >
                        Koddan{" "}

                        <span
                            className="
                                text-cyan-300
                            "
                        >
                            real loyiha
                        </span>

                        {" "}yarating.
                    </h1>


                    <p
                        className="
                            mt-3

                            max-w-xl

                            text-[12px]
                            leading-6

                            text-gray-500
                        "
                    >
                        Community yaratgan projectlarni
                        ko‘ring, stacklarni o‘rganing va
                        boshqa developerlar bilan hamkorlik
                        qiling.
                    </p>

                </div>


                {/* =================================================
                    SEARCH
                ================================================== */}

                <div>

                    <label
                        className="
                            mb-2

                            block

                            font-mono

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.18em]

                            text-gray-700
                        "
                    >
                        project.search
                    </label>


                    <div
                        className="
                            group/search

                            flex
                            h-12
                            items-center

                            gap-3

                            rounded-xl

                            border
                            border-white/[0.08]

                            bg-[#090c11]

                            px-4

                            transition-all

                            focus-within:border-cyan-400/30
                            focus-within:ring-2
                            focus-within:ring-cyan-400/[0.04]
                        "
                    >

                        <Search
                            size={15}

                            className="
                                flex-shrink-0

                                text-gray-600

                                transition-colors

                                group-focus-within/search:text-cyan-300
                            "
                        />


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

                            placeholder="Project, stack yoki developer..."

                            className="
                                min-w-0
                                flex-1

                                bg-transparent

                                text-[12px]
                                font-medium

                                text-gray-200

                                outline-none

                                placeholder:text-gray-700
                            "
                        />


                        {searchTerm ? (

                            <button
                                type="button"

                                onClick={
                                    onClearSearch
                                }

                                className="
                                    grid
                                    h-7
                                    w-7
                                    place-items-center

                                    rounded-lg

                                    text-gray-600

                                    transition-all

                                    hover:bg-white/[0.05]
                                    hover:text-gray-300
                                "
                            >

                                <X
                                    size={13}
                                />

                            </button>

                        ) : (

                            <span
                                className="
                                    hidden

                                    rounded-md

                                    border
                                    border-white/[0.06]

                                    bg-white/[0.025]

                                    px-2
                                    py-1

                                    font-mono

                                    text-[7px]
                                    font-black

                                    text-gray-700

                                    sm:block
                                "
                            >
                                CTRL K
                            </span>

                        )}

                    </div>

                </div>

            </div>

        </section>
    );
};


export default ProjectsHeader;