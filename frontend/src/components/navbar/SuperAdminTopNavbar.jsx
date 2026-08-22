import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './SuperAdminTopNavbar.css';

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
        <button className="notification-btn" aria-label="Notifications" type="button">
          <Bell size={19} />
        </button>

        <div className="user-profile" title={user?.name || 'Super Admin'}>
          <span className="user-name">{user?.name || 'Super Admin'}</span>
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
            alt="Profile Avatar"
            className="profile-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default SuperAdminTopNavbar;