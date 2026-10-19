import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PlusCircle,
  TrendingDown,
  Calendar,
  Tags,
  ArrowLeft,
  Edit3,
  Trash2,
  Filter,
} from "lucide-react";

import AddNewExpenses from "../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses";
import RecentExpenses from "./RecentExpense";
import ExpenseCategoryCards from "./ExpenseCategoryCards";

import ExpenseRecoveryModal from "../../../components/adminDashboardForms/expenseRecoveryModal/ExpenseRecoveryModal";
import AddDieselExpenseModal from "../../../components/adminDashboardForms/addDieselExpenseModal/AddDieselExpenseModal";
import RecordOwnerExpenseModal from "../../../components/adminDashboardForms/recordOwnerExpenseModal/RecordOwnerExpenseModal";
import AddNewOwnerModal from "../../../components/adminDashboardForms/addNewOwnerModal/AddNewOwnerModal";

import {
  getExpenses,
  deleteExpense,
  createRecoveryExpense,
  getRecoveryExpenses,
  createDieselExpense,
  createOwner,
  getOwners,
  createOwnerExpense,
} from "../../../services/adminApis/expenseApi";

import "./Expenses.css";

// =========================================================
// DASHBOARD MONTH STORAGE KEY
// =========================================================

const DASHBOARD_MONTH_KEY = "cng_dashboard_selected_month";

// =========================================================
// GET SELECTED DASHBOARD MONTH
// =========================================================

const getSelectedDashboardMonth = () => {
  const currentDate = new Date();

  const defaultMonth = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };

  try {
    const savedMonth = sessionStorage.getItem(DASHBOARD_MONTH_KEY);

    if (!savedMonth) {
      return defaultMonth;
    }

    const parsedMonth = JSON.parse(savedMonth);

    if (
      Number.isInteger(parsedMonth?.year) &&
      Number.isInteger(parsedMonth?.month) &&
      parsedMonth.month >= 1 &&
      parsedMonth.month <= 12
    ) {
      return {
        year: parsedMonth.year,
        month: parsedMonth.month,
      };
    }

    return defaultMonth;
  } catch (error) {
    console.error("Failed to read dashboard selected month:", error);
    return defaultMonth;
  }
};

