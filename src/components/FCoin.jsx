import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import "./FCoin.css";

import FCoinImage from "../assests/coin/fcoin.png";

import {
    ArrowUpRight,
    BadgeCheck,
    Banknote,
    BookOpen,
    Bot,
    Crown,
    Gem,
    Gift,
    Heart,
    Lock,
    Megaphone,
    Palette,
    PenLine,
    Rocket,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    TrendingUp,
    Trophy,
    Wallet,
    Zap,
} from "lucide-react";

const earnWays = [
    {
        icon: PenLine,
        title: "Yangi post yozish",
        desc: "Foydali maqola yoki tajriba ulashing.",
        bonus: "+20",
        tone: "emerald",
    },
    {
        icon: BookOpen,
        title: "Muammoga javob yozish",
        desc: "Boshqa dasturchilarga yechim bering.",
        bonus: "+5",
        tone: "emerald",
    },
    {
        icon: Heart,
        title: "Like olish",
        desc: "Post yoki javobingiz foydali deb topilsa.",
        bonus: "+3",
        tone: "pink",
    },
    {
        icon: Crown,
        title: "Eng yaxshi yechim",
        desc: "Javobingiz accepted solution bo‘lsa.",
        bonus: "+50",
        tone: "yellow",
    },
    {
        icon: Rocket,
        title: "Loyiha yuklash",
        desc: "Portfolio uchun real loyiha qo‘shing.",
        bonus: "+100",
        tone: "purple",
    },
    {
        icon: Zap,
        title: "Kunlik kirish",
        desc: "Platformaga faol kirib boring.",
        bonus: "+1",
        tone: "blue",
    },
];

const spendWays = [
    {
        icon: BadgeCheck,
        title: "Avatar ramkalari",
        desc: "Profil rasmingizga premium frame qo‘shing.",
        price: "250",
    },
    {
        icon: Palette,
        title: "Eksklyuziv profil temalari",
        desc: "Profil sahifangizni boshqalardan ajrating.",
        price: "500",
    },
    {
        icon: Megaphone,
        title: "Loyihani TOP-ga chiqarish",
        desc: "Loyihangizni ko‘proq foydalanuvchiga ko‘rsating.",
        price: "800",
    },
    {
        icon: Trophy,
        title: "Premium badge",
        desc: "Faolligingiz uchun maxsus nishonlar.",
        price: "1200",
    },
];

const rules = [
    {
        icon: ShieldCheck,
        title: "Shaffoflik",
        desc: "Har bir FCoin harakati tarixda saqlanadi va profil hamyonida ko‘rinadi.",
    },
    {
        icon: Lock,
        title: "Ichki iqtisodiyot",
        desc: "FCoin haqiqiy valyuta emas. U FSociety ichidagi motivatsion aktiv hisoblanadi.",
    },
    {
        icon: Bot,
        title: "Anti-spam",
        desc: "Spam, bot yoki soxta faoliyat orqali yig‘ilgan FCoin bekor qilinadi.",
    },
];

const roadmap = [
    "FCoin history / transaction sahifasi",
    "Premium profil dizaynlari",
    "Loyihani boost qilish",
    "Badge shop va avatar frame",
];

const toneClasses = {
    emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10",
    pink: "border-pink-400/20 bg-pink-500/10 text-pink-300 shadow-pink-500/10",
    yellow: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300 shadow-yellow-500/10",
    purple: "border-purple-400/20 bg-purple-500/10 text-purple-300 shadow-purple-500/10",
    blue: "border-sky-400/20 bg-sky-500/10 text-sky-300 shadow-sky-500/10",
};

const MotionCard = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ y: 35, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

