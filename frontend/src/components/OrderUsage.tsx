/*import { useState } from "react";
import { OrderItemCard, OrderItem } from "./OrderItemCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderDetailsModal } from "./OrderDetailsModal";

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderData);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {orders.map(order => (
          <OrderItemCard
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            onCancelOrder={(id) => console.log("Cancel", id)}
            onReorder={(productId) => console.log("Reorder", productId)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <OrderSummaryCard
            key={order.id}
            order={order}
            onClick={handleViewDetails}
          />
        ))}
      </div>

      <OrderDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
      />
    </div>
  );
}*/