import { apiClient } from "./client";

export const supplierApi = (getToken: () => Promise<string | null>) => ({
  createProduct: (formData: FormData) => 
    apiClient("/products", { method: "POST", body: formData }, getToken),
    
  updateProduct: (id: string, formData: FormData) => 
    apiClient(`/products/${id}`, { method: "PATCH", body: formData }, getToken),
    
  getSupplierOrders: () => 
    apiClient("/orders/supplier/me", { method: "GET" }, getToken),

  getSupplierProducts: (supplierId:string) => 
    apiClient(`/products/${supplierId}`, { method: "GET" }, getToken),
    
  updateOrderStatus: (orderId: string, data: unknown) => 
    apiClient(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify(data) }, getToken),
});
