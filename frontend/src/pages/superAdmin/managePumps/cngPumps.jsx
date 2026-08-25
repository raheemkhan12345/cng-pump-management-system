import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import AddPumpModal from "../../../components/addNewPumpForm/AddPumpForm";

import EditNewPump from "../../../components/superAdminForms/EditPumpModal";

import { getAllAdmins } from "../../../services/superAdminDash";

import "./CngPumps.css";

// =====================================================
// CONSTANTS
// =====================================================

const ITEMS_PER_PAGE = 5;

const DEFAULT_STATUS = "Active";

const DEFAULT_PUMP_NAME = "Unnamed Pump";

const DEFAULT_PUMP_ADDRESS = "N/A";

const DEFAULT_ADMIN_NAME = "Unassigned";

// =====================================================
// DATE HELPERS
// =====================================================

const parseDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (dateValue) => {
  const date = parseDate(dateValue);

  if (!date) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (dateValue) => {
  const date = parseDate(dateValue);

  if (!date) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getPumpDate = (pump) => {
  return pump?.dateCommissioned || pump?.createdAt || null;
};

// =====================================================
// API DATA EXTRACTOR
// =====================================================

const extractApiData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.admins)) {
    return response.admins;
  }

  if (Array.isArray(response?.data?.admins)) {
    return response.data.admins;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
};

// =====================================================
// PUMP DATA NORMALIZER
// =====================================================

const normalizePump = (item, index) => {
  // ===================================================
  // MONGODB ID
  // ===================================================

  const mongoId = item?._id || item?.id || null;

  // ===================================================
  // ADMIN
  // ===================================================

  const adminName =
    item?.admin?.name ||
    item?.adminName ||
    item?.fullName ||
    item?.username ||
    item?.name ||
    DEFAULT_ADMIN_NAME;

  const adminEmail =
    item?.admin?.email || item?.adminEmail || item?.email || "N/A";

  // ===================================================
  // PUMP NAME
  // ===================================================

  const pumpName =
    item?.pumpName ||
    item?.pump?.name ||
    item?.pump?.pumpName ||
    item?.stationName ||
    item?.station?.name ||
    DEFAULT_PUMP_NAME;

  // ===================================================
  // PUMP ADDRESS
  // ===================================================

  const pumpAddress =
    item?.pumpAddress ||
    item?.pump?.address ||
    item?.pump?.pumpAddress ||
    item?.address ||
    item?.location ||
    DEFAULT_PUMP_ADDRESS;

  // ===================================================
  // STATUS
  // ===================================================

  const status =
    item?.pumpStatus || item?.status || item?.pump?.status || DEFAULT_STATUS;

  // ===================================================
  // PUMP NUMBER
  // ===================================================

  const pumpNo =
    item?.pumpNo ||
    item?.pump?.pumpNo ||
    item?.pumpId ||
    item?.stationId ||
    `P-${index + 1}`;

  // ===================================================
  // DATES
  // ===================================================

  const dateCommissioned =
    item?.dateCommissioned || item?.pump?.dateCommissioned || null;

  const createdAt = item?.createdAt || item?.pump?.createdAt || null;

  // ===================================================
  // ADMIN INITIALS
  // ===================================================

  const initials =
    adminName
      ?.trim()
      ?.split(/\s+/)
      ?.map((word) => word.charAt(0))
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "U";

  // ===================================================
  // ADMIN ASSIGNED
  // ===================================================

  const assigned = Boolean(
    item?.admin ||
    item?.adminName ||
    item?.adminEmail ||
    item?.email ||
    item?.fullName ||
    item?.username,
  );

  // ===================================================
  // RETURN NORMALIZED OBJECT
  // ===================================================

  return {
    ...item,

    _id: mongoId,

    id: mongoId || `pump-${index}`,

    pumpNo,

    name: pumpName,

    pumpName,

    location: pumpAddress,

    pumpAddress,

    status,

    pumpStatus: status,

    admin: {
      ...(item?.admin || {}),

      name: adminName,

      email: adminEmail,

      initials,

      assigned,

      lastLogin: item?.admin?.lastLogin || item?.lastLogin || "Never",
    },

    dateCommissioned,

    createdAt,
  };
};

// =====================================================
// CNG PUMPS
// =====================================================

