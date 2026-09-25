import React from "react";
import { FaPlus } from "react-icons/fa6";
import "./OwnerExpenses.css";

const ownersData = [
  {
    id: "owner-a",
    initial: "A",
    name: "Owner A",
    role: "Managing Partner",
    totalExpenses: "Rs. 1,250,000",
    currentMonthExpenses: "Rs. 85,000",
    transactions: [
      {
        id: 1,
        date: "24 Oct, 2023",
        category: "Drawing",
        categoryClass: "tag-drawing",
        description: "Monthly withdrawal",
        account: "Cash Account",
        amount: "50,000",
      },
      {
        id: 2,
        date: "18 Oct, 2023",
        category: "Business",
        categoryClass: "tag-business",
        description: "Site visit fuel",
        account: "Bank Account",
        amount: "15,000",
      },
      {
        id: 3,
        date: "05 Oct, 2023",
        category: "Personal",
        categoryClass: "tag-personal",
        description: "Vehicle maintenance",
        account: "Cash Account",
        amount: "20,000",
      },
    ],
  },
  {
    id: "owner-b",
    initial: "B",
    name: "Owner B",
    role: "Silent Partner",
    totalExpenses: "Rs. 980,000",
    currentMonthExpenses: "Rs. 45,000",
    transactions: [
      {
        id: 1,
        date: "22 Oct, 2023",
        category: "Drawing",
        categoryClass: "tag-drawing",
        description: "Monthly withdrawal",
        account: null,
        amount: "45,000",
      },
      {
        id: 2,
        date: "12 Sep, 2023",
        category: "Drawing",
        categoryClass: "tag-drawing",
        description: "Monthly withdrawal",
        account: null,
        amount: "45,000",
      },
      {
        id: 3,
        date: "15 Aug, 2023",
        category: "Drawing",
        categoryClass: "tag-drawing",
        description: "Monthly withdrawal",
        account: null,
        amount: "45,000",
      },
    ],
  },
];

const OwnerExpenses = () => {
  const handleRecordExpense = (ownerName) => {
    console.log(`Record expense clicked for ${ownerName}`);
  };

  return (
    <div className="owner-expenses-container">
      {/* Page Header */}
      <div className="section-header">
        <h1 className="section-title">Owner Expenses</h1>
        <p className="section-subtitle">
          Track and manage individual owner withdrawals and business expenses.
        </p>
      </div>

      {/* Owner Cards Grid */}
      <div className="owners-grid">
        {ownersData.map((owner) => (
          <div key={owner.id} className="owner-card">
            {/* Header / Profile Info */}
            <div className="owner-header">
              <div className="owner-profile-info">
                <div className="owner-avatar">{owner.initial}</div>
                <div className="owner-details">
                  <h3 className="owner-name">{owner.name}</h3>
                  <span className="owner-role">{owner.role}</span>
                </div>
              </div>
              <button
                className="btn-record-expense"
                onClick={() => handleRecordExpense(owner.name)}
              >
                <FaPlus size={12} />
                <span>Record Expense</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="metrics-row">
              <div className="metric-box">
                <span className="metric-label">Total Expenses to Date</span>
                <span className="metric-value">{owner.totalExpenses}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Current Month Expenses</span>
                <span className="metric-value">
                  {owner.currentMonthExpenses}
                </span>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="transactions-section">
              <h4 className="transactions-title">RECENT TRANSACTIONS</h4>

              {/* Table View (Desktops / Tablets) */}
              <div className="table-responsive desktop-table-view">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th className="text-right">Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owner.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="tx-date">{tx.date}</td>
                        <td>
                          <span className={`category-tag ${tx.categoryClass}`}>
                            {tx.category}
                          </span>
                        </td>
                        <td>
                          <div className="tx-description">
                            <span>{tx.description}</span>
                            {tx.account && (
                              <span className="account-tag">{tx.account}</span>
                            )}
                          </div>
                        </td>
                        <td className="tx-amount">{tx.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card List View (Mobile Devices <= 576px) */}
              <div className="mobile-cards-view">
                {owner.transactions.map((tx) => (
                  <div key={tx.id} className="mobile-tx-card">
                    <div className="mobile-tx-row top-row">
                      <span className="tx-date">{tx.date}</span>
                      <span className="tx-amount">Rs. {tx.amount}</span>
                    </div>
                    <div className="mobile-tx-row bottom-row">
                      <div className="tx-description">
                        <span className="tx-desc-text">{tx.description}</span>
                        {tx.account && (
                          <span className="account-tag">{tx.account}</span>
                        )}
                      </div>
                      <span className={`category-tag ${tx.categoryClass}`}>
                        {tx.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerExpenses;
