import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "../../components/supplier/inventory/ProductCard";
import { EditProductModal } from "../../components/supplier/inventory/EditProductModal";
import { DeleteProductModal } from "../../components/supplier/inventory/DeleteProductModal";
import type{ Product, EditFormValues } from "../../components/supplier/inventory/types";
import { InventorySkeleton } from "../../components/supplier/inventory/InventorySkeleton";
import { ClipLoader, SyncLoader } from "react-spinners";
import Loader from "../../components/Loader";

const initialProducts: Product[] = [
  { id: "1", name: "Ethiopian Moringa Powder", price: "ETB 450", priceNum: 450, desc: "Organic, sun-dried Moringa leaves processed with traditional methods for maximum nutrient retention.", inv: "85 Units", invNum: 85, status: "ACTIVE", invColor: "text-foreground", verified: true, imageUrls: ["https://plus.unsplash.com/premium_photo-1726769198572-542339268a7f?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { id: "2", name: "Koseret (Dried)", price: "ETB 280", priceNum: 280, desc: "High-altitude wild harvested Koseret, essential for authentic Ethiopian herbal preparations.", inv: "5 Units", invNum: 5, status: "LOW STOCK", invColor: "text-secondary", verified: true, imageUrls: ["https://plus.unsplash.com/premium_photo-1726769198572-542339268a7f?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { id: "3", name: "Sacred Frankincense", price: "ETB 1,200", priceNum: 1200, desc: "Grade A resin from Tigray. Currently pending quality re-certification.", inv: "12 Units", invNum: 12, status: "INACTIVE", invColor: "text-muted-foreground", verified: false, imageUrls: ["https://plus.unsplash.com/premium_photo-1726769198572-542339268a7f?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { id: "4", name: "Black Cumin Oil (Cold-Pressed)", price: "ETB 650", priceNum: 650, desc: "Pure Ethiopian black seed oil. Rich in Thymoquinone. Restocking soon.", inv: "0 Units", invNum: 0, status: "OUT OF STOCK", invColor: "text-destructive", verified: true, imageUrls: ["https://plus.unsplash.com/premium_photo-1726769198572-542339268a7f?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { id: "5", name: "Premium Berbere Blend", price: "ETB 320", priceNum: 320, desc: "Signature medicinal spice blend featuring 12 hand-selected herbs and spices.", inv: "210 Units", invNum: 210, status: "ACTIVE", invColor: "text-foreground", verified: false, imageUrls: ["https://plus.unsplash.com/premium_photo-1726769198572-542339268a7f?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
];

const stats = [
  { label: "TOTAL PRODUCTS", value: "128" },
  { label: "LOW STOCK", value: "12", color: "text-secondary" },
  { label: "OUT OF STOCK", value: "4", color: "text-destructive" },
  { label: "ACTIVE LISTINGS", value: "112", color: "text-primary" },
];

export default function SupplierInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  

  const handleUpdate = (data: EditFormValues, newImages: File[]) => {
    // The user handles logic to upload new images and call the API
    console.log("Saving new images array ready for upload:", newImages);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct?.id
          ? {
              ...p,
              name: data.name,
              priceNum: data.price,
              price: `ETB ${data.price.toLocaleString()}`,
              desc: data.desc,
              invNum: data.inventory,
              inv: `${data.inventory} Units`,
              status: data.status,
            }
          : p
      )
    );
    setEditProduct(null);
  };

  const confirmDelete = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  };

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

  //return <Loader isFullPage={false}><ClipLoader color="#004c22" /></Loader>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Supplier Dashboard
          </span>
          <h1 className="mt-1 font-display text-xl font-bold">
            Product Inventory
          </h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Manage your botanical catalog, track stock levels, and update
            availability across the MitiHealth marketplace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-60 bg-card pl-9 border-border/30"
            />
          </div>
          <Button
            className="botanical-gradient text-primary-foreground"
            onClick={() => navigate("/supplier/add-product")}
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-card p-4 shadow-botanical">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className={`mt-1 font-display text-2xl sm:text-3xl font-bold ${s.color || "text-foreground"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/20">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Product grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onEdit={setEditProduct} 
            onDelete={setDeleteProduct} 
          />
        ))}

        {/* Add new product card */}
        <button
          onClick={() => navigate("/supplier/add-product")}
          className="flex flex-col items-center justify-center rounded-xl bg-card p-8 shadow-botanical ghost-border text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Plus size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-display font-semibold">
            List New Product
          </h3>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Expand your digital herbal catalog and reach more practitioners.
          </p>
        </button>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">1 - {filtered.length}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> products
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-9 w-9 border-border/30">
            <ChevronLeft size={16} />
          </Button>
          {[1, 2, 3].map((n) => (
            <Button
              key={n}
              variant={n === 1 ? "default" : "outline"}
              size="icon"
              className={`h-9 w-9 ${n === 1 ? "botanical-gradient text-primary-foreground" : "border-border/30"}`}
            >
              {n}
            </Button>
          ))}
          <span className="px-1 text-sm text-muted-foreground">...</span>
          <Button variant="outline" size="icon" className="h-9 w-9 border-border/30">26</Button>
          <Button variant="outline" size="icon" className="h-9 w-9 border-border/30">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Modals extracted to standalone components */}
      <EditProductModal 
        product={editProduct} 
        isOpen={!!editProduct} 
        onClose={() => setEditProduct(null)} 
        onUpdate={handleUpdate} 
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
