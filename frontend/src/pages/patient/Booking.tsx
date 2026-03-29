import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageCircle,
  Phone,
  Video,
  User,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format, startOfDay } from "date-fns";
import { useAppApi } from "../../hooks/useAppApi";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { cn } from "../../lib/utils";
import {
  formatSpecialization,
  PRACTITIONER_PLACEHOLDER_IMG,
  yearsPracticing,
} from "../../lib/practitionerDisplay";
import { uuidv4 } from "zod";

const PLATFORM_FEE_ETB = 25;

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type Slot = { start: string; end: string };
type DayRow = { day: string; enabled: boolean; slots: Slot[] };
type ConsultationKind = "chat" | "audio" | "video";

function bookableDatesFromAvailability(
  availability: unknown,
  horizon = 28,
): { date: Date; slots: Slot[]; dayName: string }[] {
  if (!Array.isArray(availability)) return [];
  const enabled = (availability as DayRow[]).filter(
    (d) => d.enabled && d.slots?.length,
  );
  const byName = new Map(enabled.map((d) => [d.day, d.slots] as const));
  const out: { date: Date; slots: Slot[]; dayName: string }[] = [];
  const start = startOfDay(new Date());
  for (let i = 0; i < horizon; i++) {
    const date = addDays(start, i);
    const name = WEEKDAYS[date.getDay()];
    const slots = byName.get(name);
    if (slots?.length) {
      out.push({ date, slots, dayName: name });
    }
  }
  return out;
}

function generateSubSlots(slots: Slot[], durationMins: number): Slot[] {
  const result: Slot[] = [];
  for (const slot of slots) {
    if (!slot.start || !slot.end) continue;
    
    const [startStr, startAmpm] = slot.start.split(" ");
    const [shRaw, sm] = startStr.split(":").map(Number);
    let sh = shRaw;
    if (startAmpm === "PM" && sh !== 12) sh += 12;
    if (startAmpm === "AM" && sh === 12) sh = 0;

    const [endStr, endAmpm] = slot.end.split(" ");
    const [ehRaw, em] = endStr.split(":").map(Number);
    let eh = ehRaw;
    if (endAmpm === "PM" && eh !== 12) eh += 12;
    if (endAmpm === "AM" && eh === 12) eh = 0;

    let current = sh * 60 + sm;
    const end = eh * 60 + em;

    if (isNaN(current) || isNaN(end)) continue;

    const formatTime = (mins: number) => {
      let h = Math.floor(mins / 60);
      const m = mins % 60;
      const period = h >= 12 ? "PM" : "AM";
      if (h === 0) h = 12;
      if (h > 12) h -= 12;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    };

    while (current + durationMins <= end) {
      result.push({ start: formatTime(current), end: formatTime(current + durationMins) });
      current += durationMins;
    }
  }
  return result;
}

const TYPE_ORDER: ConsultationKind[] = ["chat", "audio", "video"];

const TYPE_META: Record<
  ConsultationKind,
  { title: string; icon: typeof MessageCircle; session: string; duration: number }
> = {
  chat: {
    title: "Chat",
    icon: MessageCircle,
    session: "Chat consultation (30 mins)",
    duration: 30,
  },
  audio: {
    title: "Audio call",
    icon: Phone,
    session: "Audio consultation (45 mins)",
    duration: 45,
  },
  video: {
    title: "Video call",
    icon: Video,
    session: "Video consultation (45 mins)",
    duration: 45,
  },
};
//TODO: Patient was able to book after the time is over and in the practitioner consultation page does not show that is is in the past and says join


