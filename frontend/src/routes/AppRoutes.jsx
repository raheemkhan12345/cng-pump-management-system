import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import SuperAdminDashboard from '../pages/superAdmin/superAdminDashboard/SuperAdminDashboard';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Admins from '../pages/superAdmin/admins/Admins';
import CngPumps from '../pages/superAdmin/managePumps/cngPumps';
import Settings from '../pages/superAdmin/settings/Settings';

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
            <Route path="/super-admin/admins" element={<Admins />} />
            <Route path="/super-admin/pumps" element={ <CngPumps />} />
            <Route path="/super-admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;