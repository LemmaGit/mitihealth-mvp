import { apiClient } from "./client";

export const commonApi = (getToken: () => Promise<string | null>) => ({
  getProducts: (params?: Record<string, string | number | undefined>) => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => typeof v !== "undefined")
            .map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : "";
    return apiClient(`/products${query}`, { method: "GET" }, getToken);
  },
    
  getPractitioners: (params?: Record<string, string | number | undefined>) => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => typeof v !== "undefined")
            .map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : "";
    return apiClient(`/practitioners${query}`, { method: "GET" }, getToken);
  },
    
  getPractitioner: (id: string) => 
    apiClient(`/practitioners/${id}`, { method: "GET" }, getToken),
    
  getMessages: (receiverId: string) => 
    apiClient(`/messages/${receiverId}`, { method: "GET" }, getToken),
  
  sendMessage: (receiverId: string, data: FormData | { text?: string }) =>
    apiClient(
      `/messages/send/${receiverId}`,
      { method: "POST", body: data instanceof FormData ? data : JSON.stringify(data) },
      getToken,
    ),
});
