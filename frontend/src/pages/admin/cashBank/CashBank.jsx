import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBuildingColumns,
  FaFilter,
  FaMoneyBillWave,
  FaPen,
  FaTrashCan,
} from "react-icons/fa6";

import {
  getCashBank,
  createCashBankTransfer,
  deleteCashBankTransaction,
} from "../../../services/adminApis/cashBankApi";

import CashTransferModal from "../../../components/adminDashboardForms/cashTransferModal/CashTransferModal";

import "./CashBank.css";

const CashBank = () => {
  // =========================================================
  // CONSTANTS
  // =========================================================

  const EMPTY_BALANCES = {
    totalCash: 0,
    totalBank: 0,
  };

  // =========================================================
  // STATES
  // =========================================================

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState(EMPTY_BALANCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH CASH & BANK DATA
  // =========================================================

  const fetchCashBankData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getCashBank();

      console.log("Cash Bank API Response:", response);

      const apiData = response?.data ?? response ?? {};

      console.log("Cash Bank API Data:", apiData);

      // =====================================================
      // BALANCES
      // =====================================================

      const balanceData = apiData?.balance ?? {};

      console.log("Cash Bank Balance:", balanceData);

      const totalCash =
        Number(
          balanceData?.cashInHand ??
            apiData?.cashInHand ??
            apiData?.totalCash ??
            apiData?.cashBalance ??
            apiData?.cash ??
            apiData?.totalCashBalance ??
            0,
        ) || 0;

      const totalBank =
        Number(
          balanceData?.bankBalance ??
            apiData?.bankBalance ??
            apiData?.totalBank ??
            apiData?.bank ??
            apiData?.totalBankBalance ??
            0,
        ) || 0;

      // =====================================================
      // TRANSACTIONS
      // =====================================================

      let transactionData = [];

      if (Array.isArray(apiData?.transactions)) {
        transactionData = apiData.transactions;
      } else if (Array.isArray(apiData?.data)) {
        transactionData = apiData.data;
      } else if (Array.isArray(apiData?.cashBankTransactions)) {
        transactionData = apiData.cashBankTransactions;
      } else if (Array.isArray(response?.transactions)) {
        transactionData = response.transactions;
      } else if (Array.isArray(response?.data?.transactions)) {
        transactionData = response.data.transactions;
      }

      console.log("Cash Bank Transactions:", transactionData);

      // =====================================================
      // NORMALIZE TRANSACTIONS
      // =====================================================

      const formattedTransactions = transactionData.map(
        (transaction, index) => {
          const rawType = String(
            transaction?.type ||
              transaction?.transactionType ||
              transaction?.transferType ||
              "",
          )
            .trim()
            .toLowerCase();

          let type = "Cash to Bank";
          let typeIcon = "cash-to-bank";

          if (
            rawType.includes("bank to cash") ||
            rawType.includes("bank-to-cash") ||
            rawType.includes("bank_to_cash") ||
            rawType === "banktocash"
          ) {
            type = "Bank to Cash";
            typeIcon = "bank-to-cash";
          } else if (
            rawType.includes("cash to bank") ||
            rawType.includes("cash-to-bank") ||
            rawType.includes("cash_to_bank") ||
            rawType === "cashtobank"
          ) {
            type = "Cash to Bank";
            typeIcon = "cash-to-bank";
          }

          const amount =
            Number(
              transaction?.amount ??
                transaction?.transferAmount ??
                transaction?.value ??
                transaction?.totalAmount ??
                0,
            ) || 0;

          return {
            id: transaction?._id || transaction?.id || `cash-bank-${index}`,

            date:
              transaction?.date ||
              transaction?.createdAt ||
              transaction?.transactionDate ||
              "",

            type,
            typeIcon,
            amount,

            cashChange:
              Number(transaction?.cashChange ?? transaction?.cashAmount ?? 0) ||
              0,

            bankChange:
              Number(transaction?.bankChange ?? transaction?.bankAmount ?? 0) ||
              0,

            remarks:
              transaction?.remarks ||
              transaction?.notes ||
              transaction?.description ||
              "",

            rawData: transaction,
          };
        },
      );

      // =====================================================
      // SORT NEWEST FIRST
      // =====================================================

      formattedTransactions.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);

        return dateB - dateA;
      });

      // =====================================================
      // UPDATE STATES
      // =====================================================

      setBalances({
        totalCash,
        totalBank,
      });

      setTransactions(formattedTransactions);

      console.log("Final Cash Balance:", totalCash);
      console.log("Final Bank Balance:", totalBank);
      console.log("Final Cash & Bank Transactions:", formattedTransactions);
    } catch (error) {
      console.error("Failed to fetch Cash & Bank data:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load Cash & Bank data.";

      setError(message);
      setBalances(EMPTY_BALANCES);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // CREATE CASH & BANK TRANSFER
  // =========================================================

  const handleTransferSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");

      console.log("Cash Bank Transfer Payload:", formData);

      const response = await createCashBankTransfer(formData);

      console.log("Cash Bank Transfer Response:", response);

      // =====================================================
      // REFRESH DATA AFTER SUCCESSFUL TRANSFER
      // =====================================================

      await fetchCashBankData();

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setShowTransferModal(false);
    } catch (error) {
      console.error("Failed to create Cash & Bank transfer:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create Cash & Bank transfer.";

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCashBankData();
  }, [fetchCashBankData]);

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const dateObject = new Date(date);

    if (Number.isNaN(dateObject.getTime())) {
      const dateString = String(date).slice(0, 10);
      const parts = dateString.split("-");

      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        return dateString;
      }

      return date;
    }

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // =========================================================
  // TRANSACTION ICON
  // =========================================================

  const getTransactionIcon = (type) => {
    switch (type) {
      case "cash-to-bank":
        return <FaArrowUp className="cb-icon-up" />;

      case "bank-to-cash":
        return <FaArrowDown className="cb-icon-down" />;

      default:
        return null;
    }
  };

  // =========================================================
  // DELETE TRANSACTION
  // =========================================================


