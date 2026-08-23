import React from 'react';
import { MoreVertical, CheckCircle2 } from 'lucide-react';
import './RecentTransactions.css';

const RecentTransactions = () => {
    const transactions = [
        {
            id: 1,
            date: '19-08-2026',
            type: 'Sale',
            typeClass: 'badge-sale',
            details: 'CNG Sale - Shift A',
            amount: 'Rs. 4,500',
            pool: 'Cash',
            status: 'Completed',
        },
        {
            id: 2,
            date: '19-08-2026',
            type: 'Expense',
            typeClass: 'badge-expense',
            details: 'Electricity Bill',
            amount: 'Rs. 12,000',
            pool: 'Bank',
            status: 'Completed',
        },
        {
            id: 3,
            date: '18-08-2026',
            type: 'Loan Recovery',
            typeClass: 'badge-loan',
            details: 'From Sajid Khan',
            amount: 'Rs. 5,000',
            pool: 'Cash',
            status: 'Completed',
        },
        {
            id: 4,
            date: '18-08-2026',
            type: 'Transfer',
            typeClass: 'badge-transfer',
            details: 'Cash to Bank',
            amount: 'Rs. 50,000',
            pool: 'Bank',
            status: 'Completed',
        },
    ];

    return (
        <div className="dashboard-section-card table-section-card">
            <div className="table-header-flex">
                <h3 className="section-title">Recent Transactions</h3>
                <button className="view-all-btn">View All</button>
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
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td className="date-cell">{tx.date}</td>
                                <td>
                                    <span className={`type-badge ${tx.typeClass}`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="details-cell">{tx.details}</td>
                                <td className="amount-cell">{tx.amount}</td>
                                <td className="pool-cell">{tx.pool}</td>
                                <td>
                                    <span className="status-badge">
                                        <CheckCircle2 size={13} /> {tx.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="action-btn">
                                        <MoreVertical size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;