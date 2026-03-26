import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, MapPin, ArrowRight, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";

const PractitionerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { common } = useAppApi();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const { data: practitioner, isLoading } = useQuery({
    queryKey: ["patient", "practitioner", id],
    queryFn: () => common.getPractitioner(id!),
    enabled: !!id,
  });
  const availability = useMemo(() => (Array.isArray(practitioner?.availability) ? practitioner.availability : []), [practitioner]);
  const selectedDay = availability[selectedDayIndex];

  if (!practitioner && !isLoading) {
    return (
      
        <div className="flex items-center justify-center pt-40">
          <p className="text-muted-foreground text-lg">Practitioner not found.</p>
        </div>
    );
  }

  return (
      // <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 lg:grid lg:grid-cols-12 lg:gap-12">
      <>
        <div className="lg:col-span-8 space-y-10">
          {/* Profile Header */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 aspect-square rounded-xl overflow-hidden relative group bg-surface-container">
              <img
                src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800"}
                alt={practitioner?.clerkId}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={512}
                height={512}
              />
              {practitioner?.verificationStatus === "approved" && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col justify-center space-y-4">
              <div>
                <span className="text-secondary font-label text-xs tracking-widest uppercase">
                  {practitioner?.specialization}
                </span>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mt-1 leading-tight">
                  {practitioner?.clerkId}
                </h1>
              </div>
              <div className="flex flex-wrap gap-3">
                {(practitioner?.conditionsTreated || []).map((s: string) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 rounded-full bg-surface-container-low text-primary text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{Math.max(0, new Date().getFullYear() - Number(practitioner?.practicingSinceEC || new Date().getFullYear()))}+</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-tighter">Years Exp.</span>
                </div>
                <div className="h-10 w-px bg-outline-variant/30" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">-</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-tighter">Consultations</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bio */}
          <section className="bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
            <h2 className="text-2xl font-headline font-semibold text-primary mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Professional Narrative
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {(practitioner?.bio || "").split("\n\n").filter(Boolean).map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="space-y-4">
            <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Practice Location
            </h2>
            <div className="h-64 rounded-2xl overflow-hidden bg-surface-container relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-container text-primary-foreground px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold text-sm">{practitioner?.location}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic px-2">
              {practitioner?.location}
            </p>
          </section>
        </div>

        <aside className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-botanical">
              <h3 className="text-xl font-headline font-bold text-primary mb-6">Schedule Consultation</h3>

              {/* Date Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-foreground">Select Date</h4>
                  <span className="text-xs text-primary font-medium">Availability</span>
                </div>
                <div className="flex justify-between gap-2">
                  {(availability || []).map((day: any, i: number) => (
                    <button
                      key={day.day}
                      onClick={() => {
                        setSelectedDayIndex(i);
                        setSelectedSlotIndex(0);
                      }}
                      className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all ${
                        selectedDayIndex === i
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-surface-container-low text-foreground hover:bg-surface-container"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold ${selectedDayIndex === i ? "opacity-80" : "text-muted-foreground"}`}>{day.day?.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-foreground mb-3">Available Slots</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(selectedDay?.slots || []).map((slot: any, i: number) => (
                    <button
                      key={`${slot.start}-${slot.end}`}
                      onClick={() => setSelectedSlotIndex(i)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                        selectedSlotIndex === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-low text-foreground hover:bg-primary/5"
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/patient/booking/${practitioner?.clerkId}`)
                }
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold tracking-tight shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                Book consultation
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-4 text-center">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Payments secured via Telebirr & Chapa
                </span>
              </div>
            </div>

          </div>
        </aside>
      </>
  );
};

export default PractitionerProfile;
