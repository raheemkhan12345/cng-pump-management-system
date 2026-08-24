import React, { useState, useMemo } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import './Ledger.css';

const Ledger = () => {
    // =========================================================
    // States
    // =========================================================
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [filterHead, setFilterHead] = useState('All Heads');
    const [filterPool, setFilterPool] = useState('All Pools');

    // Sample Transactions Data
    const [transactions] = useState([
        {
            id: 1,
            date: '01-08-2026',
            rawDate: '2026-08-01',
            type: 'Sale',
            specificHead: 'CNG Sales Revenue',
            detail: 'DAILY CNG SALE',
            amount: 1005343,
            paymentPool: 'Cash Account Hand Pool',
            volKg: '3,114',
        },
        {
            id: 2,
            date: '01-08-2026',
            rawDate: '2026-08-01',
            type: 'Expense',
            specificHead: 'KITCHEN',
            detail: 'KITCHEN KHARCHA',
            amount: 1950,
            paymentPool: 'Cash Account Hand Pool',
            volKg: '—',
        },
        {
            id: 3,
            date: '01-08-2026',
            rawDate: '2026-08-01',
            type: 'Expense',
            specificHead: 'DISPENSER WORK',
            detail: 'DISPENSER HEAD',
            amount: 2500,
            paymentPool: 'Cash Account Hand Pool',
            volKg: '—',
        },
        {
            id: 4,
            date: '01-08-2026',
            rawDate: '2026-08-01',
            type: 'Expense',
            specificHead: 'DIESEL PURCHASED',
            detail: 'DIESEL FOR GENERATOR',
            amount: 15780,
            paymentPool: 'Cash Account Hand Pool',
            volKg: '—',
        },
        {
            id: 5,
            date: '02-08-2026',
            rawDate: '2026-08-02',
            type: 'Cash Transfer',
            specificHead: 'Contra: Cash to Bank',
            detail: 'TRANSFER TO MAIN A/C',
            amount: 500000,
            paymentPool: 'Bank Account Reserve Pool',
            volKg: '—',
        },
    ]);

    // Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK').format(amount);
    };

    // Reset Filters Handler
    const handleReset = () => {
        setSearchTerm('');
        setFilterDate('');
        setFilterType('All Types');
        setFilterHead('All Heads');
        setFilterPool('All Pools');
    };

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter((item) => {
            const matchesSearch = item.detail
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesDate = filterDate ? item.rawDate === filterDate : true;
            const matchesType =
                filterType === 'All Types' || item.type === filterType;
            const matchesHead =
                filterHead === 'All Heads' || item.specificHead === filterHead;
            const matchesPool =
                filterPool === 'All Pools' || item.paymentPool === filterPool;

            return (
                matchesSearch &&
                matchesDate &&
                matchesType &&
                matchesHead &&
                matchesPool
            );
        });
    }, [
        transactions,
        searchTerm,
        filterDate,
        filterType,
        filterHead,
        filterPool,
    ]);

    // Type Badge Styling Class Helper
    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'Sale':
                return 'ledger-badge-sale';
            case 'Expense':
                return 'ledger-badge-expense';
            case 'Cash Transfer':
                return 'ledger-badge-transfer';
            default:
                return '';
        }
    };

    return (
        <div className="ledger-container">
            {/* Header Section */}
            <div className="ledger-header">
                <div>
                    <h1 className="ledger-title">Ledger</h1>
                    <p className="ledger-subtitle">
                        Complete transaction record of your CNG station
                    </p>
                </div>
                <button className="ledger-add-btn">
                    <Plus size={18} />
                    <span>Add New Transaction</span>
                </button>
            </div>

            {/* Filter Section */}
            <div className="ledger-filter-card">
                <div className="ledger-filter-grid">
                    {/* Search */}
                    <div className="ledger-filter-group search-group">
                        <label>Search</label>
                        <div className="ledger-search-input-wrapper">
                            <Search size={16} className="ledger-search-icon" />
                            <input
                                type="text"
                                placeholder="Search remarks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="ledger-filter-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    {/* Transaction Type */}
                    <div className="ledger-filter-group">
                        <label>Transaction Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All Types">All Types</option>
                            <option value="Sale">Sale</option>
                            <option value="Expense">Expense</option>
                            <option value="Cash Transfer">Cash Transfer</option>
                        </select>
                    </div>

                    {/* Specific Head */}
                    <div className="ledger-filter-group">
                        <label>Specific Head</label>
                        <select
                            value={filterHead}
                            onChange={(e) => setFilterHead(e.target.value)}
                        >
                            <option value="All Heads">All Heads</option>
                            <option value="CNG Sales Revenue">
                                CNG Sales Revenue
                            </option>
                            <option value="KITCHEN">KITCHEN</option>
                            <option value="DISPENSER WORK">DISPENSER WORK</option>
                            <option value="DIESEL PURCHASED">
                                DIESEL PURCHASED
                            </option>
                            <option value="Contra: Cash to Bank">
                                Contra: Cash to Bank
                            </option>
                        </select>
                    </div>

                    {/* Pool / Mode */}
                    <div className="ledger-filter-group">
                        <label>Pool / Mode</label>
                        <select
                            value={filterPool}
                            onChange={(e) => setFilterPool(e.target.value)}
                        >
                            <option value="All Pools">All Pools</option>
                            <option value="Cash Account Hand Pool">
                                Cash Account Hand Pool
                            </option>
                            <option value="Bank Account Reserve Pool">
                                Bank Account Reserve Pool
                            </option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="ledger-filter-action">
                        <button className="ledger-reset-btn" onClick={handleReset}>
                            <RotateCcw size={14} />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Table Card */}
            <div className="ledger-table-card">
                <div className="ledger-table-wrapper">
                    <table className="ledger-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>TYPE</th>
                                <th>SPECIFIC HEAD</th>
                                <th>DETAIL / REMARKS</th>
                                <th>AMOUNT (PKR)</th>
                                <th>PAYMENT POOL</th>
                                <th>VOL (KG)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((item) => (
                                    <tr key={item.id}>
                                        <td className="ledger-td-date">
                                            {item.date}
                                        </td>
                                        <td>
                                            <span
                                                className={`ledger-badge ${getTypeBadgeClass(
                                                    item.type
                                                )}`}
                                            >
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="ledger-td-head">
                                            {item.specificHead}
                                        </td>
                                        <td className="ledger-td-detail">
                                            {item.detail}
                                        </td>
                                        <td className="ledger-td-amount">
                                            Rs. {formatCurrency(item.amount)}
                                        </td>
                                        <td className="ledger-td-pool">
                                            {item.paymentPool}
                                        </td>
                                        <td className="ledger-td-vol">
                                            {item.volKg}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="ledger-empty-state"
                                    >
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="ledger-footer">
                    <span className="ledger-pagination-text">
                        Showing <b>1</b> to <b>{filteredTransactions.length}</b> of{' '}
                        <b>1,240</b> transactions
                    </span>
                    <div className="ledger-pagination-buttons">
                        <button className="ledger-page-btn" disabled>
                            Previous
                        </button>
                        <button className="ledger-page-btn">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ledger;