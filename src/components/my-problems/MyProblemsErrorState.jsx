// src/components/my-problems/MyProblemsErrorState.jsx

import React from "react";


const MyProblemsErrorState = ({
    error,

    onRetry,

    isLoading = false,
}) => {

    if (
        !error
    ) {

        return null;
    }


    return (

        <div
            className="
                mb-8

                flex
                flex-col

                gap-4

                rounded-2xl

                border
                border-red-400/20

                bg-red-500/[0.06]

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
                        h-10
                        w-10

                        shrink-0
                        place-items-center

                        rounded-xl

                        border
                        border-red-400/20

                        bg-red-500/10

                        text-red-300
                    "
                >

                    <i
                        className="
                            fas
                            fa-triangle-exclamation
                        "
                    />

                </div>


                <div
                    className="
                        min-w-0
                    "
                >

                    <p
                        className="
                            text-sm
                            font-black

                            text-red-300
                        "
                    >
                        Ma’lumotlarni olib bo‘lmadi
                    </p>


                    <p
                        className="
                            mt-1

                            text-xs
                            leading-5

                            text-red-200/70
                        "
                    >
                        {error}
                    </p>

                </div>

            </div>


            <button
                type="button"

                disabled={
                    isLoading
                }

                onClick={
                    onRetry
                }

                className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center

                    gap-2

                    rounded-xl

                    border
                    border-red-400/20

                    bg-red-500/10

                    px-4
                    py-2.5

                    text-xs
                    font-black

                    text-red-300

                    transition-all

                    hover:bg-red-500/20

                    disabled:cursor-not-allowed

                    disabled:opacity-50
                "
            >

                <i
                    className={`
                        fas
                        fa-rotate-right

                        ${
                            isLoading
                                ? "animate-spin"
                                : ""
                        }
                    `}
                />

                Qayta urinish

            </button>

        </div>
    );
};


export default MyProblemsErrorState;