import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../components/sidebar/SuperAdminSidebar';
import TopNavbar from '../components/navbar/TopNavbar.jsx';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout-wrapper">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar with active class state */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <SuperAdminSidebar closeSidebar={closeSidebar} />
      </div>

      <div className="layout-main">
        <TopNavbar onToggleSidebar={toggleSidebar} />
        <main className="layout-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;