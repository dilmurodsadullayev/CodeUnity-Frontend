// src/components/projects/ProjectsEmptyState.jsx

import React from "react";

import {
    FolderKanban,
    X,
} from "lucide-react";


const ProjectsEmptyState = ({
    hasSearch,
    onClearSearch,
}) => {

    return (

        <div
            className="
                col-span-full

                rounded-2xl

                border
                border-dashed
                border-white/[0.08]

                bg-[#0d1117]

                px-6
                py-16

                text-center
            "
        >

            <div
                className="
                    mx-auto

                    grid
                    h-12
                    w-12
                    place-items-center

                    rounded-2xl

                    border
                    border-cyan-400/10

                    bg-cyan-500/[0.04]

                    text-cyan-300/50
                "
            >

                <FolderKanban
                    size={21}
                    strokeWidth={1.7}
                />

            </div>


            <h3
                className="
                    mt-4

                    text-base
                    font-black

                    text-gray-200
                "
            >
                {
                    hasSearch
                        ? "Hech narsa topilmadi"
                        : "Projectlar hali yo‘q"
                }
            </h3>


            <p
                className="
                    mx-auto
                    mt-2

                    max-w-sm

                    text-[11px]
                    leading-6

                    text-gray-600
                "
            >
                {
                    hasSearch

                        ? (
                            "Qidiruvga mos loyiha topilmadi. "
                            +
                            "Boshqa so‘z bilan urinib ko‘ring."
                        )

                        : (
                            "Community projectlari shu yerda "
                            +
                            "paydo bo‘ladi."
                        )
                }
            </p>


            {hasSearch && (

                <button
                    type="button"

                    onClick={
                        onClearSearch
                    }

                    className="
                        mt-5

                        inline-flex
                        items-center

                        gap-2

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.025]

                        px-4
                        py-2.5

                        text-[10px]
                        font-black

                        text-gray-400

                        transition-all

                        hover:border-cyan-400/20
                        hover:text-cyan-300
                    "
                >

                    <X
                        size={13}
                    />

                    Qidiruvni tozalash

                </button>

            )}

        </div>
    );
};


export default ProjectsEmptyState;