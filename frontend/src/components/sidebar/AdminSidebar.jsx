import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Landmark, 
  Wallet, 
  FileText, 
  BookOpen, 
  Boxes, 
  User, 
  LogOut 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './AdminSidebar.css';
import logo from '../../assests/sidebar-pump-logo/pump-logo.png';


const AdminSidebar = ({ closeSidebar }) => {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/sales', label: 'CNG Sales', icon: Receipt },
    { path: '/admin/cash-bank', label: 'Cash & Bank', icon: Landmark },
    { path: '/admin/expenses', label: 'Expenses', icon: Wallet },
    { path: '/admin/loans', label: 'Loans', icon: FileText },
    { path: '/admin/ledger', label: 'Ledger', icon: BookOpen },
    { path: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { path: '/admin/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img src={logo} alt="CNG Hub Logo" className="logo-img" />
        </div>
        <span className="brand-name">CNG Hub</span>
      </div>

      {/* Admin Profile Info Header */}
      <div className="sidebar-user-info">
        <h3 className="admin-name">{user?.name || 'Muhammad Bilal'}</h3>
        <p className="admin-role">Station Admin</p>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                  onClick={closeSidebar}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Footer */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;