import React, { useMemo } from "react";
import { Folder } from "lucide-react";
import "./ExpenseCategoryCards.css";

const ExpenseCategoryCards = ({ expenses = [], onSelectCategory }) => {
  const categoryTotals = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return [];
    }

    const totalsMap = expenses.reduce((acc, expense) => {
      let categoryName = "Uncategorized";

      const catField = expense?.category;

      if (typeof catField === "string") {
        categoryName = catField.trim() || "Uncategorized";
      } else if (typeof catField === "object" && catField !== null) {
        // If populated from backend as an object
        categoryName =
          catField?.name ||
          catField?.title ||
          catField?.categoryName ||
          "Uncategorized";
      } else if (expense?.categoryName) {
        categoryName = String(expense.categoryName).trim();
      }

      const amount =
        Number(
          expense?.amount ??
            expense?.totalAmount ??
            expense?.expenseAmount ??
            0,
        ) || 0;

      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(totalsMap).map(([category, totalAmount]) => ({
      category,
      totalAmount,
    }));
  }, [expenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(amount);
  };

  if (categoryTotals.length === 0) {
    return (
      <div className="category-empty-state">
        <p>No expense category data available for this period.</p>
      </div>
    );
  }

  return (
    <div className="category-cards-grid">
      {categoryTotals.map(({ category, totalAmount }) => (
        <div
          key={category}
          className="category-card"
          onClick={() => onSelectCategory && onSelectCategory(category)}
          style={{ cursor: "pointer" }}
        >
          <div className="category-card-header">
            <span className="category-card-title">{category}</span>
            <div className="category-card-icon">
              <Folder size={18} />
            </div>
          </div>

          <div className="category-card-divider" />

          <div className="category-card-body">
            <h2 className="category-card-amount">
              Rs. {formatCurrency(totalAmount)}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseCategoryCards;
