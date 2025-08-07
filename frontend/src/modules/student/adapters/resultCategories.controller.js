import { handleRequest } from "../../../config/http-client.gateway";

export const getCategoriesByStudent = async (student_id) => {
    try {
        const response = await handleRequest("get", `/users/student/${student_id}/categories`);

        if (response.type !== "SUCCESS" || response.status === "ERROR")
            throw new Error(response.text);

        return response.result;
    } catch (e) {
        throw new Error(e.message);
    }
};