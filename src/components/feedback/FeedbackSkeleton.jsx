// src/components/feedback/FeedbackSkeleton.jsx

import React from "react";


// =========================================================
// SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => {
    return (
        <div
            aria-hidden="true"
            className={`
                animate-pulse
                rounded-xl
                bg-white/[0.055]
                ${className}
            `}
        />
    );
};


// =========================================================
// FEEDBACK CARD SKELETON
// =========================================================

const FeedbackCardSkeleton = () => {
    return (
        <div
            aria-hidden="true"
            className="
                overflow-hidden
                rounded-[24px]
                border
                border-white/[0.06]
                bg-white/[0.022]
                p-5
                sm:p-6
            "
        >
            {/* BADGES + DATE */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    <SkeletonBlock
                        className="
                            h-6
                            w-20
                            rounded-full
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-6
                            w-24
                            rounded-full
                        "
                    />
                </div>

                <SkeletonBlock
                    className="
                        h-3
                        w-20
                    "
                />
            </div>

            {/* TITLE */}

            <SkeletonBlock
                className="
                    mt-4
                    h-5
                    w-2/3
                "
            />

            {/* TEXT */}

            <div
                className="
                    mt-5
                    space-y-2.5
                "
            >
                <SkeletonBlock
                    className="
                        h-3
                        w-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-3
                        w-[92%]
                    "
                />

                <SkeletonBlock
                    className="
                        h-3
                        w-3/4
                    "
                />
            </div>

            {/* OPTIONAL IMAGE SHAPE */}

            <SkeletonBlock
                className="
                    mt-5
                    h-36
                    w-full
                    rounded-2xl
                "
            />

            {/* FOOTER */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-white/[0.05]
                    pt-4
                "
            >
                <SkeletonBlock
                    className="
                        h-3
                        w-24
                    "
                />

                <div
                    className="
                        flex
                        gap-2
                    "
                >
                    <SkeletonBlock
                        className="
                            h-8
                            w-20
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-8
                            w-20
                        "
                    />
                </div>
            </div>
        </div>
    );
};


// =========================================================
// FEEDBACK LIST SKELETON
// =========================================================

export const FeedbackListSkeleton = ({
    count = 4,
}) => {
    return (
        <div
            aria-busy="true"
            aria-label="Feedbacklar yuklanmoqda"
            className="
                grid
                grid-cols-1
                gap-4
                lg:grid-cols-2
            "
        >
            {Array.from({
                length: count,
            }).map(
                (
                    _,
                    index
                ) => (
                    <FeedbackCardSkeleton
                        key={
                            index
                        }
                    />
                )
            )}
        </div>
    );
};


// =========================================================
// STAT SKELETON
// =========================================================

const StatSkeleton = () => {
    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-5
            "
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex-1
                        space-y-3
                    "
                >
                    <SkeletonBlock
                        className="
                            h-2.5
                            w-16
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-7
                            w-14
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-2.5
                            w-24
                        "
                    />
                </div>

                <SkeletonBlock
                    className="
                        h-10
                        w-10
                        shrink-0
                    "
                />
            </div>
        </div>
    );
};


// =========================================================
// FEEDBACK PAGE SKELETON
// =========================================================

const FeedbackSkeleton = ({
    showPrivate = false,
}) => {
    return (
        <main
            aria-busy="true"
            aria-label="Feedback sahifasi yuklanmoqda"
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#06080d]
                pb-24
                font-sans
            "
        >
            {/* BACKGROUND */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-[500px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/[0.06]
                    blur-[140px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-7xl
                    px-4
                    py-10
                    sm:px-6
                    lg:px-8
                "
            >
                {/* =====================================
                    HERO
                ====================================== */}

                <section
                    className="
                        rounded-[32px]
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        px-6
                        py-8
                        sm:px-8
                        sm:py-10
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-8
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div
                            className="
                                w-full
                                max-w-3xl
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-7
                                    w-44
                                    rounded-full
                                "
                            />

                            <SkeletonBlock
                                className="
                                    mt-5
                                    h-10
                                    w-[80%]
                                    max-w-xl
                                "
                            />

                            <SkeletonBlock
                                className="
                                    mt-3
                                    h-10
                                    w-[55%]
                                    max-w-md
                                "
                            />

                            <div
                                className="
                                    mt-5
                                    space-y-2.5
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-3
                                        w-full
                                        max-w-2xl
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-3
                                        w-[88%]
                                        max-w-xl
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-3
                                        w-[66%]
                                        max-w-lg
                                    "
                                />
                            </div>
                        </div>

                        <div
                            className="
                                flex
                                gap-3
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-11
                                    w-28
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-11
                                    w-40
                                "
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================
                    PRIVATE STATS
                ====================================== */}

                {showPrivate && (
                    <section
                        className="
                            mt-8
                        "
                    >
                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                justify-between
                            "
                        >
                            <div
                                className="
                                    space-y-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-5
                                        w-40
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-3
                                        w-56
                                    "
                                />
                            </div>

                            <SkeletonBlock
                                className="
                                    h-7
                                    w-7
                                "
                            />
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-3
                                md:grid-cols-3
                                xl:grid-cols-6
                            "
                        >
                            {Array.from({
                                length: 6,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <StatSkeleton
                                        key={
                                            index
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* =====================================
                    MY FEEDBACKS
                ====================================== */}

                {showPrivate && (
                    <section
                        className="
                            mt-12
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    space-y-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-6
                                        w-48
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-3
                                        w-72
                                        max-w-full
                                    "
                                />
                            </div>

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
                                {Array.from({
                                    length: 4,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <SkeletonBlock
                                            key={
                                                index
                                            }
                                            className="
                                                h-9
                                                w-20
                                            "
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        <div
                            className="
                                mt-5
                            "
                        >
                            <FeedbackListSkeleton
                                count={4}
                            />
                        </div>
                    </section>
                )}

                {/* =====================================
                    COMMUNITY
                ====================================== */}

                <section
                    className="
                        mt-14
                    "
                >
                    <div
                        className="
                            flex
                            items-end
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                space-y-2
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-6
                                    w-60
                                    max-w-full
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-3
                                    w-72
                                    max-w-full
                                "
                            />
                        </div>

                        <SkeletonBlock
                            className="
                                h-7
                                w-14
                                rounded-full
                            "
                        />
                    </div>

                    <div
                        className="
                            mt-5
                        "
                    >
                        <FeedbackListSkeleton
                            count={4}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default FeedbackSkeleton;