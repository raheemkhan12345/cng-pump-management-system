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

const ITEMS_PER_PAGE = 5;
const DASHBOARD_MONTH_KEY = "cng_dashboard_selected_month";

const EMPTY_LOAN_STATS = {
  thisMonthLoan: 0,
  totalLoansGiven: 0,
  thisMonthRecovery: 0,
  activeLoanStaff: 0,
};

// GET SELECTED DASHBOARD MONTH
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
    console.error("Failed to read selected dashboard month:", error);
  }

  const currentDate = new Date();

  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
};

// CHECK WHETHER DATE BELONGS TO SELECTED MONTH
const isDateInSelectedMonth = (date, selectedYear, selectedMonth) => {
  if (!date) return false;

  const dateString = String(date).split("T")[0];
  const dateParts = dateString.split("-");

  if (dateParts.length === 3) {
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);

    if (Number.isInteger(year) && Number.isInteger(month)) {
      return year === selectedYear && month === selectedMonth;
    }
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return false;

  return (
    parsedDate.getFullYear() === selectedYear &&
    parsedDate.getMonth() + 1 === selectedMonth
  );
};

// GET SELECTED MONTH LABEL
const getSelectedMonthLabel = (year, month) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

// GET ERROR MESSAGE
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.response?.data?.msg ||
  error?.response?.data?.errors?.[0]?.message ||
  error?.message ||
  fallback;

const Loans = () => {
  // SELECTED DASHBOARD MONTH
  const initialSelectedMonth = getSelectedDashboardMonth();

  const [selectedYear, setSelectedYear] = useState(initialSelectedMonth.year);

  const [selectedMonth, setSelectedMonth] = useState(
    initialSelectedMonth.month,
  );

  // STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [loanTransactions, setLoanTransactions] = useState([]);
  const [loanStats, setLoanStats] = useState(EMPTY_LOAN_STATS);

  // PAYMENT TYPE HELPERS
  const convertPaymentModeToApi = (paymentMode) =>
    paymentMode === "bank" ? "bank transfer" : "cash";

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

  // FORMAT DATE FOR TABLE
  const formatDateForTable = (date) => {
    if (!date) return "-";

    const rawDate = String(date).split("T")[0];
    const dateParts = rawDate.split("-");

    if (dateParts.length === 3) {
      return dateParts.reverse().join("-");
    }

    return rawDate;
  };

  // GET ALL LOANS
  const fetchLoans = useCallback(async () => {
    try {
      setIsLoading(true);

      const savedMonth = getSelectedDashboardMonth();

      const currentSelectedYear = savedMonth.year;
      const currentSelectedMonth = savedMonth.month;

      setSelectedYear(currentSelectedYear);
      setSelectedMonth(currentSelectedMonth);

      const response = await getAllLoans();

      // EXTRACT API DATA
      const apiData = response?.data ?? response ?? {};

      // EXTRACT LOANS ARRAY
      const loansArray = Array.isArray(apiData?.loans)
        ? apiData.loans
        : Array.isArray(apiData)
          ? apiData
          : Array.isArray(apiData?.data)
            ? apiData.data
            : [];

      // FILTER LOANS BY SELECTED MONTH
      const selectedMonthLoans = loansArray.filter((loan) =>
        isDateInSelectedMonth(
          loan?.date,
          currentSelectedYear,
          currentSelectedMonth,
        ),
      );

      // CALCULATE SELECTED MONTH STATISTICS
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

      // BACKEND SUMMARY
      const summary = apiData?.summary || {};

      // ACTIVE LOAN STAFF
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
          loan?.name || loan?.personName || loan?.staffName || "";

        if (remainingBalance > 0 && String(personName).trim()) {
          activeStaffNames.add(String(personName).trim().toLowerCase());
        }
      });

      // TOTAL LOANS GIVEN
      const backendTotalLoansGiven = Number(summary?.totalLoanGiven) || 0;

      const totalLoansGiven =
        backendTotalLoansGiven > 0
          ? backendTotalLoansGiven
          : selectedMonthLoanGiven;

      // UPDATE LOAN STATISTICS
      setLoanStats({
        thisMonthLoan: selectedMonthLoanGiven,
        totalLoansGiven,
        thisMonthRecovery: selectedMonthLoanReceived,
        activeLoanStaff:
          activeStaffNames.size || Number(summary?.activeLoanStaff) || 0,
      });

      // FORMAT LOAN TRANSACTIONS
      const formattedLoans = selectedMonthLoans.map((loan, index) => {
        const loanId = loan?._id || loan?.id || `loan-${index}-${Date.now()}`;

        const formattedDate = formatDateForTable(loan?.date);

        let formattedLoanType = "-";

        if (loan?.loanType === "loan_given") {
          formattedLoanType = "Loan Given";
        } else if (loan?.loanType === "loan_received") {
          formattedLoanType = "Loan Received";
        } else if (loan?.loanType) {
          formattedLoanType = loan.loanType;
        }

        const personName =
          loan?.name || loan?.personName || loan?.staffName || "-";

        const amount = Number(loan?.amount) || 0;

        const remainingBalance = Number(
          loan?.remainingBalance ??
            loan?.remainingBal ??
            loan?.balance ??
            amount,
        );

        const status =
          loan?.status || (remainingBalance <= 0 ? "paid" : "active");

        const paymentMode = convertPaymentTypeToFrontend(loan?.paymentType);

        return {
          id: loanId,
          date: formattedDate,
          staffName: personName,
          type: formattedLoanType,
          amount,
          remainingBal: remainingBalance,
          status,
          loanType:
            loan?.loanType === "loan_received" ? "loan_received" : "loan_given",
          personName,
          paymentMode,
          transactions: Array.isArray(loan?.transactions)
            ? loan.transactions
            : [],
        };
      });

      setLoanTransactions(formattedLoans);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch loans:", error);

      setLoanTransactions([]);
      setLoanStats(EMPTY_LOAN_STATS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // FETCH LOANS ON PAGE LOAD
  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // SYNC WHEN DASHBOARD MONTH CHANGES
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

    window.addEventListener("focus", handleWindowFocus);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedYear, selectedMonth]);

  // REFETCH WHEN SELECTED MONTH CHANGES
  useEffect(() => {
    const savedMonth = getSelectedDashboardMonth();

    if (
      savedMonth.year === selectedYear &&
      savedMonth.month === selectedMonth
    ) {
      fetchLoans();
    }
  }, [selectedYear, selectedMonth, fetchLoans]);

  // LOAN STATUS
  const getLoanStatus = (loan) => {
    if (loan?.status === "paid") return "Paid";

    if (loan?.status === "active") return "Active";

    return Number(loan?.remainingBal) <= 0 ? "Paid" : "Active";
  };

  // CREATE NEW LOAN
  const handleSaveLoan = async (newLoanData) => {
    if (isSubmitting) return;

    if (
      !newLoanData?.date ||
      !newLoanData?.personName?.trim() ||
      newLoanData?.amount === "" ||
      newLoanData?.amount === null ||
      newLoanData?.amount === undefined ||
      !Number.isFinite(Number(newLoanData.amount)) ||
      Number(newLoanData.amount) <= 0
    ) {
      window.alert("Please enter a valid date, person name, and loan amount.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        date: newLoanData.date,
        loanType:
          newLoanData.loanType === "loan_given"
            ? "loan_given"
            : "loan_received",
        name: newLoanData.personName.trim(),
        amount: Number(newLoanData.amount),
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

  // OPEN EDIT MODAL
  const handleEdit = (loan) => {
    if (isSubmitting) return;

    if (loan?.status === "paid" || Number(loan?.remainingBal) <= 0) {
      window.alert("This loan is already fully paid and cannot be updated.");
      return;
    }

    let editDate = new Date().toISOString().split("T")[0];

    if (loan?.date && loan.date !== "-") {
      const dateParts = loan.date.split("-");

      if (dateParts.length === 3) {
        editDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    const selectedLoanData = {
      id: loan.id,
      date: editDate,
      loanType:
        loan.loanType ||
        (loan.type === "Loan Received" ? "loan_received" : "loan_given"),
      personName: loan.personName || loan.staffName || "",
      amount: loan.amount ?? "",
      paymentMode:
        loan.paymentMode === "bank transfer" ||
        loan.paymentMode === "bank_transfer" ||
        loan.paymentMode === "bank"
          ? "bank"
          : "cash",
    };

    setSelectedLoan(selectedLoanData);
    setIsEditModalOpen(true);
  };

  // UPDATE LOAN
  const handleUpdateLoan = async (updatedLoanData) => {
    if (isSubmitting) return;

    if (!selectedLoan?.id) {
      window.alert("Unable to update loan because the loan ID is missing.");
      return;
    }

    if (
      !updatedLoanData?.date ||
      !updatedLoanData?.personName?.trim() ||
      updatedLoanData?.amount === "" ||
      updatedLoanData?.amount === null ||
      updatedLoanData?.amount === undefined ||
      !Number.isFinite(Number(updatedLoanData.amount)) ||
      Number(updatedLoanData.amount) <= 0 ||
      !updatedLoanData?.loanType ||
      !updatedLoanData?.paymentMode
    ) {
      window.alert(
        "Please enter a valid date, person name, loan type, payment method, and amount.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        date: updatedLoanData.date,
        loanType:
          updatedLoanData.loanType === "loan_given"
            ? "loan_given"
            : "loan_received",
        name: updatedLoanData.personName.trim(),
        amount: Number(updatedLoanData.amount),
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

  // CLOSE EDIT MODAL
  const handleCloseEditModal = () => {
    if (isSubmitting) return;

    setIsEditModalOpen(false);
    setSelectedLoan(null);
  };

  // DELETE LOAN
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

  // CURRENCY FORMATTER
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK").format(Number(amount) || 0);

  // PAGINATION
  const totalResults = loanTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = loanTransactions.slice(startIndex, endIndex);

  // PAGE NUMBERS
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // PREVIOUS PAGE
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  // NEXT PAGE
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
    }
  };

  // PAGE CHANGE
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // OPEN CREATE MODAL
  const handleOpenModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(true);
  };

  // CLOSE CREATE MODAL
  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
  };

  // SELECTED MONTH LABEL
  const selectedMonthLabel = getSelectedMonthLabel(selectedYear, selectedMonth);

  // RENDER
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

          <span className="loan-stat-label">{selectedMonthLabel} Loan</span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.thisMonthLoan)}
          </h2>
        </div>

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">Total Loans Given</span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.totalLoansGiven)}
          </h2>

          <span className="loan-stat-sub">Current outstanding</span>
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

          <span className="loan-stat-label">Active Loan Staff</span>

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
                          item.type === "Loan Received"
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
                        {/* EDIT */}
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

                        {/* DELETE */}
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
