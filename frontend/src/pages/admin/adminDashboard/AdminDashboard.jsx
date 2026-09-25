import React from "react";
import { Calendar, Undo2 } from "lucide-react";
import DashboardStats from "./DashboardStats";
import RecentTransactions from "./RecentTransactions";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Header Filter & Action Bar */}
      <div className="dashboard-action-bar">
        <div className="date-filter-pill">
          <Calendar size={15} />
          <span>Viewing reports for August 2026</span>
          <span className="dropdown-arrow-badge">▾</span>
        </div>

        <button className="btn-super-admin">
          <div className="icon-circle">
            <Undo2 size={14} />
          </div>
          <span>Super Dashboard</span>
        </button>
      </div>

      <DashboardStats />
      <RecentTransactions />
    </div>
  );
};

export default AdminDashboard;
