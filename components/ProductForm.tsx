'use client';

import React from "react"

import { useState } from 'react';
import BasicInformation from './form-sections/BasicInformation';
import OnlineInformation from './form-sections/OnlineInformation';
import StoreLocation from './form-sections/StoreLocation';
import TrustSection from './form-sections/TrustSection';

type StoreType = 'online' | 'instore';

interface FormData {
  storeType: StoreType;
  storeName: string;
  productName: string;
  upcSku: string; // New field for In-Store
  dealPrice: string;
  originalPrice: string;
  dealType: 'discount' | 'coupon' | 'clearance';
  category: string;
  expiryDate: string;
  productLink: string;
  storeAddress: string; // New field for In-Store
  storePhone: string; // New field for In-Store
  zipCode: string;
  aisleSection: string; // New field for In-Store
  quantityAvailable: string; // New field for In-Store
  locationNotes: string;
  uploadedImage: string | null;
  additionalComments: string;
}

import { Globe, Store, Save, X } from 'lucide-react';

export default function ProductForm() {
  const [formData, setFormData] = useState<FormData>({
    storeType: 'online',
    storeName: '',
    productName: '',
    upcSku: '',
    dealPrice: '',
    originalPrice: '',
    dealType: 'discount',
    category: '',
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
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form submitted! Check console for details.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Selection Header */}
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
          {/* Main Information */}
          <BasicInformation formData={formData} onChange={handleBasicInfoChange} />

          {/* Store Type Specific Sections */}
          {formData.storeType === 'online' ? (
            <OnlineInformation formData={formData} onChange={handleBasicInfoChange} />
          ) : (
            <StoreLocation formData={formData} onChange={handleBasicInfoChange} />
          )}

          {/* Trust Section */}
          <TrustSection formData={formData} onChange={handleBasicInfoChange} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Summary / Preview Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-0">
            <h3 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">Submission Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Store Type</span>
                <span className="font-semibold text-foreground capitalize">{formData.storeType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">{formData.category || 'Not selected'}</span>
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Publish Deal
              </button>
              <button
                type="button"
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


