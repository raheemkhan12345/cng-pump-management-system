import { useCallback, useEffect, useMemo, useState } from "react";

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

const ITEMS_PER_PAGE = 5;
const DASHBOARD_MONTH_KEY = "cng_dashboard_selected_month";

const EMPTY_LOAN_STATS = {
  thisMonthLoan: 0,
  totalLoansGiven: 0,
  thisMonthRecovery: 0,
  activeLoanStaff: 0,
};

// =========================================================
// LOAN TYPE HELPERS
// =========================================================

const normalizeLoanType = (loanType) => {
  if (loanType === "loan_recover") {
    return "loan_recovery";
  }

  return loanType || "loan_given";
};

const formatLoanType = (loanType) => {
  const labels = {
    loan_given: "Loan Given",
    loan_received: "Loan Received",
    loan_return: "Loan Return",
    loan_recovery: "Loan Recovery",
  };

  const normalizedType = normalizeLoanType(loanType);

  return labels[normalizedType] || normalizedType || "-";
};

// =========================================================
// DASHBOARD MONTH HELPERS
// =========================================================

const getSelectedDashboardMonth = () => {
  const currentDate = new Date();

  const defaultMonth = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };

  try {
    const savedMonth = sessionStorage.getItem(DASHBOARD_MONTH_KEY);

    if (!savedMonth) {
      return defaultMonth;
    }

    const parsed = JSON.parse(savedMonth);

    const year = Number(parsed?.year);
    const month = Number(parsed?.month);

    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      month >= 1 &&
      month <= 12
    ) {
      return { year, month };
    }
  } catch (error) {
    console.error("Failed to read selected dashboard month:", error);
  }

  return defaultMonth;
};

const isDateInSelectedMonth = (date, selectedYear, selectedMonth) => {
  if (!date) return false;

  // Use the calendar date returned by the API.
  // Avoid timezone shifts caused by parsing ISO timestamps.
  const dateString = String(date).slice(0, 10);
  const parts = dateString.split("-");

  if (parts.length !== 3) return false;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  return (
    year === selectedYear && month === selectedMonth && day >= 1 && day <= 31
  );
};

const getSelectedMonthLabel = (year, month) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.response?.data?.msg ||
  error?.response?.data?.errors?.[0]?.message ||
  error?.message ||
  fallback;

// =========================================================
// LOANS COMPONENT
// =========================================================

