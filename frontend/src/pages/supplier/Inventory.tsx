import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../../components/supplier/inventory/ProductCard";
import { EditProductModal } from "../../components/supplier/inventory/EditProductModal";
import { DeleteProductModal } from "../../components/supplier/inventory/DeleteProductModal";
import type { Product, EditFormValues } from "../../components/supplier/inventory/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import { useAuth } from "@clerk/react";
import Loader from "../../components/Loader";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";

export default function SupplierInventory() {
  const navigate = useNavigate();
  const { supplier } = useAppApi();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 5 + 1 "Add Product" card = 6 grid items

  const { data: rawData = {}, isLoading } = useQuery({
    queryKey: ["supplier", "products"],
    queryFn: () => supplier.getSupplierProducts(userId as string),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => supplier.updateProduct(id, data),
    onSuccess: () => {
      toast.success("Product updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] });
      setEditProduct(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update product.");
    }
  });

  const handleUpdate = (data: EditFormValues, newImages: File[]) => {
    if (!editProduct) return;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.desc);
    formData.append("inventory", data.inventory.toString());
    formData.append("ingredients", JSON.stringify(data.ingredients ? data.ingredients.split(",").map(i => i.trim()).filter(Boolean) : []));
    formData.append("usageInstructions", JSON.stringify(data.usageInstructions ? data.usageInstructions.split(",").map(i => i.trim()).filter(Boolean) : []));
    // Append new files
    for (const file of newImages) {
       formData.append("images", file);
    }
    
    updateMutation.mutate({ id: editProduct.id, data: formData });
  };

  const confirmDelete = () => {
    // Delete API not explicitly configured on backend ATM, mock action
    toast.info("Delete functionality is currently disabled for marketplace integrity.");
    setDeleteProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader isFullPage={false}><HashLoader color="#166534" size={30} /></Loader>
      </div>
    );
  }

  const products: Product[] = (rawData.products || []).map((p: any) => {
    let status = "ACTIVE";
    let invColor = "text-foreground";
    
    if (p.inventory <= 0) {
      status = "OUT OF STOCK";
      invColor = "text-destructive";
    } else if (p.inventory < 10) {
      status = "LOW STOCK";
      invColor = "text-secondary";
    }

    return {
      id: p._id,
      name: p.name || "Unknown Product",
      price: `ETB ${p.price?.toLocaleString() || 0}`,
      priceNum: p.price || 0,
      desc: p.description || "No description",
      inv: `${p.inventory || 0} Units`,
      invNum: p.inventory || 0,
      status,     
      invColor,
      verified: p.verificationStatus === "approved",
      imageUrls: p.imageUrls || [],
      ingredients: p.ingredients || [],
      usageInstructions: p.usageInstructions || [],
    };
  });

  const statsList = [
    { label: "TOTAL PRODUCTS", value: products.length },
    { label: "LOW STOCK", value: products.filter(p => p.status === "LOW STOCK").length, color: "text-secondary" },
    { label: "OUT OF STOCK", value: products.filter(p => p.status === "OUT OF STOCK").length, color: "text-destructive" },
    { label: "ACTIVE LISTINGS", value: products.filter(p => p.status === "ACTIVE").length, color: "text-primary" },
  ];

  const filtered = products.filter((p) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && p.verified) ||
      (activeTab === "unverified" && !p.verified);
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4">
        <div>
          <span className="font-medium text-primary text-xs uppercase tracking-widest">
            Supplier Dashboard
          </span>
          <h1 className="mt-1 font-display font-bold text-xl">
            Product Inventory
          </h1>
          <p className="mt-1 max-w-md text-muted-foreground text-sm">
            Manage your botanical catalog, track stock levels, and update
            availability across the MitiHealth marketplace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search
              className="top-1/2 left-3 absolute text-muted-foreground -translate-y-1/2"
              size={16}
            />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card pl-9 border-border/30 w-full sm:w-60 h-10"
            />
          </div>
          <Button
            className="text-primary-foreground botanical-gradient"
            onClick={() => navigate("/supplier/add-product")}
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
        {statsList.map((s) => (
          <div key={s.label} className="bg-card shadow-botanical p-4 rounded-xl">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              {s.label}
            </p>
            <p className={`mt-1 font-display text-2xl sm:text-3xl font-bold ${s.color || "text-foreground"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(t) => { setActiveTab(t); setCurrentPage(1); }}>
        <TabsList className="bg-card border border-border/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">All Products</TabsTrigger>
          <TabsTrigger value="verified" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Verified</TabsTrigger>
          <TabsTrigger value="unverified" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Unverified</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
        {/* Add new product card (always present as first item on page 1, acting as CTA) */}
        {currentPage === 1 && activeTab === "all" && !searchQuery && (
          <button
            onClick={() => navigate("/supplier/add-product")}
            className="flex flex-col justify-center items-center bg-card shadow-botanical hover:shadow-lg p-8 ghost-border rounded-xl min-h-[300px] text-left transition-shadow"
          >
            <div className="flex justify-center items-center bg-muted rounded-full w-14 h-14">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display font-semibold">
              List New Product
            </h3>
            <p className="mt-1 text-muted-foreground text-xs text-center">
              Expand your digital herbal catalog and reach more practitioners.
            </p>
          </button>
        )}

        {paginated.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onEdit={setEditProduct} 
            onDelete={setDeleteProduct} 
          />
        ))}

        {filtered.length === 0 && (currentPage !== 1 || activeTab !== "all" || searchQuery) && (
          <div className="col-span-full p-8 border border-border/50 border-dashed rounded-xl text-muted-foreground text-center">
            No products match this criteria.
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex sm:flex-row flex-col justify-between items-center gap-3 pt-4 border-border/15 border-t">
          <p className="text-muted-foreground text-sm">
            Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> products
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="border-border/30 w-9 h-9" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" className="px-8 border-border/30 w-9 h-9 whitespace-nowrap" disabled>
              Page {currentPage} of {totalPages}
            </Button>
            <Button variant="outline" size="icon" className="border-border/30 w-9 h-9" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      <EditProductModal 
        product={editProduct} 
        isOpen={!!editProduct} 
        onClose={() => setEditProduct(null)} 
        onUpdate={handleUpdate} 
        isPending={updateMutation.isPending}
      />

      <DeleteProductModal 
        product={deleteProduct} 
        isOpen={!!deleteProduct} 
        onClose={() => setDeleteProduct(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}
