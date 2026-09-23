import { useContext } from "react";
import { MapPin, Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminTopNavbar.css";

const AdminTopNavbar = ({ onToggleSidebar }) => {
  const { user } = useContext(AuthContext) || {};

  return (
    <header className="admin-top-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="pump-title-container">
          <h1 className="pump-name">
            {user?.pump?.name || "Loading..."}
          </h1>

          <span className="pump-location">
            <MapPin size={12} className="location-icon" />
            {user?.pump?.address || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNavbar;