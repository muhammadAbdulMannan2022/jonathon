'use client';

import { Link2 } from 'lucide-react';

interface OnlineInformationProps {
  formData: {
    productLink: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function OnlineInformation({
  formData,
  onChange,
}: OnlineInformationProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-md">
          <Link2 className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Online Information</h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Product Link <span className="text-destructive">*</span>
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Link2 className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="url"
            value={formData.productLink}
            onChange={(e) => onChange('productLink', e.target.value)}
            placeholder="https://example.com/product"
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}


