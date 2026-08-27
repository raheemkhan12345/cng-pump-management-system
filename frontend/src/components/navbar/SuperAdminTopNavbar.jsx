import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./SuperAdminTopNavbar.css";

const SuperAdminTopNavbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <Menu size={20} />
        </button>
        <div className="navbar-title">CNG Pump Management</div>
      </div>

      <div className="navbar-right">
        <div className="user-profile" title={user?.name || "Super Admin"}>
          <span className="user-name">{user?.name || "Super Admin"}</span>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminTopNavbar;
