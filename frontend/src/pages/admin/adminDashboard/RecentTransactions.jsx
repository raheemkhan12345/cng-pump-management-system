import React from "react";

import { CheckCircle2 } from "lucide-react";

import "./RecentTransactions.css";

/**
 * ==========================================
 * FORMAT CURRENCY
 * ==========================================
 */
const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Rs. 0";
  }

  return `Rs. ${new Intl.NumberFormat("en-PK").format(number)}`;
};

/**
 * ==========================================
 * FORMAT DATE
 * ==========================================
 */
const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  /**
   * If backend already sends:
   * 19-08-2026
   */
  if (/^\d{2}-\d{2}-\d{4}$/.test(String(value))) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * ==========================================
 * GET TYPE CLASS
 * ==========================================
 */
const getTypeClass = (type) => {
  const normalizedType = String(type || "").toLowerCase();

  if (normalizedType.includes("sale")) {
    return "badge-sale";
  }

  if (normalizedType.includes("expense")) {
    return "badge-expense";
  }

  if (normalizedType.includes("loan")) {
    return "badge-loan";
  }

  if (normalizedType.includes("transfer")) {
    return "badge-transfer";
  }

  return "badge-sale";
};

/**
 * ==========================================
 * GET TYPE
 * ==========================================
 */
const getTransactionType = (transaction) => {
  return (
    transaction?.type ||
    transaction?.transactionType ||
    transaction?.category ||
    transaction?.transaction ||
    "Transaction"
  );
};

/**
 * ==========================================
 * GET DETAILS
 * ==========================================
 */
const getTransactionDetails = (transaction) => {
  return (
    transaction?.details ||
    transaction?.description ||
    transaction?.remarks ||
    transaction?.note ||
    transaction?.name ||
    "-"
  );
};

/**
 * ==========================================
 * GET AMOUNT
 * ==========================================
 */
const getTransactionAmount = (transaction) => {
  return (
    transaction?.amount ??
    transaction?.totalAmount ??
    transaction?.saleAmount ??
    transaction?.expenseAmount ??
    0
  );
};

/**
 * ==========================================
 * GET POOL
 * ==========================================
 */
const getTransactionPool = (transaction) => {
  return (
    transaction?.pool ||
    transaction?.paymentMode ||
    transaction?.paymentMethod ||
    transaction?.account ||
    "-"
  );
};

/**
 * ==========================================
 * GET STATUS
 * ==========================================
 */
const getTransactionStatus = (transaction) => {
  return transaction?.status || "Completed";
};

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="dashboard-section-card table-section-card">
      <div className="table-header-flex">
        <h3 className="section-title">Recent Transactions</h3>
      </div>

      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>TYPE</th>
              <th>DETAILS</th>
              <th>AMOUNT</th>
              <th>POOL</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => {
                const type = getTransactionType(tx);

                const typeClass = getTypeClass(type);

                const details = getTransactionDetails(tx);

                const amount = getTransactionAmount(tx);

                const pool = getTransactionPool(tx);

                const status = getTransactionStatus(tx);

                const transactionId =
                  tx?._id || tx?.id || tx?.transactionId || index;

                return (
                  <tr key={transactionId}>
                    <td className="date-cell">
                      {formatDate(
                        tx?.date || tx?.createdAt || tx?.transactionDate,
                      )}
                    </td>

                    <td>
                      <span className={`type-badge ${typeClass}`}>{type}</span>
                    </td>

                    <td className="details-cell">{details}</td>

                    <td className="amount-cell">{formatCurrency(amount)}</td>

                    <td className="pool-cell">{pool}</td>

                    <td>
                      <span className="status-badge">
                        <CheckCircle2 size={13} />

                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
