import { useFormContext } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import type { ProductFormValues } from "./productSchema";

export default function Commercials() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ProductFormValues>();

  return (
    <section className="rounded-xl bg-card p-6 shadow-botanical">
      <div className="mb-5 flex items-center gap-2">
        <DollarSign size={20} className="text-primary" />
        <h2 className="font-display text-lg font-semibold">Commercials</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Price (ETB)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Br</span>
            <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="0.00" className="bg-muted/50 border-border/30 pl-8" />
          </div>
          {errors.price && <p className="mt-1 text-[10px] text-red-500">{errors.price.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Stock Level
          </label>
          <Input type="number" {...register("inventory", { valueAsNumber: true })} placeholder="Units" className="bg-muted/50 border-border/30" />
          {errors.inventory && <p className="mt-1 text-[10px] text-red-500">{errors.inventory.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Unit Type
          </label>
          <Select
            onValueChange={(val) => setValue("unitType", val, { shouldDirty: true })}
            value={watch("unitType")}
          >
            <SelectTrigger className="bg-muted/50 border-border/30">
              <SelectValue placeholder="Grams (g)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams (g)</SelectItem>
              <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
              <SelectItem value="milliliters">Milliliters (ml)</SelectItem>
              <SelectItem value="liters">Liters (L)</SelectItem>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="bundles">Bundles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
