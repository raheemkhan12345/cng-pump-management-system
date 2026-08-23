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
import Settings from '../pages/superAdmin/settings/Settings';
import AdminDashboard from '../pages/admin/adminDashboard/AdminDashboard';
import CngSales from '../pages/admin/cngSales/CngSales';
import SalesReport from '../pages/admin/cngSales/SalesReport';

// Admin Pages (Agar abhi files nahi bani toh yeh fallback render karega)

const CashBank = () => <div>Cash & Bank Content</div>;
const Expenses = () => <div>Expenses Content</div>;
const Loans = () => <div>Loans Content</div>;
const Ledger = () => <div>Ledger Content</div>;
const Inventory = () => <div>Inventory Content</div>;
const Profile = () => <div>Profile Content</div>;

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
            <Route path="/super-admin/settings" element={<Settings />} />
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