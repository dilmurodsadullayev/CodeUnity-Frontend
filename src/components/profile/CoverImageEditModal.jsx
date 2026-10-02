// src/components/profile/CoverImageEditModal.jsx

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
} from "react-redux";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    AlertTriangle,
    Camera,
    FileImage,
    ImagePlus,
    Loader2,
    Save,
    UploadCloud,
    X,
} from "lucide-react";

import ProfileService from "../../services/profile";

import {
    getProfileSuccess,
} from "../../features/profile";

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// CONFIG
// =========================================================

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_IMAGE_SIZE =
    8 * 1024 * 1024;

// =========================================================
// FORMAT FILE SIZE
// =========================================================

const formatFileSize = (
    bytes
) => {
    const size =
        Number(bytes) || 0;

    if (
        size < 1024
    ) {
        return `${size} B`;
    }

    if (
        size <
        1024 * 1024
    ) {
        return `${
            (
                size /
                1024
            ).toFixed(1)
        } KB`;
    }

    return `${
        (
            size /
            1024 /
            1024
        ).toFixed(1)
    } MB`;
};

// =========================================================
// ERROR MESSAGE
// =========================================================

const getCoverErrorMessage = (
    error,
    fallback = "Fon rasmini saqlashda xatolik yuz berdi."
) => {
    const data =
        error?.serverData
        ||
        error?.response?.data;

    if (
        typeof data ===
            "string"
        &&
        data.trim()
    ) {
        return data.trim();
    }

    if (
        typeof data?.detail ===
            "string"
        &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        data?.cover_image
    ) {
        const value =
            Array.isArray(
                data.cover_image
            )
                ? data.cover_image[0]
                : data.cover_image;

        return String(
            value
        );
    }

    if (
        data
        &&
        typeof data ===
            "object"
    ) {
        const firstValue =
            Object.values(
                data
            )[0];

        if (
            Array.isArray(
                firstValue
            )
            &&
            firstValue.length > 0
        ) {
            return String(
                firstValue[0]
            );
        }

        if (
            typeof firstValue ===
                "string"
        ) {
            return firstValue;
        }
    }

    if (
        error?.message
    ) {
        return String(
            error.message
        );
    }

    return fallback;
};

// =========================================================
// COVER IMAGE EDIT MODAL
// =========================================================

