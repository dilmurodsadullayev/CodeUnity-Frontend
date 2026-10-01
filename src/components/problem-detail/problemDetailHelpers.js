// src/components/problem-detail/problemDetailHelpers.js


// =========================================================
// ERROR TYPES
// =========================================================

export const PROBLEM_DETAIL_ERROR_TYPES = {
    NOT_FOUND:
        "not_found",

    FORBIDDEN:
        "forbidden",

    UNAUTHORIZED:
        "unauthorized",

    RATE_LIMIT:
        "rate_limit",

    TIMEOUT:
        "timeout",

    NETWORK:
        "network",

    SERVER:
        "server",

    UNKNOWN:
        "unknown",
};


// =========================================================
// SAFE TEXT
// =========================================================

export const normalizeProblemDetailText = (
    value,
    fallback = ""
) => {

    if (
        value === null
        ||
        value === undefined
    ) {

        return fallback;
    }


    const text =
        String(
            value
        ).trim();


    return (
        text
        ||
        fallback
    );
};


// =========================================================
// BOOLEAN
//
// JS:
//
// Boolean("false") === true
//
// bo‘lgani uchun backenddan string kelgan
// holatlarni xavfsiz normalize qilamiz.
// =========================================================

export const normalizeProblemDetailBoolean = (
    value
) => {

    if (
        typeof value ===
        "boolean"
    ) {

        return value;
    }


    if (
        typeof value ===
        "string"
    ) {

        const normalized =
            value
                .trim()
                .toLowerCase();


        if (
            [
                "true",
                "1",
                "yes",
                "on",
            ].includes(
                normalized
            )
        ) {

            return true;
        }


        if (
            [
                "false",
                "0",
                "no",
                "off",
                "",
            ].includes(
                normalized
            )
        ) {

            return false;
        }
    }


    if (
        value === 1
    ) {

        return true;
    }


    if (
        value === 0
        ||
        value === null
        ||
        value === undefined
    ) {

        return false;
    }


    return Boolean(
        value
    );
};


// =========================================================
// SAFE NON-NEGATIVE NUMBER
// =========================================================

export const normalizeProblemDetailNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {

        const fallbackNumber =
            Number(
                fallback
            );


        return Number.isFinite(
            fallbackNumber
        )
            ? Math.max(
                0,
                fallbackNumber
            )
            : 0;
    }


    return Math.max(
        0,
        number
    );
};


// =========================================================
// SAME ID
// =========================================================

export const isSameProblemDetailId = (
    left,
    right
) => {

    if (
        left === null
        ||
        left === undefined
        ||
        right === null
        ||
        right === undefined
    ) {

        return false;
    }


    return (
        String(
            left
        )
        ===
        String(
            right
        )
    );
};


// =========================================================
// CURRENT ROUTE DETAIL
// =========================================================

export const isCurrentProblemDetail = (
    problemDetail,
    problemId
) => {

    if (
        !problemId
        ||
        !problemDetail
    ) {

        return false;
    }


    return isSameProblemDetailId(
        problemDetail.id,
        problemId
    );
};


// =========================================================
// STATUS
// =========================================================

export const getProblemDetailStatus = (
    problemDetail
) => {

    return normalizeProblemDetailText(
        problemDetail?.status,
        "pending"
    )
        .toLowerCase();
};


// =========================================================
// SOLVED
// =========================================================

export const isProblemDetailSolved = (
    problemDetail
) => {

    return (
        normalizeProblemDetailBoolean(
            problemDetail
                ?.is_solved
        )

        ||

        getProblemDetailStatus(
            problemDetail
        ) ===
        "solved"
    );
};


// =========================================================
// REJECTED
// =========================================================

export const isProblemDetailRejected = (
    problemDetail
) => {

    return (
        getProblemDetailStatus(
            problemDetail
        )
        ===
        "rejected"
    );
};


