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

      // First request
      const firstResponse = await getLedger(1, pageSize);

      const firstTransactions = Array.isArray(firstResponse?.transaction)
        ? firstResponse.transaction
        : [];

      const totalPages = Number(firstResponse?.pagination?.totalPages) || 1;

      // If only one page exists
      if (totalPages === 1) {
        setTransactions(firstTransactions);
        return;
      }

      // Fetch remaining pages
      const pageRequests = [];

      for (let page = 2; page <= totalPages; page++) {
        pageRequests.push(getLedger(page, pageSize));
      }

      const remainingResponses = await Promise.all(pageRequests);

      const remainingTransactions = remainingResponses.flatMap((response) =>
        Array.isArray(response?.transaction) ? response.transaction : [],
      );

      setTransactions([...firstTransactions, ...remainingTransactions]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

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
  // Get first non-empty value
  // =========================================================
  const getFirstValue = (...values) => {
    return values.find(
      (value) =>
        value !== undefined && value !== null && String(value).trim() !== "",
    );
  };

  // =========================================================
  // Normalize Transaction
  // =========================================================
  const normalizeTransaction = (item, index) => {
    const rawDate =
      getFirstValue(item?.date, item?.transactionDate, item?.createdAt) || "";

    const detail = getFirstValue(
      item?.detail,
      item?.remarks,
      item?.remark,
      item?.description,
      item?.details,
      item?.notes,
      item?.narration,
      item?.comment,
      item?.comments,
      item?.reason,
      item?.purpose,
      item?.reference,
    );

    const type = getFirstValue(
      item?.type,
      item?.transactionType,
      item?.transaction_type,
    );

    const specificHead = getFirstValue(
      item?.specificHead,
      item?.specific_head,
      item?.head,
    );

    const paymentPool = getFirstValue(
      item?.paymentPool,
      item?.payment_pool,
      item?.paymentMethod,
      item?.payment_method,
    );

    const volume = getFirstValue(
      item?.volume,
      item?.volKg,
      item?.vol_kg,
      item?.cngVolume,
    );

    return {
      id: item?.id || item?._id || `ledger-${index}`,
      rawDate: getDateOnly(rawDate),
      date: formatDate(rawDate),
      type: type || "—",
      specificHead: specificHead || "—",
      detail: detail === undefined ? "—" : String(detail),
      amount: item?.amount ?? item?.totalAmount ?? item?.total_amount ?? 0,
      paymentPool: paymentPool || "—",
      volKg: volume ?? "—",
    };
  };

  // =========================================================
  // Normalize ALL Transactions
  // =========================================================
  const normalizedTransactions = useMemo(() => {
    return transactions.map((item, index) => normalizeTransaction(item, index));
  }, [transactions]);

  // =========================================================
  // Filter Transactions
  // =========================================================
  const filteredTransactions = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return normalizedTransactions.filter((item) => {
      const searchableFields = [
        item.type,
        item.specificHead,
        item.detail,
        item.paymentPool,
        item.amount,
        item.volKg,
      ];

      const matchesSearch =
        !search ||
        searchableFields.some((field) =>
          String(field ?? "")
            .toLowerCase()
            .includes(search),
        );

      const matchesDate = !filterDate || item.rawDate === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [normalizedTransactions, searchTerm, filterDate]);

  // =========================================================
  // Frontend Pagination
  // =========================================================
  const totalRecords = filteredTransactions.length;

  const totalPages =
    totalRecords === 0 ? 1 : Math.ceil(totalRecords / pageSize);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);

  // Keep page valid if result count changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================================================
  // Get Current Page Transactions
  // =========================================================
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, pageSize]);

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
      {/* Header */}
      <div className="ledger-header">
        <div>
          <h1 className="ledger-title">Ledger</h1>
          <p className="ledger-subtitle">
            Complete transaction record of your CNG station
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="ledger-filter-card">
        <div className="ledger-filter-grid">
          <div className="ledger-filter-group search-group">
            <label>Search</label>

            <div className="ledger-search-input-wrapper">
              <Search size={16} className="ledger-search-icon" />

              <input
                type="text"
                placeholder="Search type, remarks, specific head..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="ledger-filter-action">
            <button
              type="button"
              className="ledger-reset-btn"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    Loading ledger transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    {error}
                  </td>
                </tr>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((item) => (
                  <tr key={item.id}>
                    <td className="ledger-td-date">{item.date}</td>

                    <td>
                      <span
                        className={`ledger-badge ${getTypeBadgeClass(item.type)}`}
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
                <tr>
                  <td colSpan="7" className="ledger-empty-state">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ledger-footer">
          <span className="ledger-pagination-text">
            Showing <b>{showingFrom}</b> to <b>{showingTo}</b> of{" "}
            <b>{totalRecords}</b> transactions
          </span>

          <div className="ledger-pagination-buttons">
            <button
              type="button"
              className="ledger-page-btn"
              onClick={handlePrevious}
              disabled={loading || currentPage <= 1}
            >
              Previous
            </button>

            <button
              type="button"
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
