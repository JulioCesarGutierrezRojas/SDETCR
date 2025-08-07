import { handleRequest } from "../../../config/http-client.gateway";

export const getAllCategories = async () => {
  try {
    const response = await handleRequest("get", "/categories/all");

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};


export const createCategory = async (payload) => {
  try {
    const response = await handleRequest("post", "/categories/create", payload);

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};


export const updateCategory = async (payload) => {
  try {
    const response = await handleRequest("put", "/categories/update", payload);

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};


export const disableCategory = async (name) => {
  try {
    const response = await handleRequest("patch", "/categories/disable", { name });

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};