// =========================================================
// STARRED BY CURRENT USER
//
// CANONICAL:
//
//     is_starred_by_user
//
// LEGACY FALLBACK:
//
//     star_by_user
//
// Canonical maydon har doim birinchi o‘qiladi.
// =========================================================

export const hasProblemDetailStar = (
    problemDetail
) => {

    const value =
        problemDetail
            ?.is_starred_by_user

        ??

        problemDetail
            ?.star_by_user;


    return normalizeProblemDetailBoolean(
        value
    );
};


// =========================================================
// RESPONSE COUNT
// =========================================================

export const getProblemDetailResponseCount = (
    problemDetail
) => {

    const value =
        problemDetail
            ?.total_responses

        ??

        problemDetail
            ?.response_count

        ??

        problemDetail
            ?.responses_count

        ??

        problemDetail
            ?.responses
            ?.length

        ??

        0;


    return normalizeProblemDetailNumber(
        value,
        0
    );
};


// =========================================================
// PRIORITY — URGENT
// =========================================================

export const isProblemDetailUrgent = (
    problemDetail
) => {

    return normalizeProblemDetailBoolean(
        problemDetail
            ?.is_urgent
    );
};


// =========================================================
// PRIORITY — OFFERED COINS
// =========================================================

export const getProblemDetailOfferedCoins = (
    problemDetail
) => {

    return normalizeProblemDetailNumber(
        problemDetail
            ?.offered_coins,
        0
    );
};


// =========================================================
// PRIORITY — DEADLINE
// =========================================================

export const getProblemDetailDeadline = (
    problemDetail
) => {

    const value =
        problemDetail
            ?.deadline;


    if (
        value === null
        ||
        value === undefined
        ||
        value === ""
    ) {

        return null;
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }


    return value;
};


// =========================================================
// PRIORITY VIEW MODEL
//
// Header, Priority va boshqa componentlar
// bir xil source of truth ishlatishi uchun.
// =========================================================

export const getProblemDetailPriorityViewModel = (
    problemDetail
) => {

    const isUrgent =
        isProblemDetailUrgent(
            problemDetail
        );


    const offeredCoins =
        getProblemDetailOfferedCoins(
            problemDetail
        );


    const deadline =
        getProblemDetailDeadline(
            problemDetail
        );


    return {

        isUrgent,

        offeredCoins,

        deadline,

        hasPriorityInformation:
            isUrgent
            ||
            offeredCoins > 0
            ||
            Boolean(
                deadline
            ),
    };
};


// =========================================================
// NORMALIZE STACK
//
// Backend:
//
// language_data
// technology_data
//
// Compatibility:
//
// languages
// technologies
//
// Array ichida string bo‘lsa ham saqlanadi.
// =========================================================

const normalizeProblemDetailStack = (
    primary,
    fallback
) => {

    const source =
        Array.isArray(
            primary
        )
            ? primary

            : Array.isArray(
                fallback
            )
                ? fallback

                : [];


    return source
        .filter(
            (
                item
            ) => {

                if (
                    typeof item ===
                    "string"
                ) {

                    return Boolean(
                        item.trim()
                    );
                }


                return Boolean(
                    item
                );
            }
        );
};


// =========================================================
// LANGUAGES
// =========================================================

export const getProblemDetailLanguages = (
    problemDetail
) => {

    return normalizeProblemDetailStack(

        problemDetail
            ?.language_data,

        problemDetail
            ?.languages
    );
};


// =========================================================
// TECHNOLOGIES
// =========================================================

export const getProblemDetailTechnologies = (
    problemDetail
) => {

    return normalizeProblemDetailStack(

        problemDetail
            ?.technology_data,

        problemDetail
            ?.technologies
    );
};


// =========================================================
// OWNER
// =========================================================

