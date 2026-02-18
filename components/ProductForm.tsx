'use client';

import { useState } from 'react';
import { authApi } from '@/lib/auth-service';
import { toast } from 'sonner';
import BasicInformation from './form-sections/BasicInformation';
import OnlineInformation from './form-sections/OnlineInformation';
import StoreLocation from './form-sections/StoreLocation';
import TrustSection from './form-sections/TrustSection';
import { Globe, Store, Save, X, Loader2 } from 'lucide-react';

type StoreType = 'online' | 'instore';

interface FormData {
  storeType: StoreType;
  storeId: string;
  productName: string;
  upcSku: string;
  dealPrice: string;
  originalPrice: string;
  dealType: 'discount' | 'coupon' | 'clearance';
  categoryId: string;
  expiryDate: string;
  productLink: string;
  storeAddress: string;
  storePhone: string;
  zipCode: string;
  aisleSection: string;
  quantityAvailable: string;
  locationNotes: string;
  uploadedImage: string | null;
  additionalComments: string;
}

const CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Gaming' },
  { id: 3, name: 'Shoes' },
  { id: 4, name: 'Clothing' },
  { id: 5, name: 'Home' },
  { id: 6, name: 'Sports' },
  { id: 7, name: 'Beauty' },
  { id: 8, name: 'Books' },
];

const STORES = [
  { id: 1, name: 'Amazon' },
  { id: 2, name: 'Best Buy' },
  { id: 3, name: 'Target' },
  { id: 4, name: 'Foot Locker' },
  { id: 5, name: 'Apple' },
  { id: 6, name: 'Nike' },
  { id: 7, name: 'GameStop' },
];

const INITIAL_DATA: FormData = {
  storeType: 'online',
  storeId: '',
  productName: '',
  upcSku: '',
  dealPrice: '',
  originalPrice: '',
  dealType: 'discount',
  categoryId: '',
  expiryDate: '',
  productLink: '',
  storeAddress: '',
  storePhone: '',
  zipCode: '',
  aisleSection: '',
  quantityAvailable: '',
  locationNotes: '',
  uploadedImage: null,
  additionalComments: '',
};

export default function ProductForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBasicInfoChange = (field: string, value: string | File) => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleStoreTypeChange = (type: StoreType) => {
    setFormData((prev) => ({
      ...prev,
      storeType: type,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.productName,
        category: parseInt(formData.categoryId),
        product_store: formData.storeId ? [parseInt(formData.storeId)] : [],
        origin_price: formData.originalPrice || "0.00",
        discount_price: formData.dealPrice || "0.00",
        sku: formData.upcSku || "",
        stock: parseInt(formData.quantityAvailable) || 0,
        deal_type: formData.dealType,
        additional_comment: formData.additionalComments,
        description: formData.locationNotes || "",
      };

      if (formData.expiryDate) {
        payload.expire_date = new Date(formData.expiryDate).toISOString();
      }

      if (formData.storeType === 'online') {
        payload.products_links = formData.productLink;
        await authApi.createOnlineProduct(payload);
      } else {
        payload.description = `
Address: ${formData.storeAddress}
ZIP: ${formData.zipCode}
Aisle: ${formData.aisleSection}
Notes: ${formData.locationNotes}
`.trim();
        await authApi.createInStoreProduct(payload);
      }

      toast.success('Deal published successfully!');
      setFormData(INITIAL_DATA);
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unauthorized') {
        toast.error('Failed to publish deal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Where did you find this deal?</h2>
            <p className="text-sm text-muted-foreground mt-1">Select the store type to customize your submission.</p>
          </div>
          <div className="flex bg-muted p-1 rounded-lg h-12 w-full md:w-80">
            <button
              type="button"
              onClick={() => handleStoreTypeChange('online')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all ${
                formData.storeType === 'online'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-4 h-4" />
              Online
            </button>
            <button
              type="button"
              onClick={() => handleStoreTypeChange('instore')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all ${
                formData.storeType === 'instore'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="w-4 h-4" />
              In-Store
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BasicInformation 
            formData={{
              ...formData,
              storeName: formData.storeId, 
              category: formData.categoryId
            }} 
            onChange={(field, value) => {
              if (field === 'storeName') handleBasicInfoChange('storeId', value);
              else if (field === 'category') handleBasicInfoChange('categoryId', value);
              else handleBasicInfoChange(field, value);
            }} 
            stores={STORES}
            categories={CATEGORIES}
          />

          {formData.storeType === 'online' ? (
            <OnlineInformation formData={formData} onChange={handleBasicInfoChange} />
          ) : (
            <StoreLocation formData={formData} onChange={handleBasicInfoChange} />
          )}

          <TrustSection formData={formData} onChange={handleBasicInfoChange} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-0">
            <h3 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">Submission Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Store Type</span>
                <span className="font-semibold text-foreground capitalize">{formData.storeType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">
                  {CATEGORIES.find((c: any) => String(c.id) === formData.categoryId)?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deal Price</span>
                <span className="font-bold text-primary">${formData.dealPrice || '0.00'}</span>
              </div>
              {formData.originalPrice && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Savings</span>
                  <span className="font-semibold text-green-500">
                    {((1 - (Number(formData.dealPrice) / Number(formData.originalPrice))) * 100).toFixed(0)}% Off
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Publish Deal
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-muted text-foreground hover:bg-border font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Discard
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-4 px-2">
              By publishing, you agree to our community guidelines and terms of service.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
