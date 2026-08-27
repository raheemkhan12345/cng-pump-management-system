import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaScaleBalanced,
  FaMoneyBillWave,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPen,
  FaTrashCan,
} from "react-icons/fa6";
import "./SalesReport.css";

const SalesReport = () => {
  const navigate = useNavigate();

  // ==========================================
  // State
  // ==========================================

  const [activeTab, setActiveTab] = useState("Monthly");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // ==========================================
  // Transactions Data
  // ==========================================

  const transactions = [
    {
      id: 1,
      date: "2026-08-23",
      receiptNo: "23-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4250,
      totalAmount: 1275000,
      status: "Completed",
    },
    {
      id: 2,
      date: "2026-08-22",
      receiptNo: "22-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4120,
      totalAmount: 1236000,
      status: "Completed",
    },
    {
      id: 3,
      date: "2026-08-21",
      receiptNo: "21-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4380,
      totalAmount: 1314000,
      status: "Completed",
    },
    {
      id: 4,
      date: "2026-08-20",
      receiptNo: "20-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4050,
      totalAmount: 1215000,
      status: "Completed",
    },
    {
      id: 5,
      date: "2026-08-19",
      receiptNo: "19-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4310,
      totalAmount: 1293000,
      status: "Completed",
    },
    {
      id: 6,
      date: "2026-08-18",
      receiptNo: "18-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4180,
      totalAmount: 1254000,
      status: "Completed",
    },
    {
      id: 7,
      date: "2026-08-17",
      receiptNo: "17-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4220,
      totalAmount: 1266000,
      status: "Completed",
    },
    {
      id: 8,
      date: "2026-08-10",
      receiptNo: "10-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 3900,
      totalAmount: 1170000,
      status: "Completed",
    },
    {
      id: 9,
      date: "2026-08-05",
      receiptNo: "05-08-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4100,
      totalAmount: 1230000,
      status: "Completed",
    },
    {
      id: 10,
      date: "2026-07-30",
      receiptNo: "30-07-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 4000,
      totalAmount: 1200000,
      status: "Completed",
    },
    {
      id: 11,
      date: "2026-07-25",
      receiptNo: "25-07-2026",
      type: "Daily Summary",
      attendant: "Admin",
      salesKg: 3850,
      totalAmount: 1155000,
      status: "Completed",
    },
  ];

  // ==========================================
  // Format Currency
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(amount);
  };

  // ==========================================
  // Filter Transactions
  // ==========================================

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);

      // ==========================================
      // Daily
      // ==========================================

      if (activeTab === "Daily") {
        return (
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      }

      // ==========================================
      // Weekly
      // ==========================================

      if (activeTab === "Weekly") {
        const startOfWeek = new Date(today);

        const day = startOfWeek.getDay();

        startOfWeek.setDate(startOfWeek.getDate() - day);

        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);

        endOfWeek.setDate(endOfWeek.getDate() + 6);

        endOfWeek.setHours(23, 59, 59, 999);

        return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
      }

      // ==========================================
      // Monthly
      // ==========================================

      if (activeTab === "Monthly") {
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });
  }, [transactions, activeTab]);

  // ==========================================
  // Calculate Report Stats
  // ==========================================

  const reportStats = useMemo(() => {
    const totalKgSold = filteredTransactions.reduce(
      (total, transaction) => total + transaction.salesKg,
      0,
    );

    const grossRevenue = filteredTransactions.reduce(
      (total, transaction) => total + transaction.totalAmount,
      0,
    );

    return {
      totalKgSold,
      grossRevenue,
    };
  }, [filteredTransactions]);

  // ==========================================
  // Pagination
  // ==========================================

  const totalResults = filteredTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // ==========================================
  // Page Numbers
  // ==========================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // ==========================================
  // Navigation
  // ==========================================

  const handleBack = () => {
    navigate(-1);
  };

  // ==========================================
  // Tab Change
  // ==========================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // ==========================================
  // Pagination Handlers
  // ==========================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ==========================================
  // Edit Handler
  // ==========================================

  const handleEdit = (item) => {
    console.log("Edit transaction:", item);
  };

  // ==========================================
  // Delete Handler
  // ==========================================

  const handleDelete = (item) => {
    console.log("Delete transaction:", item);
  };

  return (
    <div className="sr-page-container">
      {/* ==========================================
                Back Navigation
            ========================================== */}

      <button type="button" className="sr-back-btn" onClick={handleBack}>
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* ==========================================
                Header
            ========================================== */}

      <div className="sr-header-section">
        <div>
          <h1 className="sr-page-title">Sales Report</h1>

          <p className="sr-page-subtitle">
            Comprehensive overview of CNG sales and revenue.
          </p>
        </div>

        <button type="button" className="sr-btn-export">
          <FaDownload />
          <span>Export PDF</span>
        </button>
      </div>

      {/* ==========================================
                Daily / Weekly / Monthly Tabs
            ========================================== */}

      <div className="sr-filter-tabs-container">
        {["Daily", "Weekly", "Monthly"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`sr-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ==========================================
                Overview Cards
            ========================================== */}

      <div className="sr-stats-grid">
        {/* ==========================================
                    Total KG Sold
                ========================================== */}

        <div className="sr-stat-card">
          <div className="sr-card-content">
            <span className="sr-card-label">
              TOTAL KG
              <br />
              SOLD
            </span>

            <h2 className="sr-card-amount">
              {formatCurrency(reportStats.totalKgSold)}

              <span className="sr-unit"> KG</span>
            </h2>
          </div>

          <div className="sr-card-icon-wrapper icon-bg-blue">
            <FaScaleBalanced className="sr-icon-blue" />
          </div>
        </div>

        {/* ==========================================
                    Gross Revenue
                ========================================== */}

        <div className="sr-stat-card">
          <div className="sr-card-content">
            <span className="sr-card-label">
              GROSS
              <br />
              REVENUE
            </span>

            <h2 className="sr-card-amount">
              <span className="sr-currency">Rs.</span>{" "}
              {formatCurrency(reportStats.grossRevenue)}
            </h2>
          </div>

          <div className="sr-card-icon-wrapper icon-bg-green">
            <FaMoneyBillWave className="sr-icon-green" />
          </div>
        </div>
      </div>

      {/* ==========================================
                Transaction Details
            ========================================== */}

      <div className="sr-table-card">
        {/* ==========================================
                    Table Header
                ========================================== */}

        <div className="sr-table-header">
          <h3 className="sr-table-title">Transaction Details</h3>

          <button
            type="button"
            className="sr-btn-filter"
            title="Filter Transactions"
          >
            <FaFilter />
          </button>
        </div>

        {/* ==========================================
                    Table
                ========================================== */}

        <div className="sr-table-wrapper">
          <table className="sr-data-table">
            <thead>
              <tr>
                <th>RECEIPT NO.</th>
                <th>TYPE</th>
                <th>ATTENDANT</th>
                <th>SALES (KG)</th>
                <th>TOTAL AMOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((item) => (
                  <tr key={item.id}>
                    {/* Receipt Number */}

                    <td className="sr-font-semibold">{item.receiptNo}</td>

                    {/* Type */}

                    <td className="sr-text-muted">{item.type}</td>

                    {/* Attendant */}

                    <td className="sr-text-muted">{item.attendant}</td>

                    {/* Sales KG */}

                    <td className="sr-font-semibold">
                      {formatCurrency(item.salesKg)}
                    </td>

                    {/* Total Amount */}

                    <td className="sr-font-bold">
                      Rs. {formatCurrency(item.totalAmount)}
                    </td>

                    {/* Status */}

                    <td>
                      <span className="sr-badge-completed">{item.status}</span>
                    </td>

                    {/* Actions */}

                    <td className="sr-actions-cell">
                      {/* Edit */}

                      <button
                        type="button"
                        className="sr-action-btn sr-edit-btn"
                        title="Edit"
                        aria-label={`Edit transaction ${item.receiptNo}`}
                        onClick={() => handleEdit(item)}
                      >
                        <FaPen />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        className="sr-action-btn sr-delete-btn"
                        title="Delete"
                        aria-label={`Delete transaction ${item.receiptNo}`}
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrashCan />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="sr-empty-state">
                    No sales found for {activeTab.toLowerCase()} period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==========================================
                    Pagination
                ========================================== */}

        {totalResults > 0 && (
          <div className="sr-pagination-footer">
            <span className="sr-pagination-info">
              Showing{" "}
              <b>
                {startIndex + 1} to {endIndex}
              </b>{" "}
              of <b>{totalResults}</b> results
            </span>

            <div className="sr-pagination-controls">
              {/* Previous */}

              <button
                type="button"
                className="sr-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>

              {/* Page Numbers */}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`sr-page-num ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Next */}

              <button
                type="button"
                className="sr-page-arrow"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
