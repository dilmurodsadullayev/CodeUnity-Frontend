import React from "react";

import {
    BellOff,
    ChevronLeft,
    ChevronRight,
    Inbox,
} from "lucide-react";


// =========================================================
// PAGE NUMBERS
// =========================================================

const getPageNumbers = (
    currentPage,
    totalPages
) => {
    if (
        totalPages <=
        7
    ) {
        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
                index + 1
        );
    }


    const pages =
        [
            1,
        ];


    const start =
        Math.max(
            2,
            currentPage - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    if (
        start >
        2
    ) {
        pages.push(
            "left-ellipsis"
        );
    }


    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        pages.push(
            page
        );
    }


    if (
        end <
        totalPages - 1
    ) {
        pages.push(
            "right-ellipsis"
        );
    }


    pages.push(
        totalPages
    );


    return pages;
};


// =========================================================
// EMPTY STATE
// =========================================================

export const NotificationEmptyState = ({
    filter = "all",
    onShowAll,
}) => {
    const isFiltered =
        filter !==
        "all";


    return (
        <div
            className="
                rounded-3xl

                border
                border-white/[0.06]

                bg-[#0d121a]/75

                px-5
                py-16

                text-center

                shadow-2xl
                shadow-black/20
            "
        >

            <div
                className="
                    mx-auto

                    grid
                    h-20
                    w-20

                    place-items-center

                    rounded-3xl

                    border
                    border-white/[0.06]

                    bg-white/[0.025]

                    text-gray-700
                "
            >

                {isFiltered ? (

                    <Inbox
                        size={32}
                        strokeWidth={1.7}
                    />

                ) : (

                    <BellOff
                        size={32}
                        strokeWidth={1.7}
                    />

                )}

            </div>


            <h3
                className="
                    mt-5

                    text-xl
                    font-bold

                    text-white
                "
            >
                {filter ===
                    "unread"
                    ? "O‘qilmagan xabar yo‘q"
                    : filter ===
                        "read"
                        ? "O‘qilgan xabar yo‘q"
                        : "Bildirishnomalar mavjud emas"}
            </h3>


            <p
                className="
                    mx-auto
                    mt-2

                    max-w-md

                    text-sm
                    font-medium
                    leading-6

                    text-gray-600
                "
            >
                {isFiltered
                    ? "Bu filter bo‘yicha hozircha bildirishnoma topilmadi."
                    : "Yangi notificationlar kelganda ular shu yerda paydo bo‘ladi."}
            </p>


            {isFiltered && (

                <button
                    type="button"

                    onClick={
                        onShowAll
                    }

                    className="
                        mt-6

                        rounded-xl

                        border
                        border-indigo-400/15

                        bg-indigo-500/[0.07]

                        px-5
                        py-2.5

                        text-xs
                        font-bold

                        text-indigo-300

                        transition-all

                        hover:border-indigo-400/30
                        hover:bg-indigo-500/10
                        hover:text-indigo-200
                    "
                >
                    Hammasini ko‘rsatish
                </button>

            )}

        </div>
    );
};


// =========================================================
// LOADING
// =========================================================

export const NotificationLoadingState = ({
    count = 6,
}) => {
    const safeCount =
        Math.min(
            Math.max(
                Number(
                    count
                ) ||
                6,
                1
            ),
            10
        );


    return (
        <div
            className="
                space-y-4
            "
        >

            {Array
                .from({
                    length:
                        safeCount,
                })
                .map(
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
                            animate-pulse
                            gap-4

                            rounded-3xl

                            border
                            border-white/[0.05]

                            bg-[#0d121a]/65

                            p-5
                        "
                    >

                        <div
                            className="
                                h-14
                                w-14

                                flex-shrink-0

                                rounded-2xl

                                bg-white/[0.05]
                            "
                        />


                        <div
                            className="
                                flex-1
                                space-y-3
                                pt-1
                            "
                        >

                            <div
                                className="
                                    h-3
                                    w-24

                                    rounded-full

                                    bg-white/[0.055]
                                "
                            />


                            <div
                                className="
                                    h-4
                                    w-full

                                    rounded-full

                                    bg-white/[0.06]
                                "
                            />


                            <div
                                className="
                                    h-3
                                    w-2/3

                                    rounded-full

                                    bg-white/[0.04]
                                "
                            />

                        </div>

                    </div>

                )
            )}

        </div>
    );
};


// =========================================================
// PAGINATION
// =========================================================

const NotificationPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    perPage = 10,
    startItem = 0,
    endItem = 0,
    onPageChange,
    onPerPageChange,
}) => {
    const pages =
        getPageNumbers(
            currentPage,
            totalPages
        );


    if (
        totalItems ===
        0
    ) {
        return null;
    }


    return (
        <div
            className="
                mt-8

                flex
                flex-col

                gap-4

                rounded-2xl

                border
                border-white/[0.06]

                bg-[#0d121a]/70

                p-4

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            {/* =================================================
                INFO
            ================================================== */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center

                    gap-3
                "
            >

                <p
                    className="
                        text-xs
                        font-medium

                        text-gray-600
                    "
                >
                    <span
                        className="
                            font-mono
                            text-gray-400
                        "
                    >
                        {
                            startItem
                        }-{endItem}
                    </span>

                    {" "} / {" "}

                    <span
                        className="
                            font-mono
                            text-gray-400
                        "
                    >
                        {
                            totalItems
                        }
                    </span>
                </p>


                {/* PER PAGE */}

                <label
                    className="
                        flex
                        items-center
                        gap-2

                        text-[10px]
                        font-semibold

                        text-gray-600
                    "
                >
                    Sahifada

                    <select
                        value={
                            perPage
                        }

                        onChange={(event) =>
                            onPerPageChange?.(
                                Number(
                                    event.target.value
                                )
                            )
                        }

                        className="
                            rounded-lg

                            border
                            border-white/[0.07]

                            bg-[#080c12]

                            px-2
                            py-1.5

                            font-mono

                            text-[10px]

                            text-gray-300

                            outline-none

                            transition

                            focus:border-indigo-400/30
                        "
                    >
                        <option
                            value={5}
                        >
                            5
                        </option>

                        <option
                            value={10}
                        >
                            10
                        </option>

                        <option
                            value={20}
                        >
                            20
                        </option>

                        <option
                            value={50}
                        >
                            50
                        </option>
                    </select>

                </label>

            </div>


            {/* =================================================
                BUTTONS
            ================================================== */}

            <div
                className="
                    flex
                    items-center
                    gap-1.5
                "
            >

                {/* PREVIOUS */}

                <button
                    type="button"

                    disabled={
                        currentPage <=
                        1
                    }

                    onClick={() =>
                        onPageChange?.(
                            currentPage -
                            1
                        )
                    }

                    aria-label="Oldingi sahifa"

                    className="
                        grid
                        h-9
                        w-9

                        place-items-center

                        rounded-xl

                        border
                        border-white/[0.07]

                        bg-white/[0.025]

                        text-gray-500

                        transition-all

                        hover:border-indigo-400/20
                        hover:bg-indigo-500/[0.06]
                        hover:text-indigo-300

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >
                    <ChevronLeft
                        size={16}
                        strokeWidth={2}
                    />
                </button>


                {/* NUMBERS */}

                {pages.map(
                    (
                        page,
                        index
                    ) => {

                        if (
                            typeof page !==
                            "number"
                        ) {
                            return (
                                <span
                                    key={`${page}-${index}`}

                                    className="
                                        grid
                                        h-9
                                        min-w-8
                                        place-items-center

                                        text-xs

                                        text-gray-700
                                    "
                                >
                                    ...
                                </span>
                            );
                        }


                        const active =
                            page ===
                            currentPage;


                        return (
                            <button
                                key={
                                    page
                                }

                                type="button"

                                onClick={() =>
                                    onPageChange?.(
                                        page
                                    )
                                }

                                className={`
                                    grid

                                    h-9
                                    min-w-9

                                    place-items-center

                                    rounded-xl

                                    border

                                    px-2

                                    font-mono

                                    text-[10px]
                                    font-bold

                                    transition-all

                                    ${
                                        active
                                            ? `
                                                border-indigo-400/25
                                                bg-indigo-600
                                                text-white
                                                shadow-lg
                                                shadow-indigo-600/15
                                            `
                                            : `
                                                border-white/[0.07]
                                                bg-white/[0.025]
                                                text-gray-500
                                                hover:border-indigo-400/20
                                                hover:bg-indigo-500/[0.06]
                                                hover:text-indigo-300
                                            `
                                    }
                                `}
                            >
                                {
                                    page
                                }
                            </button>
                        );
                    }
                )}


                {/* NEXT */}

                <button
                    type="button"

                    disabled={
                        currentPage >=
                        totalPages
                    }

                    onClick={() =>
                        onPageChange?.(
                            currentPage +
                            1
                        )
                    }

                    aria-label="Keyingi sahifa"

                    className="
                        grid
                        h-9
                        w-9

                        place-items-center

                        rounded-xl

                        border
                        border-white/[0.07]

                        bg-white/[0.025]

                        text-gray-500

                        transition-all

                        hover:border-indigo-400/20
                        hover:bg-indigo-500/[0.06]
                        hover:text-indigo-300

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >
                    <ChevronRight
                        size={16}
                        strokeWidth={2}
                    />
                </button>

            </div>

        </div>
    );
};


export default NotificationPagination;