import { apiClient } from "./client";

export const patientApi = (getToken: () => Promise<string | null>) => ({
  bookConsultation: (data: unknown) => 
    apiClient("/consultations", { method: "POST", body: JSON.stringify(data) }, getToken),
    
  getMyConsultations: () => 
    apiClient("/consultations/me", { method: "GET" }, getToken),
    
  createOrder: (data: unknown) => 
    apiClient("/orders", { method: "POST", body: JSON.stringify(data) }, getToken),
    
  getMyOrders: () => 
    apiClient("/orders/me", { method: "GET" }, getToken),
});
