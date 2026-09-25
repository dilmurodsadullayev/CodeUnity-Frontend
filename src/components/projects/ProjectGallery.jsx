import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Check,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    Images,
    Sparkles,
} from "lucide-react";

import {
    BACKEND_URL,
} from "../../services/config";


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (
    image
) => {

    if (!image) {
        return "";
    }


    const value =
        String(
            image
        ).trim();


    if (!value) {
        return "";
    }


    if (
        /^https?:\/\//i.test(
            value
        )
        ||
        value.startsWith(
            "blob:"
        )
        ||
        value.startsWith(
            "data:"
        )
    ) {
        return value;
    }


    const baseUrl =
        String(
            BACKEND_URL
            ||
            ""
        ).replace(
            /\/+$/,
            ""
        );


    const path =
        value.startsWith("/")
            ? value
            : `/${value}`;


    return `${baseUrl}${path}`;
};


// =========================================================
// NORMALIZE GALLERY
// =========================================================

const normalizeGalleryImages = (
    images
) => {

    if (
        !Array.isArray(
            images
        )
    ) {
        return [];
    }


    return [...images]
        .filter(
            (
                image
            ) =>
                image?.image
        )
        .sort(
            (
                first,
                second
            ) => {

                // Cover birinchi.
                if (
                    Boolean(
                        first?.is_cover
                    )
                    !==
                    Boolean(
                        second?.is_cover
                    )
                ) {

                    return first?.is_cover
                        ? -1
                        : 1;
                }


                const firstOrder =
                    Number.isFinite(
                        Number(
                            first?.order
                        )
                    )
                        ? Number(
                            first.order
                        )
                        : 999;


                const secondOrder =
                    Number.isFinite(
                        Number(
                            second?.order
                        )
                    )
                        ? Number(
                            second.order
                        )
                        : 999;


                if (
                    firstOrder !==
                    secondOrder
                ) {

                    return (
                        firstOrder
                        -
                        secondOrder
                    );
                }


                return (
                    Number(
                        first?.id
                        ||
                        0
                    )
                    -
                    Number(
                        second?.id
                        ||
                        0
                    )
                );
            }
        );
};


// =========================================================
// PROJECT GALLERY
// =========================================================

