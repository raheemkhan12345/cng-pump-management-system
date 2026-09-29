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

  /**
   * ==========================================
   * GET DASHBOARD DATA
   * ==========================================
   */
  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("========================================");
      console.log("GET DASHBOARD");
      console.log("GET DASHBOARD API REQUEST");
      console.log("========================================");

      const response = await getDashboard();

      console.log("========================================");
      console.log("GET DASHBOARD API RESPONSE:");
      console.log(response);
      console.log("========================================");

      /**
       * ======================================
       * EXTRACT DASHBOARD DATA
       * ======================================
       *
       * Supports common response formats:
       *
       * response.data
       * response.dashboard
       * response.dashboardData
       * response
       */

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

      /**
       * ======================================
       * EXTRACT RECENT TRANSACTIONS
       * ======================================
       */

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

      console.log("FINAL DASHBOARD DATA:", dashboard);

      console.log("FINAL RECENT TRANSACTIONS:", transactions);

      setDashboardData(dashboard);

      setRecentTransactions(transactions);
    } catch (error) {
      console.error("========================================");

      console.error("FAILED TO GET DASHBOARD");

      console.error("ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error(
        "SERVER RESPONSE:",
        JSON.stringify(error?.response?.data, null, 2),
      );

      console.error("========================================");

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

  /**
   * ==========================================
   * FETCH DASHBOARD ON PAGE LOAD
   * ==========================================
   */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /**
   * ==========================================
   * LOADING
   * ==========================================
   */
  if (isLoading) {
    return (
      <div className="admin-dashboard-wrapper">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  /**
   * ==========================================
   * ERROR
   * ==========================================
   */
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

  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */
  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Header Filter & Action Bar */}
      <div className="dashboard-action-bar">
        <div className="date-filter-pill">
          <Calendar size={15} />

          <span>Viewing reports for August 2026</span>

          <span className="dropdown-arrow-badge">▾</span>
        </div>

        <button type="button" className="btn-super-admin">
          <div className="icon-circle">
            <Undo2 size={14} />
          </div>

          <span>Super Dashboard</span>
        </button>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats dashboardData={dashboardData} />

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
};

export default AdminDashboard;
