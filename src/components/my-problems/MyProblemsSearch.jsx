// src/components/my-problems/MyProblemsSearch.jsx

import React from "react";


const MyProblemsSearch = ({
    value,

    onChange,

    onClear,

    isLoading = false,
}) => {

    return (

        <div
            className="
                mx-auto
                mb-10

                max-w-2xl

                animate-fade-in-up
            "
        >

            <div
                className="
                    group/search

                    relative

                    flex
                    h-12
                    items-center

                    overflow-hidden

                    rounded-2xl

                    border
                    border-white/10

                    bg-[#0d1117]

                    shadow-xl
                    shadow-black/10

                    transition-all

                    focus-within:border-purple-400/40

                    focus-within:ring-2
                    focus-within:ring-purple-500/[0.08]
                "
            >

                <div
                    className="
                        grid
                        h-full
                        w-12

                        shrink-0
                        place-items-center

                        text-gray-600

                        transition-colors

                        group-focus-within/search:text-purple-300
                    "
                >

                    {isLoading ? (

                        <i
                            className="
                                fas
                                fa-spinner

                                animate-spin
                            "
                        />

                    ) : (

                        <i
                            className="
                                fas
                                fa-search
                            "
                        />

                    )}

                </div>


                <input
                    type="text"

                    value={
                        value
                    }

                    onChange={
                        onChange
                    }

                    placeholder="Muammo nomi yoki tili bo‘yicha qidirish..."

                    className="
                        min-w-0
                        flex-1

                        bg-transparent

                        pr-3

                        text-sm
                        font-semibold

                        text-gray-200

                        outline-none

                        placeholder:text-gray-700
                    "
                />


                {value && (

                    <button
                        type="button"

                        onClick={
                            onClear
                        }

                        className="
                            mr-2

                            grid
                            h-8
                            w-8

                            shrink-0
                            place-items-center

                            rounded-xl

                            text-gray-600

                            transition-all

                            hover:bg-white/[0.05]

                            hover:text-gray-300
                        "
                    >

                        <i
                            className="
                                fas
                                fa-xmark
                            "
                        />

                    </button>

                )}

            </div>

        </div>
    );
};


export default MyProblemsSearch;