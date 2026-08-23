import React, { useState } from 'react';
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
    Users
} from 'lucide-react';
import AddNewExpenses from '../../../components/adminDashboardForms/addNewExpenseForm/AddNewExpenses';
import './Expenses.css';

const Expenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const expenseStats = {
        todayExpenses: '38,500',
        monthExpenses: '412,000',
        recoveryExpenses: '30,000',
        currentMonth: 'August 2026'
    };

    const recentExpenses = [
        {
            id: 1,
            date: '16-08-2026',
            category: 'Supplies',
            categoryIcon: Package,
            details: 'Cleaning Materials',
            amount: '2,200',
            paymentMethod: 'Cash',
            status: 'Paid'
        },
        {
            id: 2,
            date: '19-08-2026',
            category: 'Utility',
            categoryIcon: Zap,
            details: 'Electricity Bill (Aug)',
            amount: '12,000',
            paymentMethod: 'Bank',
            status: 'Paid'
        },
        {
            id: 3,
            date: '18-08-2026',
            category: 'Maintenance',
            categoryIcon: Wrench,
            details: 'Compressor Service',
            amount: '5,000',
            paymentMethod: 'Cash',
            status: 'Paid'
        },
        {
            id: 4,
            date: '17-08-2026',
            category: 'Staff',
            categoryIcon: Users,
            details: 'Tea & Refreshments',
            amount: '1,500',
            paymentMethod: 'Cash',
            status: 'Paid'
        }
    ];

    return (
        <div className="exp-page-container">
            {/* Top Header Bar */}
            <div className="exp-header-bar">
                <div className="exp-header-left">
                    <span className="exp-pump-title">CNG Pump 01</span>
                    <span className="exp-divider">|</span>
                    <span className="exp-location-text">Mingora, Swat</span>
                </div>
            </div>

            <div className="exp-content-wrapper">
                {/* Title & Description */}
                <div className="exp-title-section">
                    <h1 className="exp-page-title">Expenses</h1>
                    <p className="exp-page-subtitle">Manage and track station operational costs.</p>
                </div>

                {/* Top 3 Metric Cards */}
                <div className="exp-stats-grid">
                    {/* Card 1: Today's Expenses */}
                    <div className="exp-stat-card">
                        <div className="exp-stat-info">
                            <span className="exp-stat-label">TODAY'S<br />EXPENSES</span>
                            <h2 className="exp-stat-value">Rs. {expenseStats.todayExpenses}</h2>
                            <span className="exp-stat-sub">Total outgoings today</span>
                        </div>
                        <div className="exp-icon-box exp-icon-red">
                            <TrendingDown size={20} />
                        </div>
                    </div>

                    {/* Card 2: This Month's Expenses */}
                    <div className="exp-stat-card">
                        <div className="exp-stat-info">
                            <span className="exp-stat-label">THIS MONTH'S<br />EXPENSES</span>
                            <h2 className="exp-stat-value">Rs. {expenseStats.monthExpenses}</h2>
                            <span className="exp-stat-sub">Total for {expenseStats.currentMonth}</span>
                        </div>
                        <div className="exp-icon-box exp-icon-blue">
                            <Calendar size={20} />
                        </div>
                    </div>

                    {/* Card 3: Recovery Expenses */}
                    <div className="exp-stat-card">
                        <div className="exp-stat-info">
                            <span className="exp-stat-label">RECOVERY EXPENSES</span>
                            <h2 className="exp-stat-value">Rs. {expenseStats.recoveryExpenses}</h2>
                        </div>
                        <div className="exp-icon-box exp-icon-red">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="exp-action-bar">
                    <button className="exp-btn-primary" onClick={() => setIsModalOpen(true)}>
                        <PlusCircle size={20} />
                        <span>Add New Expense</span>
                    </button>

                    <button className="exp-btn-secondary">
                        <Layers size={18} />
                        <span>View Expense Categories</span>
                    </button>
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
                                    <th>Action</th>
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
                                                    {expense.paymentMethod === 'Cash' ? (
                                                        <Banknote size={16} />
                                                    ) : (
                                                        <Building2 size={16} />
                                                    )}
                                                    <span>{expense.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="exp-status-paid">{expense.status}</span>
                                            </td>
                                            <td></td>
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
        </div>
    );
};

export default Expenses;