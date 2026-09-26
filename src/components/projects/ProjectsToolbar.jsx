// src/components/projects/ProjectsToolbar.jsx

import React from "react";

import {
    FolderKanban,
    Loader2,
} from "lucide-react";


const ProjectsToolbar = ({
    sectionRef,

    isLoading,

    count,

    rangeStart,

    rangeEnd,

    search,
}) => {

    return (

        <div
            ref={
                sectionRef
            }

            className="
                scroll-mt-24

                mt-6

                flex
                flex-col

                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            <div>

                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >

                    <FolderKanban
                        size={14}

                        className="
                            text-cyan-300/70
                        "
                    />


                    <h2
                        className="
                            text-sm
                            font-black

                            text-gray-200
                        "
                    >
                        Project Registry
                    </h2>


                    {isLoading && (

                        <Loader2
                            size={12}

                            className="
                                animate-spin

                                text-cyan-300/60
                            "
                        />

                    )}

                </div>


                <p
                    className="
                        mt-1

                        font-mono

                        text-[8px]
                        font-bold

                        uppercase
                        tracking-[0.12em]

                        text-gray-700
                    "
                >
                    {
                        count >
                        0

                            ? (
                                `${rangeStart}-${rangeEnd} / ${count}`
                            )

                            : "0 project"
                    }
                </p>

            </div>


            {search && (

                <div
                    className="
                        inline-flex
                        w-fit
                        items-center

                        gap-2

                        rounded-lg

                        border
                        border-white/[0.07]

                        bg-white/[0.025]

                        px-3
                        py-2

                        font-mono

                        text-[8px]
                        font-bold

                        text-gray-500
                    "
                >

                    search://

                    <span
                        className="
                            max-w-[180px]

                            truncate

                            text-cyan-300/70
                        "
                    >
                        {search}
                    </span>

                </div>

            )}

        </div>
    );
};


export default ProjectsToolbar;