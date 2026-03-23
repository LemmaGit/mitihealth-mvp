import { useFormContext } from "react-hook-form";
import { Leaf } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { ProductFormValues } from "./productSchema";

export default function CoreInformation() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>();

  return (
    <section className="rounded-xl bg-card p-6 shadow-botanical">
      <div className="mb-5 flex items-center gap-2">
        <Leaf size={20} className="text-primary" />
        <h2 className="font-display text-lg font-semibold">Core Information</h2>
      </div>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Product Name (Botanical & Common)
          </label>
          <Input 
            {...register("name")}
            placeholder="e.g. Damakese (Ocimum lamiifolium)" 
            className="bg-muted/50 border-border/30" 
          />
          {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Short Description
          </label>
          <Textarea
            {...register("description")}
            placeholder="Explain the primary therapeutic focus..."
            className="min-h-[100px] bg-muted/50 border-border/30"
          />
          {errors.description && <p className="mt-1 text-[10px] text-red-500">{errors.description.message}</p>}
        </div>
      </div>
    </section>
  );
}
