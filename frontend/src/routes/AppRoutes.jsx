import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import SuperAdminDashboard from '../pages/superAdmin/SuperAdminDashboard';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes for Super Admin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/admins" element={<div style={{padding: 24}}>Admins Page</div>} />
            <Route path="/super-admin/pumps" element={<div style={{padding: 24}}>CNG Pumps Page</div>} />
            <Route path="/super-admin/settings" element={<div style={{padding: 24}}>Settings Page</div>} />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;