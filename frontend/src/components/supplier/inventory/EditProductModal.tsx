import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { X, Upload, Loader2 } from "lucide-react";
import type{ Product, EditFormValues } from "./types";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: EditFormValues, newImages: File[]) => void;
  isPending: boolean;
}

export function EditProductModal({ product, isOpen, onClose, onUpdate, isPending }: EditProductModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm<EditFormValues>();
  
  // Keep track of existing images visually
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Keep track of newly selected images
  const [newImages, setNewImages] = useState<File[]>([]);
  
  useEffect(() => {
    if (product) {
      console.log(product);
      reset({
        name: product.name,
        price: product.priceNum,
        desc: product.desc,
        inventory: product.invNum,
        ingredients:product.ingredients!.join(","),
        usageInstructions:product.usageInstructions!.join(", "),
        // status: product.status,
      });
     
      setExistingImages(product.imageUrls || []);
      setNewImages([]);
    }
  }, [product, reset]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray].slice(0, 5)); // Backend typically caps at 5
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const submitDetails = (data: EditFormValues) => {
    onUpdate(data, newImages);
  };

  const hasChanges = isDirty || newImages.length > 0 || (product && existingImages.length !== (product.imageUrls?.length || 0));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below. You can also manage the product's imagery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitDetails)} className="space-y-6">
          
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Product Images</Label>
            <div className="flex flex-wrap gap-4">
               {/* Show Existing Images */}
               {existingImages.map((url, i) => (
                  <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border border-border/50 group">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </div>
               ))}
               
               {/* Show New Local Images */}
               {newImages.map((file, i) => (
                  <div key={`new-${i}`} className="relative h-24 w-24 rounded-lg overflow-hidden border border-border/50 group">
                    <img src={URL.createObjectURL(file)} alt="New upload" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                       <span className="text-[10px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                    </div>
                    <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </div>
               ))}

               {/* Add Image Button */}
               {(existingImages.length + newImages.length) < 5 && (
                 <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:bg-muted/50 transition-colors">
                   <Upload size={20} className="text-muted-foreground mb-1" />
                   <span className="text-[10px] uppercase font-medium text-muted-foreground">Upload</span>
                   <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                 </label>
               )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input id="edit-name" {...register("name")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (ETB)</Label>
                <Input id="edit-price" type="number" {...register("price", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-inv">Stock (Units)</Label>
                <Input id="edit-inv" type="number" {...register("inventory", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" rows={3} {...register("desc")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ing  redients">Ingredients</Label>
              <Textarea id="edit-ingredients" rows={3} {...register("ingredients")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-usageInstructions">Usage Instructions</Label>
              <Textarea id="edit-usageInstructions" rows={3} {...register("usageInstructions")} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border/40 mt-6 md:mt-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
          <Button type="submit" disabled={!hasChanges} className="botanical-gradient text-primary-foreground disabled:opacity-40">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
