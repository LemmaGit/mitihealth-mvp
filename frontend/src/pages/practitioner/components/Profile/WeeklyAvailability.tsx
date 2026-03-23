import { Calendar, Plus, Minus, Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import type { ProfileFormValues } from "./profileSchema";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12.toString().padStart(2, "0")}:${min} ${ampm}`;
});

export default function WeeklyAvailability() {
  const { watch, setValue } = useFormContext<ProfileFormValues>();
  const availability = watch("availability") || [];

  const toggleDay = (dayIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].enabled = !updated[dayIndex].enabled;
    if (updated[dayIndex].enabled && updated[dayIndex].slots.length === 0) {
      updated[dayIndex].slots = [{ start: "09:00 AM", end: "05:00 PM" }];
    } else if (!updated[dayIndex].enabled) {
      updated[dayIndex].slots = [];
    }
    setValue("availability", updated, { shouldDirty: true });
  };

  const addSlot = (dayIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].slots.push({ start: "09:00 AM", end: "05:00 PM" });
    setValue("availability", updated, { shouldDirty: true });
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].slots.splice(slotIndex, 1);
    setValue("availability", updated, { shouldDirty: true });
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    const updated = [...availability];
    updated[dayIndex].slots[slotIndex][field] = value;
    setValue("availability", updated, { shouldDirty: true });
  };

  return (
    <section className="rounded-xl bg-card p-6 shadow-botanical">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <Calendar size={20} className="text-primary" />
          Weekly Availability
        </h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          UTC+3 Timezone
        </span>
      </div>

      <div className="heritage-divider mb-6" />

      <div className="space-y-4">
        {availability.map((day, dayIndex) => (
          <div key={day.day}>
            {day.enabled && day.slots.length > 0 ? (
              day.slots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className={`flex flex-wrap items-center gap-3 rounded-lg bg-muted/30 px-4 py-3 ${slotIndex > 0 ? "mt-2 ml-4 border-l-2 border-primary/20 sm:ml-[120px]" : ""}`}
                >
                  {slotIndex === 0 && (
                    <div className="flex w-24 shrink-0 items-center gap-2">
                      <Checkbox
                        checked={day.enabled}
                        onCheckedChange={() => toggleDay(dayIndex)}
                        className="border-primary data-[state=checked]:bg-primary"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {day.day}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Select value={slot.start} onValueChange={(v) => updateSlot(dayIndex, slotIndex, "start", v)}>
                        <SelectTrigger className="h-9 w-[110px] bg-card text-xs">
                          <SelectValue placeholder="Start Time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">—</span>
                    <div className="flex items-center gap-1.5">
                      <Select value={slot.end} onValueChange={(v) => updateSlot(dayIndex, slotIndex, "end", v)}>
                        <SelectTrigger className="h-9 w-[110px] bg-card text-xs">
                          <SelectValue placeholder="End Time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                  </div>
                  {day.slots.length > 1 && slotIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => removeSlot(dayIndex, slotIndex)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
                    >
                      <Minus size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-muted/20 px-4 py-3">
                <Checkbox
                  checked={day.enabled}
                  onCheckedChange={() => toggleDay(dayIndex)}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {day.day}
                </span>
                <span className="text-xs text-muted-foreground/60">— Not available</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
