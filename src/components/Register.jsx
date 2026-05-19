import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import "./Register.css";

import {
    signUserStart,
    signUserFailer,
    signUserSuccess,
} from "../features/auth/Auth";

import AuthService from "../services/auth";
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../services/config";

import FSocietyLogo from "../assests/logo/f_society.png";

const selectAuthState = (state) => state.auth;

const FIELD_LABELS = {
    username: "Username",
    email: "Email",
    password: "Parol",
    password2: "Parolni tasdiqlash",
};

const normalizeErrorText = (error) => {
    if (!error) return "";

    if (Array.isArray(error)) {
        return normalizeErrorText(error[0]);
    }

    if (typeof error === "object") {
        if (error.message) return normalizeErrorText(error.message);
        if (error.detail) return normalizeErrorText(error.detail);
        return "Maydon noto‘g‘ri to‘ldirilgan.";
    }

    const text = String(error);

    const translations = [
        {
            includes: "A user with that username already exists",
            text: "Bu username band. Boshqa username tanlang.",
        },
        {
            includes: "user with this username already exists",
            text: "Bu username band. Boshqa username tanlang.",
        },
        {
            includes: "This field must be unique",
            text: "Bu qiymat oldin ishlatilgan. Boshqasini kiriting.",
        },
        {
            includes: "Enter a valid email address",
            text: "Email noto‘g‘ri. Masalan: simple@gmail.com ko‘rinishida yozing.",
        },
        {
            includes: "This password is too common",
            text: "Bu parol juda oddiy. Murakkabroq parol kiriting.",
        },
        {
            includes: "This password is entirely numeric",
            text: "Parol faqat raqamlardan iborat bo‘lmasin. Harf ham qo‘shing.",
        },
        {
            includes: "This password is too short",
            text: "Parol juda qisqa. Kamida 8 ta belgi kiriting.",
        },
        {
            includes: "The password is too similar",
            text: "Parol username yoki emailga juda o‘xshash. Boshqacha parol kiriting.",
        },
        {
            includes: "This field is required",
            text: "Bu maydon majburiy. Iltimos, to‘ldiring.",
        },
        {
            includes: "passwords do not match",
            text: "Parollar mos kelmadi. Ikkala parol bir xil bo‘lishi kerak.",
        },
    ];

    const found = translations.find((item) =>
        text.toLowerCase().includes(item.includes.toLowerCase())
    );

    return found ? found.text : text;
};

const getFirstMessage = (value) => {
    if (!value) return "";

    if (Array.isArray(value)) {
        return normalizeErrorText(value[0]);
    }

    return normalizeErrorText(value);
};

const parseFieldErrorFromMessage = (message) => {
    if (!message || typeof message !== "string") return null;

    const match = message.match(/^(username|email|password|password2)\s*:\s*(.+)$/i);

    if (!match) return null;

    const field = match[1].toLowerCase();
    const value = match[2];

    return {
        field,
        message: normalizeErrorText(value),
    };
};

const extractServerErrors = (err) => {
    const data = err?.serverData || err?.response?.data;

    const fieldErrors = {};
    let globalError = "";

    if (data && typeof data === "object" && !Array.isArray(data)) {
        Object.keys(FIELD_LABELS).forEach((field) => {
            if (data[field]) {
                fieldErrors[field] = getFirstMessage(data[field]);
            }
        });

        if (data.non_field_errors) {
            globalError = getFirstMessage(data.non_field_errors);
        } else if (data.detail) {
            globalError = getFirstMessage(data.detail);
        } else if (data.msg) {
            globalError = getFirstMessage(data.msg);
        } else if (data.error) {
            globalError = getFirstMessage(data.error);
        }

        return {
            fieldErrors,
            globalError:
                globalError ||
                (Object.keys(fieldErrors).length > 0
                    ? "Formada xatolik bor. Qizil yozuvlar ko‘rsatilgan joylarni to‘g‘rilang."
                    : "Ro‘yxatdan o‘tishda xatolik yuz berdi."),
        };
    }

    const message = err?.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi.";
    const parsed = parseFieldErrorFromMessage(message);

    if (parsed?.field) {
        fieldErrors[parsed.field] = parsed.message;

        return {
            fieldErrors,
            globalError: "Formada xatolik bor. Qizil yozuvlar ko‘rsatilgan joylarni to‘g‘rilang.",
        };
    }

    return {
        fieldErrors,
        globalError: normalizeErrorText(message),
    };
};

