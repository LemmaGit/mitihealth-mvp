import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Package, Truck, XCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn, statusConfig } from "../lib/utils";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  orderedAt: Date | string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
}

interface OrderItemCardProps {
  order: OrderItem;
  onViewDetails?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onReorder?: (productId: string) => void;
}



export const OrderItemCard = ({ 
  order, 
  onViewDetails, 
  onCancelOrder, 
  onReorder 
}: OrderItemCardProps) => {
  const StatusIcon = statusConfig[order.status].icon;
  const orderDate = new Date(order.orderedAt);
  const isToday = orderDate.toDateString() === new Date().toDateString();
  const isYesterday = orderDate.toDateString() === new Date(Date.now() - 86400000).toDateString();
  
  const getDateLabel = () => {
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return format(orderDate, "MMM d, yyyy");
  };

  return (
    <Card className="group overflow-hidden shadow-botanical transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="relative h-32 w-full sm:h-auto sm:w-32 shrink-0 overflow-hidden bg-muted">
            <img
              src={order.productImage}
              alt={order.productName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <Badge 
              className={cn(
                "absolute left-2 top-2 gap-1.5 px-2.5 py-1 text-xs font-semibold border",
                statusConfig[order.status].color
              )}
            >
              <StatusIcon className="size-3" />
              {statusConfig[order.status].label}
            </Badge>
          </div>

          {/* Order Details */}
          <div className="flex-1 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="font-headline text-lg font-bold leading-tight text-foreground hover:text-primary transition-colors">
                  {order.productName}
                </h3>
                
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Package className="size-4" />
                    <span>Qty: {order.quantity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    <span>Ordered: {getDateLabel()}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-1.5">
                      <Truck className="size-4" />
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                  <span className="text-2xl font-bold text-primary">
                    {order.price * order.quantity}
                  </span>
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    ETB
                  </span>
                </div>
                {order.quantity > 1 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.price} ETB each
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4">
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelOrder?.(order.id)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <XCircle className="size-3.5" />
                  Cancel Order
                </Button>
              )}
              
              {order.status === "delivered" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReorder?.(order.productId)}
                  className="gap-1.5"
                >
                  <Package className="size-3.5" />
                  Reorder
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(order.id)}
                className="gap-1.5 ml-auto"
              >
                View Details
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};