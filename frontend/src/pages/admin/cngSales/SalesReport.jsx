import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaScaleBalanced,
  FaMoneyBillWave,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPen,
  FaTrashCan,
} from "react-icons/fa6";

import {
  getAllSales,
  updateSale,
  deleteSale,
} from "../../../services/adminApis/salesApi";

import EditSaleModal from "../../../components/adminDashboardForms/EditSaleModal/EditSaleModal";

import "./SalesReport.css";

const SalesReport = () => {
  const navigate = useNavigate();

  // =========================================================
  // CONSTANTS
  // =========================================================

  const ITEMS_PER_PAGE = 5;

  // =========================================================
  // STATES
  // =========================================================

  const [activeTab, setActiveTab] = useState("Monthly");

  const [currentPage, setCurrentPage] = useState(1);

  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // EDIT STATES
  // =========================================================

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);

  // =========================================================
  // DELETE STATES
  // =========================================================

  const [deletingSaleId, setDeletingSaleId] = useState(null);

  // =========================================================
  // FETCH SALES
  // =========================================================

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAllSales();

      console.log("Sales Report API Response:", response);

      // =====================================================
      // EXTRACT SALES ARRAY
      // =====================================================

      let sales = [];

      if (Array.isArray(response)) {
        sales = response;
      } else if (Array.isArray(response?.data)) {
        sales = response.data;
      } else if (Array.isArray(response?.sales)) {
        sales = response.sales;
      } else if (Array.isArray(response?.data?.sales)) {
        sales = response.data.sales;
      } else if (Array.isArray(response?.data?.data)) {
        sales = response.data.data;
      }

      console.log("Sales Report Sales Array:", sales);

      // =====================================================
      // NORMALIZE DATA
      // =====================================================

      const formattedSales = sales.map((sale, index) => {
        const saleDate = sale?.date ? String(sale.date).slice(0, 10) : "";

        return {
          id: sale?._id || sale?.id || `sale-${index}`,

          date: saleDate,

          notes: sale?.notes || sale?.remarks || sale?.detail || "",

          salesKg:
            Number(sale?.cngVolume ?? sale?.salesKg ?? sale?.volume ?? 0) || 0,

          totalAmount: Number(sale?.amount ?? sale?.totalAmount ?? 0) || 0,

          paymentMethod: sale?.paymentMethod || sale?.paymentMode || "cash",

          status: sale?.status || "Completed",

          rawData: sale,
        };
      });

      // =====================================================
      // SORT NEWEST FIRST
      // =====================================================

      formattedSales.sort((a, b) => {
        return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`);
      });

      setTransactions(formattedSales);
    } catch (error) {
      console.error("Failed to fetch sales report:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load sales report.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const [year, month, day] = String(date).slice(0, 10).split("-");

    if (!year || !month || !day) {
      return date;
    }

    return `${day}-${month}-${year}`;
  };

  // =========================================================
  // FORMAT PAYMENT METHOD
  // =========================================================

  const formatPaymentMethod = (paymentMethod) => {
    const method = String(paymentMethod || "")
      .trim()
      .toLowerCase();

    if (
      method === "bank" ||
      method === "bank transfer" ||
      method === "bank_transfer"
    ) {
      return "Bank";
    }

    return "Cash";
  };

  // =========================================================
  // PAYMENT CLASS
  // =========================================================

  const getPaymentClass = (paymentMethod) => {
    const method = String(paymentMethod || "")
      .trim()
      .toLowerCase();

    if (
      method === "bank" ||
      method === "bank transfer" ||
      method === "bank_transfer"
    ) {
      return "sr-payment-bank";
    }

    return "sr-payment-cash";
  };

  // =========================================================
  // FILTER TRANSACTIONS
  // =========================================================

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return transactions.filter((transaction) => {
      if (!transaction.date) {
        return false;
      }

      const transactionDate = new Date(`${transaction.date}T00:00:00`);

      // =====================================================
      // DAILY
      // =====================================================

      if (activeTab === "Daily") {
        return (
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      }

      // =====================================================
      // WEEKLY
      // =====================================================

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

      // =====================================================
      // MONTHLY
      // =====================================================

      if (activeTab === "Monthly") {
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });
  }, [transactions, activeTab]);

  // =========================================================
  // REPORT STATS
  // =========================================================

  const reportStats = useMemo(() => {
    const totalKgSold = filteredTransactions.reduce((total, transaction) => {
      return total + (Number(transaction.salesKg) || 0);
    }, 0);

    const grossRevenue = filteredTransactions.reduce((total, transaction) => {
      return total + (Number(transaction.totalAmount) || 0);
    }, 0);

    return {
      totalKgSold,
      grossRevenue,
    };
  }, [filteredTransactions]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalResults = filteredTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    navigate(-1);
  };

  // =========================================================
  // TAB CHANGE
  // =========================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // =========================================================
  // NEXT PAGE
  // =========================================================

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEdit = (item) => {
    console.log("Selected Sale For Edit:", item);

    setSelectedTransaction(item);

    setIsEditModalOpen(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }

    setIsEditModalOpen(false);

    setSelectedTransaction(null);
  };

  // =========================================================
  // SAVE EDITED SALE
  // =========================================================

  const handleSaveModal = async (updatedData) => {
    try {
      if (!updatedData?.id) {
        console.error("Sale ID missing:", updatedData);

        alert("Sale ID is missing.");

        return;
      }

      setIsUpdating(true);

      console.log("Updating Sale ID:", updatedData.id);

      // =====================================================
      // PUT REQUEST BODY
      // =====================================================

      const saleData = {
        date: updatedData.date,

        cngVolume: Number(updatedData.cngVolume),

        amount: Number(updatedData.amount),

        paymentMethod: updatedData.paymentMethod,

        notes: updatedData.notes || "",
      };

      console.log("Update Sale Request:", saleData);

      // =====================================================
      // PUT API
      // =====================================================

      const response = await updateSale(updatedData.id, saleData);

      console.log("Update Sale API Response:", response);

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setIsEditModalOpen(false);

      setSelectedTransaction(null);

      // =====================================================
      // REFRESH SALES
      // =====================================================

      await fetchSales();

      // =====================================================
      // RESET PAGE
      // =====================================================

      setCurrentPage(1);
    } catch (error) {
      console.error("Update Sale Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update sale.";

      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================================================
  // DELETE SALE
  // =========================================================

  const handleDelete = async (item) => {
    if (!item?.id) {
      console.error("Sale ID missing:", item);

      alert("Sale ID is missing.");

      return;
    }

    // =======================================================
    // CONFIRM DELETE
    // =======================================================

    const isConfirmed = window.confirm(
      `Are you sure you want to delete this sale record?\n\nDate: ${formatDate(
        item.date,
      )}\nSales: ${Number(item.salesKg || 0).toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} KG\nAmount: Rs. ${formatCurrency(item.totalAmount)}`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingSaleId(item.id);

      console.log("Deleting Sale ID:", item.id);

      // =====================================================
      // DELETE API
      // =====================================================

      const response = await deleteSale(item.id);

      console.log("Delete Sale API Response:", response);

      // =====================================================
      // REMOVE FROM LOCAL STATE
      // =====================================================

      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== item.id),
      );

      // =====================================================
      // CALCULATE VALID PAGE AFTER DELETE
      // =====================================================

      const remainingResults = totalResults - 1;

      const newTotalPages = Math.ceil(remainingResults / ITEMS_PER_PAGE);

      if (newTotalPages > 0 && currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      console.log("Sale deleted successfully.");
    } catch (error) {
      console.error("Delete Sale Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete sale.";

      alert(message);
    } finally {
      setDeletingSaleId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="sr-page-container">
        <div className="sr-loading">Loading sales report...</div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="sr-page-container">
        <div className="sr-error">
          <p>{error}</p>

          <button type="button" onClick={fetchSales}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="sr-page-container">
      {/* ===================================================
          BACK BUTTON
      =================================================== */}

      <button type="button" className="sr-back-btn" onClick={handleBack}>
        <FaArrowLeft />

        <span>Back</span>
      </button>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="sr-header-section">
        <div>
          <h1 className="sr-page-title">Sales Report</h1>

          <p className="sr-page-subtitle">
            Comprehensive overview of CNG sales and revenue.
          </p>
        </div>
      </div>

      {/* ===================================================
          TABS
      =================================================== */}

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

      {/* ===================================================
          OVERVIEW CARDS
      =================================================== */}

      <div className="sr-stats-grid">
        {/* TOTAL KG */}

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

        {/* GROSS REVENUE */}

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

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="sr-table-card">
        {/* TABLE HEADER */}

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

        {/* TABLE */}

        <div className="sr-table-wrapper">
          <table className="sr-data-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>REMARKS</th>
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
                    {/* DATE */}

                    <td className="sr-font-semibold">
                      {formatDate(item.date)}
                    </td>

                    {/* REMARKS */}

                    <td className="sr-text-muted">
                      {item.notes || "Daily Summary"}
                    </td>

                    {/* SALES KG */}

                    <td className="sr-font-semibold">
                      {Number(item.salesKg || 0).toLocaleString("en-PK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* AMOUNT */}

                    <td className="sr-font-bold">
                      <div className="sr-amount-wrapper">
                        <span>Rs. {formatCurrency(item.totalAmount)}</span>

                        <span
                          className={`sr-payment-badge ${getPaymentClass(
                            item.paymentMethod,
                          )}`}
                        >
                          {formatPaymentMethod(item.paymentMethod)}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span className="sr-badge-completed">{item.status}</span>
                    </td>

                    {/* ACTIONS */}

                    <td className="sr-actions-cell">
                      {/* EDIT */}

                      <button
                        type="button"
                        className="sr-action-btn sr-edit-btn"
                        title="Edit"
                        aria-label={`Edit transaction ${formatDate(item.date)}`}
                        onClick={() => handleEdit(item)}
                        disabled={isUpdating || deletingSaleId !== null}
                      >
                        <FaPen />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="sr-action-btn sr-delete-btn"
                        title="Delete"
                        aria-label={`Delete transaction ${formatDate(
                          item.date,
                        )}`}
                        onClick={() => handleDelete(item)}
                        disabled={deletingSaleId !== null || isUpdating}
                      >
                        {deletingSaleId === item.id ? (
                          <span
                            className="sr-delete-spinner"
                            aria-label="Deleting"
                          />
                        ) : (
                          <FaTrashCan />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="sr-empty-state">
                    No sales found for {activeTab.toLowerCase()} period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

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
              {/* PREVIOUS */}

              <button
                type="button"
                className="sr-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
              >
                <FaChevronLeft />
              </button>

              {/* PAGE NUMBERS */}

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

              {/* NEXT */}

              <button
                type="button"
                className="sr-page-arrow"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          EDIT SALE MODAL
      =================================================== */}

      <EditSaleModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveModal}
        initialData={selectedTransaction}
        isSaving={isUpdating}
      />
    </div>
  );
};

export default SalesReport;
