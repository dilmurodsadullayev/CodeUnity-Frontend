// src/components/profile/ProfileSkeleton.jsx

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
// PROFILE SKELETON
// =========================================================

const ProfileSkeleton = () => {
    return (
        <main
            aria-busy="true"
            aria-label="Profil yuklanmoqda"
            className="
                min-h-screen
                bg-[#06080d]
                px-3
                py-4
                font-sans
                sm:px-4
                md:px-6
                md:py-6
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                "
            >
                {/* =========================================
                    PROFILE HERO
                ========================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                    "
                >
                    {/* =====================================
                        COVER
                    ====================================== */}

                    <SkeletonBlock
                        className="
                            h-44
                            rounded-none
                            sm:h-52
                            md:h-72
                        "
                    />

                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <div
                        className="
                            relative
                            px-4
                            pb-5
                            sm:px-6
                        "
                    >
                        <div
                            className="
                                -mt-12
                                flex
                                items-end
                                gap-4
                                sm:-mt-16
                                sm:gap-5
                            "
                        >
                            {/* AVATAR */}

                            <SkeletonBlock
                                className="
                                    h-24
                                    w-24
                                    shrink-0
                                    rounded-full
                                    border-4
                                    border-[#0b0e14]
                                    sm:h-32
                                    sm:w-32
                                "
                            />

                            {/* USER META */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    space-y-3
                                    pb-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-7
                                        w-44
                                        sm:h-9
                                        sm:w-64
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-4
                                        w-36
                                        sm:w-52
                                    "
                                />

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-8
                                            w-20
                                            rounded-full
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-8
                                            w-24
                                            rounded-full
                                        "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            INFO PILLS
                        ================================== */}

                        <div
                            className="
                                mt-6
                                grid
                                gap-3
                                sm:grid-cols-2
                                xl:grid-cols-5
                            "
                        >
                            {Array.from({
                                length: 5,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="
                                            flex
                                            min-h-[78px]
                                            items-center
                                            gap-4
                                            rounded-2xl
                                            border
                                            border-white/[0.05]
                                            bg-white/[0.015]
                                            p-4
                                        "
                                    >
                                        <SkeletonBlock
                                            className="
                                                h-11
                                                w-11
                                                shrink-0
                                            "
                                        />

                                        <div
                                            className="
                                                flex-1
                                                space-y-2
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
                                                    h-4
                                                    w-24
                                                "
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* =====================================
                        STATS
                    ====================================== */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            border-t
                            border-white/[0.05]
                            md:grid-cols-5
                        "
                    >
                        {Array.from({
                            length: 5,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    className="
                                        flex
                                        min-h-[115px]
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2
                                        border-b
                                        border-r
                                        border-white/[0.05]
                                        p-4
                                        md:border-b-0
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-9
                                            w-9
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-3
                                            w-16
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-6
                                            w-10
                                        "
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* =========================================
                    BODY
                ========================================== */}

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        lg:grid-cols-[380px_1fr]
                    "
                >
                    {/* =====================================
                        SIDEBAR
                    ====================================== */}

                    <aside
                        className="
                            space-y-6
                        "
                    >
                        {/* PROFILE INFO */}

                        <section
                            className="
                                space-y-4
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.02]
                                p-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-11
                                        w-11
                                    "
                                />

                                <div
                                    className="
                                        flex-1
                                        space-y-2
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-5
                                            w-32
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-3
                                            w-44
                                        "
                                    />
                                </div>
                            </div>

                            {Array.from({
                                length: 6,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            py-2
                                        "
                                    >
                                        <SkeletonBlock
                                            className="
                                                h-8
                                                w-8
                                                shrink-0
                                            "
                                        />

                                        <div
                                            className="
                                                flex-1
                                                space-y-2
                                            "
                                        >
                                            <SkeletonBlock
                                                className="
                                                    h-2.5
                                                    w-20
                                                "
                                            />

                                            <SkeletonBlock
                                                className="
                                                    h-4
                                                    w-32
                                                "
                                            />
                                        </div>
                                    </div>
                                )
                            )}

                            <SkeletonBlock
                                className="
                                    mt-4
                                    h-32
                                    w-full
                                    rounded-2xl
                                "
                            />
                        </section>

                        {/* =================================
                            SKILLS
                        ================================== */}

                        <section
                            className="
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.02]
                                p-5
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
                                <SkeletonBlock
                                    className="
                                        h-6
                                        w-32
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-7
                                        w-12
                                        rounded-full
                                    "
                                />
                            </div>

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-20
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-24
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-16
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-28
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-20
                                        rounded-full
                                    "
                                />
                            </div>
                        </section>

                        {/* BADGES */}

                        <section
                            className="
                                rounded-3xl
                                border
                                border-white/[0.06]
                                bg-white/[0.02]
                                p-5
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-6
                                    w-28
                                "
                            />

                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-3
                                    gap-3
                                "
                            >
                                {Array.from({
                                    length: 3,
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
                                                h-20
                                                rounded-2xl
                                            "
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    </aside>

                    {/* =====================================
                        MAIN CONTENT
                    ====================================== */}

                    <section
                        className="
                            min-w-0
                        "
                    >
                        {/* TABS */}

                        <div
                            className="
                                flex
                                gap-4
                                overflow-hidden
                                border-b
                                border-white/[0.05]
                                pb-4
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-8
                                    w-24
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-8
                                    w-28
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-8
                                    w-24
                                "
                            />
                        </div>

                        {/* CARDS */}

                        <div
                            className="
                                mt-5
                                space-y-4
                            "
                        >
                            {Array.from({
                                length: 3,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="
                                            rounded-3xl
                                            border
                                            border-white/[0.06]
                                            bg-white/[0.02]
                                            p-5
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                            "
                                        >
                                            <SkeletonBlock
                                                className="
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                "
                                            />

                                            <div
                                                className="
                                                    flex-1
                                                "
                                            >
                                                <SkeletonBlock
                                                    className="
                                                        h-5
                                                        w-1/3
                                                    "
                                                />

                                                <SkeletonBlock
                                                    className="
                                                        mt-4
                                                        h-4
                                                        w-full
                                                    "
                                                />

                                                <SkeletonBlock
                                                    className="
                                                        mt-2
                                                        h-4
                                                        w-3/4
                                                    "
                                                />

                                                <div
                                                    className="
                                                        mt-5
                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >
                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-16
                                                            rounded-full
                                                        "
                                                    />

                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-20
                                                            rounded-full
                                                        "
                                                    />

                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-14
                                                            rounded-full
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProfileSkeleton;