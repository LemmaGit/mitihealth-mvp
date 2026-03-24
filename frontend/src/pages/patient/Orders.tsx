import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery } from "@tanstack/react-query";

export default function PatientOrders() {
  const { patient } = useAppApi();
  const [page, setPage] = useState(1);
  const perPage = 8;
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["patient", "orders"],
    queryFn: () => patient.getMyOrders(),
  });
  const normalized = useMemo(() => (orders as any[]), [orders]);
  const totalPages = Math.ceil(normalized.length / perPage) || 1;
  const paginated = normalized.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-primary">My Orders</h1>
      {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
      <div className="grid gap-3">
        {paginated.map((order: any) => (
          <div key={order._id} className="rounded-xl bg-card p-4 shadow-botanical">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{order.productId?.name || "Product"}</p>
              <Badge className="bg-primary/10 text-primary">{order.orderStatus || "placed"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Quantity: {order.quantity}</p>
          </div>
        ))}
      </div>
      {normalized.length > 0 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-sm">Previous</button>
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
