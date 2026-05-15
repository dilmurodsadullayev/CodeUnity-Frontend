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

const ProblemResponse = ({ id, isOwner, isSolved, onAcceptSolution }) => {
  const dispatch = useDispatch();

  const { problemResponses, isLoading } = useSelector(
    (state) => state.problemResponse
  );

  const responsesArray = Array.isArray(problemResponses)
    ? problemResponses
    : problemResponses
    ? [problemResponses]
    : [];

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

        const fetchedResponses = Array.isArray(response)
          ? response
          : response
          ? [response]
          : [];

        dispatch(getProblemResponseSuccess(fetchedResponses));

        const initialUserStars = {};

        fetchedResponses.forEach((res) => {
          initialUserStars[res.id] = res.star_by_user;
        });

        setUserStars(initialUserStars);
      } catch (error) {
        console.error("Yechimlarni yuklashda xatolik yuz berdi:", error);

        showAlert({
          type: "error",
          title: "Yechimlar yuklanmadi",
          message: "Problemga berilgan yechimlarni yuklashda xatolik yuz berdi.",
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
      const alreadyStarred = userStars[responseId];
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
      console.error("Yulduz qo‘yish/olib tashlashda xatolik yuz berdi:", error);

      showAlert({
        type: "error",
        title: "Yulduzcha xatosi",
        message: "Yulduz qo‘yish yoki olib tashlashda xatolik yuz berdi.",
        code: "STAR_ACTION_FAILED",
        duration: 5000,
      });
    }
  };

  return (
    <section className="relative bg-gray-900 px-4 py-12 text-gray-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-center text-4xl font-extrabold text-white animate-fade-in-up">
          {responsesArray.length > 0
            ? `${responsesArray.length} ta Ajoyib Yechim`
            : "Yechimlar mavjud emas"}
        </h2>

        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <div
              key={i}
              className="mb-8 animate-pulse rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center">
                  <div className="mr-5 h-16 w-16 rounded-full border-2 border-gray-600 bg-gray-700"></div>

                  <div>
                    <div className="mb-2 h-6 w-40 rounded bg-gray-700"></div>
                    <div className="h-4 w-32 rounded bg-gray-700"></div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="h-4 w-full rounded bg-gray-700"></div>
                <div className="h-4 w-11/12 rounded bg-gray-700"></div>
              </div>

              <div className="h-10 border-t border-gray-700 pt-6"></div>
            </div>
          ))
        ) : responsesArray.length > 0 ? (
          responsesArray.map((response, index) => {
            const isStarredByUser = userStars[response.id];
            const isCurrentSolution = response.is_selected;
            const showAcceptButton =
              isOwner && !isSolved && !isCurrentSolution;

            const userImage = getImageUrl(response?.user?.image);

            return (
              <div
                key={response.id || index}
                className={`solution-card mb-8 rounded-2xl border p-8 shadow-xl transition-all duration-300 animate-fade-in-up hover:scale-[1.01] ${
                  isCurrentSolution
                    ? "border-green-600/70 bg-green-900/30"
                    : "border-gray-700 bg-gray-800/50 hover:border-indigo-500"
                }`}
              >
                {isCurrentSolution && (
                  <div className="mb-4 flex items-center justify-end text-lg font-bold text-green-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    TO‘G‘RI YECHIM DEB QABUL QILINGAN
                  </div>
                )}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center">
                    <img
                      src={userImage || UserImage}
                      className="mr-5 h-16 w-16 rounded-full border-2 border-indigo-500 object-cover shadow-lg"
                      alt={`${response?.user?.username || "user"} avatari`}
                    />

                    <div>
                      <a
                        href="#"
                        className="block text-xl font-bold text-white transition-colors duration-200 hover:text-indigo-400"
                      >
                        {response?.user?.username || "Noma’lum foydalanuvchi"}
                      </a>

                      <div className="text-md font-medium text-gray-400">
                        {response?.user?.skill_level
                          ? `${
                              response.user.skill_level.charAt(0).toUpperCase() +
                              response.user.skill_level.slice(1)
                            } dasturchi`
                          : "Dasturchi"}
                      </div>
                    </div>
                  </div>

                  {showAcceptButton && (
                    <button
                      type="button"
                      onClick={() => onAcceptSolution(response.id)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-700"
                    >
                      <FontAwesomeIcon icon={faAward} />
                      Yechimni Qabul Qilish
                    </button>
                  )}
                </div>

                <div className="prose prose-invert mb-6 max-w-none text-lg leading-relaxed text-gray-300">
                  <p className="mb-4">{response.answer}</p>

                  {response.description && (
                    <div className="mb-6 rounded-lg bg-gray-700 p-4 shadow-inner">
                      <h4 className="mb-2 font-semibold text-indigo-300">
                        Qo‘shimcha izoh:
                      </h4>

                      <p className="text-base text-gray-300">
                        {response.description}
                      </p>
                    </div>
                  )}

                  {response.code && (
                    <div className="code-block mt-6 overflow-hidden rounded-lg bg-gray-700 shadow-2xl">
                      <div className="code-block-header flex items-center justify-between border-b border-gray-600 bg-gray-700/70 px-5 py-3 text-gray-300">
                        <span className="font-mono text-sm text-indigo-300">
                          {response.language || "Boshqa"}
                        </span>

                        <button
                          type="button"
                          className="copy-btn flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-indigo-700 hover:shadow-lg"
                          onClick={() => handleCopyCode(response.code)}
                        >
                          <FontAwesomeIcon icon={faCopy} className="mr-2" />
                          Nusxalash
                        </button>
                      </div>

                      <pre className="custom-scrollbar overflow-x-auto p-6 text-sm text-gray-50">
                        <code>{response.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-700 pt-6 sm:flex-row">
                  <div className="mb-4 flex items-center space-x-4 sm:mb-0">
                    <button
                      type="button"
                      onClick={() => handleStarClick(response.id)}
                      className="flex cursor-pointer items-center space-x-1 text-lg transition-colors duration-200"
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        className={
                          isStarredByUser
                            ? "text-yellow-500 hover:text-yellow-400"
                            : "text-gray-600 hover:text-gray-500"
                        }
                      />

                      <span className="text-base font-medium text-gray-400">
                        {response.total_stars > 0 ? response.total_stars : 0}
                      </span>
                    </button>

                    <Link
                      to={`/problem/${id}/solution/${response?.id}/edit`}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-500"
                    >
                      <i className="fas fa-edit"></i>
                      Tahrirlash
                    </Link>
                  </div>

                  <span className="text-sm font-medium text-gray-500">
                    {timeAgo(response.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="animate-fade-in py-20 text-center text-2xl font-semibold text-gray-400">
            <FontAwesomeIcon
              icon={faRocket}
              className="mx-auto mb-4 block text-4xl text-indigo-500"
            />
            Hali hech qanday javob qo‘shilmagan! Birinchisi bo‘ling 🚀
          </div>
        )}
      </div>

      <SiteAlert alert={siteAlert} onClose={() => setSiteAlert(null)} />
    </section>
  );
};

export default ProblemResponse;