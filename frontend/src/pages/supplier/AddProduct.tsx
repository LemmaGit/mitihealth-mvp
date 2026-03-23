import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppApi } from "../../hooks/useAppApi";

import { productSchema, type ProductFormValues, defaultValuesObj } from "./components/AddProduct/productSchema";
import CoreInformation from "./components/AddProduct/CoreInformation";
import BotanicalSpecifications from "./components/AddProduct/BotanicalSpecifications";
import Commercials from "./components/AddProduct/Commercials";
import ProductVisuals from "./components/AddProduct/ProductVisuals";
import SidebarSettings from "./components/AddProduct/SidebarSettings";

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { supplier } = useAppApi();
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValuesObj,
  });

  const {
    handleSubmit,
    setError,
    formState: { isDirty },
  } = methods;

  const isFormStarted = isDirty || images.length > 0;

  const mutation = useMutation({
    mutationFn: (formData: FormData) => supplier.createProduct(formData),
    onSuccess: () => {
      toast.success("Product added successfully!");
      queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
      navigate(-1);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add product");
      if (error.errors && typeof error.errors === 'object') {
        Object.keys(error.errors).forEach((key) => {
          if (key in defaultValuesObj) {
            setError(key as any, { type: 'server', message: error.errors[key] });
          }
        });
      }
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    
    // Convert comma-separated string to arrays
    const ingredientsArray = data.ingredients.split(",").map(i => i.trim()).filter(Boolean);
    const usageArray = data.usageInstructions.split(",").map(i => i.trim()).filter(Boolean);
    
    formData.append("ingredients", JSON.stringify(ingredientsArray));
    formData.append("usageInstructions", JSON.stringify(usageArray));
    formData.append("price", data.price.toString());
    formData.append("inventory", data.inventory.toString());
    
    images.forEach((file) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const combined = [...images, ...newFiles].slice(0, 5); // Max 5 images
      setImages(combined);
      
      const newPreviews = combined.map(f => URL.createObjectURL(f));
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/supplier/inventory" className="text-muted-foreground hover:text-foreground">Inventory</Link>
          <span className="text-muted-foreground">›</span>
          <span className="font-medium">Add New Product</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Product Listing</h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Catalog your botanical offerings with clinical precision and cultural wisdom.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/supplier/inventory">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormStarted || mutation.isPending} 
              className="botanical-gradient text-primary-foreground flex items-center"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Product
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main form */}
          <div className="space-y-6">
            <CoreInformation />
            <BotanicalSpecifications />
            <Commercials />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <ProductVisuals
              images={images}
              imagePreviews={imagePreviews}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
            />
            <SidebarSettings />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
