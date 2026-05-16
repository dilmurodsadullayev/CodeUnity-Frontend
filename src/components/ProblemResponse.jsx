import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProblemResponseStart,
  getProblemResponseSuccess,
} from "../features/problemResponse/problemResponse";
import ProblemResponseService from "../services/problemResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCopy,
  faRocket,
  faCheckCircle,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import UserImage from "../assests/userImage.jpeg";
import timeAgo from "../utils/timeAgo";
import SiteAlert from "./SiteAlert";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
};

const normalizeResponses = (data) => {
  if (Array.isArray(data)) return data;

  if (data?.results && Array.isArray(data.results)) {
    return data.results;
  }

  if (data) return [data];

  return [];
};

const ProblemResponse = ({ id, isOwner, isSolved, onAcceptSolution }) => {
  const dispatch = useDispatch();

  const { problemResponses, isLoading } = useSelector(
    (state) => state.problemResponse
  );

  const { user: authUser } = useSelector((state) => state.auth);

  const responsesArray = normalizeResponses(problemResponses);

  const [userStars, setUserStars] = useState({});
  const [siteAlert, setSiteAlert] = useState(null);

  const showAlert = ({
    type = "info",
    title = "FSociety",
    message = "",
    code,
    duration = 3500,
  }) => {
    setSiteAlert({
      id: Date.now(),
      type,
      title,
      message,
      code,
      duration,
    });
  };

  useEffect(() => {
    const getProblemResponse = async () => {
      dispatch(getProblemResponseStart());

      try {
        const response = await ProblemResponseService.getProblemResponse(id);
        const fetchedResponses = normalizeResponses(response);

        dispatch(getProblemResponseSuccess(fetchedResponses));

        const initialUserStars = {};

        fetchedResponses.forEach((res) => {
          initialUserStars[res.id] = Boolean(res.star_by_user);
        });

        setUserStars(initialUserStars);
      } catch (error) {
        console.error("Yechimlarni yuklashda xatolik yuz berdi:", error);

        showAlert({
          type: "error",
          title: "Yechimlar yuklanmadi",
          message:
            "Problemga berilgan yechimlarni yuklashda xatolik yuz berdi.",
          code: "RESPONSES_FETCH_FAILED",
          duration: 5000,
        });
      }
    };

    if (id) {
      getProblemResponse();
    }
  }, [id, dispatch]);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code || "");

      showAlert({
        type: "success",
        title: "Kod nusxalandi",
        message: "Yechim kodi clipboardga muvaffaqiyatli nusxalandi.",
        code: "CODE_COPIED",
        duration: 2500,
      });
    } catch (error) {
      console.error("Kod nusxalashda xatolik:", error);

      showAlert({
        type: "error",
        title: "Nusxalashda xatolik",
        message: "Kodni nusxalashda xatolik yuz berdi.",
        code: "COPY_FAILED",
        duration: 4000,
      });
    }
  };

  const handleStarClick = async (responseId) => {
    try {
      const alreadyStarred = Boolean(userStars[responseId]);
      const currentResponse = responsesArray.find(
        (res) => res.id === responseId
      );

      if (!currentResponse) {
        showAlert({
          type: "error",
          title: "Yechim topilmadi",
          message: "Ushbu yechim ma’lumotlari topilmadi.",
          code: "RESPONSE_NOT_FOUND",
        });
        return;
      }

      let updatedResponse;

      if (alreadyStarred) {
        await ProblemResponseService.removeStar(responseId);

        updatedResponse = {
          ...currentResponse,
          total_stars: Math.max((currentResponse.total_stars || 1) - 1, 0),
          star_by_user: false,
        };

        showAlert({
          type: "info",
          title: "Yulduzcha olib tashlandi",
          message: "Siz bu yechimdan yulduzchangizni olib tashladingiz.",
          code: "STAR_REMOVED",
          duration: 2500,
        });
      } else {
        await ProblemResponseService.addStar(responseId);

        updatedResponse = {
          ...currentResponse,
          total_stars: (currentResponse.total_stars || 0) + 1,
          star_by_user: true,
        };

        showAlert({
          type: "success",
          title: "Yulduzcha qo‘yildi",
          message: "Yechimga yulduzcha muvaffaqiyatli qo‘yildi.",
          code: "STAR_ADDED",
          duration: 2500,
        });
      }

      setUserStars((prev) => ({
        ...prev,
        [responseId]: !alreadyStarred,
      }));

      dispatch(
        getProblemResponseSuccess(
          responsesArray.map((res) =>
            res.id === responseId ? updatedResponse : res
          )
        )
      );
    } catch (error) {
      console.error("Yulduz qo‘yish/olib tashlashda xatolik:", error);

      showAlert({
        type: "error",
        title: "Yulduzcha xatosi",
        message: "Yulduz qo‘yish yoki olib tashlashda xatolik yuz berdi.",
        code: "STAR_ACTION_FAILED",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gray-700/60"></div>

                <div>
                  <div className="mb-2 h-4 w-36 rounded bg-gray-700/60"></div>
                  <div className="h-3 w-24 rounded bg-gray-700/60"></div>
                </div>
              </div>

              <div className="h-9 w-24 rounded-2xl bg-gray-700/60"></div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-700/60"></div>
              <div className="h-4 w-11/12 rounded bg-gray-700/60"></div>
              <div className="h-4 w-8/12 rounded bg-gray-700/60"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (responsesArray.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-cyan-400/20 bg-cyan-400/5 px-5 py-14 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
          <FontAwesomeIcon icon={faRocket} className="text-2xl" />
        </div>

        <h3 className="text-2xl font-black text-white">
          Hali hech qanday yechim yo‘q
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Birinchi bo‘lib yechim yozing. Yaxshi javob ko‘proq star va community
          ishonchini olib keladi.
        </p>

        <SiteAlert alert={siteAlert} onClose={() => setSiteAlert(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {responsesArray.map((response, index) => {
        const isStarredByUser = Boolean(userStars[response.id]);
        const isCurrentSolution = Boolean(response.is_selected);

        const showAcceptButton =
          isOwner && !isSolved && !isCurrentSolution;

        const isResponseOwner =
          authUser?.username &&
          response?.user?.username &&
          authUser.username === response.user.username;

        const userImage = getImageUrl(response?.user?.image);

        return (
          <article
            key={response.id || index}
            className={`group relative overflow-hidden rounded-[2rem] border p-5 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 md:p-6 ${
              isCurrentSolution
                ? "border-green-400/30 bg-green-500/10"
                : "border-white/10 bg-white/[0.035] hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
            }`}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:bg-cyan-500/20" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />

            <div className="relative z-10">
              {/* ACCEPTED BADGE */}
              {isCurrentSolution && (
                <div className="mb-5 flex items-center justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-300">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    To‘g‘ri yechim deb qabul qilingan
                  </span>
                </div>
              )}

              {/* HEADER */}
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Link
                    to={`/${response?.user?.username || "user"}/profile`}
                    className="shrink-0"
                  >
                    <img
                      src={userImage || UserImage}
                      className="h-13 w-13 h-[52px] w-[52px] rounded-2xl border border-cyan-400/20 object-cover shadow-lg transition-all group-hover:border-cyan-400/50"
                      alt={`${response?.user?.username || "user"} avatari`}
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/${response?.user?.username || "user"}/profile`}
                      className="block truncate text-base font-black text-white transition-colors hover:text-cyan-300 md:text-lg"
                    >
                      @{response?.user?.username || "noma_lum"}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-gray-500">
                      <span>
                        {response?.user?.skill_level
                          ? `${
                              response.user.skill_level.charAt(0).toUpperCase() +
                              response.user.skill_level.slice(1)
                            } dasturchi`
                          : "Dasturchi"}
                      </span>

                      <span className="hidden text-gray-700 sm:inline">/</span>

                      <span>{timeAgo(response.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {showAcceptButton && (
                    <button
                      type="button"
                      onClick={() => onAcceptSolution(response.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-2 text-xs font-black text-green-300 transition-all hover:bg-green-500/20"
                    >
                      <FontAwesomeIcon icon={faAward} />
                      Qabul qilish
                    </button>
                  )}

                  {isResponseOwner && !isSolved && (
                    <Link
                      to={`/problem/${id}/solution/${response?.id}/edit`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black text-blue-300 transition-all hover:bg-blue-500/20"
                    >
                      <i className="fas fa-edit"></i>
                      Tahrirlash
                    </Link>
                  )}
                </div>
              </div>

              {/* ANSWER */}
              <div className="rounded-3xl border border-white/10 bg-[#050816]/40 p-4 md:p-5">
                <p className="break-words text-sm leading-7 text-gray-300 md:text-base md:leading-8">
                  {response.answer || "Yechim matni kiritilmagan."}
                </p>
              </div>

              {/* DESCRIPTION */}
              {response.description && (
                <div className="mt-4 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-4 md:p-5">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300">
                    Qo‘shimcha izoh
                  </p>

                  <p className="break-words text-sm leading-7 text-gray-300 md:text-base">
                    {response.description}
                  </p>
                </div>
              )}

              {/* CODE */}
              {response.code && (
                <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#050816] shadow-2xl shadow-black/20">
                  <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Solution Code
                      </p>

                      <h4 className="text-sm font-black text-white">
                        {response.language || "Boshqa"}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(response.code)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-black text-indigo-300 transition-all hover:bg-indigo-500/20"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      Nusxalash
                    </button>
                  </div>

                  <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-gray-200 sm:p-5 sm:text-sm">
                    <code>{response.code}</code>
                  </pre>
                </div>
              )}

              {/* FOOTER */}
              <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => handleStarClick(response.id)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-all sm:w-auto ${
                    isStarredByUser
                      ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                      : "border-white/10 bg-white/[0.035] text-gray-400 hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-300"
                  }`}
                  title={
                    isStarredByUser
                      ? "Yulduzchani olib tashlash"
                      : "Yulduzcha qo‘yish"
                  }
                >
                  <FontAwesomeIcon icon={faStar} />

                  <span>
                    {isStarredByUser ? "Yulduzcha berilgan" : "Yulduzcha"}
                  </span>

                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs">
                    {response.total_stars > 0 ? response.total_stars : 0}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 sm:justify-end">
                  <i className="fas fa-clock text-cyan-300"></i>
                  <span>{timeAgo(response.created_at)}</span>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <SiteAlert alert={siteAlert} onClose={() => setSiteAlert(null)} />
    </div>
  );
};

export default ProblemResponse;