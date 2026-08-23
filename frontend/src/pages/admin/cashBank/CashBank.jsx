import React, { useMemo, useState } from 'react';
import {
    FaMoneyBillWave,
    FaBuildingColumns,
    FaArrowUp,
    FaArrowDown,
    FaFileLines,
    FaFilter,
    FaDownload,
    FaEllipsisVertical,
    FaPlus,
    FaGear,
    FaCreditCard,
} from 'react-icons/fa6';

import AddNewExpenses from '../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses';
import RecordNewSaleModal from '../../../components/adminDashboardForms/recordNewSaleForm/RecordNewSaleModel';

import './CashBank.css';

const CashBank = () => {

    // ==========================================
    // Modal State
    // ==========================================

    const [showNewSale, setShowNewSale] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);

    // ==========================================
    // Transactions Data
    // ==========================================

    const transactions = [
        {
            id: 1,
            date: '20-08-2026',
            type: 'Cash to Bank',
            typeIcon: 'cash-to-bank',
            detailsTitle: 'HBL Main Branch',
            detailsSub: 'Slip: HBL-99201',
            amount: 50000,
            status: 'Completed',
            cashChange: -50000,
            bankChange: 50000,
        },
        {
            id: 2,
            date: '19-08-2026',
            type: 'Bank Deposit',
            typeIcon: 'bank-deposit',
            detailsTitle: 'Meezan Bank',
            detailsSub: 'Online Transfer - IBFT',
            amount: 120000,
            status: 'Completed',
            cashChange: 0,
            bankChange: 120000,
        },
        {
            id: 3,
            date: '17-08-2026',
            type: 'Bank to Cash',
            typeIcon: 'bank-to-cash',
            detailsTitle: 'UBL City Center',
            detailsSub: 'Cheque No: 442109',
            amount: 25000,
            status: 'Completed',
            cashChange: 25000,
            bankChange: -25000,
        },
        {
            id: 4,
            date: '15-08-2026',
            type: 'Withdrawal',
            typeIcon: 'withdrawal',
            detailsTitle: 'HBL Main Branch',
            detailsSub: 'Utility Bills Payment',
            amount: 65400,
            status: 'Completed',
            cashChange: -65400,
            bankChange: -65400,
        },
    ];

    // ==========================================
    // Initial Balances
    // ==========================================

    const initialCashBalance = 335900;
    const initialBankBalance = 680000;

    // ==========================================
    // Calculate Current Balances
    // ==========================================

    const balances = useMemo(() => {

        const cashChanges = transactions.reduce(
            (total, transaction) =>
                total + transaction.cashChange,
            0
        );

        const bankChanges = transactions.reduce(
            (total, transaction) =>
                total + transaction.bankChange,
            0
        );

        return {
            totalCash: initialCashBalance + cashChanges,
            totalBank: initialBankBalance + bankChanges,
        };

    }, [transactions]);

    // ==========================================
    // Format Currency
    // ==========================================

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK').format(amount);
    };

    // ==========================================
    // Transaction Icon
    // ==========================================

    const getTransactionIcon = (type) => {

        switch (type) {

            case 'cash-to-bank':
                return (
                    <FaArrowUp className="cb-icon-up-green" />
                );

            case 'bank-deposit':
                return (
                    <FaBuildingColumns className="cb-icon-slate" />
                );

            case 'bank-to-cash':
                return (
                    <FaArrowDown className="cb-icon-down-red" />
                );

            case 'withdrawal':
                return (
                    <FaArrowDown className="cb-icon-down-red" />
                );

            default:
                return (
                    <FaMoneyBillWave className="cb-icon-slate" />
                );
        }
    };

    // ==========================================
    // Open New Sale Modal
    // ==========================================

    const handleNewSale = () => {
        setShowAddExpense(false);
        setShowNewSale(true);
    };

    // ==========================================
    // Open Add Expense Modal
    // ==========================================

    const handleAddExpense = () => {
        setShowNewSale(false);
        setShowAddExpense(true);
    };

    // ==========================================
    // Close All Modals
    // ==========================================

    const handleCloseForms = () => {
        setShowNewSale(false);
        setShowAddExpense(false);
    };

    return (
        <div className="cb-container">

            {/* ==========================================
                Top Header Bar
            ========================================== */}

            <div className="cb-header-bar">

                <span className="cb-location-text">
                    Mingora, Swat
                </span>

                <div className="cb-header-actions">

                    {/* New Sale */}

                    <button
                        type="button"
                        className="cb-btn-green"
                        onClick={handleNewSale}
                    >
                        New Sale
                    </button>

                    {/* Add Expense */}

                    <button
                        type="button"
                        className="cb-btn-outline"
                        onClick={handleAddExpense}
                    >
                        <FaPlus />
                        Add Expense
                    </button>

                    {/* Settings */}

                    <button
                        type="button"
                        className="cb-btn-icon-setting"
                        title="Settings"
                    >
                        <FaGear />
                    </button>

                </div>

            </div>

            {/* ==========================================
                Main Content
            ========================================== */}

            <div className="cb-content-wrapper">

                {/* Page Title */}

                <div className="cb-title-section">

                    <h1 className="cb-page-title">
                        Cash & Bank Operations
                    </h1>

                    <p className="cb-page-subtitle">
                        Manage station liquidity and bank
                        transfers securely.
                    </p>

                </div>

                {/* ==========================================
                    Stats Cards
                ========================================== */}

                <div className="cb-stats-grid">

                    {/* Total Cash */}

                    <div className="cb-stat-card">

                        <div className="cb-stat-info">

                            <span className="cb-stat-label">
                                TOTAL CASH IN
                                <br />
                                HAND
                            </span>

                            <h2 className="cb-stat-value">
                                Rs.{' '}
                                {formatCurrency(
                                    balances.totalCash
                                )}
                            </h2>

                        </div>

                        <div className="cb-stat-icon-wrapper cb-icon-green-bg">

                            <FaMoneyBillWave
                                className="cb-icon-green"
                            />

                        </div>

                    </div>

                    {/* Total Bank */}

                    <div className="cb-stat-card">

                        <div className="cb-stat-info">

                            <span className="cb-stat-label">
                                TOTAL BANK
                                <br />
                                BALANCE
                            </span>

                            <h2 className="cb-stat-value">
                                Rs.{' '}
                                {formatCurrency(
                                    balances.totalBank
                                )}
                            </h2>

                        </div>

                        <div className="cb-stat-icon-wrapper cb-icon-slate-bg">

                            <FaBuildingColumns
                                className="cb-icon-slate"
                            />

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    Quick Actions
                ========================================== */}

                <div className="cb-quick-actions-section">

                    <h3 className="cb-section-heading">
                        Quick Actions
                    </h3>

                    <div className="cb-quick-actions-grid">

                        {/* Transfer Cash to Bank */}

                        <div className="cb-action-card">

                            <div className="cb-action-icon-box">
                                <FaBuildingColumns
                                    className="cb-action-icon"
                                />
                            </div>

                            <h4 className="cb-action-title">
                                Transfer Cash to Bank
                            </h4>

                            <p className="cb-action-desc">
                                Record a physical cash deposit
                                into a company bank account.
                            </p>

                        </div>

                        {/* Transfer Bank to Cash */}

                        <div className="cb-action-card">

                            <div className="cb-action-icon-box">
                                <FaCreditCard
                                    className="cb-action-icon"
                                />
                            </div>

                            <h4 className="cb-action-title">
                                Transfer Bank to Cash
                            </h4>

                            <p className="cb-action-desc">
                                Record an ATM or cheque
                                withdrawal to petty cash.
                            </p>

                        </div>

                        {/* Bank Statement */}

                        <div className="cb-action-card">

                            <div className="cb-action-icon-box">
                                <FaFileLines
                                    className="cb-action-icon"
                                />
                            </div>

                            <h4 className="cb-action-title">
                                View Bank Statement
                            </h4>

                            <p className="cb-action-desc">
                                Review reconciled transactions
                                and monthly ledgers.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    Transactions Table
                ========================================== */}

                <div className="cb-table-card">

                    <div className="cb-table-header">

                        <h3 className="cb-table-title">
                            Cash & Bank Transactions
                        </h3>

                        <div className="cb-table-actions">

                            <button
                                type="button"
                                className="cb-table-btn-icon"
                                title="Filter Transactions"
                            >
                                <FaFilter />
                            </button>

                            <button
                                type="button"
                                className="cb-table-btn-icon"
                                title="Download Transactions"
                            >
                                <FaDownload />
                            </button>

                        </div>

                    </div>

                    <div className="cb-table-responsive">

                        <table className="cb-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Details</th>
                                    <th>Amount (Rs.)</th>
                                    <th>Status</th>
                                    <th className="cb-text-center">
                                        Action
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {transactions.map((tx) => (

                                    <tr key={tx.id}>

                                        <td className="cb-date-cell">
                                            {tx.date}
                                        </td>

                                        <td>

                                            <div className="cb-type-cell">

                                                {getTransactionIcon(
                                                    tx.typeIcon
                                                )}

                                                <span>
                                                    {tx.type}
                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="cb-details-cell">

                                                <span className="cb-details-title">
                                                    {tx.detailsTitle}
                                                </span>

                                                <span className="cb-details-sub">
                                                    {tx.detailsSub}
                                                </span>

                                            </div>

                                        </td>

                                        <td className="cb-amount-cell">
                                            {formatCurrency(
                                                tx.amount
                                            )}
                                        </td>

                                        <td>

                                            <span className="cb-badge-completed">
                                                {tx.status}
                                            </span>

                                        </td>

                                        <td className="cb-text-center">

                                            <button
                                                type="button"
                                                className="cb-btn-action-more"
                                                title="More actions"
                                            >
                                                <FaEllipsisVertical />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    <div className="cb-table-footer">

                        <button
                            type="button"
                            className="cb-btn-view-all"
                        >
                            View All Transactions
                            <span>›</span>
                        </button>

                    </div>

                </div>

            </div>

            {/* ==========================================
                MODALS
            ========================================== */}

            <RecordNewSaleModal
                isOpen={showNewSale}
                onClose={handleCloseForms}
            />

            <AddNewExpenses
                isOpen={showAddExpense}
                onClose={handleCloseForms}
            />

        </div>
    );
};

export default CashBank;