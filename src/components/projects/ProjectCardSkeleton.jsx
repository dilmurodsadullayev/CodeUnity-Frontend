// src/components/projects/ProjectCardSkeleton.jsx

import React from "react";


const ProjectCardSkeleton = () => {

    return (

        <div
            className="
                overflow-hidden

                rounded-2xl

                border
                border-white/[0.07]

                bg-[#0d1117]

                shadow-lg
                shadow-black/10
            "
        >

            {/* =================================================
                TOP BAR
            ================================================== */}

            <div
                className="
                    flex
                    h-10

                    items-center
                    justify-between

                    border-b
                    border-white/[0.055]

                    px-4
                "
            >

                {/* LEFT */}

                <div
                    className="
                        flex
                        items-center

                        gap-2
                    "
                >

                    <div
                        className="
                            h-2
                            w-16

                            animate-pulse

                            rounded-full

                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            h-4
                            w-14

                            animate-pulse

                            rounded-full

                            bg-cyan-400/[0.04]
                        "
                    />

                </div>


                {/* RIGHT */}

                <div
                    className="
                        flex
                        items-center

                        gap-3
                    "
                >

                    <div
                        className="
                            h-2
                            w-7

                            animate-pulse

                            rounded-full

                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            h-2
                            w-7

                            animate-pulse

                            rounded-full

                            bg-white/[0.05]
                        "
                    />

                </div>

            </div>


            {/* =================================================
                IMAGE SKELETON
            ================================================== */}

            <div
                className="
                    relative

                    h-[170px]
                    w-full

                    overflow-hidden

                    border-b
                    border-white/[0.06]

                    bg-[#080b10]

                    md:h-[180px]
                "
            >

                <div
                    className="
                        absolute
                        inset-3

                        animate-pulse

                        rounded-xl

                        bg-white/[0.035]
                    "
                />


                <div
                    className="
                        pointer-events-none

                        absolute
                        inset-0

                        opacity-[0.09]

                        [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]

                        [background-size:20px_20px]
                    "
                />

            </div>


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    flex
                    min-h-[205px]
                    flex-col

                    p-4
                "
            >

                {/* =================================================
                    USER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between

                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center

                            gap-2
                        "
                    >

                        <div
                            className="
                                h-5
                                w-5

                                animate-pulse

                                rounded-full

                                bg-white/[0.06]
                            "
                        />


                        <div
                            className="
                                h-2
                                w-20

                                animate-pulse

                                rounded-full

                                bg-white/[0.05]
                            "
                        />

                    </div>


                    <div
                        className="
                            h-2
                            w-14

                            animate-pulse

                            rounded-full

                            bg-white/[0.035]
                        "
                    />

                </div>


                {/* =================================================
                    TITLE
                ================================================== */}

                <div
                    className="
                        mt-4

                        h-4
                        w-2/3

                        animate-pulse

                        rounded-full

                        bg-white/[0.07]
                    "
                />


                {/* =================================================
                    FEATURE
                ================================================== */}

                <div
                    className="
                        mt-3

                        h-2
                        w-1/2

                        animate-pulse

                        rounded-full

                        bg-violet-400/[0.045]
                    "
                />


                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <div
                    className="
                        mt-4

                        space-y-2
                    "
                >

                    <div
                        className="
                            h-2
                            w-full

                            animate-pulse

                            rounded-full

                            bg-white/[0.035]
                        "
                    />


                    <div
                        className="
                            h-2
                            w-4/5

                            animate-pulse

                            rounded-full

                            bg-white/[0.035]
                        "
                    />

                </div>


                {/* =================================================
                    BOTTOM
                ================================================== */}

                <div
                    className="
                        mt-auto
                        pt-4
                    "
                >

                    {/* STACK */}

                    <div
                        className="
                            flex
                            items-center

                            gap-2
                        "
                    >

                        <div
                            className="
                                h-6
                                w-16

                                animate-pulse

                                rounded-md

                                bg-white/[0.04]
                            "
                        />


                        <div
                            className="
                                h-6
                                w-20

                                animate-pulse

                                rounded-md

                                bg-white/[0.04]
                            "
                        />


                        <div
                            className="
                                h-6
                                w-14

                                animate-pulse

                                rounded-md

                                bg-white/[0.04]
                            "
                        />

                    </div>


                    {/* FOOTER */}

                    <div
                        className="
                            mt-3

                            flex
                            items-center
                            justify-between

                            border-t
                            border-white/[0.045]

                            pt-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-center

                                gap-4
                            "
                        >

                            <div
                                className="
                                    h-2
                                    w-14

                                    animate-pulse

                                    rounded-full

                                    bg-white/[0.03]
                                "
                            />


                            <div
                                className="
                                    h-2
                                    w-14

                                    animate-pulse

                                    rounded-full

                                    bg-white/[0.03]
                                "
                            />

                        </div>


                        <div
                            className="
                                h-2
                                w-10

                                animate-pulse

                                rounded-full

                                bg-emerald-400/[0.035]
                            "
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};


export default ProjectCardSkeleton;