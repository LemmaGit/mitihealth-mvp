import { useNavigate } from "react-router-dom";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const { patient } = useAppApi();
  const { data: consultations = [] } = useQuery({
    queryKey: ["patient", "consultations", "dashboard"],
    queryFn: () => patient.getMyConsultations(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["patient", "orders", "dashboard"],
    queryFn: () => patient.getMyOrders(),
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight mb-1">Patient Dashboard</h1>
        <p className="text-muted-foreground">Recent consultations and orders.</p>
      </header>

      <div className="grid gap-3">
        <div className="rounded-xl bg-card p-5 shadow-botanical">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Consultations</h2>
            <button className="text-sm text-primary" onClick={() => navigate("/patient/consultations")}>View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {(consultations as any[]).slice(0, 5).map((c: any) => (
              <div key={c._id} className="text-sm text-muted-foreground">{c.consultationType} • {new Date(c.consultationDate).toLocaleDateString()}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-botanical">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-sm text-primary" onClick={() => navigate("/patient/orders")}>View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {(orders as any[]).slice(0, 5).map((o: any) => (
              <div key={o._id} className="text-sm text-muted-foreground">{o.productId?.name || "Product"} • {o.orderStatus}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