const ProjectGallery = ({
    images = [],
    projectTitle = "Project",
}) => {

    // =====================================================
    // GALLERY IMAGES
    // =====================================================

    const galleryImages =
        useMemo(
            () => {

                return normalizeGalleryImages(
                    images
                );

            },
            [
                images,
            ]
        );


    // =====================================================
    // ACTIVE IMAGE
    // =====================================================

    const [
        activeIndex,
        setActiveIndex,
    ] = useState(
        0
    );


    const [
        mainImageFailed,
        setMainImageFailed,
    ] = useState(
        false
    );


    // =====================================================
    // INDEX SAFETY
    // =====================================================

    useEffect(
        () => {

            if (
                galleryImages.length ===
                0
            ) {

                setActiveIndex(
                    0
                );

                return;
            }


            setActiveIndex(
                (
                    current
                ) =>
                    Math.min(
                        current,
                        galleryImages.length -
                        1
                    )
            );

        },
        [
            galleryImages.length,
        ]
    );


    // =====================================================
    // ACTIVE DATA
    // =====================================================

    const activeImage =
        galleryImages[
            activeIndex
        ]
        ||
        null;


    const activeImageUrl =
        getImageUrl(
            activeImage?.image
        );


    const hasMultipleImages =
        galleryImages.length >
        1;


    // =====================================================
    // RESET ERROR
    // =====================================================

    useEffect(
        () => {

            setMainImageFailed(
                false
            );

        },
        [
            activeIndex,
            activeImageUrl,
        ]
    );


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious =
        () => {

            if (
                !hasMultipleImages
            ) {
                return;
            }


            setActiveIndex(
                (
                    current
                ) => {

                    if (
                        current ===
                        0
                    ) {

                        return (
                            galleryImages.length -
                            1
                        );
                    }


                    return (
                        current -
                        1
                    );
                }
            );
        };


    // =====================================================
    // NEXT
    // =====================================================

    const handleNext =
        () => {

            if (
                !hasMultipleImages
            ) {
                return;
            }


            setActiveIndex(
                (
                    current
                ) => {

                    if (
                        current ===
                        galleryImages.length -
                        1
                    ) {

                        return 0;
                    }


                    return (
                        current +
                        1
                    );
                }
            );
        };


    // =====================================================
    // KEYBOARD
    // =====================================================

    const handleKeyDown =
        (
            event
        ) => {

            if (
                !hasMultipleImages
            ) {
                return;
            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                handlePrevious();
            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                handleNext();
            }
        };


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        galleryImages.length ===
        0
    ) {

        return (

            <section
                className="
                    mt-8
                "
            >

                <div
                    className="
                        overflow-hidden
                        rounded-[26px]
                        border
                        border-white/[0.07]
                        bg-black/30
                        shadow-2xl
                        shadow-black/30
                    "
                >

                    <div
                        className="
                            flex
                            aspect-video
                            min-h-[240px]
                            items-center
                            justify-center
                            bg-gray-950/70
                        "
                    >

                        <div
                            className="
                                px-6
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    border
                                    border-white/[0.05]
                                    bg-white/[0.02]
                                "
                            >

                                <ImageIcon
                                    size={42}
                                    className="
                                        text-gray-800
                                    "
                                />

                            </div>


                            <p
                                className="
                                    mt-4
                                    text-sm
                                    font-black
                                    text-gray-600
                                "
                            >
                                Rasm mavjud emas
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-semibold
                                    text-gray-700
                                "
                            >
                                Loyiha uchun hali screenshot yuklanmagan.
                            </p>

                        </div>

                    </div>

                </div>

            </section>
        );
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section
            className="
                mt-8
                outline-none
            "

            tabIndex={0}

            onKeyDown={
                handleKeyDown
            }
        >

            {/* =================================================
                HEADER
            ================================================== */}

            {hasMultipleImages && (

                <div
                    className="
                        mb-3
                        flex
                        flex-wrap
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

                        <Images
                            size={15}
                            className="
                                text-indigo-300
                            "
                        />


                        <span
                            className="
                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.16em]
                                text-gray-600
                            "
                        >
                            Project gallery
                        </span>

                    </div>


                    <span
                        className="
                            rounded-full
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-3
                            py-1
                            font-mono
                            text-[9px]
                            font-black
                            text-gray-500
                        "
                    >
                        {galleryImages.length} ta rasm
                    </span>

                </div>
            )}


            {/* =================================================
                MAIN IMAGE
            ================================================== */}

            <div
                className="
                    group/gallery
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-white/[0.07]
                    bg-[#05070a]
                    shadow-2xl
                    shadow-black/30
                "
            >

                {/* BLURRED BACKGROUND */}

                {(
                    activeImageUrl
                    &&
                    !mainImageFailed
                ) && (

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            overflow-hidden
                        "
                    >

                        <img
                            src={
                                activeImageUrl
                            }

                            alt=""

                            aria-hidden="true"

                            className="
                                h-full
                                w-full
                                scale-110
                                object-cover
                                opacity-[0.13]
                                blur-3xl
                            "
                        />


                        <div
                            className="
                                absolute
                                inset-0
                                bg-black/55
                            "
                        />

                    </div>
                )}


                <div
                    className="
                        relative
                        aspect-video
                        min-h-[240px]
                        overflow-hidden

                        sm:min-h-[340px]

                        lg:min-h-[440px]
                    "
                >

                    {/* ACTIVE IMAGE */}

                    {(
                        activeImageUrl
                        &&
                        !mainImageFailed
                    ) ? (

                        <img
                            key={
                                activeImage?.id
                                ||
                                activeIndex
                            }

                            src={
                                activeImageUrl
                            }

                            alt={
                                activeImage?.title
                                ||
                                `${projectTitle} - ${activeIndex + 1}`
                            }

                            onError={() =>
                                setMainImageFailed(
                                    true
                                )
                            }

                            className="
                                relative
                                z-10
                                h-full
                                w-full
                                object-contain
                                transition-all
                                duration-500
                            "
                        />

                    ) : (

                        <div
                            className="
                                relative
                                z-10
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                bg-gray-950
                            "
                        >

                            <div
                                className="
                                    text-center
                                "
                            >

                                <ImageIcon
                                    size={54}
                                    className="
                                        mx-auto
                                        text-gray-800
                                    "
                                />


                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        font-black
                                        text-gray-600
                                    "
                                >
                                    Rasmni yuklab bo‘lmadi
                                </p>

                            </div>

                        </div>
                    )}


                    {/* TOP GRADIENT */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            top-0
                            z-20
                            h-24
                            bg-gradient-to-b
                            from-black/65
                            to-transparent
                        "
                    />


                    {/* BOTTOM GRADIENT */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            z-20
                            h-36
                            bg-gradient-to-t
                            from-black/85
                            via-black/30
                            to-transparent
                        "
                    />


                    {/* COVER */}

                    {(
                        activeImage?.is_cover
                        ||
                        activeIndex ===
                            0
                    ) && (

                        <div
                            className="
                                absolute
                                left-4
                                top-4
                                z-30
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-indigo-400/20
                                bg-black/55
                                px-3
                                py-2
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.16em]
                                text-indigo-200
                                backdrop-blur-xl
                            "
                        >

                            <Sparkles
                                size={12}
                            />

                            Asosiy rasm

                        </div>
                    )}


                    {/* COUNTER */}

                    <div
                        className="
                            absolute
                            right-4
                            top-4
                            z-30
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-white/[0.08]
                            bg-black/55
                            px-3
                            py-2
                            font-mono
                            text-[10px]
                            font-black
                            text-white
                            backdrop-blur-xl
                        "
                    >

                        <Images
                            size={12}
                            className="
                                text-indigo-300
                            "
                        />


                        {activeIndex + 1}


                        <span
                            className="
                                text-gray-600
                            "
                        >
                            /
                        </span>


                        {galleryImages.length}

                    </div>


                    {/* PREVIOUS / NEXT */}

                    {hasMultipleImages && (

                        <>

                            <button
                                type="button"

                                onClick={
                                    handlePrevious
                                }

                                aria-label="Oldingi rasm"

                                title="Oldingi rasm"

                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    z-30
                                    flex
                                    h-11
                                    w-11
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-white/[0.08]
                                    bg-black/55
                                    text-gray-300
                                    opacity-100
                                    shadow-xl
                                    shadow-black/30
                                    backdrop-blur-xl
                                    transition-all

                                    hover:border-indigo-400/30
                                    hover:bg-indigo-500/15
                                    hover:text-white

                                    active:scale-95

                                    sm:left-5
                                    sm:h-12
                                    sm:w-12

                                    lg:opacity-0
                                    lg:group-hover/gallery:opacity-100
                                "
                            >

                                <ChevronLeft
                                    size={23}
                                />

                            </button>


                            <button
                                type="button"

                                onClick={
                                    handleNext
                                }

                                aria-label="Keyingi rasm"

                                title="Keyingi rasm"

                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    z-30
                                    flex
                                    h-11
                                    w-11
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-white/[0.08]
                                    bg-black/55
                                    text-gray-300
                                    opacity-100
                                    shadow-xl
                                    shadow-black/30
                                    backdrop-blur-xl
                                    transition-all

                                    hover:border-indigo-400/30
                                    hover:bg-indigo-500/15
                                    hover:text-white

                                    active:scale-95

                                    sm:right-5
                                    sm:h-12
                                    sm:w-12

                                    lg:opacity-0
                                    lg:group-hover/gallery:opacity-100
                                "
                            >

                                <ChevronRight
                                    size={23}
                                />

                            </button>

                        </>
                    )}


                    {/* IMAGE TITLE */}

                    <div
                        className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            z-30
                            p-4

                            sm:p-5
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
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        font-mono
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-indigo-300/70
                                    "
                                >
                                    Screenshot{" "}

                                    {String(
                                        activeIndex +
                                        1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </p>


                                <h3
                                    className="
                                        mt-1
                                        truncate
                                        text-sm
                                        font-black
                                        text-white

                                        sm:text-base
                                    "
                                >
                                    {activeImage?.title
                                    ||
                                    `${projectTitle} — rasm ${activeIndex + 1}`}
                                </h3>

                            </div>


                            {hasMultipleImages && (

                                <p
                                    className="
                                        hidden
                                        shrink-0
                                        text-[9px]
                                        font-semibold
                                        text-gray-500

                                        md:block
                                    "
                                >
                                    ← → bilan almashtirish mumkin
                                </p>
                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                THUMBNAILS
            ================================================== */}

            {hasMultipleImages && (

                <div
                    className="
                        mt-4
                        overflow-x-auto
                        pb-2

                        [scrollbar-color:rgba(99,102,241,0.35)_transparent]
                        [scrollbar-width:thin]
                    "
                >

                    <div
                        className="
                            flex
                            min-w-max
                            gap-3
                        "
                    >

                        {galleryImages.map(
                            (
                                image,
                                index
                            ) => {

                                const isActive =
                                    activeIndex ===
                                    index;


                                const imageUrl =
                                    getImageUrl(
                                        image?.image
                                    );


                                return (

                                    <button
                                        key={
                                            image?.id
                                            ||
                                            index
                                        }

                                        type="button"

                                        onClick={() =>
                                            setActiveIndex(
                                                index
                                            )
                                        }

                                        title={
                                            image?.title
                                            ||
                                            `Rasm ${index + 1}`
                                        }

                                        className={`
                                            group/thumb
                                            relative
                                            w-[120px]
                                            shrink-0
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            bg-black/30
                                            text-left
                                            transition-all
                                            duration-200

                                            sm:w-[145px]

                                            ${
                                                isActive

                                                    ? `
                                                        border-indigo-400/60
                                                        opacity-100
                                                        shadow-lg
                                                        shadow-indigo-500/10
                                                        ring-2
                                                        ring-indigo-500/15
                                                    `

                                                    : `
                                                        border-white/[0.07]
                                                        opacity-55

                                                        hover:-translate-y-[1px]
                                                        hover:border-white/[0.15]
                                                        hover:opacity-100
                                                    `
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                relative
                                                aspect-video
                                                overflow-hidden
                                                bg-gray-950
                                            "
                                        >

                                            {imageUrl ? (

                                                <img
                                                    src={
                                                        imageUrl
                                                    }

                                                    alt={
                                                        image?.title
                                                        ||
                                                        `${projectTitle} ${index + 1}`
                                                    }

                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                        transition-transform
                                                        duration-300

                                                        group-hover/thumb:scale-105
                                                    "

                                                    onError={(
                                                        event
                                                    ) => {

                                                        event
                                                            .currentTarget
                                                            .style
                                                            .display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        flex
                                                        h-full
                                                        w-full
                                                        items-center
                                                        justify-center
                                                    "
                                                >

                                                    <ImageIcon
                                                        size={22}
                                                        className="
                                                            text-gray-800
                                                        "
                                                    />

                                                </div>
                                            )}


                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-0
                                                    bg-gradient-to-t
                                                    from-black/70
                                                    via-transparent
                                                    to-transparent
                                                "
                                            />


                                            <span
                                                className={`
                                                    absolute
                                                    left-2
                                                    top-2
                                                    flex
                                                    h-6
                                                    min-w-6
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    px-1.5
                                                    font-mono
                                                    text-[8px]
                                                    font-black
                                                    backdrop-blur

                                                    ${
                                                        isActive

                                                            ? `
                                                                border-indigo-400/30
                                                                bg-indigo-500/25
                                                                text-indigo-100
                                                            `

                                                            : `
                                                                border-white/[0.08]
                                                                bg-black/50
                                                                text-gray-400
                                                            `
                                                    }
                                                `}
                                            >
                                                {index + 1}
                                            </span>


                                            {(
                                                image?.is_cover
                                                ||
                                                index ===
                                                    0
                                            ) && (

                                                <span
                                                    className="
                                                        absolute
                                                        bottom-2
                                                        left-2
                                                        rounded-md
                                                        border
                                                        border-white/[0.07]
                                                        bg-black/60
                                                        px-1.5
                                                        py-0.5
                                                        text-[7px]
                                                        font-black
                                                        uppercase
                                                        tracking-wider
                                                        text-gray-300
                                                        backdrop-blur
                                                    "
                                                >
                                                    Asosiy
                                                </span>
                                            )}


                                            {isActive && (

                                                <span
                                                    className="
                                                        absolute
                                                        bottom-2
                                                        right-2
                                                        flex
                                                        h-5
                                                        w-5
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-indigo-500
                                                        text-white
                                                        shadow-lg
                                                        shadow-indigo-500/30
                                                    "
                                                >

                                                    <Check
                                                        size={11}
                                                    />

                                                </span>
                                            )}

                                        </div>


                                        <div
                                            className="
                                                px-3
                                                py-2.5
                                            "
                                        >

                                            <p
                                                className={`
                                                    truncate
                                                    text-[9px]
                                                    font-black

                                                    ${
                                                        isActive
                                                            ? "text-indigo-200"
                                                            : "text-gray-500"
                                                    }
                                                `}
                                            >
                                                {image?.title
                                                ||
                                                `Rasm ${index + 1}`}
                                            </p>

                                        </div>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>
            )}


            {/* =================================================
                DOTS
            ================================================== */}

            {hasMultipleImages && (

                <div
                    className="
                        mt-2
                        flex
                        items-center
                        justify-center
                        gap-1.5
                    "
                >

                    {galleryImages.map(
                        (
                            image,
                            index
                        ) => (

                            <button
                                key={
                                    `gallery-dot-${image?.id || index}`
                                }

                                type="button"

                                onClick={() =>
                                    setActiveIndex(
                                        index
                                    )
                                }

                                aria-label={
                                    `${index + 1}-rasmga o‘tish`
                                }

                                className={`
                                    h-1.5
                                    rounded-full
                                    transition-all
                                    duration-300

                                    ${
                                        activeIndex ===
                                        index

                                            ? `
                                                w-6
                                                bg-indigo-400
                                            `

                                            : `
                                                w-1.5
                                                bg-gray-700

                                                hover:bg-gray-500
                                            `
                                    }
                                `}
                            />
                        )
                    )}

                </div>
            )}

        </section>
    );
};


export default ProjectGallery;