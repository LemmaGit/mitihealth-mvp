import { useState } from "react";
import { useAppApi } from "../../hooks/useAppApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statuses = ["placed", "confirmed", "shipped", "completed"];

export default function SupplierOrders() {
  const { supplier } = useAppApi();
  const [page, setPage] = useState(1);
  const perPage = 8;
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["supplier", "orders"],
    queryFn: () => supplier.getSupplierOrders(),
  });
  const mutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      supplier.updateOrderStatus(orderId, { status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["supplier", "orders"] });
    },
  });
  const rows = orders as any[];
  const totalPages = Math.ceil(rows.length / perPage) || 1;
  const paginated = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-primary">My Orders</h1>
      {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
      <div className="grid gap-3">
        {paginated.map((order: any) => (
          <div key={order._id} className="rounded-xl bg-card p-4 shadow-botanical">
            <p className="text-sm font-medium">{order.productId?.name || "Product"}</p>
            <p className="text-xs text-muted-foreground mt-1">Quantity: {order.quantity}</p>
            <div className="mt-3 flex gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={`rounded px-2 py-1 text-xs ${order.orderStatus === status ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  onClick={() => mutation.mutate({ orderId: order._id, status })}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {rows.length > 0 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-sm">Previous</button>
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
