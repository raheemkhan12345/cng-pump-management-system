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
  Fuel,
  UserPlus,
  Receipt,
} from "lucide-react";
import AddNewExpenses from "../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses";
import "./Expenses.css";
import ExpenseRecoveryModal from "../../../components/adminDashboardForms/expenseRecoveryModal/ExpenseRecoveryModal";
import AddDieselExpenseModal from "../../../components/adminDashboardForms/addDieselExpenseModal/AddDieselExpenseModal";
import RecordOwnerExpenseModal from "../../../components/adminDashboardForms/recordOwnerExpenseModal/RecordOwnerExpenseModal";

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isDieselModalOpen, setIsDieselModalOpen] = useState(false);
  const [isOwnerExpenseModalOpen, setIsOwnerExpenseModalOpen] = useState(false);

  const expenseStats = {
    todayExpenses: "38,500",
    monthExpenses: "412,000",
    recoveryExpenses: "30,000",
    currentMonth: "August 2026",
  };

  const recentExpenses = [
    {
      id: 1,
      date: "16-08-2026",
      category: "Supplies",
      categoryIcon: Package,
      details: "Cleaning Materials",
      amount: "2,200",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: 2,
      date: "19-08-2026",
      category: "Utility",
      categoryIcon: Zap,
      details: "Electricity Bill (Aug)",
      amount: "12,000",
      paymentMethod: "Bank",
      status: "Paid",
    },
    {
      id: 3,
      date: "18-08-2026",
      category: "Maintenance",
      categoryIcon: Wrench,
      details: "Compressor Service",
      amount: "5,000",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: 4,
      date: "17-08-2026",
      category: "Staff",
      categoryIcon: Users,
      details: "Tea & Refreshments",
      amount: "1,500",
      paymentMethod: "Cash",
      status: "Paid",
    },
  ];

  return (
    <div className="exp-page-container">
      <div className="exp-content-wrapper">
        {/* Title & Top Right Action Button */}
        <div className="exp-title-row">
          <div className="exp-title-section">
            <h1 className="exp-page-title">Expenses</h1>
            <p className="exp-page-subtitle">
              Manage and track station operational costs.
            </p>
          </div>
          <button className="exp-btn-add-owners">
            <PlusCircle size={18} />
            <span>Add Owners</span>
          </button>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="exp-stats-grid">
          {/* Card 1: Today's Expenses */}
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

          {/* Card 2: This Month's Expenses */}
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

          {/* Card 3: Recovery Expenses */}
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

        {/* Action Buttons Grid Section */}
        <div className="exp-actions-container">
          {/* Row 1 Buttons */}
          <div className="exp-action-row-1">
            <button
              className="exp-btn-action exp-btn-green"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Add New Expense</span>
            </button>

            <button
              className="exp-btn-action exp-btn-dark"
              onClick={() => setIsRecoveryModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Add Recovery Expense</span>
            </button>

            <button
              className="exp-btn-action exp-btn-outline"
              onClick={() => setIsOwnerExpenseModalOpen(true)}
            >
              <Layers size={18} />
              <span>View Expense Categories</span>
            </button>
          </div>

          {/* Row 2 Buttons */}
          <div className="exp-action-row-2">
            <button
              className="exp-btn-action exp-btn-dark"
              onClick={() => setIsDieselModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Diesel Expense</span>
            </button>

            <button
              className="exp-btn-action exp-btn-dark"
              onClick={() => setIsOwnerExpenseModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Add Owner Expense</span>
            </button>
          </div>
        </div>

        {/* Recent Expenses Table Card */}
        <div className="exp-table-card">
          <div className="exp-table-header">
            <h3 className="exp-table-title">Recent Expenses</h3>
            <button className="exp-btn-view-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="exp-table-wrapper">
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th className="exp-text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => {
                  const CategoryIcon = expense.categoryIcon;
                  return (
                    <tr key={expense.id}>
                      <td className="exp-text-muted">{expense.date}</td>
                      <td>
                        <span className="exp-category-badge">
                          <CategoryIcon size={14} />
                          <span>{expense.category}</span>
                        </span>
                      </td>
                      <td className="exp-font-medium">{expense.details}</td>
                      <td className="exp-font-bold">Rs. {expense.amount}</td>
                      <td className="exp-text-muted">
                        <div className="exp-payment-method">
                          {expense.paymentMethod === "Cash" ? (
                            <Banknote size={15} />
                          ) : (
                            <Building2 size={15} />
                          )}
                          <span>{expense.paymentMethod}</span>
                        </div>
                      </td>
                      <td>
                        <span className="exp-status-paid">
                          {expense.status}
                        </span>
                      </td>
                      <td className="exp-text-center"></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Expense Modal */}
      <AddNewExpenses
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Add New Recovery Expense Modal */}
      <ExpenseRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        onSubmit={(data) => console.log("Recovery Data:", data)}
      />
      <AddDieselExpenseModal
        isOpen={isDieselModalOpen}
        onClose={() => setIsDieselModalOpen(false)}
        onSubmit={(data) => console.log("Diesel Expense Data:", data)}
      />

      <RecordOwnerExpenseModal
        isOpen={isOwnerExpenseModalOpen}
        onClose={() => setIsOwnerExpenseModalOpen(false)}
        onSubmit={(data) => console.log("Owner Expense Data:", data)}
      />
    </div>
  );
};

export default Expenses;
