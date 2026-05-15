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
    dispatch(postProblemStarStart());

    try {
      const response = await ProblemService.addStar(problemId);
      dispatch(postProblemStarSuccess(response));
    } catch (error) {
      console.error("Star qo‘shishda xatolik ❌", error);
    }
  };

  const handleStarDeleteClick = async (problemId) => {
    dispatch(deleteProblemStarStart());

    try {
      const response = await ProblemService.removeStar(problemId);
      dispatch(deleteProblemStarSuccess(response));
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
    } catch (error) {
      const message = error.response?.data?.detail || error.message;

      dispatch(acceptSolutionFailure(message));
      alert("❌ Yechimni qabul qilishda xato yuz berdi: " + message);
    }
  };

  if (isLoading || !problemDetail) {
    return (
      <div className="p-8 text-center text-gray-400">
        Muammo yuklanmoqda...
      </div>
    );
  }

  const authorImage = getImageUrl(problemDetail?.user?.image);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="container mx-auto px-4 py-8">
            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-4">
                {problemDetail?.is_solved ? (
                  <span className="rounded-lg border border-green-600/50 bg-green-600/20 px-4 py-2 text-sm font-bold text-green-400">
                    <i className="fas fa-check-circle mr-2"></i>
                    YECHILGAN
                  </span>
                ) : (
                  <span className="rounded-lg border border-red-600/50 bg-red-600/20 px-4 py-2 text-sm font-bold text-red-400">
                    <i className="fas fa-hourglass-half mr-2"></i>
                    YECHILMAGAN
                  </span>
                )}
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {problemDetail?.language_data?.map((language) => (
                  <span
                    key={language.id || language.name}
                    className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-300"
                  >
                    {language.name}
                  </span>
                ))}
              </div>

              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <h1 className="text-3xl font-bold text-white lg:text-4xl">
                  {problemDetail?.problem}
                </h1>

                {isOwner && (
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={handleEditProblem}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-500"
                    >
                      <i className="fas fa-edit"></i>
                      Tahrirlash
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteProblem}
                      className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-500"
                    >
                      <i className="fas fa-trash-alt"></i>
                      O‘chirish
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6 flex items-center text-sm text-gray-400">
                {authorImage ? (
                  <img
                    src={authorImage}
                    className="mr-3 h-8 w-8 rounded-full object-cover"
                    alt="Avatar"
                  />
                ) : (
                  <img
                    src={UserImage}
                    className="mr-3 h-8 w-8 rounded-full"
                    alt="Avatar"
                  />
                )}

                <a
                  href={`/${problemDetail?.user?.username}/profile/`}
                  className="font-semibold text-white hover:underline"
                >
                  {problemDetail?.user?.username}
                </a>

                <span className="mx-2">&bull;</span>

                <span>{timeAgo(problemDetail?.created_at)} so‘ralgan</span>

                <span className="mx-2">&bull;</span>

                <span>{problemDetail?.total_views} marta ko‘rilgan</span>
              </div>
            </section>

            {(problemDetail?.is_urgent ||
              problemDetail?.offered_coins ||
              problemDetail?.deadline) && (
              <div
                className={`mb-8 flex flex-col items-start justify-between gap-4 rounded-xl p-5 md:flex-row md:items-center ${
                  problemDetail?.is_urgent
                    ? "border border-red-700 bg-red-900/40 shadow-xl"
                    : "border border-gray-700 bg-gray-800/50"
                } animate-fade-in-up`}
                style={{ animationDelay: "0.25s" }}
              >
                <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                  {problemDetail?.is_urgent && (
                    <div className="flex items-center rounded-full bg-red-900/30 px-3 py-1 text-sm font-bold text-red-400">
                      <i className="fas fa-bolt mr-2 text-lg"></i>
                      FAVQULODDA
                    </div>
                  )}

                  {problemDetail?.offered_coins > 0 && (
                    <div className="flex items-center rounded-full bg-yellow-900/30 px-3 py-1 text-sm font-semibold text-yellow-400">
                      <i className="fas fa-coins mr-2"></i>
                      Mukofot: {problemDetail.offered_coins} Tanga
                    </div>
                  )}

                  {problemDetail?.deadline && (
                    <div className="flex items-center rounded-full bg-indigo-900/30 px-3 py-1 text-sm font-semibold text-indigo-400">
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
                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-500 md:w-auto"
                  >
                    <i className="fas fa-hammer"></i>
                    Men ishlayman!
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 flex">
              <div
                className="mr-6 flex flex-col items-center animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <button
                  type="button"
                  onClick={() => handleStarClick(problemDetail.id)}
                  className={`text-gray-500 transition-colors ${
                    problemDetail?.star_by_user
                      ? "text-green-400"
                      : "hover:text-green-400"
                  }`}
                >
                  <i className="fas fa-arrow-up text-3xl"></i>
                </button>

                <span className="my-1 text-3xl font-bold text-white">
                  {problemDetail?.star ?? 0}
                </span>

                <button
                  type="button"
                  onClick={() => handleStarDeleteClick(problemDetail.id)}
                  className={`text-gray-500 transition-colors ${
                    problemDetail?.star_by_user
                      ? "text-red-400"
                      : "hover:text-red-400"
                  }`}
                >
                  <i className="fas fa-arrow-down text-3xl"></i>
                </button>
              </div>

              <div className="w-full">
                <article
                  className="prose prose-invert max-w-none animate-fade-in-up text-gray-300"
                  style={{ animationDelay: "0.3s" }}
                >
                  <p className="mb-3 text-lg leading-relaxed text-gray-200">
                    {problemDetail?.description}
                  </p>

                  <h3 className="mb-4 mt-6 border-b border-gray-700 pb-2 text-xl font-semibold text-white">
                    ❌ Xatolik bo‘lgan kod:
                  </h3>

                  <div className="mb-6 overflow-hidden rounded-2xl border border-gray-700 bg-[#1E1E2F] shadow-lg">
                    {problemDetail?.code ? (
                      <>
                        <div className="flex items-center justify-between bg-[#2A2A3D] px-4 py-2">
                          <span className="font-mono text-sm text-gray-400">
                            error.py{" "}
                            <span className="text-indigo-400">(Python)</span>
                          </span>

                          <button
                            type="button"
                            onClick={handleCopy}
                            className="copy-btn flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-500"
                          >
                            <i className="fas fa-copy"></i>
                            {copied ? "✅ Nusxalandi" : "Nusxalash"}
                          </button>
                        </div>

                        <pre className="overflow-x-auto bg-[#1E1E2F] p-4 text-sm leading-relaxed text-gray-200">
                          <code>{problemDetail?.code}</code>
                        </pre>
                      </>
                    ) : (
                      <p className="p-4 text-base italic text-gray-300">
                        Kod mavjud emas.
                      </p>
                    )}
                  </div>

                  <p className="text-base italic text-gray-300">
                    💡 Ushbu muammoni optimallashtirish uchun eng to‘g‘ri
                    yondashuv qanday?
                  </p>
                </article>
              </div>
            </div>

            <hr className="my-8 border-gray-700" />

            <ProblemResponse
              id={id}
              isOwner={isOwner}
              isSolved={problemDetail?.is_solved}
              onAcceptSolution={handleAcceptSolution}
            />

            <div ref={responseFormRef}>
              <ProblemResponseForm id={id} />
            </div>
          </div>
        </div>

        <aside className="mt-12 lg:col-span-4 lg:mt-0">
          <SimilarProblems problemId={id} />
        </aside>
      </div>
    </main>
  );
};

export default ProblemDetail;