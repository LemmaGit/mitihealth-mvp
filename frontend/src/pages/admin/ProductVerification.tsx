import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import Loader from "../../components/Loader";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";
import ProductCard from "./components/ProductVerification/ProductCard";
import ProductDetailModal from "./components/ProductVerification/ProductDetailModal";
import type { Product } from "./components/ProductVerification/types";

export default function ProductVerification() {
  const { admin, product } = useAppApi();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("pending");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: rawProducts = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => product.getAllProducts(),
  });

  const { data: rawUsers = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => admin.getUsers(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => admin.verifyProduct(id, { status }),
    onSuccess: () => {
      toast.success("Product verification status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelectedProduct(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update product status.");
    }
  });

  if (isProductsLoading || isUsersLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader isFullPage={false}><HashLoader color="#166534" size={30} /></Loader>
      </div>
    );
  }

  const userMap = new Map((rawUsers || []).map((u: any) => [u.clerkId || u._id, u.name]));

  const products: Product[] = (rawProducts || []).map((p: any) => ({
    id: p._id,
    name: p.name || "Unknown Product",
    supplier: userMap.get(p.supplierId) || p.supplierId || "Unknown Supplier",
    ingredients: (p.ingredients || []).join(", ") || "Not specified",
    price: p.price?.toString() || "0",
    status: p.verificationStatus || "pending",
    image: p.imageUrls?.[0] || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop",
    images: p.imageUrls?.length > 0 ? p.imageUrls : [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    ],
    category: "Herbal Product",
    description: p.description || "No description provided.",
    dosage: (p.usageInstructions || []).join(", ") || "Not specified",
    sideEffects: "Consult with a practitioner.",
    storage: "Store in a cool, dry place.",
    weight: `${p.inventory || 0} units`,
  }));

  const filteredProducts = products.filter((p) => p.status === tab);
  const pendingCount = products.filter((p) => p.status === "pending").length;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleVerify = (id: string, status: string) => {
    verifyMutation.mutate({ id, status });
  };

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Curation Pipeline
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
            Product Verification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and validate herbal formulations submitted by global practitioners.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(val) => { setTab(val); setCurrentPage(1); }}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pending" className="gap-2 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Clock size={14} />
              Pending
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 bg-destructive/10 text-destructive text-[10px]">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Approved</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Product Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onView={() => setSelectedProduct(product)} 
              onApprove={() => handleVerify(product.id, "approved")}
              onReject={() => handleVerify(product.id, "rejected")}
              isPending={verifyMutation.isPending}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/50 p-8 text-center text-muted-foreground">
            No products found in this category.
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/15 pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onApprove={() => handleVerify(selectedProduct!.id, "approved")}
        onReject={() => handleVerify(selectedProduct!.id, "rejected")}
        isPending={verifyMutation.isPending}
      />
    </>
  );
}
