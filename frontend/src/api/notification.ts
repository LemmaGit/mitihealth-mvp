import { apiClient } from "./client";

export const notificationApi = (getToken: () => Promise<string | null>) => ({
  getMine: () => apiClient("/notifications/me", { method: "GET" }, getToken),
  markRead: (id: string) => apiClient(`/notifications/${id}/read`, { method: "PATCH" }, getToken),
  clearOne: (id: string) => apiClient(`/notifications/${id}`, { method: "DELETE" }, getToken),
});
