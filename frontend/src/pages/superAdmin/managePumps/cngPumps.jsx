import React, { useState } from 'react';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaUserPlus
} from 'react-icons/fa';
import AddPumpModal from '../../../components/addNewPumpForm/AddPumpForm';
import { usePumps } from '../../../context/PumpContext';
import './CngPumps.css';

const CngPumps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { pumps, addNewPump, removePump } = usePumps();

  const handleAddPump = (formData) => {
    addNewPump(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this pump?')) {
      removePump(id);
    }
  };

  const filteredPumps = pumps.filter(
    (pump) =>
      pump.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pump.pumpNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pump.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pump.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pump.admin?.assigned && pump.admin.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pumps-page">
      <div className="page-header-container">
        <div className="page-header">
          <h1 className="page-title">CNG Pumps</h1>
          <p className="page-subtitle">
            Configure and manage pump infrastructure across locations.
          </p>
        </div>
        <button className="add-pump-btn" onClick={() => setIsModalOpen(true)}>
          <FaPlus size={13} />
          <span>Add CNG Pump</span>
        </button>
      </div>

      <div className="pumps-card">
        <div className="table-controls">
          <h3 className="section-title">Active Infrastructure</h3>

          <div className="controls-right">
            <button className="icon-filter-btn" title="Filter">
              <FaFilter size={13} />
            </button>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search pumps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="pumps-table">
            <thead>
              <tr>
                <th>PUMP NAME / NO</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>ASSIGNED ADMIN</th>
                <th>DATE COMMISSIONED</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPumps.length > 0 ? (
                filteredPumps.map((pump) => (
                  <tr key={pump.id}>
                    <td>
                      <div className="pump-info-cell">
                        <span className={`pump-title ${pump.status === 'Inactive' ? 'text-disabled' : ''}`}>
                          {pump.name}
                        </span>
                        <span className="pump-id">ID: {pump.pumpNo}</span>
                      </div>
                    </td>
                    <td>
                      <span className="location-text">{pump.location}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${pump.status.toLowerCase()}`}>
                        • {pump.status}
                      </span>
                    </td>
                    <td>
                      {pump.admin?.assigned ? (
                        <div className="admin-profile-cell">
                          <div className="admin-initials">{pump.admin.initials}</div>
                          <span className="admin-name">{pump.admin.name}</span>
                        </div>
                      ) : (
                        <button className="assign-admin-btn">
                          <FaUserPlus size={12} />
                          <span>Assign Admin</span>
                        </button>
                      )}
                    </td>
                    <td className="table-text-muted">{pump.dateCommissioned}</td>
                    <td>
                      <div className="action-icons">
                        <button className="action-btn edit-btn" title="Edit Pump">
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete Pump"
                          onClick={() => handleDelete(pump.id)}
                        >
                          <FaTrashAlt size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No CNG pumps found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="entries-count">Showing {filteredPumps.length} of {pumps.length} pumps</span>
          <div className="pagination-wrapper">
            <button className="page-nav-btn">Prev</button>
            <button className="page-num-btn active">1</button>
            <button className="page-nav-btn">Next</button>
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

export default CngPumps;