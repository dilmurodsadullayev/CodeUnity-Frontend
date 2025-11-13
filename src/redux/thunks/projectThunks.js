// projectThunks.js

// Sizning features/projects dan action creatorlaringiz
import { 
    collaborationActionFailure, 
    collaborationActionStart, 
    collaborationActionSuccess, 
    getCollaborationRequestsFailure, 
    getCollaborationRequestsStart, 
    getCollaborationRequestsSuccess,

    // ✅ YANGI: Collaborator action creatorlari
    getCollaboratorsStart,
    getCollaboratorsSuccess,
    getCollaboratorsFailure,

} from "../../features/projects";

// Sizning services/project dan service funksiyalaringiz
import ProjectService from "../../services/project"; // Bu yerda getProjectCollaborators, updateCollaborationRequest va boshqalar bor deb hisoblaymiz


// =============================================================
// LOYIHA HAMKORLARINI YUKLASH (FETCH COLLABORATORS)
// =============================================================
// 👇 YANGI: Loyiha hamkorlarini yuklash uchun Redux Thunk
export const fetchProjectCollaborators = (projectId) => async (dispatch) => {
    dispatch(getCollaboratorsStart());

    try {
        // ProjectService.getProjectCollaborators funksiyasini chaqirish
        const collaborators = await ProjectService.getProjectCollaborators(projectId);
        dispatch(getCollaboratorsSuccess(collaborators));

    } catch (error) {
        const errorMessage = error.detail || error.message || "Loyihadagi hamkorlarni yuklashda kutilmagan xato yuz berdi.";
        dispatch(getCollaboratorsFailure(errorMessage));
    }
};


// =============================================================
// HAMKORLIK SO'ROVINI YUKLASH (FETCH REQUESTS)
// =============================================================
export const fetchCollaborationRequests = (projectId) => async (dispatch) => {
    dispatch(getCollaborationRequestsStart());
    try {
        const requests = await ProjectService.getCollaborationRequests(projectId);
        dispatch(getCollaborationRequestsSuccess(requests));
    } catch (error) {
        const errorMessage = error.detail || error.message || "Hamkorlik so'rovlarini yuklashda kutilmagan xato yuz berdi.";
        dispatch(getCollaborationRequestsFailure(errorMessage));
    }
};


// =============================================================
// HAMKORLIK SO'ROVINI YUBORISH (SEND REQUEST)
// =============================================================
export const sendCollaborationRequest = (projectId, requestData) => async (dispatch) => {
    dispatch(collaborationActionStart());

    try {
        const newRequest = await ProjectService.createCollaborationRequest(projectId, requestData);
        dispatch(collaborationActionSuccess());
        
        return newRequest; 

    } catch (error) {
        let errorMessage = "So'rov yuborishda kutilmagan xato yuz berdi.";
        if (error.non_field_errors && error.non_field_errors.length > 0) {
            errorMessage = error.non_field_errors[0];
        } else if (error.detail) {
            errorMessage = error.detail;
        } else if (error.message) {
            errorMessage = error.message;
        }

        dispatch(collaborationActionFailure(errorMessage));
        throw new Error(errorMessage);
    }
};


// =============================================================
// SO'ROVNI BOSHQARISH (MANAGE REQUEST: ACCEPT/REJECT)
// =============================================================
// ✅ TO'G'IRLASH: Hamkorlar ro'yxatini ham yangilash qo'shildi
export const manageCollaborationRequest = (requestId, newStatus, projectId) => async (dispatch) => {
    dispatch(collaborationActionStart());

    try {
        // 1. So'rovni yangilash (PUT)
        const updatedRequest = await ProjectService.updateCollaborationRequest(requestId, newStatus);
        
        dispatch(collaborationActionSuccess());
        
        // 2. Agar qabul qilinsa, Hamkorlar ro'yxatini yuklash kerak
        if (newStatus === 'accepted') {
             // Loyihaning tasdiqlangan hamkorlarini yuklash
             await dispatch(fetchProjectCollaborators(projectId)); 
        }
        
        // 3. So'rovlar ro'yxatini yangilash (qabul qilingan so'rov pending ro'yxatdan o'chirilishi kerak)
        await dispatch(fetchCollaborationRequests(projectId)); 

        return updatedRequest;

    } catch (error) {
        const errorMessage = error.detail || error.message || "So'rovni boshqarishda kutilmagan xato yuz berdi.";
        dispatch(collaborationActionFailure(errorMessage));
        throw new Error(errorMessage);
    }
};


// =============================================================
// SO'ROVNI O'CHIRISH (DELETE REQUEST)
// =============================================================
export const removeCollaborationRequest = (requestId, projectId) => async (dispatch) => {
    dispatch(collaborationActionStart());

    try {
        // 1. So'rovni o'chirish (DELETE)
        await ProjectService.deleteCollaborationRequest(requestId);
        
        dispatch(collaborationActionSuccess());
        
        // 2. Ro'yxatni yangilash uchun qayta yuklash
        dispatch(fetchCollaborationRequests(projectId));

    } catch (error) {
        const errorMessage = error.detail || error.message || "So'rovni o'chirishda kutilmagan xato yuz berdi.";
        dispatch(collaborationActionFailure(errorMessage));
        throw new Error(errorMessage);
    }
};