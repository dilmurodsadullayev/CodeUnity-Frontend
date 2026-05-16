import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteProblemStarFailure,
  deleteProblemStarStart,
  deleteProblemStarSuccess,
  getProblemDetailFailure,
  getProblemDetailStart,
  getProblemDetailSuccess,
  postProblemStarStart,
  postProblemStarSuccess,
  acceptSolutionStart,
  acceptSolutionSuccess,
  acceptSolutionFailure,
} from "../features/problems/Problems";
import ProblemService from "../services/problems";
import UserImage from "../assests/userImage.jpeg";
import ProblemResponse from "./ProblemResponse";
import ProblemResponseForm from "./ProblemResponseForm";
import CountdownTimer from "../utils/countdowntimer";
import timeAgo from "../utils/timeAgo";
import SimilarProblems from "./SimilarProblems";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [copied, setCopied] = useState(false);
  const responseFormRef = useRef(null);

  const { problemDetail, isLoading } = useSelector((state) => state.problem);
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?.username === problemDetail?.user?.username;

  const getProblemDetail = async () => {
    dispatch(getProblemDetailStart());

    try {
      const response = await ProblemService.getProblemDetail(id);
      dispatch(getProblemDetailSuccess(response));
    } catch (error) {
      console.error("Problem detail olishda xatolik:", error);
      dispatch(getProblemDetailFailure());
    }
  };

  useEffect(() => {
    getProblemDetail();
  }, [id]);

  const handleCopy = () => {
    if (!problemDetail?.code) return;

    navigator.clipboard.writeText(problemDetail.code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleStarClick = async (problemId) => {
    if (problemDetail?.star_by_user) return;

    dispatch(postProblemStarStart());

    try {
      const response = await ProblemService.addStar(problemId);
      dispatch(postProblemStarSuccess(response));
      await getProblemDetail();
    } catch (error) {
      console.error("Star qo‘shishda xatolik ❌", error);
    }
  };

  const handleStarDeleteClick = async (problemId) => {
    if (!problemDetail?.star_by_user) return;

    dispatch(deleteProblemStarStart());

    try {
      const response = await ProblemService.removeStar(problemId);
      dispatch(deleteProblemStarSuccess(response));
      await getProblemDetail();
    } catch (error) {
      dispatch(deleteProblemStarFailure(error));
      console.error("Star olib tashlashda xatolik ❌", error);
    }
  };

  const handleEditProblem = () => {
    navigate(`/problem/${id}/edit`);
  };

  const handleDeleteProblem = async () => {
    const confirmed = window.confirm(
      "Bu muammoni o‘chirishga ishonchingiz komilmi?"
    );

    if (!confirmed) return;

    try {
      await ProblemService.deleteProblem(id);
      alert("Muammo muvaffaqiyatli o‘chirildi!");
      navigate("/problems");
    } catch (error) {
      console.error("Muammoni o‘chirishda xatolik:", error);
      alert("Muammoni o‘chirishda xatolik yuz berdi!");
    }
  };

  const handleWorkClick = () => {
    if (problemDetail?.is_solved) return;

    if (responseFormRef.current) {
      responseFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAcceptSolution = async (solutionId) => {
    if (!isOwner) {
      alert("Faqat muammo egasi yechimni qabul qila oladi.");
      return;
    }

    if (problemDetail?.is_solved) {
      alert("Bu muammo allaqachon yechilgan.");
      return;
    }

    const confirmed = window.confirm(
      "Bu yechimni to‘g‘ri deb qabul qilishga ishonchingiz komilmi?"
    );

    if (!confirmed) return;

    dispatch(acceptSolutionStart());

    try {
      const response = await ProblemService.acceptSolution(id, solutionId);
      dispatch(acceptSolutionSuccess(response));
      alert("✅ Yechim muvaffaqiyatli qabul qilindi!");
      await getProblemDetail();
    } catch (error) {
      const message = error.response?.data?.detail || error.message;

      dispatch(acceptSolutionFailure(message));
      alert("❌ Yechimni qabul qilishda xato yuz berdi: " + message);
    }
  };

  if (isLoading || !problemDetail) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0d1117] p-10 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <i className="fas fa-spinner fa-spin text-2xl"></i>
          </div>

          <h2 className="text-xl font-black text-white">
            Muammo yuklanmoqda...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Iltimos, bir necha soniya kuting.
          </p>
        </div>
      </main>
    );
  }

  const authorImage = getImageUrl(problemDetail?.user?.image);

  const responseCount =
    problemDetail?.total_responses ||
    problemDetail?.response_count ||
    problemDetail?.responses_count ||
    problemDetail?.responses?.length ||
    0;

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 lg:py-12">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117] p-5 shadow-2xl shadow-black/30 md:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />

              <div className="relative z-10">
                {/* STATUS BADGES */}
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  {problemDetail?.is_solved ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-300">
                      <i className="fas fa-check-circle"></i>
                      Yechilgan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-300">
                      <i className="fas fa-hourglass-half"></i>
                      Yechilmagan
                    </span>
                  )}

                  {problemDetail?.star_by_user && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-300">
                      <i className="fas fa-star"></i>
                      Siz star berdingiz
                    </span>
                  )}

                  {problemDetail?.is_urgent && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-300">
                      <i className="fas fa-bolt"></i>
                      Tezkor
                    </span>
                  )}

                  {problemDetail?.offered_coins > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-300">
                      <i className="fas fa-coins"></i>
                      {problemDetail.offered_coins} FCoin
                    </span>
                  )}
                </div>

                {/* LANGUAGES */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {problemDetail?.language_data?.length > 0 ? (
                    problemDetail.language_data.map((language) => (
                      <span
                        key={language.id || language.name}
                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300"
                      >
                        {language.name}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-bold text-gray-500">
                      Til belgilanmagan
                    </span>
                  )}
                </div>

                {/* TITLE + OWNER ACTIONS */}
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-gray-600">
                      fsociety://problem/{problemDetail?.id}
                    </p>

                    <h1 className="break-words text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                      {problemDetail?.problem}
                    </h1>
                  </div>

                  {isOwner && (
                    <div className="flex shrink-0 flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleEditProblem}
                        className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-black text-blue-300 transition-all hover:bg-blue-500/20"
                      >
                        <i className="fas fa-edit"></i>
                        Tahrirlash
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteProblem}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300 transition-all hover:bg-red-500/20"
                      >
                        <i className="fas fa-trash-alt"></i>
                        O‘chirish
                      </button>
                    </div>
                  )}
                </div>

                {/* AUTHOR */}
                <div className="mb-7 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 text-sm text-gray-400 sm:flex-row sm:items-center">
                  <img
                    src={authorImage || UserImage}
                    className="h-12 w-12 shrink-0 rounded-2xl border border-cyan-400/20 object-cover"
                    alt="Avatar"
                  />

                  <div className="min-w-0 flex-1">
                    <a
                      href={`/${problemDetail?.user?.username}/profile/`}
                      className="block truncate text-base font-black text-white hover:text-cyan-300"
                    >
                      @{problemDetail?.user?.username}
                    </a>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-gray-500">
                      <span>{timeAgo(problemDetail?.created_at)} so‘ralgan</span>
                      <span className="hidden text-gray-700 sm:inline">/</span>
                      <span>{problemDetail?.total_views || 0} marta ko‘rilgan</span>
                      <span className="hidden text-gray-700 sm:inline">/</span>
                      <span>{responseCount} ta yechim</span>
                    </div>
                  </div>
                </div>

                {/* URGENT / DEADLINE */}
                {(problemDetail?.is_urgent ||
                  problemDetail?.offered_coins ||
                  problemDetail?.deadline) && (
                  <div
                    className={`mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border p-5 md:flex-row md:items-center ${
                      problemDetail?.is_urgent
                        ? "border-red-400/30 bg-red-500/10 shadow-xl shadow-red-500/5"
                        : "border-white/10 bg-white/[0.035]"
                    }`}
                  >
                    <div className="flex flex-wrap gap-3">
                      {problemDetail?.is_urgent && (
                        <div className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300">
                          <i className="fas fa-bolt mr-2"></i>
                          Favqulodda muammo
                        </div>
                      )}

                      {problemDetail?.offered_coins > 0 && (
                        <div className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
                          <i className="fas fa-coins mr-2"></i>
                          Mukofot: {problemDetail.offered_coins} FCoin
                        </div>
                      )}

                      {problemDetail?.deadline && (
                        <div className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-black text-indigo-300">
                          <i className="fas fa-clock mr-2"></i>
                          Muddat:
                          <span className="ml-1">
                            <CountdownTimer targetDate={problemDetail.deadline} />
                          </span>
                        </div>
                      )}
                    </div>

                    {!problemDetail?.is_solved && (
                      <button
                        type="button"
                        onClick={handleWorkClick}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-1 hover:shadow-cyan-500/40 md:w-auto"
                      >
                        <i className="fas fa-hammer"></i>
                        Men ishlayman!
                      </button>
                    )}
                  </div>
                )}

                {/* REDDIT STYLE CONTENT */}
                <div className="flex gap-3 md:gap-5">
                  {/* LEFT VOTE COLUMN */}
                  <aside className="shrink-0">
                    <div className="sticky top-28 flex w-[58px] flex-col items-center rounded-3xl border border-white/10 bg-[#111827]/90 p-2 shadow-xl shadow-black/20 sm:w-[70px] sm:p-3">
                      {/* ADD STAR */}
                      <button
                        type="button"
                        onClick={() => handleStarClick(problemDetail.id)}
                        disabled={problemDetail?.star_by_user}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all sm:h-12 sm:w-12 ${
                          problemDetail?.star_by_user
                            ? "cursor-not-allowed border-green-400/30 bg-green-500/10 text-green-300"
                            : "border-green-400/20 bg-green-500/10 text-green-300 hover:scale-105 hover:bg-green-500/20"
                        }`}
                        title={
                          problemDetail?.star_by_user
                            ? "Siz allaqachon star bergansiz"
                            : "Star berish"
                        }
                      >
                        <i className="fas fa-arrow-up text-xl sm:text-2xl"></i>
                      </button>

                      {/* COUNT */}
                      <span className="my-3 text-2xl font-black text-white sm:text-3xl">
                        {problemDetail?.star ?? 0}
                      </span>

                      {/* REMOVE STAR */}
                      <button
                        type="button"
                        onClick={() => handleStarDeleteClick(problemDetail.id)}
                        disabled={!problemDetail?.star_by_user}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all sm:h-12 sm:w-12 ${
                          problemDetail?.star_by_user
                            ? "border-red-400/30 bg-red-500/10 text-red-300 hover:scale-105 hover:bg-red-500/20"
                            : "cursor-not-allowed border-white/10 bg-white/[0.035] text-gray-600"
                        }`}
                        title={
                          problemDetail?.star_by_user
                            ? "Starni olib tashlash"
                            : "Avval star bering"
                        }
                      >
                        <i className="fas fa-arrow-down text-xl sm:text-2xl"></i>
                      </button>

                      {/* STAR STATUS */}
                      <div
                        className={`mt-3 flex h-8 w-8 items-center justify-center rounded-xl border text-xs sm:h-9 sm:w-9 ${
                          problemDetail?.star_by_user
                            ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                            : "border-white/10 bg-white/[0.035] text-gray-600"
                        }`}
                        title={
                          problemDetail?.star_by_user
                            ? "Star berilgan"
                            : "Star berilmagan"
                        }
                      >
                        <i
                          className={
                            problemDetail?.star_by_user
                              ? "fas fa-check"
                              : "far fa-star"
                          }
                        ></i>
                      </div>
                    </div>
                  </aside>

                  {/* ARTICLE CONTENT */}
                  <article className="min-w-0 flex-1">
                    {/* DESCRIPTION */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                      <h2 className="mb-3 text-lg font-black text-white sm:text-xl">
                        Muammo tavsifi
                      </h2>

                      <p className="break-words text-sm leading-7 text-gray-300 sm:text-base md:text-lg md:leading-8">
                        {problemDetail?.description}
                      </p>
                    </div>

                    {/* CODE */}
                    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#050816] shadow-2xl shadow-black/20">
                      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Error Code
                          </p>

                          <h3 className="text-sm font-black text-white">
                            ❌ Xatolik bo‘lgan kod
                          </h3>
                        </div>

                        {problemDetail?.code && (
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-black text-indigo-300 transition-all hover:bg-indigo-500/20"
                          >
                            <i className="fas fa-copy"></i>
                            {copied ? "Nusxalandi" : "Nusxalash"}
                          </button>
                        )}
                      </div>

                      {problemDetail?.code ? (
                        <pre className="max-h-[520px] overflow-auto bg-[#050816] p-4 text-xs leading-relaxed text-gray-200 sm:p-5 sm:text-sm">
                          <code>{problemDetail?.code}</code>
                        </pre>
                      ) : (
                        <p className="p-5 text-base italic text-gray-400">
                          Kod mavjud emas.
                        </p>
                      )}
                    </div>

                    <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 sm:p-5">
                      <p className="text-sm leading-6 text-cyan-100">
                        <i className="fas fa-lightbulb mr-2 text-yellow-300"></i>
                        Ushbu muammoni optimallashtirish uchun eng to‘g‘ri
                        yondashuv qanday? O‘z yechimingizni pastda qoldiring.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* RESPONSES */}
            <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/30">
              <div className="border-b border-white/10 bg-[#0d1117]/95 px-5 py-5 backdrop-blur md:px-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-gray-600">
                      fsociety://solutions
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      Yechimlar
                      <span className="ml-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                        {responseCount}
                      </span>
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Javoblar ko‘payib ketsa, shu blok ichida alohida scroll
                      bo‘ladi.
                    </p>
                  </div>

                  {!problemDetail?.is_solved && (
                    <button
                      type="button"
                      onClick={handleWorkClick}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-black text-cyan-300 transition-all hover:bg-cyan-400/20"
                    >
                      <i className="fas fa-pen-nib"></i>
                      Yechim yozish
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[780px] overflow-y-auto px-4 py-5 md:px-6 lg:max-h-[850px]">
                <ProblemResponse
                  id={id}
                  isOwner={isOwner}
                  isSolved={problemDetail?.is_solved}
                  onAcceptSolution={handleAcceptSolution}
                />
              </div>
            </section>

            {/* RESPONSE FORM */}
            {!problemDetail?.is_solved ? (
              <section
                ref={responseFormRef}
                className="mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#0d1117] p-5 shadow-2xl shadow-cyan-500/5 md:p-7"
              >
                <div className="mb-5">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-gray-600">
                    fsociety://new-solution
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    O‘z yechimingizni yozing
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Kodingizni, tushuntirishingizni va qanday qilib xatoni
                    tuzatganingizni aniq yozing.
                  </p>
                </div>

                <ProblemResponseForm id={id} />
              </section>
            ) : (
              <section className="mt-8 rounded-[2rem] border border-green-400/20 bg-green-500/10 p-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>

                <h3 className="text-xl font-black text-white">
                  Bu muammo yechilgan
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Yangi yechim yozish yopilgan. Mavjud yechimlarni yuqoridagi
                  blokda ko‘rishingiz mumkin.
                </p>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SimilarProblems problemId={id} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProblemDetail;