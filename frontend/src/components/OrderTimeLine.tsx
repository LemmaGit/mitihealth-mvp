import { CheckCircle, Package, Truck, Home, Clock, XCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface OrderTimelineProps {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  estimatedDelivery?: Date;
}

const timelineSteps = {
  pending: { icon: Clock, label: "Order Placed", completed: true },
  processing: { icon: Package, label: "Processing", completed: true },
  shipped: { icon: Truck, label: "Shipped", completed: false },
  delivered: { icon: Home, label: "Delivered", completed: false },
};

export const OrderTimeline = ({ status, estimatedDelivery }: OrderTimelineProps) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
        <XCircle className="size-5" />
        <span className="text-sm font-medium">This order has been cancelled</span>
      </div>
    );
  }

  const currentStepIndex = Object.keys(timelineSteps).indexOf(status);
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-border" />
        
        {Object.entries(timelineSteps).map(([key, step], index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = key === status;
          const Icon = step.icon;
          
          return (
            <div key={key} className="relative flex gap-4 pb-8 last:pb-0">
              <div className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                isCompleted 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-muted-foreground/30 text-muted-foreground"
              )}>
                {isCompleted ? (
                  <CheckCircle className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>
              
              <div className="flex-1 pt-1">
                <p className={cn(
                  "font-semibold",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                {isCurrent && estimatedDelivery && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estimated delivery: {format(estimatedDelivery, "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
