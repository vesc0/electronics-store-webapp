"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Analytics from "../components/AdminAnalytics";
import Products from "../components/AdminProducts";
import Orders from "../components/AdminOrders";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("Analytics");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!isAuthenticated) {
    return <div className="mt-20">Redirecting to Login...</div>;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "Analytics":
        return <Analytics />;
      case "Products":
        return <Products />;
      case "Orders":
        return <Orders />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />

      <div className="flex-grow overflow-y-auto scrollbar-hide bg-gray-100">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
