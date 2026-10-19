import React, { useMemo } from "react";
import { ArrowLeft, Edit3, Trash2, Calendar, Filter } from "lucide-react";
import "./CategoryExpenseDetail.css";

const CategoryExpenseDetail = ({
  categoryName,
  expenses = [],
  selectedMonthLabel,
  onBack,
  onEdit,
  onDelete,
  deletingExpenseId,
}) => {
  // Filter expenses strictly belonging to this selected category.
  const filteredCategoryExpenses = useMemo(() => {
    return expenses.filter((expense) => {
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
        currentCatName.toLowerCase() === String(categoryName).toLowerCase()
      );
    });
  }, [expenses, categoryName]);

  // Calculate the total amount for this category.
  const totalAmount = useMemo(() => {
    return filteredCategoryExpenses.reduce((sum, item) => {
      const amount =
        Number(item?.amount ?? item?.totalAmount ?? item?.expenseAmount ?? 0) ||
        0;
      return sum + amount;
    }, 0);
  }, [filteredCategoryExpenses]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK").format(Number(amount) || 0);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return String(dateValue).split("T")[0];
  };

  return (
    <div className="cat-detail-wrapper">
      <div className="cat-detail-title-row">
        <div className="cat-detail-title-section">
          <h1 className="cat-detail-page-title">{categoryName} Expenses</h1>
          <p className="cat-detail-page-subtitle">
            Manage and view detailed operational costs for{" "}
            <strong>{categoryName}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="cat-detail-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          <span>Back to Categories</span>
        </button>
      </div>

      <div className="cat-detail-selected-month">
        <Calendar size={16} />
        <span>
          Showing data for <strong>{selectedMonthLabel}</strong>
        </span>
      </div>

      <div className="cat-detail-stats-grid">
        <div className="cat-detail-stat-card">
          <div className="cat-detail-stat-info">
            <span className="cat-detail-stat-label">
              TOTAL {categoryName.toUpperCase()} SPENT
            </span>
            <h2 className="cat-detail-stat-value">
              Rs. {formatCurrency(totalAmount)}
            </h2>
            <span className="cat-detail-stat-sub">
              Total for {selectedMonthLabel}
            </span>
          </div>
        </div>

        <div className="cat-detail-stat-card">
          <div className="cat-detail-stat-info">
            <span className="cat-detail-stat-label">TRANSACTIONS COUNT</span>
            <h2 className="cat-detail-stat-value">
              {filteredCategoryExpenses.length}
            </h2>
            <span className="cat-detail-stat-sub">Total entries logged</span>
          </div>
        </div>
      </div>

      <div className="cat-detail-table-card">
        <div className="cat-detail-table-header">
          <h3 className="cat-detail-table-title">
            {selectedMonthLabel} {categoryName} Transactions
          </h3>
          <button
            type="button"
            className="cat-detail-filter-button"
            aria-label="Filter transactions"
          >
            <Filter size={18} />
          </button>
        </div>

        <div className="cat-detail-table-scroll">
          <table className="cat-detail-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Mode</th>
                <th>Remarks / Details</th>
                <th>Amount (Rs.)</th>
                <th>Status</th>
                <th className="cat-detail-actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategoryExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="cat-detail-empty">
                    No expense transactions found for {categoryName} in{" "}
                    {selectedMonthLabel}.
                  </td>
                </tr>
              ) : (
                filteredCategoryExpenses.map((expense) => {
                  const id = expense?._id || expense?.id;
                  const isDeleting = deletingExpenseId === id;
                  const isPaid =
                    String(expense?.status).toLowerCase() === "paid";

                  return (
                    <tr key={id} className="cat-detail-table-row">
                      <td>
                        {formatDate(
                          expense?.date ||
                            expense?.expenseDate ||
                            expense?.createdAt,
                        )}
                      </td>
                      <td>
                        {expense?.paymentMode ||
                          expense?.paymentMethod ||
                          "Cash Account"}
                      </td>
                      <td>
                        {expense?.remarks ||
                          expense?.details ||
                          expense?.description ||
                          "-"}
                      </td>
                      <td className="cat-detail-amount-cell">
                        Rs.{" "}
                        {formatCurrency(
                          expense?.amount ?? expense?.totalAmount ?? 0,
                        )}
                      </td>
                      <td>
                        <span
                          className={`cat-detail-status-pill ${
                            isPaid
                              ? "cat-detail-status-paid"
                              : "cat-detail-status-pending"
                          }`}
                        >
                          {expense?.status || "Paid"}
                        </span>
                      </td>
                      <td className="cat-detail-actions-cell">
                        <div className="cat-detail-row-actions">
                          <button
                            type="button"
                            className="cat-detail-icon-button"
                            onClick={() => onEdit && onEdit(expense)}
                            aria-label="Edit expense"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            className="cat-detail-icon-button cat-detail-delete-button"
                            onClick={() => onDelete && onDelete(expense)}
                            disabled={isDeleting}
                            aria-label="Delete expense"
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
  );
};

export default CategoryExpenseDetail;