const CoverImageEditModal = ({
    isOpen,
    onClose,
    currentCoverImage,
}) => {
    const dispatch =
        useDispatch();

    // =====================================================
    // FILE
    // =====================================================

    const [
        file,
        setFile,
    ] = useState(null);

    const [
        previewUrl,
        setPreviewUrl,
    ] = useState(
        currentCoverImage
        ||
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const fileInputRef =
        useRef(null);

    const localPreviewUrlRef =
        useRef(null);

    // =====================================================
    // CLEAN LOCAL PREVIEW
    // =====================================================

    const revokeLocalPreview =
        () => {
            if (
                localPreviewUrlRef.current
            ) {
                URL.revokeObjectURL(
                    localPreviewUrlRef.current
                );

                localPreviewUrlRef.current =
                    null;
            }
        };

    // =====================================================
    // RESET WHEN OPENED
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return;
            }

            revokeLocalPreview();

            setFile(
                null
            );

            setPreviewUrl(
                currentCoverImage
                ||
                null
            );

            setError(
                ""
            );

            if (
                fileInputRef.current
            ) {
                fileInputRef
                    .current
                    .value = "";
            }
        },
        [
            currentCoverImage,
            isOpen,
        ]
    );

    // =====================================================
    // CLEANUP ON UNMOUNT
    // =====================================================

    useEffect(
        () => {
            return () => {
                if (
                    localPreviewUrlRef.current
                ) {
                    URL.revokeObjectURL(
                        localPreviewUrlRef.current
                    );
                }
            };
        },
        []
    );

    // =====================================================
    // ESC + BODY LOCK
    // =====================================================

    useEffect(
        () => {
            if (
                !isOpen
            ) {
                return undefined;
            }

            const previousOverflow =
                document
                    .body
                    .style
                    .overflow;

            document
                .body
                .style
                .overflow =
                "hidden";

            const handleKeyDown = (
                event
            ) => {
                if (
                    event.key ===
                        "Escape"
                    &&
                    !loading
                ) {
                    onClose?.();
                }
            };

            window.addEventListener(
                "keydown",
                handleKeyDown
            );

            return () => {
                document
                    .body
                    .style
                    .overflow =
                    previousOverflow;

                window.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            };
        },
        [
            isOpen,
            loading,
            onClose,
        ]
    );

    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (
        event
    ) => {
        const selectedFile =
            event
                .target
                .files?.[0];

        if (
            !selectedFile
        ) {
            return;
        }

        setError(
            ""
        );

        // =============================================
        // MIME
        // =============================================

        if (
            !ALLOWED_IMAGE_TYPES
                .includes(
                    selectedFile.type
                )
        ) {
            const message =
                "Faqat JPG, PNG yoki WEBP rasm tanlash mumkin.";

            setError(
                message
            );

            siteToast.warning(
                message
            );

            event.target.value =
                "";

            return;
        }

        // =============================================
        // SIZE
        // =============================================

        if (
            selectedFile.size >
            MAX_IMAGE_SIZE
        ) {
            const message =
                `Rasm hajmi ${formatFileSize(
                    MAX_IMAGE_SIZE
                )} dan oshmasligi kerak.`;

            setError(
                message
            );

            siteToast.warning(
                message
            );

            event.target.value =
                "";

            return;
        }

        revokeLocalPreview();

        const localUrl =
            URL.createObjectURL(
                selectedFile
            );

        localPreviewUrlRef.current =
            localUrl;

        setFile(
            selectedFile
        );

        setPreviewUrl(
            localUrl
        );
    };

    // =====================================================
    // OPEN FILE PICKER
    // =====================================================

    const handleOpenFilePicker =
        () => {
            if (
                loading
            ) {
                return;
            }

            fileInputRef
                .current
                ?.click();
        };

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose =
        () => {
            if (
                loading
            ) {
                return;
            }

            revokeLocalPreview();

            setFile(
                null
            );

            setPreviewUrl(
                currentCoverImage
                ||
                null
            );

            setError(
                ""
            );

            if (
                fileInputRef.current
            ) {
                fileInputRef
                    .current
                    .value = "";
            }

            onClose?.();
        };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSave = async (
        event
    ) => {
        event.preventDefault();

        if (
            loading
        ) {
            return;
        }

        if (
            !file
        ) {
            const message =
                "Iltimos, yangi fon rasmini tanlang.";

            setError(
                message
            );

            siteToast.warning(
                message
            );

            return;
        }

        // =============================================
        // FINAL FILE VALIDATION
        // =============================================

        if (
            !ALLOWED_IMAGE_TYPES
                .includes(
                    file.type
                )
        ) {
            const message =
                "Tanlangan rasm formati noto‘g‘ri.";

            setError(
                message
            );

            siteToast.warning(
                message
            );

            return;
        }

        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {
            const message =
                `Rasm hajmi ${formatFileSize(
                    MAX_IMAGE_SIZE
                )} dan oshmasligi kerak.`;

            setError(
                message
            );

            siteToast.warning(
                message
            );

            return;
        }

        setLoading(
            true
        );

        setError(
            ""
        );

        const toastId =
            siteToast.loading(
                "Fon rasmi saqlanmoqda..."
            );

        try {
            // =========================================
            // FORM DATA
            // =========================================

            const formData =
                new FormData();

            formData.append(
                "cover_image",
                file
            );

            // =========================================
            // API
            // =========================================

            const response =
                await ProfileService
                    .updateCoverImage(
                        formData
                    );

            // =========================================
            // RESPONSE NORMALIZATION
            //
            // Backend:
            // { ...profile }
            //
            // yoki:
            // { profile: {...} }
            // =================================================

            const updatedProfile =
                response?.profile
                ||
                response?.data
                ||
                response;

            if (
                updatedProfile
                &&
                typeof updatedProfile ===
                    "object"
            ) {
                dispatch(
                    getProfileSuccess(
                        updatedProfile
                    )
                );
            }

            siteToast.update(
                toastId,
                "success",
                "Fon rasmi muvaffaqiyatli yangilandi."
            );

            revokeLocalPreview();

            setFile(
                null
            );

            setError(
                ""
            );

            if (
                fileInputRef.current
            ) {
                fileInputRef
                    .current
                    .value = "";
            }

            onClose?.();
        } catch (
            saveError
        ) {
            console.error(
                "Fon rasmini tahrirlashda xato:",
                saveError
            );

            const message =
                getCoverErrorMessage(
                    saveError
                );

            setError(
                message
            );

            siteToast.update(
                toastId,
                "error",
                message
            );
        } finally {
            setLoading(
                false
            );
        }
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                                event.currentTarget
                            &&
                            !loading
                        ) {
                            handleClose();
                        }
                    }}
                    className="
                        fixed
                        inset-0
                        z-[1000]
                        flex
                        items-center
                        justify-center
                        bg-black/80
                        p-4
                        font-sans
                        backdrop-blur-md
                        sm:p-6
                    "
                >
                    {/* =====================================
                        MODAL
                    ====================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 15,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cover-image-modal-title"
                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation();
                        }}
                        className="
                            relative
                            w-full
                            max-w-2xl
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-white/[0.08]
                            bg-[#090c12]/95
                            shadow-[0_35px_120px_rgba(0,0,0,0.65)]
                            backdrop-blur-2xl
                        "
                    >
                        {/* =================================
                            HEADER
                        ================================== */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                border-b
                                border-white/[0.06]
                                px-5
                                py-4
                                sm:px-6
                                sm:py-5
                            "
                        >
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
                                        grid
                                        h-11
                                        w-11
                                        shrink-0
                                        place-items-center
                                        rounded-2xl
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.07]
                                        text-indigo-300
                                    "
                                >
                                    <ImagePlus
                                        size={19}
                                    />
                                </div>

                                <div
                                    className="
                                        min-w-0
                                    "
                                >
                                    <h2
                                        id="cover-image-modal-title"
                                        className="
                                            truncate
                                            font-display
                                            text-lg
                                            font-semibold
                                            text-white
                                            sm:text-xl
                                        "
                                    >
                                        Fon rasmini tahrirlash
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            font-medium
                                            text-gray-600
                                            sm:text-xs
                                        "
                                    >
                                        Profilingiz uchun yangi cover rasm tanlang.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    loading
                                }
                                aria-label="Modalni yopish"
                                className="
                                    grid
                                    h-10
                                    w-10
                                    shrink-0
                                    place-items-center
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.025]
                                    text-gray-500
                                    transition
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <X
                                    size={18}
                                />
                            </button>
                        </div>

                        {/* =================================
                            FORM
                        ================================== */}

                        <form
                            onSubmit={
                                handleSave
                            }
                            className="
                                space-y-5
                                p-5
                                sm:p-6
                            "
                        >
                            {/* =============================
                                PREVIEW
                            ============================== */}

                            <div
                                className="
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/[0.07]
                                    bg-black/30
                                "
                            >
                                <div
                                    className="
                                        relative
                                        aspect-[16/6]
                                        min-h-[180px]
                                        w-full
                                        overflow-hidden
                                        bg-[#0d1119]
                                    "
                                >
                                    {previewUrl ? (
                                        <img
                                            src={
                                                previewUrl
                                            }
                                            alt="Fon rasmi oldindan ko‘rish"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-full
                                                min-h-[200px]
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-3
                                                text-gray-600
                                            "
                                        >
                                            <Camera
                                                size={30}
                                            />

                                            <p
                                                className="
                                                    font-display
                                                    text-xs
                                                    font-semibold
                                                "
                                            >
                                                Fon rasmi tanlanmagan
                                            </p>
                                        </div>
                                    )}

                                    {/* OVERLAY */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenFilePicker
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            absolute
                                            inset-0
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-2
                                            bg-black/0
                                            text-transparent
                                            transition-all
                                            duration-300
                                            hover:bg-black/55
                                            hover:text-white
                                            disabled:cursor-not-allowed
                                        "
                                    >
                                        <Camera
                                            size={24}
                                        />

                                        <span
                                            className="
                                                font-display
                                                text-xs
                                                font-semibold
                                            "
                                        >
                                            Yangi rasm tanlash
                                        </span>
                                    </button>

                                    {/* LOADING */}

                                    {loading && (
                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                grid
                                                place-items-center
                                                bg-black/65
                                                backdrop-blur-sm
                                            "
                                        >
                                            <div
                                                className="
                                                    text-center
                                                "
                                            >
                                                <Loader2
                                                    size={24}
                                                    className="
                                                        mx-auto
                                                        animate-spin
                                                        text-indigo-300
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-2
                                                        font-display
                                                        text-[9px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.1em]
                                                        text-indigo-200
                                                    "
                                                >
                                                    Yuklanmoqda
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* =========================
                                    FILE INFO
                                ========================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        border-t
                                        border-white/[0.05]
                                        px-4
                                        py-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >
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
                                                grid
                                                h-9
                                                w-9
                                                shrink-0
                                                place-items-center
                                                rounded-xl
                                                border
                                                border-white/[0.06]
                                                bg-white/[0.025]
                                                text-gray-500
                                            "
                                        >
                                            <FileImage
                                                size={15}
                                            />
                                        </div>

                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-gray-300
                                                "
                                            >
                                                {file
                                                    ? file.name
                                                    : "Joriy fon rasmi"}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[9px]
                                                    font-medium
                                                    text-gray-600
                                                "
                                            >
                                                {file
                                                    ? formatFileSize(
                                                        file.size
                                                    )
                                                    : "Yangi rasm tanlang"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenFilePicker
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            px-3
                                            py-2
                                            font-display
                                            text-[10px]
                                            font-semibold
                                            text-indigo-300
                                            transition
                                            hover:bg-indigo-500/[0.11]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        <UploadCloud
                                            size={14}
                                        />

                                        Rasm tanlash
                                    </button>
                                </div>
                            </div>

                            {/* =============================
                                HIDDEN INPUT
                            ============================== */}

                            <input
                                ref={
                                    fileInputRef
                                }
                                id="cover-upload"
                                type="file"
                                accept="
                                    image/jpeg,
                                    image/png,
                                    image/webp
                                "
                                onChange={
                                    handleFileChange
                                }
                                disabled={
                                    loading
                                }
                                className="hidden"
                            />

                            {/* =============================
                                INFO
                            ============================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.035]
                                    px-4
                                    py-3
                                "
                            >
                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        leading-5
                                        text-gray-500
                                    "
                                >
                                    JPG, PNG yoki WEBP format. Maksimal hajm{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-indigo-300
                                        "
                                    >
                                        {formatFileSize(
                                            MAX_IMAGE_SIZE
                                        )}
                                    </span>
                                    .
                                    Keng formatdagi rasm tavsiya qilinadi.
                                </p>
                            </div>

                            {/* =============================
                                ERROR
                            ============================== */}

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        role="alert"
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            rounded-2xl
                                            border
                                            border-red-400/15
                                            bg-red-500/[0.05]
                                            px-4
                                            py-3
                                            text-xs
                                            font-medium
                                            leading-5
                                            text-red-300
                                        "
                                    >
                                        <AlertTriangle
                                            size={17}
                                            className="
                                                mt-0.5
                                                shrink-0
                                            "
                                        />

                                        <span>
                                            {error}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* =============================
                                ACTIONS
                            ============================== */}

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    border-t
                                    border-white/[0.06]
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-5
                                        py-3
                                        font-display
                                        text-xs
                                        font-semibold
                                        text-gray-400
                                        transition
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Bekor qilish
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                        ||
                                        !file
                                    }
                                    className="
                                        inline-flex
                                        min-w-[145px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-600
                                        px-5
                                        py-3
                                        font-display
                                        text-xs
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-indigo-950/30
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:bg-indigo-500
                                        active:translate-y-0
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={15}
                                                className="
                                                    animate-spin
                                                "
                                            />

                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={15}
                                            />

                                            Saqlash
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* =================================
                            PROCESS BAR
                        ================================== */}

                        {loading && (
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-0
                                    top-0
                                    h-[2px]
                                    overflow-hidden
                                    bg-white/[0.04]
                                "
                            >
                                <motion.div
                                    initial={{
                                        x: "-100%",
                                    }}
                                    animate={{
                                        x: "350%",
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="
                                        h-full
                                        w-1/3
                                        bg-gradient-to-r
                                        from-transparent
                                        via-indigo-400
                                        to-transparent
                                    "
                                />
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default CoverImageEditModal;