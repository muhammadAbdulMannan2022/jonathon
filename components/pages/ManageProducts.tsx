'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/auth-service';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  Loader2, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Globe, 
  Store,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Product {
  id: number;
  product_image: string | null;
  title: string;
  user_full_name: string;
  created_at: string;
  store_id: number | null;
  store_name: string | null;
  category_id: string;
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


export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Details Modal State
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    origin_price: '',
    discount_price: '',
    stock: '',
    sku: '',
    product_store_type: '',
    categoryId: '',
    deal_type: 'discount',
    additional_comment: '',
    dollar_off: '',
    image_url: '',
    product_status: '',
    expiry_date: '',
  });

  const fetchCategories = async () => {
    try {
      const data = await authApi.getCategories();
      setCategories(data.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await authApi.getOwnProducts(page);
      setProducts(data.results);
      setTotalPages(Math.ceil(data.count / 10));

      const counts = data.results.reduce((acc: any, p: Product) => {
        acc[p.product_status] = (acc[p.product_status] || 0) + 1;
        return acc;
      }, { approved: 0, pending: 0, rejected: 0 });
      
      setStats({
        total: data.count,
        approved: counts.approved || 0,
        pending: counts.pending || 0,
        rejected: counts.rejected || 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'all' || product.product_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openDetails = async (id: number) => {
    setIsDetailsModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const details = await authApi.getProductDetails(id);
      setProductDetail(details);
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Failed to load product details');
      setIsDetailsModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openEdit = async (product: Product) => {
    setIsEditModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const details = await authApi.getProductDetails(product.id);
      setProductDetail(details);
      setEditFormData({
        name: details.title,
        description: details.description || '',
        origin_price: details.original_price.toString(),
        discount_price: details.deal_price.toString(),
        stock: details.stock.toString(),
        sku: details.sku,
        product_store_type: details.product_store_type,
        categoryId: details.category.id.toString(),
        deal_type: 'discount', // Default if not in details
        additional_comment: '', // Default if not in details
        dollar_off: (details.original_price - details.deal_price).toFixed(2),
        image_url: details.image_url || '',
        product_status: details.product_status,
        expiry_date: '', // Default if not in details
      });
    } catch (error) {
       console.error('Error fetching details for edit:', error);
       toast.error('Failed to load product for editing');
       setIsEditModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDetail) return;

    try {
      setIsUpdating(true);
      
      const originPrice = parseFloat(editFormData.origin_price) || 0;
      const discountPrice = parseFloat(editFormData.discount_price) || 0;
      const discountPercentage = originPrice > 0 ? ((originPrice - discountPrice) / originPrice) * 100 : 0;

      const payload = {
        name: editFormData.name,
        description: editFormData.description,
        category_id: parseInt(editFormData.categoryId),
        origin_price: editFormData.origin_price,
        discount_price: editFormData.discount_price,
        discount_percentage: discountPercentage.toFixed(2),
        dollar_off: editFormData.dollar_off,
        sku: editFormData.sku,
        stock: parseInt(editFormData.stock),
        deal_type: editFormData.deal_type,
        expire_date: editFormData.expiry_date || null,
        additional_comment: editFormData.additional_comment,
        products_links: "", 
        upc_field: editFormData.sku,
      };

      await authApi.updateProduct(productDetail.id, payload);
      toast.success('Product updated successfully');
      setIsEditModalOpen(false);
      await fetchProducts(currentPage);
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      if (error && typeof error === 'object') {
        const errorMessages = Object.entries(error)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ');
        
        if (errorMessages) {
          toast.error(`Update Failed: ${errorMessages}`);
          return;
        }
      }
      
      toast.error('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await authApi.deleteProduct(productId);
      toast.success('Product deleted successfully');
      
      // If we deleted the last item on the current page (and not on page 1),
      // we should go back to the previous page.
      if (currentPage > 1 && products.length === 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await fetchProducts(currentPage);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage products that you have added
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-bold text-primary">{stats.approved}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Rejected</p>
          <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-4 mb-3">
                  {product.product_image && (
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.product_image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {product.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          product.product_status === 'approved'
                            ? 'bg-primary/20 text-primary'
                            : product.product_status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {product.product_status.charAt(0).toUpperCase() + product.product_status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.store_name || 'Generic Store'} • {product.category_name} • Created on{' '}
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-border mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Deal Price
                    </p>
                    <p className="text-sm font-bold text-primary">
                      ${product.deal_price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Original Price
                    </p>
                    <p className="text-sm font-medium text-muted-foreground line-through">
                      ${product.original_price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Savings</p>
                    <p className="text-sm font-bold ">
                      {product.savings_percentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created By</p>
                    <p className="text-sm font-bold text-foreground">
                      {product.user_full_name || 'Admin'}
                    </p>
                  </div>
                </div>

                {product.product_status === 'rejected' && (
                  <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ This product was rejected. Please review the details and
                      resubmit if you believe this was an error.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => openDetails(product.id)}
                    className="flex items-center gap-1 text-sm text-primary hover:cursor-pointer font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => openEdit(product)}
                    className="flex items-center gap-1 text-sm text-primary hover:cursor-pointer font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 hover:cursor-pointer font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-muted border border-border rounded-lg disabled:opacity-50 hover:bg-border transition-colors text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-muted border border-border rounded-lg disabled:opacity-50 hover:bg-border transition-colors text-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Full information about your product submission.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail || !productDetail ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-6">
                {productDetail.image_url && (
                  <div className="w-40 h-40 flex-shrink-0 bg-muted rounded-xl overflow-hidden border border-border shadow-inner">
                    <img 
                      src={productDetail.image_url} 
                      alt={productDetail.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-foreground mb-2">{productDetail.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                      {productDetail.product_store_type === 'online' ? <Globe className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                      {productDetail.product_store_type.toUpperCase()}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-semibold">
                      {productDetail.category.name}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      productDetail.product_status === 'approved' ? 'bg-green-500/10 text-green-500' :
                      productDetail.product_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {productDetail.product_status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {productDetail.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-5 bg-muted/30 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Deal Price</p>
                  <p className="text-xl font-bold text-primary">${productDetail.deal_price}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Original Price</p>
                  <p className="text-xl font-medium text-muted-foreground line-through">${productDetail.original_price}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Savings</p>
                  <p className="text-xl font-bold ">{Math.round(productDetail.savings_percentage)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Inventory Info</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">SKU</span>
                       <span className="font-medium">{productDetail.sku || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Stock Level</span>
                       <span className="font-medium">{productDetail.stock} units</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Date Added</span>
                       <span className="font-medium">{new Date(productDetail.created_at).toLocaleDateString()}</span>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Store Links</h4>
                  <div className="space-y-2">
                    {productDetail.stores.length > 0 ? productDetail.stores.map(store => (
                      <div key={store.id} className="flex items-center justify-between text-sm p-2 bg-muted hover:bg-border rounded-lg border border-border transition-colors">
                        <span className="font-medium truncate mr-2">{store.store_name}</span>
                        <a 
                          href={store.store_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-accent flex items-center gap-1 flex-shrink-0"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )) : <p className="text-sm text-muted-foreground italic">No store links available</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Product Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Location Notes / Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Category</label>
                <select
                  required
                  value={editFormData.categoryId}
                  onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Origin Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.origin_price}
                    onChange={(e) => setEditFormData({ ...editFormData, origin_price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.discount_price}
                    onChange={(e) => setEditFormData({ ...editFormData, discount_price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Deal Type</label>
                  <select
                    value={editFormData.deal_type}
                    onChange={(e) => setEditFormData({ ...editFormData, deal_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11"
                  >
                    <option value="discount">Discount</option>
                    <option value="coupon">Coupon</option>
                    <option value="clearance">Clearance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Additional Comments</label>
                <textarea
                  rows={2}
                  value={editFormData.additional_comment}
                  onChange={(e) => setEditFormData({ ...editFormData, additional_comment: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">SKU</label>
                  <input
                    type="text"
                    value={editFormData.sku}
                    onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Stock</label>
                  <input
                    type="number"
                    required
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Status</label>
                  <select
                    value={editFormData.product_status}
                    onChange={(e) => setEditFormData({ ...editFormData, product_status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
