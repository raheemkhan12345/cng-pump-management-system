import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/sidebar/AdminSidebar';
import AdminTopNavbar from '../components/navbar/AdminTopNavbar';
import './AdminLayout.css';

const AdminLayout = () => {
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

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <AdminSidebar closeSidebar={closeSidebar} />
      </div>

      {/* Main Area */}
      <div className="layout-main">
        <AdminTopNavbar onToggleSidebar={toggleSidebar} />
        <main className="layout-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;