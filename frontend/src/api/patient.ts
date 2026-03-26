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
    
  cancelOrder: (orderId: string) => 
    apiClient(`/orders/${orderId}/cancel`, { method: "PUT" }, getToken),
    
  startConsultation: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/start`, { method: "POST" }, getToken),
    
  completeConsultation: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/complete`, { method: "POST" }, getToken),
    
  getConsultationStatus: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/status`, { method: "GET" }, getToken),
});