const handleDelete = async (transaction) => {
  const transactionId = transaction?.id;

  if (!transactionId) {
    alert("Transaction ID is missing.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this transaction?",
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    console.log(
      "Deleting Cash & Bank transaction:",
      transactionId,
    );

    const response = await deleteCashBankTransaction(transactionId);

    console.log("Delete Cash & Bank Response:", response);

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (tx) => tx.id !== transactionId,
      ),
    );

    alert("Transaction deleted successfully.");
  } catch (error) {
    console.error(
      "Failed to delete Cash & Bank transaction:",
      error,
    );

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to delete Cash & Bank transaction.";

    alert(message);
  }
};



  // =========================================================
  // VISIBLE TRANSACTIONS
  // =========================================================

  const visibleTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading) {
    return (
      <div className="cb-container">
        <div className="cb-content-wrapper">
          <div className="cb-loading">Loading Cash & Bank data...</div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="cb-container">
        <div className="cb-content-wrapper">
          <div className="cb-error">
            <p>{error}</p>

            <button type="button" onClick={fetchCashBankData}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="cb-container">
      <div className="cb-content-wrapper">
        {/* PAGE TITLE */}

        <div className="cb-title-section">
          <h1 className="cb-page-title">Cash & Bank Operations</h1>

          <p className="cb-page-subtitle">
            Manage station liquidity and bank transfers securely.
          </p>
        </div>

        {/* STAT CARDS */}

        <div className="cb-stats-grid">
          {/* TOTAL CASH */}

          <div className="cb-stat-card">
            <div className="cb-stat-info">
              <span className="cb-stat-label">TOTAL CASH IN HAND</span>

              <h2 className="cb-stat-value">
                Rs. {formatCurrency(balances.totalCash)}
              </h2>
            </div>

            <div className="cb-stat-icon-wrapper cb-bg-light-green">
              <FaMoneyBillWave className="cb-stat-icon-green" />
            </div>
          </div>

          {/* TOTAL BANK */}

          <div className="cb-stat-card">
            <div className="cb-stat-info">
              <span className="cb-stat-label">TOTAL BANK BALANCE</span>

              <h2 className="cb-stat-value">
                Rs. {formatCurrency(balances.totalBank)}
              </h2>
            </div>

            <div className="cb-stat-icon-wrapper cb-bg-light-gray">
              <FaBuildingColumns className="cb-stat-icon-gray" />
            </div>
          </div>
        </div>

        {/* TRANSFER CASH */}

        <div className="cb-transfer-action-wrap">
          <button
            type="button"
            className="cb-btn-transfer-dark"
            onClick={() => setShowTransferModal(true)}
          >
            <span>Transfer Cash</span>
          </button>
        </div>

        {/* TRANSACTIONS TABLE */}

        <div className="cb-table-card">
          <div className="cb-table-header">
            <h3 className="cb-table-title">Cash & Bank Transactions</h3>

            <button type="button" className="cb-table-btn-icon" title="Filter">
              <FaFilter />
            </button>
          </div>

          <div className="cb-table-responsive">
            <table className="cb-table">
              <thead>
                <tr>
                  <th>Date</th>

                  <th>Type</th>

                  <th className="cb-text-right">Amount (Rs.)</th>

                  <th className="cb-text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleTransactions.length > 0 ? (
                  visibleTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="cb-date-cell">{formatDate(tx.date)}</td>

                      <td>
                        <div className="cb-type-cell">
                          {getTransactionIcon(tx.typeIcon)}
                          <span>{tx.type}</span>
                        </div>
                      </td>

                      <td className="cb-amount-cell cb-text-right">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="cb-actions-cell">
                        <button
                          type="button"
                          className="cb-action-btn cb-delete-btn"
                          title="Delete"
                          aria-label={`Delete ${tx.type} transaction`}
                          onClick={() => handleDelete(tx)}
                        >
                          <FaTrashCan />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="cb-empty-state">
                      No Cash & Bank transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CASH TRANSFER MODAL */}

      <CashTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransferSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CashBank;
