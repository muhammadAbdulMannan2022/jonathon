'use client';

import { useState } from 'react';

interface MyProduct {
  id: number;
  name: string;
  category: string;
  dealPrice: number;
  originalPrice: number;
  dealType: string;
  store: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdDate: string;
  viewCount: number;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<MyProduct[]>([
    {
      id: 1,
      name: 'Apple AirPods Pro',
      category: 'Electronics',
      dealPrice: 180,
      originalPrice: 249,
      dealType: 'Discount',
      store: 'Best Buy',
      approvalStatus: 'approved',
      createdDate: '2024-01-15',
      viewCount: 234,
    },
    {
      id: 2,
      name: 'Samsung Galaxy Watch',
      category: 'Electronics',
      dealPrice: 150,
      originalPrice: 300,
      dealType: 'Coupon',
      store: 'Amazon',
      approvalStatus: 'approved',
      createdDate: '2024-01-10',
      viewCount: 567,
    },
    {
      id: 3,
      name: 'Adidas Running Shoes',
      category: 'Shoes',
      dealPrice: 45,
      originalPrice: 120,
      dealType: 'Clearance',
      store: 'Target',
      approvalStatus: 'approved',
      createdDate: '2024-01-20',
      viewCount: 89,
    },
    {
      id: 4,
      name: 'Dyson V15 Vacuum',
      category: 'Home',
      dealPrice: 550,
      originalPrice: 750,
      dealType: 'Discount',
      store: 'Walmart',
      approvalStatus: 'pending',
      createdDate: '2024-01-22',
      viewCount: 12,
    },
    {
      id: 5,
      name: 'Sony Headphones',
      category: 'Electronics',
      dealPrice: 200,
      originalPrice: 350,
      dealType: 'Discount',
      store: 'Amazon',
      approvalStatus: 'rejected',
      createdDate: '2024-01-18',
      viewCount: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'all' || product.approvalStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const stats = {
    total: products.length,
    approved:
      products.filter((p) => p.approvalStatus === 'approved').length,
    pending:
      products.filter((p) => p.approvalStatus === 'pending').length,
    rejected:
      products.filter((p) => p.approvalStatus === 'rejected').length,
    totalViews: products.reduce((sum, p) => sum + p.viewCount, 0),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage products that you have added
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Views</p>
          <p className="text-2xl font-bold text-accent">{stats.totalViews}</p>
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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {product.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        product.dealType === 'Discount'
                          ? 'bg-blue-500/20 text-blue-400'
                          : product.dealType === 'Coupon'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {product.dealType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.store} • {product.category} • Created on{' '}
                    {product.createdDate}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    product.approvalStatus === 'approved'
                      ? 'bg-primary/20 text-primary'
                      : product.approvalStatus === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  {product.approvalStatus === 'approved'
                    ? 'Approved'
                    : product.approvalStatus === 'pending'
                      ? 'Pending'
                      : 'Rejected'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-border mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Deal Price
                  </p>
                  <p className="text-sm font-bold text-primary">
                    ${product.dealPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Original Price
                  </p>
                  <p className="text-sm font-medium text-muted-foreground line-through">
                    ${product.originalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Savings</p>
                  <p className="text-sm font-bold text-accent">
                    {Math.round(((product.originalPrice - product.dealPrice) / product.originalPrice) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Views</p>
                  <p className="text-sm font-bold text-foreground">
                    {product.viewCount}
                  </p>
                </div>
              </div>

              {product.approvalStatus === 'rejected' && (
                <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ This product was rejected. Please review the details and
                    resubmit if you believe this was an error.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setExpandedProduct(
                      expandedProduct === product.id ? null : product.id
                    )
                  }
                  className="text-sm text-primary hover:text-accent font-medium transition-colors"
                >
                  {expandedProduct === product.id
                    ? 'Hide Details'
                    : 'View Details'}
                </button>
                <button className="text-sm text-primary hover:text-accent font-medium transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>

              {expandedProduct === product.id && (
                <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Category
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Store</p>
                      <p className="text-sm font-medium text-foreground">
                        {product.store}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Created Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {product.createdDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Deal Type
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {product.dealType}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found with that filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