const Loans = () => {
  const [selectedMonthData, setSelectedMonthData] = useState(
    getSelectedDashboardMonth,
  );

  const selectedYear = selectedMonthData.year;
  const selectedMonth = selectedMonthData.month;

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedLoan, setSelectedLoan] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Keep ALL fetched loan records here.
  // Selected-month filtering is performed separately below.
  const [loanTransactions, setLoanTransactions] = useState([]);

  // =========================================================
  // PAYMENT TYPE HELPERS
  // =========================================================

  const convertPaymentModeToApi = (paymentMode) =>
    paymentMode === "bank" ? "bank transfer" : "cash";

  const convertPaymentTypeToFrontend = (paymentType) => {
    const method = String(paymentType || "")
      .trim()
      .toLowerCase();

    if (
      method === "bank transfer" ||
      method === "bank_transfer" ||
      method === "bank"
    ) {
      return "bank";
    }

    return "cash";
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDateForTable = (date) => {
    if (!date) return "-";

    const rawDate = String(date).slice(0, 10);
    const dateParts = rawDate.split("-");

    if (dateParts.length === 3) {
      return dateParts.reverse().join("-");
    }

    return rawDate;
  };

  // =========================================================
  // FETCH ALL LOANS
  // =========================================================

  const fetchLoans = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getAllLoans();

      const apiData = response?.data ?? response ?? {};

      let loansArray = [];

      if (Array.isArray(apiData)) {
        loansArray = apiData;
      } else if (Array.isArray(apiData?.loans)) {
        loansArray = apiData.loans;
      } else if (Array.isArray(apiData?.data)) {
        loansArray = apiData.data;
      } else if (Array.isArray(apiData?.data?.loans)) {
        loansArray = apiData.data.loans;
      }

      // Normalize every record. Do not filter by month here.
      const formattedLoans = loansArray.map((loan, index) => {
        const loanId =
          loan?._id || loan?.id || `loan-${index}-${String(loan?.date || "")}`;

        const rawLoanType = normalizeLoanType(loan?.loanType);

        const personName =
          loan?.name || loan?.personName || loan?.staffName || "-";

        const rawBalance =
          loan?.remainingBalance ?? loan?.remainingBal ?? loan?.balance;

        const remainingBalance =
          rawBalance === null || rawBalance === undefined || rawBalance === ""
            ? 0
            : Number(rawBalance) || 0;

        return {
          id: loanId,
          rawDate: loan?.date || "",
          date: formatDateForTable(loan?.date),
          staffName: personName,
          personName,
          type: formatLoanType(rawLoanType),
          loanType: rawLoanType,
          amount: Number(loan?.amount) || 0,
          remainingBal: remainingBalance,
          status: String(
            loan?.status || (remainingBalance <= 0 ? "paid" : "active"),
          ).toLowerCase(),
          paymentMode: convertPaymentTypeToFrontend(
            loan?.paymentType ?? loan?.paymentMode,
          ),
          transactions: Array.isArray(loan?.transactions)
            ? loan.transactions
            : [],
          againstLoan: loan?.againstLoan || null,
          allocations: Array.isArray(loan?.allocations) ? loan.allocations : [],
        };
      });

      setLoanTransactions(formattedLoans);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch loans:", error);

      setLoanTransactions([]);

      window.alert(
        getErrorMessage(error, "Failed to load loans. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // =========================================================
  // SYNC MONTH FROM DASHBOARD SESSION STORAGE
  // =========================================================

  useEffect(() => {
    const syncSelectedMonth = () => {
      const savedMonth = getSelectedDashboardMonth();

      setSelectedMonthData((previous) => {
        if (
          previous.year === savedMonth.year &&
          previous.month === savedMonth.month
        ) {
          return previous;
        }

        return savedMonth;
      });
    };

    // Session storage changes made in the same tab do not trigger
    // the standard "storage" event. Focus and visibility also help
    // synchronize when navigating between dashboard pages.
    window.addEventListener("focus", syncSelectedMonth);
    window.addEventListener("storage", syncSelectedMonth);
    document.addEventListener("visibilitychange", syncSelectedMonth);

    return () => {
      window.removeEventListener("focus", syncSelectedMonth);
      window.removeEventListener("storage", syncSelectedMonth);
      document.removeEventListener("visibilitychange", syncSelectedMonth);
    };
  }, []);

  // =========================================================
  // FILTER TRANSACTIONS FOR THE SELECTED MONTH
  // =========================================================

  const filteredLoanTransactions = useMemo(() => {
    return loanTransactions.filter((loan) =>
      isDateInSelectedMonth(loan.rawDate, selectedYear, selectedMonth),
    );
  }, [loanTransactions, selectedYear, selectedMonth]);

  // =========================================================
  // MONTHLY STATISTICS
  // =========================================================

  const loanStats = useMemo(() => {
    let thisMonthLoan = 0;
    let loanReceived = 0;
    let loanReturned = 0;
    let totalLoansGiven = 0;

    const activeStaff = new Set();

    filteredLoanTransactions.forEach((loan) => {
      const amount = Number(loan.amount) || 0;
      const remainingBalance = Number(loan.remainingBal) || 0;

      if (loan.loanType === "loan_given") {
        thisMonthLoan += amount;

        // Outstanding amount comes from the backend's balance field.
        totalLoansGiven += Math.max(remainingBalance, 0);
      }

      if (loan.loanType === "loan_received") {
        loanReceived += amount;
      }

      if (loan.loanType === "loan_return") {
        loanReturned += amount;
      }

      // Count people who have a positive outstanding balance.
      if (remainingBalance > 0 && loan.personName !== "-") {
        activeStaff.add(loan.personName.trim().toLowerCase());
      }
    });

    return {
      thisMonthLoan,
      totalLoansGiven,
      // Calculate the selected month's net received amount.
      // This is based only on records from the selected month.
      thisMonthRecovery: loanReceived - loanReturned,
      activeLoanStaff: activeStaff.size,
    };
  }, [filteredLoanTransactions]);

  // =========================================================
  // RESET PAGE WHEN MONTH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedMonth]);

  // =========================================================
  // LOAN STATUS
  // =========================================================

  const getLoanStatus = (loan) => {
    if (loan?.status === "paid") return "Paid";

    if (loan?.status === "active") return "Active";

    return Number(loan?.remainingBal) <= 0 ? "Paid" : "Active";
  };

  // =========================================================
  // CREATE LOAN
  // =========================================================

  const handleSaveLoan = async (newLoanData) => {
    if (isSubmitting) return;

    const personName = newLoanData?.personName?.trim();
    const amount = Number(newLoanData?.amount);

    if (
      !newLoanData?.date ||
      !personName ||
      newLoanData?.amount === "" ||
      newLoanData?.amount === null ||
      newLoanData?.amount === undefined ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !newLoanData?.loanType ||
      !newLoanData?.paymentMode
    ) {
      window.alert(
        "Please enter a valid date, person name, loan type, payment method, and amount.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        date: newLoanData.date,
        loanType: normalizeLoanType(newLoanData.loanType),
        name: personName,
        amount,
        paymentType: convertPaymentModeToApi(newLoanData.paymentMode),
      };

      await createLoan(payload);
      await fetchLoans();

      setIsModalOpen(false);

      window.alert("Loan created successfully.");
    } catch (error) {
      console.error("Create Loan Error:", error);

      window.alert(
        getErrorMessage(error, "Failed to create loan. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEdit = (loan) => {
    if (isSubmitting) return;

    if (loan?.status === "paid" || Number(loan?.remainingBal) <= 0) {
      window.alert("This loan is already fully paid and cannot be updated.");
      return;
    }

    let editDate = new Date().toISOString().slice(0, 10);

    if (loan?.rawDate) {
      editDate = String(loan.rawDate).slice(0, 10);
    }

    const selectedLoanData = {
      id: loan.id,
      date: editDate,
      loanType: normalizeLoanType(loan.loanType),
      personName: loan.personName || loan.staffName || "",
      amount: loan.amount ?? "",
      paymentMode: convertPaymentTypeToFrontend(loan.paymentMode),
    };

    setSelectedLoan(selectedLoanData);
    setIsEditModalOpen(true);
  };

  // =========================================================
  // UPDATE LOAN
  // =========================================================

  const handleUpdateLoan = async (updatedLoanData) => {
    if (isSubmitting) return;

    if (!selectedLoan?.id) {
      window.alert("Unable to update loan because the loan ID is missing.");
      return;
    }

    const personName = updatedLoanData?.personName?.trim();
    const amount = Number(updatedLoanData?.amount);

    if (
      !updatedLoanData?.date ||
      !personName ||
      updatedLoanData?.amount === "" ||
      updatedLoanData?.amount === null ||
      updatedLoanData?.amount === undefined ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !updatedLoanData?.paymentMode
    ) {
      window.alert(
        "Please enter a valid date, person name, payment method, and amount.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        date: updatedLoanData.date,

        // Preserve the existing loan type because the edit modal
        // no longer allows changing it.
        loanType: normalizeLoanType(selectedLoan.loanType),

        name: personName,
        amount,
        paymentType: convertPaymentModeToApi(updatedLoanData.paymentMode),
      };

      await updateLoan(selectedLoan.id, payload);

      await fetchLoans();

      setIsEditModalOpen(false);
      setSelectedLoan(null);

      window.alert("Loan updated successfully.");
    } catch (error) {
      console.error("Update Loan Error:", error);

      window.alert(
        getErrorMessage(error, "Failed to update loan. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEditModal = () => {
    if (isSubmitting) return;

    setIsEditModalOpen(false);
    setSelectedLoan(null);
  };

  // =========================================================
  // DELETE LOAN
  // =========================================================

  const handleDelete = async (loan) => {
    if (isSubmitting) return;

    if (!loan?.id) {
      window.alert("Unable to delete loan because the loan ID is missing.");
      return;
    }

    const shouldDelete = window.confirm(
      `Are you sure you want to delete the loan record for "${loan.staffName}"?`,
    );

    if (!shouldDelete) return;

    try {
      setIsSubmitting(true);

      await deleteLoan(loan.id);
      await fetchLoans();

      window.alert("Loan deleted successfully.");
    } catch (error) {
      console.error("Delete Loan Error:", error);

      window.alert(
        getErrorMessage(error, "Failed to delete loan. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // CURRENCY FORMATTER
  // =========================================================

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK").format(Number(amount) || 0);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalResults = filteredLoanTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = filteredLoanTransactions.slice(
    startIndex,
    endIndex,
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // OPEN / CLOSE CREATE MODAL
  // =========================================================

  const handleOpenModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
  };

  // =========================================================
  // SELECTED MONTH LABEL
  // =========================================================

  const selectedMonthLabel = getSelectedMonthLabel(selectedYear, selectedMonth);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="loan-page-container">
      {/* HEADER */}

      <div className="loan-header-section">
        <div>
          <h1 className="loan-page-title">Loans</h1>

          <p className="loan-page-subtitle">
            Manage staff loans, recoveries, and outstanding balances.
          </p>

          <p className="loan-selected-month">
            Showing data for <strong>{selectedMonthLabel}</strong>
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

      {/* STATISTICS */}

      <div className="loan-stats-grid">
        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">
            {selectedMonthLabel} Loans Given
          </span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.totalLoansGiven)}
          </h2>

          <span className="loan-stat-sub">Outstanding balance</span>
        </div>

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <TrendingUp size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">
            {selectedMonthLabel} Loan Received
          </span>

          <h2 className="loan-stat-value loan-text-green">
            Rs. {formatCurrency(loanStats.thisMonthRecovery)}
          </h2>
        </div>

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Users size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">
            {selectedMonthLabel} Active Loans
          </span>

          <h2 className="loan-stat-value">
            {loanStats.activeLoanStaff}{" "}
            <span className="loan-unit-text">members</span>
          </h2>
        </div>
      </div>

      {/* TRANSACTIONS */}

      <div className="loan-table-card">
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
                  <td colSpan="7" className="loan-empty-state">
                    Loading loans...
                  </td>
                </tr>
              ) : currentTransactions.length > 0 ? (
                currentTransactions.map((item) => {
                  const status = getLoanStatus(item);

                  return (
                    <tr key={item.id}>
                      <td className="loan-text-muted">{item.date}</td>

                      <td className="loan-font-bold">{item.staffName}</td>

                      <td className="loan-text-muted">{item.type}</td>

                      <td
                        className={
                          item.loanType === "loan_received"
                            ? "loan-text-green loan-font-bold"
                            : "loan-font-bold"
                        }
                      >
                        Rs. {formatCurrency(item.amount)}
                      </td>

                      <td className="loan-text-muted">
                        Rs. {formatCurrency(item.remainingBal)}
                      </td>

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

                      <td className="loan-actions-cell">
                        <button
                          type="button"
                          className="loan-action-btn loan-edit-btn"
                          title="Edit"
                          aria-label={`Edit loan for ${item.staffName}`}
                          onClick={() => handleEdit(item)}
                          disabled={
                            isSubmitting ||
                            item.status === "paid" ||
                            Number(item.remainingBal) <= 0
                          }
                        >
                          <Pencil size={11} />
                        </button>

                        <button
                          type="button"
                          className="loan-action-btn loan-delete-btn"
                          title="Delete"
                          aria-label={`Delete loan for ${item.staffName}`}
                          onClick={() => handleDelete(item)}
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
                  <td colSpan="7" className="loan-empty-state">
                    No loan transactions found for {selectedMonthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {totalResults > 0 && (
          <div className="loan-table-footer">
            <span className="loan-pagination-info">
              Showing <b>{startIndex + 1}</b> to <b>{endIndex}</b> of{" "}
              <b>{totalResults}</b> entries
            </span>

            <div className="loan-pagination-controls">
              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`loan-page-btn ${
                    currentPage === page ? "loan-page-active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="loan-page-btn loan-page-arrow"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE LOAN MODAL */}

      <RecordLoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLoan}
        isSubmitting={isSubmitting}
      />

      {/* EDIT LOAN MODAL */}

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
