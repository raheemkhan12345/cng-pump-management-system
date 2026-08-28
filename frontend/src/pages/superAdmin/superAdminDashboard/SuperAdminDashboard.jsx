import React, { useCallback, useEffect, useState } from "react";

import { Plus, Search, Filter, Fuel } from "lucide-react";

import AddPumpModal from "../../../components/addNewPumpForm/AddPumpForm";

import { getAllAdmins } from "../../../services/superAdminDash";

import "./SuperAdminDashboard.css";

const ITEMS_PER_PAGE = 5;

const SuperAdminDashboard = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [adminSearch, setAdminSearch] = useState("");

  const [pumps, setPumps] = useState([]);

  const [error, setError] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [adminCurrentPage, setAdminCurrentPage] = useState(1);

  const [pumpCurrentPage, setPumpCurrentPage] = useState(1);

  // =====================================================
  // GET ALL ADMINS / PUMPS
  // =====================================================

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Fetching All Admins...");

      const response = await getAllAdmins();

      console.log("Get All Admins API Response:", response);

      // =================================================
      // EXTRACT API DATA
      // =================================================

      let adminData = [];

      if (Array.isArray(response)) {
        adminData = response;
      } else if (Array.isArray(response?.data)) {
        adminData = response.data;
      } else if (Array.isArray(response?.admins)) {
        adminData = response.admins;
      } else if (Array.isArray(response?.data?.admins)) {
        adminData = response.data.admins;
      } else if (Array.isArray(response?.data?.data)) {
        adminData = response.data.data;
      }

      console.log("Normalized Admin Data:", adminData);

      setPumps(adminData);

      // Fresh data ke baad pagination reset
      setAdminCurrentPage(1);
      setPumpCurrentPage(1);
    } catch (error) {
      console.error("Get All Admins Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load admins and pumps.";

      setError(message);

      setPumps([]);

      setAdminCurrentPage(1);
      setPumpCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD DATA WHEN DASHBOARD OPENS
  // =====================================================

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // =====================================================
  // HANDLE ADD PUMP
  // =====================================================

  const handleAddPump = async (formData, response) => {
    try {
      setIsCreating(true);
      setError("");

      console.log("Pump/Admin successfully created:", response);

      if (response?.success) {
        console.log("Admin created successfully.");

        // Close modal
        setIsModalOpen(false);

        // Fresh data from backend
        await fetchAdmins();
      } else {
        throw new Error(response?.message || "Failed to create pump.");
      }
    } catch (error) {
      console.error("Dashboard Add Pump Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create pump.";

      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // =====================================================
  // NORMALIZE PUMP DATA
  // =====================================================

  const normalizedPumps = pumps.map((pump, index) => {
    const admin = pump?.admin || pump?.user || pump?.adminDetails || {};

    // -------------------------------------------------
    // PUMP NAME
    // -------------------------------------------------

    const pumpName =
      pump?.pumpName ||
      pump?.name ||
      pump?.stationName ||
      pump?.pump?.name ||
      "Unnamed Pump";

    // -------------------------------------------------
    // PUMP ADDRESS
    // -------------------------------------------------

    const pumpAddress =
      pump?.pumpAddress ||
      pump?.location ||
      pump?.address ||
      pump?.pump?.address ||
      "N/A";

    // -------------------------------------------------
    // ADMIN NAME
    // -------------------------------------------------

    const adminName =
      pump?.adminName ||
      admin?.name ||
      admin?.fullName ||
      admin?.username ||
      pump?.name ||
      "Unassigned";

    // -------------------------------------------------
    // ADMIN EMAIL
    // -------------------------------------------------

    const adminEmail = pump?.email || admin?.email || "";

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    const status = pump?.status || admin?.status || "Active";

    // -------------------------------------------------
    // ID
    // -------------------------------------------------

    const id =
      pump?._id || pump?.id || admin?._id || admin?.id || `row-${index}`;

    // -------------------------------------------------
    // ADMIN INITIALS
    // -------------------------------------------------

    const initials =
      admin?.initials ||
      adminName
        ?.trim()
        ?.split(/\s+/)
        ?.map((word) => word.charAt(0))
        ?.join("")
        ?.toUpperCase()
        ?.slice(0, 2) ||
      "U";

    return {
      ...pump,

      id,

      name: pumpName,

      pumpName,

      location: pumpAddress,

      pumpAddress,

      status,

      admin: {
        ...admin,

        name: adminName,

        email: adminEmail,

        initials,

        assigned: Boolean(adminName && adminName !== "Unassigned"),

        lastLogin: admin?.lastLogin || pump?.lastLogin || "Never",
      },
    };
  });

  // =====================================================
  // ADMIN LIST
  // =====================================================

  const admins = normalizedPumps
    .filter((pump) => pump.admin && (pump.admin.assigned || pump.admin.name))
    .map((pump) => ({
      id: pump.id || pump._id,

      name: pump.admin?.name || pump.adminName || "Unassigned",

      email: pump.admin?.email || "",

      lastLogin: pump.admin?.lastLogin || "Never",

      pump: pump.name || pump.pumpName || "Unknown Pump",

      status: pump.status || "Active",

      avatar:
        pump.admin?.initials ||
        pump.admin?.name?.charAt(0)?.toUpperCase() ||
        "U",
    }));

  // =====================================================
  // SEARCH ADMINS
  // =====================================================

  const normalizedSearch = adminSearch.toLowerCase().trim();

  const filteredAdmins = admins.filter((admin) => {
    return (
      admin.name.toLowerCase().includes(normalizedSearch) ||
      admin.email.toLowerCase().includes(normalizedSearch) ||
      admin.pump.toLowerCase().includes(normalizedSearch)
    );
  });

  // =====================================================
  // ADMIN PAGINATION
  // =====================================================

  const adminTotalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

  const adminStartIndex = (adminCurrentPage - 1) * ITEMS_PER_PAGE;

  const adminEndIndex = adminStartIndex + ITEMS_PER_PAGE;

  const paginatedAdmins = filteredAdmins.slice(adminStartIndex, adminEndIndex);

  // =====================================================
  // PUMP PAGINATION
  // =====================================================

  const pumpTotalPages = Math.ceil(normalizedPumps.length / ITEMS_PER_PAGE);

  const pumpStartIndex = (pumpCurrentPage - 1) * ITEMS_PER_PAGE;

  const pumpEndIndex = pumpStartIndex + ITEMS_PER_PAGE;

  const paginatedPumps = normalizedPumps.slice(pumpStartIndex, pumpEndIndex);

  // =====================================================
  // ADMIN PAGINATION HANDLERS
  // =====================================================

  const handleAdminPrevious = () => {
    setAdminCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAdminNext = () => {
    setAdminCurrentPage((prev) => Math.min(prev + 1, adminTotalPages));
  };

  // =====================================================
  // PUMP PAGINATION HANDLERS
  // =====================================================

  const handlePumpPrevious = () => {
    setPumpCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePumpNext = () => {
    setPumpCurrentPage((prev) => Math.min(prev + 1, pumpTotalPages));
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="dashboard-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">
        <h1 className="page-title">Super Admin Dashboard</h1>

        <p className="page-subtitle">
          Manage administrators and CNG pumps from one central control plane.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="stats-grid">
        {/* TOTAL PUMPS */}

        <div className="stat-card">
          <div className="stat-header">
            <span>Total CNG Pumps</span>

            <Fuel size={18} className="stat-icon" />
          </div>

          <div className="stat-value">
            {isLoading ? "..." : normalizedPumps.length}
          </div>
        </div>

        {/* ADD PUMP */}

        <div className="action-card">
          <button
            className="add-pump-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={isCreating || isLoading}
          >
            <Plus size={18} />

            <span>Add CNG Pump</span>
          </button>
        </div>
      </div>

      {/* =================================================
          TABLES
      ================================================= */}

      <div className="dashboard-tables-grid">
        {/* =================================================
            ADMIN OVERVIEW
        ================================================= */}

        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Admin Overview</h3>

            <div className="search-box">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search admins..."
                value={adminSearch}
                onChange={(e) => {
                  setAdminSearch(e.target.value);

                  setAdminCurrentPage(1);
                }}
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
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="cell-text"
                      style={{
                        textAlign: "center",
                        padding: "24px",
                      }}
                    >
                      Loading admins...
                    </td>
                  </tr>
                ) : filteredAdmins.length > 0 ? (
                  paginatedAdmins.map((admin) => (
                    <tr key={admin.id}>
                      {/* ADMIN */}

                      <td>
                        <div className="user-cell">
                          <div className="avatar-circle">{admin.avatar}</div>

                          <div>
                            <div className="cell-title">{admin.name}</div>

                            <div className="cell-sub">
                              {admin.email
                                ? admin.email
                                : `Last Login: ${admin.lastLogin}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PUMP */}

                      <td className="cell-text">{admin.pump}</td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`sup-badge ${String(admin.status)
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          • {admin.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="cell-text"
                      style={{
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              ADMIN PAGINATION
          ================================================= */}

          {!isLoading && filteredAdmins.length > 0 && adminTotalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                disabled={adminCurrentPage === 1}
                onClick={handleAdminPrevious}
              >
                Previous
              </button>

              <div className="pagination-pages">
                {Array.from(
                  {
                    length: adminTotalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-number ${
                      adminCurrentPage === page ? "active" : ""
                    }`}
                    onClick={() => setAdminCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-btn"
                disabled={adminCurrentPage === adminTotalPages}
                onClick={handleAdminNext}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            PUMP OVERVIEW
        ================================================= */}

        <div className="table-card">
          <div className="table-card-header">
            <h3 className="card-title">Pump Overview</h3>

            <button className="filter-btn" type="button">
              <Filter size={14} />
              Filter
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PUMP DETAILS</th>

                  <th>LOCATION</th>

                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="cell-text"
                      style={{
                        textAlign: "center",
                        padding: "24px",
                      }}
                    >
                      Loading pumps...
                    </td>
                  </tr>
                ) : normalizedPumps.length > 0 ? (
                  paginatedPumps.map((pump) => (
                    <tr key={pump.id}>
                      {/* PUMP DETAILS */}

                      <td>
                        <div className="cell-title">{pump.name}</div>

                        <div className="cell-sub">
                          Admin:{" "}
                          <span
                            className={!pump.admin?.assigned ? "text-red" : ""}
                          >
                            {pump.admin?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>

                      {/* LOCATION */}

                      <td className="cell-text">{pump.location}</td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`badge ${String(pump.status)
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          • {pump.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="cell-text"
                      style={{
                        textAlign: "center",
                        padding: "24px",
                      }}
                    >
                      No pumps found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PUMP PAGINATION
          ================================================= */}

          {!isLoading && normalizedPumps.length > 0 && pumpTotalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                disabled={pumpCurrentPage === 1}
                onClick={handlePumpPrevious}
              >
                Previous
              </button>

              <div className="pagination-pages">
                {Array.from(
                  {
                    length: pumpTotalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-number ${
                      pumpCurrentPage === page ? "active" : ""
                    }`}
                    onClick={() => setPumpCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-btn"
                disabled={pumpCurrentPage === pumpTotalPages}
                onClick={handlePumpNext}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          ADD PUMP MODAL
      ================================================= */}

      <AddPumpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPump={handleAddPump}
        isLoading={isCreating}
      />
    </div>
  );
};

export default SuperAdminDashboard;
