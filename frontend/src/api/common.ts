import { apiClient } from "./client";

export const commonApi = (getToken: () => Promise<string | null>) => ({
  getProducts: () => 
    apiClient("/products", { method: "GET" }, getToken),
    
  getPractitioners: () => 
    apiClient("/practitioners", { method: "GET" }, getToken),
    
  getPractitioner: (id: string) => 
    apiClient(`/practitioners/${id}`, { method: "GET" }, getToken),
    
  getMessages: (receiverId: string) => 
    apiClient(`/messages/${receiverId}`, { method: "GET" }, getToken),
});
