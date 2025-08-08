import { handleRequest } from "../../../config/http-client.gateway";

export const getSuggestionsApprovedAndPending = async () => {
  try {
    const response = await handleRequest("get", "/suggestions/approved-pending");

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const updateSuggestionStatus = async (suggestionId, status) => {
  try {
    const response = await handleRequest("patch", `/suggestions/${suggestionId}/status`, { status });

    if (response.type !== 'SUCCESS')
      throw new Error(response.text);

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};
