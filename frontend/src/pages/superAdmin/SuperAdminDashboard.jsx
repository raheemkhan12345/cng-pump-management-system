import React from 'react';
import { Plus, Search, Filter, Fuel, Wrench } from 'lucide-react';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const admins = [
    { id: 1, name: 'Khan', lastLogin: 'Today', pump: 'Station North', status: 'Active', avatar: 'K' },
    { id: 2, name: 'Adil Khan', lastLogin: 'Yesterday', pump: 'Station South', status: 'Active', avatar: 'AK' },
    { id: 3, name: 'Anwar Ali', lastLogin: '1w ago', pump: 'Unassigned', status: 'Inactive', avatar: 'A' },
  ];

  const pumps = [
    { id: '01', name: 'Station North-01', admin: 'S. Jenkins', location: 'North District', status: 'Active' },
    { id: '02', name: 'Station North-02', admin: 'S. Jenkins', location: 'North District', status: 'Active' },
    { id: '03', name: 'Station East-02', admin: 'Unassigned', location: 'East District', status: 'Inactive' },
    { id: '04', name: 'Station South-01', admin: 'M. Ross', location: 'South District', status: 'Active' },
  ];

  return (
    <div className="dashboard-page">
      {/* Page Heading */}
      <div className="page-header">
        <h1 className="page-title">Super Admin Dashboard</h1>
        <p className="page-subtitle">
          Manage administrators and CNG pumps from one central control plane.
        </p>
      </div>

      {/* Action Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total CNG Pumps</span>
            <Fuel size={18} className="stat-icon" />
          </div>
          <div className="stat-value">6</div>
        </div>

        <div className="action-card">
          <button className="add-pump-btn">
            <Plus size={18} />
            <span>Add CNG Pump</span>
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="dashboard-tables-grid">
        {/* Admin Overview */}
        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Admin Overview</h3>
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search admins..." />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ASSIGNED PUMP</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-circle">{admin.avatar}</div>
                        <div>
                          <div className="cell-title">{admin.name}</div>
                          <div className="cell-sub">Last Login: {admin.lastLogin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-text">{admin.pump}</td>
                    <td>
                      <span className={`badge ${admin.status.toLowerCase()}`}>
                        • {admin.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn" title="Manage"><Wrench size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pump Overview */}
        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Pump Overview</h3>
            <button className="filter-btn">
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PUMP DETAILS</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pumps.map((pump) => (
                  <tr key={pump.id}>
                    <td>
                      <div className="cell-title">{pump.name}</div>
                      <div className="cell-sub">
                        Admin: <span className={pump.admin === 'Unassigned' ? 'text-red' : ''}>{pump.admin}</span>
                      </div>
                    </td>
                    <td className="cell-text">{pump.location}</td>
                    <td>
                      <span className={`badge ${pump.status.toLowerCase()}`}>
                        • {pump.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn" title="Manage"><Wrench size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;