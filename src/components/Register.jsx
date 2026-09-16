import React, {
    useEffect,
    useMemo,
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
    CheckCircle2,
    Circle,
    CircleAlert,
    Eye,
    EyeOff,
    Github,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import "./Register.css";

import {
    clearAuthError,
    signUserFailure,
    signUserStart,
    signUserSuccess,
} from "../features/auth/Auth";

import AuthService from "../services/auth";

import {
    GITHUB_AUTH_URL,
    GOOGLE_AUTH_URL,
} from "../services/config";

import {
    authToast,
} from "./ui/AuthToast";

import GoogleIcon from "./ui/GoogleIcon";

import FSocietyLogo from "../assests/logo/f_society.png";


// =========================================================
// AUTH SELECTOR
// =========================================================

const selectAuthState =
    (state) => state.auth;


// =========================================================
// FIELD LABELS
// =========================================================

const FIELD_LABELS = {
    username:
        "Username",

    email:
        "Email",

    password:
        "Parol",

    password2:
        "Parolni tasdiqlash",
};


// =========================================================
// ERROR NORMALIZER
// =========================================================

const normalizeErrorText = (
    error
) => {
    if (!error) {
        return "";
    }


    if (
        Array.isArray(
            error
        )
    ) {
        return normalizeErrorText(
            error[0]
        );
    }


    if (
        typeof error ===
        "object"
    ) {
        if (
            error.message
        ) {
            return normalizeErrorText(
                error.message
            );
        }


        if (
            error.detail
        ) {
            return normalizeErrorText(
                error.detail
            );
        }


        return (
            "Maydon noto‘g‘ri "
            + "to‘ldirilgan."
        );
    }


    const text =
        String(
            error
        );


    const translations = [
        {
            includes:
                "A user with that username already exists",

            text:
                "Bu username band. "
                + "Boshqa username tanlang.",
        },

        {
            includes:
                "user with this username already exists",

            text:
                "Bu username band. "
                + "Boshqa username tanlang.",
        },

        {
            includes:
                "This field must be unique",

            text:
                "Bu qiymat oldin ishlatilgan. "
                + "Boshqasini kiriting.",
        },

        {
            includes:
                "Enter a valid email address",

            text:
                "Email noto‘g‘ri. "
                + "Masalan: simple@gmail.com "
                + "ko‘rinishida yozing.",
        },

        {
            includes:
                "This password is too common",

            text:
                "Bu parol juda oddiy. "
                + "Murakkabroq parol kiriting.",
        },

        {
            includes:
                "This password is entirely numeric",

            text:
                "Parol faqat raqamlardan "
                + "iborat bo‘lmasin. "
                + "Harf ham qo‘shing.",
        },

        {
            includes:
                "This password is too short",

            text:
                "Parol juda qisqa. "
                + "Kamida 8 ta belgi kiriting.",
        },

        {
            includes:
                "The password is too similar",

            text:
                "Parol username yoki emailga "
                + "juda o‘xshash. "
                + "Boshqacha parol kiriting.",
        },

        {
            includes:
                "This field is required",

            text:
                "Bu maydon majburiy. "
                + "Iltimos, to‘ldiring.",
        },

        {
            includes:
                "passwords do not match",

            text:
                "Parollar mos kelmadi. "
                + "Ikkala parol bir xil "
                + "bo‘lishi kerak.",
        },
    ];


    const found =
        translations.find(
            (item) =>
                text
                    .toLowerCase()
                    .includes(
                        item.includes
                            .toLowerCase()
                    )
        );


    return found
        ? found.text
        : text;
};


// =========================================================
// FIRST ERROR MESSAGE
// =========================================================

const getFirstMessage = (
    value
) => {
    if (!value) {
        return "";
    }


    if (
        Array.isArray(
            value
        )
    ) {
        return normalizeErrorText(
            value[0]
        );
    }


    return normalizeErrorText(
        value
    );
};


// =========================================================
// MESSAGE -> FIELD ERROR
// =========================================================

const parseFieldErrorFromMessage = (
    message
) => {
    if (
        !message ||
        typeof message !==
            "string"
    ) {
        return null;
    }


    const match =
        message.match(
            /^(username|email|password|password2)\s*:\s*(.+)$/i
        );


    if (!match) {
        return null;
    }


    return {
        field:
            match[1]
                .toLowerCase(),

        message:
            normalizeErrorText(
                match[2]
            ),
    };
};


// =========================================================
// SERVER ERRORS
// =========================================================

const extractServerErrors = (
    err
) => {
    const data =
        err?.serverData ||
        err?.response?.data;


    const fieldErrors =
        {};


    let globalError =
        "";


    if (
        data &&
        typeof data ===
            "object" &&
        !Array.isArray(
            data
        )
    ) {
        Object
            .keys(
                FIELD_LABELS
            )
            .forEach(
                (field) => {
                    const value =
                        data?.errors?.[
                            field
                        ] ||
                        data?.[
                            field
                        ];


                    if (value) {
                        fieldErrors[
                            field
                        ] =
                            getFirstMessage(
                                value
                            );
                    }
                }
            );


        if (
            data.non_field_errors
        ) {
            globalError =
                getFirstMessage(
                    data.non_field_errors
                );

        } else if (
            data.detail
        ) {
            globalError =
                getFirstMessage(
                    data.detail
                );

        } else if (
            data.msg
        ) {
            globalError =
                getFirstMessage(
                    data.msg
                );

        } else if (
            data.error
        ) {
            globalError =
                getFirstMessage(
                    data.error
                );
        }


        return {
            fieldErrors,

            globalError:
                globalError ||
                (
                    Object.keys(
                        fieldErrors
                    ).length > 0

                        ? (
                            "Formada xatolik bor. "
                            + "Qizil yozuvlar "
                            + "ko‘rsatilgan joylarni "
                            + "to‘g‘rilang."
                        )

                        : (
                            "Ro‘yxatdan o‘tishda "
                            + "xatolik yuz berdi."
                        )
                ),
        };
    }


    const message =
        err?.message ||
        (
            "Ro‘yxatdan o‘tishda "
            + "xatolik yuz berdi."
        );


    const parsed =
        parseFieldErrorFromMessage(
            message
        );


    if (
        parsed?.field
    ) {
        fieldErrors[
            parsed.field
        ] =
            parsed.message;


        return {
            fieldErrors,

            globalError:
                "Formada xatolik bor. "
                + "Qizil yozuvlar ko‘rsatilgan "
                + "joylarni to‘g‘rilang.",
        };
    }


    return {
        fieldErrors,

        globalError:
            normalizeErrorText(
                message
            ),
    };
};


// =========================================================
// CLIENT VALIDATION
// =========================================================

const validateRegisterForm = (
    formData
) => {
    const errors =
        {};


    const username =
        formData.username
            .trim();


    const email =
        formData.email
            .trim();


    const password =
        formData.password;


    const password2 =
        formData.password2;


    // =====================================================
    // USERNAME
    // =====================================================

    if (!username) {
        errors.username =
            "Username kiritish majburiy. "
            + "Masalan: anakin_dev";

    } else if (
        username.length <
        3
    ) {
        errors.username =
            "Username kamida 3 ta "
            + "belgidan iborat "
            + "bo‘lishi kerak.";

    } else if (
        username.length >
        30
    ) {
        errors.username =
            "Username 30 ta belgidan "
            + "oshmasligi kerak.";

    } else if (
        !/^[a-zA-Z0-9_]+$/.test(
            username
        )
    ) {
        errors.username =
            "Username faqat lotin "
            + "harflari, raqam va "
            + "pastki chiziqdan "
            + "iborat bo‘lsin.";
    }


    // =====================================================
    // EMAIL
    // =====================================================

    if (!email) {
        errors.email =
            "Email kiritish majburiy. "
            + "Masalan: simple@gmail.com";

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        )
    ) {
        errors.email =
            "Email noto‘g‘ri yozilgan. "
            + "To‘g‘ri ko‘rinish: "
            + "simple@gmail.com";
    }


    // =====================================================
    // PASSWORD
    // =====================================================

    if (!password) {
        errors.password =
            "Parol kiritish majburiy.";

    } else if (
        password.length <
        8
    ) {
        errors.password =
            "Parol kamida 8 ta "
            + "belgidan iborat "
            + "bo‘lishi kerak.";

    } else if (
        /\s/.test(
            password
        )
    ) {
        errors.password =
            "Parolda bo‘sh joy "
            + "ishlatmang.";

    } else if (
        /^\d+$/.test(
            password
        )
    ) {
        errors.password =
            "Parol faqat raqamlardan "
            + "iborat bo‘lmasin. "
            + "Harf ham qo‘shing.";

    } else if (
        username &&
        password
            .toLowerCase()
            .includes(
                username
                    .toLowerCase()
            )
    ) {
        errors.password =
            "Parol username bilan "
            + "juda o‘xshash. "
            + "Xavfsizroq parol tanlang.";
    }


    // =====================================================
    // PASSWORD CONFIRM
    // =====================================================

    if (!password2) {
        errors.password2 =
            "Parolni qayta kiriting.";

    } else if (
        password !==
        password2
    ) {
        errors.password2 =
            "Parollar mos kelmadi. "
            + "Ikkala parol bir xil "
            + "bo‘lishi kerak.";
    }


    return errors;
};


