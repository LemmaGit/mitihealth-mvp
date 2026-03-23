import React from "react";
import { Camera, Plus, X } from "lucide-react";

interface ProductVisualsProps {
  images: File[];
  imagePreviews: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export default function ProductVisuals({
  images,
  imagePreviews,
  onImageChange,
  onRemoveImage,
}: ProductVisualsProps) {
  return (
    <section className="rounded-xl bg-card p-5 shadow-botanical">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Product Visuals
      </h3>
      <label htmlFor="product-image-upload" className="mb-4 flex aspect-4/3 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/40 bg-muted/30 cursor-pointer hover:border-primary/40 transition-colors overflow-hidden relative">
        {imagePreviews.length > 0 ? (
          <img src={imagePreviews[0]} alt="Main preview" className="object-cover w-full h-full" />
        ) : (
          <>
            <Camera size={28} className="text-muted-foreground/60" />
            <span className="mt-2 text-sm text-muted-foreground">Main Presentation Image</span>
          </>
        )}
        <input 
          id="product-image-upload" 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={onImageChange}
          disabled={images.length >= 5}
        />
      </label>
      
      <div className="mb-4 flex flex-wrap gap-3">
        {imagePreviews.map((preview, i) => (
          <div key={i} className="group relative h-16 w-16 rounded-lg border-2 border-border/40 overflow-hidden">
            <img src={preview} alt={`Preview ${i}`} className="object-cover w-full h-full" />
            <button 
              type="button" 
              onClick={() => onRemoveImage(i)}
              className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}
        
        {images.length < 5 && (
          <label htmlFor="additional-image-upload" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border/40 bg-muted/30 cursor-pointer hover:border-primary/40 transition-colors">
            <Plus size={18} className="text-muted-foreground/60" />
            <input 
              id="additional-image-upload" 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={onImageChange}
            />
          </label>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Recommended: High-resolution botanical photography with neutral backgrounds. Max 5MB per image.
      </p>
    </section>
  );
}
