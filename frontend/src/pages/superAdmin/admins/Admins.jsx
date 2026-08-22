import React, { useState } from 'react';
import { FaSearch, FaFilter, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Admins.css';

const Admins = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Admin Data matched with UI image
  const initialAdmins = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@cngpump.com',
      initials: 'JD',
      assignedPump: 'Station Alpha',
      status: 'Active',
      dateAdded: 'Oct 12, 2023',
      lastLogin: 'Today, 09:41 AM',
    },
    {
      id: 2,
      name: 'Sarah Allen',
      email: 's.allen@cngpump.com',
      initials: 'SA',
      assignedPump: 'Metro Central',
      status: 'Active',
      dateAdded: 'Sep 04, 2023',
      lastLogin: 'Yesterday, 14:20 PM',
    },
    {
      id: 3,
      name: 'Mike Ross',
      email: 'm.ross@cngpump.com',
      initials: 'MR',
      assignedPump: 'Unassigned',
      status: 'Inactive',
      dateAdded: 'Nov 21, 2023',
      lastLogin: 'Never',
    },
  ];

  const filteredAdmins = initialAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.assignedPump.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admins-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Administrators</h1>
        <p className="page-subtitle">
          Control system access and assign pump managers.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="admins-card">
        {/* Top Control Bar */}
        <div className="table-controls">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search name, pump, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="action-buttons">
            <button className="control-btn filter-btn">
              <FaFilter size={12} />
              <span>Filter</span>
            </button>
            <button className="control-btn export-btn">
              <FaDownload size={12} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Admins Data Table */}
        <div className="table-responsive">
          <table className="admins-table">
            <thead>
              <tr>
                <th>NAME & EMAIL</th>
                <th>ASSIGNED PUMP</th>
                <th>STATUS</th>
                <th>DATE ADDED</th>
                <th>LAST LOGIN</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-initials">{admin.initials}</div>
                        <div className="user-details">
                          <span className="user-name">{admin.name}</span>
                          <span className="user-email">{admin.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`pump-name ${
                          admin.assignedPump === 'Unassigned' ? 'unassigned' : ''
                        }`}
                      >
                        {admin.assignedPump}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${admin.status.toLowerCase()}`}>
                        • {admin.status}
                      </span>
                    </td>
                    <td className="table-text-muted">{admin.dateAdded}</td>
                    <td className="table-text-muted">{admin.lastLogin}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No administrators found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="table-footer">
          <span className="entries-count">
            Showing 1 to {filteredAdmins.length} of {initialAdmins.length} entries
          </span>
          <div className="pagination-actions">
            <button className="pagination-btn" disabled>
              <FaChevronLeft size={10} />
            </button>
            <button className="pagination-btn" disabled>
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;