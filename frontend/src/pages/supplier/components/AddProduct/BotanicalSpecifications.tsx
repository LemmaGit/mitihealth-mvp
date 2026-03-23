import { useFormContext } from "react-hook-form";
import { FlaskConical } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { ProductFormValues } from "./productSchema";

export default function BotanicalSpecifications() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>();

  return (
    <section className="rounded-xl bg-card p-6 shadow-botanical">
      <div className="mb-5 flex items-center gap-2">
        <FlaskConical size={20} className="text-primary" />
        <h2 className="font-display text-lg font-semibold">Botanical Specifications</h2>
      </div>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Medicinal Ingredients
          </label>
          <Input
            {...register("ingredients")}
            placeholder="Add active compounds, separated by commas"
            className="bg-muted/50 border-border/30"
          />
          {errors.ingredients && <p className="mt-1 text-[10px] text-red-500">{errors.ingredients.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Usage Instructions
          </label>
          <Textarea
            {...register("usageInstructions")}
            placeholder="Add usage instructions, separated by commas"
            className="min-h-[100px] bg-muted/50 border-border/30"
          />
          {errors.usageInstructions && <p className="mt-1 text-[10px] text-red-500">{errors.usageInstructions.message}</p>}
        </div>
      </div>
    </section>
  );
}
