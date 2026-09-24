import React, { useEffect, useState, useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import { getLedger } from "../../../services/adminApis/ledger";
import "./Ledger.css";

const Ledger = () => {
  // =========================================================
  // States
  // =========================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // =========================================================
  // Frontend Pagination
  // =========================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // =========================================================
  // API States
  // =========================================================
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // Fetch ALL Ledger Pages
  // =========================================================
  const fetchLedger = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // First request
      // =====================================================
      const firstResponse = await getLedger(1, pageSize);

      console.log("Ledger First Page Response:", firstResponse);

      const firstTransactions = Array.isArray(firstResponse?.transaction)
        ? firstResponse.transaction
        : [];

      const totalPages = Number(firstResponse?.pagination?.totalPages) || 1;

      console.log("Total Backend Pages:", totalPages);

      // =====================================================
      // If only one page exists
      // =====================================================
      if (totalPages === 1) {
        setTransactions(firstTransactions);
        return;
      }

      // =====================================================
      // Fetch remaining pages
      // =====================================================
      const pageRequests = [];

      for (let page = 2; page <= totalPages; page++) {
        pageRequests.push(getLedger(page, pageSize));
      }

      const remainingResponses = await Promise.all(pageRequests);

      // =====================================================
      // Extract transactions from remaining pages
      // =====================================================
      const remainingTransactions = remainingResponses.flatMap((response) =>
        Array.isArray(response?.transaction) ? response.transaction : [],
      );

      // =====================================================
      // Combine ALL transactions
      // =====================================================
      const allTransactions = [...firstTransactions, ...remainingTransactions];

      console.log("All Ledger Transactions:", allTransactions);

      console.log("Total Transactions Loaded:", allTransactions.length);

      setTransactions(allTransactions);
    } catch (err) {
      console.error("Ledger API Error:", err);

      setTransactions([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load ledger transactions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Fetch Ledger On Mount
  // =========================================================
  useEffect(() => {
    fetchLedger();
  }, []);

  // =========================================================
  // Format Currency
  // =========================================================
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // Get YYYY-MM-DD From API Date
  // =========================================================
  const getDateOnly = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const dateString = String(dateValue).trim();

    // ---------------------------------------------------------
    // API ISO format:
    // 2026-09-09T00:00:00.000Z
    // ---------------------------------------------------------
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    // ---------------------------------------------------------
    // Already YYYY-MM-DD
    // ---------------------------------------------------------
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // ---------------------------------------------------------
    // Fallback
    // ---------------------------------------------------------
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  // =========================================================
  // Format Date For Table
  // =========================================================
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // =========================================================
  // Normalize Transaction
  // =========================================================
  const normalizeTransaction = (item, index) => {
    const rawDate = item?.date || "";

    return {
      id: item?.id || item?._id || `ledger-${index}`,

      // Used ONLY for filtering
      rawDate: getDateOnly(rawDate),

      // Used ONLY for displaying
      date: formatDate(rawDate),

      type: item?.type || item?.transactionType || "—",

      specificHead: item?.specificHead || item?.specific_head || "—",

      detail:
        item?.detail ||
        item?.remarks ||
        item?.remark ||
        item?.description ||
        item?.details ||
        "—",

      amount: item?.amount ?? item?.totalAmount ?? item?.total_amount ?? 0,

      paymentPool:
        item?.paymentPool ||
        item?.payment_pool ||
        item?.paymentMethod ||
        item?.payment_method ||
        "—",

      volKg:
        item?.volKg ??
        item?.vol_kg ??
        item?.volumeKg ??
        item?.volume_kg ??
        item?.cngVolume ??
        item?.cng_volume ??
        "—",
    };
  };

  // =========================================================
  // Normalize ALL Transactions
  // =========================================================
  const normalizedTransactions = useMemo(() => {
    return transactions.map(normalizeTransaction);
  }, [transactions]);

  // =========================================================
  // Filter Transactions
  // =========================================================
  const filteredTransactions = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return normalizedTransactions.filter((item) => {
      // =================================================
      // Search Filter
      // =================================================
      const matchesSearch =
        !search ||
        String(item.detail).toLowerCase().includes(search) ||
        String(item.specificHead).toLowerCase().includes(search) ||
        String(item.type).toLowerCase().includes(search) ||
        String(item.paymentPool).toLowerCase().includes(search);

      // =================================================
      // Date Filter
      // =================================================
      const matchesDate = !filterDate || item.rawDate === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [normalizedTransactions, searchTerm, filterDate]);

  // =========================================================
  // Debug Date Filter
  // =========================================================
  useEffect(() => {
    if (filterDate) {
      console.log("Selected Date:", filterDate);

      console.log("Matching Transactions:", filteredTransactions);
    }
  }, [filterDate, filteredTransactions]);

  // =========================================================
  // Frontend Pagination
  // =========================================================
  const totalRecords = filteredTransactions.length;

  const totalPages =
    totalRecords === 0 ? 1 : Math.ceil(totalRecords / pageSize);

  // =========================================================
  // Reset Page When Filter Changes
  // =========================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);

  // =========================================================
  // Get Current Page Transactions
  // =========================================================
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, pageSize]);

  // =========================================================
  // Date Change
  // =========================================================
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    console.log("Date Selected:", selectedDate);

    setFilterDate(selectedDate);
    setCurrentPage(1);
  };

  // =========================================================
  // Search Change
  // =========================================================
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    setCurrentPage(1);
  };

  // =========================================================
  // Reset Filters
  // =========================================================
  const handleReset = () => {
    setSearchTerm("");
    setFilterDate("");
    setCurrentPage(1);
  };

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
  // Pagination Text
  // =========================================================
  const showingFrom = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const showingTo =
    totalRecords === 0 ? 0 : Math.min(currentPage * pageSize, totalRecords);

  // =========================================================
  // Type Badge
  // =========================================================
  const getTypeBadgeClass = (type) => {
    const normalizedType = String(type).toLowerCase().trim();

    switch (normalizedType) {
      case "sale":
      case "sales":
        return "ledger-badge-sale";

      case "expense":
      case "expenses":
        return "ledger-badge-expense";

      case "cash transfer":
      case "bank transfer":
      case "transfer":
        return "ledger-badge-transfer";

      default:
        return "";
    }
  };

  // =========================================================
  // JSX
  // =========================================================
  return (
    <div className="ledger-container">
      {/* =================================================
                Header
            ================================================== */}
      <div className="ledger-header">
        <div>
          <h1 className="ledger-title">Ledger</h1>

          <p className="ledger-subtitle">
            Complete transaction record of your CNG station
          </p>
        </div>
      </div>

      {/* =================================================
                Filters
            ================================================== */}
      <div className="ledger-filter-card">
        <div className="ledger-filter-grid">
          {/* Search */}
          <div className="ledger-filter-group search-group">
            <label>Search</label>

            <div className="ledger-search-input-wrapper">
              <Search size={16} className="ledger-search-icon" />

              <input
                type="text"
                placeholder="Search remarks..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Date */}
          <div className="ledger-filter-group">
            <label>Date</label>

            <input type="date" value={filterDate} onChange={handleDateChange} />
          </div>

          {/* Reset */}
          <div className="ledger-filter-action">
            <button className="ledger-reset-btn" onClick={handleReset}>
              <RotateCcw size={14} />

              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
                Table
            ================================================== */}
      <div className="ledger-table-card">
        <div className="ledger-table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>DATE</th>

                <th>TYPE</th>

                <th>SPECIFIC HEAD</th>

                <th>DETAIL / REMARKS</th>

                <th>AMOUNT (PKR)</th>

                <th>PAYMENT POOL</th>

                <th>VOL (KG)</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading ? (
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    Loading ledger transactions...
                  </td>
                </tr>
              ) : error ? (
                /* Error */
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    {error}
                  </td>
                </tr>
              ) : paginatedTransactions.length > 0 ? (
                /* Data */
                paginatedTransactions.map((item) => (
                  <tr key={item.id}>
                    <td className="ledger-td-date">{item.date}</td>

                    <td>
                      <span
                        className={`ledger-badge ${getTypeBadgeClass(
                          item.type,
                        )}`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="ledger-td-head">{item.specificHead}</td>

                    <td className="ledger-td-detail">{item.detail}</td>

                    <td className="ledger-td-amount">
                      Rs. {formatCurrency(item.amount)}
                    </td>

                    <td className="ledger-td-pool">{item.paymentPool}</td>

                    <td className="ledger-td-vol">{item.volKg}</td>
                  </tr>
                ))
              ) : (
                /* Empty */
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
                    Footer
                ================================================== */}
        <div className="ledger-footer">
          <span className="ledger-pagination-text">
            Showing <b>{showingFrom}</b> to <b>{showingTo}</b> of{" "}
            <b>{totalRecords}</b> transactions
          </span>

          <div className="ledger-pagination-buttons">
            <button
              className="ledger-page-btn"
              onClick={handlePrevious}
              disabled={loading || currentPage <= 1}
            >
              Previous
            </button>

            <button
              className="ledger-page-btn"
              onClick={handleNext}
              disabled={loading || currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