// =========================================================
// PASSWORD RULES
// =========================================================

const PasswordRules = ({
    password,
}) => {
    const rules =
        useMemo(
            () => [
                {
                    label:
                        "Kamida 8 ta belgi",

                    passed:
                        password.length >=
                        8,
                },

                {
                    label:
                        "Faqat raqam emas",

                    passed:
                        password.length >
                            0 &&
                        !/^\d+$/.test(
                            password
                        ),
                },

                {
                    label:
                        "Bo‘sh joysiz",

                    passed:
                        password.length >
                            0 &&
                        !/\s/.test(
                            password
                        ),
                },
            ],
            [
                password,
            ]
        );


    if (!password) {
        return null;
    }


    return (
        <div className="register-password-rules">

            {rules.map(
                (rule) => (
                    <div
                        key={
                            rule.label
                        }
                        className={`
                            register-password-rule
                            ${
                                rule.passed
                                    ? "register-password-rule--passed"
                                    : ""
                            }
                        `}
                    >

                        {rule.passed ? (
                            <CheckCircle2
                                size={14}
                                strokeWidth={2.2}
                            />
                        ) : (
                            <Circle
                                size={14}
                                strokeWidth={2}
                            />
                        )}


                        <span>
                            {rule.label}
                        </span>

                    </div>
                )
            )}

        </div>
    );
};


