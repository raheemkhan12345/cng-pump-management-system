import { useCallback, useEffect, useState } from "react";

import { Calendar } from "lucide-react";

import DashboardStats from "./DashboardStats";
import RecentTransactions from "./RecentTransactions";

import { getDashboard } from "../../../services/adminApis/dashboardApi";

import "./AdminDashboard.css";
import { FaChevronDown } from "react-icons/fa6";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CURRENT MONTH & YEAR
  // =========================================================

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth() + 1;

  // =========================================================
  // SELECTED MONTH
  // =========================================================

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // =========================================================
  // GENERATE MONTH LIST
  // =========================================================
  // This creates the current month + previous 11 months.
  //
  // Example:
  // October 2026
  // September 2026
  // August 2026
  // July 2026
  // ...
  // November 2025
  // =========================================================

  const monthOptions = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1);

    monthOptions.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date),
    });
  }

  // =========================================================
  // SELECTED MONTH LABEL
  // =========================================================

  const selectedMonthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(selectedYear, selectedMonth - 1, 1));

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================

  const fetchDashboard = useCallback(async (year, month) => {
    try {
      setIsLoading(true);
      setError("");

      // =====================================================
      // CALL SAME DASHBOARD API
      // =====================================================

      const response = await getDashboard(year, month);

      // =====================================================
      // EXTRACT DASHBOARD DATA
      // =====================================================

      let dashboard = {};

      if (
        response?.dashboard &&
        typeof response.dashboard === "object" &&
        !Array.isArray(response.dashboard)
      ) {
        dashboard = response.dashboard;
      } else if (
        response?.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        dashboard = response.data;
      } else if (
        response?.dashboardData &&
        typeof response.dashboardData === "object" &&
        !Array.isArray(response.dashboardData)
      ) {
        dashboard = response.dashboardData;
      } else if (
        response &&
        typeof response === "object" &&
        !Array.isArray(response)
      ) {
        dashboard = response;
      }

      // =====================================================
      // EXTRACT RECENT TRANSACTIONS
      // =====================================================

      let transactions = [];

      if (Array.isArray(response?.recentTransactions)) {
        transactions = response.recentTransactions;
      } else if (Array.isArray(dashboard?.recentTransactions)) {
        transactions = dashboard.recentTransactions;
      } else if (Array.isArray(dashboard?.transactions)) {
        transactions = dashboard.transactions;
      } else if (Array.isArray(response?.transactions)) {
        transactions = response.transactions;
      }

      // =====================================================
      // SET DATA
      // =====================================================

      setDashboardData(dashboard);

      setRecentTransactions(transactions);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load dashboard.";

      setError(errorMessage);

      setDashboardData({});

      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // FETCH DASHBOARD ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchDashboard(currentYear, currentMonth);
  }, [fetchDashboard, currentYear, currentMonth]);

  // =========================================================
  // HANDLE MONTH CHANGE
  // =========================================================

  const handleMonthChange = (event) => {
    const value = event.target.value;

    const [year, month] = value.split("-").map(Number);

    setSelectedYear(year);

    setSelectedMonth(month);

    fetchDashboard(year, month);
  };

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {
    fetchDashboard(selectedYear, selectedMonth);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="admin-dashboard-wrapper">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="admin-dashboard-wrapper">
        <div className="dashboard-error">
          <p>{error}</p>

          <button type="button" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="admin-dashboard-wrapper">
      {/* =====================================================
          TOP HEADER FILTER & ACTION BAR
      ====================================================== */}

      <div className="dashboard-action-bar">
        {/* ===================================================
            MONTH FILTER
        ==================================================== */}

        <div className="date-filter-pill">
          {" "}
          <Calendar size={15} /> <span>Viewing reports for</span>{" "}
          <div className="month-select-wrapper">
            {" "}
            <select
              value={`${selectedYear}-${selectedMonth}`}
              onChange={handleMonthChange}
              className="dashboard-month-select"
            >
              {" "}
              {monthOptions.map((option) => (
                <option
                  key={`${option.year}-${option.month}`}
                  value={`${option.year}-${option.month}`}
                >
                  {" "}
                  {option.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <FaChevronDown className="dropdown-icon" size={11} />{" "}
          </div>{" "}
        </div>

        {/* ===================================================
            SUPER DASHBOARD
        ==================================================== */}

        {/* 
        <button type="button" className="btn-super-admin">
          <div className="icon-circle">
            <Undo2 size={14} />
          </div>

          <span>Super Dashboard</span>
        </button>
        */}
      </div>

      {/* =====================================================
          DASHBOARD STATS
      ====================================================== */}

      <DashboardStats dashboardData={dashboardData} />

      {/* =====================================================
          RECENT TRANSACTIONS
      ====================================================== */}

      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
};

export default AdminDashboard;
