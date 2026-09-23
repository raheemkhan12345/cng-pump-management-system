import React, { useState } from "react";
import {
  PlusCircle,
  Layers,
  TrendingDown,
  Calendar,
  ArrowRight,
  Banknote,
  Building2,
  Wrench,
  Package,
  Zap,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";

import AddNewExpenses from "../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses";
import RecentExpenses from "./RecentExpense";
import "./Expenses.css";

import ExpenseRecoveryModal from "../../../components/adminDashboardForms/expenseRecoveryModal/ExpenseRecoveryModal";
import AddDieselExpenseModal from "../../../components/adminDashboardForms/addDieselExpenseModal/AddDieselExpenseModal";
import RecordOwnerExpenseModal from "../../../components/adminDashboardForms/recordOwnerExpenseModal/RecordOwnerExpenseModal";
import AddNewOwnerModal from "../../../components/adminDashboardForms/addNewOwnerModal/AddNewOwnerModal";

const Expenses = () => {
  // ==========================================
  // Modal States
  // ==========================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isDieselModalOpen, setIsDieselModalOpen] = useState(false);
  const [isOwnerExpenseModalOpen, setIsOwnerExpenseModalOpen] = useState(false);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);

  
  // ==========================================
  // Expense Stats
  // ==========================================
  const [expenses, setExpenses] = useState([]);

  // Temporary hard-coded data.
  // GET Expense API will be integrated later.
  const expenseStats = {
    todayExpenses: "38,500",
    monthExpenses: "412,000",
    recoveryExpenses: "30,000",
    currentMonth: "August 2026",
  };

  // ==========================================
  // Recent Expenses
  // ==========================================

  

  // ==========================================
  // Expense Successfully Added
  // ==========================================

  const handleExpenseSuccess = (expenseResponse) => {
    console.log("========================================");
    console.log("Expense added successfully!");
    console.log("Expense Response:", expenseResponse);
    console.log("========================================");
  };

  // ==========================================
  // Edit Expense
  // ==========================================

  const handleEdit = (expense) => {
    console.log("Edit Expense:", expense);
  };

  // ==========================================
  // Delete Expense
  // ==========================================

  const handleDelete = (expense) => {
    console.log("Delete Expense:", expense);
  };

  

  return (
    <div className="exp-page-container">
      <div className="exp-content-wrapper">
        {/* ==========================================
            Title & Top Right Action Button
        ========================================== */}

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

        {/* ==========================================
            Top 3 Metric Cards
        ========================================== */}

        <div className="exp-stats-grid">
          {/* Today's Expenses */}

          <div className="exp-stat-card">
            <div className="exp-stat-info">
              <span className="exp-stat-label">
                TODAY'S
                <br />
                EXPENSES
              </span>

              <h2 className="exp-stat-value">
                Rs. {expenseStats.todayExpenses}
              </h2>

              <span className="exp-stat-sub">Total outgoings today</span>
            </div>

            <div className="exp-icon-box exp-icon-red">
              <TrendingDown size={18} />
            </div>
          </div>

          {/* This Month's Expenses */}

          <div className="exp-stat-card">
            <div className="exp-stat-info">
              <span className="exp-stat-label">
                THIS MONTH'S
                <br />
                EXPENSES
              </span>

              <h2 className="exp-stat-value">
                Rs. {expenseStats.monthExpenses}
              </h2>

              <span className="exp-stat-sub">
                Total for {expenseStats.currentMonth}
              </span>
            </div>

            <div className="exp-icon-box exp-icon-blue">
              <Calendar size={18} />
            </div>
          </div>

          {/* Recovery Expenses */}

          <div className="exp-stat-card">
            <div className="exp-stat-info">
              <span className="exp-stat-label">RECOVERY EXPENSES</span>

              <h2 className="exp-stat-value">
                Rs. {expenseStats.recoveryExpenses}
              </h2>
            </div>

            <div className="exp-icon-box exp-icon-red">
              <TrendingDown size={18} />
            </div>
          </div>
        </div>

        {/* ==========================================
            Action Buttons Grid Section
        ========================================== */}

        <div className="exp-actions-container">
          {/* Row 1 */}

          <div className="exp-action-row-1">
            <button
              type="button"
              className="exp-btn-action exp-btn-green"
              onClick={() => setIsModalOpen(true)}
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

            <button
              type="button"
              className="exp-btn-action exp-btn-outline"
              
            >
              <Layers size={18} />

              <span>View Expense Categories</span>
            </button>
          </div>

          {/* Row 2 */}

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

        {/* ==========================================
            Recent Expenses Table
        ========================================== */}

        <RecentExpenses 
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        />
      </div>

      {/* ==========================================
          Add New Expense Modal
      ========================================== */}

      <AddNewExpenses
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleExpenseSuccess}
      />

      {/* ==========================================
          Add New Recovery Expense Modal
      ========================================== */}

      <ExpenseRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        onSubmit={(data) => console.log("Recovery Data:", data)}
      />

      {/* ==========================================
          Add Diesel Expense Modal
      ========================================== */}

      <AddDieselExpenseModal
        isOpen={isDieselModalOpen}
        onClose={() => setIsDieselModalOpen(false)}
        onSubmit={(data) => console.log("Diesel Expense Data:", data)}
      />

      {/* ==========================================
          Record Owner Expense Modal
      ========================================== */}

      <RecordOwnerExpenseModal
        isOpen={isOwnerExpenseModalOpen}
        onClose={() => setIsOwnerExpenseModalOpen(false)}
        onSubmit={(data) => console.log("Owner Expense Data:", data)}
      />

      {/* ==========================================
          Add New Owner Modal
      ========================================== */}

      <AddNewOwnerModal
        isOpen={isAddOwnerModalOpen}
        onClose={() => setIsAddOwnerModalOpen(false)}
        onSubmit={(data) => console.log("New Owner Data:", data)}
      />
    </div>
  );
};

export default Expenses;
