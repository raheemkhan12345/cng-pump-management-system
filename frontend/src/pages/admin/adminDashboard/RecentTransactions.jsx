import React, { useEffect, useMemo, useState } from "react";

import { CheckCircle2 } from "lucide-react";

import "./RecentTransactions.css";

/**
 * ==========================================
 * PAGINATION
 * ==========================================
 */
const ITEMS_PER_PAGE = 5;

/**
 * ==========================================
 * FORMAT CURRENCY
 * ==========================================
 */
const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Rs. 0";
  }

  return `Rs. ${new Intl.NumberFormat("en-PK").format(number)}`;
};

/**
 * ==========================================
 * FORMAT DATE
 * ==========================================
 */
const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  /**
   * If backend already sends:
   * 19-08-2026
   */
  if (/^\d{2}-\d{2}-\d{4}$/.test(String(value))) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * ==========================================
 * GET TYPE CLASS
 * ==========================================
 */
const getTypeClass = (type) => {
  const normalizedType = String(type || "").toLowerCase();

  if (normalizedType.includes("sale")) {
    return "badge-sale";
  }

  if (normalizedType.includes("expense")) {
    return "badge-expense";
  }

  if (normalizedType.includes("loan")) {
    return "badge-loan";
  }

  if (normalizedType.includes("transfer")) {
    return "badge-transfer";
  }

  return "badge-sale";
};

/**
 * ==========================================
 * GET TYPE
 * ==========================================
 */
const getTransactionType = (transaction) => {
  return (
    transaction?.type ||
    transaction?.transactionType ||
    transaction?.category ||
    transaction?.transaction ||
    "Transaction"
  );
};

/**
 * ==========================================
 * GET DETAILS
 * ==========================================
 */
const getTransactionDetails = (transaction) => {
  return (
    transaction?.details ||
    transaction?.description ||
    transaction?.remarks ||
    transaction?.note ||
    transaction?.name ||
    "-"
  );
};

/**
 * ==========================================
 * GET AMOUNT
 * ==========================================
 */
const getTransactionAmount = (transaction) => {
  return (
    transaction?.amount ??
    transaction?.totalAmount ??
    transaction?.saleAmount ??
    transaction?.expenseAmount ??
    0
  );
};

/**
 * ==========================================
 * GET POOL
 * ==========================================
 */
const getTransactionPool = (transaction) => {
  return (
    transaction?.pool ||
    transaction?.paymentMode ||
    transaction?.paymentMethod ||
    transaction?.account ||
    "-"
  );
};

/**
 * ==========================================
 * GET STATUS
 * ==========================================
 */
const getTransactionStatus = (transaction) => {
  return transaction?.status || "Completed";
};

/**
 * ==========================================
 * RECENT TRANSACTIONS
 * ==========================================
 */
const RecentTransactions = ({ transactions = [] }) => {
  // =========================================================
  // Pagination State
  // =========================================================
  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // Total Pages
  // =========================================================
  const totalPages =
    transactions.length === 0
      ? 1
      : Math.ceil(transactions.length / ITEMS_PER_PAGE);

  // =========================================================
  // Reset To Page 1 When Transactions Change
  // =========================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  // =========================================================
  // Current Page Transactions
  // =========================================================
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  // =========================================================
  // Previous Page
  // =========================================================
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // =========================================================
  // Next Page
  // =========================================================
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // =========================================================
  // Showing From
  // =========================================================
  const showingFrom =
    transactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  // =========================================================
  // Showing To
  // =========================================================
  const showingTo =
    transactions.length === 0
      ? 0
      : Math.min(currentPage * ITEMS_PER_PAGE, transactions.length);

  return (
    <div className="dashboard-section-card table-section-card">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="table-header-flex">
        <h3 className="section-title">Recent Transactions</h3>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>TYPE</th>
              <th>DETAILS</th>
              <th>AMOUNT</th>
              <th>POOL</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, index) => {
                const type = getTransactionType(tx);

                const typeClass = getTypeClass(type);

                const details = getTransactionDetails(tx);

                const amount = getTransactionAmount(tx);

                const pool = getTransactionPool(tx);

                const status = getTransactionStatus(tx);

                const transactionId =
                  tx?._id ||
                  tx?.id ||
                  tx?.transactionId ||
                  `${currentPage}-${index}`;

                return (
                  <tr key={transactionId}>
                    {/* DATE */}
                    <td className="date-cell">
                      {formatDate(
                        tx?.date || tx?.createdAt || tx?.transactionDate,
                      )}
                    </td>

                    {/* TYPE */}
                    <td>
                      <span className={`type-badge ${typeClass}`}>{type}</span>
                    </td>

                    {/* DETAILS */}
                    <td className="details-cell">{details}</td>

                    {/* AMOUNT */}
                    <td className="amount-cell">{formatCurrency(amount)}</td>

                    {/* POOL */}
                    <td className="pool-cell">{pool}</td>

                    {/* STATUS */}
                    <td>
                      <span className="status-badge">
                        <CheckCircle2 size={13} />

                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION FOOTER
      ====================================================== */}
      {transactions.length > 0 && (
        <div className="transactions-pagination">
          {/* Showing Text */}
          <span className="transactions-pagination-text">
            Showing <b>{showingFrom}</b> to <b>{showingTo}</b> of{" "}
            <b>{transactions.length}</b> transactions
          </span>

          {/* Buttons */}
          <div className="transactions-pagination-buttons">
            <button
              className="transactions-page-btn"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="transactions-page-number">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="transactions-page-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
