import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
    Eye,
    EyeOff,
    Github,
    LoaderCircle,
    LockKeyhole,
    UserRound,
} from "lucide-react";

import "./Login.css";

import {
    signUserStart,
    signUserSuccess,
    signUserFailure,
    clearAuthError,
} from "../features/auth/Auth";

import AuthService from "../services/auth";

import {
    GOOGLE_AUTH_URL,
    GITHUB_AUTH_URL,
} from "../services/config";

import {
    authToast,
} from "./ui/AuthToast";

import GoogleIcon from "./ui/GoogleIcon";

import FSocietyLogo from "../assests/logo/f_society.png";


const selectAuthState =
    (state) => state.auth;


// =========================================================
// LOGIN
// =========================================================

const Login = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();


    const {
        isLoading,
        isLoggedIn,
    } = useSelector(
        selectAuthState
    );


    // =====================================================
    // REFS
    // =====================================================

    const usernameInputRef =
        useRef(null);

    const passwordInputRef =
        useRef(null);


    // =====================================================
    // STATE
    // =====================================================

    const [
        username,
        setUsername,
    ] = useState("");


    const [
        password,
        setPassword,
    ] = useState("");


    const [
        isPasswordVisible,
        setIsPasswordVisible,
    ] = useState(false);


    const passwordInputType =
        isPasswordVisible
            ? "text"
            : "password";


    // =====================================================
    // EFFECTS
    // =====================================================

    useEffect(() => {
        dispatch(
            clearAuthError()
        );


        const timer =
            setTimeout(() => {
                usernameInputRef
                    .current
                    ?.focus();
            }, 100);


        return () => {
            clearTimeout(timer);

            dispatch(
                clearAuthError()
            );
        };
    }, [
        dispatch,
    ]);


    useEffect(() => {
        if (isLoggedIn) {
            navigate(
                "/",
                {
                    replace: true,
                }
            );
        }
    }, [
        isLoggedIn,
        navigate,
    ]);


    // =====================================================
    // ERROR PARSER
    // =====================================================

    const getLoginErrorMessage = (
        err
    ) => {
        const message =
            err?.serverData?.detail ||
            err?.serverData?.msg ||
            err?.serverData?.error ||

            err?.response?.data?.detail ||
            err?.response?.data?.msg ||
            err?.response?.data?.error ||

            err?.message;


        if (!message) {
            return (
                "Login qilishda noma’lum "
                + "xatolik yuz berdi."
            );
        }


        const normalized =
            String(message)
                .toLowerCase();


        // =============================================
        // NETWORK
        // =============================================

        if (
            normalized.includes(
                "network error"
            ) ||
            normalized.includes(
                "failed to fetch"
            ) ||
            normalized.includes(
                "server bilan bog"
            )
        ) {
            return (
                "Server bilan bog‘lanib bo‘lmadi. "
                + "Backend ishlayotganini tekshiring."
            );
        }


        // =============================================
        // USERNAME
        // =============================================

        if (
            normalized.includes(
                "username topilmadi"
            ) ||
            normalized.includes(
                "foydalanuvchi topilmadi"
            ) ||
            normalized.includes(
                "user not found"
            )
        ) {
            return (
                "Bunday username bilan "
                + "foydalanuvchi topilmadi."
            );
        }


        // =============================================
        // PASSWORD
        // =============================================

        if (
            normalized.includes(
                "parol noto"
            ) ||
            normalized.includes(
                "incorrect password"
            ) ||
            normalized.includes(
                "wrong password"
            )
        ) {
            return (
                "Parol noto‘g‘ri. "
                + "Qaytadan urinib ko‘ring."
            );
        }


        // =============================================
        // INACTIVE
        // =============================================

        if (
            normalized.includes(
                "akkaunt faol emas"
            ) ||
            normalized.includes(
                "account is inactive"
            )
        ) {
            return (
                "Bu akkaunt faol emas. "
                + "Administrator bilan bog‘laning."
            );
        }


        // =============================================
        // INVALID CREDENTIALS
        // =============================================

        if (
            normalized.includes(
                "invalid credentials"
            )
        ) {
            return (
                "Username yoki parol noto‘g‘ri."
            );
        }


        return String(message);
    };


    // =====================================================
    // USERNAME ENTER
    // =====================================================

    const handleUsernameKeyDown = (
        e
    ) => {
        if (
            e.key !== "Enter"
        ) {
            return;
        }


        e.preventDefault();


        const cleanUsername =
            username.trim();


        if (!cleanUsername) {
            authToast.warning(
                "Avval username kiriting.",
                {
                    title:
                        "Username kerak",
                }
            );


            usernameInputRef
                .current
                ?.focus();


            return;
        }


        passwordInputRef
            .current
            ?.focus();
    };


    // =====================================================
    // LOGIN
    // =====================================================

    const loginHandler =
        async (e) => {
            e.preventDefault();


            if (isLoading) {
                return;
            }


            const cleanUsername =
                username.trim();


            // =============================================
            // USERNAME EMPTY
            // =============================================

            if (!cleanUsername) {
                authToast.warning(
                    "Tizimga kirish uchun username kiriting.",
                    {
                        title:
                            "Username kiritilmadi",
                    }
                );


                usernameInputRef
                    .current
                    ?.focus();


                return;
            }


            // =============================================
            // PASSWORD EMPTY
            // =============================================

            if (!password) {
                authToast.warning(
                    "Tizimga kirish uchun parolingizni kiriting.",
                    {
                        title:
                            "Parol kiritilmadi",
                    }
                );


                passwordInputRef
                    .current
                    ?.focus();


                return;
            }


            dispatch(
                clearAuthError()
            );


            dispatch(
                signUserStart()
            );


            try {
                // =============================================
                // REQUEST
                // =============================================

                const response =
                    await AuthService
                        .userLogin({
                            username:
                                cleanUsername,

                            password,
                        });


                const loggedUser =
                    response?.user ||
                    response;


                if (
                    !loggedUser ||
                    !loggedUser.id
                ) {
                    throw new Error(
                        "Login amalga oshdi, "
                        + "ammo foydalanuvchi "
                        + "ma’lumoti olinmadi."
                    );
                }


                // =============================================
                // REDUX
                // =============================================

                dispatch(
                    signUserSuccess(
                        loggedUser
                    )
                );


                // =============================================
                // SUCCESS TOAST
                // =============================================

                authToast.success(
                    `Xush kelibsiz, ${loggedUser.username}!`,
                    {
                        title:
                            "Tizimga kirildi",

                        duration:
                            3000,
                    }
                );


                // Global AuthToast App.js ichida,
                // shuning uchun route o'zgarsa ham toast qoladi.

                setTimeout(
                    () => {
                        navigate(
                            "/",
                            {
                                replace:
                                    true,
                            }
                        );
                    },
                    250
                );

            } catch (err) {
                console.error(
                    "Login error:",
                    err
                );


                const message =
                    getLoginErrorMessage(
                        err
                    );


                dispatch(
                    signUserFailure(
                        message
                    )
                );


                authToast.error(
                    message,
                    {
                        title:
                            "Kirish amalga oshmadi",
                    }
                );


                requestAnimationFrame(
                    () => {
                        passwordInputRef
                            .current
                            ?.focus();


                        passwordInputRef
                            .current
                            ?.select();
                    }
                );
            }
        };


    // =====================================================
    // SOCIAL LOGIN
    // =====================================================

    const handleSocialLogin = (
        url
    ) => {
        if (!url) {
            const message =
                "Social login URL topilmadi.";


            dispatch(
                signUserFailure(
                    message
                )
            );


            authToast.error(
                message,
                {
                    title:
                        "Social login xatosi",
                }
            );


            return;
        }


        window.location.assign(
            url
        );
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div className="login-page-container">


            {/* =============================================
                BACKGROUND
            ============================================== */}

            <div className="login-bg login-bg--center" />

            <div className="login-bg login-bg--right" />

            <div className="login-bg login-bg--left" />

            <div className="login-grid-overlay" />


            {/* =============================================
                CARD
            ============================================== */}

            <main className="login-card animate-fade-in">


                {/* =========================================
                    HEADER
                ========================================== */}

                <div className="login-header">

                    <Link
                        to="/"
                        className="login-logo-link"
                    >

                        <img
                            src={FSocietyLogo}
                            alt="F.Society Logo"
                            className="login-logo"
                        />


                        <span className="login-brand">

                            F

                            <span>
                                Society
                            </span>

                        </span>

                    </Link>


                    <h1>
                        Xush kelibsiz
                    </h1>


                    <p>
                        Jamiyatga qaytganingiz bilan!
                    </p>

                </div>


                {/* =========================================
                    SOCIAL LOGIN
                ========================================== */}

                <div className="login-social-grid">

                    {/* GITHUB */}

                    <button
                        type="button"
                        className="login-social-button"
                        onClick={() =>
                            handleSocialLogin(
                                GITHUB_AUTH_URL
                            )
                        }
                        disabled={
                            isLoading
                        }
                    >

                        <Github
                            size={19}
                            strokeWidth={2}
                            aria-hidden="true"
                        />


                        <span>
                            GitHub
                        </span>

                    </button>


                    {/* GOOGLE */}

                    <button
                        type="button"
                        className="login-social-button"
                        onClick={() =>
                            handleSocialLogin(
                                GOOGLE_AUTH_URL
                            )
                        }
                        disabled={
                            isLoading
                        }
                    >

                        <GoogleIcon
                            size={19}
                        />


                        <span>
                            Google
                        </span>

                    </button>

                </div>


                {/* =========================================
                    DIVIDER
                ========================================== */}

                <div className="login-divider">

                    <span />

                    <p>
                        yoki
                    </p>

                    <span />

                </div>


                {/* =========================================
                    FORM
                ========================================== */}

                <form
                    className="login-form"
                    onSubmit={
                        loginHandler
                    }
                    noValidate
                >


                    {/* =====================================
                        USERNAME
                    ====================================== */}

                    <div className="login-field">

                        <label
                            htmlFor="username"
                        >
                            Username
                        </label>


                        <div className="login-input-wrapper">

                            <UserRound
                                className="login-input-icon"
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                            />


                            <input
                                ref={
                                    usernameInputRef
                                }

                                id="username"

                                name="username"

                                type="text"

                                value={
                                    username
                                }

                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }

                                onKeyDown={
                                    handleUsernameKeyDown
                                }

                                autoComplete="username"

                                autoCapitalize="none"

                                spellCheck="false"

                                disabled={
                                    isLoading
                                }

                                placeholder="foydalanuvchi_nomi"
                            />

                        </div>

                    </div>


                    {/* =====================================
                        PASSWORD
                    ====================================== */}

                    <div className="login-field">

                        <div className="login-label-row">

                            <label
                                htmlFor="password"
                            >
                                Parol
                            </label>


                            <Link
                                to="#"
                                className="login-forgot-link"
                            >
                                Unutdingizmi?
                            </Link>

                        </div>


                        <div className="login-input-wrapper">

                            <LockKeyhole
                                className="login-input-icon"
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                            />


                            <input
                                ref={
                                    passwordInputRef
                                }

                                id="password"

                                name="password"

                                type={
                                    passwordInputType
                                }

                                value={
                                    password
                                }

                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }

                                autoComplete="current-password"

                                disabled={
                                    isLoading
                                }

                                placeholder="••••••••"
                            />


                            {/* PASSWORD VISIBILITY */}

                            <button
                                type="button"

                                className="login-password-toggle"

                                onClick={() =>
                                    setIsPasswordVisible(
                                        (prev) =>
                                            !prev
                                    )
                                }

                                disabled={
                                    isLoading
                                }

                                aria-label={
                                    isPasswordVisible
                                        ? "Parolni yashirish"
                                        : "Parolni ko‘rsatish"
                                }
                            >

                                {isPasswordVisible ? (

                                    <EyeOff
                                        size={18}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                ) : (

                                    <Eye
                                        size={18}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                )}

                            </button>

                        </div>

                    </div>


                    {/* =====================================
                        SUBMIT
                    ====================================== */}

                    <button
                        type="submit"

                        className="login-submit-button"

                        disabled={
                            isLoading
                        }
                    >

                        {isLoading ? (

                            <>
                                <LoaderCircle
                                    size={17}
                                    strokeWidth={2.2}
                                    className="login-spinner"
                                    aria-hidden="true"
                                />


                                <span>
                                    Kirilmoqda...
                                </span>
                            </>

                        ) : (

                            <>
                                <span>
                                    Tizimga kirish
                                </span>


                                <ArrowRight
                                    size={17}
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                />
                            </>

                        )}

                    </button>

                </form>


                {/* =========================================
                    REGISTER
                ========================================== */}

                <p className="login-register-text">

                    Hisobingiz yo‘qmi?


                    <Link
                        to="/register"
                    >
                        Ro‘yxatdan o‘ting
                    </Link>

                </p>

            </main>

        </div>
    );
};


export default Login;