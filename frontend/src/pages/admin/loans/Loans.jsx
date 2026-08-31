import React, { useEffect, useMemo, useState } from "react";

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

const Loans = () => {
  // =========================================================
  // CONSTANTS
  // =========================================================

  const ITEMS_PER_PAGE = 5;

  const EMPTY_LOAN_STATS = {
    thisMonthLoan: 0,
    totalLoansGiven: 0,
    thisMonthRecovery: 0,
    activeLoanStaff: 0,
  };

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
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // LOAN TRANSACTIONS
  // =========================================================

  const [loanTransactions, setLoanTransactions] = useState([]);

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
  // GET ALL LOANS
  // =========================================================

  const fetchLoans = async () => {
    try {
      setIsLoading(true);

      const response = await getAllLoans();

      console.log("Get All Loans API Response:", response);

      // =====================================================
      // FIND API DATA
      // =====================================================

      const apiData = response?.data ?? response ?? {};

      // =====================================================
      // SUPPORT COMMON RESPONSE STRUCTURES
      // =====================================================

      const loansArray = Array.isArray(apiData)
        ? apiData
        : Array.isArray(apiData?.loans)
          ? apiData.loans
          : Array.isArray(apiData?.data)
            ? apiData.data
            : Array.isArray(response?.loans)
              ? response.loans
              : [];

      console.log("Loans API Data:", loansArray);

      // =====================================================
      // FORMAT API DATA
      // =====================================================

      const formattedLoans = loansArray.map((loan, index) => {
        // ---------------------------------------------------
        // ID
        // ---------------------------------------------------

        const loanId = loan?._id || loan?.id || `loan-${index}-${Date.now()}`;

        // ---------------------------------------------------
        // DATE
        // ---------------------------------------------------

        let formattedDate = "-";

        if (loan?.date) {
          const rawDate = String(loan.date).split("T")[0];

          const dateParts = rawDate.split("-");

          if (dateParts.length === 3) {
            formattedDate = dateParts.reverse().join("-");
          } else {
            formattedDate = rawDate;
          }
        }

        // ---------------------------------------------------
        // LOAN TYPE
        // ---------------------------------------------------

        let formattedLoanType = "-";

        if (loan?.loanType === "loan_given") {
          formattedLoanType = "Loan Given";
        } else if (loan?.loanType === "loan_received") {
          formattedLoanType = "Loan Received";
        } else if (loan?.loanType) {
          formattedLoanType = loan.loanType;
        }

        // ---------------------------------------------------
        // NAME
        // ---------------------------------------------------

        const personName =
          loan?.name || loan?.personName || loan?.staffName || "-";

        // ---------------------------------------------------
        // AMOUNT
        // ---------------------------------------------------

        const amount = Number(loan?.amount) || 0;

        // ---------------------------------------------------
        // REMAINING BALANCE
        // ---------------------------------------------------

        const remainingBalance = Number(
          loan?.remainingBal ??
            loan?.remainingBalance ??
            loan?.balance ??
            amount,
        );

        // ---------------------------------------------------
        // PAYMENT TYPE
        // ---------------------------------------------------

        const paymentMode = convertPaymentTypeToFrontend(loan?.paymentType);

        // ---------------------------------------------------
        // RETURN FORMATTED OBJECT
        // ---------------------------------------------------

        return {
          // Table data
          id: loanId,
          date: formattedDate,
          staffName: personName,
          type: formattedLoanType,
          amount,
          remainingBal: remainingBalance,

          // Edit form data
          loanType:
            loan?.loanType === "loan_received" ? "loan_received" : "loan_given",

          personName,

          paymentMode,
        };
      });

      console.log("Formatted Loans:", formattedLoans);

      setLoanTransactions(formattedLoans);

      // =====================================================
      // RESET PAGINATION
      // =====================================================

      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch loans:", error);

      console.error("Get All Loans API Error Response:", error?.response?.data);

      setLoanTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FETCH LOANS ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchLoans();
  }, []);

  // =========================================================
  // LOAN STATUS
  // =========================================================

  const getLoanStatus = (remainingBal) => {
    return Number(remainingBal) <= 0 ? "Paid" : "Active";
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
        console.error("Invalid loan form data:", newLoanData);

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

        // Frontend:
        // cash / bank
        //
        // Backend:
        // cash / bank transfer
        paymentType: convertPaymentModeToApi(newLoanData.paymentMode),
      };

      console.log("==========================================");
      console.log("CREATE LOAN PAYLOAD");
      console.log("==========================================");

      console.log(JSON.stringify(payload, null, 2));

      // =====================================================
      // CREATE API
      // =====================================================

      const response = await createLoan(payload);

      console.log("Create Loan API Response:", response);

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setIsModalOpen(false);

      console.log("Loan created successfully.");
    } catch (error) {
      console.error("==========================================");
      console.error("CREATE LOAN FAILED");
      console.error("==========================================");

      console.error("Axios Error:", error);

      console.error("Status:", error?.response?.status);

      console.error("API Error Response:", error?.response?.data);

      console.error("API Error Message:", error?.response?.data?.message);
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

    console.log("Selected Loan For Edit:", loan);

    // =====================================================
    // CONVERT TABLE DATE

    let editDate = new Date().toISOString().split("T")[0];

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
        (loan.type === "Loan Received" ? "loan_received" : "loan_given"),

      personName: loan.personName || loan.staffName || "",

      amount: loan.amount ?? "",

      // Frontend only:
      // cash / bank
      paymentMode:
        loan.paymentMode === "bank transfer" ||
        loan.paymentMode === "bank_transfer" ||
        loan.paymentMode === "bank"
          ? "bank"
          : "cash",
    };

    console.log("Selected Loan Data For Edit Modal:", selectedLoanData);

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
        console.error("Update Loan Error: Loan ID is missing.");

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
        console.error("Invalid update loan form data:", updatedLoanData);

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

        // Frontend:
        // cash / bank
        //
        // Backend:
        // cash / bank transfer
        paymentType: convertPaymentModeToApi(updatedLoanData.paymentMode),
      };

      console.log("UPDATE LOAN");

      console.log("Update Loan ID:", selectedLoan.id);

      console.log("Frontend Payment Mode:", updatedLoanData.paymentMode);

      console.log("Backend Payment Type:", payload.paymentType);

      console.log("Update Loan Payload:", JSON.stringify(payload, null, 2));

      // =====================================================
      // UPDATE API
      // =====================================================

      const response = await updateLoan(selectedLoan.id, payload);

      console.log("Update Loan API Response:", response);

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      // =====================================================
      // CLOSE EDIT MODAL
      // =====================================================

      setIsEditModalOpen(false);

      setSelectedLoan(null);

      console.log("Loan updated successfully.");
    } catch (error) {
      console.error("==========================================");
      console.error("UPDATE LOAN FAILED");
      console.error("==========================================");

      console.error("Axios Error:", error);

      console.error("Update Loan Status:", error?.response?.status);

      console.error("Update Loan API Error Response:", error?.response?.data);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to update loan. Please try again.";

      console.error("Update Loan API Error Message:", errorMessage);

      // ==========================================
      // SHOW BACKEND ERROR TO USER
      // ==========================================

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
      console.error("Delete Loan Error: Loan ID is missing.");

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
      // DELETE API LOGS
      // =====================================================
      console.log("DELETE LOAN");

      console.log("Delete Loan ID:", loan.id);

      console.log("Delete Loan Name:", loan.staffName);

      // =====================================================
      // DELETE API
      // =====================================================

      const response = await deleteLoan(loan.id);

      console.log("Delete Loan API Response:", response);

      // =====================================================
      // REFRESH LOANS
      // =====================================================

      await fetchLoans();

      console.log("Loan deleted successfully.");
    } catch (error) {
      console.error("DELETE LOAN FAILED");

      console.error("Axios Error:", error);

      console.error("Delete Loan Status:", error?.response?.status);

      console.error("Delete Loan API Error Response:", error?.response?.data);

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
    return new Intl.NumberFormat("en-PK").format(Number(amount) || 0);
  };

  // =========================================================
  // LOAN STATISTICS
  // =========================================================

  const loanStats = useMemo(() => {
    const today = new Date();

    const currentMonth = today.getMonth();

    const currentYear = today.getFullYear();

    // =======================================================
    // THIS MONTH LOAN
    // =======================================================

    const thisMonthLoan = loanTransactions
      .filter((transaction) => {
        if (transaction.type !== "Loan Given") {
          return false;
        }

        if (!transaction.date || transaction.date === "-") {
          return false;
        }

        const dateParts = transaction.date.split("-");

        if (dateParts.length !== 3) {
          return false;
        }

        const transactionDate = new Date(
          `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`,
        );

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // TOTAL LOANS GIVEN
    // =======================================================

    const totalLoansGiven = loanTransactions
      .filter((transaction) => transaction.type === "Loan Given")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // THIS MONTH LOAN RECEIVED
    // =======================================================

    const thisMonthRecovery = loanTransactions
      .filter((transaction) => {
        if (transaction.type !== "Loan Received") {
          return false;
        }

        if (!transaction.date || transaction.date === "-") {
          return false;
        }

        const dateParts = transaction.date.split("-");

        if (dateParts.length !== 3) {
          return false;
        }

        const transactionDate = new Date(
          `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`,
        );

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );

    // =======================================================
    // ACTIVE LOAN STAFF
    // =======================================================

    const activeStaff = new Set(
      loanTransactions
        .filter((transaction) => Number(transaction.remainingBal) > 0)
        .map((transaction) => transaction.staffName),
    );

    return {
      ...EMPTY_LOAN_STATS,

      thisMonthLoan,

      totalLoansGiven,

      thisMonthRecovery,

      activeLoanStaff: activeStaff.size,
    };
  }, [loanTransactions]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalResults = loanTransactions.length;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalResults);

  const currentTransactions = loanTransactions.slice(startIndex, endIndex);

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
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  // =========================================================
  // NEXT PAGE
  // =========================================================

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1);
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
  // RENDER
  // =========================================================

  return (
    <div className="loan-page-container">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="loan-header-section">
        <div>
          <h1 className="loan-page-title">Loans</h1>

          <p className="loan-page-subtitle">
            Manage staff loans, recoveries, and outstanding balances.
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
      ===================================================== */}

      <div className="loan-stats-grid">
        {/* THIS MONTH LOAN */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <Landmark size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">This Month Loan</span>

          <h2 className="loan-stat-value">
            Rs. {formatCurrency(loanStats.thisMonthLoan)}
          </h2>
        </div>

        {/* TOTAL LOANS GIVEN */}

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

        {/* THIS MONTH LOAN RECEIVED */}

        <div className="loan-stat-card">
          <div className="loan-icon-box loan-icon-bg-gray">
            <TrendingUp size={18} className="loan-icon-gray" />
          </div>

          <span className="loan-stat-label">This Month's Loan Received</span>

          <h2 className="loan-stat-value loan-text-green">
            Rs. {formatCurrency(loanStats.thisMonthRecovery)}
          </h2>
        </div>

        {/* ACTIVE STAFF */}

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

      {/* =====================================================
          TRANSACTIONS
      ===================================================== */}

      <div className="loan-table-card">
        {/* TABLE HEADER */}

        <div className="loan-table-header">
          <h3 className="loan-table-title">Recent Loan Transactions</h3>

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
                  const status = getLoanStatus(item.remainingBal);

                  return (
                    <tr key={item.id}>
                      {/* DATE */}

                      <td className="loan-text-muted">{item.date}</td>

                      {/* NAME */}

                      <td className="loan-font-bold">{item.staffName}</td>

                      {/* TYPE */}

                      <td className="loan-text-muted">{item.type}</td>

                      {/* AMOUNT */}

                      <td
                        className={
                          item.type === "Loan Received"
                            ? "loan-text-green loan-font-bold"
                            : "loan-font-bold"
                        }
                      >
                        Rs. {formatCurrency(item.amount)}
                      </td>

                      {/* REMAINING BALANCE */}

                      <td className="loan-text-muted">
                        Rs. {formatCurrency(item.remainingBal)}
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
                          onClick={() => handleEdit(item)}
                          disabled={isSubmitting}
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
                    No loan transactions found.
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
              Showing <b>{startIndex + 1}</b> to <b>{endIndex}</b> of{" "}
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
                    currentPage === page ? "loan-page-active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}

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

      {/* =====================================================
          CREATE LOAN MODAL
      ===================================================== */}

      <RecordLoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLoan}
        isSubmitting={isSubmitting}
      />

      {/* =====================================================
          EDIT LOAN MODAL
      ===================================================== */}

      <EditLoanModal
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