export const isProblemDetailOwner = (
    problemDetail,
    currentUser
) => {

    if (
        !problemDetail
        ||
        !currentUser
    ) {

        return false;
    }


    const problemUser =
        problemDetail
            ?.user;


    if (
        !problemUser
    ) {

        return false;
    }


    // =====================================================
    // ID FIRST
    // =====================================================

    if (
        currentUser.id !==
            null
        &&
        currentUser.id !==
            undefined
        &&
        problemUser.id !==
            null
        &&
        problemUser.id !==
            undefined
    ) {

        return isSameProblemDetailId(
            currentUser.id,
            problemUser.id
        );
    }


    // =====================================================
    // USERNAME FALLBACK
    // =====================================================

    const currentUsername =
        normalizeProblemDetailText(
            currentUser.username
        );


    const ownerUsername =
        normalizeProblemDetailText(
            problemUser.username
        );


    if (
        !currentUsername
        ||
        !ownerUsername
    ) {

        return false;
    }


    return (
        currentUsername
            .toLowerCase()
        ===
        ownerUsername
            .toLowerCase()
    );
};


// =========================================================
// VIEW MODEL
//
// Parent component uchun barcha asosiy
// normalized / derived data shu yerdan chiqadi.
// =========================================================

export const getProblemDetailViewModel = (
    problemDetail,
    currentUser
) => {

    const priority =
        getProblemDetailPriorityViewModel(
            problemDetail
        );


    return {

        // =================================================
        // STATUS
        // =================================================

        isSolved:
            isProblemDetailSolved(
                problemDetail
            ),

        isRejected:
            isProblemDetailRejected(
                problemDetail
            ),


        // =================================================
        // STAR
        // =================================================

        hasStarred:
            hasProblemDetailStar(
                problemDetail
            ),


        // =================================================
        // OWNER
        // =================================================

        isOwner:
            isProblemDetailOwner(
                problemDetail,
                currentUser
            ),


        // =================================================
        // RESPONSES
        // =================================================

        responseCount:
            getProblemDetailResponseCount(
                problemDetail
            ),


        // =================================================
        // STACK
        // =================================================

        languages:
            getProblemDetailLanguages(
                problemDetail
            ),

        technologies:
            getProblemDetailTechnologies(
                problemDetail
            ),


        // =================================================
        // PRIORITY
        // =================================================

        isUrgent:
            priority.isUrgent,

        offeredCoins:
            priority.offeredCoins,

        deadline:
            priority.deadline,

        hasPriorityInformation:
            priority.hasPriorityInformation,
    };
};


// =========================================================
// HTTP STATUS
// =========================================================

export const getProblemDetailHttpStatus = (
    error
) => {

    const rawStatus =
        error?.response?.status
        ??
        error?.status
        ??
        error?.serverStatus
        ??
        null;


    const status =
        Number(
            rawStatus
        );


    if (
        !Number.isInteger(
            status
        )
        ||
        status < 100
        ||
        status > 599
    ) {

        return null;
    }


    return status;
};


// =========================================================
// ERROR DATA
// =========================================================

const getProblemDetailErrorData = (
    error
) => {

    return (
        error?.serverData
        ??
        error?.response?.data
        ??
        null
    );
};


// =========================================================
// FIRST OBJECT ERROR MESSAGE
// =========================================================

const getFirstObjectErrorMessage = (
    data
) => {

    if (
        !data
        ||
        typeof data !==
            "object"
        ||
        Array.isArray(
            data
        )
    ) {

        return "";
    }


    const values =
        Object.values(
            data
        );


    for (
        const value
        of values
    ) {

        if (
            typeof value ===
                "string"
            &&
            value.trim()
        ) {

            return value.trim();
        }


        if (
            Array.isArray(
                value
            )
            &&
            value.length > 0
        ) {

            const first =
                value[0];


            if (
                typeof first ===
                    "string"
                &&
                first.trim()
            ) {

                return first.trim();
            }
        }
    }


    return "";
};


// =========================================================
// ERROR MESSAGE
// =========================================================