const Expenses = () => {
  // =========================================================
  // SELECTED DASHBOARD MONTH
  // =========================================================

  const [initialSelectedMonth] = useState(getSelectedDashboardMonth);

  const [selectedYear] = useState(initialSelectedMonth.year);
  const [selectedMonth] = useState(initialSelectedMonth.month);

  // =========================================================
  // NAVIGATION / VIEW STATES
  // =========================================================

  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isDieselModalOpen, setIsDieselModalOpen] = useState(false);
  const [isOwnerExpenseModalOpen, setIsOwnerExpenseModalOpen] = useState(false);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);

  // =========================================================
  // EDIT NORMAL EXPENSE
  // =========================================================

  const [editingExpense, setEditingExpense] = useState(null);

  // =========================================================
  // ALL NORMAL EXPENSE DATA
  // =========================================================

  const [allExpenses, setAllExpenses] = useState([]);

  // =========================================================
  // RECOVERY EXPENSE DATA
  // =========================================================

  const [recoveryExpensesData, setRecoveryExpensesData] = useState([]);

  // =========================================================
  // OWNER DATA
  // =========================================================

  const [owners, setOwners] = useState([]);

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // NORMAL EXPENSE DELETE STATE
  // =========================================================

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  // =========================================================
  // DIESEL SUBMITTING STATE
  // =========================================================

  const [isDieselSubmitting, setIsDieselSubmitting] = useState(false);

  // =========================================================
  // OWNER EXPENSE SUBMITTING STATE
  // =========================================================

  const [isOwnerExpenseSubmitting, setIsOwnerExpenseSubmitting] =
    useState(false);

  // =========================================================
  // FRONTEND PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // =========================================================
  // SELECTED MONTH LABEL
  // =========================================================

  const selectedMonthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(selectedYear, selectedMonth - 1, 1));
  }, [selectedYear, selectedMonth]);

  // =========================================================
  // GET ALL NORMAL EXPENSES
  // =========================================================

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getExpenses();

      let expenseData = [];

      if (Array.isArray(response?.data)) {
        expenseData = response.data;
      } else if (Array.isArray(response?.expenses)) {
        expenseData = response.expenses;
      } else if (Array.isArray(response?.expense)) {
        expenseData = response.expense;
      } else if (Array.isArray(response)) {
        expenseData = response;
      }

      setAllExpenses(expenseData);

      const calculatedTotalPages = Math.max(
        Math.ceil(expenseData.length / pageSize),
        1,
      );

      setCurrentPage((previousPage) =>
        Math.min(previousPage, calculatedTotalPages),
      );
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load expenses.";

      setError(errorMessage);
      setAllExpenses([]);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // GET ALL RECOVERY EXPENSES
  // =========================================================

  const fetchRecoveryExpenses = useCallback(async () => {
    try {
      const response = await getRecoveryExpenses();

      let recoveryData = [];

      if (Array.isArray(response?.data)) {
        recoveryData = response.data;
      } else if (Array.isArray(response?.recoveryExpenses)) {
        recoveryData = response.recoveryExpenses;
      } else if (Array.isArray(response?.recoveryExpense)) {
        recoveryData = response.recoveryExpense;
      } else if (Array.isArray(response)) {
        recoveryData = response;
      }

      setRecoveryExpensesData(recoveryData);
    } catch (error) {
      setRecoveryExpensesData([]);
    }
  }, []);

  // =========================================================
  // GET ALL OWNERS
  // =========================================================

  const fetchOwners = useCallback(async () => {
    try {
      const response = await getOwners();

      let ownerData = [];

      if (Array.isArray(response?.data)) {
        ownerData = response.data;
      } else if (Array.isArray(response?.owners)) {
        ownerData = response.owners;
      } else if (Array.isArray(response?.owner)) {
        ownerData = response.owner;
      } else if (Array.isArray(response)) {
        ownerData = response;
      }

      setOwners(ownerData);
    } catch (error) {
      setOwners([]);
    }
  }, []);

  // =========================================================
  // LOAD DATA ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchExpenses();
    fetchRecoveryExpenses();
    fetchOwners();
  }, [fetchExpenses, fetchRecoveryExpenses, fetchOwners]);

  // =========================================================
  // GET EXPENSE AMOUNT & DATE HELPERS
  // =========================================================

  const getAmount = (expense) => {
    return (
      Number(
        expense?.amount ?? expense?.totalAmount ?? expense?.expenseAmount ?? 0,
      ) || 0
    );
  };

  const getDate = (expense) => {
    return expense?.date || expense?.expenseDate || expense?.createdAt || "";
  };

  const getDateOnly = (dateValue) => {
    if (!dateValue) return "";
    const dateString = String(dateValue);
    if (dateString.includes("T")) return dateString.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const isInSelectedMonth = (dateValue) => {
    const dateOnly = getDateOnly(dateValue);
    if (!dateOnly) return false;
    const [year, month] = dateOnly.split("-").map(Number);
    return year === selectedYear && month === selectedMonth;
  };

  const todayExpenses = allExpenses
    .filter((expense) => getDateOnly(getDate(expense)) === todayDate)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const monthExpenses = allExpenses
    .filter((expense) => isInSelectedMonth(getDate(expense)))
    .reduce((total, expense) => total + getAmount(expense), 0);

  const selectedMonthExpenses = useMemo(() => {
    return allExpenses
      .filter((expense) => isInSelectedMonth(getDate(expense)))
      .sort((a, b) => new Date(getDate(b) || 0) - new Date(getDate(a) || 0));
  }, [allExpenses, selectedYear, selectedMonth]);

  const filteredTotalExpenses = selectedMonthExpenses.length;
  const filteredTotalPages = Math.max(
    Math.ceil(filteredTotalExpenses / pageSize),
    1,
  );

  const selectedMonthCurrentExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return selectedMonthExpenses.slice(startIndex, endIndex);
  }, [selectedMonthExpenses, currentPage]);

  useEffect(() => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage, filteredTotalPages),
    );
  }, [filteredTotalPages]);

  const selectedMonthRecoveryExpenses = useMemo(() => {
    return recoveryExpensesData
      .filter((recovery) =>
        isInSelectedMonth(
          recovery?.date || recovery?.recoveryDate || recovery?.createdAt || "",
        ),
      )
      .reduce(
        (total, recovery) =>
          total +
          (Number(recovery?.recoveryAmount ?? recovery?.amount ?? 0) || 0),
        0,
      );
  }, [recoveryExpensesData, selectedYear, selectedMonth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // PAGINATION HANDLERS
  // =========================================================

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < filteredTotalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= filteredTotalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // =========================================================
  // CRUD HANDLERS
  // =========================================================

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleExpenseSuccess = async () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    await fetchExpenses();
  };

  const handleCloseExpenseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (expense) => {
    const expenseId = expense?._id || expense?.id || expense?.expenseId;
    if (!expenseId) {
      window.alert("Expense ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      setDeletingExpenseId(expenseId);
      await deleteExpense(expenseId);
      window.alert("Expense deleted successfully.");
      await fetchExpenses();
    } catch (error) {
      window.alert("Failed to delete expense.");
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleRecoveryExpense = async (data) => {
    try {
      await createRecoveryExpense({
        date: data?.date,
        category: data?.category,
        recoveryAmount: Number(data?.recoveryAmount),
        remarks: data?.remarks,
        paymentMode: data?.paymentMode,
      });
      window.alert("Recovery expense created successfully.");
      setIsRecoveryModalOpen(false);
      await Promise.all([fetchExpenses(), fetchRecoveryExpenses()]);
    } catch (error) {
      window.alert("Failed to create recovery expense.");
    }
  };

  const handleDieselExpense = async (data) => {
    try {
      setIsDieselSubmitting(true);
      await createDieselExpense({
        date: data?.date,
        dieselQuantity: Number(data?.dieselQuantity),
        amount: Number(data?.amount),
        remarks: data?.remarks || "",
      });
      window.alert("Diesel expense created successfully.");
      setIsDieselModalOpen(false);
      await fetchExpenses();
    } catch (error) {
      window.alert("Failed to create diesel expense.");
    } finally {
      setIsDieselSubmitting(false);
    }
  };

  const handleCloseDieselModal = () => {
    setIsDieselModalOpen(false);
  };

  const handleAddOwner = async (data) => {
    try {
      const ownerName = data?.ownerName?.trim();
      if (!ownerName) {
        window.alert("Please enter an owner name.");
        return;
      }
      await createOwner({ ownerName });
      window.alert("Owner created successfully.");
      setIsAddOwnerModalOpen(false);
      await fetchOwners();
    } catch (error) {
      window.alert("Failed to create owner.");
    }
  };

  const handleOwnerExpense = async (data) => {
    try {
      setIsOwnerExpenseSubmitting(true);
      await createOwnerExpense({
        date: data?.date,
        amount: Number(data?.amount),
        paymentMode: data?.paymentMode,
        owner: data?.owner,
        status: data?.status,
        remarks: data?.remarks || "",
      });
      window.alert("Owner expense created successfully.");
      setIsOwnerExpenseModalOpen(false);
      await fetchExpenses();
    } catch (error) {
      window.alert("Failed to create owner expense.");
    } finally {
      setIsOwnerExpenseSubmitting(false);
    }
  };

  // =========================================================
  // CATEGORY CARD CLICK FILTERING LOGIC
  // =========================================================

  const filteredCategoryExpenses = useMemo(() => {
    if (!selectedCategoryName) return [];
    return selectedMonthExpenses.filter((expense) => {
      let currentCatName = "Uncategorized";
      const catField = expense?.category;

      if (typeof catField === "string") {
        currentCatName = catField.trim();
      } else if (typeof catField === "object" && catField !== null) {
        currentCatName =
          catField?.name ||
          catField?.title ||
          catField?.categoryName ||
          "Uncategorized";
      } else if (expense?.categoryName) {
        currentCatName = String(expense.categoryName).trim();
      }

      return (
        currentCatName.toLowerCase() ===
        String(selectedCategoryName).toLowerCase()
      );
    });
  }, [selectedMonthExpenses, selectedCategoryName]);

  const categoryTotalAmount = useMemo(() => {
    return filteredCategoryExpenses.reduce(
      (sum, item) => sum + getAmount(item),
      0,
    );
  }, [filteredCategoryExpenses]);

  // =========================================================
  // STATES LOADING / ERROR
  // =========================================================

  if (isLoading) {
    return (
      <div className="exp-page-container">
        <div className="exp-content-wrapper">
          <div className="exp-loading">Loading expenses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exp-page-container">
        <div className="exp-content-wrapper">
          <div className="exp-error">
            <p>{error}</p>
            <button type="button" onClick={fetchExpenses}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI RENDER
  // =========================================================

  return (
    <div className="exp-page-container">
      <div className="exp-content-wrapper">
        {/* ================= 1. CATEGORY DETAIL PAGE ================= */}
        {selectedCategoryName ? (
          <div>
            <div className="exp-title-row">
              <div className="exp-title-section">
                <h1 className="exp-page-title">
                  {selectedCategoryName} Expenses
                </h1>
                <p className="exp-page-subtitle">
                  Manage and view detailed operational costs for{" "}
                  <strong>{selectedCategoryName}</strong>.
                </p>
              </div>

              <button
                type="button"
                className="exp-btn-view-categories"
                onClick={() => setSelectedCategoryName(null)}
              >
                <ArrowLeft size={18} />
                <span>Back to Categories</span>
              </button>
            </div>

            <div className="exp-selected-month">
              <Calendar size={16} />
              <span>
                Showing data for <strong>{selectedMonthLabel}</strong>
              </span>
            </div>

            <div className="exp-stats-grid exp-category-stats">
              <div className="exp-stat-card">
                <div className="exp-stat-info">
                  <span className="exp-stat-label">
                    TOTAL {selectedCategoryName.toUpperCase()} SPENT
                  </span>
                  <h2 className="exp-stat-value">
                    Rs. {formatCurrency(categoryTotalAmount)}
                  </h2>
                  <span className="exp-stat-sub">
                    Total for {selectedMonthLabel}
                  </span>
                </div>
              </div>

              <div className="exp-stat-card">
                <div className="exp-stat-info">
                  <span className="exp-stat-label">TRANSACTIONS COUNT</span>
                  <h2 className="exp-stat-value">
                    {filteredCategoryExpenses.length}
                  </h2>
                  <span className="exp-stat-sub">Total entries logged</span>
                </div>
              </div>
            </div>

            <div className="exp-category-transactions">
              <div className="exp-category-transactions-header">
                <h3 className="exp-category-transactions-title">
                  {selectedMonthLabel} {selectedCategoryName} Transactions
                </h3>
                <Filter size={18} color="#64748b" />
              </div>

              <div className="exp-category-table-wrap">
                <table className="exp-category-table">
                  <thead>
                    <tr className="exp-category-table-head">
                      <th className="exp-category-table-cell">Date</th>
                      <th className="exp-category-table-cell">Payment Mode</th>
                      <th className="exp-category-table-cell">
                        Remarks / Details
                      </th>
                      <th className="exp-category-table-cell">Amount (Rs.)</th>
                      <th className="exp-category-table-cell">Status</th>
                      <th className="exp-category-table-cell exp-category-table-cell-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategoryExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="exp-category-empty">
                          No expense transactions found for{" "}
                          {selectedCategoryName} in {selectedMonthLabel}.
                        </td>
                      </tr>
                    ) : (
                      filteredCategoryExpenses.map((expense) => {
                        const id = expense?._id || expense?.id;
                        return (
                          <tr key={id} className="exp-category-table-row">
                            <td className="exp-category-table-cell">
                              {getDateOnly(getDate(expense))}
                            </td>
                            <td className="exp-category-table-cell">
                              {expense?.paymentMode || "Cash Account"}
                            </td>
                            <td className="exp-category-table-cell">
                              {expense?.remarks || "-"}
                            </td>
                            <td className="exp-category-table-cell exp-amount-cell">
                              Rs. {formatCurrency(getAmount(expense))}
                            </td>
                            <td className="exp-category-table-cell">
                              <span className="exp-status-pill">
                                {expense?.status || "Paid"}
                              </span>
                            </td>
                            <td className="exp-category-table-cell exp-actions-cell">
                              <div className="exp-row-actions">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(expense)}
                                  className="exp-icon-button"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(expense)}
                                  className="exp-icon-button exp-icon-button-danger"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : showCategories ? (
          /* ================= 2. CATEGORY CARDS VIEW ================= */
          <div>
            <div className="exp-title-row">
              <div className="exp-title-section">
                <h1 className="exp-page-title">Expense Categories</h1>
                <p className="exp-page-subtitle">
                  View your expenses grouped by category.
                </p>
              </div>

              <button
                type="button"
                className="exp-btn-view-categories"
                onClick={() => setShowCategories(false)}
              >
                <ArrowLeft size={18} />
                <span>Back to Expenses</span>
              </button>
            </div>

            <div className="exp-selected-month">
              <Calendar size={16} />
              <span>
                Viewing categories for <strong>{selectedMonthLabel}</strong>
              </span>
            </div>

            <ExpenseCategoryCards
              expenses={selectedMonthExpenses}
              onSelectCategory={(catName) => setSelectedCategoryName(catName)}
            />
          </div>
        ) : (
          /* ================= 3. MAIN DASHBOARD VIEW ================= */
          <>
            <div className="exp-title-row">
              <div className="exp-title-section">
                <h1 className="exp-page-title">Expenses</h1>
                <p className="exp-page-subtitle">
                  Manage and track station operational costs.
                </p>
              </div>

              <div className="exp-title-actions">
                <button
                  type="button"
                  className="exp-btn-add-owners"
                  onClick={() => setIsAddOwnerModalOpen(true)}
                >
                  <PlusCircle size={18} />
                  <span>Add Owners</span>
                </button>
              </div>
            </div>

            <div className="exp-selected-month">
              <Calendar size={16} />
              <span>
                Viewing expense records for{" "}
                <strong>{selectedMonthLabel}</strong>
              </span>
            </div>

            {/* EXPENSE STATS */}
            <div className="exp-stats-grid">
              <div className="exp-stat-card">
                <div className="exp-stat-info">
                  <span className="exp-stat-label">
                    TODAY'S
                    <br />
                    EXPENSES
                  </span>
                  <h2 className="exp-stat-value">
                    Rs. {formatCurrency(todayExpenses)}
                  </h2>
                  <span className="exp-stat-sub">Total outgoings today</span>
                </div>
                <div className="exp-icon-box exp-icon-red">
                  <TrendingDown size={18} />
                </div>
              </div>

              <div className="exp-stat-card">
                <div className="exp-stat-info">
                  <span className="exp-stat-label">
                    {selectedMonthLabel.toUpperCase()}
                    <br />
                    EXPENSES
                  </span>
                  <h2 className="exp-stat-value">
                    Rs. {formatCurrency(monthExpenses)}
                  </h2>
                  <span className="exp-stat-sub">
                    Total for {selectedMonthLabel}
                  </span>
                </div>
                <div className="exp-icon-box exp-icon-blue">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="exp-stat-card">
                <div className="exp-stat-info">
                  <span className="exp-stat-label">RECOVERY EXPENSES</span>
                  <h2 className="exp-stat-value">
                    Rs. {formatCurrency(selectedMonthRecoveryExpenses)}
                  </h2>
                  <span className="exp-stat-sub">
                    Total for {selectedMonthLabel}
                  </span>
                </div>
                <div className="exp-icon-box exp-icon-red">
                  <TrendingDown size={18} />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="exp-actions-container">
              <div className="exp-action-row-1">
                <button
                  type="button"
                  className="exp-btn-action exp-btn-green"
                  onClick={handleAddExpense}
                >
                  <PlusCircle size={18} />
                  <span>Add New Expense</span>
                </button>

                <button
                  type="button"
                  className="exp-btn-action exp-btn-dark"
                  onClick={() => setIsRecoveryModalOpen(true)}
                >
                  <PlusCircle size={18} />
                  <span>Add Recovery Expense</span>
                </button>
              </div>

              <div className="exp-action-row-2">
                <button
                  type="button"
                  className="exp-btn-action exp-btn-dark"
                  onClick={() => setIsDieselModalOpen(true)}
                >
                  <PlusCircle size={18} />
                  <span>Diesel Expense</span>
                </button>

                <button
                  type="button"
                  className="exp-btn-action exp-btn-dark"
                  onClick={() => setIsOwnerExpenseModalOpen(true)}
                >
                  <PlusCircle size={18} />
                  <span>Add Owner Expense</span>
                </button>

                <button
                  type="button"
                  className="exp-btn-view-categories"
                  onClick={() => setShowCategories(true)}
                >
                  <Tags size={18} />
                  <span>View Categories</span>
                </button>
              </div>
            </div>

            {/* RECENT NORMAL EXPENSES */}
            <RecentExpenses
              expenses={selectedMonthCurrentExpenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingExpenseId={deletingExpenseId}
            />

            {/* PAGINATION */}
            {filteredTotalExpenses > 0 && (
              <div className="exp-pagination">
                <div className="exp-pagination-info">
                  Showing <strong>{selectedMonthCurrentExpenses.length}</strong>{" "}
                  of <strong>{filteredTotalExpenses}</strong> expenses
                </div>

                <div className="exp-pagination-controls">
                  <button
                    type="button"
                    className="exp-pagination-btn"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <div className="exp-pagination-pages">
                    {Array.from(
                      { length: filteredTotalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        className={`exp-pagination-page ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="exp-pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === filteredTotalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <AddNewExpenses
        isOpen={isModalOpen}
        onClose={handleCloseExpenseModal}
        onSuccess={handleExpenseSuccess}
        editingExpense={editingExpense}
      />

      <ExpenseRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        onSubmit={handleRecoveryExpense}
      />

      <AddDieselExpenseModal
        isOpen={isDieselModalOpen}
        onClose={handleCloseDieselModal}
        onSubmit={handleDieselExpense}
        editingExpense={null}
        isSubmitting={isDieselSubmitting}
      />

      <RecordOwnerExpenseModal
        isOpen={isOwnerExpenseModalOpen}
        onClose={() => setIsOwnerExpenseModalOpen(false)}
        onSubmit={handleOwnerExpense}
        owners={owners}
        isSubmitting={isOwnerExpenseSubmitting}
      />

      <AddNewOwnerModal
        isOpen={isAddOwnerModalOpen}
        onClose={() => setIsAddOwnerModalOpen(false)}
        onSubmit={handleAddOwner}
      />
    </div>
  );
};

export default Expenses;
