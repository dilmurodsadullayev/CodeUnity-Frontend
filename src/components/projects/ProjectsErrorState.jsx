// src/components/projects/ProjectsErrorState.jsx

import React from "react";

import {
    AlertTriangle,
    ArrowRight,
} from "lucide-react";


const ProjectsErrorState = ({
    error,
    onRetry,
}) => {

    if (
        !error
    ) {

        return null;
    }


    return (

        <div
            className="
                mt-5

                flex
                flex-col

                gap-4

                rounded-2xl

                border
                border-red-400/15

                bg-red-500/[0.035]

                p-4

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            <div
                className="
                    flex
                    min-w-0
                    items-start

                    gap-3
                "
            >

                <div
                    className="
                        grid
                        h-9
                        w-9
                        flex-shrink-0
                        place-items-center

                        rounded-xl

                        border
                        border-red-400/15

                        bg-red-500/[0.06]

                        text-red-300
                    "
                >

                    <AlertTriangle
                        size={15}
                    />

                </div>


                <div
                    className="
                        min-w-0
                    "
                >

                    <p
                        className="
                            text-[11px]
                            font-black

                            text-red-300
                        "
                    >
                        Projectlarni olib bo‘lmadi
                    </p>


                    <p
                        className="
                            mt-1

                            text-[10px]
                            leading-5

                            text-red-200/60
                        "
                    >
                        {error}
                    </p>

                </div>

            </div>


            <button
                type="button"

                onClick={
                    onRetry
                }

                className="
                    inline-flex
                    items-center
                    justify-center

                    gap-2

                    rounded-xl

                    border
                    border-red-400/15

                    bg-red-500/[0.05]

                    px-4
                    py-2.5

                    text-[9px]
                    font-black

                    text-red-300

                    transition-all

                    hover:bg-red-500/[0.1]
                "
            >

                Qayta urinish

                <ArrowRight
                    size={12}
                />

            </button>

        </div>
    );
};


export default ProjectsErrorState;