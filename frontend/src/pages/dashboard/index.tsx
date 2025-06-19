import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard";

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;