const validateRegisterForm = (formData) => {
    const errors = {};

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const password2 = formData.password2;

    if (!username) {
        errors.username = "Username kiritish majburiy. Masalan: anakin_dev";
    } else if (username.length < 3) {
        errors.username = "Username kamida 3 ta belgidan iborat bo‘lishi kerak.";
    } else if (username.length > 30) {
        errors.username = "Username 30 ta belgidan oshmasligi kerak.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username =
            "Username faqat lotin harflari, raqam va pastki chiziqdan iborat bo‘lsin. Masalan: anakin_dev";
    }

    if (!email) {
        errors.email = "Email kiritish majburiy. Masalan: simple@gmail.com";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email =
            "Email noto‘g‘ri yozilgan. To‘g‘ri ko‘rinish: simple@gmail.com";
    }

    if (!password) {
        errors.password = "Parol kiritish majburiy.";
    } else if (password.length < 8) {
        errors.password = "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.";
    } else if (/\s/.test(password)) {
        errors.password = "Parolda bo‘sh joy ishlatmang.";
    } else if (/^\d+$/.test(password)) {
        errors.password =
            "Parol faqat raqamlardan iborat bo‘lmasin. Harf ham qo‘shing.";
    } else if (username && password.toLowerCase().includes(username.toLowerCase())) {
        errors.password =
            "Parol username bilan juda o‘xshash. Xavfsizroq parol tanlang.";
    }

    if (!password2) {
        errors.password2 = "Parolni qayta kiriting.";
    } else if (password !== password2) {
        errors.password2 =
            "Parollar mos kelmadi. Ikkala parol bir xil bo‘lishi kerak.";
    }

    return errors;
};

const PasswordRules = ({ password }) => {
    const rules = useMemo(
        () => [
            {
                label: "Kamida 8 ta belgi",
                passed: password.length >= 8,
            },
            {
                label: "Faqat raqam emas",
                passed: password.length > 0 && !/^\d+$/.test(password),
            },
            {
                label: "Bo‘sh joysiz",
                passed: password.length > 0 && !/\s/.test(password),
            },
        ],
        [password]
    );

    if (!password) return null;

    return (
        <div className="mt-2 grid gap-1 rounded-2xl border border-gray-800 bg-[#0d1117]/70 p-3">
            {rules.map((rule) => (
                <div
                    key={rule.label}
                    className={`flex items-center gap-2 text-[11px] font-bold ${
                        rule.passed ? "text-emerald-300" : "text-gray-500"
                    }`}
                >
                    <i
                        className={`fa-solid ${
                            rule.passed ? "fa-check-circle" : "fa-circle"
                        } text-[10px]`}
                    ></i>
                    {rule.label}
                </div>
            ))}
        </div>
    );
};

