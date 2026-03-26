import { apiClient } from "./client";

export const practitionerApi = (getToken: () => Promise<string | null>) => ({
  updateProfile: (data: unknown) => 
    apiClient("/practitioners/me", { method: "POST", body: JSON.stringify(data) }, getToken),
    
  updateAvailability: (data: unknown) => 
    apiClient("/practitioners/me/availability", { method: "PATCH", body: JSON.stringify(data) }, getToken),
    
  getMyConsultations: () => 
    apiClient("/consultations/me", { method: "GET" }, getToken),

  getPractitioner: (practitionerId:string) => 
    apiClient(`/practitioners/${practitionerId}`, { method: "GET" }, getToken),
  getPractitionerData: (practitionerId:string) => 
    apiClient(`/practitioners/data/${practitionerId}`, { method: "GET" }, getToken),
    
  startConsultation: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/start`, { method: "POST" }, getToken),
    
  completeConsultation: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/complete`, { method: "POST" }, getToken),
    
  getConsultationStatus: (consultationId: string) => 
    apiClient(`/consultations/${consultationId}/status`, { method: "GET" }, getToken),
});
