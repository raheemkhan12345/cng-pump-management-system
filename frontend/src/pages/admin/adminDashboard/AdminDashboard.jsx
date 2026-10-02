import { useCallback, useEffect, useState } from "react";

import { Calendar } from "lucide-react";
import { FaChevronDown } from "react-icons/fa6";

import DashboardStats from "./DashboardStats";
import RecentTransactions from "./RecentTransactions";

import { getDashboard } from "../../../services/adminApis/dashboardApi";

import "./AdminDashboard.css";

// =========================================================
// STORAGE KEY
// =========================================================

const DASHBOARD_MONTH_KEY = "cng_dashboard_selected_month";

const AdminDashboard = () => {
  // =========================================================
  // CURRENT DATE
  // =========================================================

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth() + 1;

  // =========================================================
  // GET SAVED MONTH
  // =========================================================

  const getInitialSelectedMonth = () => {
    try {
      const savedMonth = sessionStorage.getItem(DASHBOARD_MONTH_KEY);

      if (savedMonth) {
        const parsed = JSON.parse(savedMonth);

        if (
          parsed &&
          Number.isInteger(parsed.year) &&
          Number.isInteger(parsed.month) &&
          parsed.month >= 1 &&
          parsed.month <= 12
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to read saved dashboard month:", error);
    }

    return {
      year: currentYear,
      month: currentMonth,
    };
  };

  const initialSelectedMonth = getInitialSelectedMonth();

  // =========================================================
  // STATES
  // =========================================================

  const [selectedYear, setSelectedYear] = useState(
    initialSelectedMonth.year,
  );

  const [selectedMonth, setSelectedMonth] = useState(
    initialSelectedMonth.month,
  );

  const [dashboardData, setDashboardData] = useState({});

  const [recentTransactions, setRecentTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // GENERATE MONTH LIST
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
  // GET DASHBOARD DATA
  // =========================================================

  const fetchDashboard = useCallback(async (year, month) => {
    try {
      setIsLoading(true);

      setError("");

      // =====================================================
      // DEBUG
      // =====================================================

      console.log("======================================");

      console.log("FETCH DASHBOARD");

      console.log("YEAR:", year);

      console.log("MONTH:", month);

      console.log(
        "MONTH NAME:",
        new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(new Date(year, month - 1, 1)),
      );

      console.log("======================================");

      // =====================================================
      // API CALL
      // =====================================================

      const response = await getDashboard(year, month);

      console.log("Dashboard API Response:", response);

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
      // EXTRACT TRANSACTIONS
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
      console.error("Dashboard Error:", error);

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
  // FETCH SELECTED MONTH
  // =========================================================

  useEffect(() => {
    fetchDashboard(selectedYear, selectedMonth);
  }, [fetchDashboard, selectedYear, selectedMonth]);

  // =========================================================
  // HANDLE MONTH CHANGE
  // =========================================================

  const handleMonthChange = (event) => {
    const value = event.target.value;

    const [year, month] = value.split("-").map(Number);

    // =======================================================
    // UPDATE STATE
    // =======================================================

    setSelectedYear(year);

    setSelectedMonth(month);

    // =======================================================
    // SAVE SELECTED MONTH
    // =======================================================

    sessionStorage.setItem(
      DASHBOARD_MONTH_KEY,
      JSON.stringify({
        year,
        month,
      }),
    );

    console.log("======================================");

    console.log("MONTH CHANGED");

    console.log("YEAR:", year);

    console.log("MONTH:", month);

    console.log(
      "MONTH NAME:",
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1, 1)),
    );

    console.log("SAVED TO SESSION STORAGE");

    console.log("======================================");
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
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
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
          TOP HEADER FILTER
      ====================================================== */}

      <div className="dashboard-action-bar">
        <div className="date-filter-pill">
          <Calendar size={15} />

          <span>Viewing reports for</span>

          <div className="month-select-wrapper">
            <select
              value={`${selectedYear}-${selectedMonth}`}
              onChange={handleMonthChange}
              className="dashboard-month-select"
              aria-label="Select dashboard month"
            >
              {monthOptions.map((option) => (
                <option
                  key={`${option.year}-${option.month}`}
                  value={`${option.year}-${option.month}`}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <FaChevronDown
              className="dropdown-icon"
              size={11}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          DASHBOARD STATS
      ====================================================== */}

      <DashboardStats
        dashboardData={dashboardData}
      />

      {/* =====================================================
          RECENT TRANSACTIONS
      ====================================================== */}

      <RecentTransactions
        transactions={recentTransactions}
      />
    </div>
  );
};

export default AdminDashboard;