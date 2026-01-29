'use client';

import { MapPin, Phone, Layers, ShoppingBag, Store } from 'lucide-react';

interface StoreLocationProps {
  formData: {
    storeAddress: string;
    storePhone: string;
    zipCode: string;
    aisleSection: string;
    quantityAvailable: string;
    locationNotes: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function StoreLocation({
  formData,
  onChange,
}: StoreLocationProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-md">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-foreground">Store Location & Availability</h2>
          <p className="text-xs text-muted-foreground font-medium">Help others find this deal at your store</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">
            Store Address <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Store className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => onChange('storeAddress', e.target.value)}
              placeholder="e.g. 1504 N. Parham Rd, 23229"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Store Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Store Phone Number
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Phone className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(e) => onChange('storePhone', e.target.value)}
              placeholder="e.g. (555) 123-4567"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* ZIP Code */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            ZIP Code <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              placeholder="e.g. 10001"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Aisle / Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Aisle / Section <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Layers className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.aisleSection}
              onChange={(e) => onChange('aisleSection', e.target.value)}
              placeholder="e.g. K18-2 or Electronics Section"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Quantity Available */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Quantity Available <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <ShoppingBag className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={formData.quantityAvailable}
              onChange={(e) => onChange('quantityAvailable', e.target.value)}
              placeholder="How many did you see?"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Location Notes */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">
            Additional Location Notes
          </label>
          <textarea
            value={formData.locationNotes}
            onChange={(e) => onChange('locationNotes', e.target.value)}
            placeholder="Any other details to help find it..."
            rows={3}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>
    </div>
  );
}


