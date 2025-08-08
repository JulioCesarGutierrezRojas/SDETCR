import { handleRequest } from "../../../config/http-client.gateway.js";

export const getAllStudentsWithSimulatorCount = async () => {
    try {
        const response = await handleRequest("get", "/users/students/simulator-count");

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const assignStudentsToMentor = async (mentorId, studentIds) => {
    try {
        const response = await handleRequest("post", "/evaluation/mentor/assign", {
            mentor_id: mentorId,
            student_ids: studentIds
        });

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getStudentsByMentor = async (mentorId) => {
    try {
        const response = await handleRequest("get", `/users/students-by-mentor/${mentorId}`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getStudentCategoriesAndSimulators = async (studentId) => {
    try {
        const response = await handleRequest("get", `/history/student/${studentId}/categories`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getFeedbackByStudentId = async (studentId) => {
    try {
        const response = await handleRequest("get", `/evaluation/feedback/${studentId}`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getStudentCategories = async (studentId) => {
    try {
        const response = await handleRequest("get", `/users/student/${studentId}/categories`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const createEvaluation = async (mentorId, studentId, simulatorId, comment, finalScore) => {
    try {
        const response = await handleRequest("post", "/evaluation/create", {
            mentor_id: mentorId,
            student_id: studentId,
            simulator_id: simulatorId,
            comment: comment,
            final_score: finalScore
        });

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};