const FCoin = () => {
    const { user } = useSelector((state) => state.auth || {});

    const currentCoins = user?.coins ?? 0;

    const floatingCoins = useMemo(() => {
        return Array.from({ length: 14 }).map((_, index) => ({
            id: index,
            size: 22 + ((index * 13) % 42),
            left: (index * 19) % 100,
            delay: (index * 0.55) % 6,
            duration: 12 + ((index * 7) % 10),
            blur: index % 3 === 0 ? "1.5px" : "0px",
            opacity: index % 2 === 0 ? 0.18 : 0.1,
        }));
    }, []);

    return (
        <div className="fcoin-page relative min-h-screen overflow-hidden bg-[#05070a] text-white">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 fcoin-grid-bg" />
            <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-24 top-1/3 h-[360px] w-[360px] rounded-full bg-yellow-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -left-24 bottom-20 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[110px]" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {floatingCoins.map((coin) => (
                    <motion.img
                        key={coin.id}
                        src={FCoinImage}
                        alt=""
                        className="absolute bottom-[-90px] select-none"
                        initial={{ y: 0, opacity: 0, rotate: 0 }}
                        animate={{
                            y: "-125vh",
                            opacity: [0, coin.opacity, coin.opacity, 0],
                            rotate: 360,
                        }}
                        transition={{
                            duration: coin.duration,
                            repeat: Infinity,
                            delay: coin.delay,
                            ease: "linear",
                        }}
                        style={{
                            width: `${coin.size}px`,
                            left: `${coin.left}%`,
                            filter: `blur(${coin.blur}) drop-shadow(0 0 16px rgba(250, 204, 21, 0.35))`,
                        }}
                    />
                ))}
            </div>

            <main className="container relative z-10 mx-auto px-4 py-12 sm:py-16">
                {/* HERO */}
                <section className="mx-auto max-w-6xl pt-6 text-center">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0, rotateY: -120 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 110,
                            damping: 14,
                            delay: 0.1,
                        }}
                        className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56"
                    >
                        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-[55px] fcoin-pulse" />
                        <div className="absolute h-[78%] w-[78%] rounded-full border border-yellow-300/20" />
                        <div className="absolute h-[98%] w-[98%] rounded-full border border-indigo-300/10" />

                        <motion.img
                            src={FCoinImage}
                            alt="FCoin"
                            className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_0_42px_rgba(250,204,21,0.45)] sm:h-44 sm:w-44"
                            animate={{
                                y: [0, -8, 0],
                                rotateY: [0, 8, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                    >
                        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-300 shadow-lg shadow-yellow-500/10 sm:text-sm">
                            <Sparkles size={16} />
                            FixCoin Economy
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                            FCoin{" "}
                            <span className="fcoin-title-gradient italic">
                                iqtisodiyoti
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-sm font-medium leading-7 text-gray-400 sm:text-lg sm:leading-8">
                            FCoin — FSociety ichidagi motivatsion aktiv. Muammo yeching,
                            post yozing, loyiha yuklang va har bir foydali harakatingizni
                            raqamli qiymatga aylantiring.
                        </p>
                    </motion.div>

                    {/* WALLET SUMMARY */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3"
                    >
                        <div className="fcoin-glass-card rounded-3xl p-5 text-left">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                                        Sizning hamyoningiz
                                    </p>
                                    <p className="mt-1 text-3xl font-black text-white">
                                        {currentCoins}{" "}
                                        <span className="text-base text-yellow-300">
                                            FCoin
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="fcoin-glass-card rounded-3xl p-5 text-left">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                                        Eng katta bonus
                                    </p>
                                    <p className="mt-1 text-3xl font-black text-white">
                                        +100{" "}
                                        <span className="text-base text-emerald-300">
                                            loyiha
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="fcoin-glass-card rounded-3xl p-5 text-left">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                                    <Gem size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                                        Maqsad
                                    </p>
                                    <p className="mt-1 text-3xl font-black text-white">
                                        Rank{" "}
                                        <span className="text-base text-purple-300">
                                            & rewards
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* EARN / SPEND */}
                <section className="mt-16 grid gap-8 lg:grid-cols-2">
                    {/* EARN */}
                    <MotionCard className="fcoin-panel earning-panel overflow-hidden rounded-[32px] border border-emerald-400/15 bg-gray-900/50 shadow-2xl shadow-black/40 backdrop-blur-md">
                        <div className="relative p-5 sm:p-8">
                            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

                            <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
                                        <ArrowUpRight size={15} />
                                        Earn FCoin
                                    </div>

                                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                                        FCoin ishlash yo‘llari
                                    </h2>

                                    <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                                        Platformaga foyda keltiring va har bir hissangiz
                                        uchun mukofot oling.
                                    </p>
                                </div>

                                <div className="hidden h-16 w-16 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 sm:flex">
                                    <Banknote size={30} />
                                </div>
                            </div>

                            <div className="relative z-10 space-y-3">
                                {earnWays.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.title}
                                            initial={{ x: -20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.06 }}
                                            whileHover={{ scale: 1.015 }}
                                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.035] p-4 transition-all hover:border-emerald-400/25 hover:bg-emerald-500/10"
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-lg ${
                                                    toneClasses[item.tone]
                                                }`}
                                            >
                                                <Icon size={22} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-black text-white sm:text-base">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500 sm:text-sm">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            <span className="shrink-0 rounded-xl border border-emerald-400/25 bg-emerald-500/15 px-3 py-1.5 text-sm font-black text-emerald-200">
                                                {item.bonus}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </MotionCard>

                    {/* SPEND */}
                    <MotionCard
                        delay={0.08}
                        className="fcoin-panel spending-panel overflow-hidden rounded-[32px] border border-indigo-400/15 bg-gray-900/50 shadow-2xl shadow-black/40 backdrop-blur-md"
                    >
                        <div className="relative p-5 sm:p-8">
                            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

                            <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-indigo-300">
                                        <ShoppingCart size={15} />
                                        Spend FCoin
                                    </div>

                                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                                        FCoin sarflash
                                    </h2>

                                    <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                                        Profil, loyiha va platformadagi imkoniyatlaringizni
                                        kuchaytiring.
                                    </p>
                                </div>

                                <div className="hidden h-16 w-16 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 sm:flex">
                                    <Gift size={30} />
                                </div>
                            </div>

                            <div className="relative z-10 grid gap-3 sm:grid-cols-2">
                                {spendWays.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.title}
                                            initial={{ y: 18, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.06 }}
                                            whileHover={{ y: -4 }}
                                            className="group rounded-2xl border border-white/5 bg-white/[0.035] p-4 transition-all hover:border-indigo-400/30 hover:bg-indigo-500/10"
                                        >
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                                    <Icon size={21} />
                                                </div>

                                                <span className="inline-flex items-center gap-1 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-black text-yellow-300">
                                                    <img
                                                        src={FCoinImage}
                                                        alt=""
                                                        className="h-4 w-4 object-contain"
                                                    />
                                                    {item.price}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-black text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                                                {item.desc}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="relative z-10 mt-6 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5">
                                <p className="text-sm font-semibold leading-7 text-indigo-200">
                                    Kelajakda FCoin orqali avatar frame, premium badge,
                                    loyiha boost va FSociety brend sovg‘alarini olish
                                    imkoniyati qo‘shiladi.
                                </p>
                            </div>
                        </div>
                    </MotionCard>
                </section>

                {/* RULES + ROADMAP */}
                <section className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                    <MotionCard className="rounded-[32px] border border-gray-700/70 bg-gray-900/55 p-5 shadow-2xl shadow-black/35 backdrop-blur-md sm:p-8">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                <ShieldCheck size={28} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white sm:text-3xl">
                                    Tizim qoidalari
                                </h2>
                                <p className="mt-1 text-sm font-medium text-gray-500">
                                    FCoin adolatli va shaffof ishlashi uchun
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {rules.map((rule) => {
                                const Icon = rule.icon;

                                return (
                                    <div
                                        key={rule.title}
                                        className="rounded-3xl border border-gray-700/60 bg-gray-950/35 p-5 transition hover:border-indigo-400/30 hover:bg-gray-900"
                                    >
                                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                            <Icon size={22} />
                                        </div>

                                        <h3 className="text-lg font-black text-white">
                                            {rule.title}
                                        </h3>

                                        <p className="mt-2 text-sm font-medium leading-6 text-gray-400">
                                            {rule.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </MotionCard>

                    <MotionCard
                        delay={0.08}
                        className="rounded-[32px] border border-yellow-400/15 bg-yellow-500/[0.045] p-5 shadow-2xl shadow-black/35 backdrop-blur-md sm:p-8"
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300">
                                <Star size={27} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white">
                                    Keyingi bosqich
                                </h2>
                                <p className="mt-1 text-sm font-medium text-gray-500">
                                    FCoin uchun roadmap
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {roadmap.map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.035] p-4"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-500/10 text-xs font-black text-yellow-300">
                                        {index + 1}
                                    </div>

                                    <p className="text-sm font-bold leading-6 text-gray-300">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </MotionCard>
                </section>
            </main>
        </div>
    );
};

export default FCoin;