// =========================================================
// REGISTER FIELD
// =========================================================

const RegisterField = ({
    inputRef,
    id,
    label,
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    onKeyDown,
    error,
    hint,
    autoComplete,
    disabled,
}) => {
    const [
        isPasswordVisible,
        setIsPasswordVisible,
    ] = useState(
        false
    );


    const isPasswordField =
        type ===
        "password";


    const inputType =
        isPasswordField &&
        isPasswordVisible

            ? "text"

            : type;


    const hasError =
        Boolean(
            error
        );


    return (
        <div className="register-field">

            <label
                htmlFor={id}
            >
                {label}
            </label>


            <div
                className={`
                    register-input-wrapper
                    ${
                        hasError
                            ? "register-input-wrapper--error"
                            : ""
                    }
                `}
            >

                <Icon
                    className="register-input-icon"
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                />


                <input
                    ref={
                        inputRef
                    }

                    id={id}

                    name={id}

                    type={
                        inputType
                    }

                    required

                    disabled={
                        disabled
                    }

                    autoComplete={
                        autoComplete
                    }

                    aria-invalid={
                        hasError
                    }

                    aria-describedby={
                        hasError

                            ? `${id}-error`

                            : hint
                                ? `${id}-hint`
                                : undefined
                    }

                    placeholder={
                        placeholder
                    }

                    value={
                        value
                    }

                    onChange={
                        onChange
                    }

                    onKeyDown={
                        onKeyDown
                    }
                />


                {isPasswordField && (
                    <button
                        type="button"

                        className="register-password-toggle"

                        onClick={() =>
                            setIsPasswordVisible(
                                (prev) =>
                                    !prev
                            )
                        }

                        disabled={
                            disabled
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
                            />

                        ) : (

                            <Eye
                                size={18}
                                strokeWidth={2}
                            />

                        )}

                    </button>
                )}

            </div>


            {hasError ? (

                <p
                    id={`${id}-error`}
                    className="register-field-error"
                >

                    <CircleAlert
                        size={14}
                        strokeWidth={2}
                    />


                    <span>
                        {
                            normalizeErrorText(
                                error
                            )
                        }
                    </span>

                </p>

            ) : hint ? (

                <p
                    id={`${id}-hint`}
                    className="register-field-hint"
                >
                    {hint}
                </p>

            ) : null}

        </div>
    );
};


