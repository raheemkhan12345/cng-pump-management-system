import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import DashboardStats from './DashboardStats';

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
        <button className="btn-add-superAdmin">
          
          <span>Back Super Admin Dashboard</span>
        </button>
      </div>

    
      <DashboardStats />

      {/* 3. Transactions Table */}
      <RecentTransactions /> 
    </div>
  );
};

export default AdminDashboard;