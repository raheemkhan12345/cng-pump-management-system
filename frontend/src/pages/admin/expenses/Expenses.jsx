import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusCircle, Layers, TrendingDown, Calendar } from "lucide-react";

import AddNewExpenses from "../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses";
import RecentExpenses from "./RecentExpense";

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
} from "../../../services/adminApis/expenseApi";

import "./Expenses.css";

const Expenses = () => {
  // =========================================================
  // MODAL STATES
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isDieselModalOpen, setIsDieselModalOpen] = useState(false);
  const [isOwnerExpenseModalOpen, setIsOwnerExpenseModalOpen] = useState(false);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);

  // =========================================================
  // EDIT EXPENSE
  // =========================================================

  const [editingExpense, setEditingExpense] = useState(null);

  // =========================================================
  // ALL EXPENSE DATA
  // Backend returns all expenses.
  // Frontend handles pagination.
  // =========================================================

  const [allExpenses, setAllExpenses] = useState([]);

  // =========================================================
  // RECOVERY EXPENSE DATA
  // =========================================================

  const [recoveryExpensesData, setRecoveryExpensesData] = useState([]);

  // =========================================================
  // OWNER DATA
  // Owners are loaded from backend.
  // =========================================================

  const [owners, setOwners] = useState([]);

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // DELETE STATE
  // =========================================================

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  // =========================================================
  // FRONTEND PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // Number of records displayed per page
  const pageSize = 5;

  // =========================================================
  // GET ALL NORMAL EXPENSES
  // FRONTEND PAGINATION
  // =========================================================

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getExpenses();

      console.log("========================================");
      console.log("GET EXPENSE API RESPONSE:", response);
      console.log("========================================");

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

      console.log("ALL EXPENSE DATA:", expenseData);
      console.log("TOTAL EXPENSES:", expenseData.length);

      setAllExpenses(expenseData);

      const calculatedTotalPages = Math.max(
        Math.ceil(expenseData.length / pageSize),
        1,
      );

      setCurrentPage((previousPage) =>
        Math.min(previousPage, calculatedTotalPages),
      );
    } catch (error) {
      console.error("Failed to fetch expenses:", error);

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

      console.log("========================================");
      console.log("GET RECOVERY EXPENSE API RESPONSE:", response);
      console.log("========================================");

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

      console.log("FINAL RECOVERY EXPENSE DATA:", recoveryData);

      setRecoveryExpensesData(recoveryData);
    } catch (error) {
      console.error("Failed to fetch recovery expenses:", error);

      console.error(
        "Recovery API Response:",
        JSON.stringify(error?.response?.data, null, 2),
      );

      setRecoveryExpensesData([]);
    }
  }, []);

  // =========================================================
  // GET ALL OWNERS
  // GET /ownerexpense/getOwner
  // =========================================================

  const fetchOwners = useCallback(async () => {
    try {
      console.log("========================================");
      console.log("GET OWNERS");
      console.log("GET OWNER API REQUEST");
      console.log("========================================");

      const response = await getOwners();

      console.log("========================================");
      console.log("GET OWNER API RESPONSE:", response);
      console.log("========================================");

      let ownerData = [];

      // -------------------------------------------------------
      // HANDLE DIFFERENT POSSIBLE RESPONSE STRUCTURES
      // -------------------------------------------------------

      if (Array.isArray(response?.data)) {
        ownerData = response.data;
      } else if (Array.isArray(response?.owners)) {
        ownerData = response.owners;
      } else if (Array.isArray(response?.owner)) {
        ownerData = response.owner;
      } else if (Array.isArray(response?.data?.owners)) {
        ownerData = response.data.owners;
      } else if (Array.isArray(response)) {
        ownerData = response;
      }

      console.log("FINAL OWNER DATA:", ownerData);

      console.log("TOTAL OWNERS:", ownerData.length);

      setOwners(ownerData);
    } catch (error) {
      console.error("========================================");
      console.error("FAILED TO GET OWNERS");
      console.error("ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error(
        "SERVER RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2),
      );
      console.error("========================================");

      setOwners([]);
    }
  }, []);

  // =========================================================
  // LOAD DATA ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchRecoveryExpenses();
  }, [fetchRecoveryExpenses]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // =========================================================
  // FRONTEND PAGINATION CALCULATIONS
  // =========================================================

  const totalExpenses = allExpenses.length;

  const totalPages = Math.max(Math.ceil(totalExpenses / pageSize), 1);

  // =========================================================
  // GET ONLY CURRENT PAGE EXPENSES
  // =========================================================

  const expenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return allExpenses.slice(startIndex, endIndex);
  }, [allExpenses, currentPage]);

  // =========================================================
  // GET NORMAL EXPENSE AMOUNT
  // =========================================================

  const getAmount = (expense) => {
    return (
      Number(
        expense?.amount ?? expense?.totalAmount ?? expense?.expenseAmount ?? 0,
      ) || 0
    );
  };

  // =========================================================
  // GET EXPENSE DATE
  // =========================================================

  const getDate = (expense) => {
    return expense?.date || expense?.expenseDate || expense?.createdAt || "";
  };

  // =========================================================
  // GET DATE ONLY
  // =========================================================

  const getDateOnly = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const dateString = String(dateValue);

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
  // CURRENT DATE
  // =========================================================

  const today = new Date();

  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const currentYear = today.getFullYear();

  const currentMonthNumber = today.getMonth() + 1;

  // =========================================================
  // TODAY'S EXPENSES
  // =========================================================

  const todayExpenses = allExpenses
    .filter((expense) => {
      return getDateOnly(getDate(expense)) === todayDate;
    })
    .reduce((total, expense) => {
      return total + getAmount(expense);
    }, 0);

  // =========================================================
  // CURRENT MONTH EXPENSES
  // =========================================================

  const monthExpenses = allExpenses
    .filter((expense) => {
      const expenseDate = getDateOnly(getDate(expense));

      if (!expenseDate) {
        return false;
      }

      const [year, month] = expenseDate.split("-").map(Number);

      return year === currentYear && month === currentMonthNumber;
    })
    .reduce((total, expense) => {
      return total + getAmount(expense);
    }, 0);

  // =========================================================
  // RECOVERY EXPENSE TOTAL
  // =========================================================

  const recoveryExpenses = recoveryExpensesData.reduce((total, recovery) => {
    const amount =
      Number(
        recovery?.recoveryAmount ??
          recovery?.amount ??
          recovery?.totalAmount ??
          0,
      ) || 0;

    return total + amount;
  }, 0);

  // =========================================================
  // CURRENT MONTH LABEL
  // =========================================================

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(today);

  // =========================================================
  // CURRENCY FORMAT
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // PAGINATION HANDLERS
  // =========================================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // =========================================================
  // ADD EXPENSE
  // =========================================================

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  // =========================================================
  // EXPENSE SUCCESS
  // =========================================================

  const handleExpenseSuccess = async (expenseResponse) => {
    console.log("========================================");
    console.log("EXPENSE OPERATION SUCCESSFUL");
    console.log("EXPENSE RESPONSE:", expenseResponse);
    console.log("========================================");

    setIsModalOpen(false);
    setEditingExpense(null);

    await fetchExpenses();
  };

  // =========================================================
  // EDIT EXPENSE
  // =========================================================

  const handleEdit = (expense) => {
    console.log("========================================");
    console.log("EDIT EXPENSE");
    console.log("EXPENSE:", expense);
    console.log("========================================");

    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  // =========================================================
  // DELETE EXPENSE
  // =========================================================

  const handleDelete = async (expense) => {
    const expenseId = expense?._id || expense?.id || expense?.expenseId;

    if (!expenseId) {
      console.error("Delete Expense Error: Expense ID is missing.", expense);

      window.alert("Expense ID is missing. Cannot delete this expense.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingExpenseId(expenseId);

      console.log("========================================");
      console.log("DELETE EXPENSE");
      console.log("EXPENSE ID:", expenseId);
      console.log("DELETE URL:", `/expense/${expenseId}`);
      console.log("========================================");

      const response = await deleteExpense(expenseId);

      console.log("========================================");
      console.log("EXPENSE DELETED SUCCESSFULLY");
      console.log("DELETE RESPONSE:", response);
      console.log("========================================");

      await fetchExpenses();
    } catch (error) {
      console.error("========================================");
      console.error("FAILED TO DELETE EXPENSE");
      console.error("DELETE ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error("SERVER RESPONSE:", error?.response?.data);
      console.error("RESPONSE MESSAGE:", error?.response?.data?.message);
      console.error("========================================");

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete expense.";

      window.alert(errorMessage);
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // =========================================================
  // CREATE RECOVERY EXPENSE
  // =========================================================

  const handleRecoveryExpense = async (data) => {
    try {
      console.log("========================================");
      console.log("CREATE RECOVERY EXPENSE");
      console.log("RECOVERY FORM DATA:", data);
      console.log("========================================");

      const recoveryExpenseData = {
        date: data?.date,
        category: data?.category,
        recoveryAmount: Number(data?.recoveryAmount),
        remarks: data?.remarks,
        paymentMode: data?.paymentMode,
      };

      console.log(
        "RECOVERY API REQUEST:",
        JSON.stringify(recoveryExpenseData, null, 2),
      );

      const response = await createRecoveryExpense(recoveryExpenseData);

      console.log("========================================");
      console.log("RECOVERY EXPENSE CREATED SUCCESSFULLY");
      console.log("RECOVERY RESPONSE:", response);
      console.log("========================================");

      setIsRecoveryModalOpen(false);

      await Promise.all([fetchExpenses(), fetchRecoveryExpenses()]);
    } catch (error) {
      console.error("========================================");
      console.error("FAILED TO CREATE RECOVERY EXPENSE");
      console.error("ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error(
        "SERVER RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2),
      );
      console.error("========================================");

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create recovery expense.";

      window.alert(errorMessage);
    }
  };

  // =========================================================
  // CLOSE EXPENSE MODAL
  // =========================================================

  const handleCloseExpenseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  // =========================================================
  // CREATE DIESEL EXPENSE
  // =========================================================

  const handleDieselExpense = async (data) => {
    try {
      console.log("========================================");
      console.log("CREATE DIESEL EXPENSE");
      console.log("DIESEL FORM DATA:", data);
      console.log("========================================");

      const dieselExpenseData = {
        date: data?.date,
        dieselQuantity: Number(data?.dieselQuantity),
        amount: Number(data?.amount),
        remarks: data?.remarks,
      };

      console.log(
        "DIESEL API REQUEST:",
        JSON.stringify(dieselExpenseData, null, 2),
      );

      const response = await createDieselExpense(dieselExpenseData);

      console.log("========================================");
      console.log("DIESEL EXPENSE CREATED SUCCESSFULLY");
      console.log("DIESEL RESPONSE:", response);
      console.log("========================================");

      setIsDieselModalOpen(false);

      await fetchExpenses();
    } catch (error) {
      console.error("========================================");
      console.error("FAILED TO CREATE DIESEL EXPENSE");
      console.error("ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error(
        "SERVER RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2),
      );
      console.error("========================================");

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create diesel expense.";

      window.alert(errorMessage);
    }
  };

  // =========================================================
  // CREATE NEW OWNER
  // =========================================================

  const handleAddOwner = async (data) => {
    try {
      console.log("========================================");
      console.log("CREATE NEW OWNER");
      console.log("OWNER FORM DATA:", data);
      console.log("========================================");

      const ownerData = {
        ownerName: data?.ownerName?.trim(),
      };

      console.log("OWNER API REQUEST:", JSON.stringify(ownerData, null, 2));

      const response = await createOwner(ownerData);

      console.log("========================================");
      console.log("OWNER CREATED SUCCESSFULLY");
      console.log("OWNER RESPONSE:", response);
      console.log("========================================");

      setIsAddOwnerModalOpen(false);

      // -----------------------------------------------------
      // Refresh owner dropdown
      // -----------------------------------------------------

      await fetchOwners();
    } catch (error) {
      console.error("========================================");
      console.error("FAILED TO CREATE OWNER");
      console.error("ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error(
        "SERVER RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2),
      );
      console.error("========================================");

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create owner.";

      window.alert(errorMessage);
    }
  };

  // =========================================================
  // LOADING STATE
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

  // =========================================================
  // ERROR STATE
  // =========================================================

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
  // MAIN UI
  // =========================================================

  return (
    <div className="exp-page-container">
      <div className="exp-content-wrapper">
        {/* ===================================================
            TITLE
        ==================================================== */}

        <div className="exp-title-row">
          <div className="exp-title-section">
            <h1 className="exp-page-title">Expenses</h1>

            <p className="exp-page-subtitle">
              Manage and track station operational costs.
            </p>
          </div>

          <button
            type="button"
            className="exp-btn-add-owners"
            onClick={() => setIsAddOwnerModalOpen(true)}
          >
            <PlusCircle size={18} />

            <span>Add Owners</span>
          </button>
        </div>

        {/* ===================================================
            EXPENSE STATS
        ==================================================== */}

        <div className="exp-stats-grid">
          {/* TODAY'S EXPENSES */}

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

          {/* THIS MONTH'S EXPENSES */}

          <div className="exp-stat-card">
            <div className="exp-stat-info">
              <span className="exp-stat-label">
                THIS MONTH'S
                <br />
                EXPENSES
              </span>

              <h2 className="exp-stat-value">
                Rs. {formatCurrency(monthExpenses)}
              </h2>

              <span className="exp-stat-sub">Total for {currentMonth}</span>
            </div>

            <div className="exp-icon-box exp-icon-blue">
              <Calendar size={18} />
            </div>
          </div>

          {/* RECOVERY EXPENSES */}

          <div className="exp-stat-card">
            <div className="exp-stat-info">
              <span className="exp-stat-label">RECOVERY EXPENSES</span>

              <h2 className="exp-stat-value">
                Rs. {formatCurrency(recoveryExpenses)}
              </h2>
            </div>

            <div className="exp-icon-box exp-icon-red">
              <TrendingDown size={18} />
            </div>
          </div>
        </div>

        {/* ===================================================
            ACTION BUTTONS
        ==================================================== */}

        <div className="exp-actions-container">
          {/* ROW 1 */}

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

            <button type="button" className="exp-btn-action exp-btn-outline">
              <Layers size={18} />

              <span>View Expense Categories</span>
            </button>
          </div>

          {/* ROW 2 */}

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
          </div>
        </div>

        {/* ===================================================
            RECENT EXPENSES
        ==================================================== */}

        <RecentExpenses
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingExpenseId={deletingExpenseId}
        />

        {/* ===================================================
            PAGINATION
        ==================================================== */}

        {totalExpenses > 0 && (
          <div className="exp-pagination">
            <div className="exp-pagination-info">
              Showing <strong>{expenses.length}</strong> of{" "}
              <strong>{totalExpenses}</strong> expenses
            </div>

            <div className="exp-pagination-controls">
              {/* PREVIOUS */}

              <button
                type="button"
                className="exp-pagination-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}

              <div className="exp-pagination-pages">
                {Array.from(
                  {
                    length: totalPages,
                  },
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

              {/* NEXT */}

              <button
                type="button"
                className="exp-pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT EXPENSE MODAL
      ====================================================== */}

      <AddNewExpenses
        isOpen={isModalOpen}
        onClose={handleCloseExpenseModal}
        onSuccess={handleExpenseSuccess}
        editingExpense={editingExpense}
      />

      {/* =====================================================
          RECOVERY EXPENSE MODAL
      ====================================================== */}

      <ExpenseRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        onSubmit={handleRecoveryExpense}
      />

      {/* =====================================================
          DIESEL EXPENSE MODAL
      ====================================================== */}

      <AddDieselExpenseModal
        isOpen={isDieselModalOpen}
        onClose={() => setIsDieselModalOpen(false)}
        onSubmit={handleDieselExpense}
      />

      {/* =====================================================
          OWNER EXPENSE MODAL
      ====================================================== */}

      <RecordOwnerExpenseModal
        isOpen={isOwnerExpenseModalOpen}
        onClose={() => setIsOwnerExpenseModalOpen(false)}
        onSubmit={(data) => {
          console.log("Owner Expense Data:", data);
        }}
        owners={owners}
      />

      {/* =====================================================
          ADD OWNER MODAL
      ====================================================== */}

      <AddNewOwnerModal
        isOpen={isAddOwnerModalOpen}
        onClose={() => setIsAddOwnerModalOpen(false)}
        onSubmit={handleAddOwner}
      />
    </div>
  );
};

export default Expenses;
