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
} from "lucide-react";

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

import ProfileService from "../../services/profile";
import BotService from "../../services/bot";

import {
    getBirthdayStatus,
} from "../../utils/formatDate";

import EditProfileModal from "./EditProfileModal";

import ProfileHero from "./ProfileHero";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";

import CoverImageEditModal from "../CoverImageEditModal";

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


    if (
        typeof data === "string"
        &&
        data.trim()
    ) {
        return data.trim();
    }


    if (
        data?.detail
    ) {
        return String(
            data.detail
        );
    }


    if (
        data?.message
    ) {
        return String(
            data.message
        );
    }


    if (
        data?.error
    ) {
        return String(
            data.error
        );
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
// SKELETON
// =========================================================

const ProfileSkeleton = () => {
    return (
        <main
            className="
                container
                mx-auto

                p-3

                font-sans

                sm:p-4
                md:p-6
            "
        >
            <div
                className="
                    overflow-hidden

                    rounded-3xl

                    border
                    border-gray-800

                    bg-gray-900/60
                "
            >
                <div
                    className="
                        h-44

                        animate-pulse

                        bg-gray-800

                        md:h-64
                    "
                />


                <div
                    className="
                        p-4

                        sm:p-6
                    "
                >
                    <div
                        className="
                            flex
                            items-start

                            gap-4
                        "
                    >
                        <div
                            className="
                                h-24
                                w-24

                                shrink-0

                                animate-pulse

                                rounded-full

                                bg-gray-800

                                sm:h-32
                                sm:w-32
                            "
                        />


                        <div
                            className="
                                flex-1

                                space-y-4

                                pt-3
                            "
                        >
                            <div
                                className="
                                    h-6
                                    w-48

                                    animate-pulse

                                    rounded-xl

                                    bg-gray-800

                                    sm:w-64
                                "
                            />


                            <div
                                className="
                                    h-4
                                    w-full
                                    max-w-md

                                    animate-pulse

                                    rounded-xl

                                    bg-gray-800
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};


// =========================================================
// ERROR
// =========================================================

const ProfileError = ({
    error,
    onRetry,
}) => {
    return (
        <main
            className="
                container
                mx-auto

                p-3

                font-sans

                sm:p-4
                md:p-6
            "
        >
            <div
                className="
                    rounded-3xl

                    border
                    border-red-500/30

                    bg-red-500/10

                    p-8

                    text-center
                "
            >
                <AlertCircle
                    size={46}
                    className="
                        mx-auto
                        mb-4

                        text-red-300
                    "
                />


                <h2
                    className="
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
                        mt-2

                        text-red-200
                    "
                >
                    {error}
                </p>


                <button
                    type="button"
                    onClick={
                        onRetry
                    }
                    className="
                        mt-5

                        rounded-xl

                        bg-red-600

                        px-5
                        py-2.5

                        font-display
                        font-bold

                        text-white

                        transition

                        hover:bg-red-500
                    "
                >
                    Qayta urinish
                </button>
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
    // REDUX
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


    const {
        user,
    } = useSelector(
        (
            state
        ) => state.auth
    );


    const {
        isLoading: botLoading,
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
        user.username.toLowerCase()
        ===
        username.toLowerCase();


    // =====================================================
    // PROFILE BELONGS TO CURRENT ROUTE?
    //
    // /alice/profile -> /bob/profile o'tganda
    // Alice ma'lumoti bir lahza ko'rinib qolmaydi.
    // =====================================================

    const profileMatchesRoute =
        Boolean(
            profile?.username
            &&
            username
        )
        &&
        profile.username.toLowerCase()
        ===
        username.toLowerCase();


    // =====================================================
    // TELEGRAM
    //
    // Telegram profile faqat o'z profilimizda ko'rinadi.
    // Oldingi owner state boshqa userga o'tib ketmaydi.
    // =====================================================

    const effectiveTelegramProfile =
        isOwner
            ? telegramProfile
            : null;


    const isTelegramLinked =
        Boolean(
            isOwner
            &&
            effectiveTelegramProfile?.is_linked
        );


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const getProfile =
        useCallback(
            async () => {
                if (
                    !username
                ) {
                    return;
                }


                dispatch(
                    getProfileStart()
                );


                try {
                    const response =
                        await ProfileService.getProfile(
                            username
                        );


                    dispatch(
                        getProfileSuccess(
                            response
                        )
                    );

                } catch (
                    requestError
                ) {
                    console.error(
                        "Profile olishda xato:",
                        requestError
                    );


                    dispatch(
                        getProfileFailure(
                            getErrorMessage(
                                requestError,
                                "Profile olishda xato yuz berdi."
                            )
                        )
                    );
                }
            },
            [
                dispatch,
                username,
            ]
        );


    // =====================================================
    // TELEGRAM STATUS
    // =====================================================

    const getTelegramBotStatus =
        useCallback(
            async () => {
                if (
                    !isOwner
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

                } catch (
                    requestError
                ) {
                    console.error(
                        "Telegram bot status olishda xato:",
                        requestError
                    );


                    dispatch(
                        getTelegramProfileFailure(
                            getErrorMessage(
                                requestError,
                                "Telegram bot holatini olishda xato."
                            )
                        )
                    );
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


                    const profileData =
                        response?.data
                        ||
                        response;


                    if (
                        profileData?.is_linked
                    ) {
                        window.alert(
                            "Telegram bot allaqachon ulangan ✅"
                        );

                        return;
                    }


                    const linkCode =
                        profileData?.link_code;


                    if (
                        !linkCode
                    ) {
                        window.alert(
                            "Telegram ulash kodi topilmadi."
                        );

                        return;
                    }


                    const botUsername =
                        "FixSocietybot";


                    const telegramUrl =
                        `https://t.me/${botUsername}?start=${encodeURIComponent(
                            linkCode
                        )}`;


                    window.open(
                        telegramUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                } catch (
                    requestError
                ) {
                    const message =
                        getErrorMessage(
                            requestError,
                            "Telegram botni ulashda xato yuz berdi."
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


                    window.alert(
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
    // LOAD
    // =====================================================

    useEffect(
        () => {
            getProfile();
        },
        [
            getProfile,
        ]
    );


    useEffect(
        () => {
            getTelegramBotStatus();
        },
        [
            getTelegramBotStatus,
        ]
    );


    // =====================================================
    // RESET TAB WHEN PROFILE CHANGES
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
    // FIRST / ROUTE LOAD
    // =====================================================

    if (
        !profileMatchesRoute
        &&
        (
            isLoading
            ||
            !profile
        )
    ) {
        return (
            <ProfileSkeleton />
        );
    }


    // =====================================================
    // ROUTE ERROR
    // =====================================================

    if (
        error
        &&
        !profileMatchesRoute
    ) {
        return (
            <ProfileError
                error={
                    error
                }
                onRetry={
                    getProfile
                }
            />
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
                    () => {
                        setIsCoverModalOpen(
                            true
                        );
                    }
                }
                onEditProfile={
                    () => {
                        setIsEditModalOpen(
                            true
                        );
                    }
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

            <EditProfileModal
                profileData={
                    profile
                }
                isOpen={
                    isEditModalOpen
                }
                onClose={
                    () => {
                        setIsEditModalOpen(
                            false
                        );


                        getProfile();
                    }
                }
            />


            {/* =============================================
                COVER
            ============================================== */}

            <CoverImageEditModal
                isOpen={
                    isCoverModalOpen
                }
                currentCoverImage={
                    currentUser.coverImage
                }
                onClose={
                    () => {
                        setIsCoverModalOpen(
                            false
                        );


                        getProfile();
                    }
                }
            />


            {/* =============================================
                REFRESH
            ============================================== */}

            {
                isLoading
                &&
                profileMatchesRoute
                &&
                (
                    <div
                        className="
                            fixed
                            bottom-5
                            right-5
                            z-50

                            inline-flex
                            items-center

                            gap-3

                            rounded-2xl

                            border
                            border-indigo-400/20

                            bg-gray-900/95

                            px-4
                            py-3

                            font-display

                            text-sm
                            font-semibold

                            text-indigo-200

                            shadow-2xl

                            backdrop-blur-md
                        "
                    >
                        <Loader2
                            size={18}
                            className="
                                animate-spin
                            "
                        />

                        Profil yangilanmoqda...
                    </div>
                )
            }
        </main>
    );
};


export default Profile;