//TODO: when the page loads iDk what is happening but when fetching the paractioner data it comes with emty data fix that by either introducing a loading screen
const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { practitioner:p, patient } = useAppApi();
  const [consultationType, setConsultationType] =
    useState<ConsultationKind>("video");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const { data: practitioner, isLoading } = useQuery({
    queryKey: ["patient", "practitioner", id],
    queryFn: () => p.getPractitionerData(id!),
    enabled: !!id,
  });


  const bookableDates = useMemo(
    () => bookableDatesFromAvailability(practitioner?.availability),
    [practitioner?.availability],
  );

  useEffect(() => {
    if (!practitioner?.consultationTypes) return;
    const first = TYPE_ORDER.find(
      (t) => practitioner.consultationTypes?.[t]?.enabled,
    );
    if (first && !practitioner.consultationTypes?.[consultationType]?.enabled) {
      setConsultationType(first);
    }
  }, [practitioner, consultationType]);

  useEffect(() => {
    setSelectedDateIndex(0);
    setSelectedSlotIndex(0);
  }, [bookableDates.length, id]);

  useEffect(() => {
    setSelectedSlotIndex(0);
  }, [selectedDateIndex]);

  const enabledTypes = useMemo(() => {
    if (!practitioner?.consultationTypes) return [];
    return TYPE_ORDER.filter((t) => practitioner.consultationTypes?.[t]?.enabled);
  }, [practitioner]);

  const selectedDateEntry = bookableDates[selectedDateIndex];
  const rawSlots = selectedDateEntry?.slots ?? [];
  
  const slots = useMemo(() => {
    return generateSubSlots(rawSlots, TYPE_META[consultationType].duration);
  }, [rawSlots, consultationType]);
  
  const selectedSlot = slots[selectedSlotIndex];

  const fee = useMemo(() => {
    if (!practitioner?.consultationTypes) return 0;
    return Number(practitioner.consultationTypes[consultationType]?.price ?? 0);
  }, [practitioner, consultationType]);

  const serviceFee = PLATFORM_FEE_ETB;
  const total = fee + serviceFee;

  const mutation = useMutation({
    mutationFn: () => {
      if (!id || !selectedDateEntry || !selectedSlot) {
        throw new Error("Pick a date and time.");
      }
      return patient.bookConsultation({
        practitionerId: id,
        consultationDate: startOfDay(selectedDateEntry.date).toISOString(),
        consultationTime: `${selectedSlot.start}-${selectedSlot.end}`,
        consultationType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", "consultations"] });
      toast.success("Consultation booked. You can open it from Consultations.");
      navigate("/patient/consultations");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Could not complete booking"),
  });

  const canBook =
    !!selectedDateEntry &&
    !!selectedSlot &&
    enabledTypes.includes(consultationType);

  const title = practitioner
    ? formatSpecialization(practitioner.specialization)
    : "";
  const location = practitioner?.location ?? "Ethiopia";
  const yrs = yearsPracticing(practitioner?.practicingSinceEC as number);
  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const SessionIcon =
    consultationType === "chat"
      ? MessageCircle
      : consultationType === "audio"
        ? Phone
        : Video;
//TODO: build better loading and not found UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 min-h-[40vh] text-muted-foreground">
        <Loader2 className="size-6 text-primary animate-spin" />
        Loading booking…
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-muted-foreground">
        Practitioner not found.
      </div>
    );
  }

  return (
    <>
      <header className="mb-8 md:mb-12">
        <h1 className="font-headline font-bold text-primary text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Book a Consultation
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
          Connect with certified herbalists for a personalized clinical assessment
          of your wellness journey through botanical wisdom.
        </p>
      </header>

      <div className="items-start gap-8 lg:gap-8 grid grid-cols-1 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <Card className="bg-muted/40 shadow-sm border-border/60">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex justify-between items-center gap-4">
                <h2 className="font-headline font-semibold text-primary text-lg md:text-xl">
                  1. Practitioner
                </h2>
                <span className="font-semibold text-primary text-xs tracking-wider">
                  STEP 01/03
                </span>
              </div>
              <div className="flex sm:flex-row flex-col sm:items-center gap-4 sm:gap-6 bg-card shadow-sm p-4 rounded-xl">
                <Avatar className="rounded-lg size-20 sm:size-24 shrink-0">
                  <AvatarImage src={practitioner.imageUrl ||PRACTITIONER_PLACEHOLDER_IMG} alt="" />
                  <AvatarFallback className="rounded-lg text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-semibold text-foreground text-lg md:text-xl">
                    {practitioner.fullName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {location} · {yrs}+ years experience
                  </p>
                  {practitioner.verificationStatus === "approved" && (
                    <p className="mt-2 font-medium text-primary text-xs">
                      Verified practitioner
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="self-start sm:self-center shrink-0"
                  onClick={() => navigate("/patient")}
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/40 shadow-sm border-border/60">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex justify-between items-center gap-4">
                <h2 className="font-headline font-semibold text-primary text-lg md:text-xl">
                  2. Consultation type
                </h2>
                <span className="font-semibold text-primary text-xs tracking-wider">
                  STEP 02/03
                </span>
              </div>
              {enabledTypes.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  This practitioner has not enabled any consultation formats yet.
                </p>
              ) : (
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                  {TYPE_ORDER.map((type) => {
                    const meta = TYPE_META[type];
                    const Icon = meta.icon;
                    const enabled = enabledTypes.includes(type);
                    const price = Number(
                      practitioner.consultationTypes?.[type]?.price ?? 0,
                    );
                    const selected = consultationType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={!enabled}
                        onClick={() => enabled && setConsultationType(type)}
                        className={cn(
                          "flex flex-col items-center p-6 border-2 rounded-xl text-center transition-all",
                          !enabled &&
                            "cursor-not-allowed opacity-45",
                          enabled &&
                            !selected &&
                            "border-transparent bg-card hover:border-primary/25",
                          enabled &&
                            selected &&
                            "border-primary bg-primary/5 shadow-sm",
                        )}
                      >
                        <div
                          className={cn(
                            "flex justify-center items-center mb-4 rounded-full size-12",
                            selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                          )}
                        >
                          <Icon className="size-6" />
                        </div>
                        <span className="font-headline font-semibold">
                          {meta.title}
                        </span>
                        <span className="mt-1 text-muted-foreground text-sm">
                          {enabled
                            ? `${price.toLocaleString()} ETB`
                            : "Unavailable"}
                        </span>
                        <span
                          className={cn(
                            "mt-3 border-2 border-primary rounded-full size-4",
                            selected && "bg-primary ring-2 ring-primary ring-offset-2",
                          )}
                          aria-hidden
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/40 shadow-sm border-border/60">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex justify-between items-center gap-4">
                <h2 className="font-headline font-semibold text-primary text-lg md:text-xl">
                  3. Select time
                </h2>
                <span className="font-semibold text-primary text-xs tracking-wider">
                  STEP 03/03
                </span>
              </div>
              {bookableDates.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No published availability yet. Try another practitioner or
                  check back later.
                </p>
              ) : (
                <>
                  <div className="flex gap-3 -mx-1 pt-1 pb-2 overflow-x-auto [scrollbar-width:thin]">
                    {bookableDates.map((row, idx) => {
                      const sel = idx === selectedDateIndex;
                      return (
                        <button
                          key={`${row.date.toISOString()}`}
                          type="button"
                          onClick={() => setSelectedDateIndex(idx)}
                          className={cn(
                            "flex flex-col justify-center items-center border rounded-xl w-24 h-24 transition-all shrink-0",
                            sel
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "border-transparent bg-card hover:bg-muted",
                          )}
                        >
                          <span className="font-semibold text-xs">
                            {format(row.date, "EEE").toUpperCase()}
                          </span>
                          <span className="font-headline font-bold text-2xl">
                            {format(row.date, "d")}
                          </span>
                          <span className="text-[10px] tracking-widest">
                            {format(row.date, "MMM").toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="gap-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                    {slots.map((slot, idx) => {
                      const active = idx === selectedSlotIndex;
                      return (
                        <Button
                          key={`${slot.start}-${slot.end} ${uuidv4()}`}
                          type="button"
                          variant={active ? "default" : "outline"}
                          className={cn(
                            "py-3 h-auto font-semibold",
                            active && "shadow-md",
                          )}
                          onClick={() => setSelectedSlotIndex(idx)}
                        >
                          {slot.start} – {slot.end}
                        </Button>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:top-24 lg:sticky lg:col-span-4">
          <Card className="shadow-botanical border-border/60 overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <h3 className="font-headline font-bold text-lg md:text-xl">
                Booking summary
              </h3>
              <p className="opacity-90 mt-1 text-sm">
                Review your clinical session details
              </p>
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <SessionIcon className="mt-0.5 size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                      Session type
                    </p>
                    <p className="font-semibold">
                      {TYPE_META[consultationType].session}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Calendar className="mt-0.5 size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                      Date &amp; time
                    </p>
                    <p className="font-semibold">
                      {selectedDateEntry && selectedSlot
                        ? `${format(selectedDateEntry.date, "EEEE, MMM d")} · ${selectedSlot.start} – ${selectedSlot.end}`
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <User className="mt-0.5 size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                      Herbalist
                    </p>
                    <p className="font-semibold">{practitioner.fullName}</p>
                    {/* <p className="font-semibold">{title}</p> */}
                  </div>
                </div>
              </div>

              <div className="opacity-40 heritage-divider" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Consultation fee
                  </span>
                  <span className="font-semibold">
                    {fee.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Platform service fee
                  </span>
                  <span className="font-semibold">
                    {serviceFee.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-end pt-3 border-border/40 border-t">
                  <span className="font-headline font-bold text-primary">
                    Total
                  </span>
                  <span className="font-headline font-bold text-primary text-2xl">
                    {total.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full font-headline font-bold text-base"
                disabled={!canBook || mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Booking…
                  </>
                ) : (
                  "Book"
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                By booking, you agree to MitiHealth&apos;s clinical terms and
                privacy policy. Payment collection may be added in a later
                release; your session is reserved on submit.
              </p>
            </CardContent>
          </Card>

          {/* <Card className="bg-tertiary/10 mt-6 border-tertiary/20">
            <CardContent className="flex gap-3 p-4">
              <Leaf className="size-5 text-tertiary shrink-0" />
              <p className="text-foreground/90 text-xs italic leading-relaxed">
                <strong className="not-italic">Did you know?</strong> In Ethiopian
                traditional medicine, consultations often begin with seasonal
                context for optimal herbal efficacy.
              </p>
            </CardContent>
          </Card> */}
        </aside>
      </div>
    </>
  );
};

export default Booking;
