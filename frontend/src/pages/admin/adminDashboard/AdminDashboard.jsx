import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import DashboardStats from './DashboardStats';
import DashboardActionsOverview from './DashboardActionsOverview';
import RecentTransactions from './RecentTransactions';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Header Filter & Add Expense Bar */}
      <div className="dashboard-action-bar">
        <div className="date-filter-pill">
          <Calendar size={15} />
          <span>Viewing reports for August 2026</span>
          <span className="dropdown-arrow">▾</span>
        </div>
        <button className="btn-add-expense">
          <Plus size={16} />
          <span>Add new Expenses</span>
        </button>
      </div>

      {/* 1. Stats Grid */}
      <DashboardStats />

      {/* 2. Quick Actions & Overview Cards */}
      <DashboardActionsOverview />

      {/* 3. Transactions Table */}
      <RecentTransactions />
    </div>
  );
};

export default AdminDashboard;