import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Lock, Calendar, Clock, Video, Shield, Wallet, Building2, CreditCard, Leaf } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import { toast } from "sonner";

const paymentMethods = [
  { id: "telebirr", name: "Telebirr", desc: "Mobile Money Wallet", icon: Wallet, color: "text-blue-600" },
  { id: "cbe", name: "CBE Birr", desc: "Commercial Bank of Ethiopia", icon: Building2, color: "text-purple-700" },
  { id: "bank", name: "Bank Transfer", desc: "Direct Deposit / Manual Upload", icon: CreditCard, color: "text-secondary" },
];

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { common, patient } = useAppApi();
  const [consultationType, setConsultationType] = useState<"chat" | "audio" | "video">("video");
  const [selectedPayment, setSelectedPayment] = useState("telebirr");
  const payloadFromState = (location.state || {}) as { consultationDate?: string; consultationTime?: string };
  const consultationDate = payloadFromState.consultationDate || new Date().toISOString();
  const consultationTime = payloadFromState.consultationTime || "09:00-09:30";

  const { data: practitioner } = useQuery({
    queryKey: ["patient", "practitioner", id],
    queryFn: () => common.getPractitioner(id!),
    enabled: !!id,
  });
  const mutation = useMutation({
    mutationFn: () =>
      patient.bookConsultation({
        practitionerId: id,
        consultationDate: new Date().toISOString(),
        consultationTime,
        consultationType,
      }),
    onSuccess: () => {
      toast.success("Consultation booked successfully.");
      navigate("/patient/consultations");
    },
    onError: (err: any) => toast.error(err.message || "Failed to book consultation"),
  });

  if (!practitioner) {
    return (
      
        <div className="flex items-center justify-center pt-40">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
     
    );
  }

  const fee = practitioner?.consultationTypes?.[consultationType]?.price || 0;
  const serviceFee = 25;
  const total = fee + serviceFee;

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
  
      <>
        <header className="mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight mb-3">
            Finalize Booking
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">Secure Checkout</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Summary */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-surface-container-low rounded-3xl p-8 space-y-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-foreground mb-2">Booking Summary</h2>
                  <p className="text-muted-foreground">Review your consultation details before payment.</p>
                </div>
                <span className="bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Confirmed Slot
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-6 bg-surface-container-lowest p-6 rounded-2xl">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800"} alt={practitioner?.clerkId} className="w-full h-full object-cover" width={96} height={96} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-headline font-bold text-primary">{practitioner?.clerkId}</h3>
                  <p className="text-secondary font-medium">{practitioner?.specialization}</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 text-primary" /> {new Date(consultationDate).toDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 text-primary" /> {consultationTime}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Video className="w-4 h-4 text-primary" /> {consultationType.toUpperCase()} Consultation
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["chat", "audio", "video"] as const).map((type) => (
                  <button
                    key={type}
                    className={`rounded-lg px-3 py-2 text-sm ${consultationType === type ? "bg-primary text-primary-foreground" : "bg-surface-container-low"}`}
                    onClick={() => setConsultationType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            {/* Botanical Insight */}
            <section className="bg-tertiary-container text-on-tertiary-container rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-5 h-5" />
                  <span className="font-label font-bold uppercase tracking-widest text-xs">Botanical Insight</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">The Power of Koseret</h3>
                <p className="leading-relaxed text-sm opacity-90">
                  Kosret (Lippia abyssinica) has been used in Ethiopia for centuries not just as a culinary
                  spice, but for its potent antimicrobial properties. Your session today may explore how
                  such indigenous herbs can support your specific health goals.
                </p>
              </div>
            </section>
          </div>

          {/* Right: Payment */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-3xl shadow-botanical p-8 sticky top-28 space-y-8">
              <div>
                <h2 className="text-2xl font-headline font-bold text-foreground mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                        selectedPayment === pm.id
                          ? "bg-primary/5 ring-2 ring-primary"
                          : "bg-surface-container-low hover:bg-surface-container-high"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center">
                          <pm.icon className={`w-6 h-6 ${pm.color}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-foreground">{pm.name}</p>
                          <p className="text-xs text-muted-foreground">{pm.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === pm.id ? "border-primary bg-primary" : "border-outline-variant"
                      }`}>
                        {selectedPayment === pm.id && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="tibeb-divider" />

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Consultation Fee</span>
                  <span>{fee.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge</span>
                  <span>{serviceFee.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-foreground pt-2">
                  <span>Total</span>
                  <span>{total.toFixed(2)} ETB</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-headline font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3"
              >
                <Shield className="w-5 h-5" />
                Confirm Booking
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Payment coming soon. Booking is still confirmed on submit.
              </p>
            </div>
          </div>
        </div>
      </>
    
  );
};

export default Booking;
