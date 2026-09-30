import { useEffect, useState } from "react";
import { getOwnerExpenses } from "../../../services/adminApis/expenseApi";
import "./OwnerExpenses.css";

// =========================================================
// HELPERS
// =========================================================

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  return new Intl.NumberFormat("en-PK").format(Number(value) || 0);
};

const formatDate = (date) => {
  if (!date) return "-";

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

const getOwnerId = (owner) => {
  if (!owner) return "";

  if (typeof owner === "string") {
    return owner;
  }

  return owner._id || owner.id || owner.ownerId || "";
};

const getOwnerName = (owner) => {
  if (!owner) return "Unknown Owner";

  if (typeof owner === "string") {
    return owner;
  }

  return (
    owner.ownerName ||
    owner.name ||
    owner.fullName ||
    owner.owner ||
    "Unknown Owner"
  );
};

const getOwnerInitial = (name) => {
  if (!name) return "?";

  return name.trim().charAt(0).toUpperCase();
};

const getCategoryClass = (category) => {
  if (!category) return "tag-drawing";

  const normalizedCategory = String(category).toLowerCase();

  if (normalizedCategory.includes("business")) {
    return "tag-business";
  }

  if (normalizedCategory.includes("personal")) {
    return "tag-personal";
  }

  return "tag-drawing";
};

// =========================================================
// GET PAYMENT MODE
// =========================================================

const getPaymentMode = (expense) => {
  const paymentMode =
    expense?.paymentMode || expense?.account || expense?.pool || "";

  if (!paymentMode) {
    return "";
  }

  const normalizedPaymentMode = String(paymentMode).toLowerCase();

  if (normalizedPaymentMode.includes("cash")) {
    return "Cash Account";
  }

  if (normalizedPaymentMode.includes("bank")) {
    return "Bank Account";
  }

  return paymentMode;
};

// =========================================================
// COMPONENT
// =========================================================

const OwnerExpenses = () => {
  const [ownerExpenses, setOwnerExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH OWNER EXPENSES
  // =========================================================

  const fetchOwnerExpenses = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getOwnerExpenses();

      // -------------------------------------------------------
      // Extract API array safely
      // -------------------------------------------------------

      let expenses = [];

      if (Array.isArray(response)) {
        expenses = response;
      } else if (Array.isArray(response?.data)) {
        expenses = response.data;
      } else if (Array.isArray(response?.ownerExpenses)) {
        expenses = response.ownerExpenses;
      } else if (Array.isArray(response?.owners)) {
        expenses = response.owners;
      } else if (Array.isArray(response?.expenses)) {
        expenses = response.expenses;
      } else if (Array.isArray(response?.data?.ownerExpenses)) {
        expenses = response.data.ownerExpenses;
      } else if (Array.isArray(response?.data?.owners)) {
        expenses = response.data.owners;
      } else if (Array.isArray(response?.data?.expenses)) {
        expenses = response.data.expenses;
      }

      setOwnerExpenses(expenses);
    } catch (error) {
      // Keep error logging for debugging
      console.error("========================================");
      console.error("FAILED TO GET OWNER EXPENSES");
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
        "Failed to load owner expenses.";

      setError(errorMessage);
      setOwnerExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerExpenses();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="owner-expenses-container">
        <div className="section-header">
          <h1 className="section-title">Owner Expenses</h1>

          <p className="section-subtitle">
            Track and manage individual owner withdrawals and business expenses.
          </p>
        </div>

        <div className="owner-expenses-loading">Loading owner expenses...</div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="owner-expenses-container">
        <div className="section-header">
          <h1 className="section-title">Owner Expenses</h1>

          <p className="section-subtitle">
            Track and manage individual owner withdrawals and business expenses.
          </p>
        </div>

        <div className="owner-expenses-error">
          <p>{error}</p>

          <button type="button" onClick={fetchOwnerExpenses}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // GROUP EXPENSES BY OWNER
  // =========================================================

  const ownersMap = {};

  ownerExpenses.forEach((expense) => {
    const owner =
      expense?.owner ||
      expense?.ownerId ||
      expense?.ownerData ||
      expense?.user ||
      null;

    const ownerId = getOwnerId(owner);

    if (!ownerId) {
      return;
    }

    // -------------------------------------------------------
    // Create Owner
    // -------------------------------------------------------

    if (!ownersMap[ownerId]) {
      const ownerName = getOwnerName(owner);

      ownersMap[ownerId] = {
        id: ownerId,
        initial: getOwnerInitial(ownerName),
        name: ownerName,
        role: owner?.role || expense?.ownerRole || "",
        transactions: [],
      };
    }

    // -------------------------------------------------------
    // Add Transaction
    // -------------------------------------------------------

    ownersMap[ownerId].transactions.push({
      id:
        expense?._id ||
        expense?.id ||
        `${ownerId}-${ownersMap[ownerId].transactions.length}`,

      date: formatDate(expense?.date),

      category:
        expense?.category?.name ||
        expense?.category?.categoryName ||
        expense?.category ||
        "Owner Expense",

      categoryClass: getCategoryClass(
        expense?.category?.name ||
          expense?.category?.categoryName ||
          expense?.category,
      ),

      description:
        expense?.remarks ||
        expense?.description ||
        expense?.detailRemarks ||
        "-",

      // -----------------------------------------------------
      // Payment Status
      // Cash Account / Bank Account
      // -----------------------------------------------------

      account: getPaymentMode(expense),

      amount: formatCurrency(expense?.amount),
    });
  });

  const ownersData = Object.values(ownersMap);

  // =========================================================
  // CALCULATE OWNER METRICS
  // =========================================================

  const ownersWithMetrics = ownersData.map((owner) => {
    const ownerRawExpenses = ownerExpenses.filter((expense) => {
      const expenseOwner =
        expense?.owner ||
        expense?.ownerId ||
        expense?.ownerData ||
        expense?.user ||
        null;

      return getOwnerId(expenseOwner) === owner.id;
    });

    // -------------------------------------------------------
    // Total Expenses
    // -------------------------------------------------------

    const totalExpenses = ownerRawExpenses.reduce((total, expense) => {
      return total + (Number(expense?.amount) || 0);
    }, 0);

    // -------------------------------------------------------
    // Current Month Expenses
    // -------------------------------------------------------

    const currentDate = new Date();

    const currentMonthExpenses = ownerRawExpenses.reduce((total, expense) => {
      if (!expense?.date) {
        return total;
      }

      const expenseDate = new Date(expense.date);

      if (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      ) {
        return total + (Number(expense?.amount) || 0);
      }

      return total;
    }, 0);

    return {
      ...owner,
      totalExpenses,
      currentMonthExpenses,
    };
  });

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (ownersWithMetrics.length === 0) {
    return (
      <div className="owner-expenses-container">
        <div className="section-header">
          <h1 className="section-title">Owner Expenses</h1>

          <p className="section-subtitle">
            Track and manage individual owner withdrawals and business expenses.
          </p>
        </div>

        <div className="owner-expenses-empty">No owner expenses found.</div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="owner-expenses-container">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="section-header">
        <h1 className="section-title">Owner Expenses</h1>

        <p className="section-subtitle">
          Track and manage individual owner withdrawals and business expenses.
        </p>
      </div>

      {/* =====================================================
          OWNER CARDS GRID
      ====================================================== */}

      <div className="owners-grid">
        {ownersWithMetrics.map((owner) => (
          <div key={owner.id} className="owner-card">
            {/* =================================================
                OWNER HEADER / PROFILE
            ================================================== */}

            <div className="owner-header">
              <div className="owner-profile-info">
                <div className="owner-avatar">{owner.initial}</div>

                <div className="owner-details">
                  <h3 className="owner-name">{owner.name}</h3>

                  {owner.role && (
                    <span className="owner-role">{owner.role}</span>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                METRICS
            ================================================== */}

            <div className="metrics-row">
              <div className="metric-box">
                <span className="metric-label">Total Expenses to Date</span>

                <span className="metric-value">
                  Rs. {formatCurrency(owner.totalExpenses)}
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Current Month Expenses</span>

                <span className="metric-value">
                  Rs. {formatCurrency(owner.currentMonthExpenses)}
                </span>
              </div>
            </div>

            {/* =================================================
                TRANSACTIONS
            ================================================== */}

            <div className="transactions-section">
              <h4 className="transactions-title">RECENT TRANSACTIONS</h4>

              {/* =================================================
                  DESKTOP / TABLET
              ================================================== */}

              <div className="table-responsive desktop-table-view">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th className="text-right">Amount (Rs.)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {owner.transactions.length > 0 ? (
                      owner.transactions.map((tx) => (
                        <tr key={tx.id}>
                          {/* Date */}

                          <td className="tx-date">{tx.date}</td>

                          {/* Category */}

                          <td>
                            <span
                              className={`category-tag ${tx.categoryClass}`}
                            >
                              {tx.category}
                            </span>
                          </td>

                          {/* Description */}

                          <td>
                            <div className="tx-description">
                              <span>{tx.description}</span>
                            </div>
                          </td>

                          {/* Status */}

                          <td>
                            {tx.account ? (
                              <span className="account-tag">{tx.account}</span>
                            ) : (
                              <span className="account-tag account-empty">
                                -
                              </span>
                            )}
                          </td>

                          {/* Amount */}

                          <td className="tx-amount">{tx.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE
              ================================================== */}

              <div className="mobile-cards-view">
                {owner.transactions.length > 0 ? (
                  owner.transactions.map((tx) => (
                    <div key={tx.id} className="mobile-tx-card">
                      {/* Top Row */}

                      <div className="mobile-tx-row top-row">
                        <span className="tx-date">{tx.date}</span>

                        <span className="tx-amount">Rs. {tx.amount}</span>
                      </div>

                      {/* Bottom Row */}

                      <div className="mobile-tx-row bottom-row">
                        <div className="tx-description">
                          <span className="tx-desc-text">{tx.description}</span>

                          {/* Payment Status */}

                          {tx.account && (
                            <span className="account-tag">{tx.account}</span>
                          )}
                        </div>

                        {/* Category */}

                        <span className={`category-tag ${tx.categoryClass}`}>
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mobile-tx-card">No transactions found.</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerExpenses;
