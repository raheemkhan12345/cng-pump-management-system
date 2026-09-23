import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  Wallet,
  FileText,
  BookOpen,
  Boxes,
  User,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminSidebar.css";
import logo from "../../assests/sidebar-pump-logo/pump-logo.png";

const AdminSidebar = ({ closeSidebar }) => {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/sales",
      label: "CNG Sales",
      icon: Receipt,
    },
    {
      path: "/admin/cash-bank",
      label: "Cash & Bank",
      icon: Landmark,
    },
    {
      path: "/admin/expenses",
      label: "Expenses",
      icon: Wallet,
    },
    {
      path: "/admin/loans",
      label: "Loans",
      icon: FileText,
    },
    {
      path: "/admin/ledger",
      label: "Ledger",
      icon: BookOpen,
    },
    {
      path: "/admin/inventory",
      label: "Inventory",
      icon: Boxes,
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img
            src={logo}
            alt="Pump Logo"
            className="logo-img"
          />
        </div>

        <div className="brand-content">
          <span className="brand-name">
            {user?.pump?.name || "CNG Hub"}
          </span>
          <span className="brand-subtitle">Management System</span>
        </div>
      </div>

      {/* Admin Info */}
      <div className="sidebar-user-info">
        <div className="user-avatar">
          <User size={18} />
        </div>

        <div className="user-details">
          <h3 className="admin-name">
            {user?.role || "Admin"}
          </h3>

          <span className="admin-status">
            <span className="status-dot"></span>
            Active
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-heading">MAIN MENU</p>

        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "active-link" : ""
                  }
                  onClick={closeSidebar}
                >
                  <span className="nav-icon-wrapper">
                    <Icon size={18} className="nav-icon" />
                  </span>

                  <span className="nav-label">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          <span className="logout-icon">
            <LogOut size={18} />
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;