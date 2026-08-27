import React, { useMemo, useState } from "react";
import {
  FaMoneyBillWave,
  FaBuildingColumns,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaPen,
  FaTrashCan,
} from "react-icons/fa6";

import "./CashBank.css";
import CashTransferModal from "../../../components/adminDashboardForms/cashTransferModal/CashTransferModal";

const CashBank = () => {
  // ==========================================
  // Modal State
  // ==========================================
  const [showTransferModal, setShowTransferModal] = useState(false);

  // ==========================================
  // Transactions Data
  // ==========================================
  const transactions = [
    {
      id: 1,
      date: "20-08-2026",
      type: "Cash to Bank",
      typeIcon: "cash-to-bank",
      amount: 50000,
      cashChange: -50000,
      bankChange: 50000,
    },
    {
      id: 2,
      date: "19-08-2026",
      type: "Bank to Cash",
      typeIcon: "bank-to-cash",
      amount: 120000,
      cashChange: 120000,
      bankChange: -120000,
    },
    {
      id: 3,
      date: "17-08-2026",
      type: "Bank to Cash",
      typeIcon: "bank-to-cash",
      amount: 25000,
      cashChange: 25000,
      bankChange: -25000,
    },
    {
      id: 4,
      date: "15-08-2026",
      type: "Cash to Bank",
      typeIcon: "cash-to-bank",
      amount: 85400,
      cashChange: -85400,
      bankChange: 85400,
    },
  ];

  // ==========================================
  // Initial Balances
  // ==========================================
  const initialCashBalance = 245500;
  const initialBankBalance = 680000;

  // ==========================================
  // Calculate Balances
  // ==========================================
  const balances = useMemo(() => {
    return {
      totalCash: initialCashBalance,
      totalBank: initialBankBalance,
    };
  }, []);

  // ==========================================
  // Format Currency
  // ==========================================
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(amount);
  };

  // ==========================================
  // Transaction Type Icon Renderer
  // ==========================================
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

  // ==========================================
  // Edit Transaction
  // ==========================================
  const handleEdit = (transaction) => {
    console.log("Edit transaction:", transaction);
  };

  // ==========================================
  // Delete Transaction
  // ==========================================
  const handleDelete = (transaction) => {
    console.log("Delete transaction:", transaction);
  };

  return (
    <div className="cb-container">
      {/* ==========================================
          Main Content Area
      ========================================== */}

      <div className="cb-content-wrapper">
        {/* ==========================================
            Page Title
        ========================================== */}

        <div className="cb-title-section">
          <h1 className="cb-page-title">Cash & Bank Operations</h1>

          <p className="cb-page-subtitle">
            Manage station liquidity and bank transfers securely.
          </p>
        </div>

        {/* ==========================================
            Stat Cards
        ========================================== */}

        <div className="cb-stats-grid">
          {/* Total Cash Card */}

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

          {/* Total Bank Card */}

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

        {/* ==========================================
            Transfer Cash Button
        ========================================== */}

        <div className="cb-transfer-action-wrap">
          <button
            type="button"
            className="cb-btn-transfer-dark"
            onClick={() => setShowTransferModal(true)}
          >
            <span>Transfer Cash</span>
          </button>
        </div>

        {/* ==========================================
            Transactions Table Card
        ========================================== */}

        <div className="cb-table-card">
          {/* Table Header */}

          <div className="cb-table-header">
            <h3 className="cb-table-title">Cash & Bank Transactions</h3>

            <button type="button" className="cb-table-btn-icon" title="Filter">
              <FaFilter />
            </button>
          </div>

          {/* ==========================================
              Table
          ========================================== */}

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
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    {/* Date */}

                    <td className="cb-date-cell">{tx.date}</td>

                    {/* Type */}

                    <td>
                      <div className="cb-type-cell">
                        {getTransactionIcon(tx.typeIcon)}

                        <span>{tx.type}</span>
                      </div>
                    </td>

                    {/* Amount */}

                    <td className="cb-amount-cell cb-text-right">
                      {formatCurrency(tx.amount)}
                    </td>

                    {/* Actions */}

                    <td className="cb-actions-cell">
                      {/* Edit */}

                      <button
                        type="button"
                        className="cb-action-btn cb-edit-btn"
                        title="Edit"
                        aria-label={`Edit ${tx.type} transaction`}
                        onClick={() => handleEdit(tx)}
                      >
                        <FaPen />
                      </button>

                      {/* Delete */}

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
                ))}
              </tbody>
            </table>
          </div>

          {/* ==========================================
              Table Footer
          ========================================== */}

          <div className="cb-table-footer">
            <button type="button" className="cb-btn-view-all">
              View All Transactions &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          Cash Transfer Modal
      ========================================== */}

      <CashTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
};

export default CashBank;
