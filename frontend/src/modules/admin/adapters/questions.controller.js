import { handleRequest } from "../../../config/http-client.gateway";

export const getQuestionsWithAnswersBySimulator = async (simulatorId) => {
  try {
    const response = await handleRequest("get", `/questions/admin/simulator/${simulatorId}`);

    // Si es el caso específico de "no se encontraron preguntas", retornamos una respuesta exitosa pero vacía
    if (response.type !== 'SUCCESS' && response.text === 'No se encontraron preguntas para este simulador') {
      return {
        type: 'SUCCESS',
        result: {
          simulator: null,
          questions: []
        },
        text: 'Simulador sin preguntas'
      };
    }

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createMultipleQuestions = async (simulatorId, questions) => {
  try {
    const response = await handleRequest("post", "/questions/create-multiple", {
      simulator_id: simulatorId,
      questions
    });

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const updateMultipleQuestions = async (simulatorId, questions) => {
  try {
    const response = await handleRequest("put", "/questions/update-multiple", {
      simulator_id: simulatorId,
      questions
    });

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};
