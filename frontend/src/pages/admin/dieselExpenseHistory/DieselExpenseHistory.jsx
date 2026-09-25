import React, { useState } from "react";
import {
  TrendingUp,
  Fuel,
  Banknote,
  Calendar,
  Edit2,
  Trash2,
  AlignLeft,
} from "lucide-react";
import "./DieselExpenseHistory.css";

const summaryData = [
  {
    id: 1,
    title: "DAILY DIESEL RECORD",
    value: "Rs. 2808.00 /10 L",
    icon: TrendingUp,
    badgeClass: "green-bg",
  },
  {
    id: 2,
    title: "TOTAL LITERS",
    value: "920 L",
    icon: Fuel,
    badgeClass: "green-bg",
  },
  {
    id: 3,
    title: "TOTAL DIESEL EXPENSE",
    value: "Rs. 257,600",
    icon: Banknote,
    badgeClass: "blue-bg",
  },
];

const purchaseEntries = [
  {
    id: 1,
    date: "28-10-2024",
    quantity: "200 L",
    amount: "Rs. 56,000",
    details: "Generator 01 (250 kVA) - PSO Swat Bypass / Load shedding backup",
  },
  {
    id: 2,
    date: "25-10-2024",
    quantity: "150 L",
    amount: "Rs. 42,000",
    details:
      "Generator 02 (150 kVA) - Shell Mingora Central / Weekly routine top-up",
  },
  {
    id: 3,
    date: "21-10-2024",
    quantity: "250 L",
    amount: "Rs. 70,000",
    details: "Generator 01 main tank bulk refuel - Total Parco Receipt #9021",
  },
  {
    id: 4,
    date: "17-10-2024",
    quantity: "70 L",
    amount: "Rs. 19,600",
    details: "Emergency fire pump backup tank filling & pressure test",
  },
  {
    id: 5,
    date: "12-10-2024",
    quantity: "150 L",
    amount: "Rs. 42,000",
    details: "Generator 01 main tank batch transfer - PSO Petrol Pump",
  },
  {
    id: 6,
    date: "05-10-2024",
    quantity: "100 L",
    amount: "Rs. 28,000",
    details: "Compressor Unit Auxiliary Engine top-up / Shift 1",
  },
];

const DieselExpenseHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("October 2024");

  return (
    <div className="diesel-container">
      {/* Metrics Cards Section */}
      <div className="metrics-grid">
        {summaryData.map((item) => {
          const IconComponent = item.icon;
          return (
            <div className="metric-card" key={item.id}>
              <div className="metric-header">
                <span className="metric-title">{item.title}</span>
                <div className={`icon-badge ${item.badgeClass}`}>
                  <IconComponent size={20} />
                </div>
              </div>
              <h2 className="metric-value">{item.value}</h2>
              <div className="metric-bg-shape"></div>
            </div>
          );
        })}
      </div>

      {/* Date Filter Dropdown */}
      <div className="filter-wrapper">
        <div className="date-picker-btn">
          <Calendar size={18} className="calendar-icon" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select"
          >
            <option value="October 2024">October 2024</option>
            <option value="September 2024">September 2024</option>
            <option value="August 2024">August 2024</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="table-card">
        {/* Table Header / Subtitle */}
        <div className="table-header-row">
          <div className="title-with-pill">
            <div className="green-pill"></div>
            <div>
              <h3 className="section-title">Monthly Purchase Entries</h3>
              <p className="section-subtitle">
                Detailed log of emergency and scheduled backup generator refills
              </p>
            </div>
          </div>
          <div className="show-badge">
            <span className="show-label">Show</span>
            <span className="records-count">All 6 Records</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="diesel-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>QUANTITY(L)</th>
                <th>AMOUNT(PKR)</th>
                <th>DETAIL / REMARKS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {purchaseEntries.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="date-badge">{row.date}</span>
                  </td>
                  <td className="font-semibold">{row.quantity}</td>
                  <td className="amount-text">{row.amount}</td>
                  <td>
                    <div className="details-cell">
                      <AlignLeft size={16} className="text-muted" />
                      <span>{row.details}</span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="table-footer">
          <span>
            Sum of October: <strong>920 Liters</strong> &nbsp;&bull;&nbsp; Net
            Total: <strong className="green-text">Rs. 257,600</strong>
          </span>
        </div>
      </div>

      {/* Bottom CTA Button */}
      {/* <div className="cta-container">
        <button className="btn-primary">START NEW MONTH DIESEL EXPENSES</button>
      </div> */}
    </div>
  );
};

export default DieselExpenseHistory;
