import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="navbar-title">CNG Pump Management</div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={18} />
        </button>

        <div className="user-profile">
          <span className="user-name">{user?.name || 'Super Admin'}</span>
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
            alt="Profile"
            className="profile-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;