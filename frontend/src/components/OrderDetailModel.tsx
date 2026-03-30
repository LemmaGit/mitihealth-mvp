import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Download, Printer } from "lucide-react";
import type { OrderItem } from "./OrderItemCard";
import { format } from "date-fns";
import { OrderTimeline } from "./OrderTimeLine";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderItem | null;
}

export const OrderDetailsModal = ({ open, onOpenChange, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-medium">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ordered on</p>
              <p className="text-sm font-medium">
                {format(new Date(order.orderedAt), "PPP")}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Order Timeline */}
          <OrderTimeline status={order.status} />
          
          <Separator />
          
          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-semibold">Items</h4>
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
              <img
                src={order.productImage}
                alt={order.productName}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {order.quantity} × {order.price} ETB
                </p>
              </div>
              <p className="font-bold text-primary">
                {order.price * order.quantity} ETB
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{order.price * order.quantity} ETB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{order.price * order.quantity} ETB</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="size-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" />
              Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
