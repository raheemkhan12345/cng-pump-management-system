import React, { useMemo, useState } from "react";
import {
  Plus,
  Landmark,
  TrendingUp,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

import RecordLoanModal from "../../../components/adminDashboardForms/addNewLoanModel/RecordLoanModel";
import "./Loans.css";

const Loans = () => {
  // =========================================================
  // State
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // =========================================================
  // Loan Transactions Data
  // =========================================================

  const [loanTransactions, setLoanTransactions] = useState([
    {
      id: 1,
      date: "19-08-2026",
      staffName: "Ali Raza",
      type: "Loan Given",
      amount: 10000,
      remainingBal: 45000,
    },
    {
      id: 2,
      date: "18-08-2026",
      staffName: "Noman Ali",
      type: "Loan Received",
      amount: 5000,
      remainingBal: 0,
    },
    {
      id: 3,
      date: "15-08-2026",
      staffName: "Muhammad Usman",
      type: "Loan Given",
      amount: 5000,
      remainingBal: 15000,
    },
    {
      id: 4,
      date: "12-08-2026",
      staffName: "Sajid Khan",
      type: "Loan Received",
      amount: 10000,
      remainingBal: 120000,
    },
    {
      id: 5,
      date: "10-08-2026",
      staffName: "Ali Raza",
      type: "Loan Received",
      amount: 15000,
      remainingBal: 35000,
    },
    {
      id: 6,
      date: "08-08-2026",
      staffName: "Bilal Ahmad",
      type: "Loan Given",
      amount: 20000,
      remainingBal: 20000,
    },
    {
      id: 7,
      date: "05-08-2026",
      staffName: "Usman Khan",
      type: "Loan Received",
      amount: 8000,
      remainingBal: 12000,
    },
    {
      id: 8,
      date: "03-08-2026",
      staffName: "Hamza Ali",
      type: "Loan Given",
      amount: 15000,
      remainingBal: 15000,
    },
    {
      id: 9,
      date: "30-07-2026",
      staffName: "Noman Ali",
      type: "Loan Given",
      amount: 12000,
      remainingBal: 12000,
    },
    {
      id: 10,
      date: "28-07-2026",
      staffName: "Sajid Khan",
      type: "Loan Received",
      amount: 7000,
      remainingBal: 130000,
    },
    {
      id: 11,
      date: "25-07-2026",
      staffName: "Ali Raza",
      type: "Loan Received",
      amount: 10000,
      remainingBal: 25000,
    },
    {
      id: 12,
      date: "22-07-2026",
      staffName: "Bilal Ahmad",
      type: "Loan Given",
      amount: 25000,
      remainingBal: 25000,
    },
  ]);

  const getLoanStatus = (remainingBal) => {
    return Number(remainingBal) <= 0 ? "Paid" : "Active";
  };

  // =========================================================
  // Save New Loan Handler
  // =========================================================

  const handleSaveLoan = (newLoanData) => {
    const formattedDate = newLoanData.date.split("-").reverse().join("-");

    const loanAmount = Number(newLoanData.amount);

    const newEntry = {
      id: Date.now(),
      date: formattedDate,
      staffName: newLoanData.personName,
      type: newLoanData.loanType,
      amount: loanAmount,

      // New loan starts with full amount remaining.
      remainingBal: loanAmount,
    };

    setLoanTransactions((prev) => [newEntry, ...prev]);

    // New transaction added, so show first page.
    setCurrentPage(1);

    // Close modal after successful save.
    setIsModalOpen(false);
  };

  // =========================================================
  // Edit Loan Handler
  // =========================================================

  const handleEdit = (loan) => {
    console.log("Edit Loan:", loan);
  };

  // =========================================================
  // Delete Loan Handler
  // =========================================================

  const handleDelete = (loan) => {
    console.log("Delete Loan:", loan);
  };

  // =========================================================
  // Currency Formatter
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // Current Date
  // =========================================================

  const today = new Date();

  // =========================================================
  // Loan Statistics
  // =========================================================

  const loanStats = useMemo(() => {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // =======================================================
    // This Month Loan
    // =======================================================

    const thisMonthLoan = loanTransactions
      .filter((transaction) => {
        if (transaction.type !== "Loan Given") {
          return false;
        }

        const transactionDate = new Date(
          `${transaction.date.split("-").reverse().join("-")}T00:00:00`,
        );

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // Total Loans Given
    // =======================================================

    const totalLoansGiven = loanTransactions
      .filter((transaction) => transaction.type === "Loan Given")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // This Month Recovery
    // =======================================================

    const thisMonthRecovery = loanTransactions
      .filter((transaction) => {
        if (transaction.type !== "Recovery") {
          return false;
        }

        const transactionDate = new Date(
          `${transaction.date.split("-").reverse().join("-")}T00:00:00`,
        );

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // Active Loan Staff
    // =======================================================
    // A staff member is active only when remaining balance > 0.

    const activeStaff = new Set(
      loanTransactions
        .filter((transaction) => Number(transaction.remainingBal) > 0)
        .map((transaction) => transaction.staffName),
    );

    return {
      thisMonthLoan,
      totalLoansGiven,
      thisMonthRecovery,
      activeLoanStaff: activeStaff.size,
    };
  }, [loanTransactions]);

  // =========================================================
  // Pagination
  // =========================================================

  const totalResults = loanTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = loanTransactions.slice(startIndex, endIndex);

  // =========================================================
  // Page Numbers
  // =========================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =========================================================
  // Previous Page
  // =========================================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  // =========================================================
  // Next Page
  // =========================================================

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  // =========================================================
  // Page Change
  // =========================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="loan-page-container">
      {/* =====================================================
          Header
      ===================================================== */}

      <div className="loan-header-section">
        <div>
          <h1 className="loan-page-title">Loans</h1>

          <p className="loan-page-subtitle">
            Manage staff loans, recoveries, and outstanding balances.
          </p>
        </div>

        <div className="loan-header-actions">
          <button
            type="button"
            className="loan-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />

            <span>New Loan Application</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          Statistics
      ===================================================== */}

      <div className="loan-stats-grid">
        {/* This Month Loan */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">This Month Loan</span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.thisMonthLoan)}
          </h2>
        </div>

        {/* Total Loans Given */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">Total Loans Given</span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.totalLoansGiven)}
          </h2>

          <span className="loan-stat-sub">Current outstanding</span>
        </div>

        {/* This Month Recovery */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <TrendingUp size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">This Month's Recovery</span>

          <h2 className="loan-stat-value loan-text-green">
            Rs. {formatCurrency(loanStats.thisMonthRecovery)}
          </h2>
        </div>

        {/* Active Staff */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Users size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">Active Loan Staff</span>

          <h2 className="loan-stat-value">
            {loanStats.activeLoanStaff}{" "}
            <span className="loan-unit-text">members</span>
          </h2>
        </div>
      </div>

      {/* =====================================================
          Transactions
      ===================================================== */}

      <div className="loan-table-card">
        {/* Table Header */}

        <div className="loan-table-header">
          <h3 className="loan-table-title">Recent Loan Transactions</h3>

          <button
            type="button"
            className="loan-filter-btn"
            title="Filter Loans"
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Table */}

        <div className="loan-table-wrapper">
          <table className="loan-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>NAME</th>
                <th>TYPE</th>
                <th>AMOUNT (RS.)</th>
                <th>REMAINING BAL.</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((item) => {
                  // =================================================
                  // Status is calculated from remaining balance.
                  // No manual status/dropdown is required.
                  // =================================================

                  const status = getLoanStatus(item.remainingBal);

                  return (
                    <tr key={item.id}>
                      {/* Date */}

                      <td className="loan-text-muted">{item.date}</td>

                      {/* Staff Name */}

                      <td className="loan-font-bold">{item.staffName}</td>

                      {/* Type */}

                      <td className="loan-text-muted">{item.type}</td>

                      {/* Amount */}

                      <td
                        className={
                          item.type === "Recovery"
                            ? "loan-text-green loan-font-bold"
                            : "loan-font-bold"
                        }
                      >
                        Rs. {formatCurrency(item.amount)}
                      </td>

                      {/* Remaining Balance */}

                      <td className="loan-text-muted">
                        Rs. {formatCurrency(item.remainingBal)}
                      </td>

                      {/* Status */}

                      <td>
                        <span
                          className={`loan-badge ${
                            status === "Paid"
                              ? "loan-badge-paid"
                              : "loan-badge-active"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* =================================================
                          Actions
                      ================================================= */}

                      <td className="loan-actions-cell">
                        {/* Edit */}

                        <button
                          type="button"
                          className="loan-action-btn loan-edit-btn"
                          title="Edit"
                          aria-label={`Edit loan for ${item.staffName}`}
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil size={11} />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          className="loan-action-btn loan-delete-btn"
                          title="Delete"
                          aria-label={`Delete loan for ${item.staffName}`}
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="loan-empty-state">
                    No loan transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            Pagination
        ================================================= */}

        {totalResults > 0 && (
          <div className="loan-table-footer">
            <span className="loan-pagination-info">
              Showing <b>{startIndex + 1}</b> to <b>{endIndex}</b> of{" "}
              <b>{totalResults}</b> entries
            </span>

            <div className="loan-pagination-controls">
              {/* Previous */}

              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page Numbers */}

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`loan-page-btn ${
                    currentPage === page ? "loan-page-active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Next */}

              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          Record Loan Modal
      ===================================================== */}

      <RecordLoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLoan}
      />
    </div>
  );
};

export default Loans;
