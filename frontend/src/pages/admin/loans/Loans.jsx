import { useCallback, useEffect, useState } from "react";

import {
  Plus,
  Landmark,
  TrendingUp,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

import RecordLoanModal from "../../../components/adminDashboardForms/addNewLoanModel/RecordLoanModel";
import EditLoanModal from "../../../components/adminDashboardForms/editLoanModal/EditLoanModal";

import {
  createLoan,
  getAllLoans,
  updateLoan,
  deleteLoan,
} from "../../../services/adminApis/loanApi";

import "./Loans.css";

// =========================================================
// CONSTANTS
// =========================================================

const ITEMS_PER_PAGE = 5;

const DASHBOARD_MONTH_KEY = "cng_dashboard_selected_month";

const EMPTY_LOAN_STATS = {
  thisMonthLoan: 0,
  totalLoansGiven: 0,
  thisMonthRecovery: 0,
  activeLoanStaff: 0,
};

// =========================================================
// GET SELECTED DASHBOARD MONTH
// =========================================================

const getSelectedDashboardMonth = () => {
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
    console.error(
      "Failed to read selected dashboard month:",
      error,
    );
  }

  // =======================================================
  // FALLBACK TO CURRENT MONTH
  // =======================================================

  const currentDate = new Date();

  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
};

// =========================================================
// CHECK WHETHER DATE BELONGS TO SELECTED MONTH
// =========================================================

const isDateInSelectedMonth = (date, selectedYear, selectedMonth) => {
  if (!date) {
    return false;
  }

  // =======================================================
  // HANDLE YYYY-MM-DD FORMAT DIRECTLY
  // =======================================================

  const dateString = String(date).split("T")[0];

  const dateParts = dateString.split("-");

  if (dateParts.length === 3) {
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);

    if (
      Number.isInteger(year) &&
      Number.isInteger(month)
    ) {
      return (
        year === selectedYear &&
        month === selectedMonth
      );
    }
  }

  // =======================================================
  // FALLBACK DATE PARSING
  // =======================================================

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return (
    parsedDate.getFullYear() === selectedYear &&
    parsedDate.getMonth() + 1 === selectedMonth
  );
};

// =========================================================
// GET SELECTED MONTH LABEL
// =========================================================

const getSelectedMonthLabel = (year, month) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
};

// =========================================================
// COMPONENT
// =========================================================

