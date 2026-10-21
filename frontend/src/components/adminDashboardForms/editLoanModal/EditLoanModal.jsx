import { useState, useEffect } from "react";
import { X, Calendar, User, Wallet, Landmark, Save } from "lucide-react";

import "./EditLoanModal.css";

const EditLoanModal = ({
  isOpen,
  onClose,
  onSave,
  isSubmitting,
  initialData,
}) => {
  // =========================================================
  // DEFAULT FORM
  // =========================================================

  const getDefaultFormData = (data = {}) => {
    // Handle null or undefined initialData
    const loan = data ?? {};

    return {
      date: loan.date
        ? String(loan.date).split("T")[0]
        : new Date().toISOString().split("T")[0],

      loanType: loan.loanType === "loan_recover" ? "loan_recovery" : loan.loanType || "loan_given",
      personName: loan.personName || loan.name || loan.fullName || "",

      amount: loan.amount ?? "",

      paymentMode:
        loan.paymentMode === "bank transfer" ||
        loan.paymentMode === "bank" ||
        loan.paymentType === "bank transfer" ||
        loan.paymentType === "bank"
          ? "bank"
          : "cash",
    };
  };
  // =========================================================
  // TRANSACTION LABELS
  // =========================================================

  const transactionLabels = {
    loan_given: "Loan Given",
    loan_received: "Loan Received",
    loan_return: "Loan Return",
    loan_recover: "Loan Recovery",
  };

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState(() =>
    getDefaultFormData(initialData),
  );

  const selectedTransactionLabel =
    transactionLabels[formData.loanType] || "Loan";

  // =========================================================
  // LOAD SELECTED LOAN DATA
  // =========================================================

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(getDefaultFormData(initialData));
    }
  }, [isOpen, initialData]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // SELECT PAYMENT MODE
  // =========================================================

  const handlePaymentModeChange = (paymentMode) => {
    if (isSubmitting) return;

    setFormData((previousData) => ({
      ...previousData,
      paymentMode,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const personName = formData.personName.trim();
    const amount = Number(formData.amount);

    if (
      !formData.date ||
      !personName ||
      !formData.loanType ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !formData.paymentMode
    ) {
      return;
    }

    if (onSave) {
      onSave({
        ...formData,
        personName,
        amount,
      });
    }
  };

  // =========================================================
  // HANDLE CLOSE
  // =========================================================

  const handleClose = () => {
    if (isSubmitting) return;

    if (onClose) {
      onClose();
    }
  };

  // =========================================================
  // MODAL STATE
  // =========================================================

  if (!isOpen) return null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="elm-overlay">
      <div className="elm-container">
        {/* HEADER */}

        <div className="elm-header">
          <h2>Edit {selectedTransactionLabel}</h2>

          <button
            type="button"
            className="elm-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="elm-body">
          <div className="elm-form-grid">
            {/* DATE */}

            <div className="elm-form-group">
              <label htmlFor="edit-loan-date">DATE</label>

              <div className="elm-input-with-icon">
                <Calendar size={18} className="elm-input-icon" />

                <input
                  id="edit-loan-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* LOAN TYPE */}

            <div className="elm-form-group">
              <label htmlFor="edit-loan-type">LOAN TYPE</label>

              <select
                id="edit-loan-type"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="loan_given">Loan Given</option>
                <option value="loan_received">Loan Received</option>
                <option value="loan_return">Loan Return</option>
                <option value="loan_recovery">Loan Recovery</option>
              </select>
            </div>

            {/* NAME */}

            <div className="elm-form-group">
              <label htmlFor="edit-loan-name">NAME</label>

              <div className="elm-input-with-icon">
                <User size={18} className="elm-input-icon" />

                <input
                  id="edit-loan-name"
                  type="text"
                  name="personName"
                  placeholder="Enter name ..."
                  value={formData.personName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* AMOUNT */}

            <div className="elm-form-group">
              <label htmlFor="edit-loan-amount">AMOUNT (PKR)</label>

              <div className="elm-amount-box">
                <span className="elm-currency-prefix">Rs.</span>

                <input
                  id="edit-loan-amount"
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="any"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* PAYMENT MODE / POOL */}

            <div className="elm-form-group elm-full-width">
              <label>PAYMENT MODE / POOL</label>

              <div className="elm-payment-options">
                {/* CASH */}

                <button
                  type="button"
                  className={`elm-payment-card ${
                    formData.paymentMode === "cash" ? "elm-selected" : ""
                  }`}
                  onClick={() => handlePaymentModeChange("cash")}
                  disabled={isSubmitting}
                  aria-pressed={formData.paymentMode === "cash"}
                >
                  <Wallet size={20} />

                  <div>
                    <strong>Cash Account</strong>
                    <p>Hand Pool</p>
                  </div>
                </button>

                {/* BANK */}

                <button
                  type="button"
                  className={`elm-payment-card ${
                    formData.paymentMode === "bank" ? "elm-selected" : ""
                  }`}
                  onClick={() => handlePaymentModeChange("bank")}
                  disabled={isSubmitting}
                  aria-pressed={formData.paymentMode === "bank"}
                >
                  <Landmark size={20} />

                  <div>
                    <strong>Bank Account</strong>
                    <p>Reserve Pool</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="elm-footer">
            <button
              type="button"
              className="elm-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="elm-btn-submit"
              disabled={isSubmitting}
            >
              <Save size={16} />

              {isSubmitting
                ? "Updating..."
                : `Update ${selectedTransactionLabel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLoanModal;
