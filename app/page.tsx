"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Dashboard from "@/components/pages/Dashboard";
import UserControl from "@/components/pages/UserControl";
import ProductApproval from "@/components/pages/ProductApproval";
import ManageProducts from "@/components/pages/ManageProducts";
import AddProduct from "@/components/pages/AddProduct";
import AuditLogs from "@/components/pages/AuditLogs";
import ErrorLogs from "@/components/pages/ErrorLogs";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserControl />;
      case "approvals":
        return <ProductApproval />;
      case "products":
        return <ManageProducts />;
      case "add-product":
        return <AddProduct />;
      case "audit-logs":
        return <AuditLogs />;
      case "error-logs":
        return <ErrorLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}
