const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to extract the error payload
    const errorData = await response.json().catch(() => ({}));
    console.log(errorData);
    throw new Error(errorData.message || "An error occurred while fetching data.");
  }

  return response.json();
};
