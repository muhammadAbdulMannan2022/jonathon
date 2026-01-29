"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  seller: string;
  category: string;
  dealPrice: number;
  originalPrice: number;
  dealType: string;
  store: string;
  productLink?: string;
  zipCode?: string;
  locationNotes?: string;
  uploadedPhoto?: string;
  comments: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export default function ProductApproval() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Sony WH-1000XM5 Headphones",
      seller: "John Doe",
      category: "Electronics",
      dealPrice: 250,
      originalPrice: 350,
      dealType: "Discount",
      store: "Amazon",
      productLink: "https://amazon.com/product/123",
      comments:
        "Great deal on premium headphones with noise cancellation. Found in clearance section.",
      status: "pending",
      submittedDate: "2024-01-20",
    },
    {
      id: 2,
      name: "Nike Air Max 90",
      seller: "Jane Smith",
      category: "Shoes",
      dealPrice: 65,
      originalPrice: 120,
      dealType: "Clearance",
      store: "Best Buy",
      zipCode: "1207",
      locationNotes: "Found in aisle C12, clearance section",
      comments:
        "Excellent clearance find on popular sneakers. Multiple sizes available.",
      status: "pending",
      submittedDate: "2024-01-21",
    },
    {
      id: 3,
      name: "Samsung 55 inch TV",
      seller: "Bob Johnson",
      category: "Electronics",
      dealPrice: 350,
      originalPrice: 650,
      dealType: "Coupon",
      store: "Target",
      productLink: "https://target.com/product/456",
      comments: "Coupon code TV50OFF saves 50%. Limited time offer.",
      status: "approved",
      submittedDate: "2024-01-18",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("pending");
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const filteredProducts = products.filter(
    (p) => filterStatus === "all" || p.status === filterStatus,
  );

  const updateProductStatus = (productId: number, newStatus: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, status: newStatus as any } : p,
      ),
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Product Approval</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve/reject product submissions
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        {["pending", "approved", "rejected", "all"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {status === "pending"
              ? "Pending"
              : status === "approved"
                ? "Approved"
                : status === "rejected"
                  ? "Rejected"
                  : "All"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {product.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        product.dealType === "Discount"
                          ? "bg-blue-500/20 text-blue-400"
                          : product.dealType === "Coupon"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {product.dealType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submitted by{" "}
                    <span className="font-medium">{product.seller}</span> on{" "}
                    {product.submittedDate}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    product.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : product.status === "approved"
                        ? "bg-primary/20 text-primary"
                        : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {product.status === "pending"
                    ? "Pending Review"
                    : product.status === "approved"
                      ? "Approved"
                      : "Rejected"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Store</p>
                  <p className="text-sm font-medium text-foreground">
                    {product.store}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">
                    {product.category}
                  </p>
                </div>
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
                    {Math.round(
                      ((product.originalPrice - product.dealPrice) /
                        product.originalPrice) *
                        100,
                    )}
                    %
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setExpandedProduct(
                    expandedProduct === product.id ? null : product.id,
                  )
                }
                className="text-sm text-primary hover:text-accent font-medium transition-colors mb-4"
              >
                {expandedProduct === product.id
                  ? "Hide Details"
                  : "View Full Details"}
              </button>

              {expandedProduct === product.id && (
                <div className="mb-4 p-4 bg-muted rounded-lg border border-border">
                  {product.productLink && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Product Link
                      </p>
                      <a
                        href={product.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {product.productLink}
                      </a>
                    </div>
                  )}

                  {product.zipCode && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        ZIP Code
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {product.zipCode}
                      </p>
                    </div>
                  )}

                  {product.locationNotes && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Location Notes
                      </p>
                      <p className="text-sm text-foreground">
                        {product.locationNotes}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Additional Comments
                    </p>
                    <p className="text-sm text-foreground">
                      {product.comments}
                    </p>
                  </div>

                  {product.uploadedPhoto && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Uploaded Photo
                      </p>
                      <div className="w-full h-48 bg-muted rounded-lg border border-border overflow-hidden">
                        <img
                          src={product.uploadedPhoto || "/placeholder.svg"}
                          alt="Product proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateProductStatus(product.id, "approved")}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateProductStatus(product.id, "rejected")}
                    className="flex-1 bg-destructive hover:bg-destructive/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products with this status</p>
        </div>
      )}
    </div>
  );
}