const Loans = () => {
  // =========================================================
  // SELECTED DASHBOARD MONTH
  // =========================================================

  const initialSelectedMonth = getSelectedDashboardMonth();

  const [selectedYear, setSelectedYear] = useState(
    initialSelectedMonth.year,
  );

  const [selectedMonth, setSelectedMonth] = useState(
    initialSelectedMonth.month,
  );

  // =========================================================
  // STATE
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Selected loan for editing
  const [selectedLoan, setSelectedLoan] = useState(null);

  // API states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // =========================================================
  // LOAN TRANSACTIONS
  // =========================================================

  const [loanTransactions, setLoanTransactions] = useState([]);

  // =========================================================
  // LOAN SUMMARY
  // =========================================================

  const [loanStats, setLoanStats] = useState(EMPTY_LOAN_STATS);

  // =========================================================
  // PAYMENT TYPE HELPERS
  // =========================================================

  const convertPaymentModeToApi = (paymentMode) => {
    return paymentMode === "bank" ? "bank transfer" : "cash";
  };

  const convertPaymentTypeToFrontend = (paymentType) => {
    if (
      paymentType === "bank transfer" ||
      paymentType === "bank_transfer" ||
      paymentType === "bank"
    ) {
      return "bank";
    }

    return "cash";
  };

  // =========================================================
  // FORMAT DATE FOR TABLE
  // =========================================================

  const formatDateForTable = (date) => {
    if (!date) {
      return "-";
    }

    const rawDate = String(date).split("T")[0];

    const dateParts = rawDate.split("-");

    if (dateParts.length === 3) {
      return dateParts.reverse().join("-");
    }

    return rawDate;
  };

  // =========================================================
  // GET ALL LOANS
  // =========================================================

  const fetchLoans = useCallback(async () => {
    try {
      setIsLoading(true);

      // =====================================================
      // READ LATEST SELECTED MONTH FROM SESSION STORAGE
      // =====================================================

      const savedMonth = getSelectedDashboardMonth();

      const currentSelectedYear = savedMonth.year;
      const currentSelectedMonth = savedMonth.month;

      // =====================================================
      // KEEP LOCAL STATE IN SYNC
      // =====================================================

      setSelectedYear(currentSelectedYear);
      setSelectedMonth(currentSelectedMonth);

      console.log("======================================");

      console.log("FETCH LOANS");

      console.log("SELECTED YEAR:", currentSelectedYear);

      console.log("SELECTED MONTH:", currentSelectedMonth);

      console.log(
        "SELECTED MONTH NAME:",
        getSelectedMonthLabel(
          currentSelectedYear,
          currentSelectedMonth,
        ),
      );

      console.log("======================================");

      // =====================================================
      // API CALL
      // =====================================================

      const response = await getAllLoans();

      console.log("Loans API Response:", response);

      // =====================================================
      // FIND API DATA
      // =====================================================

      const apiData = response?.data ?? response ?? {};

      // =====================================================
      // LOANS ARRAY
      // =====================================================

      const loansArray = Array.isArray(apiData?.loans)
        ? apiData.loans
        : Array.isArray(apiData)
          ? apiData
          : Array.isArray(apiData?.data)
            ? apiData.data
            : [];

      console.log("TOTAL LOANS FROM API:", loansArray.length);

      // =====================================================
      // FILTER LOANS BY SELECTED MONTH
      // =====================================================

      const selectedMonthLoans = loansArray.filter((loan) => {
        return isDateInSelectedMonth(
          loan?.date,
          currentSelectedYear,
          currentSelectedMonth,
        );
      });

      console.log(
        "SELECTED MONTH LOANS:",
        selectedMonthLoans.length,
      );

      // =====================================================
      // CALCULATE SELECTED MONTH STATISTICS
      // =====================================================

      let selectedMonthLoanGiven = 0;

      let selectedMonthLoanReceived = 0;

      selectedMonthLoans.forEach((loan) => {
        const amount = Number(loan?.amount) || 0;

        if (loan?.loanType === "loan_given") {
          selectedMonthLoanGiven += amount;
        }

        if (loan?.loanType === "loan_received") {
          selectedMonthLoanReceived += amount;
        }
      });

      // =====================================================
      // GET BACKEND SUMMARY
      // =====================================================

      const summary = apiData?.summary || {};

      // =====================================================
      // ACTIVE STAFF
      //
      // Calculate from selected-month records first.
      // Each unique person with a remaining balance > 0
      // is counted.
      // =====================================================

      const activeStaffNames = new Set();

      selectedMonthLoans.forEach((loan) => {
        const remainingBalance = Number(
          loan?.remainingBalance ??
            loan?.remainingBal ??
            loan?.balance ??
            loan?.amount ??
            0,
        );

        const personName =
          loan?.name ||
          loan?.personName ||
          loan?.staffName ||
          "";

        if (
          remainingBalance > 0 &&
          String(personName).trim()
        ) {
          activeStaffNames.add(
            String(personName).trim().toLowerCase(),
          );
        }
      });

      // =====================================================
      // TOTAL LOANS GIVEN
      //
      // Preserve backend value if available because this
      // represents the current outstanding total.
      // =====================================================

      const backendTotalLoansGiven = Number(
        summary?.totalLoanGiven,
      ) || 0;

      const totalLoansGiven =
        backendTotalLoansGiven > 0
          ? backendTotalLoansGiven
          : selectedMonthLoanGiven;

      // =====================================================
      // SET LOAN STATS
      // =====================================================

      setLoanStats({
        thisMonthLoan: selectedMonthLoanGiven,

        totalLoansGiven,

        thisMonthRecovery: selectedMonthLoanReceived,

        activeLoanStaff:
          activeStaffNames.size ||
          Number(summary?.activeLoanStaff) ||
          0,
      });

      // =====================================================
      // FORMAT SELECTED MONTH LOANS
      // =====================================================

      const formattedLoans = selectedMonthLoans.map(
        (loan, index) => {
          // -------------------------------------------------
          // ID
          // -------------------------------------------------

          const loanId =
            loan?._id ||
            loan?.id ||
            `loan-${index}-${Date.now()}`;

          // -------------------------------------------------
          // DATE
          // -------------------------------------------------

          const formattedDate = formatDateForTable(
            loan?.date,
          );

          // -------------------------------------------------
          // LOAN TYPE
          // -------------------------------------------------

          let formattedLoanType = "-";

          if (loan?.loanType === "loan_given") {
            formattedLoanType = "Loan Given";
          } else if (
            loan?.loanType === "loan_received"
          ) {
            formattedLoanType = "Loan Received";
          } else if (loan?.loanType) {
            formattedLoanType = loan.loanType;
          }

          // -------------------------------------------------
          // NAME
          // -------------------------------------------------

          const personName =
            loan?.name ||
            loan?.personName ||
            loan?.staffName ||
            "-";

          // -------------------------------------------------
          // ORIGINAL LOAN AMOUNT
          // -------------------------------------------------

          const amount = Number(loan?.amount) || 0;

          // -------------------------------------------------
          // REMAINING BALANCE
          // -------------------------------------------------

          const remainingBalance = Number(
            loan?.remainingBalance ??
              loan?.remainingBal ??
              loan?.balance ??
              amount,
          );

          // -------------------------------------------------
          // STATUS
          // -------------------------------------------------

          const status =
            loan?.status ||
            (remainingBalance <= 0 ? "paid" : "active");

          // -------------------------------------------------
          // PAYMENT TYPE
          // -------------------------------------------------

          const paymentMode =
            convertPaymentTypeToFrontend(
              loan?.paymentType,
            );

          // -------------------------------------------------
          // RETURN FORMATTED OBJECT
          // -------------------------------------------------

          return {
            id: loanId,

            date: formattedDate,

            staffName: personName,

            type: formattedLoanType,

            amount,

            remainingBal: remainingBalance,

            status,

            loanType:
              loan?.loanType === "loan_received"
                ? "loan_received"
                : "loan_given",

            personName,

            paymentMode,

            transactions: Array.isArray(
              loan?.transactions,
            )
              ? loan.transactions
              : [],
          };
        },
      );

      setLoanTransactions(formattedLoans);

      // =====================================================
      // RESET PAGINATION
      // =====================================================

      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch loans:", error);

      setLoanTransactions([]);

      setLoanStats(EMPTY_LOAN_STATS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // FETCH LOANS ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // =========================================================
  // SYNC WHEN DASHBOARD MONTH CHANGES
  //
  // sessionStorage itself does not trigger React updates.
  // This checks when the page becomes visible/focused again.
  // =========================================================

  useEffect(() => {
    const handleWindowFocus = () => {
      const savedMonth = getSelectedDashboardMonth();

      if (
        savedMonth.year !== selectedYear ||
        savedMonth.month !== selectedMonth
      ) {
        setSelectedYear(savedMonth.year);

        setSelectedMonth(savedMonth.month);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleWindowFocus();
      }
    };

    window.addEventListener(
      "focus",
      handleWindowFocus,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [selectedYear, selectedMonth]);

  // =========================================================
  // REFETCH WHEN SELECTED MONTH CHANGES
  // =========================================================

  useEffect(() => {
    const savedMonth = getSelectedDashboardMonth();

    if (
      savedMonth.year === selectedYear &&
      savedMonth.month === selectedMonth
    ) {
      fetchLoans();
    }
  }, [
    selectedYear,
    selectedMonth,
    fetchLoans,
  ]);

  // =========================================================
  // LOAN STATUS
  // =========================================================

  const getLoanStatus = (loan) => {
    // Backend status has priority
    if (loan?.status === "paid") {
      return "Paid";
    }

    if (loan?.status === "active") {
      return "Active";
    }

    // Fallback
    return Number(loan?.remainingBal) <= 0
      ? "Paid"
      : "Active";
  };

  // =========================================================
  // CREATE NEW LOAN
  // =========================================================

  const handleSaveLoan = async (newLoanData) => {
    try {
      setIsSubmitting(true);

      // =====================================================
      // VALIDATE FORM DATA
      // =====================================================

      if (
        !newLoanData?.date ||
        !newLoanData?.personName?.trim() ||
        !newLoanData?.amount
      ) {
        console.error(
          "Invalid loan form data:",
          newLoanData,
        );

        return;
      }

      // =====================================================
      // CREATE PAYLOAD
      // =====================================================

      const payload = {
        date: newLoanData.date,

        loanType:
          newLoanData.loanType === "loan_given"
            ? "loan_given"
            : "loan_received",

        name: newLoanData.personName.trim(),

        amount: Number(newLoanData.amount),

        paymentType: convertPaymentModeToApi(
          newLoanData.paymentMode,
        ),
      };

      // =====================================================
      // CREATE API
      // =====================================================

      const response = await createLoan(payload);

      console.log(
        "Create Loan API Response:",
        response,
      );

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setIsModalOpen(false);

      window.alert("Loan created successfully.");
    } catch (error) {
      console.error("CREATE LOAN FAILED");

      console.error("Axios Error:", error);

      console.error(
        "Status:",
        error?.response?.status,
      );

      console.error(
        "API Error Response:",
        error?.response?.data,
      );

      console.error(
        "API Error Message:",
        error?.response?.data?.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEdit = (loan) => {
    if (isSubmitting) {
      return;
    }

    // =====================================================
    // PREVENT EDITING PAID LOAN
    // =====================================================

    if (
      loan?.status === "paid" ||
      Number(loan?.remainingBal) <= 0
    ) {
      window.alert(
        "This loan is already fully paid and cannot be updated.",
      );

      return;
    }

    // =====================================================
    // CONVERT TABLE DATE
    // =====================================================

    let editDate = new Date()
      .toISOString()
      .split("T")[0];

    if (loan?.date && loan.date !== "-") {
      const dateParts = loan.date.split("-");

      if (dateParts.length === 3) {
        editDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    // =====================================================
    // SET SELECTED LOAN
    // =====================================================

    const selectedLoanData = {
      id: loan.id,

      date: editDate,

      loanType:
        loan.loanType ||
        (loan.type === "Loan Received"
          ? "loan_received"
          : "loan_given"),

      personName:
        loan.personName ||
        loan.staffName ||
        "",

      amount: loan.amount ?? "",

      paymentMode:
        loan.paymentMode === "bank transfer" ||
        loan.paymentMode === "bank_transfer" ||
        loan.paymentMode === "bank"
          ? "bank"
          : "cash",
    };

    console.log(
      "Selected Loan For Edit:",
      selectedLoanData,
    );

    setSelectedLoan(selectedLoanData);

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    setIsEditModalOpen(true);
  };

  // =========================================================
  // UPDATE LOAN
  // =========================================================

  const handleUpdateLoan = async (updatedLoanData) => {
    try {
      setIsSubmitting(true);

      // =====================================================
      // VALIDATE LOAN ID
      // =====================================================

      if (!selectedLoan?.id) {
        console.error(
          "Update Loan Error: Loan ID is missing.",
        );

        return;
      }

      // =====================================================
      // VALIDATE FORM DATA
      // =====================================================

      if (
        !updatedLoanData?.date ||
        !updatedLoanData?.personName?.trim() ||
        !updatedLoanData?.amount ||
        !updatedLoanData?.loanType ||
        !updatedLoanData?.paymentMode
      ) {
        console.error(
          "Invalid update loan form data:",
          updatedLoanData,
        );

        return;
      }

      // =====================================================
      // UPDATE PAYLOAD
      // =====================================================

      const payload = {
        date: updatedLoanData.date,

        loanType:
          updatedLoanData.loanType === "loan_given"
            ? "loan_given"
            : "loan_received",

        name: updatedLoanData.personName.trim(),

        amount: Number(updatedLoanData.amount),

        paymentType: convertPaymentModeToApi(
          updatedLoanData.paymentMode,
        ),
      };

      // =====================================================
      // UPDATE API
      // =====================================================

      const response = await updateLoan(
        selectedLoan.id,
        payload,
      );

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      // =====================================================
      // CLOSE EDIT MODAL
      // =====================================================

      setIsEditModalOpen(false);

      setSelectedLoan(null);

      window.alert(
        "Loan updated successfully.",
        response,
      );
    } catch (error) {
      console.error("UPDATE LOAN FAILED");

      console.error("Axios Error:", error);

      console.error(
        "Update Loan Status:",
        error?.response?.status,
      );

      console.error(
        "Update Loan API Error Response:",
        error?.response?.data,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to update loan. Please try again.";

      console.error(
        "Update Loan API Error Message:",
        errorMessage,
      );

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEditModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsEditModalOpen(false);

    setSelectedLoan(null);
  };

  // =========================================================
  // DELETE LOAN
  // =========================================================

  const handleDelete = async (loan) => {
    // =====================================================
    // PREVENT DUPLICATE REQUEST
    // =====================================================

    if (isSubmitting) {
      return;
    }

    // =====================================================
    // VALIDATE LOAN ID
    // =====================================================

    if (!loan?.id) {
      console.error(
        "Delete Loan Error: Loan ID is missing.",
      );

      return;
    }

    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const shouldDelete = window.confirm(
      `Are you sure you want to delete the loan record for "${loan.staffName}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================================
      // DELETE API
      // =====================================================

      const response = await deleteLoan(loan.id);

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      window.alert(
        "Loan deleted successfully.",
        response,
      );
    } catch (error) {
      console.error("DELETE LOAN FAILED");

      console.error("Axios Error:", error);

      console.error(
        "Delete Loan Status:",
        error?.response?.status,
      );

      console.error(
        "Delete Loan API Error Response:",
        error?.response?.data,
      );

      console.error(
        "Delete Loan API Error Message:",
        error?.response?.data?.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // CURRENCY FORMATTER
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK").format(
      Number(amount) || 0,
    );
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalResults = loanTransactions.length;

  const totalPages = Math.ceil(
    totalResults / ITEMS_PER_PAGE,
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    totalResults,
  );

  const currentTransactions = loanTransactions.slice(
    startIndex,
    endIndex,
  );

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (previousPage) => previousPage - 1,
      );
    }
  };

  // =========================================================
  // NEXT PAGE
  // =========================================================

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(
        (previousPage) => previousPage + 1,
      );
    }
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const handleOpenModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE CREATE MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
  };

  // =========================================================
  // SELECTED MONTH LABEL
  // =========================================================

  const selectedMonthLabel = getSelectedMonthLabel(
    selectedYear,
    selectedMonth,
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="loan-page-container">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="loan-header-section">
        <div>
          <h1 className="loan-page-title">Loans</h1>

          <p className="loan-page-subtitle">
            Manage staff loans, recoveries, and outstanding
            balances.
          </p>

          {/* SELECTED MONTH */}

          <p className="loan-selected-month">
            Showing data for{" "}
            <strong>{selectedMonthLabel}</strong>
          </p>
        </div>

        <div className="loan-header-actions">
          <button
            type="button"
            className="loan-btn-primary"
            onClick={handleOpenModal}
            disabled={isSubmitting}
          >
            <Plus size={18} />

            <span>New Loan Application</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="loan-stats-grid">
        {/* THIS MONTH LOAN */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark
              size={18}
              className="loan-icon-gray"
            />
          </div>

          <span className="loan-stat-label">
            {selectedMonthLabel} Loan
          </span>

          <h2 className="loan-stat-value">
            Rs.{" "}
            {formatCurrency(
              loanStats.thisMonthLoan,
            )}
          </h2>
        </div>

        {/* TOTAL LOANS GIVEN */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark
              size={18}
              className="loan-icon-gray"
            />
          </div>

          <span className="loan-stat-label">
            Total Loans Given
          </span>

          <h2 className="loan-stat-value">
            Rs.{" "}
            {formatCurrency(
              loanStats.totalLoansGiven,
            )}
          </h2>

          <span className="loan-stat-sub">
            Current outstanding
          </span>
        </div>

        {/* SELECTED MONTH LOAN RECEIVED */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <TrendingUp
              size={18}
              className="loan-icon-gray"
            />
          </div>

          <span className="loan-stat-label">
            {selectedMonthLabel} Loan Received
          </span>

          <h2 className="loan-stat-value loan-text-green">
            Rs.{" "}
            {formatCurrency(
              loanStats.thisMonthRecovery,
            )}
          </h2>
        </div>

        {/* ACTIVE STAFF */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Users
              size={18}
              className="loan-icon-gray"
            />
          </div>

          <span className="loan-stat-label">
            Active Loan Staff
          </span>

          <h2 className="loan-stat-value">
            {loanStats.activeLoanStaff}{" "}
            <span className="loan-unit-text">
              members
            </span>
          </h2>
        </div>
      </div>

      {/* =====================================================
          TRANSACTIONS
      ====================================================== */}

      <div className="loan-table-card">
        {/* TABLE HEADER */}

        <div className="loan-table-header">
          <h3 className="loan-table-title">
            {selectedMonthLabel} Loan Transactions
          </h3>

          <button
            type="button"
            className="loan-filter-btn"
            title="Filter Loans"
          >
            <Filter size={16} />
          </button>
        </div>

        {/* TABLE */}

        <div className="loan-table-wrapper">
          <table className="loan-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>NAME</th>
                <th>TYPE</th>
                <th>AMOUNT (RS.)</th>
                <th>REMAINING BAL.</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="loan-empty-state"
                  >
                    Loading loans...
                  </td>
                </tr>
              ) : currentTransactions.length > 0 ? (
                currentTransactions.map((item) => {
                  const status = getLoanStatus(item);

                  return (
                    <tr key={item.id}>
                      {/* DATE */}

                      <td className="loan-text-muted">
                        {item.date}
                      </td>

                      {/* NAME */}

                      <td className="loan-font-bold">
                        {item.staffName}
                      </td>

                      {/* TYPE */}

                      <td className="loan-text-muted">
                        {item.type}
                      </td>

                      {/* AMOUNT */}

                      <td
                        className={
                          item.type ===
                          "Loan Received"
                            ? "loan-text-green loan-font-bold"
                            : "loan-font-bold"
                        }
                      >
                        Rs.{" "}
                        {formatCurrency(
                          item.amount,
                        )}
                      </td>

                      {/* REMAINING BALANCE */}

                      <td className="loan-text-muted">
                        Rs.{" "}
                        {formatCurrency(
                          item.remainingBal,
                        )}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`loan-badge ${
                            status === "Paid"
                              ? "loan-badge-paid"
                              : "loan-badge-active"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="loan-actions-cell">
                        {/* EDIT */}

                        <button
                          type="button"
                          className="loan-action-btn loan-edit-btn"
                          title="Edit"
                          aria-label={`Edit loan for ${item.staffName}`}
                          onClick={() =>
                            handleEdit(item)
                          }
                          disabled={
                            isSubmitting ||
                            item.status ===
                              "paid" ||
                            Number(
                              item.remainingBal,
                            ) <= 0
                          }
                        >
                          <Pencil size={11} />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="loan-action-btn loan-delete-btn"
                          title="Delete"
                          aria-label={`Delete loan for ${item.staffName}`}
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={isSubmitting}
                        >
                          <Trash2 size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="loan-empty-state"
                  >
                    No loan transactions found for{" "}
                    {selectedMonthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalResults > 0 && (
          <div className="loan-table-footer">
            <span className="loan-pagination-info">
              Showing <b>{startIndex + 1}</b> to{" "}
              <b>{endIndex}</b> of{" "}
              <b>{totalResults}</b> entries
            </span>

            <div className="loan-pagination-controls">
              {/* PREVIOUS */}

              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {/* PAGE NUMBERS */}

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`loan-page-btn ${
                    currentPage === page
                      ? "loan-page-active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}

              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={
                  currentPage === totalPages
                }
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE LOAN MODAL
      ====================================================== */}

      <RecordLoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLoan}
        isSubmitting={isSubmitting}
      />

      {/* =====================================================
          EDIT LOAN MODAL
      ====================================================== */}

      <EditLoanModal
        key={selectedLoan?.id || "new"}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateLoan}
        isSubmitting={isSubmitting}
        initialData={selectedLoan}
      />
    </div>
  );
};

export default Loans;