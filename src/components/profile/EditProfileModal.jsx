// EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import ProfileService from "../../services/profile";
import { getProfileSuccess } from "../../features/profile";

const SKILL_LEVELS = [
    { value: "beginner", label: "Boshlang'ich" },
    { value: "junior", label: "Junior (Kichik mutaxassis)" },
    { value: "intermediate", label: "O'rta (Intermediate)" },
    { value: "advanced", label: "Kengaytirilgan (Advanced)" },
    { value: "senior", label: "Senior (Katta mutaxassis)" },
    { value: "lead", label: "Lead / Tech Lead (Yetakchi)" },
    { value: "expert", label: "Expert / Architect (Ekspert)" },
];

const normalizeDateForInput = (dateValue) => {
    if (!dateValue) return "";

    if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
    }

    if (typeof dateValue === "string" && dateValue.includes("T")) {
        return dateValue.split("T")[0];
    }

    return "";
};

const normalizeSkillsForInput = (skills) => {
    if (!skills) return "";

    if (Array.isArray(skills)) {
        return skills
            .map((skill) => {
                if (typeof skill === "string") return skill;
                return skill?.name || skill?.title || "";
            })
            .filter(Boolean)
            .join(", ");
    }

    return skills;
};

const EditProfileModal = ({ profileData, isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        birthday: "",
        address: "",
        about_me: "",
        skill_level: "beginner",
        skills: "",
        company: "",
        position: "",
        website_url: "",
        github_url: "",
    });

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (profileData) {
            setFormData({
                first_name: profileData.first_name ?? "",
                last_name: profileData.last_name ?? "",
                email: profileData.email ?? "",

                birthday: normalizeDateForInput(
                    profileData.birthday || profileData.birth_date
                ),

                address: profileData.address ?? "",
                about_me: profileData.about_me ?? "",
                skill_level: profileData.skill_level ?? "beginner",
                skills: normalizeSkillsForInput(profileData.skills),
                company: profileData.company ?? "",
                position: profileData.position ?? "",
                website_url: profileData.website_url ?? "",
                github_url: profileData.github_url ?? "",
            });

            setProfileImagePreview(profileData.image || null);
            setProfileImageFile(null);
            setError(null);
            setSuccess(false);
        }
    }, [profileData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError(null);
        setSuccess(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
            setError(null);
            setSuccess(false);
        }
    };

    const handleImageRemove = () => {
        setProfileImageFile(new File([], "null", { type: "application/json" }));
        setProfileImagePreview(null);
        setSuccess(false);
        setError(null);
    };

    const buildSkillsArray = () => {
        return formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!profileData?.username) {
            setError("Username topilmadi. Profilni yangilab bo‘lmadi.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const isFileUpdate = profileImageFile !== null;
        let dataToSend;

        if (isFileUpdate) {
            dataToSend = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key !== "skills") {
                    dataToSend.append(key, formData[key] ?? "");
                }
            });

            buildSkillsArray().forEach((skill) => {
                dataToSend.append("skills", skill);
            });

            if (profileImageFile) {
                if (profileImageFile.name === "null") {
                    dataToSend.append("image", "");
                } else {
                    dataToSend.append("image", profileImageFile);
                }
            }
        } else {
            dataToSend = {
                ...formData,
                birthday: formData.birthday || null,
                email: formData.email || "",
                skills: buildSkillsArray(),
            };
        }

        try {
            const response = await ProfileService.updateProfile(
                profileData.username,
                dataToSend
            );

            dispatch(getProfileSuccess(response));

            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            console.error("Profilni tahrirlashda xato:", err);

            let errorMessage = "Ma'lumotlarni saqlashda xato yuz berdi.";

            try {
                const parsed = JSON.parse(err.message);

                if (parsed.email) {
                    errorMessage = `Email: ${parsed.email[0]}`;
                } else if (parsed.birthday) {
                    errorMessage = `Tug‘ilgan sana: ${parsed.birthday[0]}`;
                } else if (parsed.detail) {
                    errorMessage = parsed.detail;
                } else {
                    errorMessage = err.message;
                }
            } catch {
                errorMessage = err.message || errorMessage;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target.id === "modal-backdrop") {
            onClose();
        }
    };

    return (
        <div
            id="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={handleBackgroundClick}
        >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-800/95 p-6 backdrop-blur">
                    <div>
                        <h2 className="text-2xl font-black text-white">
                            Profilni tahrirlash
                        </h2>
                        <p className="mt-1 text-sm font-medium text-gray-400">
                            Shaxsiy, kasbiy va ijtimoiy ma’lumotlaringizni yangilang
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                        type="button"
                    >
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5 p-6">
                    {/* PROFIL RASMI */}
                    <div className="space-y-4 border-b border-gray-700 pb-5">
                        <h3 className="col-span-full text-lg font-bold text-indigo-400">
                            <i className="fa-solid fa-camera-retro mr-2"></i>
                            Profil rasmi
                        </h3>

                        <div className="mx-auto flex w-fit flex-col items-center rounded-xl border border-gray-700 bg-gray-700/30 p-4">
                            <label className="mb-2 text-sm font-semibold text-gray-300">
                                Profil rasmini yuklash
                            </label>

                            <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500 bg-gray-700">
                                {profileImagePreview ? (
                                    <img
                                        src={profileImagePreview}
                                        alt="Profil rasmi"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <i className="fa-solid fa-user text-3xl text-gray-500"></i>
                                )}
                            </div>

                            <input
                                type="file"
                                id="profileImage"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            <div className="mt-2 flex gap-2">
                                <label
                                    htmlFor="profileImage"
                                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                                >
                                    <i className="fa-solid fa-upload mr-1"></i>
                                    Yuklash
                                </label>

                                {(profileImagePreview || profileImageFile) && (
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
                                    >
                                        <i className="fa-solid fa-trash-alt mr-1"></i>
                                        O‘chirish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SHAXSIY MA'LUMOTLAR */}
                    <div className="grid grid-cols-1 gap-4 border-b border-gray-700 pb-5 md:grid-cols-2">
                        <h3 className="col-span-full text-lg font-bold text-indigo-400">
                            <i className="fa-solid fa-user-edit mr-2"></i>
                            Shaxsiy ma’lumotlar
                        </h3>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Ism
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Ism"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Familiya
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Familiya"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Email
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 pl-10 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Email manzilingiz profil va tizim xabarlari uchun ishlatiladi.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Tug‘ilgan sana
                            </label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Masalan: 2004-05-28
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Manzil
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Masalan: Tashkent, Uzbekistan"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Men haqimda
                            </label>
                            <textarea
                                name="about_me"
                                placeholder="Men haqimda..."
                                value={formData.about_me}
                                onChange={handleChange}
                                rows="4"
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* KASBIY MA'LUMOTLAR */}
                    <div className="grid grid-cols-1 gap-4 border-b border-gray-700 pb-5 md:grid-cols-2">
                        <h3 className="col-span-full text-lg font-bold text-indigo-400">
                            <i className="fa-solid fa-laptop-code mr-2"></i>
                            Kasbiy ma’lumotlar
                        </h3>

                        <div className="relative">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Daraja
                            </label>
                            <select
                                name="skill_level"
                                value={formData.skill_level}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-lg border border-gray-600 bg-gray-700 p-3 pr-8 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                {SKILL_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                            <i className="fa-solid fa-chevron-down pointer-events-none absolute bottom-4 right-3 text-gray-400"></i>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Kompaniya
                            </label>
                            <input
                                type="text"
                                name="company"
                                placeholder="Kompaniya"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Lavozim
                            </label>
                            <input
                                type="text"
                                name="position"
                                placeholder="Backend Developer"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Ko‘nikmalar
                            </label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="Python, Django, React, CSS"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <p className="mt-1 flex items-center text-xs text-gray-500">
                                <i className="fa-solid fa-info-circle mr-1"></i>
                                Ko‘nikmalarni vergul bilan ajratib yozing.
                            </p>
                        </div>
                    </div>

                    {/* IJTIMOIY TARMOQLAR */}
                    <div className="grid grid-cols-1 gap-4 border-b border-gray-700 pb-5 md:grid-cols-2">
                        <h3 className="col-span-full text-lg font-bold text-indigo-400">
                            <i className="fa-solid fa-share-alt mr-2"></i>
                            Ijtimoiy tarmoqlar
                        </h3>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                Veb-sayt
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="website_url"
                                    placeholder="https://dimodev.uz"
                                    value={formData.website_url}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 pl-10 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                                GitHub
                            </label>
                            <div className="relative">
                                <i className="fa-brands fa-github absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="github_url"
                                    placeholder="github.com/username yoki username"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 pl-10 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TAHRIRLAB BO‘LMAYDIGAN */}
                    <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-3 text-sm text-gray-500">
                        <p className="mb-1 flex items-center font-semibold text-gray-300">
                            <i className="fa-solid fa-lock mr-2 text-red-400"></i>
                            Tahrirlab bo‘lmaydigan ma’lumotlar
                        </p>
                        <ul className="ml-2 list-inside list-disc">
                            <li>
                                <b>username, id, coins</b> — tizim tomonidan boshqariladi
                            </li>
                            <li>
                                <b>date_joined</b> — avtomatik sana
                            </li>
                            <li>
                                <b>cover_image</b> — alohida “Fon rasmi” tugmasi orqali tahrirlanadi
                            </li>
                        </ul>
                    </div>

                    {error && (
                        <div className="flex items-start rounded-lg border border-red-700 bg-red-900/50 p-3 text-sm text-red-400">
                            <i className="fa-solid fa-exclamation-triangle mr-2 mt-1"></i>
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center rounded-lg border border-green-700 bg-green-900/50 p-3 text-sm font-semibold text-green-400">
                            <i className="fa-solid fa-check-circle mr-2"></i>
                            Profil muvaffaqiyatli saqlandi!
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-600 px-5 py-2 font-semibold text-white transition-all hover:bg-gray-500"
                        >
                            Bekor qilish
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Saqlanmoqda...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-save"></i>
                                    <span>Saqlash</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;