export const getProblemDetailErrorMessage = (
    error,
    fallback = "Muammoni yuklashda xatolik yuz berdi."
) => {

    const data =
        getProblemDetailErrorData(
            error
        );


    // =====================================================
    // PLAIN SERVER STRING
    // =====================================================

    if (
        typeof data ===
            "string"
        &&
        data.trim()
    ) {

        return data.trim();
    }


    // =====================================================
    // COMMON DRF KEYS
    // =====================================================

    const directMessage =
        data?.detail
        ??
        data?.message
        ??
        data?.error;


    if (
        typeof directMessage ===
            "string"
        &&
        directMessage.trim()
    ) {

        return directMessage.trim();
    }


    // =====================================================
    // FIELD VALIDATION ERROR
    // =====================================================

    const objectMessage =
        getFirstObjectErrorMessage(
            data
        );


    if (
        objectMessage
    ) {

        return objectMessage;
    }


    // =====================================================
    // ERROR.MESSAGE
    // =====================================================

    if (
        typeof error?.message ===
            "string"
        &&
        error.message.trim()
    ) {

        const rawMessage =
            error.message.trim();


        try {

            const parsed =
                JSON.parse(
                    rawMessage
                );


            const parsedMessage =
                parsed?.detail
                ??
                parsed?.message
                ??
                parsed?.error;


            if (
                typeof parsedMessage ===
                    "string"
                &&
                parsedMessage.trim()
            ) {

                return parsedMessage.trim();
            }


            const parsedObjectMessage =
                getFirstObjectErrorMessage(
                    parsed
                );


            if (
                parsedObjectMessage
            ) {

                return parsedObjectMessage;
            }

        } catch {

            return rawMessage;
        }
    }


    return fallback;
};


// =========================================================
// NETWORK ERROR
// =========================================================

const isNetworkError = (
    error,
    status
) => {

    if (
        status
    ) {

        return false;
    }


    if (
        error?.request
        &&
        !error?.response
    ) {

        return true;
    }


    const message =
        String(
            error?.message
            ??
            ""
        )
            .trim()
            .toLowerCase();


    return (
        message.includes(
            "network error"
        )
        ||
        message.includes(
            "failed to fetch"
        )
        ||
        message.includes(
            "network request failed"
        )
        ||
        message.includes(
            "load failed"
        )
    );
};


// =========================================================
// TIMEOUT ERROR
// =========================================================

const isTimeoutError = (
    error,
    status
) => {

    if (
        status === 408
        ||
        status === 504
    ) {

        return true;
    }


    const code =
        String(
            error?.code
            ??
            ""
        )
            .trim()
            .toUpperCase();


    const message =
        String(
            error?.message
            ??
            ""
        )
            .trim()
            .toLowerCase();


    return (
        code ===
            "ECONNABORTED"
        ||
        code ===
            "ETIMEDOUT"
        ||
        message.includes(
            "timeout"
        )
        ||
        message.includes(
            "timed out"
        )
    );
};


// =========================================================
// CANCELED REQUEST
// =========================================================

export const isProblemDetailRequestCanceled = (
    error
) => {

    return (
        error?.name ===
            "CanceledError"
        ||
        error?.name ===
            "AbortError"
        ||
        error?.code ===
            "ERR_CANCELED"
    );
};


// =========================================================
// ERROR STATE
// =========================================================

