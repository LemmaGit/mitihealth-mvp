import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Star, FileText, MapPin, Lightbulb, ArrowRight, Shield } from "lucide-react";
import { practitioners } from "../../data/practitioners";
// import mapAddis from "../../assets/map-addis.jpg";

const weekDays = [
  { short: "Mon", num: "02" },
  { short: "Tue", num: "03" },
  { short: "Wed", num: "04" },
  { short: "Thu", num: "05" },
  { short: "Fri", num: "06" },
];

const PractitionerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const practitioner = practitioners.find((p) => p.id === id);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(1);

  if (!practitioner) {
    return (
      
        <div className="flex items-center justify-center pt-40">
          <p className="text-muted-foreground text-lg">Practitioner not found.</p>
        </div>
    );
  }

  return (
      // <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 lg:grid lg:grid-cols-12 lg:gap-12">
      <>  
      {/* Left Column */}
        <div className="lg:col-span-8 space-y-10">
          {/* Profile Header */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 aspect-square rounded-xl overflow-hidden relative group bg-surface-container">
              <img
                src={practitioner.image}
                alt={practitioner.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={512}
                height={512}
              />
              {practitioner.verified && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col justify-center space-y-4">
              <div>
                <span className="text-secondary font-label text-xs tracking-widest uppercase">
                  {practitioner.title}
                </span>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mt-1 leading-tight">
                  {practitioner.name}
                </h1>
              </div>
              <div className="flex flex-wrap gap-3">
                {practitioner.specialties.map((s) => (
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
                  <span className="text-2xl font-bold text-primary">{practitioner.yearsExp}+</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-tighter">Years Exp.</span>
                </div>
                <div className="h-10 w-px bg-outline-variant/30" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{practitioner.consultations}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-tighter">Consultations</span>
                </div>
                <div className="h-10 w-px bg-outline-variant/30" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary">{practitioner.rating}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-tighter">Patient Rating</span>
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
              {practitioner.bio.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-5 rounded-xl">
                <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Education</h4>
                <ul className="space-y-2 text-sm">
                  {practitioner.education.map((e) => (
                    <li key={e} className="flex gap-2">
                      <span className="text-secondary">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl">
                <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Associations</h4>
                <ul className="space-y-2 text-sm">
                  {practitioner.associations.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="text-secondary">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-4">
            <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Practice Location
            </h2>
            <div className="h-64 rounded-2xl overflow-hidden bg-surface-container relative">
              <img
                src="../../assets/map-addis.jpg"
                alt="Map Location"
                className="w-full h-full object-cover grayscale opacity-80"
                loading="lazy"
                width={1024}
                height={512}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-container text-primary-foreground px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold text-sm">Bole Botanics Clinic</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic px-2">
              {practitioner.location} • {practitioner.hours}
            </p>
          </section>
        </div>

        {/* Right Column: Booking Sidebar */}
        <aside className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-botanical">
              <h3 className="text-xl font-headline font-bold text-primary mb-6">Schedule Consultation</h3>

              {/* Date Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-foreground">Select Date</h4>
                  <span className="text-xs text-primary font-medium">October 2023</span>
                </div>
                <div className="flex justify-between gap-2">
                  {weekDays.map((day, i) => (
                    <button
                      key={day.short}
                      onClick={() => setSelectedDay(i)}
                      className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all ${
                        selectedDay === i
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-surface-container-low text-foreground hover:bg-surface-container"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold ${selectedDay === i ? "opacity-80" : "text-muted-foreground"}`}>
                        {day.short}
                      </span>
                      <span className="text-sm font-bold">{day.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-foreground mb-3">Available Slots</h4>
                <div className="grid grid-cols-2 gap-3">
                  {practitioner.availableSlots.map((slot, i) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(i)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                        selectedSlot === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-low text-foreground hover:bg-primary/5"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking/${practitioner.id}`)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold tracking-tight shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                Confirm Booking
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-4 text-center">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Payments secured via Telebirr & Chapa
                </span>
              </div>
            </div>

            {/* Botanical Fact */}
            <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-3xl tibeb-pattern">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">Botanical Wisdom</p>
                  <p className="text-sm leading-relaxed">
                    Did you know? In Ethiopian tradition, the Damakesse leaf is often used for its potent
                    respiratory benefits. {practitioner.name.split(" ")[0]} integrates this with modern
                    nebulizer therapy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
  );
};

export default PractitionerProfile;
