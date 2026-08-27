import React, { useContext } from 'react';
import { MapPin, Menu } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './AdminTopNavbar.css';

const AdminTopNavbar = ({ onToggleSidebar }) => {
  const { user } = useContext(AuthContext) || {};

  return (
    <header className="admin-top-navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        <div className="pump-title-container">
          <h1 className="pump-name">{user?.pumpName || 'CNG Pump 01'}</h1>
          <span className="pump-location">
            <MapPin size={12} className="location-icon" />
            {user?.pumpAddress || 'Mingora, Swat'}
          </span>
        </div>
      </div>

    </header>
  );
};

export default AdminTopNavbar;