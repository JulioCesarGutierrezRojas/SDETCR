import { handleRequest } from "../../../config/http-client.gateway.js";

export const getAllUsers = async () => {
    try {
        const response = await handleRequest("get", "/users/all");

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const createUser = async (userData) => {
    try {
        const response = await handleRequest("post", "/users/create", userData);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await handleRequest("put", `/users/${userId}`, userData);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await handleRequest("delete", `/users/${userId}`);

        if (response.type !== 'SUCCESS')
            throw new Error(response.text);

        return response;
    } catch (e) {
        throw new Error(e.message);
    }
};
