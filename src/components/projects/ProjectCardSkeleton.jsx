// src/components/projects/ProjectCardSkeleton.jsx

import React from "react";


// =========================================================
// PROJECT CARD SKELETON
// =========================================================

const ProjectCardSkeleton = () => {

    return (

        <div
            className="
                overflow-hidden
                rounded-[28px]
                border
                border-white/[0.05]
                bg-[#0c1016]
            "
        >

            {/* TOP */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/[0.04]
                    px-4
                    py-3
                "
            >

                <div
                    className="
                        h-2
                        w-24
                        animate-pulse
                        rounded
                        bg-white/[0.05]
                    "
                />


                <div
                    className="
                        h-2
                        w-8
                        animate-pulse
                        rounded
                        bg-white/[0.04]
                    "
                />

            </div>


            {/* IMAGE */}

            <div
                className="
                    h-56
                    animate-pulse
                    bg-white/[0.045]
                "
            />


            {/* BODY */}

            <div
                className="
                    p-6
                "
            >

                <div
                    className="
                        h-2
                        w-20
                        animate-pulse
                        rounded
                        bg-white/[0.04]
                    "
                />


                <div
                    className="
                        mt-3
                        h-7
                        w-2/3
                        animate-pulse
                        rounded-lg
                        bg-white/[0.07]
                    "
                />


                <div
                    className="
                        mt-5
                        space-y-2
                    "
                >

                    <div
                        className="
                            h-3
                            w-full
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />


                    <div
                        className="
                            h-3
                            w-5/6
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />


                    <div
                        className="
                            h-3
                            w-2/3
                            animate-pulse
                            rounded
                            bg-white/[0.04]
                        "
                    />

                </div>


                <div
                    className="
                        mt-7
                        border-t
                        border-white/[0.05]
                        pt-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                h-10
                                w-10
                                animate-pulse
                                rounded-xl
                                bg-white/[0.06]
                            "
                        />


                        <div
                            className="
                                space-y-2
                            "
                        >

                            <div
                                className="
                                    h-3
                                    w-24
                                    animate-pulse
                                    rounded
                                    bg-white/[0.05]
                                "
                            />


                            <div
                                className="
                                    h-2
                                    w-16
                                    animate-pulse
                                    rounded
                                    bg-white/[0.035]
                                "
                            />

                        </div>

                    </div>


                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-2
                        "
                    >

                        <div
                            className="
                                h-9
                                animate-pulse
                                rounded-xl
                                bg-white/[0.035]
                            "
                        />


                        <div
                            className="
                                h-9
                                animate-pulse
                                rounded-xl
                                bg-white/[0.035]
                            "
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};


export default ProjectCardSkeleton;