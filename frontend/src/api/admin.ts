import { apiClient } from "./client";

export const adminApi = (getToken: () => Promise<string | null>) => ({
  verifyPractitioner: (id: string, data: unknown) => 
    apiClient(`/admin/practitioners/${id}/verify`, { method: "PATCH", body: JSON.stringify(data) }, getToken),
    
  verifyProduct: (id: string, data: unknown) => 
    apiClient(`/admin/products/${id}/verify`, { method: "PATCH", body: JSON.stringify(data) }, getToken),
    
  getUsers: () => 
    apiClient("/admin/users", { method: "GET" }, getToken),
    
  getAnalytics: () => 
    apiClient("/admin/analytics", { method: "GET" }, getToken),
});
