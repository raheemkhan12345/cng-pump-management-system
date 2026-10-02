import React from "react";
import {
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

import "./RecentExpense.css";

const RecentExpenses = ({ expenses = [], onEdit, onDelete }) => {
  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Get Category Name Safely
  // ==========================================

  const getCategoryName = (category) => {
    if (typeof category === "string") {
      return category;
    }

    if (category && typeof category === "object") {
      return (
        category.name ||
        category.title ||
        category.categoryName ||
        category.label ||
        ""
      );
    }

    return "";
  };

  // ==========================================
  // Get Payment Method Safely
  // ==========================================

  const getPaymentMethod = (paymentMethod, paymentMode) => {
    const value = paymentMethod ?? paymentMode;

    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.paymentMethod ||
        value.paymentMode ||
        value.label ||
        ""
      );
    }

    return "";
  };

  // ==========================================
  // Category Icons
  // ==========================================

  const getCategoryIcon = (category) => {
    const categoryName = getCategoryName(category).toLowerCase();

    if (!categoryName) {
      return Package;
    }

    if (
      categoryName.includes("maintenance") ||
      categoryName.includes("repair") ||
      categoryName.includes("service")
    ) {
      return Wrench;
    }

    if (
      categoryName.includes("utility") ||
      categoryName.includes("electric") ||
      categoryName.includes("electricity")
    ) {
      return Zap;
    }

    if (
      categoryName.includes("staff") ||
      categoryName.includes("salary") ||
      categoryName.includes("employee")
    ) {
      return Users;
    }

    if (
      categoryName.includes("supplies") ||
      categoryName.includes("supply") ||
      categoryName.includes("material")
    ) {
      return Package;
    }

    return Package;
  };

  return (
    <div className="exp-table-card">
      {/* ==========================================
          Header
      ========================================== */}

      <div className="exp-table-header">
        <h3 className="exp-table-title">Recent Expenses</h3>
      </div>

      {/* ==========================================
          Table
      ========================================== */}

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
              <th className="exp-text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                const CategoryIcon = getCategoryIcon(expense.category);

                const categoryName = getCategoryName(expense.category);

                const paymentMethod = getPaymentMethod(
                  expense.paymentMethod,
                  expense.paymentMode,
                );

                return (
                  <tr key={expense._id || expense.id}>
                    {/* Date */}

                    <td className="exp-text-muted">
                      {formatDate(expense.date)}
                    </td>

                    {/* Category */}

                    <td>
                      <span className="exp-category-badge">
                        <CategoryIcon size={14} />

                        <span>{categoryName || "-"}</span>
                      </span>
                    </td>

                    {/* Details */}

                    <td className="exp-font-medium">
                      {expense.details ||
                        expense.remarks ||
                        expense.description ||
                        "-"}
                    </td>

                    {/* Amount */}

                    <td className="exp-font-bold">
                      Rs. {expense.amount ?? "0"}
                    </td>

                    {/* Payment Method */}

                    <td className="exp-text-muted">
                      <div className="exp-payment-method">
                        {paymentMethod.toLowerCase() === "cash" ? (
                          <Banknote size={15} />
                        ) : (
                          <Building2 size={15} />
                        )}

                        <span>{paymentMethod || "-"}</span>
                      </div>
                    </td>

                    {/* Status */}

                    <td>
                      <span className="exp-status-paid">
                        {expense.status || "-"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="exp-actions-cell">
                      {/* Edit */}

                      <button
                        type="button"
                        className="exp-action-btn exp-edit-btn"
                        title="Edit"
                        aria-label={`Edit ${
                          expense.details || expense.description || "expense"
                        }`}
                        onClick={() => onEdit?.(expense)}
                      >
                        <Pencil size={11} />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        className="exp-action-btn exp-delete-btn"
                        title="Delete"
                        aria-label={`Delete ${
                          expense.details || expense.description || "expense"
                        }`}
                        onClick={() => onDelete?.(expense)}
                      >
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="exp-empty-state">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExpenses;