const FieldWithIcon = ({
    id,
    label,
    iconClass,
    type,
    placeholder,
    value,
    onChange,
    error,
    hint,
    autoComplete,
    disabled,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && isPasswordVisible ? "text" : type;
    const hasError = Boolean(error);

    return (
        <div>
            <label
                htmlFor={id}
                className="ml-1 text-xs font-black uppercase tracking-widest text-gray-500"
            >
                {label}
            </label>

            <div className="relative mt-1.5">
                <i
                    className={`${iconClass} absolute left-4 top-1/2 -translate-y-1/2 ${
                        hasError ? "text-red-400" : "text-gray-600"
                    }`}
                ></i>

                <input
                    id={id}
                    name={id}
                    type={inputType}
                    required
                    disabled={disabled}
                    autoComplete={autoComplete}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : `${id}-hint`}
                    className={`w-full rounded-xl border bg-[#0d1117] py-3.5 pl-12 pr-12 text-white outline-none transition-all placeholder:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                        hasError
                            ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-[#30363d] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        disabled={disabled}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <i
                            className={`fa-solid ${
                                isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                            }`}
                        ></i>
                    </button>
                )}
            </div>

            {hasError ? (
                <p
                    id={`${id}-error`}
                    className="ml-1 mt-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold leading-5 text-red-300"
                >
                    <i className="fa-solid fa-circle-exclamation mr-1.5"></i>
                    {normalizeErrorText(error)}
                </p>
            ) : hint ? (
                <p
                    id={`${id}-hint`}
                    className="ml-1 mt-1 text-[11px] font-semibold leading-5 text-gray-600"
                >
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, error, isLoggedIn } = useSelector(selectAuthState);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [localGlobalError, setLocalGlobalError] = useState("");

    useEffect(() => {
        dispatch({ type: "auth/clearAuthError" });

        return () => {
            dispatch({ type: "auth/clearAuthError" });
        };
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setLocalGlobalError("");

        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = {
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            password2: formData.password2,
        };

        const clientErrors = validateRegisterForm(cleanedData);

        if (Object.keys(clientErrors).length > 0) {
            setFormErrors(clientErrors);

            const message =
                "Formani noto‘g‘ri to‘ldirdingiz. Qizil yozuvlar ko‘rsatilgan joylarni to‘g‘rilang.";

            setLocalGlobalError(message);
            dispatch(signUserFailer(message));

            return;
        }

        setFormErrors({});
        setLocalGlobalError("");
        dispatch(signUserStart());

        try {
            const response = await AuthService.userRegister(cleanedData);
            const registeredUser = response?.user || response;

            if (!registeredUser || !registeredUser.id) {
                throw new Error(
                    "Ro‘yxatdan o‘tish bajarildi, lekin user ma’lumoti kelmadi."
                );
            }

            dispatch(signUserSuccess(registeredUser));
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Ro‘yxatdan o‘tish xatosi:", err);

            const { fieldErrors, globalError } = extractServerErrors(err);

            setFormErrors(fieldErrors);
            setLocalGlobalError(globalError);

            dispatch(signUserFailer(globalError));
        }
    };

    const handleSocialLogin = (url) => {
        if (!url) {
            const message = "Social login URL topilmadi.";
            setLocalGlobalError(message);
            dispatch(signUserFailer(message));
            return;
        }

        window.location.assign(url);
    };

    const globalMessage =
        localGlobalError ||
        (typeof error === "string" && error !== "Autentifikatsiya xatosi."
            ? error
            : "");

    const isSubmitDisabled =
        isLoading ||
        !formData.username.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !formData.password2;

    return (
        <div className="register-page-container relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4 py-12">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-pink-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="animate-fade-in relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-[#30363d] bg-[#161b22]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="text-center">
                    <Link to="/" className="group inline-flex flex-col items-center">
                        <img
                            src={FSocietyLogo}
                            alt="F.Society Logo"
                            className="h-20 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
                        />

                        <span className="mt-2 text-2xl font-black tracking-tighter text-white">
                            F<span className="text-indigo-500">Society</span>
                        </span>
                    </Link>

                    <h1 className="hero-gradient-text mt-6 text-2xl font-black">
                        Yangi Hisob Yaratish
                    </h1>

                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Jamiyatimizga xush kelibsiz!
                    </p>
                </div>

                {globalMessage && (
                    <div className="rounded-2xl border border-red-800/50 bg-red-900/30 p-3 text-center text-sm font-semibold leading-6 text-red-300">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {globalMessage}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin(GITHUB_AUTH_URL)}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] py-3 text-sm font-black text-white shadow-lg transition-all hover:border-indigo-500/50 hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <i className="fab fa-github mr-2 text-lg"></i>
                        GitHub
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin(GOOGLE_AUTH_URL)}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] py-3 text-sm font-black text-white shadow-lg transition-all hover:border-indigo-500/50 hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <i className="fab fa-google mr-2 text-lg text-red-500"></i>
                        Google
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-3">
                    <span className="h-px w-full bg-gray-800"></span>
                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-tighter text-gray-600">
                        yoki email orqali
                    </span>
                    <span className="h-px w-full bg-gray-800"></span>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <FieldWithIcon
                        id="username"
                        label="Username"
                        iconClass="fas fa-user"
                        type="text"
                        placeholder="anakin_dev"
                        value={formData.username}
                        onChange={handleChange}
                        error={formErrors.username}
                        hint="Faqat lotin harflari, raqam va _ ishlating."
                        autoComplete="username"
                        disabled={isLoading}
                    />

                    <FieldWithIcon
                        id="email"
                        label="Email manzili"
                        iconClass="fas fa-envelope"
                        type="email"
                        placeholder="simple@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        hint="To‘g‘ri email kiriting. Masalan: simple@gmail.com"
                        autoComplete="email"
                        disabled={isLoading}
                    />

                    <div>
                        <FieldWithIcon
                            id="password"
                            label="Parol"
                            iconClass="fas fa-lock"
                            type="password"
                            placeholder="Kamida 8 belgi"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            hint="Kamida 8 belgi. Faqat raqamdan iborat bo‘lmasin."
                            autoComplete="new-password"
                            disabled={isLoading}
                        />

                        <PasswordRules password={formData.password} />
                    </div>

                    <FieldWithIcon
                        id="password2"
                        label="Parolni tasdiqlash"
                        iconClass="fas fa-shield-check"
                        type="password"
                        placeholder="Parolni qayta kiriting"
                        value={formData.password2}
                        onChange={handleChange}
                        error={formErrors.password2}
                        hint="Yuqoridagi parol bilan bir xil bo‘lishi kerak."
                        autoComplete="new-password"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-indigo-900 disabled:text-indigo-200/60"
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Yaratilmoqda...
                            </>
                        ) : (
                            "Hisob Yaratish"
                        )}
                    </button>
                </form>

                <p className="pt-2 text-center text-sm text-gray-500">
                    Hisobingiz bormi?
                    <Link
                        to="/login"
                        className="ml-2 font-black text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                        Kirish
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;