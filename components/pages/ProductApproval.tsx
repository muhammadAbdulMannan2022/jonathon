"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/lib/auth-service";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Search, ExternalLink, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductListItem {
  id: number;
  title: string;
  user_full_name: string;
  created_at: string;
  store_name: string | null;
  category_name: string;
  deal_price: string;
  original_price: string;
  savings_percentage: string;
  product_status: string;
}

interface ProductDetail {
  id: number;
  product_store_type: string;
  category: { id: number; name: string };
  title: string;
  description: string | null;
  original_price: number;
  deal_price: number;
  savings_percentage: number;
  stores: { id: number; store_name: string; store_url: string }[];
  image_url: string | null;
  product_status: string;
  created_at: string;
  sku: string;
  stock: number;
}

export default function ProductApproval() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  // Modal State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let response;
      if (currentTab === "approved") {
        response = await authApi.getApprovedProducts(currentPage);
      } else if (currentTab === "rejected") {
        response = await authApi.getRejectedProducts(currentPage);
      } else {
        response = await authApi.getPendingProducts(currentPage);
      }
      
      setProducts(response.results);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentTab, currentPage]);

  const handleTabChange = (tab: "pending" | "approved" | "rejected") => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openDetails = async (id: number) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const details = await authApi.getProductDetails(id);
      setProductDetail(details);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject', id: number) => {
    try {
      if (action === 'approve') {
        await authApi.approveProduct(id);
        toast.success("Product approved");
      } else {
        await authApi.rejectProduct(id);
        toast.success("Product rejected");
      }
      
      // Close modal if open and refresh list
      if (selectedProductId === id) setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      toast.error(`Failed to ${action} product`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Approval</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage product submissions.
          </p>
        </div>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {(["pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
              currentTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store & Category</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground line-clamp-2" title={product.title}>
                          {product.title}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(product.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{product.store_name || "Unknown Store"}</span>
                        <span className="text-muted-foreground">{product.category_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">${product.deal_price}</span>
                        {Number(product.original_price) > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.original_price}
                          </span>
                        )}
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(Number(product.savings_percentage))}% Off
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          product.product_status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : product.product_status === "rejected"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {product.product_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetails(product.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {currentTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction('approve', product.id)}
                              className="p-2 text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction('reject', product.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevious}
              className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNext}
              className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Review product information before taking action.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail || !productDetail ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
             <div className="space-y-6">
              <div className="flex gap-4">
                {productDetail.image_url && (
                  <div className="w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border">
                    <img 
                      src={productDetail.image_url} 
                      alt={productDetail.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg mb-2">{productDetail.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded font-medium">{productDetail.product_store_type}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded font-medium">{productDetail.category.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{productDetail.description || "No description provided."}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Deal Price</p>
                  <p className="text-lg font-bold text-primary">${productDetail.deal_price}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Original Price</p>
                  <p className="text-lg font-medium text-muted-foreground line-through">${productDetail.original_price}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Savings</p>
                  <p className="text-lg font-bold text-green-600">{Math.round(productDetail.savings_percentage)}%</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Store Links</h4>
                <div className="space-y-2">
                  {productDetail.stores.map(store => (
                    <div key={store.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded border border-border">
                      <span className="font-medium">{store.store_name}</span>
                      <a 
                        href={store.store_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {productDetail.product_status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleAction('approve', productDetail.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleAction('reject', productDetail.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
