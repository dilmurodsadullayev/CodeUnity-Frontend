import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Editor from "react-simple-code-editor";

import {
  highlight,
  languages as prismLanguages,
} from "prismjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getLanguagesStart,
  getLanguagesSuccess,
  getProblemDetailSuccess,
} from "../features/problems/Problems";

import ProblemService from "../services/problems";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

import SiteAlert from "./SiteAlert";


// =========================================================
// CONFIG
// =========================================================

const DEFAULT_COLOR =
  "#64748B";


// =========================================================
// BACKEND ERRORS
// =========================================================

const formatBackendErrors = (
  errorObject
) => {

  if (
    errorObject &&
    typeof errorObject === "object" &&
    !Array.isArray(errorObject)
  ) {

    let errorMessage =
      "Quyidagi maydonlarda xatoliklar aniqlandi:\n";


    for (
      const key in errorObject
    ) {

      if (
        Object.prototype.hasOwnProperty.call(
          errorObject,
          key
        )
      ) {

        const errorMessages =
          Array.isArray(
            errorObject[key]
          )
            ? errorObject[key].join(
                ", "
              )
            : errorObject[key];


        const title =
          key
            .charAt(0)
            .toUpperCase()
          +
          key
            .slice(1)
            .replace(
              /_/g,
              " "
            );


        errorMessage +=
          `[${title}]: ${errorMessages}\n`;
      }
    }


    return errorMessage.trim();
  }


  if (
    typeof errorObject ===
    "string"
  ) {

    if (
      errorObject.includes(
        "<!DOCTYPE html>"
      )
    ) {

      const titleMatch =
        errorObject.match(
          /<title>(.*?)<\/title>/i
        );


      const exceptionMatch =
        errorObject.match(
          /<pre class="exception_value">(.*?)<\/pre>/i
        );


      let debugInfo =
        "Backend Server (500 Internal Error) Xatosi:\n";


      if (
        titleMatch &&
        titleMatch[1]
      ) {

        debugInfo +=
          `Sarlavha: ${titleMatch[1].trim()}\n`;
      }


      if (
        exceptionMatch &&
        exceptionMatch[1]
      ) {

        debugInfo +=
          `Exception: ${exceptionMatch[1].trim()}\n`;
      }


      debugInfo +=
        "\nTo‘liq server debug ma’lumotlari konsolda mavjud.";


      return debugInfo;
    }


    return errorObject;
  }


  return (
    "Noma’lum server xatosi yuz berdi."
  );
};


// =========================================================
// COLOR
// =========================================================

const safeColor = (
  color
) => {

  if (
    typeof color === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(
      color
    )
  ) {

    return color;
  }


  return DEFAULT_COLOR;
};


// =========================================================
// COLOR + ALPHA
// =========================================================

const withAlpha = (
  color,
  alpha
) => {

  return (
    `${safeColor(color)}${alpha}`
  );
};


// =========================================================
// PRISM LANGUAGE
// =========================================================

