import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Fuel,
  Banknote,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";

import AddDieselExpenseModal from "../../../components/adminDashboardForms/addDieselExpenseModal/AddDieselExpenseModal";

import {
  getDieselExpenses,
  createDieselExpense,
  updateDieselExpense,
  deleteDieselExpense,
} from "../../../services/adminApis/expenseApi";

import "./DieselExpenseHistory.css";

// =========================================================
// HELPERS
// =========================================================

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-PK").format(number);
};

const formatNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const getMonthYear = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getFullYear()}`;
};

const getMonthKey = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

// =========================================================
// COMPONENT
// =========================================================

const DieselExpenseHistory = () => {
  // =========================================================
  // DIESEL DATA
  // =========================================================

  const [dieselExpenses, setDieselExpenses] = useState([]);

  // =========================================================
  // MONTH FILTER
  // =========================================================

  const [selectedMonth, setSelectedMonth] = useState("");

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // MODAL
  // =========================================================

  const [isDieselModalOpen, setIsDieselModalOpen] = useState(false);

  // =========================================================
  // SELECTED / EDITING DIESEL EXPENSE
  // =========================================================

  const [selectedDieselExpense, setSelectedDieselExpense] = useState(null);

  // =========================================================
  // SUBMITTING STATE
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // DELETE STATE
  // =========================================================

  const [deletingId, setDeletingId] = useState(null);

  // =========================================================
  // GET DIESEL EXPENSES
  // =========================================================

  const fetchDieselExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDieselExpenses();

      let expenses = [];

      // -------------------------------------------------------
      // HANDLE DIFFERENT API RESPONSE STRUCTURES
      // -------------------------------------------------------

      if (Array.isArray(response)) {
        expenses = response;
      } else if (Array.isArray(response?.data)) {
        expenses = response.data;
      } else if (Array.isArray(response?.dieselExpenses)) {
        expenses = response.dieselExpenses;
      } else if (Array.isArray(response?.expenses)) {
        expenses = response.expenses;
      } else if (Array.isArray(response?.result)) {
        expenses = response.result;
      } else if (Array.isArray(response?.records)) {
        expenses = response.records;
      } else if (Array.isArray(response?.data?.dieselExpenses)) {
        expenses = response.data.dieselExpenses;
      } else if (Array.isArray(response?.data?.expenses)) {
        expenses = response.data.expenses;
      }

      setDieselExpenses(expenses);

      // -------------------------------------------------------
      // SELECT LATEST MONTH
      // -------------------------------------------------------

      if (expenses.length > 0) {
        const sortedExpenses = [...expenses].sort((a, b) => {
          const dateA = new Date(
            a?.date || a?.createdAt || a?.expenseDate || 0,
          );

          const dateB = new Date(
            b?.date || b?.createdAt || b?.expenseDate || 0,
          );

          return dateB - dateA;
        });

        const latestExpense = sortedExpenses[0];

        const latestDate =
          latestExpense?.date ||
          latestExpense?.createdAt ||
          latestExpense?.expenseDate;

        const latestMonth = getMonthYear(latestDate);

        if (latestMonth) {
          setSelectedMonth(latestMonth);
        }
      } else {
        setSelectedMonth("");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load diesel expenses.",
      );

      setDieselExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchDieselExpenses();
  }, [fetchDieselExpenses]);

  // =========================================================
  // NORMALIZE API DATA
  // =========================================================

  const normalizedExpenses = useMemo(() => {
    return dieselExpenses.map((item) => {
      const realId =
        item?._id ||
        item?.id ||
        item?.expenseId ||
        item?.dieselExpenseId ||
        item?.dieselExpense?._id ||
        item?.dieselExpense?.id ||
        null;

      return {
        // REAL BACKEND ID
        id: realId,

        // DATE
        date:
          item?.date ||
          item?.expenseDate ||
          item?.dieselDate ||
          item?.createdAt ||
          "",

        // QUANTITY
        quantity:
          item?.quantity ??
          item?.liters ??
          item?.liter ??
          item?.litre ??
          item?.litres ??
          item?.quantityInLiters ??
          item?.dieselQuantity ??
          0,

        // AMOUNT
        amount:
          item?.amount ??
          item?.totalAmount ??
          item?.expenseAmount ??
          item?.dieselAmount ??
          item?.total ??
          0,

        // DETAILS
        details:
          item?.details ||
          item?.remarks ||
          item?.remark ||
          item?.description ||
          item?.notes ||
          item?.detail ||
          "-",

        // ORIGINAL API DATA
        originalData: item,
      };
    });
  }, [dieselExpenses]);

  // =========================================================
  // AVAILABLE MONTHS
  // =========================================================

  const availableMonths = useMemo(() => {
    const months = [];

    normalizedExpenses.forEach((item) => {
      const month = getMonthYear(item.date);
      const key = getMonthKey(item.date);

      if (month && key) {
        const alreadyExists = months.some(
          (existingMonth) => existingMonth.key === key,
        );

        if (!alreadyExists) {
          months.push({
            key,
            label: month,
          });
        }
      }
    });

    months.sort((a, b) => b.key.localeCompare(a.key));

    return months;
  }, [normalizedExpenses]);

  // =========================================================
  // SET DEFAULT MONTH
  // =========================================================

  useEffect(() => {
    if (!selectedMonth && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0].label);
    }
  }, [availableMonths, selectedMonth]);

  // =========================================================
  // FILTER BY MONTH
  // =========================================================

  const filteredExpenses = useMemo(() => {
    if (!selectedMonth) {
      return normalizedExpenses;
    }

    return normalizedExpenses.filter((item) => {
      return getMonthYear(item.date) === selectedMonth;
    });
  }, [normalizedExpenses, selectedMonth]);

  // =========================================================
  // TOTAL LITERS
  // =========================================================

  const totalLiters = useMemo(() => {
    return filteredExpenses.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);
  }, [filteredExpenses]);

  // =========================================================
  // TOTAL EXPENSE
  // =========================================================

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((total, item) => {
      return total + Number(item.amount || 0);
    }, 0);
  }, [filteredExpenses]);

  // =========================================================
  // DAILY DIESEL RECORD
  // =========================================================

  const dailyDieselRecord = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return null;
    }

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);

      return dateB - dateA;
    });

    return sortedExpenses[0] || null;
  }, [filteredExpenses]);

  // =========================================================
  // DAILY DIESEL SALE AMOUNT
  // =========================================================

  const dailyDieselSale = useMemo(() => {
    return Number(dailyDieselRecord?.amount || 0);
  }, [dailyDieselRecord]);

  // =========================================================
  // DAILY DIESEL LITERS
  // =========================================================

  const dailyDieselLiters = useMemo(() => {
    return Number(dailyDieselRecord?.quantity || 0);
  }, [dailyDieselRecord]);

  // =========================================================
  // DAILY DIESEL DATE
  // =========================================================

  const dailyDieselDate = useMemo(() => {
    return dailyDieselRecord?.date ? formatDate(dailyDieselRecord.date) : "-";
  }, [dailyDieselRecord]);

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const handleAddDieselExpense = () => {
    setSelectedDieselExpense(null);
    setIsDieselModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEdit = (item) => {
    const editingData = {
      ...item.originalData,

      _id: item.originalData?._id || item.originalData?.id || item.id,

      id: item.id,

      date: item.date,

      dieselQuantity: item.quantity,

      amount: item.amount,

      remarks: item.details === "-" ? "" : item.details,
    };

    if (!item.id) {
      window.alert(
        "Diesel expense ID is missing. This record cannot be edited.",
      );

      return;
    }

    setSelectedDieselExpense(editingData);
    setIsDieselModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseDieselModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsDieselModalOpen(false);
    setSelectedDieselExpense(null);
  };

  // =========================================================
  // CREATE / UPDATE DIESEL EXPENSE
  // =========================================================

  const handleDieselExpenseSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // =====================================================
      // VALIDATE FORM DATA
      // =====================================================

      if (!data?.date) {
        window.alert("Please select a date.");
        return;
      }

      if (
        data?.dieselQuantity === undefined ||
        data?.dieselQuantity === null ||
        data?.dieselQuantity === ""
      ) {
        window.alert("Please enter diesel quantity.");
        return;
      }

      if (
        data?.amount === undefined ||
        data?.amount === null ||
        data?.amount === ""
      ) {
        window.alert("Please enter diesel amount.");
        return;
      }

      // =====================================================
      // API PAYLOAD
      // =====================================================

      const dieselExpenseData = {
        date: data.date,
        dieselQuantity: Number(data.dieselQuantity),
        amount: Number(data.amount),
        remarks: data?.remarks?.trim() || "",
      };

      let response;

      // =====================================================
      // UPDATE EXISTING DIESEL EXPENSE
      // =====================================================

      if (selectedDieselExpense) {
        const dieselExpenseId =
          selectedDieselExpense?._id ||
          selectedDieselExpense?.id ||
          selectedDieselExpense?.expenseId ||
          selectedDieselExpense?.dieselExpenseId;

        if (!dieselExpenseId) {
          window.alert(
            "Diesel expense ID is missing. Cannot update this record.",
          );

          return;
        }

        response = await updateDieselExpense(
          dieselExpenseId,
          dieselExpenseData,
        );

        window.alert("Diesel expense updated successfully.");
      }

      // =====================================================
      // CREATE NEW DIESEL EXPENSE
      // =====================================================
      else {
        response = await createDieselExpense(dieselExpenseData);

        window.alert("Diesel expense created successfully.");
      }

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setIsDieselModalOpen(false);
      setSelectedDieselExpense(null);

      // =====================================================
      // REFRESH DATA
      // =====================================================

      await fetchDieselExpenses();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save diesel expense.";

      window.alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // DELETE DIESEL EXPENSE
  // =========================================================

  const handleDelete = async (id) => {
    // =======================================================
    // VALIDATE ID
    // =======================================================

    if (!id) {
      window.alert("Diesel expense ID is missing. Cannot delete this record.");

      return;
    }

    // =======================================================
    // CONFIRM DELETE
    // =======================================================

    const confirmed = window.confirm(
      "Are you sure you want to delete this diesel expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      // =====================================================
      // DELETE API
      // =====================================================

      await deleteDieselExpense(id);

      window.alert("Diesel expense deleted successfully.");

      // =====================================================
      // REFRESH DATA
      // =====================================================

      await fetchDieselExpenses();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete diesel expense.";

      window.alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // MONTH LABEL
  // =========================================================

  const monthLabel = selectedMonth || "Selected Month";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="diesel-container">
      {/* ===================================================
          METRICS
      ==================================================== */}

      <div className="metrics-grid">
        {/* DAILY DIESEL SALE */}

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">DAILY DIESEL SALE</span>

            <div className="icon-badge green-bg">
              <TrendingUp size={20} />
            </div>
          </div>

          <h2 className="metric-value">
            Rs. {formatCurrency(dailyDieselSale)}
          </h2>

          <p className="metric-sub-value">
            {formatNumber(dailyDieselLiters)} Liters
          </p>

          <div className="metric-bg-shape"></div>
        </div>

        {/* TOTAL LITERS */}

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL LITERS</span>

            <div className="icon-badge green-bg">
              <Fuel size={20} />
            </div>
          </div>

          <h2 className="metric-value">{formatNumber(totalLiters)} L</h2>

          <div className="metric-bg-shape"></div>
        </div>

        {/* TOTAL EXPENSE */}

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL DIESEL EXPENSE</span>

            <div className="icon-badge blue-bg">
              <Banknote size={20} />
            </div>
          </div>

          <h2 className="metric-value">Rs. {formatCurrency(totalExpense)}</h2>

          <div className="metric-bg-shape"></div>
        </div>
      </div>

      {/* ===================================================
          FILTER + ADD BUTTON
      ==================================================== */}

      <div
        className="filter-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* MONTH SELECT */}

        <div className="date-picker-btn">
          <Calendar size={18} className="calendar-icon" />

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select"
            disabled={loading || availableMonths.length === 0}
          >
            {availableMonths.length > 0 ? (
              availableMonths.map((month) => (
                <option key={month.key} value={month.label}>
                  {month.label}
                </option>
              ))
            ) : (
              <option value="">No Months Available</option>
            )}
          </select>
        </div>

        {/* ADD BUTTON */}

        <button
          type="button"
          className="btn-primary"
          onClick={handleAddDieselExpense}
          disabled={isSubmitting}
        >
          + Add Diesel Expense
        </button>
      </div>

      {/* ===================================================
          TABLE CARD
      ==================================================== */}

      <div className="table-card">
        {/* TABLE HEADER */}

        <div className="table-header-row">
          <div className="title-with-pill">
            <div className="green-pill"></div>

            <div>
              <h3 className="section-title">Monthly Purchase Entries</h3>

              <p className="section-subtitle">
                Detailed log of emergency and scheduled backup generator refills
              </p>
            </div>
          </div>

          <div className="show-badge">
            <span className="show-label">Show</span>

            <span className="records-count">
              {loading
                ? "Loading..."
                : `All ${filteredExpenses.length} Records`}
            </span>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: "15px",
              color: "#dc2626",
              background: "#fee2e2",
              borderRadius: "8px",
              margin: "15px",
            }}
          >
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="table-responsive">
          <table className="diesel-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>QUANTITY(L)</th>
                <th>AMOUNT(PKR)</th>
                <th>DETAIL / REMARKS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading diesel expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No diesel expenses found for {monthLabel}.
                  </td>
                </tr>
              ) : (
                /* RECORDS */

                filteredExpenses.map((row) => (
                  <tr key={row.id || `${row.date}-${row.amount}`}>
                    {/* DATE */}

                    <td>
                      <span className="date-badge">{formatDate(row.date)}</span>
                    </td>

                    {/* QUANTITY */}

                    <td className="font-semibold">
                      {formatNumber(row.quantity)} L
                    </td>

                    {/* AMOUNT */}

                    <td className="amount-text">
                      Rs. {formatCurrency(row.amount)}
                    </td>

                    {/* DETAILS */}

                    <td>
                      <div className="details-cell">
                        <span>{row.details}</span>
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="actions-cell">
                      {/* EDIT */}

                      <button
                        type="button"
                        className="icon-btn"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                        disabled={
                          !row.id || isSubmitting || deletingId === row.id
                        }
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="icon-btn"
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                        disabled={
                          !row.id || deletingId === row.id || isSubmitting
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="table-footer">
          <span>
            Sum of {monthLabel}:{" "}
            <strong>{formatNumber(totalLiters)} Liters</strong>
            &nbsp;&bull;&nbsp; Net Total:{" "}
            <strong className="green-text">
              Rs. {formatCurrency(totalExpense)}
            </strong>
          </span>
        </div>
      </div>

      {/* ===================================================
          ADD / EDIT DIESEL MODAL
      ==================================================== */}

      <AddDieselExpenseModal
        isOpen={isDieselModalOpen}
        onClose={handleCloseDieselModal}
        onSubmit={handleDieselExpenseSubmit}
        editingExpense={selectedDieselExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DieselExpenseHistory;
