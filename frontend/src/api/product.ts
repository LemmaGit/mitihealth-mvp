import { apiClient } from "./client";

export const productApi = (getToken: () => Promise<string | null>) => ({
  getAllProducts: () => 
    apiClient("/products", { method: "GET" }, getToken),
    
  createProduct: (data: FormData) => 
    apiClient("/products", { method: "POST", body: data }, getToken),
    
  updateProduct: (id: string, data: FormData) => 
    apiClient(`/products/${id}`, { method: "PUT", body: data }, getToken),
    
  getSupplierProducts: (id: string) => 
    apiClient(`/products/${id}`, { method: "GET" }, getToken),
});
