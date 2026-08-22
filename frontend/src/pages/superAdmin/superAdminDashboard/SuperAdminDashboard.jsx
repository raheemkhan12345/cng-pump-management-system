import React, { useState } from 'react';
import { Plus, Search, Filter, Fuel, Wrench } from 'lucide-react';
import AddPumpModal from '../../../components/addNewPumpForm/AddPumpForm';
import { usePumps } from '../../../context/PumpContext';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const { pumps, addNewPump } = usePumps();

  // Extract Admins dynamically
  const admins = pumps
    .filter((p) => p.admin && (p.admin.assigned || p.admin.name))
    .map((p) => ({
      id: p.id,
      name: p.admin.name || 'Unassigned',
      lastLogin: p.admin.lastLogin || 'Never',
      pump: p.name,
      status: p.status,
      avatar: p.admin.initials || 'U',
    }));

  const filteredAdmins = admins.filter((a) =>
    a.name.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const handleAddPump = (formData) => {
    addNewPump(formData);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Super Admin Dashboard</h1>
        <p className="page-subtitle">
          Manage administrators and CNG pumps from one central control plane.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total CNG Pumps</span>
            <Fuel size={18} className="stat-icon" />
          </div>
          <div className="stat-value">{pumps.length}</div>
        </div>

        <div className="action-card">
          <button
            className="add-pump-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add CNG Pump</span>
          </button>
        </div>
      </div>

      <div className="dashboard-tables-grid">
        {/* Admin Overview */}
        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Admin Overview</h3>
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search admins..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                aria-label="Search admins"
              />
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
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
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
                        <button className="icon-btn" title="Manage" aria-label={`Manage ${admin.name}`} type="button">
                          <Wrench size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="cell-text" style={{ textAlign: 'center', padding: '16px' }}>
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pump Overview */}
        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Pump Overview</h3>
            <button className="filter-btn" type="button">
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
                        Admin: <span className={!pump.admin?.assigned ? 'text-red' : ''}>{pump.admin?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="cell-text">{pump.location}</td>
                    <td>
                      <span className={`badge ${pump.status.toLowerCase()}`}>
                        • {pump.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn" title="Manage" aria-label={`Manage ${pump.name}`} type="button">
                        <Wrench size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPumpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPump={handleAddPump}
      />
    </div>
  );
};

export default SuperAdminDashboard;