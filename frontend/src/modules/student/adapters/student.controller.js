import { handleRequest } from '../../../config/http-client.gateway.js';
import httpClient from '../../../config/http-client.gateway.js';

export const getSimulatorQuestions = async (simulatorId) => {
    try {
        const response = await handleRequest('get', `/questions/simulator/${simulatorId}`)

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const saveStudentAnswers = async (studentId, simulatorId, answers, files) => {
    try {
        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('simulator_id', simulatorId);
        formData.append('answerList', JSON.stringify(answers));

        // Agregar archivos de video si existen
        files.forEach((file, index) => {
            formData.append('files', file, file.name);
        });

        const { status, data } = await httpClient.post('/answers/save', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return {
            result: status === 200 || status === 201 ? data.result : null,
            metadata: status === 200 || status === 201 ? data.metadata : null,
            type: data.type || 'SUCCESS',
            text: data.text || 'Respuestas guardadas exitosamente'
        };
    } catch (error) {
        throw new Error(error.response?.data?.text || 'Error al guardar las respuestas');
    }
}

export const saveSuggestion = async (category, suggestionName, description) => {
    try {
        const response = await handleRequest('post', '/suggestions', {
            category,
            suggestionName,
            description
        });

        if (response.type !== 'SUCCESS') {
            throw new Error(response.text || 'Error al guardar la sugerencia');
        }

        return response;
    } catch (error) {
        throw new Error(error.message || 'Error al conectar con el servidor');
    }
}

export const getStudentCategoriesAndSimulators = async (studentId) => {
    try {
        const response = await handleRequest('get', `/history/my-results/${studentId}`);

        if (response.type !== 'SUCCESS' || response.status === 'ERROR') {
            throw new Error(response.text || 'Error al obtener las categorías y simuladores');
        }

        return response;
    } catch (error) {
        throw new Error(error.message || 'Error al conectar con el servidor');
    }
}

export const getStudentAnswersAndComments = async (simulatorId, studentId) => {
    try {
        const response = await handleRequest('get', `/answers/student/${studentId}/simulator/${simulatorId}/with-evaluation`);

        if (response.type !== 'SUCCESS' || response.status === 'ERROR') {
            throw new Error(response.text || 'Error al obtener las respuestas y comentarios');
        }

        return response;
    } catch (error) {
        throw new Error(error.message || 'Error al conectar con el servidor');
    }
}

export const getStudentAnswersWithoutComments = async (simulatorId, studentId) => {
    try {
        const response = await handleRequest('get', `/answers/student/${studentId}/simulator/${simulatorId}/without-evaluation`);

        if (response.type !== 'SUCCESS' || response.status === 'ERROR') {
            throw new Error(response.text || 'Error al obtener las respuestas');
        }

        return response;
    } catch (error) {
        throw new Error(error.message || 'Error al conectar con el servidor');
    }
}

