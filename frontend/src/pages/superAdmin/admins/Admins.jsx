import React, { useCallback, useEffect, useState } from "react";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { getAllAdmins } from "../../../services/superAdminDash";

import "./Admins.css";

const ITEMS_PER_PAGE = 5;

const Admins = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================
  // GET ALL ADMINS
  // =====================================================

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Fetching All Admins...");

      const response = await getAllAdmins();

      console.log("Get All Admins Response:", response);

      /*
       * Backend response different formats mein
       * aa sakti hai.
       */

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

      console.log("Admin Data:", adminData);

      setAdmins(adminData);

      // Fresh data ke baad page 1 par reset
      setCurrentPage(1);
    } catch (error) {
      console.error("Get All Admins Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load administrators.";

      setError(message);
      setAdmins([]);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =====================================================
  // FETCH ADMINS ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // =====================================================
  // NORMALIZE ADMIN DATA
  // =====================================================

  const normalizedAdmins = admins.map((admin, index) => {
    /*
     * Backend mein admin directly ho sakta hai
     * ya nested object ke andar.
     */

    const adminData =
      admin?.admin || admin?.user || admin?.adminDetails || admin;

    // -------------------------------------------------
    // ID
    // -------------------------------------------------

    const id =
      admin?._id ||
      admin?.id ||
      adminData?._id ||
      adminData?.id ||
      `admin-${index}`;

    // -------------------------------------------------
    // NAME
    // -------------------------------------------------

    const name =
      admin?.adminName ||
      admin?.name ||
      admin?.fullName ||
      admin?.username ||
      adminData?.name ||
      adminData?.fullName ||
      adminData?.username ||
      "Unknown Admin";

    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    const email = admin?.email || adminData?.email || "N/A";

    // -------------------------------------------------
    // ASSIGNED PUMP
    // -------------------------------------------------

    const assignedPump =
      admin?.pumpName ||
      admin?.nameOfPump ||
      admin?.stationName ||
      admin?.pump?.name ||
      admin?.pump?.pumpName ||
      adminData?.pumpName ||
      adminData?.pump?.name ||
      "Unassigned";

    // -------------------------------------------------
    // PUMP ADDRESS
    // -------------------------------------------------

    const pumpAddress =
      admin?.pumpAddress ||
      admin?.location ||
      admin?.address ||
      admin?.pump?.address ||
      "N/A";

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    const status = admin?.status || adminData?.status || "Active";

    // -------------------------------------------------
    // INITIALS
    // -------------------------------------------------

    const initials =
      admin?.initials ||
      adminData?.initials ||
      name
        ?.trim()
        ?.split(/\s+/)
        ?.map((word) => word.charAt(0))
        ?.join("")
        ?.toUpperCase()
        ?.slice(0, 2) ||
      "U";

    return {
      id,
      name,
      email,
      initials,
      assignedPump,
      pumpAddress,
      status,
      originalData: admin,
    };
  });

  // =====================================================
  // SEARCH ADMINS
  // =====================================================

  const filteredAdmins = normalizedAdmins.filter((admin) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      admin.name.toLowerCase().includes(search) ||
      admin.email.toLowerCase().includes(search) ||
      admin.assignedPump.toLowerCase().includes(search) ||
      admin.pumpAddress.toLowerCase().includes(search) ||
      admin.status.toLowerCase().includes(search)
    );
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

  // =====================================================
  // PAGINATION HANDLERS
  // =====================================================

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =====================================================
  // SEARCH HANDLER
  // =====================================================

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    // Search change hone par page 1
    setCurrentPage(1);
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    return String(status).toLowerCase().replace(/\s+/g, "-");
  };

  // =====================================================
  // PAGINATION DISPLAY
  // =====================================================

  const showingFrom = filteredAdmins.length > 0 ? startIndex + 1 : 0;

  const showingTo = Math.min(endIndex, filteredAdmins.length);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admins-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">
        <h1 className="page-title">Administrators</h1>

        <p className="page-subtitle">
          Control system access and assign pump managers.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="admins-card">
        {/* =================================================
            TABLE CONTROLS
        ================================================= */}

        <div className="table-controls">
          {/* SEARCH */}

          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search name, pump, or status..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              disabled={isLoading}
            />
          </div>

          {/* ACTION BUTTONS */}

          <div className="action-buttons">
            <button type="button" className="control-btn filter-btn">
              <FaFilter size={12} />
              <span>Filter</span>
            </button>

            <button type="button" className="control-btn export-btn">
              <FaDownload size={12} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-responsive">
          <table className="admins-table">
            {/* TABLE HEADER */}

            <thead>
              <tr>
                <th>NAME & EMAIL</th>

                <th>ASSIGNED PUMP</th>

                <th>STATUS</th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {/* LOADING */}

              {isLoading ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    Loading administrators...
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                /* PAGINATED DATA */

                paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    {/* NAME + EMAIL */}

                    <td>
                      <div className="user-profile-cell">
                        <div className="user-initials">{admin.initials}</div>

                        <div className="user-details">
                          <span className="user-name">{admin.name}</span>

                          <span className="user-email">{admin.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* PUMP */}

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

                    {/* STATUS */}

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          admin.status,
                        )}`}
                      >
                        • {admin.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                /* NO DATA */

                <tr>
                  <td colSpan="3" className="no-data">
                    {searchTerm
                      ? "No administrators found matching your search."
                      : "No administrators found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            TABLE FOOTER
        ================================================= */}

        <div className="table-footer">
          {/* ENTRIES COUNT */}

          <span className="entries-count">
            {isLoading
              ? "Loading..."
              : filteredAdmins.length === 0
                ? "Showing 0 entries"
                : `Showing ${showingFrom} to ${showingTo} of ${filteredAdmins.length} entries`}
          </span>

          {/* PAGINATION */}

          {!isLoading && filteredAdmins.length > 0 && totalPages > 1 && (
            <div className="pagination-actions">
              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
                title="Previous page"
              >
                <FaChevronLeft size={10} />
              </button>

              {/* PAGE NUMBERS */}

              <div className="pagination-pages">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                aria-label="Next page"
                title="Next page"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admins;
