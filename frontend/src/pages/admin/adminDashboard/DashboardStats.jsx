import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaBookOpen,
  FaWallet,
  FaLandmark,
  FaCalendarDay,
} from "react-icons/fa6";

import { getAllSales } from "../../../services/adminApis/salesApi";
import "./DashboardStats.css";

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  return new Intl.NumberFormat("en-PK").format(Number(value) || 0);
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSalesArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.sales)) return response.sales;
  if (Array.isArray(response?.data?.sales)) return response.data.sales;
  if (Array.isArray(response?.data?.data)) return response.data.data;

  return [];
};

const DashboardStats = ({ dashboardData = {} }) => {
  const navigate = useNavigate();

  const [dailyStats, setDailyStats] = useState({
    dailySale: 0,
    dailyKg: 0,
  });

  const fetchDailyStats = useCallback(async () => {
    try {
      const response = await getAllSales();
      const sales = getSalesArray(response);
      const today = getTodayDate();

      const todaySales = sales.filter(
        (sale) => sale?.date && String(sale.date).slice(0, 10) === today,
      );

      const dailySale = todaySales.reduce(
        (total, sale) => total + (Number(sale?.amount) || 0),
        0,
      );

      const dailyKg = todaySales.reduce(
        (total, sale) => total + (Number(sale?.cngVolume) || 0),
        0,
      );

      setDailyStats({ dailySale, dailyKg });
    } catch (error) {
      console.error("Failed to fetch daily sales:", error);
    }
  }, []);

  useEffect(() => {
    fetchDailyStats();
  }, [fetchDailyStats]);

  const statsData = [
    {
      id: 1,
      label: "TOTAL SALE",
      value: `Rs. ${formatCurrency(dashboardData.totalSale)}`,
      subtext: "Current balance in counter",
      secondaryValue: `${formatCurrency(dashboardData.totalKg)} KG`,
      secondaryLabel: "Total Volume Dispensed",
      icon: FaMoneyBillWave,
      variant: "card-green total-sale-card",
      path: "/admin/sales-report",
    },
    {
      id: 2,
      label: "DAILY SALE",
      value: `Rs. ${formatCurrency(dailyStats.dailySale)}`,
      subtext: "Today's total sale",
      secondaryValue: `${formatCurrency(dailyStats.dailyKg)} KG`,
      secondaryLabel: "Today's CNG Volume",
      icon: FaCalendarDay,
      variant: "card-teal",
      path: "/admin/sales-report",
    },
    {
      id: 3,
      label: "CASH IN HAND",
      value: `Rs. ${formatCurrency(dashboardData.cashInHand)}`,
      subtext: "Available cash balance",
      icon: FaWallet,
      variant: "card-green",
      path: "/admin/cash-bank",
    },
    {
      id: 4,
      label: "CASH IN BANK",
      value: `Rs. ${formatCurrency(dashboardData.cashInBank)}`,
      subtext: "Available bank balance",
      icon: FaLandmark,
      variant: "card-teal",
      path: "/admin/cash-bank",
    },
    {
      id: 5,
      label: "LOAN TO OTHERS",
      value: `Rs. ${formatCurrency(dashboardData.loanToOthers)}`,
      subtext: "Total receivable",
      variant: "card-grey accent-border-red",
      textVariant: "text-red",
      path: "/admin/loans",
    },
    {
      id: 6,
      label: "LOAN FROM OTHERS",
      value: `Rs. ${formatCurrency(dashboardData.loanFromOthers)}`,
      subtext: "Total outgoings to others",
      icon: FaBookOpen,
      variant: "card-grey accent-border-red",
      textVariant: "text-red",
      iconVariant: "text-red",
      path: "/admin/loans",
    },
    {
      id: 7,
      label: "TOTAL EXPENSES",
      value: `Rs. ${formatCurrency(dashboardData.totalExpenses)}`,
      subtext: "Across all accounts",
      icon: FaLandmark,
      variant: "card-pink",
      path: "/admin/expenses",
    },
  ];

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="stats-grid">
      {statsData.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className={`stat-card ${stat.variant}`}
            onClick={() => handleCardClick(stat.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardClick(stat.path);
              }
            }}
          >
            <div className="card-header">
              <span className={`card-label ${stat.textVariant || ""}`}>
                {stat.label}
              </span>

              {Icon && (
                <Icon className={`card-icon ${stat.iconVariant || ""}`} />
              )}
            </div>

            <div className="card-divider" />

            <div className="card-body">
              <h3 className={`card-amount ${stat.textVariant || ""}`}>
                {stat.value}
              </h3>

              {stat.subtext && <p className="card-subtext">{stat.subtext}</p>}
            </div>

            {stat.secondaryValue && (
              <div className="stat-secondary-info">
                <span className="stat-secondary-label">
                  {stat.secondaryLabel}
                </span>

                <p className="stat-secondary-value">{stat.secondaryValue}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
