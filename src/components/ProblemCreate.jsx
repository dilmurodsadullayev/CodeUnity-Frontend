import React, { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguagesStart,
  getLanguagesSuccess,
  getProblemDetailSuccess,
} from "../features/problems/Problems";
import ProblemService from "../services/problems";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SiteAlert from "./SiteAlert";

const formatBackendErrors = (errorObject) => {
  if (
    errorObject &&
    typeof errorObject === "object" &&
    !Array.isArray(errorObject)
  ) {
    let errorMessage = "Quyidagi maydonlarda xatoliklar aniqlandi:\n";

    for (const key in errorObject) {
      if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
        const errorMessages = Array.isArray(errorObject[key])
          ? errorObject[key].join(", ")
          : errorObject[key];

        const title =
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

        errorMessage += `[${title}]: ${errorMessages}\n`;
      }
    }

    return errorMessage.trim();
  }

  if (typeof errorObject === "string") {
    if (errorObject.includes("<!DOCTYPE html>")) {
      const titleMatch = errorObject.match(/<title>(.*?)<\/title>/i);
      const exceptionMatch = errorObject.match(
        /<pre class="exception_value">(.*?)<\/pre>/i
      );

      let debugInfo = "Backend Server (500 Internal Error) Xatosi:\n";

      if (titleMatch && titleMatch[1]) {
        debugInfo += `Sarlavha: ${titleMatch[1].trim()}\n`;
      }

      if (exceptionMatch && exceptionMatch[1]) {
        debugInfo += `Exception: ${exceptionMatch[1].trim()}\n`;
      }

      debugInfo += "\nTo‘liq server debug ma’lumotlari konsolda mavjud.";
      return debugInfo;
    }

    return errorObject;
  }

  return "Noma’lum server xatosi yuz berdi.";
};

const ProblemCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [problemTitle, setProblemTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [editorLanguage, setEditorLanguage] = useState("javascript");

  const [isUrgent, setIsUrgent] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [offeredCoins, setOfferedCoins] = useState("");
  const [submissionError, setSubmissionError] = useState(null);

  const [siteAlert, setSiteAlert] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { languages: availableLanguages, isLoading } = useSelector(
    (state) => state.problem
  );

  const { problemDetail } = useSelector((state) => state.problem);

  const languageList = useMemo(
    () => availableLanguages || [],
    [availableLanguages]
  );

  const showAlert = useCallback(
    ({
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
    },
    []
  );

  const fetchLanguages = useCallback(async () => {
    dispatch(getLanguagesStart());

    try {
      const response = await ProblemService.getLanguagesList();
      dispatch(getLanguagesSuccess(response));
    } catch (error) {
      console.error("Dasturlash tillarini olishda xatolik yuz berdi:", error);

      showAlert({
        type: "error",
        title: "Tillar yuklanmadi",
        message: "Dasturlash tillarini olishda xatolik yuz berdi.",
        code: "LANGUAGE_FETCH_FAILED",
      });
    }
  }, [dispatch, showAlert]);

  const resetFormStates = useCallback(() => {
    setProblemTitle("");
    setDescription("");
    setCodeSnippet("");
    setSelectedLanguages([]);
    setEditorLanguage("javascript");
    setIsUrgent(false);
    setDeadline("");
    setOfferedCoins("");
    setSubmissionError(null);
  }, []);

  const fetchProblemDetail = useCallback(
    async (problemId) => {
      setSubmissionError(null);

      try {
        const response = await ProblemService.getProblemDetail(problemId);
        dispatch(getProblemDetailSuccess(response));

        setProblemTitle(response.problem || "");
        setDescription(response.description || "");
        setCodeSnippet(response.code || "");

        setIsUrgent(response.is_urgent || false);
        setOfferedCoins(
          response.offered_coins === null || response.offered_coins === undefined
            ? ""
            : response.offered_coins
        );

        if (response.deadline) {
          try {
            const date = new Date(response.deadline);
            const formattedDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16);

            setDeadline(formattedDate);
          } catch (e) {
            console.error("Deadline formatlashda xatolik:", e);
            setDeadline("");
          }
        } else {
          setDeadline("");
        }

        if (
          response.language_data &&
          response.language_data.length > 0 &&
          languageList.length > 0
        ) {
          const initialSelected = languageList.filter((lang) =>
            response.language_data.some((pdLang) => pdLang.id === lang.id)
          );

          setSelectedLanguages(initialSelected);

          if (initialSelected.length > 0) {
            const firstLangName = initialSelected[0].name.toLowerCase();

            if (languages[firstLangName]) {
              setEditorLanguage(firstLangName);
            } else {
              setEditorLanguage("clike");
            }
          }
        } else {
          setEditorLanguage("javascript");
          setSelectedLanguages([]);
        }
      } catch (error) {
        console.error("Muammo ma’lumotlarini olishda xatolik yuz berdi:", error);

        showAlert({
          type: "error",
          title: "Muammo yuklanmadi",
          message: "Muammo ma’lumotlarini yuklashda xatolik yuz berdi.",
          code: "PROBLEM_DETAIL_FAILED",
        });

        setTimeout(() => {
          navigate("/problems");
        }, 900);
      }
    },
    [dispatch, languageList, navigate, showAlert]
  );

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    if (id && languageList.length > 0) {
      fetchProblemDetail(id);
    } else if (!id) {
      resetFormStates();
    }
  }, [id, languageList.length, fetchProblemDetail, resetFormStates]);

  const handleLanguageChange = (language) => {
    setSelectedLanguages((prev) => {
      const isAlreadySelected = prev.some((sLang) => sLang.id === language.id);

      const newSelected = isAlreadySelected
        ? prev.filter((lang) => lang.id !== language.id)
        : [...prev, language];

      if (newSelected.length > 0) {
        const firstLangName = newSelected[0].name.toLowerCase();

        if (languages[firstLangName]) {
          setEditorLanguage(firstLangName);
        } else {
          setEditorLanguage("clike");
        }
      } else {
        setEditorLanguage("javascript");
      }

      return newSelected;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);

    if (selectedLanguages.length === 0) {
      const message = "Iltimos, kamida bitta dasturlash tilini tanlang!";

      setSubmissionError(message);

      showAlert({
        type: "warning",
        title: "Til tanlanmadi",
        message,
        code: "LANGUAGE_REQUIRED",
      });

      return;
    }

    let finalDeadline = null;
    let finalOfferedCoins = null;

    if (isUrgent) {
      if (!deadline) {
        const message = "Tezkor muammo uchun deadline maydoni talab qilinadi!";

        setSubmissionError(message);

        showAlert({
          type: "warning",
          title: "Deadline kerak",
          message,
          code: "DEADLINE_REQUIRED",
        });

        return;
      }

      const coins = parseInt(offeredCoins, 10);

      if (!offeredCoins || isNaN(coins) || coins <= 0) {
        const message =
          "Tezkor muammo uchun taklif etilayotgan FCoin musbat raqam bo‘lishi kerak!";

        setSubmissionError(message);

        showAlert({
          type: "warning",
          title: "FCoin noto‘g‘ri",
          message,
          code: "FCOIN_INVALID",
        });

        return;
      }

      finalDeadline = new Date(deadline).toISOString();
      finalOfferedCoins = coins;
    } else {
      finalOfferedCoins = 0;
      finalDeadline = null;
    }

    const problemData = {
      problem: problemTitle,
      description: description,
      code: codeSnippet,
      language: selectedLanguages.map((lang) => lang.id),
      is_urgent: isUrgent,
      deadline: finalDeadline,
      offered_coins: finalOfferedCoins,
    };

    console.log("Yuborilayotgan ma’lumotlar:", problemData);

    try {
      if (id) {
        const response = await ProblemService.putProblem(id, problemData);
        console.log("Muammo muvaffaqiyatli yangilandi:", response);

        showAlert({
          type: "success",
          title: "Muammo yangilandi",
          message: "Muammo muvaffaqiyatli yangilandi.",
          code: "PROBLEM_UPDATED",
          duration: 3000,
        });
      } else {
        const response = await ProblemService.postProblem(problemData);
        console.log("Muammo muvaffaqiyatli yaratildi:", response);

        showAlert({
          type: "success",
          title: "Muammo qo‘shildi",
          message: "Yangi muammo FSociety bazasiga muvaffaqiyatli qo‘shildi.",
          code: "PROBLEM_CREATED",
          duration: 3000,
        });

        resetFormStates();
      }

      setTimeout(() => {
        navigate("/problems");
      }, 900);
    } catch (error) {
      console.error(
        `Muammoni ${id ? "yangilashda" : "yaratishda"} xatolik yuz berdi:`,
        error.response ? error.response.data : error.message
      );

      let displayError = `Muammoni ${
        id ? "yangilashda" : "yaratishda"
      } xatolik yuz berdi!`;

      if (error.response) {
        if (error.response.data) {
          if (
            typeof error.response.data === "object" &&
            !Array.isArray(error.response.data)
          ) {
            displayError = formatBackendErrors(error.response.data);
          } else if (
            typeof error.response.data === "string" &&
            error.response.data.includes("<!DOCTYPE html>")
          ) {
            displayError = formatBackendErrors(error.response.data);
          } else if (error.response.data.detail) {
            displayError += ` Detal: ${error.response.data.detail}`;
          } else {
            displayError += ` Detal: ${JSON.stringify(error.response.data)}`;
          }
        } else {
          displayError += ` Status: ${error.response.status} - ${error.response.statusText}`;
        }
      } else {
        displayError += ` Tarmoq xatosi: ${error.message}`;
      }

      setSubmissionError(displayError);

      showAlert({
        type: "error",
        title: id ? "Yangilashda xatolik" : "Yaratishda xatolik",
        message: displayError,
        code: id ? "UPDATE_FAILED" : "CREATE_FAILED",
        duration: 6000,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await ProblemService.deleteProblem(id);

      showAlert({
        type: "success",
        title: "Muammo o‘chirildi",
        message: "Tanlangan muammo muvaffaqiyatli o‘chirildi.",
        code: "PROBLEM_DELETED",
        duration: 3000,
      });

      setIsDeleteModalOpen(false);

      setTimeout(() => {
        navigate("/problems");
      }, 900);
    } catch (error) {
      console.error("Muammoni o‘chirishda xatolik yuz berdi:", error);

      showAlert({
        type: "error",
        title: "O‘chirishda xatolik",
        message: "Muammoni o‘chirishda xatolik yuz berdi.",
        code: "DELETE_FAILED",
        duration: 5000,
      });

      setIsDeleteModalOpen(false);
    }
  };

  const handleCancel = () => {
    if (id && problemDetail) {
      fetchProblemDetail(id);
    } else {
      resetFormStates();
    }

    showAlert({
      type: "info",
      title: "Bekor qilindi",
      message: "Forma o‘zgarishlari bekor qilindi.",
      code: "FORM_CANCELLED",
      duration: 2500,
    });

    setTimeout(() => {
      navigate("/problems");
    }, 700);
  };

  const getHighlighter = (lang) => {
    if (languages[lang]) {
      return (code) => highlight(code, languages[lang], lang);
    }

    return (code) => highlight(code, languages.clike, "clike");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
      <div className="absolute left-0 top-0 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute right-0 top-24 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-[130px]" />
      <div className="absolute bottom-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[110px]" />

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            <i className="fa-solid fa-terminal"></i>
            fsociety://problem/{id ? "edit" : "create"}
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                {id ? "Muammoni tahrirlash" : "Yangi muammo yaratish"}
                <span className="ml-1 animate-pulse text-gray-500">_</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
                {id ? (
                  <>
                    <span className="font-bold text-cyan-300">
                      "{problemDetail?.problem}"
                    </span>{" "}
                    muammosini yangilang va aniqroq ma’lumot kiriting.
                  </>
                ) : (
                  <>
                    Dasturlashdagi xatolikni aniq yozing, kerakli kodni joylang
                    va FSociety hamjamiyatidan tezroq yechim oling.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">
                Status
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                {id ? "Edit mode" : "Create mode"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
            </div>

            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              problem.form
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
            <div className="p-5 sm:p-7 lg:p-8">
              {submissionError && (
                <div className="mb-7 overflow-hidden rounded-2xl border border-red-400/30 bg-red-500/10">
                  <div className="border-b border-red-400/20 px-4 py-3">
                    <h3 className="font-mono text-sm font-black uppercase tracking-[0.2em] text-red-300">
                      Error detected
                    </h3>
                  </div>

                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-red-200">
                    {submissionError}
                  </pre>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label
                    htmlFor="problemTitle"
                    className="mb-2 block text-sm font-black uppercase tracking-wider text-gray-300"
                  >
                    Muammo sarlavhasi <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    id="problemTitle"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-5 py-4 text-base font-semibold text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10"
                    placeholder="Masalan: Django JWT refresh token cookie orqali ishlamayapti"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    required
                  />
                </div>

                <div
                  className={`rounded-2xl border p-5 transition duration-300 ${
                    isUrgent
                      ? "border-yellow-400/30 bg-yellow-400/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      id="isUrgent"
                      type="checkbox"
                      className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-600 bg-[#0b1020] text-yellow-400 focus:ring-yellow-400"
                      checked={isUrgent}
                      onChange={(e) => {
                        setIsUrgent(e.target.checked);

                        if (!e.target.checked) {
                          setDeadline("");
                          setOfferedCoins("");
                        }
                      }}
                    />

                    <label
                      htmlFor="isUrgent"
                      className="cursor-pointer select-none"
                    >
                      <span className="block text-base font-black text-white">
                        Tezkor muammo sifatida joylash
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-gray-400">
                        Belgilansa deadline va taklif qilinadigan FCoin miqdori
                        majburiy bo‘ladi.
                      </span>
                    </label>
                  </div>

                  {isUrgent && (
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="deadline"
                          className="mb-2 block text-sm font-bold text-gray-300"
                        >
                          Deadline <span className="text-red-400">*</span>
                        </label>

                        <input
                          type="datetime-local"
                          id="deadline"
                          className="w-full rounded-2xl border border-yellow-400/20 bg-[#0b1020] px-5 py-4 text-base text-white outline-none transition duration-300 focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          required={isUrgent}
                          min={new Date(
                            new Date().getTime() -
                              new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 16)}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="offeredCoins"
                          className="mb-2 block text-sm font-bold text-gray-300"
                        >
                          Taklif etilayotgan FCoin{" "}
                          <span className="text-red-400">*</span>
                        </label>

                        <input
                          type="number"
                          id="offeredCoins"
                          className="w-full rounded-2xl border border-yellow-400/20 bg-[#0b1020] px-5 py-4 text-base text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          placeholder="Masalan: 50"
                          value={offeredCoins}
                          onChange={(e) => setOfferedCoins(e.target.value)}
                          required={isUrgent}
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-black uppercase tracking-wider text-gray-300"
                  >
                    Muammo tavsifi <span className="text-red-400">*</span>
                  </label>

                  <textarea
                    id="description"
                    rows="6"
                    className="w-full resize-y rounded-2xl border border-white/10 bg-[#0b1020] px-5 py-4 text-base leading-7 text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10"
                    placeholder="Muammo qachon chiqyapti, qanday error beryapti, nimalarni sinab ko‘rdingiz..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Kodni bu yerga emas, pastdagi code editor ichiga yozing.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="codeSnippet"
                    className="mb-2 block text-sm font-black uppercase tracking-wider text-gray-300"
                  >
                    Kod fragmenti
                  </label>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/30 transition duration-300 focus-within:border-cyan-400/40 focus-within:ring-4 focus-within:ring-cyan-400/10">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                      </div>

                      <span className="font-mono text-xs font-black uppercase tracking-[0.18em] text-gray-500">
                        {editorLanguage}
                      </span>
                    </div>

                    <Editor
                      value={codeSnippet}
                      onValueChange={setCodeSnippet}
                      highlight={getHighlighter(editorLanguage)}
                      padding={18}
                      style={{
                        fontFamily: '"Fira Code", "Fira Mono", monospace',
                        fontSize: 15,
                        backgroundColor: "#0b1020",
                        color: "#d4d4d4",
                        minHeight: "260px",
                        lineHeight: "1.6",
                        outline: "none",
                      }}
                      className="code-editor"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Tanlangan dasturlash tiliga qarab syntax highlight ishlaydi.
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-black uppercase tracking-wider text-gray-300">
                    Dasturlash tillari <span className="text-red-400">*</span>
                  </label>

                  {isLoading ? (
                    <div className="flex flex-wrap gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 w-24 animate-pulse rounded-full bg-white/10"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {languageList && languageList.length > 0 ? (
                        languageList.map((lang) => {
                          const active = selectedLanguages.some(
                            (sLang) => sLang.id === lang.id
                          );

                          return (
                            <button
                              key={lang.id}
                              type="button"
                              onClick={() => handleLanguageChange(lang)}
                              className={`rounded-full border px-5 py-2.5 text-sm font-black transition duration-300 hover:-translate-y-0.5 ${
                                active
                                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                                  : "border-white/10 bg-white/[0.04] text-gray-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {active && (
                                <i className="fa-solid fa-check mr-2 text-xs"></i>
                              )}
                              {lang.name}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-gray-400">
                          Dasturlash tillari topilmadi.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
                  {id && (
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="rounded-2xl border border-red-400/30 bg-red-500/10 px-7 py-3 text-sm font-black text-red-300 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      O‘chirish
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-black text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                  >
                    Bekor qilish
                  </button>

                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40"
                  >
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    {id ? "Yangilash" : "Muammo qo‘shish"}
                  </button>
                </div>
              </form>
            </div>

            <aside className="border-t border-white/10 bg-[#080d18] p-5 sm:p-7 lg:border-l lg:border-t-0">
              <div className="sticky top-6 space-y-5">
                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <i className="fa-solid fa-lightbulb text-xl"></i>
                  </div>

                  <h3 className="text-lg font-black text-white">
                    Yaxshi muammo qanday yoziladi?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Sarlavha qisqa, tavsif aniq, kod fragmenti esa muammoni
                    qayta tekshirishga yetarli bo‘lishi kerak.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <h4 className="mb-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                    Checklist
                  </h4>

                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-check mt-1 text-emerald-300"></i>
                      <span>Error xabarini aniq yozing.</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-check mt-1 text-emerald-300"></i>
                      <span>Qaysi texnologiyada chiqqanini belgilang.</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-check mt-1 text-emerald-300"></i>
                      <span>Kod fragmentini alohida joylang.</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-check mt-1 text-emerald-300"></i>
                      <span>Tezkor bo‘lsa deadline va FCoin kiriting.</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <h4 className="font-black text-yellow-300">
                    <i className="fa-solid fa-coins mr-2"></i>
                    Tezkor muammo
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Tezkor muammo foydalanuvchilarga tezroq ko‘rinadi va yechim
                    bergan developer FCoin mukofot olishi mumkin.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemTitle={problemDetail?.problem || "ushbu muammoni"}
      />

      <SiteAlert alert={siteAlert} onClose={() => setSiteAlert(null)} />
    </div>
  );
};

export default ProblemCreate;