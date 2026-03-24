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
});
