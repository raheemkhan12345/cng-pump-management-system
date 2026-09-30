import React, { useCallback, useEffect, useState } from "react";

import { Calendar, Undo2 } from "lucide-react";

import DashboardStats from "./DashboardStats";
import RecentTransactions from "./RecentTransactions";

import { getDashboard } from "../../../services/adminApis/dashboardApi";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CURRENT MONTH & YEAR
  // =========================================================

  const currentDate = new Date();

  const currentMonthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDashboard();

      // =====================================================
      // EXTRACT DASHBOARD DATA
      // =====================================================

      let dashboard = {};

      if (
        response?.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        dashboard = response.data;
      } else if (
        response?.dashboard &&
        typeof response.dashboard === "object"
      ) {
        dashboard = response.dashboard;
      } else if (
        response?.dashboardData &&
        typeof response.dashboardData === "object"
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

      if (Array.isArray(dashboard?.recentTransactions)) {
        transactions = dashboard.recentTransactions;
      } else if (Array.isArray(dashboard?.transactions)) {
        transactions = dashboard.transactions;
      } else if (Array.isArray(dashboard?.recentTransaction)) {
        transactions = dashboard.recentTransaction;
      } else if (Array.isArray(response?.recentTransactions)) {
        transactions = response.recentTransactions;
      } else if (Array.isArray(response?.transactions)) {
        transactions = response.transactions;
      }

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
    fetchDashboard();
  }, [fetchDashboard]);

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

          <button type="button" onClick={fetchDashboard}>
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
        {/* DYNAMIC DATE */}

        <div className="date-filter-pill">
          <Calendar size={15} />

          <span>Viewing reports for {currentMonthYear}</span>

          <span className="dropdown-arrow-badge">▾</span>
        </div>

        {/* SUPER DASHBOARD */}

        <button type="button" className="btn-super-admin">
          <div className="icon-circle">
            <Undo2 size={14} />
          </div>

          <span>Super Dashboard</span>
        </button>
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
