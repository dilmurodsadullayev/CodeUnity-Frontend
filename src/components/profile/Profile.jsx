// src/components/profile/Profile.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useParams,
} from "react-router-dom";

import {
    AlertCircle,
    Loader2,
    RefreshCcw,
} from "lucide-react";

// =========================================================
// REDUX
// =========================================================

import {
    getProfileFailure,
    getProfileStart,
    getProfileSuccess,
} from "../../features/profile";

import {
    getTelegramProfileFailure,
    getTelegramProfileStart,
    getTelegramProfileSuccess,
} from "../../features/bot";

// =========================================================
// SERVICES
// =========================================================

import ProfileService from "../../services/profile";
import BotService from "../../services/bot";

// =========================================================
// UTILS
// =========================================================

import {
    getBirthdayStatus,
} from "../../utils/formatDate";

// =========================================================
// PROFILE COMPONENTS
// =========================================================

import EditProfileModal from "./EditProfileModal";
import CoverImageEditModal from "./CoverImageEditModal";

import ProfileHero from "./ProfileHero";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";
import ProfileSkeleton from "./ProfileSkeleton";

// =========================================================
// GLOBAL UI
// =========================================================

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// HELPERS
// =========================================================

import {
    buildProfileViewModel,
} from "./profileHelpers";

// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    const data =
        error?.serverData
        ||
        error?.response?.data;

    // =====================================================
    // STRING
    // =====================================================

    if (
        typeof data ===
            "string"
        &&
        data.trim()
    ) {
        return data.trim();
    }

    // =====================================================
    // COMMON DRF RESPONSE
    // =====================================================

    if (
        typeof data?.detail ===
            "string"
        &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        typeof data?.message ===
            "string"
        &&
        data.message.trim()
    ) {
        return data.message.trim();
    }

    if (
        typeof data?.error ===
            "string"
        &&
        data.error.trim()
    ) {
        return data.error.trim();
    }

    // =====================================================
    // DRF FIELD VALIDATION
    // =====================================================

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
            &&
            firstValue.trim()
        ) {
            return firstValue.trim();
        }
    }

    // =====================================================
    // GENERIC ERROR
    // =====================================================

    if (
        typeof error?.message ===
            "string"
        &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// PROFILE ERROR
// =========================================================

const ProfileError = ({
    error,
    onRetry,
    isRetrying = false,
}) => {
    return (
        <main
            className="
                container
                mx-auto
                min-h-[70vh]
                p-3
                font-sans
                sm:p-4
                md:p-6
            "
        >
            <div
                className="
                    flex
                    min-h-[420px]
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        w-full
                        max-w-xl
                        rounded-3xl
                        border
                        border-red-400/15
                        bg-red-500/[0.045]
                        p-8
                        text-center
                        shadow-2xl
                        shadow-black/20
                    "
                >
                    <div
                        className="
                            mx-auto
                            grid
                            h-14
                            w-14
                            place-items-center
                            rounded-2xl
                            border
                            border-red-400/15
                            bg-red-500/[0.06]
                            text-red-300
                        "
                    >
                        <AlertCircle
                            size={25}
                        />
                    </div>

                    <h2
                        className="
                            mt-5
                            font-display
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        Profil yuklanmadi
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-sm
                            font-medium
                            leading-6
                            text-red-200/80
                        "
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        disabled={
                            isRetrying
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-400/20
                            bg-red-600
                            px-5
                            py-2.5
                            font-display
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            hover:-translate-y-0.5
                            hover:bg-red-500
                            active:translate-y-0
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {isRetrying ? (
                            <Loader2
                                size={15}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <RefreshCcw
                                size={15}
                            />
                        )}

                        {isRetrying
                            ? "Yuklanmoqda..."
                            : "Qayta urinish"}
                    </button>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// PROFILE
// =========================================================

const Profile = () => {
    const dispatch =
        useDispatch();

    const {
        username,
    } = useParams();

    // =====================================================
    // PROFILE REDUX
    // =====================================================

    const {
        profile,
        isLoading,
        error,
    } = useSelector(
        (
            state
        ) => state.profile
    );

    // =====================================================
    // AUTH REDUX
    // =====================================================

    const {
        user,
    } = useSelector(
        (
            state
        ) => state.auth
    );

    // =====================================================
    // TELEGRAM REDUX
    // =====================================================

    const {
        isLoading:
            botLoading,

        telegramProfile,
    } = useSelector(
        (
            state
        ) => state.bot
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        isEditModalOpen,
        setIsEditModalOpen,
    ] = useState(
        false
    );

    const [
        isCoverModalOpen,
        setIsCoverModalOpen,
    ] = useState(
        false
    );

    const [
        activeTab,
        setActiveTab,
    ] = useState(
        "projects"
    );

    // =====================================================
    // OWNER
    // =====================================================

    const isOwner =
        Boolean(
            user?.username
            &&
            username
        )
        &&
        String(
            user.username
        )
            .toLowerCase()
        ===
        String(
            username
        )
            .toLowerCase();

    // =====================================================
    // PROFILE MATCHES CURRENT ROUTE
    //
    // Masalan:
    //
    // /alice/profile
    //      ↓
    // /bob/profile
    //
    // Alice ma'lumoti Bob profilida ko'rinib qolmaydi.
    // =====================================================

    const profileMatchesRoute =
        Boolean(
            profile?.username
            &&
            username
        )
        &&
        String(
            profile.username
        )
            .toLowerCase()
        ===
        String(
            username
        )
            .toLowerCase();

    // =====================================================
    // TELEGRAM PROFILE
    // =====================================================

    const effectiveTelegramProfile =
        isOwner
            ? telegramProfile
            : null;

    const isTelegramLinked =
        Boolean(
            isOwner
            &&
            effectiveTelegramProfile
                ?.is_linked
        );

    // =====================================================
    // GET PROFILE
    // =====================================================

    const getProfile =
        useCallback(
            async ({
                notifyOnError = false,
            } = {}) => {
                if (
                    !username
                ) {
                    return false;
                }

                dispatch(
                    getProfileStart()
                );

                try {
                    const response =
                        await ProfileService
                            .getProfile(
                                username
                            );

                    dispatch(
                        getProfileSuccess(
                            response
                        )
                    );

                    return true;
                } catch (
                    requestError
                ) {
                    const message =
                        getErrorMessage(
                            requestError,
                            "Profilni olishda xatolik yuz berdi."
                        );

                    console.error(
                        "Profile olishda xato:",
                        requestError
                    );

                    dispatch(
                        getProfileFailure(
                            message
                        )
                    );

                    if (
                        notifyOnError
                    ) {
                        siteToast.error(
                            message
                        );
                    }

                    return false;
                }
            },
            [
                dispatch,
                username,
            ]
        );

    // =====================================================
    // GET TELEGRAM STATUS
    // =====================================================

    const getTelegramBotStatus =
        useCallback(
            async () => {
                if (
                    !isOwner
                ) {
                    return false;
                }

                dispatch(
                    getTelegramProfileStart()
                );

                try {
                    const response =
                        await BotService
                            .getTelegramProfile();

                    dispatch(
                        getTelegramProfileSuccess(
                            response
                        )
                    );

                    return true;
                } catch (
                    requestError
                ) {
                    const message =
                        getErrorMessage(
                            requestError,
                            "Telegram bot holatini olishda xatolik yuz berdi."
                        );

                    console.error(
                        "Telegram bot status olishda xato:",
                        requestError
                    );

                    dispatch(
                        getTelegramProfileFailure(
                            message
                        )
                    );

                    return false;
                }
            },
            [
                dispatch,
                isOwner,
            ]
        );

    // =====================================================
    // CONNECT TELEGRAM
    // =====================================================

    const handleConnectTelegramBot =
        useCallback(
            async () => {
                if (
                    !isOwner
                    ||
                    botLoading
                ) {
                    return;
                }

                dispatch(
                    getTelegramProfileStart()
                );

                try {
                    const response =
                        await BotService
                            .getTelegramProfile();

                    dispatch(
                        getTelegramProfileSuccess(
                            response
                        )
                    );

                    const botProfile =
                        response?.data
                        ||
                        response;

                    // =====================================
                    // ALREADY CONNECTED
                    // =====================================

                    if (
                        botProfile?.is_linked
                    ) {
                        siteToast.info(
                            "Telegram bot allaqachon ulangan."
                        );

                        return;
                    }

                    // =====================================
                    // LINK CODE
                    // =====================================

                    const linkCode =
                        botProfile?.link_code;

                    if (
                        !linkCode
                    ) {
                        siteToast.warning(
                            "Telegram ulash kodi topilmadi."
                        );

                        return;
                    }

                    // =====================================
                    // TELEGRAM URL
                    // =====================================

                    const botUsername =
                        "FixSocietybot";

                    const telegramUrl =
                        `https://t.me/${botUsername}?start=${encodeURIComponent(
                            linkCode
                        )}`;

                    const telegramWindow =
                        window.open(
                            telegramUrl,
                            "_blank",
                            "noopener,noreferrer"
                        );

                    // Popup bloklangan bo'lishi mumkin.
                    if (
                        !telegramWindow
                    ) {
                        siteToast.warning(
                            "Telegram oynasi ochilmadi. Brauzer popup oynalarni bloklagan bo‘lishi mumkin."
                        );

                        return;
                    }

                    siteToast.success(
                        "Telegram bot oynasi ochildi."
                    );
                } catch (
                    requestError
                ) {
                    const message =
                        getErrorMessage(
                            requestError,
                            "Telegram botni ulashda xatolik yuz berdi."
                        );

                    console.error(
                        "Telegram bot ulashda xato:",
                        requestError
                    );

                    dispatch(
                        getTelegramProfileFailure(
                            message
                        )
                    );

                    siteToast.error(
                        message
                    );
                }
            },
            [
                botLoading,
                dispatch,
                isOwner,
            ]
        );

    // =====================================================
    // INITIAL PROFILE LOAD
    // =====================================================

    useEffect(
        () => {
            getProfile();
        },
        [
            getProfile,
        ]
    );

    // =====================================================
    // TELEGRAM STATUS LOAD
    // =====================================================

    useEffect(
        () => {
            getTelegramBotStatus();
        },
        [
            getTelegramBotStatus,
        ]
    );

    // =====================================================
    // RESET UI WHEN PROFILE ROUTE CHANGES
    // =====================================================

    useEffect(
        () => {
            setActiveTab(
                "projects"
            );

            setIsEditModalOpen(
                false
            );

            setIsCoverModalOpen(
                false
            );
        },
        [
            username,
        ]
    );

    // =====================================================
    // VIEW MODEL
    // =====================================================

    const currentUser =
        useMemo(
            () => {
                return buildProfileViewModel({
                    profile,

                    routeUsername:
                        username,

                    telegramProfile:
                        effectiveTelegramProfile,
                });
            },
            [
                effectiveTelegramProfile,
                profile,
                username,
            ]
        );

    // =====================================================
    // BIRTHDAY
    // =====================================================

    const birthdayStatus =
        useMemo(
            () => {
                return getBirthdayStatus(
                    currentUser.birthday
                );
            },
            [
                currentUser.birthday,
            ]
        );

    // =====================================================
    // LOADING STATES
    //
    // Muhim:
    //
    // !profile ni bu yerga qo'shmaymiz.
    //
    // Aks holda initial request error bilan tugaganda:
    //
    // isLoading = false
    // profile = null
    //
    // bo'lsa ham skeleton abadiy qolib ketadi.
    // =====================================================

    const isInitialLoading =
        !profileMatchesRoute
        &&
        isLoading;

    const isRefreshing =
        profileMatchesRoute
        &&
        isLoading;

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleOpenEditModal =
        useCallback(
            () => {
                if (
                    !isOwner
                ) {
                    return;
                }

                setIsEditModalOpen(
                    true
                );
            },
            [
                isOwner,
            ]
        );

    // =====================================================
    // CLOSE EDIT
    //
    // EditProfileModal muvaffaqiyatli PATCHdan keyin
    // getProfileSuccess(response) qiladi.
    //
    // Shu sabab bu yerda yana GET request kerak emas.
    // =====================================================

    const handleCloseEditModal =
        useCallback(
            () => {
                setIsEditModalOpen(
                    false
                );
            },
            []
        );

    // =====================================================
    // OPEN COVER
    // =====================================================

    const handleOpenCoverModal =
        useCallback(
            () => {
                if (
                    !isOwner
                ) {
                    return;
                }

                setIsCoverModalOpen(
                    true
                );
            },
            [
                isOwner,
            ]
        );

    // =====================================================
    // CLOSE COVER
    //
    // CoverImageEditModal ham successdan keyin:
    //
    // dispatch(getProfileSuccess(updatedProfile))
    //
    // qiladi.
    //
    // Demak duplicate GET request kerak emas.
    // =====================================================

    const handleCloseCoverModal =
        useCallback(
            () => {
                setIsCoverModalOpen(
                    false
                );
            },
            []
        );

    // =====================================================
    // INITIAL / ROUTE LOADING
    // =====================================================

    if (
        isInitialLoading
    ) {
        return (
            <ProfileSkeleton />
        );
    }

    // =====================================================
    // INITIAL / ROUTE ERROR
    //
    // Loading tugagan bo'lishi shart.
    // =====================================================

    if (
        error
        &&
        !profileMatchesRoute
        &&
        !isLoading
    ) {
        return (
            <ProfileError
                error={
                    error
                }
                isRetrying={
                    isLoading
                }
                onRetry={() => {
                    getProfile({
                        notifyOnError:
                            true,
                    });
                }}
            />
        );
    }

    // =====================================================
    // ROUTE SAFETY
    //
    // Effect hali requestni boshlamagan qisqa momentda ham
    // eski profilni chiqarib yubormaymiz.
    // =====================================================

    if (
        !profileMatchesRoute
    ) {
        return (
            <ProfileSkeleton />
        );
    }

    // =====================================================
    // CONTENT
    // =====================================================

    return (
        <main
            className="
                container
                mx-auto
                min-h-screen
                p-3
                font-sans
                text-gray-100
                sm:p-4
                md:p-6
            "
        >
            {/* =============================================
                HERO
            ============================================== */}

            <ProfileHero
                currentUser={
                    currentUser
                }
                isOwner={
                    isOwner
                }
                botLoading={
                    botLoading
                }
                isTelegramLinked={
                    isTelegramLinked
                }
                onConnectTelegram={
                    handleConnectTelegramBot
                }
                onEditCover={
                    handleOpenCoverModal
                }
                onEditProfile={
                    handleOpenEditModal
                }
            />

            {/* =============================================
                BODY
            ============================================== */}

            <div
                className="
                    mt-6
                    grid
                    gap-6
                    lg:grid-cols-[380px_1fr]
                "
            >
                <ProfileSidebar
                    currentUser={
                        currentUser
                    }
                    birthdayStatus={
                        birthdayStatus
                    }
                    username={
                        username
                    }
                />

                <ProfileContent
                    username={
                        username
                    }
                    activeTab={
                        activeTab
                    }
                    onTabChange={
                        setActiveTab
                    }
                />
            </div>

            {/* =============================================
                EDIT PROFILE
            ============================================== */}

            {isOwner && (
                <EditProfileModal
                    profileData={
                        profile
                    }
                    isOpen={
                        isEditModalOpen
                    }
                    onClose={
                        handleCloseEditModal
                    }
                />
            )}

            {/* =============================================
                COVER IMAGE
            ============================================== */}

            {isOwner && (
                <CoverImageEditModal
                    isOpen={
                        isCoverModalOpen
                    }
                    currentCoverImage={
                        currentUser.coverImage
                    }
                    onClose={
                        handleCloseCoverModal
                    }
                />
            )}

            {/* =============================================
                BACKGROUND REFRESH INDICATOR
            ============================================== */}

            {isRefreshing && (
                <div
                    aria-live="polite"
                    aria-label="Profil yangilanmoqda"
                    className="
                        pointer-events-none
                        fixed
                        bottom-5
                        right-4
                        z-50
                        inline-flex
                        items-center
                        gap-2.5
                        rounded-2xl
                        border
                        border-indigo-400/15
                        bg-[#0b0e14]/95
                        px-4
                        py-3
                        font-display
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-indigo-300
                        shadow-2xl
                        shadow-black/30
                        backdrop-blur-xl
                        sm:right-5
                    "
                >
                    <Loader2
                        size={15}
                        className="
                            animate-spin
                        "
                    />

                    Profil yangilanmoqda
                </div>
            )}

            {/* =============================================
                BACKGROUND REFRESH ERROR
            ============================================== */}

            {error
                &&
                profileMatchesRoute
                &&
                !isLoading
                && (
                    <div
                        role="alert"
                        className="
                            fixed
                            bottom-5
                            left-4
                            z-40
                            hidden
                            max-w-md
                            items-start
                            gap-2
                            rounded-2xl
                            border
                            border-red-400/10
                            bg-[#0b0e14]/95
                            px-4
                            py-3
                            text-[10px]
                            font-medium
                            leading-5
                            text-red-300
                            shadow-xl
                            backdrop-blur-xl
                            lg:flex
                        "
                    >
                        <AlertCircle
                            size={15}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <span>
                            {error}
                        </span>
                    </div>
                )}
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default Profile;