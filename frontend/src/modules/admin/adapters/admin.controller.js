import { handleRequest } from "../../../config/http-client.gateway.js";

// Obtener información del estudiante y sus categorías
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

// Obtener historial de simuladores del estudiante
export const getStudentHistory = async (studentId) => {
    try {
        const response = await handleRequest("get", `/history/student/${studentId}`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

// Obtener categorías y simuladores realizados por el estudiante
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

// Obtener detalle específico de un simulador del historial
export const getSimulatorFromHistory = async (studentId, simulatorId) => {
    try {
        const response = await handleRequest("get", `/history/student/${studentId}/simulator/${simulatorId}`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

// Obtener respuestas del estudiante con evaluación del mentor
export const getStudentAnswersWithEvaluation = async (studentId, simulatorId) => {
    try {
        const response = await handleRequest("get", `/answers/student/${studentId}/simulator/${simulatorId}/with-evaluation`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

// Obtener respuestas del estudiante sin evaluación del mentor
export const getStudentAnswersWithoutEvaluation = async (studentId, simulatorId) => {
    try {
        const response = await handleRequest("get", `/answers/student/${studentId}/simulator/${simulatorId}/without-evaluation`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};
