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
            <Route
              path="/super-admin/admins"
              element={
                <div className="dashboard-page">
                  <div className="page-header">
                    <h1 className="page-title">Admins Management</h1>
                    <p className="page-subtitle">Manage and assign CNG station administrators.</p>
                  </div>
                </div>
              }
            />
            <Route
              path="/super-admin/pumps"
              element={
                <div className="dashboard-page">
                  <div className="page-header">
                    <h1 className="page-title">CNG Pumps Management</h1>
                    <p className="page-subtitle">Configure, monitor, and manage CNG pump stations.</p>
                  </div>
                </div>
              }
            />
            <Route
              path="/super-admin/settings"
              element={
                <div className="dashboard-page">
                  <div className="page-header">
                    <h1 className="page-title">System Settings</h1>
                    <p className="page-subtitle">Configure global platform preferences and security controls.</p>
                  </div>
                </div>
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;