// =========================================================
// REGISTER
// =========================================================

const Register = () => {
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

    const usernameRef =
        useRef(
            null
        );


    const emailRef =
        useRef(
            null
        );


    const passwordRef =
        useRef(
            null
        );


    const password2Ref =
        useRef(
            null
        );


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState({
        username:
            "",

        email:
            "",

        password:
            "",

        password2:
            "",
    });


    const [
        formErrors,
        setFormErrors,
    ] = useState(
        {}
    );


    const [
        localGlobalError,
        setLocalGlobalError,
    ] = useState(
        ""
    );


    // =====================================================
    // INIT
    // =====================================================

    useEffect(() => {
        dispatch(
            clearAuthError()
        );


        const timer =
            setTimeout(
                () => {
                    usernameRef
                        .current
                        ?.focus();
                },
                100
            );


        return () => {
            clearTimeout(
                timer
            );


            dispatch(
                clearAuthError()
            );
        };
    }, [
        dispatch,
    ]);


    // =====================================================
    // ALREADY LOGGED IN
    // =====================================================

    useEffect(() => {
        if (
            isLoggedIn
        ) {
            navigate(
                "/",
                {
                    replace:
                        true,
                }
            );
        }
    }, [
        isLoggedIn,
        navigate,
    ]);


    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (
        e
    ) => {
        const {
            name,
            value,
        } =
            e.target;


        setFormData(
            (prev) => ({
                ...prev,

                [name]:
                    value,
            })
        );


        setLocalGlobalError(
            ""
        );


        if (
            formErrors[
                name
            ]
        ) {
            setFormErrors(
                (prev) => ({
                    ...prev,

                    [name]:
                        null,
                })
            );
        }
    };


    // =====================================================
    // FOCUS FIELD
    // =====================================================

    const focusField = (
        field
    ) => {
        const map = {
            username:
                usernameRef,

            email:
                emailRef,

            password:
                passwordRef,

            password2:
                password2Ref,
        };


        requestAnimationFrame(
            () => {
                map[
                    field
                ]
                    ?.current
                    ?.focus();
            }
        );
    };


    // =====================================================
    // ENTER NAVIGATION
    // =====================================================

    const handleEnter = (
        e,
        nextRef
    ) => {
        if (
            e.key !==
            "Enter"
        ) {
            return;
        }


        e.preventDefault();


        nextRef
            ?.current
            ?.focus();
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async (
            e
        ) => {
            e.preventDefault();


            if (
                isLoading
            ) {
                return;
            }


            const cleanedData = {
                username:
                    formData
                        .username
                        .trim(),

                email:
                    formData
                        .email
                        .trim()
                        .toLowerCase(),

                password:
                    formData
                        .password,

                password2:
                    formData
                        .password2,
            };


            const clientErrors =
                validateRegisterForm(
                    cleanedData
                );


            // =============================================
            // CLIENT ERRORS
            // =============================================

            if (
                Object.keys(
                    clientErrors
                ).length >
                0
            ) {
                setFormErrors(
                    clientErrors
                );


                const firstField =
                    Object.keys(
                        clientErrors
                    )[0];


                const firstMessage =
                    clientErrors[
                        firstField
                    ];


                setLocalGlobalError(
                    firstMessage
                );


                dispatch(
                    signUserFailure(
                        firstMessage
                    )
                );


                authToast.warning(
                    firstMessage,
                    {
                        title:
                            "Formani tekshiring",
                    }
                );


                focusField(
                    firstField
                );


                return;
            }


            setFormErrors(
                {}
            );


            setLocalGlobalError(
                ""
            );


            dispatch(
                clearAuthError()
            );


            dispatch(
                signUserStart()
            );


            try {
                // =========================================
                // REQUEST
                // =========================================

                const response =
                    await AuthService
                        .userRegister(
                            cleanedData
                        );


                const registeredUser =
                    response?.user ||
                    response;


                if (
                    !registeredUser ||
                    !registeredUser.id
                ) {
                    throw new Error(
                        "Ro‘yxatdan o‘tish bajarildi, "
                        + "lekin foydalanuvchi "
                        + "ma’lumoti olinmadi."
                    );
                }


                // =========================================
                // REDUX
                // =========================================

                dispatch(
                    signUserSuccess(
                        registeredUser
                    )
                );


                // =========================================
                // SUCCESS TOAST
                // =========================================

                authToast.success(
                    `Xush kelibsiz, ${registeredUser.username}!`,
                    {
                        title:
                            "Hisob yaratildi",

                        duration:
                            3200,
                    }
                );


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

            } catch (
                err
            ) {
                console.error(
                    "Ro‘yxatdan o‘tish xatosi:",
                    err
                );


                const {
                    fieldErrors,
                    globalError,
                } =
                    extractServerErrors(
                        err
                    );


                setFormErrors(
                    fieldErrors
                );


                setLocalGlobalError(
                    globalError
                );


                dispatch(
                    signUserFailure(
                        globalError
                    )
                );


                authToast.error(
                    globalError,
                    {
                        title:
                            "Hisob yaratilmadi",
                    }
                );


                const firstField =
                    Object.keys(
                        fieldErrors
                    )[0];


                if (
                    firstField
                ) {
                    focusField(
                        firstField
                    );
                }
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


            setLocalGlobalError(
                message
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
    // BUTTON STATE
    // =====================================================

    const isSubmitDisabled =
        isLoading ||
        !formData
            .username
            .trim() ||
        !formData
            .email
            .trim() ||
        !formData
            .password ||
        !formData
            .password2;


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div className="register-page-container">


            {/* =============================================
                BACKGROUND
            ============================================== */}

            <div className="register-bg register-bg--center" />

            <div className="register-bg register-bg--right" />

            <div className="register-bg register-bg--left" />

            <div className="register-grid-overlay" />


            {/* =============================================
                CARD
            ============================================== */}

            <main className="register-card animate-register-fade-in">


                {/* =========================================
                    HEADER
                ========================================== */}

                <div className="register-header">

                    <Link
                        to="/"
                        className="register-logo-link"
                    >

                        <img
                            src={
                                FSocietyLogo
                            }
                            alt="F.Society Logo"
                            className="register-logo"
                        />


                        <span className="register-brand">

                            F

                            <span>
                                Society
                            </span>

                        </span>

                    </Link>


                    <h1>
                        Yangi hisob yaratish
                    </h1>


                    <p>
                        Jamiyatimizga xush kelibsiz!
                    </p>

                </div>


                {/* =========================================
                    GLOBAL ERROR
                ========================================== */}

                {localGlobalError && (
                    <div
                        className="register-global-error"
                        role="alert"
                    >

                        <CircleAlert
                            size={17}
                            strokeWidth={2}
                        />


                        <span>
                            {
                                localGlobalError
                            }
                        </span>

                    </div>
                )}


                {/* =========================================
                    SOCIAL LOGIN
                ========================================== */}

                <div className="register-social-grid">

                    <button
                        type="button"

                        className="register-social-button"

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
                        />


                        <span>
                            GitHub
                        </span>

                    </button>


                    <button
                        type="button"

                        className="register-social-button"

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

                <div className="register-divider">

                    <span />

                    <p>
                        yoki email orqali
                    </p>

                    <span />

                </div>


                {/* =========================================
                    FORM
                ========================================== */}

                <form
                    className="register-form"

                    onSubmit={
                        handleSubmit
                    }

                    noValidate
                >


                    {/* USERNAME */}

                    <RegisterField
                        inputRef={
                            usernameRef
                        }

                        id="username"

                        label="Username"

                        icon={
                            UserRound
                        }

                        type="text"

                        placeholder="anakin_dev"

                        value={
                            formData.username
                        }

                        onChange={
                            handleChange
                        }

                        onKeyDown={(e) =>
                            handleEnter(
                                e,
                                emailRef
                            )
                        }

                        error={
                            formErrors.username
                        }

                        hint="Faqat lotin harflari, raqam va _ ishlating."

                        autoComplete="username"

                        disabled={
                            isLoading
                        }
                    />


                    {/* EMAIL */}

                    <RegisterField
                        inputRef={
                            emailRef
                        }

                        id="email"

                        label="Email manzili"

                        icon={
                            Mail
                        }

                        type="email"

                        placeholder="simple@gmail.com"

                        value={
                            formData.email
                        }

                        onChange={
                            handleChange
                        }

                        onKeyDown={(e) =>
                            handleEnter(
                                e,
                                passwordRef
                            )
                        }

                        error={
                            formErrors.email
                        }

                        hint="To‘g‘ri email kiriting. Masalan: simple@gmail.com"

                        autoComplete="email"

                        disabled={
                            isLoading
                        }
                    />


                    {/* PASSWORD */}

                    <div>

                        <RegisterField
                            inputRef={
                                passwordRef
                            }

                            id="password"

                            label="Parol"

                            icon={
                                LockKeyhole
                            }

                            type="password"

                            placeholder="Kamida 8 belgi"

                            value={
                                formData.password
                            }

                            onChange={
                                handleChange
                            }

                            onKeyDown={(e) =>
                                handleEnter(
                                    e,
                                    password2Ref
                                )
                            }

                            error={
                                formErrors.password
                            }

                            hint="Kamida 8 belgi. Faqat raqamdan iborat bo‘lmasin."

                            autoComplete="new-password"

                            disabled={
                                isLoading
                            }
                        />


                        <PasswordRules
                            password={
                                formData.password
                            }
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <RegisterField
                        inputRef={
                            password2Ref
                        }

                        id="password2"

                        label="Parolni tasdiqlash"

                        icon={
                            ShieldCheck
                        }

                        type="password"

                        placeholder="Parolni qayta kiriting"

                        value={
                            formData.password2
                        }

                        onChange={
                            handleChange
                        }

                        error={
                            formErrors.password2
                        }

                        hint="Yuqoridagi parol bilan bir xil bo‘lishi kerak."

                        autoComplete="new-password"

                        disabled={
                            isLoading
                        }
                    />


                    {/* SUBMIT */}

                    <button
                        type="submit"

                        className="register-submit-button"

                        disabled={
                            isSubmitDisabled
                        }
                    >

                        {isLoading ? (

                            <>
                                <LoaderCircle
                                    size={17}
                                    strokeWidth={2.2}
                                    className="register-spinner"
                                />

                                <span>
                                    Yaratilmoqda...
                                </span>
                            </>

                        ) : (

                            <>
                                <span>
                                    Hisob yaratish
                                </span>

                                <ArrowRight
                                    size={17}
                                    strokeWidth={2.2}
                                />
                            </>

                        )}

                    </button>

                </form>


                {/* =========================================
                    LOGIN
                ========================================== */}

                <p className="register-login-text">

                    Hisobingiz bormi?


                    <Link
                        to="/login"
                    >
                        Kirish
                    </Link>

                </p>

            </main>

        </div>
    );
};


export default Register;