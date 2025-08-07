import { handleRequest } from "../../../config/http-client.gateway";

export const getAllSimulators = async () => {
  try {
    const response = await handleRequest("get", "/simulators/all");

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getSimulatorsByCategory = async (categoryId) => {
  try {
    const response = await handleRequest("get", `/simulators/category/${categoryId}`);

    if (response.type !== 'SUCCESS') {
      // Si es un error específico de categoría no encontrada, lo relanzamos tal como viene
      if (response.text && response.text.includes('Categoría no encontrada o inactiva')) {
        const error = new Error(response.text);
        error.isCategoryNotFound = true;
        throw error;
      }
      throw new Error(response.text);
    }

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createSimulator = async (payload) => {
  try {
    const response = await handleRequest("post", "/simulators", payload);

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const updateSimulator = async (id, payload) => {
  try {
    const response = await handleRequest("put", `/simulators/${id}`, payload);

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const toggleSimulatorStatus = async (id, currentStatus) => {
  try {
    // Usar PUT para actualizar el status del simulador
    const response = await handleRequest("put", `/simulators/${id}`, { 
      status: !currentStatus 
    });

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getSimulatorById = async (id) => {
  try {
    const response = await handleRequest("get", `/simulators/${id}`);

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};
