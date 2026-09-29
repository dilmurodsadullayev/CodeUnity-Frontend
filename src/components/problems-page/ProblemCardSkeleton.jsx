// src/components/problems-page/ProblemCardSkeleton.jsx

import React from "react";


// =========================================================
// PROBLEM CARD SKELETON
// =========================================================

const ProblemCardSkeleton = () => {

    return (

        <div
            aria-hidden="true"

            className="
                h-full
                animate-pulse
                overflow-hidden

                rounded-3xl

                border
                border-white/[0.08]

                bg-[#0a0f18]

                p-5

                shadow-xl
                shadow-black/10
            "
        >

            {/* =============================================
                AUTHOR + STATUS
            ============================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                {/* AUTHOR */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-11
                            w-11
                            shrink-0

                            rounded-2xl

                            bg-white/[0.07]
                        "
                    />


                    <div
                        className="
                            min-w-0
                            space-y-2
                        "
                    >

                        <div
                            className="
                                h-3
                                w-28
                                max-w-full

                                rounded-full

                                bg-white/[0.07]
                            "
                        />


                        <div
                            className="
                                h-2.5
                                w-20

                                rounded-full

                                bg-white/[0.05]
                            "
                        />

                    </div>

                </div>


                {/* STATUS */}

                <div
                    className="
                        h-7
                        w-24
                        shrink-0

                        rounded-full

                        bg-white/[0.06]
                    "
                />

            </div>


            {/* =============================================
                TITLE
            ============================================== */}

            <div
                className="
                    mt-7
                    space-y-3
                "
            >

                <div
                    className="
                        h-5
                        w-4/5

                        rounded-lg

                        bg-white/[0.08]
                    "
                />


                <div
                    className="
                        h-5
                        w-2/3

                        rounded-lg

                        bg-white/[0.06]
                    "
                />

            </div>


            {/* =============================================
                LANGUAGES
            ============================================== */}

            <div
                className="
                    mt-7
                "
            >

                <div
                    className="
                        mb-2.5
                        h-2
                        w-16

                        rounded-full

                        bg-white/[0.05]
                    "
                />


                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    <div
                        className="
                            h-7
                            w-20

                            rounded-full

                            bg-white/[0.06]
                        "
                    />


                    <div
                        className="
                            h-7
                            w-24

                            rounded-full

                            bg-white/[0.06]
                        "
                    />

                </div>

            </div>


            {/* =============================================
                TECHNOLOGIES
            ============================================== */}

            <div
                className="
                    mt-4
                "
            >

                <div
                    className="
                        mb-2.5
                        h-2
                        w-20

                        rounded-full

                        bg-white/[0.05]
                    "
                />


                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    <div
                        className="
                            h-6
                            w-16

                            rounded-full

                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            h-6
                            w-20

                            rounded-full

                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            h-6
                            w-14

                            rounded-full

                            bg-white/[0.04]
                        "
                    />

                </div>

            </div>


            {/* =============================================
                META
            ============================================== */}

            <div
                className="
                    mt-7

                    flex
                    items-center
                    gap-2
                "
            >

                <div
                    className="
                        h-7
                        w-16

                        rounded-full

                        bg-white/[0.05]
                    "
                />


                <div
                    className="
                        h-7
                        w-16

                        rounded-full

                        bg-white/[0.05]
                    "
                />


                <div
                    className="
                        h-7
                        w-16

                        rounded-full

                        bg-white/[0.05]
                    "
                />

            </div>


            {/* =============================================
                FOOTER
            ============================================== */}

            <div
                className="
                    mt-6

                    border-t
                    border-white/[0.07]

                    pt-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className="
                            h-3
                            w-24

                            rounded-full

                            bg-white/[0.05]
                        "
                    />


                    <div
                        className="
                            h-9
                            w-28
                            shrink-0

                            rounded-xl

                            bg-white/[0.06]
                        "
                    />

                </div>

            </div>

        </div>
    );
};


export default React.memo(
    ProblemCardSkeleton
);