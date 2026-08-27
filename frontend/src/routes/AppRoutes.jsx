import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages & Guards
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layouts
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import AdminLayout from '../layouts/adminLayout';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superAdmin/superAdminDashboard/SuperAdminDashboard';
import Admins from '../pages/superAdmin/admins/Admins';
import CngPumps from '../pages/superAdmin/managePumps/cngPumps';
import AdminDashboard from '../pages/admin/adminDashboard/AdminDashboard';
import CngSales from '../pages/admin/cngSales/CngSales';
import SalesReport from '../pages/admin/cngSales/SalesReport';
import CashBank from '../pages/admin/cashBank/CashBank';
import Expenses from '../pages/admin/expenses/Expenses';
import Loans from '../pages/admin/loans/Loans';
import Ledger from '../pages/admin/ledger/Ledger';
import Inventory from '../pages/admin/inventory/Inventory';
import Profile from '../pages/admin/profile/Profile';

// Admin Pages (Agar abhi files nahi bani toh yeh fallback render karega)


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes Block */}
      <Route element={<ProtectedRoute />}>
        
        {/* Super Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/admins" element={<Admins />} />
            <Route path="/super-admin/pumps" element={<CngPumps />} />
          </Route>
        </Route>

        {/* Station Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/sales" element={<CngSales />} />
            <Route path="/admin/sales-report" element={<SalesReport />} />
            <Route path="/admin/cash-bank" element={<CashBank />} />
            <Route path="/admin/expenses" element={<Expenses />} />
            <Route path="/admin/loans" element={<Loans />} />
            <Route path="/admin/ledger" element={<Ledger />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>

      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;