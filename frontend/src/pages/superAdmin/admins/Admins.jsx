import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaUserEdit,
} from "react-icons/fa";
import { usePumps } from "../../../context/PumpContext";
import "./Admins.css";

const Admins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { pumps } = usePumps();

  // Extract Admins dynamically from real pump data
  const admins = pumps
    .filter((p) => p.admin && (p.admin.assigned || p.admin.name))
    .map((p) => ({
      id: p.id,
      name: p.admin.name || "Unassigned",
      email: p.admin.email || "N/A",
      initials: p.admin.initials || "U",
      assignedPump: p.name,
      status: p.status,
    }));

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.assignedPump.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admins-page">
      <div className="page-header">
        <h1 className="page-title">Administrators</h1>
        <p className="page-subtitle">
          Control system access and assign pump managers.
        </p>
      </div>

      <div className="admins-card">
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

        <div className="table-responsive">
          <table className="admins-table">
            <thead>
              <tr>
                <th>NAME & EMAIL</th>
                <th>ASSIGNED PUMP</th>
                <th>STATUS</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
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
                          admin.assignedPump === "Unassigned"
                            ? "unassigned"
                            : ""
                        }`}
                      >
                        {admin.assignedPump}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${admin.status.toLowerCase()}`}
                      >
                        • {admin.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="action-btn">
                        <FaUserEdit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No administrators found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="entries-count">
            Showing 1 to {filteredAdmins.length} of {admins.length} entries
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
