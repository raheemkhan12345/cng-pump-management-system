import { useNavigate } from "react-router-dom";

import {
  FaMoneyBillWave,
  FaScaleBalanced,
  FaBookOpen,
  FaBuilding,
} from "react-icons/fa6";

import "./DashboardStats.css";

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0";
  }

  return new Intl.NumberFormat("en-PK").format(Number(value) || 0);
};

const DashboardStats = ({ dashboardData = {} }) => {
  const navigate = useNavigate();

  const statsData = [
    {
      id: 1,
      label: "TOTAL SALE",
      value: `Rs. ${formatCurrency(dashboardData.totalSale)}`,
      subtext: "Current balance in counter",
      icon: FaMoneyBillWave,
      variant: "card-green",
      path: "/admin/sales-report",
    },

    {
      id: 2,
      label: "TOTAL KG",
      value: `${formatCurrency(dashboardData.totalKg)} KG`,
      subtext: "Total volume dispensed",
      icon: FaScaleBalanced,
      variant: "card-teal",
      path: "/admin/sales-report",
    },

    {
      id: 4,
      label: "DIESEL PURCHASED",
      value: `Rs. ${formatCurrency(dashboardData.dieselPurchased?.amount)}`,
      subtext: `${formatCurrency(dashboardData.dieselPurchased?.liters)} liters`,
      variant: "card-pink",
      subtextLarge: true,
      path: "/admin/diesel-expense-history",
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
      icon: FaBuilding,
      variant: "card-pink",
      path: "/admin/expenses",
    },

    {
      id: 8,
      label: "OWNER EXPENSE",
      value: `Rs. ${formatCurrency(dashboardData.ownerExpense)}`,
      variant: "card-grey accent-border-red",
      textVariant: "text-red",
      path: "/admin/owner-expenses",
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
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
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

            <div className="card-body">
              <h2 className={`card-amount ${stat.textVariant || ""}`}>
                {stat.value}
              </h2>

              {stat.subtext && (
                <p
                  className={`card-subtext ${
                    stat.subtextBold ? "bold-subtext" : ""
                  } ${stat.subtextLarge ? "large-subtext" : ""}`}
                >
                  {stat.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