const getPrismLanguageKey = (
  language
) => {

  if (!language) {
    return "clike";
  }


  const name =
    String(
      language.icon_key ||
      language.name ||
      ""
    )
      .trim()
      .toLowerCase();


  const normalized =
    name
      .replace(/\s+/g, "")
      .replace(/\./g, "")
      .replace(/#/g, "sharp")
      .replace(/\+/g, "p");


  const map = {

    python:
      "python",

    javascript:
      "javascript",

    js:
      "javascript",

    typescript:
      "typescript",

    ts:
      "typescript",

    css:
      "css",

    java:
      "java",

    c:
      "c",

    cpp:
      "cpp",

    cppp:
      "cpp",

    cplusplus:
      "cpp",

    csharp:
      "csharp",

    php:
      "php",

    go:
      "go",

    golang:
      "go",

    rust:
      "rust",

    dart:
      "dart",

    kotlin:
      "kotlin",

    swift:
      "swift",

    ruby:
      "ruby",

    sql:
      "sql",

    bash:
      "bash",

    shell:
      "bash",
  };


  return (
    map[normalized] ||
    "clike"
  );
};


// =========================================================
// TAG STYLE
// =========================================================

const getTagStyle = (
  item,
  active
) => {

  const color =
    safeColor(
      item?.color
    );


  if (!active) {

    return {
      color: "#9CA3AF",
      borderColor:
        "rgba(255,255,255,0.10)",
      backgroundColor:
        "rgba(255,255,255,0.04)",
    };
  }


  return {

    color,

    borderColor:
      withAlpha(
        color,
        "55"
      ),

    backgroundColor:
      withAlpha(
        color,
        "18"
      ),

    boxShadow:
      `0 8px 24px ${withAlpha(
        color,
        "12"
      )}`,
  };
};


// =========================================================
// PROBLEM CREATE
// =========================================================

const ProblemCreate = () => {

  const dispatch =
    useDispatch();


  const navigate =
    useNavigate();


  const {
    id,
  } = useParams();


  // =======================================================
  // BASIC FORM
  // =======================================================

  const [
    problemTitle,
    setProblemTitle,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    codeSnippet,
    setCodeSnippet,
  ] = useState("");


  // =======================================================
  // STACK
  // =======================================================

  const [
    selectedLanguages,
    setSelectedLanguages,
  ] = useState([]);


  const [
    selectedTechnologies,
    setSelectedTechnologies,
  ] = useState([]);


  // =======================================================
  // SINGLE CODE LANGUAGE
  //
  // Bu faqat code editor uchun bitta til.
  // =======================================================

  const [
    codeLanguageId,
    setCodeLanguageId,
  ] = useState("");


  // =======================================================
  // TECHNOLOGY OPTIONS
  // =======================================================

  const [
    availableTechnologies,
    setAvailableTechnologies,
  ] = useState([]);


  const [
    isTechnologyLoading,
    setIsTechnologyLoading,
  ] = useState(false);


  // =======================================================
  // URGENT
  // =======================================================

  const [
    isUrgent,
    setIsUrgent,
  ] = useState(false);


  const [
    deadline,
    setDeadline,
  ] = useState("");


  const [
    offeredCoins,
    setOfferedCoins,
  ] = useState("");


  // =======================================================
  // ERROR
  // =======================================================

  const [
    submissionError,
    setSubmissionError,
  ] = useState(null);


  // =======================================================
  // ALERT
  // =======================================================

  const [
    siteAlert,
    setSiteAlert,
  ] = useState(null);


  // =======================================================
  // DELETE
  // =======================================================

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);


  // =======================================================
  // REDUX
  // =======================================================

  const {
    languages:
      availableLanguages,

    isLoading,
  } = useSelector(
    (state) =>
      state.problem
  );


  const {
    problemDetail,
  } = useSelector(
    (state) =>
      state.problem
  );


  // =======================================================
  // LANGUAGE LIST
  // =======================================================

  const languageList =
    useMemo(
      () => {

        return Array.isArray(
          availableLanguages
        )
          ? availableLanguages
          : [];

      },
      [
        availableLanguages,
      ]
    );


  // =======================================================
  // TECHNOLOGY LIST
  // =======================================================

  const technologyList =
    useMemo(
      () => {

        return Array.isArray(
          availableTechnologies
        )
          ? availableTechnologies
          : [];

      },
      [
        availableTechnologies,
      ]
    );


  // =======================================================
  // SELECTED CODE LANGUAGE
  // =======================================================

  const selectedCodeLanguage =
    useMemo(
      () => {

        if (
          !codeLanguageId
        ) {
          return null;
        }


        const idNumber =
          Number(
            codeLanguageId
          );


        return (
          languageList.find(
            (language) =>
              Number(
                language.id
              ) ===
              idNumber
          )
          ||
          selectedLanguages.find(
            (language) =>
              Number(
                language.id
              ) ===
              idNumber
          )
          ||
          null
        );

      },
      [
        codeLanguageId,
        languageList,
        selectedLanguages,
      ]
    );


  // =======================================================
  // EDITOR LANGUAGE
  // =======================================================

  const editorLanguage =
    useMemo(
      () => {

        return (
          getPrismLanguageKey(
            selectedCodeLanguage
          )
        );

      },
      [
        selectedCodeLanguage,
      ]
    );


  // =======================================================
  // ALERT
  // =======================================================

  const showAlert =
    useCallback(
      ({
        type = "info",
        title = "FSociety",
        message = "",
        code,
        duration = 3500,
      }) => {

        setSiteAlert({

          id:
            Date.now(),

          type,

          title,

          message,

          code,

          duration,
        });

      },
      []
    );


  // =======================================================
  // FETCH LANGUAGES
  // =======================================================

  const fetchLanguages =
    useCallback(
      async () => {

        dispatch(
          getLanguagesStart()
        );


        try {

          const response =
            await ProblemService
              .getLanguagesList();


          dispatch(
            getLanguagesSuccess(
              response
            )
          );

        } catch (error) {

          console.error(
            "Dasturlash tillarini olishda xatolik:",
            error
          );


          showAlert({

            type:
              "error",

            title:
              "Tillar yuklanmadi",

            message:
              "Dasturlash tillarini olishda xatolik yuz berdi.",

            code:
              "LANGUAGE_FETCH_FAILED",
          });
        }

      },
      [
        dispatch,
        showAlert,
      ]
    );


  // =======================================================
  // FETCH TECHNOLOGIES
  // =======================================================

  const fetchTechnologies =
    useCallback(
      async () => {

        setIsTechnologyLoading(
          true
        );


        try {

          const response =
            await ProblemService
              .getTechnologiesList();


          setAvailableTechnologies(
            Array.isArray(
              response
            )
              ? response
              : []
          );

        } catch (error) {

          console.error(
            "Texnologiyalarni olishda xatolik:",
            error
          );


          showAlert({

            type:
              "error",

            title:
              "Texnologiyalar yuklanmadi",

            message:
              "Texnologiyalar ro‘yxatini olishda xatolik yuz berdi.",

            code:
              "TECHNOLOGY_FETCH_FAILED",
          });

        } finally {

          setIsTechnologyLoading(
            false
          );
        }

      },
      [
        showAlert,
      ]
    );


  // =======================================================
  // RESET
  // =======================================================

  const resetFormStates =
    useCallback(
      () => {

        setProblemTitle(
          ""
        );

        setDescription(
          ""
        );

        setCodeSnippet(
          ""
        );

        setSelectedLanguages(
          []
        );

        setSelectedTechnologies(
          []
        );

        setCodeLanguageId(
          ""
        );

        setIsUrgent(
          false
        );

        setDeadline(
          ""
        );

        setOfferedCoins(
          ""
        );

        setSubmissionError(
          null
        );

      },
      []
    );


  // =======================================================
  // FETCH DETAIL
  // =======================================================

  const fetchProblemDetail =
    useCallback(
      async (
        problemId
      ) => {

        setSubmissionError(
          null
        );


        try {

          const response =
            await ProblemService
              .getProblemDetail(
                problemId
              );


          dispatch(
            getProblemDetailSuccess(
              response
            )
          );


          // ===============================================
          // BASIC DATA
          // ===============================================

          setProblemTitle(
            response.problem ||
            ""
          );


          setDescription(
            response.description ||
            ""
          );


          setCodeSnippet(
            response.code ||
            ""
          );


          // ===============================================
          // LANGUAGE TAGS
          // ===============================================

          const responseLanguages =
            Array.isArray(
              response.language_data
            )
              ? response.language_data
              : [];


          setSelectedLanguages(
            responseLanguages
          );


          // ===============================================
          // TECHNOLOGY TAGS
          // ===============================================

          const responseTechnologies =
            Array.isArray(
              response.technology_data
            )
              ? response.technology_data
              : [];


          setSelectedTechnologies(
            responseTechnologies
          );


          // ===============================================
          // CODE LANGUAGE
          //
          // Backendda hozir alohida code_language yo'q.
          // Shu sabab editda mavjud birinchi language
          // code editor tili sifatida olinadi.
          // ===============================================

          if (
            response.code &&
            responseLanguages.length >
              0
          ) {

            setCodeLanguageId(
              String(
                responseLanguages[0].id
              )
            );

          } else {

            setCodeLanguageId(
              ""
            );
          }


          // ===============================================
          // URGENT
          // ===============================================

          setIsUrgent(
            Boolean(
              response.is_urgent
            )
          );


          setOfferedCoins(

            response.offered_coins ===
              null
            ||
            response.offered_coins ===
              undefined

              ? ""

              : response.offered_coins
          );


          // ===============================================
          // DEADLINE
          // ===============================================

          if (
            response.deadline
          ) {

            try {

              const date =
                new Date(
                  response.deadline
                );


              const formattedDate =
                new Date(
                  date.getTime()
                  -
                  date.getTimezoneOffset()
                  *
                  60000
                )
                  .toISOString()
                  .slice(
                    0,
                    16
                  );


              setDeadline(
                formattedDate
              );

            } catch (error) {

              console.error(
                "Deadline formatlashda xatolik:",
                error
              );


              setDeadline(
                ""
              );
            }

          } else {

            setDeadline(
              ""
            );
          }

        } catch (error) {

          console.error(
            "Muammo ma’lumotlarini olishda xatolik:",
            error
          );


          showAlert({

            type:
              "error",

            title:
              "Muammo yuklanmadi",

            message:
              "Muammo ma’lumotlarini yuklashda xatolik yuz berdi.",

            code:
              "PROBLEM_DETAIL_FAILED",
          });


          setTimeout(
            () => {

              navigate(
                "/problems"
              );

            },
            900
          );
        }

      },
      [
        dispatch,
        navigate,
        showAlert,
      ]
    );


  // =======================================================
  // INITIAL STACK FETCH
  // =======================================================

  useEffect(
    () => {

      fetchLanguages();

      fetchTechnologies();

    },
    [
      fetchLanguages,
      fetchTechnologies,
    ]
  );


  // =======================================================
  // EDIT DATA
  // =======================================================

  useEffect(
    () => {

      if (id) {

        fetchProblemDetail(
          id
        );

      } else {

        resetFormStates();
      }

    },
    [
      id,
      fetchProblemDetail,
      resetFormStates,
    ]
  );


  // =======================================================
  // LANGUAGE TAG TOGGLE
  // =======================================================

  const handleLanguageChange = (
    language
  ) => {

    setSelectedLanguages(
      (previous) => {

        const exists =
          previous.some(
            (item) =>
              item.id ===
              language.id
          );


        // ===============================================
        // REMOVE
        // ===============================================

        if (exists) {

          // Agar olib tashlanayotgan tag ayni code language
          // bo‘lsa code language ham clear qilinadi.

          if (
            Number(
              codeLanguageId
            )
            ===
            Number(
              language.id
            )
          ) {

            setCodeLanguageId(
              ""
            );
          }


          return (
            previous.filter(
              (item) =>
                item.id !==
                language.id
            )
          );
        }


        // ===============================================
        // ADD
        // ===============================================

        return [
          ...previous,
          language,
        ];
      }
    );
  };


  // =======================================================
  // TECHNOLOGY TAG TOGGLE
  // =======================================================

  const handleTechnologyChange = (
    technology
  ) => {

    setSelectedTechnologies(
      (previous) => {

        const exists =
          previous.some(
            (item) =>
              item.id ===
              technology.id
          );


        if (exists) {

          return (
            previous.filter(
              (item) =>
                item.id !==
                technology.id
            )
          );
        }


        return [
          ...previous,
          technology,
        ];
      }
    );
  };


  // =======================================================
  // CODE LANGUAGE
  //
  // Faqat bitta til tanlanadi.
  //
  // Tanlangan til avtomatik ravishda
  // Problem language tagiga ham qo‘shiladi.
  // =======================================================

  const handleCodeLanguageChange = (
    event
  ) => {

    const value =
      event.target.value;


    setCodeLanguageId(
      value
    );


    if (!value) {
      return;
    }


    const languageId =
      Number(
        value
      );


    const language =
      languageList.find(
        (item) =>
          Number(
            item.id
          ) ===
          languageId
      );


    if (!language) {
      return;
    }


    setSelectedLanguages(
      (previous) => {

        const exists =
          previous.some(
            (item) =>
              Number(
                item.id
              ) ===
              languageId
          );


        if (exists) {
          return previous;
        }


        return [
          ...previous,
          language,
        ];
      }
    );
  };


  // =======================================================
  // CODE CHANGE
  // =======================================================

  const handleCodeChange = (
    value
  ) => {

    setCodeSnippet(
      value
    );
  };


  // =======================================================
  // HIGHLIGHTER
  // =======================================================

  const getHighlighter = (
    lang
  ) => {

    if (
      prismLanguages[
        lang
      ]
    ) {

      return (
        code
      ) => {

        return highlight(
          code,
          prismLanguages[
            lang
          ],
          lang
        );
      };
    }


    return (
      code
    ) => {

      return highlight(
        code,
        prismLanguages.clike,
        "clike"
      );
    };
  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event
    ) => {

      event.preventDefault();


      setSubmissionError(
        null
      );


      // ===============================================
      // LANGUAGE TAG REQUIRED
      // ===============================================

      if (
        selectedLanguages.length ===
        0
      ) {

        const message =
          "Iltimos, kamida bitta dasturlash tilini tag sifatida tanlang!";


        setSubmissionError(
          message
        );


        showAlert({

          type:
            "warning",

          title:
            "Til tanlanmadi",

          message,

          code:
            "LANGUAGE_REQUIRED",
        });


        return;
      }


      // ===============================================
      // CODE LANGUAGE REQUIRED ONLY WHEN CODE EXISTS
      // ===============================================

      if (
        codeSnippet.trim() &&
        !codeLanguageId
      ) {

        const message =
          "Kod fragmenti yozilgan bo‘lsa, uning dasturlash tilini ham tanlang.";


        setSubmissionError(
          message
        );


        showAlert({

          type:
            "warning",

          title:
            "Kod tili tanlanmadi",

          message,

          code:
            "CODE_LANGUAGE_REQUIRED",
        });


        return;
      }


      // ===============================================
      // URGENT
      // ===============================================

      let finalDeadline =
        null;


      let finalOfferedCoins =
        0;


      if (
        isUrgent
      ) {

        if (
          !deadline
        ) {

          const message =
            "Tezkor muammo uchun deadline maydoni talab qilinadi!";


          setSubmissionError(
            message
          );


          showAlert({

            type:
              "warning",

            title:
              "Deadline kerak",

            message,

            code:
              "DEADLINE_REQUIRED",
          });


          return;
        }


        const coins =
          parseInt(
            offeredCoins,
            10
          );


        if (
          !offeredCoins ||
          Number.isNaN(
            coins
          ) ||
          coins <= 0
        ) {

          const message =
            "Tezkor muammo uchun taklif etilayotgan FCoin musbat raqam bo‘lishi kerak!";


          setSubmissionError(
            message
          );


          showAlert({

            type:
              "warning",

            title:
              "FCoin noto‘g‘ri",

            message,

            code:
              "FCOIN_INVALID",
          });


          return;
        }


        finalDeadline =
          new Date(
            deadline
          ).toISOString();


        finalOfferedCoins =
          coins;
      }


      // ===============================================
      // NEW BACKEND PAYLOAD
      // ===============================================

      const problemData = {

        problem:
          problemTitle,

        description,

        code:
          codeSnippet,

        // =============================================
        // MULTI LANGUAGE TAGS
        // =============================================

        languages:
          selectedLanguages.map(
            (language) =>
              language.id
          ),

        // =============================================
        // MULTI TECHNOLOGY TAGS
        // =============================================

        technologies:
          selectedTechnologies.map(
            (technology) =>
              technology.id
          ),

        is_urgent:
          isUrgent,

        deadline:
          finalDeadline,

        offered_coins:
          finalOfferedCoins,
      };


      console.log(
        "Yuborilayotgan problem:",
        problemData
      );


      console.log(
        "Editor code language:",
        selectedCodeLanguage
      );


      try {

        if (id) {

          const response =
            await ProblemService
              .putProblem(
                id,
                problemData
              );


          console.log(
            "Muammo yangilandi:",
            response
          );


          showAlert({

            type:
              "success",

            title:
              "Muammo yangilandi",

            message:
              "Muammo muvaffaqiyatli yangilandi.",

            code:
              "PROBLEM_UPDATED",

            duration:
              3000,
          });

        } else {

          const response =
            await ProblemService
              .postProblem(
                problemData
              );


          console.log(
            "Muammo yaratildi:",
            response
          );


          showAlert({

            type:
              "success",

            title:
              "Muammo qo‘shildi",

            message:
              "Yangi muammo FSociety bazasiga muvaffaqiyatli qo‘shildi.",

            code:
              "PROBLEM_CREATED",

            duration:
              3000,
          });


          resetFormStates();
        }


        setTimeout(
          () => {

            navigate(
              "/problems"
            );

          },
          900
        );

      } catch (error) {

        console.error(
          `Muammoni ${
            id
              ? "yangilashda"
              : "yaratishda"
          } xatolik:`,
          error.response
            ? error.response.data
            : error.message
        );


        let displayError =
          `Muammoni ${
            id
              ? "yangilashda"
              : "yaratishda"
          } xatolik yuz berdi!`;


        if (
          error.response
        ) {

          if (
            error.response.data
          ) {

            if (
              typeof error.response.data ===
                "object"
              &&
              !Array.isArray(
                error.response.data
              )
            ) {

              displayError =
                formatBackendErrors(
                  error.response.data
                );

            } else if (
              typeof error.response.data ===
                "string"
            ) {

              displayError =
                formatBackendErrors(
                  error.response.data
                );
            }
          }

        } else {

          displayError +=
            ` Tarmoq xatosi: ${error.message}`;
        }


        setSubmissionError(
          displayError
        );


        showAlert({

          type:
            "error",

          title:
            id
              ? "Yangilashda xatolik"
              : "Yaratishda xatolik",

          message:
            displayError,

          code:
            id
              ? "UPDATE_FAILED"
              : "CREATE_FAILED",

          duration:
            6000,
        });
      }
    };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDeleteConfirm =
    async () => {

      if (!id) {
        return;
      }


      try {

        await ProblemService
          .deleteProblem(
            id
          );


        showAlert({

          type:
            "success",

          title:
            "Muammo o‘chirildi",

          message:
            "Tanlangan muammo muvaffaqiyatli o‘chirildi.",

          code:
            "PROBLEM_DELETED",

          duration:
            3000,
        });


        setIsDeleteModalOpen(
          false
        );


        setTimeout(
          () => {

            navigate(
              "/problems"
            );

          },
          900
        );

      } catch (error) {

        console.error(
          "Muammoni o‘chirishda xatolik:",
          error
        );


        showAlert({

          type:
            "error",

          title:
            "O‘chirishda xatolik",

          message:
            "Muammoni o‘chirishda xatolik yuz berdi.",

          code:
            "DELETE_FAILED",

          duration:
            5000,
        });


        setIsDeleteModalOpen(
          false
        );
      }
    };


  // =======================================================
  // CANCEL
  // =======================================================

  const handleCancel = () => {

    if (
      id &&
      problemDetail
    ) {

      fetchProblemDetail(
        id
      );

    } else {

      resetFormStates();
    }


    showAlert({

      type:
        "info",

      title:
        "Bekor qilindi",

      message:
        "Forma o‘zgarishlari bekor qilindi.",

      code:
        "FORM_CANCELLED",

      duration:
        2500,
    });


    setTimeout(
      () => {

        navigate(
          "/problems"
        );

      },
      700
    );
  };


  // =======================================================
  // MIN DEADLINE
  // =======================================================

  const minDeadline =
    new Date(
      new Date().getTime()
      -
      new Date()
        .getTimezoneOffset()
      *
      60000
    )
      .toISOString()
      .slice(
        0,
        16
      );


  // =======================================================
  // LOADING
  // =======================================================

  const stackLoading =
    isLoading ||
    isTechnologyLoading;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
        px-4
        py-10
        font-sans
        text-white

        sm:px-6
        lg:px-8
      "
    >

      {/* ===================================================
          BACKGROUND
      ==================================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          -z-10
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />


      <div
        className="
          absolute
          right-0
          top-24
          -z-10
          h-96
          w-96
          rounded-full
          bg-indigo-500/20
          blur-[130px]
        "
      />


      <div
        className="
          absolute
          bottom-0
          left-1/2
          -z-10
          h-80
          w-80
          -translate-x-1/2
          rounded-full
          bg-fuchsia-500/10
          blur-[110px]
        "
      />


      <div
        className="
          absolute
          inset-0
          -z-10
          bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]
          bg-[size:70px_70px]
          opacity-20
        "
      />


      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-8
          "
        >

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/10
              px-4
              py-2
              font-mono
              text-xs
              font-black
              uppercase
              tracking-[0.22em]
              text-cyan-300
            "
          >

            <i
              className="
                fa-solid
                fa-terminal
              "
            />

            fsociety://problem/
            {id
              ? "edit"
              : "create"}

          </div>


          <div
            className="
              flex
              flex-col
              justify-between
              gap-5

              lg:flex-row
              lg:items-end
            "
          >

            <div>

              <h1
                className="
                  text-4xl
                  font-black
                  leading-tight
                  text-white

                  md:text-5xl
                "
              >

                {id
                  ? "Muammoni tahrirlash"
                  : "Yangi muammo yaratish"}

                <span
                  className="
                    ml-1
                    animate-pulse
                    text-gray-500
                  "
                >
                  _
                </span>

              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-base
                  leading-7
                  text-gray-400
                "
              >

                {id ? (

                  <>

                    <span
                      className="
                        font-bold
                        text-cyan-300
                      "
                    >
                      &quot;
                      {problemDetail?.problem}
                      &quot;
                    </span>

                    {" "}
                    muammosini yangilang va
                    aniqroq ma’lumot kiriting.

                  </>

                ) : (

                  <>

                    Dasturlashdagi xatolikni
                    aniq yozing, kerakli kodni
                    joylang va FSociety
                    hamjamiyatidan tezroq
                    yechim oling.

                  </>

                )}

              </p>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                px-5
                py-4
              "
            >

              <p
                className="
                  font-mono
                  text-xs
                  uppercase
                  tracking-[0.22em]
                  text-gray-500
                "
              >
                Status
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  font-black
                  text-emerald-300
                "
              >
                {id
                  ? "Edit mode"
                  : "Create mode"}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            WINDOW
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[2rem]
            border
            border-white/10
            bg-white/[0.04]
            shadow-2xl
            shadow-black/40
            backdrop-blur-xl
          "
        >

          {/* WINDOW TOP */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/10
              bg-white/[0.03]
              px-5
              py-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-red-400
                "
              />

              <span
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-yellow-400
                "
              />

              <span
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-emerald-400
                "
              />

            </div>


            <p
              className="
                font-mono
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-gray-500
              "
            >
              problem.form
            </p>

          </div>


          <div
            className="
              grid
              gap-0

              lg:grid-cols-[1fr_340px]
            "
          >

            {/* ===============================================
                FORM
            ================================================ */}

            <div
              className="
                p-5

                sm:p-7
                lg:p-8
              "
            >

              {/* ERROR */}

              {submissionError && (

                <div
                  className="
                    mb-7
                    overflow-hidden
                    rounded-2xl
                    border
                    border-red-400/30
                    bg-red-500/10
                  "
                >

                  <div
                    className="
                      border-b
                      border-red-400/20
                      px-4
                      py-3
                    "
                  >

                    <h3
                      className="
                        font-mono
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-red-300
                      "
                    >
                      Error detected
                    </h3>

                  </div>


                  <pre
                    className="
                      max-h-64
                      overflow-auto
                      whitespace-pre-wrap
                      p-4
                      font-mono
                      text-sm
                      leading-6
                      text-red-200
                    "
                  >
                    {submissionError}
                  </pre>

                </div>
              )}


              <form
                onSubmit={
                  handleSubmit
                }
                className="
                  space-y-7
                "
              >

                {/* ===========================================
                    TITLE
                ============================================ */}

                <div>

                  <label
                    htmlFor="problemTitle"
                    className="
                      mb-2
                      block
                      text-sm
                      font-black
                      uppercase
                      tracking-wider
                      text-gray-300
                    "
                  >
                    Muammo sarlavhasi{" "}

                    <span
                      className="
                        text-red-400
                      "
                    >
                      *
                    </span>
                  </label>


                  <input
                    type="text"
                    id="problemTitle"

                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#0b1020]
                      px-5
                      py-4
                      text-base
                      font-semibold
                      text-white
                      outline-none
                      transition
                      duration-300

                      placeholder:text-gray-600

                      focus:border-cyan-400/40
                      focus:ring-4
                      focus:ring-cyan-400/10
                    "

                    placeholder="Masalan: Django JWT refresh token cookie orqali ishlamayapti"

                    value={
                      problemTitle
                    }

                    onChange={
                      (
                        event
                      ) =>
                        setProblemTitle(
                          event.target.value
                        )
                    }

                    required
                  />

                </div>


                {/* ===========================================
                    URGENT
                ============================================ */}

                <div
                  className={`
                    rounded-2xl
                    border
                    p-5
                    transition
                    duration-300

                    ${
                      isUrgent

                        ? `
                          border-yellow-400/30
                          bg-yellow-400/10
                        `

                        : `
                          border-white/10
                          bg-white/[0.03]
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >

                    <input
                      id="isUrgent"
                      type="checkbox"

                      className="
                        mt-1
                        h-5
                        w-5
                        cursor-pointer
                        rounded
                        border-gray-600
                        bg-[#0b1020]
                        text-yellow-400
                        focus:ring-yellow-400
                      "

                      checked={
                        isUrgent
                      }

                      onChange={
                        (
                          event
                        ) => {

                          setIsUrgent(
                            event.target.checked
                          );


                          if (
                            !event.target.checked
                          ) {

                            setDeadline(
                              ""
                            );

                            setOfferedCoins(
                              ""
                            );
                          }
                        }
                      }
                    />


                    <label
                      htmlFor="isUrgent"

                      className="
                        cursor-pointer
                        select-none
                      "
                    >

                      <span
                        className="
                          block
                          text-base
                          font-black
                          text-white
                        "
                      >
                        Tezkor muammo sifatida joylash
                      </span>


                      <span
                        className="
                          mt-1
                          block
                          text-sm
                          leading-6
                          text-gray-400
                        "
                      >
                        Belgilansa deadline va
                        taklif qilinadigan FCoin
                        miqdori majburiy bo‘ladi.
                      </span>

                    </label>

                  </div>


                  {isUrgent && (

                    <div
                      className="
                        mt-5
                        grid
                        gap-5

                        md:grid-cols-2
                      "
                    >

                      <div>

                        <label
                          htmlFor="deadline"

                          className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-gray-300
                          "
                        >
                          Deadline{" "}

                          <span
                            className="
                              text-red-400
                            "
                          >
                            *
                          </span>
                        </label>


                        <input
                          type="datetime-local"
                          id="deadline"

                          className="
                            w-full
                            rounded-2xl
                            border
                            border-yellow-400/20
                            bg-[#0b1020]
                            px-5
                            py-4
                            text-base
                            text-white
                            outline-none
                            transition
                            duration-300

                            focus:border-yellow-400/50
                            focus:ring-4
                            focus:ring-yellow-400/10
                          "

                          value={
                            deadline
                          }

                          onChange={
                            (
                              event
                            ) =>
                              setDeadline(
                                event.target.value
                              )
                          }

                          required={
                            isUrgent
                          }

                          min={
                            minDeadline
                          }
                        />

                      </div>


                      <div>

                        <label
                          htmlFor="offeredCoins"

                          className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-gray-300
                          "
                        >
                          Taklif etilayotgan FCoin{" "}

                          <span
                            className="
                              text-red-400
                            "
                          >
                            *
                          </span>
                        </label>


                        <input
                          type="number"
                          id="offeredCoins"

                          className="
                            w-full
                            rounded-2xl
                            border
                            border-yellow-400/20
                            bg-[#0b1020]
                            px-5
                            py-4
                            text-base
                            text-white
                            outline-none
                            transition
                            duration-300

                            placeholder:text-gray-600

                            focus:border-yellow-400/50
                            focus:ring-4
                            focus:ring-yellow-400/10

                            [appearance:textfield]
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none
                          "

                          placeholder="Masalan: 50"

                          value={
                            offeredCoins
                          }

                          onChange={
                            (
                              event
                            ) =>
                              setOfferedCoins(
                                event.target.value
                              )
                          }

                          required={
                            isUrgent
                          }

                          min="1"
                        />

                      </div>

                    </div>
                  )}

                </div>


                {/* ===========================================
                    DESCRIPTION
                ============================================ */}

                <div>

                  <label
                    htmlFor="description"

                    className="
                      mb-2
                      block
                      text-sm
                      font-black
                      uppercase
                      tracking-wider
                      text-gray-300
                    "
                  >
                    Muammo tavsifi{" "}

                    <span
                      className="
                        text-red-400
                      "
                    >
                      *
                    </span>
                  </label>


                  <textarea
                    id="description"
                    rows="6"

                    className="
                      w-full
                      resize-y
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#0b1020]
                      px-5
                      py-4
                      text-base
                      leading-7
                      text-white
                      outline-none
                      transition
                      duration-300

                      placeholder:text-gray-600

                      focus:border-cyan-400/40
                      focus:ring-4
                      focus:ring-cyan-400/10
                    "

                    placeholder="Muammo qachon chiqyapti, qanday error beryapti, nimalarni sinab ko‘rdingiz..."

                    value={
                      description
                    }

                    onChange={
                      (
                        event
                      ) =>
                        setDescription(
                          event.target.value
                        )
                    }

                    required
                  />


                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-500
                    "
                  >
                    Kodni bu yerga emas,
                    pastdagi code editor ichiga yozing.
                  </p>

                </div>


                {/* ===========================================
                    CODE
                ============================================ */}

                <div>

                  <div
                    className="
                      mb-2
                      flex
                      flex-col
                      justify-between
                      gap-2

                      sm:flex-row
                      sm:items-center
                    "
                  >

                    <label
                      htmlFor="codeSnippet"

                      className="
                        block
                        text-sm
                        font-black
                        uppercase
                        tracking-wider
                        text-gray-300
                      "
                    >
                      Kod fragmenti
                    </label>


                    {codeSnippet.trim() && (
                      <span
                        className="
                          text-xs
                          font-semibold
                          text-orange-300
                        "
                      >
                        Kod tili tanlanishi kerak
                      </span>
                    )}

                  </div>


                  <div
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#0b1020]
                      shadow-2xl
                      shadow-black/30
                      transition
                      duration-300

                      focus-within:border-cyan-400/40
                      focus-within:ring-4
                      focus-within:ring-cyan-400/10
                    "
                  >

                    {/* =======================================
                        CODE TOOLBAR
                    ======================================== */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-3

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-red-400
                          "
                        />

                        <span
                          className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-yellow-400
                          "
                        />

                        <span
                          className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-emerald-400
                          "
                        />


                        <span
                          className="
                            ml-2
                            hidden
                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-gray-600

                            sm:inline
                          "
                        >
                          code.editor
                        </span>

                      </div>


                      {/* =====================================
                          SINGLE CODE LANGUAGE
                      ====================================== */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <label
                          htmlFor="codeLanguage"

                          className="
                            whitespace-nowrap
                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-gray-500
                          "
                        >
                          Kod tili
                        </label>


                        <select
                          id="codeLanguage"

                          value={
                            codeLanguageId
                          }

                          onChange={
                            handleCodeLanguageChange
                          }

                          className="
                            min-w-[150px]
                            rounded-xl
                            border
                            border-white/10
                            bg-[#080d18]
                            px-3
                            py-2
                            text-xs
                            font-bold
                            text-gray-200
                            outline-none
                            transition

                            focus:border-cyan-400/40
                            focus:ring-2
                            focus:ring-cyan-400/10
                          "
                        >

                          <option
                            value=""
                          >
                            Tilni tanlang
                          </option>


                          {languageList.map(
                            (
                              language
                            ) => (

                              <option
                                key={
                                  language.id
                                }
                                value={
                                  language.id
                                }
                              >
                                {language.name}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                    </div>


                    {/* =======================================
                        SELECTED CODE LANGUAGE
                    ======================================== */}

                    {selectedCodeLanguage && (

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/[0.06]
                          bg-black/10
                          px-4
                          py-2
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-gray-500
                          "
                        >

                          <span
                            className="
                              h-2
                              w-2
                              rounded-full
                            "
                            style={{
                              backgroundColor:
                                safeColor(
                                  selectedCodeLanguage.color
                                ),

                              boxShadow:
                                `0 0 8px ${safeColor(
                                  selectedCodeLanguage.color
                                )}`,
                            }}
                          />


                          Syntax:

                          <strong
                            style={{
                              color:
                                safeColor(
                                  selectedCodeLanguage.color
                                ),
                            }}
                          >
                            {selectedCodeLanguage.name}
                          </strong>

                        </div>


                        <span
                          className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-gray-600
                          "
                        >
                          {editorLanguage}
                        </span>

                      </div>
                    )}


                    {/* =======================================
                        EDITOR
                    ======================================== */}

                    <Editor

                      value={
                        codeSnippet
                      }

                      onValueChange={
                        handleCodeChange
                      }

                      highlight={
                        getHighlighter(
                          editorLanguage
                        )
                      }

                      padding={
                        18
                      }

                      style={{

                        fontFamily:
                          '"Fira Code", "Fira Mono", monospace',

                        fontSize:
                          15,

                        backgroundColor:
                          "#0b1020",

                        color:
                          "#d4d4d4",

                        minHeight:
                          "260px",

                        lineHeight:
                          "1.6",

                        outline:
                          "none",
                      }}

                      className="
                        code-editor
                      "
                    />

                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    Kod yozsangiz bitta dasturlash
                    tilini tanlang. Tanlangan kod tili
                    avtomatik ravishda problem
                    taglariga ham qo‘shiladi.
                  </p>

                </div>


                {/* ===========================================
                    LANGUAGE TAGS
                ============================================ */}

                <div>

                  <div
                    className="
                      mb-3
                      flex
                      flex-wrap
                      items-end
                      justify-between
                      gap-2
                    "
                  >

                    <div>

                      <label
                        className="
                          block
                          text-sm
                          font-black
                          uppercase
                          tracking-wider
                          text-gray-300
                        "
                      >
                        Dasturlash tili taglari{" "}

                        <span
                          className="
                            text-red-400
                          "
                        >
                          *
                        </span>
                      </label>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        Problem qaysi tillarga
                        tegishli bo‘lsa, bir yoki
                        bir nechtasini belgilang.
                      </p>

                    </div>


                    {selectedLanguages.length >
                      0 && (

                      <span
                        className="
                          rounded-full
                          border
                          border-cyan-400/20
                          bg-cyan-400/10
                          px-3
                          py-1
                          text-xs
                          font-black
                          text-cyan-300
                        "
                      >
                        {
                          selectedLanguages.length
                        } ta tanlangan
                      </span>
                    )}

                  </div>


                  {isLoading ? (

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-3
                      "
                    >

                      {[
                        ...Array(6),
                      ].map(
                        (
                          _,
                          index
                        ) => (

                          <div
                            key={
                              index
                            }
                            className="
                              h-10
                              w-24
                              animate-pulse
                              rounded-full
                              bg-white/10
                            "
                          />
                        )
                      )}

                    </div>

                  ) : (

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-3
                      "
                    >

                      {languageList.length >
                        0 ? (

                        languageList.map(
                          (
                            language
                          ) => {

                            const active =
                              selectedLanguages.some(
                                (
                                  selected
                                ) =>
                                  Number(
                                    selected.id
                                  )
                                  ===
                                  Number(
                                    language.id
                                  )
                              );


                            const isCodeLanguage =
                              Number(
                                codeLanguageId
                              )
                              ===
                              Number(
                                language.id
                              );


                            return (

                              <button

                                key={
                                  language.id
                                }

                                type="button"

                                onClick={() =>
                                  handleLanguageChange(
                                    language
                                  )
                                }

                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  px-5
                                  py-2.5
                                  text-sm
                                  font-black
                                  transition
                                  duration-300

                                  hover:-translate-y-0.5
                                "

                                style={
                                  getTagStyle(
                                    language,
                                    active
                                  )
                                }
                              >

                                {active && (

                                  <i
                                    className="
                                      fa-solid
                                      fa-check
                                      text-xs
                                    "
                                  />
                                )}


                                <span
                                  className="
                                    h-2
                                    w-2
                                    rounded-full
                                  "
                                  style={{
                                    backgroundColor:
                                      safeColor(
                                        language.color
                                      ),
                                  }}
                                />


                                {language.name}


                                {isCodeLanguage && (

                                  <span
                                    className="
                                      rounded-full
                                      border
                                      border-white/10
                                      bg-white/10
                                      px-1.5
                                      py-0.5
                                      font-mono
                                      text-[8px]
                                      uppercase
                                    "
                                  >
                                    code
                                  </span>
                                )}

                              </button>
                            );
                          }
                        )

                      ) : (

                        <p
                          className="
                            text-gray-400
                          "
                        >
                          Dasturlash tillari topilmadi.
                        </p>
                      )}

                    </div>
                  )}

                </div>


                {/* ===========================================
                    TECHNOLOGY TAGS
                ============================================ */}

                <div>

                  <div
                    className="
                      mb-3
                      flex
                      flex-wrap
                      items-end
                      justify-between
                      gap-2
                    "
                  >

                    <div>

                      <label
                        className="
                          block
                          text-sm
                          font-black
                          uppercase
                          tracking-wider
                          text-gray-300
                        "
                      >
                        Texnologiya taglari
                      </label>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        Django, React, PostgreSQL,
                        Redis, Docker kabi
                        texnologiyalarni belgilang.
                      </p>

                    </div>


                    {selectedTechnologies.length >
                      0 && (

                      <span
                        className="
                          rounded-full
                          border
                          border-indigo-400/20
                          bg-indigo-400/10
                          px-3
                          py-1
                          text-xs
                          font-black
                          text-indigo-300
                        "
                      >
                        {
                          selectedTechnologies.length
                        } ta tanlangan
                      </span>
                    )}

                  </div>


                  {isTechnologyLoading ? (

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-3
                      "
                    >

                      {[
                        ...Array(8),
                      ].map(
                        (
                          _,
                          index
                        ) => (

                          <div
                            key={
                              index
                            }
                            className="
                              h-10
                              w-28
                              animate-pulse
                              rounded-full
                              bg-white/10
                            "
                          />
                        )
                      )}

                    </div>

                  ) : (

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-3
                      "
                    >

                      {technologyList.length >
                        0 ? (

                        technologyList.map(
                          (
                            technology
                          ) => {

                            const active =
                              selectedTechnologies.some(
                                (
                                  selected
                                ) =>
                                  Number(
                                    selected.id
                                  )
                                  ===
                                  Number(
                                    technology.id
                                  )
                              );


                            return (

                              <button

                                key={
                                  technology.id
                                }

                                type="button"

                                onClick={() =>
                                  handleTechnologyChange(
                                    technology
                                  )
                                }

                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-black
                                  transition
                                  duration-300

                                  hover:-translate-y-0.5
                                "

                                style={
                                  getTagStyle(
                                    technology,
                                    active
                                  )
                                }
                              >

                                {active && (

                                  <i
                                    className="
                                      fa-solid
                                      fa-check
                                      text-xs
                                    "
                                  />
                                )}


                                <span
                                  className="
                                    h-2
                                    w-2
                                    rounded-full
                                  "
                                  style={{
                                    backgroundColor:
                                      safeColor(
                                        technology.color
                                      ),
                                  }}
                                />


                                {technology.name}

                              </button>
                            );
                          }
                        )

                      ) : (

                        <p
                          className="
                            text-gray-400
                          "
                        >
                          Texnologiyalar topilmadi.
                        </p>
                      )}

                    </div>
                  )}

                </div>


                {/* ===========================================
                    SELECTED STACK SUMMARY
                ============================================ */}

                {!stackLoading &&
                  (
                    selectedLanguages.length >
                      0
                    ||
                    selectedTechnologies.length >
                      0
                  ) && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-black/10
                      p-4
                    "
                  >

                    <p
                      className="
                        mb-3
                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-gray-600
                      "
                    >
                      selected.stack
                    </p>


                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >

                      {selectedLanguages.map(
                        (
                          language
                        ) => (

                          <span
                            key={
                              `language-${language.id}`
                            }
                            className="
                              rounded-lg
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-bold
                            "
                            style={{

                              color:
                                safeColor(
                                  language.color
                                ),

                              borderColor:
                                withAlpha(
                                  language.color,
                                  "40"
                                ),

                              backgroundColor:
                                withAlpha(
                                  language.color,
                                  "12"
                                ),
                            }}
                          >
                            {language.name}
                          </span>
                        )
                      )}


                      {selectedTechnologies.map(
                        (
                          technology
                        ) => (

                          <span
                            key={
                              `technology-${technology.id}`
                            }
                            className="
                              rounded-lg
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-bold
                            "
                            style={{

                              color:
                                safeColor(
                                  technology.color
                                ),

                              borderColor:
                                withAlpha(
                                  technology.color,
                                  "40"
                                ),

                              backgroundColor:
                                withAlpha(
                                  technology.color,
                                  "12"
                                ),
                            }}
                          >
                            {technology.name}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}


                {/* ===========================================
                    ACTIONS
                ============================================ */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-white/10
                    pt-7

                    sm:flex-row
                    sm:justify-end
                  "
                >

                  {id && (

                    <button
                      type="button"

                      onClick={() =>
                        setIsDeleteModalOpen(
                          true
                        )
                      }

                      className="
                        rounded-2xl
                        border
                        border-red-400/30
                        bg-red-500/10
                        px-7
                        py-3
                        text-sm
                        font-black
                        text-red-300
                        transition
                        duration-300

                        hover:-translate-y-0.5
                        hover:bg-red-500/20
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-trash
                          mr-2
                        "
                      />

                      O‘chirish

                    </button>
                  )}


                  <button
                    type="button"

                    onClick={
                      handleCancel
                    }

                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-7
                      py-3
                      text-sm
                      font-black
                      text-gray-300
                      transition
                      duration-300

                      hover:-translate-y-0.5
                      hover:bg-white/[0.08]
                      hover:text-white
                    "
                  >
                    Bekor qilish
                  </button>


                  <button
                    type="submit"

                    className="
                      rounded-2xl
                      bg-gradient-to-r
                      from-cyan-500
                      to-indigo-600
                      px-7
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-cyan-500/20
                      transition
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-cyan-500/40
                    "
                  >

                    <i
                      className="
                        fa-solid
                        fa-paper-plane
                        mr-2
                      "
                    />

                    {id
                      ? "Yangilash"
                      : "Muammo qo‘shish"}

                  </button>

                </div>

              </form>

            </div>


            {/* ===============================================
                ASIDE
            ================================================ */}

            <aside
              className="
                border-t
                border-white/10
                bg-[#080d18]
                p-5

                sm:p-7

                lg:border-l
                lg:border-t-0
              "
            >

              <div
                className="
                  sticky
                  top-6
                  space-y-5
                "
              >

                {/* INFO */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    p-5
                  "
                >

                  <div
                    className="
                      mb-4
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-cyan-400/10
                      text-cyan-300
                    "
                  >

                    <i
                      className="
                        fa-solid
                        fa-lightbulb
                        text-xl
                      "
                    />

                  </div>


                  <h3
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Yaxshi muammo qanday yoziladi?
                  </h3>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-400
                    "
                  >
                    Sarlavha qisqa, tavsif aniq,
                    kod fragmenti esa muammoni
                    qayta tekshirishga yetarli
                    bo‘lishi kerak.
                  </p>

                </div>


                {/* CODE LANGUAGE */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-indigo-400/20
                    bg-indigo-400/[0.07]
                    p-5
                  "
                >

                  <h4
                    className="
                      font-black
                      text-indigo-300
                    "
                  >

                    <i
                      className="
                        fa-solid
                        fa-code
                        mr-2
                      "
                    />

                    Kod tili va tag farqi

                  </h4>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-400
                    "
                  >
                    <strong
                      className="
                        text-gray-200
                      "
                    >
                      Kod tili
                    </strong>

                    {" "}
                    — editor ichidagi kodning
                    bitta asosiy tili.
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-400
                    "
                  >
                    <strong
                      className="
                        text-gray-200
                      "
                    >
                      Taglar
                    </strong>

                    {" "}
                    — muammoga aloqador barcha
                    tillar va texnologiyalar.
                  </p>

                </div>


                {/* CHECKLIST */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-5
                  "
                >

                  <h4
                    className="
                      mb-4
                      font-mono
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-gray-500
                    "
                  >
                    Checklist
                  </h4>


                  <div
                    className="
                      space-y-3
                      text-sm
                      text-gray-300
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-check
                          mt-1
                          text-emerald-300
                        "
                      />

                      <span>
                        Error xabarini aniq yozing.
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-check
                          mt-1
                          text-emerald-300
                        "
                      />

                      <span>
                        Kod bo‘lsa uning bitta tilini tanlang.
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-check
                          mt-1
                          text-emerald-300
                        "
                      />

                      <span>
                        Aloqador til va texnologiyalarni tag qiling.
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-check
                          mt-1
                          text-emerald-300
                        "
                      />

                      <span>
                        Kod fragmentini alohida joylang.
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <i
                        className="
                          fa-solid
                          fa-check
                          mt-1
                          text-emerald-300
                        "
                      />

                      <span>
                        Tezkor bo‘lsa deadline va FCoin kiriting.
                      </span>

                    </div>

                  </div>

                </div>


                {/* URGENT INFO */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-yellow-400/20
                    bg-yellow-400/10
                    p-5
                  "
                >

                  <h4
                    className="
                      font-black
                      text-yellow-300
                    "
                  >

                    <i
                      className="
                        fa-solid
                        fa-coins
                        mr-2
                      "
                    />

                    Tezkor muammo

                  </h4>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-400
                    "
                  >
                    Tezkor muammo foydalanuvchilarga
                    tezroq ko‘rinadi va yechim bergan
                    developer FCoin mukofot olishi mumkin.
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>


      {/* ===================================================
          DELETE MODAL
      ==================================================== */}

      <DeleteConfirmationModal

        isOpen={
          isDeleteModalOpen
        }

        onClose={() =>
          setIsDeleteModalOpen(
            false
          )
        }

        onConfirm={
          handleDeleteConfirm
        }

        itemTitle={
          problemDetail?.problem
          ||
          "ushbu muammoni"
        }
      />


      {/* ===================================================
          ALERT
      ==================================================== */}

      <SiteAlert

        alert={
          siteAlert
        }

        onClose={() =>
          setSiteAlert(
            null
          )
        }
      />

    </div>
  );
};


export default ProblemCreate;