const API_BASE_URL = import.meta.env.VITE_API_URL;
import {
  ApiRequestError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../lib/errors";

type GetToken = () => Promise<string | null>;

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
  getToken?: GetToken 
) => {
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Automatically attach content type for simple JSON requests, 
  // ignoring FormData so fetch can set the right boundary headers.
  if (!(options.body instanceof FormData)) {
    //@ts-ignore
    headers["Content-Type"] = "application/json";
  }

  // Inject Authorization Token
  if (getToken) {
    const token = await getToken();
    if (token) {
      //@ts-ignore
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    throw new NetworkError("Failed to reach server. Please try again.", error);
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    const message = errorData.message || "An error occurred while fetching data.";

    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedError(message, errorData);
    }
    if (response.status === 404) {
      throw new NotFoundError(message, errorData);
    }
    if (response.status === 400 || response.status === 422) {
      throw new ValidationError(message, errorData);
    }
    throw new ApiRequestError(message, response.status, errorData);
  }

  // Handle empty responses or non-JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};