export const getProblemDetailErrorState = (
    error
) => {

    const status =
        getProblemDetailHttpStatus(
            error
        );


    const serverMessage =
        getProblemDetailErrorMessage(
            error
        );


    // =====================================================
    // 404
    // =====================================================

    if (
        status === 404
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .NOT_FOUND,

            status,

            code:
                "problem.not_found",

            title:
                "Muammo topilmadi",

            message:
                "Bu muammo mavjud emas, o‘chirilgan yoki havola eskirgan bo‘lishi mumkin.",

            technicalMessage:
                serverMessage,

            canRetry:
                false,

            showBack:
                true,
        };
    }


    // =====================================================
    // 401
    // =====================================================

    if (
        status === 401
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .UNAUTHORIZED,

            status,

            code:
                "auth.required",

            title:
                "Kirish talab qilinadi",

            message:
                "Bu muammoni ko‘rish uchun autentifikatsiya talab qilinmoqda.",

            technicalMessage:
                serverMessage,

            canRetry:
                false,

            showBack:
                true,
        };
    }


    // =====================================================
    // 403
    // =====================================================

    if (
        status === 403
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .FORBIDDEN,

            status,

            code:
                "access.denied",

            title:
                "Ruxsat yo‘q",

            message:
                "Sizda ushbu muammoni ko‘rish uchun yetarli ruxsat mavjud emas.",

            technicalMessage:
                serverMessage,

            canRetry:
                false,

            showBack:
                true,
        };
    }


    // =====================================================
    // 429
    // =====================================================

    if (
        status === 429
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .RATE_LIMIT,

            status,

            code:
                "request.rate_limited",

            title:
                "Juda ko‘p so‘rov yuborildi",

            message:
                "Server vaqtincha yangi so‘rovlarni cheklamoqda. Birozdan keyin qayta urinib ko‘ring.",

            technicalMessage:
                serverMessage,

            canRetry:
                true,

            showBack:
                true,
        };
    }


    // =====================================================
    // TIMEOUT
    // =====================================================

    if (
        isTimeoutError(
            error,
            status
        )
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .TIMEOUT,

            status,

            code:
                "request.timeout",

            title:
                "So‘rov vaqti tugadi",

            message:
                "Server javob berishga ulgurmagan. Qayta urinib ko‘ring.",

            technicalMessage:
                serverMessage,

            canRetry:
                true,

            showBack:
                true,
        };
    }


    // =====================================================
    // NETWORK
    // =====================================================

    if (
        isNetworkError(
            error,
            status
        )
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .NETWORK,

            status:
                null,

            code:
                "network.unreachable",

            title:
                "Server bilan bog‘lanib bo‘lmadi",

            message:
                "Internet aloqasi yoki backend server holatini tekshiring va qayta urinib ko‘ring.",

            technicalMessage:
                serverMessage,

            canRetry:
                true,

            showBack:
                true,
        };
    }


    // =====================================================
    // 5XX
    // =====================================================

    if (
        status
        &&
        status >= 500
    ) {

        return {

            type:
                PROBLEM_DETAIL_ERROR_TYPES
                    .SERVER,

            status,

            code:
                "server.failure",

            title:
                "Serverda xatolik yuz berdi",

            message:
                "Muammo ma’lumotlarini serverdan olishda xatolik yuz berdi. Qayta urinib ko‘ring.",

            technicalMessage:
                serverMessage,

            canRetry:
                true,

            showBack:
                true,
        };
    }


    // =====================================================
    // UNKNOWN
    // =====================================================

    return {

        type:
            PROBLEM_DETAIL_ERROR_TYPES
                .UNKNOWN,

        status,

        code:
            "request.failed",

        title:
            "Muammoni yuklab bo‘lmadi",

        message:
            serverMessage
            ||
            "Noma’lum xatolik yuz berdi.",

        technicalMessage:
            serverMessage,

        canRetry:
            true,

        showBack:
            true,
    };
};


// =========================================================
// MISSING ID
// =========================================================

export const getMissingProblemDetailState = () => {

    return {

        type:
            PROBLEM_DETAIL_ERROR_TYPES
                .NOT_FOUND,

        status:
            404,

        code:
            "problem.invalid_id",

        title:
            "Muammo topilmadi",

        message:
            "Muammo identifikatori mavjud emas yoki noto‘g‘ri.",

        technicalMessage:
            "",

        canRetry:
            false,

        showBack:
            true,
    };
};