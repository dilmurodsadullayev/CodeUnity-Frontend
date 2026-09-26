// src/components/my-problems/MyProblemCardSkeleton.jsx

import React from "react";


const MyProblemCardSkeleton = () => {

    return (

        <div
            className="
                h-full

                animate-pulse

                rounded-3xl

                border
                border-white/10

                bg-[#0d1117]

                p-5

                shadow-2xl
                shadow-black/20
            "
        >

            {/* TOP */}

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
                        h-6
                        w-24

                        rounded-full

                        bg-white/[0.06]
                    "
                />


                <div
                    className="
                        h-6
                        w-20

                        rounded-full

                        bg-white/[0.06]
                    "
                />

            </div>


            {/* USER */}

            <div
                className="
                    mt-4

                    flex
                    items-center

                    gap-3

                    rounded-2xl

                    border
                    border-white/[0.06]

                    bg-white/[0.025]

                    p-3
                "
            >

                <div
                    className="
                        h-12
                        w-12

                        shrink-0

                        rounded-2xl

                        bg-white/[0.07]
                    "
                />


                <div
                    className="
                        flex-1
                    "
                >

                    <div
                        className="
                            h-3
                            w-28

                            rounded-full

                            bg-white/[0.07]
                        "
                    />


                    <div
                        className="
                            mt-2

                            h-2
                            w-20

                            rounded-full

                            bg-white/[0.04]
                        "
                    />

                </div>


                <div
                    className="
                        h-10
                        w-10

                        rounded-2xl

                        bg-white/[0.04]
                    "
                />

            </div>


            {/* TITLE */}

            <div
                className="
                    mt-5

                    h-5
                    w-4/5

                    rounded-full

                    bg-white/[0.07]
                "
            />


            <div
                className="
                    mt-3

                    h-5
                    w-2/5

                    rounded-full

                    bg-white/[0.04]
                "
            />


            {/* LANGUAGES */}

            <div
                className="
                    mt-5

                    flex
                    gap-2
                "
            >

                <div
                    className="
                        h-6
                        w-16

                        rounded-full

                        bg-indigo-500/[0.08]
                    "
                />


                <div
                    className="
                        h-6
                        w-20

                        rounded-full

                        bg-indigo-500/[0.08]
                    "
                />

            </div>


            {/* SPACER */}

            <div
                className="
                    h-10
                "
            />


            {/* STATS */}

            <div
                className="
                    mt-4

                    grid
                    grid-cols-3

                    gap-3

                    border-t
                    border-white/10

                    pt-4
                "
            >

                {[0, 1, 2].map(
                    (
                        item
                    ) => (

                        <div
                            key={
                                item
                            }

                            className="
                                h-16

                                rounded-2xl

                                border
                                border-white/[0.06]

                                bg-white/[0.03]
                            "
                        />

                    )
                )}

            </div>


            {/* FOOTER */}

            <div
                className="
                    mt-4

                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        h-3
                        w-28

                        rounded-full

                        bg-white/[0.04]
                    "
                />


                <div
                    className="
                        h-8
                        w-20

                        rounded-2xl

                        bg-cyan-400/[0.06]
                    "
                />

            </div>

        </div>
    );
};


export default MyProblemCardSkeleton;