const CngPumps = () => {
  // ===================================================
  // ADD MODAL
  // ===================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===================================================
  // EDIT MODAL
  // ===================================================

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedPump, setSelectedPump] = useState(null);

  // ===================================================
  // TABLE
  // ===================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [pumps, setPumps] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // ===================================================
  // GET ALL ADMINS / PUMPS
  // ===================================================

  const fetchPumps = useCallback(async () => {
    try {
      setIsLoading(true);

      setError("");

      console.log("========================================");
      console.log("FETCHING CNG PUMPS");
      console.log("========================================");

      const response = await getAllAdmins();

      console.log("Get All Admins API Response:", response);

      // =================================================
      // EXTRACT
      // =================================================

      const apiData = extractApiData(response);

      console.log("Extracted Pump/Admin Data:", apiData);

      // =================================================
      // NORMALIZE
      // =================================================

      const formattedPumps = apiData.map(normalizePump);

      console.log("Formatted Pumps:", formattedPumps);

      // =================================================
      // CHECK IDS
      // =================================================

      formattedPumps.forEach((pump) => {
        console.log(
          "Pump:",
          pump.pumpName,
          "| MongoDB ID:",
          pump._id,
          "| Admin ID:",
          pump?.admin?._id,
        );
      });

      setPumps(formattedPumps);

      setCurrentPage(1);
    } catch (error) {
      console.error("========================================");

      console.error("GET ALL ADMINS / PUMPS ERROR");

      console.error("========================================");

      console.error("Full Error:", error);

      console.error("Response:", error?.response);

      console.error("Response Data:", error?.response?.data);

      console.error("Status:", error?.response?.status);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load CNG pumps.";

      setError(message);

      setPumps([]);

      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchPumps();
  }, [fetchPumps]);

  // ===================================================
  // ADD PUMP SUCCESS
  // ===================================================

  const handleAddPump = async () => {
    console.log("Pump added successfully.");

    setIsModalOpen(false);

    await fetchPumps();
  };

  // ===================================================
  // EDIT PUMP
  // ===================================================

  const handleEditPump = (pump) => {
    console.log("========================================");

    console.log("EDIT PUMP CLICKED");

    console.log("========================================");

    console.log("Selected Pump:", pump);

    console.log("MongoDB _id:", pump?._id);

    console.log("Admin _id:", pump?.admin?._id);

    // =================================================
    // CHECK ID
    // =================================================

    const adminId =
      pump?.admin?._id ||
      pump?.admin?.id ||
      pump?.adminId ||
      pump?._id ||
      pump?.id;

    if (!adminId) {
      console.error("Admin/Pump MongoDB ID is missing!");

      setError("Unable to edit this pump because Admin ID is missing.");

      return;
    }

    setSelectedPump(pump);

    setIsEditModalOpen(true);

    setError("");
  };

  // ===================================================
  // CLOSE EDIT MODAL
  // ===================================================

  const handleCloseEditModal = () => {
    console.log("Edit Pump Modal Closed");

    setIsEditModalOpen(false);

    setSelectedPump(null);
  };

  // ===================================================
  // EDIT SUCCESS
  // ===================================================

  const handlePumpUpdated = async (updatedPump, changedFields) => {
    console.log("========================================");

    console.log("PUMP / ADMIN UPDATED SUCCESSFULLY");

    console.log("========================================");

    console.log("Updated Pump:", updatedPump);

    console.log("Changed Fields:", changedFields);

    // =================================================
    // CLOSE MODAL
    // =================================================

    setIsEditModalOpen(false);

    setSelectedPump(null);

    // =================================================
    // REFRESH FROM BACKEND
    // =================================================

    console.log("Refreshing CNG pump list...");

    await fetchPumps();

    console.log("CNG pump list refreshed successfully.");
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = (id) => {
    if (!id) {
      console.error("Delete failed: MongoDB ID missing.");

      return;
    }

    if (!window.confirm("Are you sure you want to delete this pump?")) {
      return;
    }

    console.log("Delete requested for MongoDB ID:", id);

    /*
     * Delete API can be added here.
     */
  };

  // ===================================================
  // SEARCH + SORT
  // ===================================================

  const filteredPumps = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filtered = pumps.filter((pump) => {
      if (!search) {
        return true;
      }

      const pumpName = String(pump?.name || "").toLowerCase();

      const pumpNo = String(pump?.pumpNo || "").toLowerCase();

      const location = String(pump?.location || "").toLowerCase();

      const status = String(pump?.status || "").toLowerCase();

      const adminName = String(pump?.admin?.name || "").toLowerCase();

      const adminEmail = String(pump?.admin?.email || "").toLowerCase();

      return (
        pumpName.includes(search) ||
        pumpNo.includes(search) ||
        location.includes(search) ||
        status.includes(search) ||
        adminName.includes(search) ||
        adminEmail.includes(search)
      );
    });

    // =================================================
    // NEWEST FIRST
    // =================================================

    return [...filtered].sort((a, b) => {
      const dateA = parseDate(getPumpDate(a));

      const dateB = parseDate(getPumpDate(b));

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      }

      if (dateA && !dateB) {
        return -1;
      }

      if (!dateA && dateB) {
        return 1;
      }

      return 0;
    });
  }, [pumps, searchTerm]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.ceil(filteredPumps.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedPumps = filteredPumps.slice(startIndex, endIndex);

  // ===================================================
  // PAGINATION HANDLERS
  // ===================================================

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(previousPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) => Math.min(previousPage + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    setCurrentPage(1);
  };

  // ===================================================
  // PAGINATION DISPLAY
  // ===================================================

  const showingFrom = filteredPumps.length > 0 ? startIndex + 1 : 0;

  const showingTo = Math.min(endIndex, filteredPumps.length);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="pumps-page">
      {/* ================================================
          HEADER
      ================================================ */}

      <div className="page-header-container">
        <div className="page-header">
          <h1 className="page-title">CNG Pumps</h1>

          <p className="page-subtitle">
            Configure and manage pump infrastructure across locations.
          </p>
        </div>

        <button
          className="add-pump-btn"
          onClick={() => setIsModalOpen(true)}
          type="button"
          disabled={isLoading}
        >
          <FaPlus size={13} />

          <span>Add CNG Pump</span>
        </button>
      </div>

      {/* ================================================
          ERROR
      ================================================ */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* ================================================
          PUMPS CARD
      ================================================ */}

      <div className="pumps-card">
        {/* ==============================================
            CONTROLS
        ============================================== */}

        <div className="table-controls">
          <h3 className="section-title">Active Infrastructure</h3>

          <div className="controls-right">
            <button className="icon-filter-btn" title="Filter" type="button">
              <FaFilter size={13} />
            </button>

            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search pumps..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* ==============================================
            TABLE
        ============================================== */}

        <div className="table-responsive">
          <table className="pumps-table">
            <thead>
              <tr>
                <th>PUMP NAME / NO</th>

                <th>LOCATION</th>

                <th>STATUS</th>

                <th>ASSIGNED ADMIN</th>

                <th>DATE & TIME</th>

                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {isLoading ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Loading CNG pumps...
                  </td>
                </tr>
              ) : filteredPumps.length > 0 ? (
                paginatedPumps.map((pump) => {
                  const pumpDate = getPumpDate(pump);

                  return (
                    <tr key={pump._id || pump.id}>
                      {/* PUMP */}

                      <td>
                        <div className="pump-info-cell">
                          <span
                            className={`pump-title ${
                              pump.status === "Inactive" ? "text-disabled" : ""
                            }`}
                          >
                            {pump.name || DEFAULT_PUMP_NAME}
                          </span>

                          <span className="pump-id">
                            ID: {pump.pumpNo || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* LOCATION */}

                      <td>
                        <span className="location-text">
                          {pump.location || DEFAULT_PUMP_ADDRESS}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`status-badge ${String(
                            pump.status || DEFAULT_STATUS,
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {pump.status || DEFAULT_STATUS}
                        </span>
                      </td>

                      {/* ADMIN */}

                      <td>
                        {pump.admin?.assigned ? (
                          <div className="admin-profile-cell">
                            <div className="admin-initials">
                              {pump.admin?.initials || "U"}
                            </div>

                            <span className="admin-name">
                              {pump.admin?.name || DEFAULT_ADMIN_NAME}
                            </span>
                          </div>
                        ) : (
                          <button className="assign-admin-btn" type="button">
                            <FaUserPlus size={12} />

                            <span>Assign Admin</span>
                          </button>
                        )}
                      </td>

                      {/* DATE */}

                      <td className="table-text-muted">
                        {pumpDate ? (
                          <div className="date-time-cell">
                            <span className="date-time-main">
                              {formatDate(pumpDate)}
                            </span>

                            <span className="date-time-time">
                              {formatTime(pumpDate)}
                            </span>
                          </div>
                        ) : (
                          <span>N/A</span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="action-icons">
                          {/* EDIT */}

                          <button
                            className="action-btn edit-btn"
                            title="Edit Pump"
                            type="button"
                            onClick={() => handleEditPump(pump)}
                          >
                            <FaEdit size={14} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="action-btn delete-btn"
                            title="Delete Pump"
                            type="button"
                            onClick={() => handleDelete(pump._id)}
                          >
                            <FaTrashAlt size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    {searchTerm
                      ? "No CNG pumps found matching your search."
                      : "No CNG pumps found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==============================================
            FOOTER
        ============================================== */}

        <div className="table-footer">
          <span className="entries-count">
            {isLoading
              ? "Loading..."
              : filteredPumps.length === 0
                ? "Showing 0 pumps"
                : `Showing ${showingFrom} to ${showingTo} of ${filteredPumps.length} pumps`}
          </span>

          {/* PAGINATION */}

          {!isLoading && filteredPumps.length > 0 && totalPages > 1 && (
            <div className="pagination-wrapper">
              {/* PREVIOUS */}

              <button
                className="page-nav-btn"
                type="button"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
              >
                <FaChevronLeft size={10} />

                <span>Prev</span>
              </button>

              {/* PAGE NUMBERS */}

              <div className="pagination-pages">
                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    className={`page-num-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}

              <button
                className="page-nav-btn"
                type="button"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                <span>Next</span>

                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================================================
          ADD PUMP MODAL
      ================================================ */}

      <AddPumpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPump={handleAddPump}
      />

      {/* ================================================
          EDIT PUMP MODAL
      ================================================ */}

      <EditNewPump
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        pumpData={selectedPump}
        onSave={handlePumpUpdated}
      />
    </div>
  );
};

export default CngPumps;
