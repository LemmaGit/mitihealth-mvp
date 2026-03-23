import { useState } from "react";
import { Stethoscope, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import { useAuthStore } from "../../../../store/useAuthStore";
import type { ProfileFormValues } from "./profileSchema";

const PREDEFINED_SPECIALIZATIONS = ["clinical_herbalist", "traditional_healer", "naturopath", "ethnobotanist"];

export default function ProfessionalIdentity() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();
  const specialization = watch("specialization");
  const consultationTypes = watch("consultationTypes");
  const conditionsTreated = watch("conditionsTreated") || [];
  
  const { authUser: user } = useAuthStore();
  const [conditionInput, setConditionInput] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const isCustomSpec = specialization && !PREDEFINED_SPECIALIZATIONS.includes(specialization);
  const showCustomInput = isOtherSelected || isCustomSpec;
  const selectValue = showCustomInput ? "other" : (specialization || "");

  const handleAddCondition = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = conditionInput.trim();
      if (val && !conditionsTreated.includes(val)) {
        setValue("conditionsTreated", [...conditionsTreated, val], { shouldDirty: true });
        setConditionInput("");
      }
    }
  };

  const removeCondition = (idx: number) => {
    const updated = [...conditionsTreated];
    updated.splice(idx, 1);
    setValue("conditionsTreated", updated, { shouldDirty: true });
  };

  return (
    <section className="rounded-xl bg-card p-6 shadow-botanical">
      <h2 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <Stethoscope size={20} className="text-primary" />
        Professional Identity
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Full Name
          </label>
          <Input className="bg-muted/50" readOnly value={user?.fullName || ""} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Specialization
            </label>
            <Select
              value={selectValue}
              onValueChange={(v) => {
                if (v === "other") {
                  setIsOtherSelected(true);
                  setValue("specialization", "", { shouldDirty: true });
                } else {
                  setIsOtherSelected(false);
                  setValue("specialization", v, { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger className={`bg-muted/50 ${errors.specialization ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select Specialization"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinical_herbalist">Clinical Herbalist</SelectItem>
                <SelectItem value="traditional_healer">Traditional Healer</SelectItem>
                <SelectItem value="naturopath">Naturopath</SelectItem>
                <SelectItem value="ethnobotanist">Ethnobotanist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.specialization && <span className="text-xs text-destructive">{errors.specialization.message}</span>}
            
            {showCustomInput && (
              <Input
                value={isCustomSpec ? specialization : ""}
                onChange={(e) => setValue("specialization", e.target.value, { shouldDirty: true })}
                placeholder="Enter your custom specialization"
                className="mt-2 bg-muted/50"
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Practicing Since (EC)
            </label>
            <Input
              type="number"
              {...register("practicingSinceEC", { valueAsNumber: true })}
              placeholder="e.g. 2008"
              className={`bg-muted/50 ${errors.practicingSinceEC ? "border-destructive" : ""}`}
            />
            {errors.practicingSinceEC && <span className="text-xs text-destructive">{errors.practicingSinceEC.message}</span>}
          </div>
        </div>

        <div>
           <label className="mb-3 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Consultation Types & Pricing
          </label>
          <div className="space-y-3">
            {[
              { key: "chat" as const, label: "Chat Consultation", sub: "INSTANT MESSAGING" },
              { key: "audio" as const, label: "Audio Call", sub: "VOICE CONSULTATION" },
              { key: "video" as const, label: "Video Call", sub: "FACE-TO-FACE DIGITAL" },
            ].map((type) => {
              const isEnabled = consultationTypes?.[type.key]?.enabled || false;
              return (
                <div
                  key={type.key}
                  className={`flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 ${!isEnabled ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        setValue(`consultationTypes.${type.key}.enabled`, !!checked, { shouldDirty: true })
                      }
                      className="border-primary data-[state=checked]:bg-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{type.label}</p>
                      <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                        {type.sub}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">ETB</span>
                    <Input
                      type="number"
                      {...register(`consultationTypes.${type.key}.price`, { valueAsNumber: true })}
                      disabled={!isEnabled}
                      className="h-9 w-24 bg-card text-right disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Conditions Treated */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Conditions Treated
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {conditionsTreated.map((cond, idx) => (
                <span key={idx} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {cond}
                  <button type="button" onClick={() => removeCondition(idx)} className="rounded-full hover:bg-primary/20 p-0.5 text-primary">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <Input
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              onKeyDown={handleAddCondition}
              placeholder="e.g. Insomnia, Back pain (Press Enter or comma to add)"
              className="bg-muted/50"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Location
          </label>
          <Input 
            {...register("location")} 
            className={`bg-muted/50 ${errors.location ? "border-destructive" : ""}`} 
          />
          {errors.location && <span className="text-xs text-destructive">{errors.location.message}</span>}
        </div>
      </div>
    </section>
  );
}
