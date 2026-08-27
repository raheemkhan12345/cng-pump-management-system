import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PlusCircle,
  FileText,
  Banknote,
  Fuel,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { getAllSales } from "../../../services/adminApis/salesApi";

import "./CngSales.css";

import RecordNewSaleModal from "../../../components/adminDashboardForms/recordNewSaleForm/RecordNewSaleModel";

const CngSales = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);

  const [salesStats, setSalesStats] = useState({
    todaySales: 0,
    todayKgSold: 0,
    salesIncreasePercentage: null,
    status: "No sales today",
  });

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================================
  // GET TODAY DATE
  // =========================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // FETCH SALES
  // =========================================================

  const fetchSalesStats = useCallback(async () => {
    try {
      setIsLoading(true);

      setError("");

      // =====================================================
      // CALL GET ALL SALES API
      // =====================================================

      const response = await getAllSales();

      console.log("Get All Sales API Response:", response);

      // =====================================================
      // GET SALES ARRAY
      // =====================================================

      let sales = [];

      if (Array.isArray(response)) {
        sales = response;
      } else if (Array.isArray(response?.data)) {
        sales = response.data;
      } else if (Array.isArray(response?.sales)) {
        sales = response.sales;
      } else if (Array.isArray(response?.data?.sales)) {
        sales = response.data.sales;
      } else if (Array.isArray(response?.data?.data)) {
        sales = response.data.data;
      }

      console.log("Sales Array:", sales);

      // =====================================================
      // TODAY DATE
      // =====================================================

      const today = getTodayDate();

      // =====================================================
      // FILTER TODAY'S SALES
      // =====================================================

      const todaySales = sales.filter((sale) => {
        if (!sale?.date) {
          return false;
        }

        return String(sale.date).slice(0, 10) === today;
      });

      console.log("Today's Sales:", todaySales);

      // =====================================================
      // CALCULATE TODAY TOTAL AMOUNT
      // =====================================================

      const totalTodaySales = todaySales.reduce((total, sale) => {
        return total + (Number(sale?.amount) || 0);
      }, 0);

      // =====================================================
      // CALCULATE TODAY TOTAL KG
      // =====================================================

      const totalTodayKg = todaySales.reduce((total, sale) => {
        return total + (Number(sale?.cngVolume) || 0);
      }, 0);

      // =====================================================
      // YESTERDAY DATE
      // =====================================================

      const todayDateObject = new Date();

      todayDateObject.setDate(todayDateObject.getDate() - 1);

      const yesterdayYear = todayDateObject.getFullYear();

      const yesterdayMonth = String(todayDateObject.getMonth() + 1).padStart(
        2,
        "0",
      );

      const yesterdayDay = String(todayDateObject.getDate()).padStart(2, "0");

      const yesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

      // =====================================================
      // YESTERDAY SALES
      // =====================================================

      const yesterdaySales = sales.filter((sale) => {
        if (!sale?.date) {
          return false;
        }

        return String(sale.date).slice(0, 10) === yesterday;
      });

      // =====================================================
      // YESTERDAY TOTAL
      // =====================================================

      const totalYesterdaySales = yesterdaySales.reduce((total, sale) => {
        return total + (Number(sale?.amount) || 0);
      }, 0);

      // =====================================================
      // SALES INCREASE %
      // =====================================================

      let salesIncreasePercentage = null;

      if (totalYesterdaySales > 0) {
        salesIncreasePercentage = Math.round(
          ((totalTodaySales - totalYesterdaySales) / totalYesterdaySales) * 100,
        );
      }

      // =====================================================
      // STATUS
      // =====================================================

      let status = "No sales today";

      if (totalTodaySales > 0) {
        status = "On track";
      }

      // =====================================================
      // UPDATE STATS
      // =====================================================

      setSalesStats({
        todaySales: totalTodaySales,
        todayKgSold: totalTodayKg,
        salesIncreasePercentage,
        status,
      });
    } catch (error) {
      console.error("Failed to fetch sales:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to load sales data.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchSalesStats();
  }, [fetchSalesStats]);

  // =========================================================
  // OPEN MODAL
  // =========================================================

  const handleOpenNewSaleModal = () => {
    setIsNewSaleModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseNewSaleModal = () => {
    setIsNewSaleModalOpen(false);
  };

  // =========================================================
  // SALE ADDED SUCCESSFULLY
  // =========================================================

  const handleSaleAdded = async (response) => {
    console.log("New Sale Added:", response);

    // =======================================================
    // FETCH LATEST REAL DATA
    // =======================================================

    await fetchSalesStats();

    // =======================================================
    // CLOSE MODAL
    // =======================================================

    setIsNewSaleModalOpen(false);
  };

  // =========================================================
  // SALES REPORT
  // =========================================================

  const handleViewReports = () => {
    navigate("/admin/sales-report");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="cng-sales-page-container">
        <div className="cng-sales-content-wrapper">
          <div className="cng-sales-loading">Loading sales data...</div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="cng-sales-page-container">
        <div className="cng-sales-content-wrapper">
          <div className="cng-sales-error">
            <p>{error}</p>

            <button type="button" onClick={fetchSalesStats}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="cng-sales-page-container">
      <div className="cng-sales-content-wrapper">
        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}

        <div className="cng-sales-action-bar">
          <button
            className="cng-btn-primary-record"
            onClick={handleOpenNewSaleModal}
          >
            <PlusCircle size={20} />

            <span>Record New Sale</span>
          </button>

          <button
            className="cng-btn-secondary-reports"
            onClick={handleViewReports}
          >
            <FileText size={20} />

            <span>View Sales Report</span>
          </button>
        </div>

        {/* ===================================================
            SALES STATS
        =================================================== */}

        <div className="cng-sales-stats-grid">
          {/* =================================================
              TODAY'S TOTAL SALES
          ================================================= */}

          <div className="cng-stat-card cng-sale-card">
            <div className="cng-card-header">
              <span className="cng-card-label">Today's Total Sales</span>

              <Banknote className="cng-card-icon" size={24} strokeWidth={1.5} />
            </div>

            <div className="cng-card-body">
              <h2 className="cng-card-amount">
                Rs. {Number(salesStats.todaySales || 0).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="cng-card-footer cng-footer-positive">
              <TrendingUp size={16} />

              <span>
                {salesStats.salesIncreasePercentage !== null
                  ? `${
                      salesStats.salesIncreasePercentage >= 0 ? "+" : ""
                    }${salesStats.salesIncreasePercentage}% vs yesterday`
                  : "Today's sales"}
              </span>
            </div>
          </div>

          {/* =================================================
              TOTAL KG SOLD
          ================================================= */}

          <div className="cng-stat-card cng-kg-card">
            <div className="cng-card-header">
              <span className="cng-card-label">Total KG Sold</span>

              <Fuel className="cng-card-icon" size={24} strokeWidth={1.5} />
            </div>

            <div className="cng-card-body">
              <h2 className="cng-card-amount">
                {Number(salesStats.todayKgSold || 0).toLocaleString("en-IN")} KG
              </h2>
            </div>

            <div className="cng-card-footer cng-footer-status-green">
              <CheckCircle2 size={16} />

              <span>{salesStats.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RECORD SALE MODAL
      ===================================================== */}

      <RecordNewSaleModal
        isOpen={isNewSaleModalOpen}
        onClose={handleCloseNewSaleModal}
        onSaleAdded={handleSaleAdded}
      />
    </div>
  );
};

export default CngSales;
