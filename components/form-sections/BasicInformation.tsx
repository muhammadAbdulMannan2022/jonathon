'use client';

import { ChevronDown, Calendar, Tag, Package, Barcode, DollarSign } from 'lucide-react';

interface BasicInformationProps {
  formData: {
    storeType: 'online' | 'instore';
    storeName: string;
    productName: string;
    upcSku: string;
    dealPrice: string;
    originalPrice: string;
    dealType: 'discount' | 'coupon' | 'clearance';
    category: string;
    expiryDate: string;
  };
  onChange: (field: string, value: string) => void;
  stores: any[];
  categories: any[];
}

export default function BasicInformation({
  formData,
  onChange,
  stores,
  categories,
}: BasicInformationProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-md">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Name (using storeId but labeling it Store Name) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Store Name <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <select
              value={formData.storeName}
              onChange={(e) => onChange('storeName', e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            >
              <option value="">Select store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => onChange('productName', e.target.value)}
            placeholder="e.g. Sony WH-1000XM5 Headphones"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* UPC / SKU - Only for In-Store */}
        {formData.storeType === 'instore' && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-foreground">
              UPC / SKU (Required)
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Barcode className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={formData.upcSku}
                onChange={(e) => onChange('upcSku', e.target.value)}
                placeholder="e.g. 045496882778"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        {/* Price Fields */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Deal Price <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <DollarSign className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.dealPrice}
              onChange={(e) => onChange('dealPrice', e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Original Price
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <DollarSign className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.originalPrice}
              onChange={(e) => onChange('originalPrice', e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Deal Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Deal Type <span className="text-destructive">*</span>
          </label>
          <div className="flex bg-muted p-1 rounded-md h-11">
            {(['discount', 'coupon', 'clearance'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange('dealType', type)}
                className={`flex-1 rounded-sm text-xs font-bold transition-all capitalize ${
                  formData.dealType === type
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <select
              value={formData.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">
            Expiry Date <span className="text-muted-foreground">(Optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Calendar className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => onChange('expiryDate', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


