import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, Clock, ChevronRight } from "lucide-react";
import { cn, statusConfig } from "../lib/utils";
import { format } from "date-fns";

interface OrderSummary {
  id: string;
  totalAmount: number;
  itemCount: number;
  orderedAt: Date;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  image: string;
  productName: string;
}

interface OrderSummaryCardProps {
  order: OrderSummary;
  onClick?: (orderId: string) => void;
}

export const OrderSummaryCard = ({ order, onClick }: OrderSummaryCardProps) => {
  const orderDate = new Date(order.orderedAt);
  
  return (
    <Card 
      className="group cursor-pointer overflow-hidden shadow-botanical transition-all duration-300 hover:shadow-lg"
      onClick={() => onClick?.(order.id)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={order.image}
              alt={order.productName}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-headline font-semibold text-foreground line-clamp-1">
                  Order #{order.id.slice(-8)}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {order.productName}
                  {order.itemCount > 1 && ` + ${order.itemCount - 1} more item${order.itemCount - 1 > 1 ? 's' : ''}`}
                </p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>{format(orderDate, "MMM d, yyyy")}</span>
                <span>•</span>
                <Package className="size-3" />
                <span>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">
                  {order.totalAmount}
                </span>
                <span className="text-xs text-muted-foreground">ETB</span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="mt-2">
              <Badge 
                variant="outline"
                className={cn(
                  "gap-1.5 px-2 py-0.5 text-xs font-medium",
                  statusConfig[order.status].color
                )}
              >
                {statusConfig[order.status].icon && (
                  React.createElement(statusConfig[order.status].icon, { className: "size-3" })
                )}
                {statusConfig[order.status].label}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};