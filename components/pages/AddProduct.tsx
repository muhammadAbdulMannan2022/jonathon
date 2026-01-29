"use client";

import React from "react";
import ProductForm from "../ProductForm";

export default function AddProduct() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Deal</h1>
        <p className="text-gray-500 mt-2 font-medium">Share a great deal with the community and help others save.</p>
      </div>

      <ProductForm />
    </div>
  );
}

