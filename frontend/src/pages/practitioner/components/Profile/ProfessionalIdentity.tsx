import { useState } from "react";
import { Stethoscope, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import { useAuthStore } from "../../../../store/useAuthStore";
import type { ProfileFormValues } from "./profileSchema";

const PREDEFINED_SPECIALIZATIONS = ["clinical_herbalist", "traditional_healer", "naturopath", "ethnobotanist"];

export default function ProfessionalIdentity({ disabled = false }: { disabled?: boolean }) {
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
    <section className="bg-card shadow-botanical p-6 rounded-xl">
      <h2 className="flex items-center gap-2 mb-6 font-display font-bold text-foreground text-lg">
        <Stethoscope size={20} className="text-primary" />
        Professional Identity
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-widest">
            Full Name
          </label>
          <Input className="bg-muted/50" readOnly value={user?.fullName || ""} />
        </div>

        <div className="gap-4 grid sm:grid-cols-2">
          <div>
            <label className="block mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-widest">
              Specialization
            </label>
            <Select
              value={selectValue}
              onValueChange={(v) => {
                if (disabled) return; // Prevent changes when disabled
                if (v === "other") {
                  setIsOtherSelected(true);
                  setValue("specialization", "", { shouldDirty: true });
                } else {
                  setIsOtherSelected(false);
                  setValue("specialization", v, { shouldDirty: true });
                }
              }}
              disabled={disabled}
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
            {errors.specialization && <span className="text-destructive text-xs">{errors.specialization.message}</span>}
            
            {showCustomInput && (
              <Input
                value={isCustomSpec ? specialization : ""}
                onChange={(e) => !disabled && setValue("specialization", e.target.value, { shouldDirty: true })}
                placeholder="Enter your custom specialization"
                className="bg-muted/50 mt-2"
                disabled={disabled}
              />
            )}
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-widest">
              Practicing Since (EC)
            </label>
            <Input
              type="number"
              {...register("practicingSinceEC", { valueAsNumber: true })}
              placeholder="e.g. 2008"
              className={`bg-muted/50 ${errors.practicingSinceEC ? "border-destructive" : ""}`}
              readOnly
            />
            {errors.practicingSinceEC && <span className="text-destructive text-xs">{errors.practicingSinceEC.message}</span>}
          </div>
        </div>

        <div>
           <label className="block mb-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">
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
                        !disabled && setValue(`consultationTypes.${type.key}.enabled`, !!checked, { shouldDirty: true })
                      }
                      disabled={disabled}
                      className="--data-[state=checked]:bg-primary border-primary"
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">{type.label}</p>
                      <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest">
                        {type.sub}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-muted-foreground text-xs">ETB</span>
                    <Input
                      type="number"
                      {...register(`consultationTypes.${type.key}.price`, { valueAsNumber: true })}
                      disabled={!isEnabled || disabled}
                      className="bg-card disabled:opacity-50 w-24 h-9 text-right disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Conditions Treated */}
        <div>
          <label className="block mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-widest">
            Conditions Treated
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {conditionsTreated.map((cond, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full font-medium text-primary text-xs">
                  {cond}
                  {!disabled && (
                    <button type="button" onClick={() => removeCondition(idx)} className="hover:bg-primary/20 p-0.5 rounded-full text-primary">
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            <Input
              value={conditionInput}
              onChange={(e) => !disabled && setConditionInput(e.target.value)}
              onKeyDown={handleAddCondition}
              placeholder="e.g. Insomnia, Back pain (Press Enter or comma to add)"
              className="bg-muted/50"
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-widest">
            Location
          </label>
          <Input 
            {...register("location")} 
            className={`bg-muted/50 ${errors.location ? "border-destructive" : ""}`}
            disabled={disabled}
          />
          {errors.location && <span className="text-destructive text-xs">{errors.location.message}</span>}
        </div>
      </div>
    </section>
  );
}
