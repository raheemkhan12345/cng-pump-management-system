import React, { useEffect, useState } from "react";
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
  // DEFAULT FORM DATA
  // =========================================================

  const getDefaultFormData = () => ({
    date: new Date().toISOString().split("T")[0],
    loanType: "loan_given",
    personName: "",
    amount: "",
    paymentMode: "cash",
  });

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState(getDefaultFormData());

  // =========================================================
  // LOAD SELECTED LOAN DATA
  // =========================================================

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        date: initialData.date || new Date().toISOString().split("T")[0],

        loanType: initialData.loanType || "loan_given",

        personName: initialData.personName || "",

        amount: initialData.amount ?? "",

        // Frontend always uses:
        // cash / bank
        paymentMode: initialData.paymentMode === "bank transfer" ? "bank" : "cash",
      });
    }

    if (!isOpen) {
      setFormData(getDefaultFormData());
    }
  }, [initialData, isOpen]);

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
    if (isSubmitting) {
      return;
    }

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

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.date) {
      return;
    }

    if (!formData.personName.trim()) {
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      return;
    }

    if (!formData.loanType) {
      return;
    }

    if (!formData.paymentMode) {
      return;
    }

    // -------------------------------------------------------
    // SEND DATA TO PARENT
    // -------------------------------------------------------

    if (onSave) {
      onSave({
        ...formData,
        personName: formData.personName.trim(),
        amount: Number(formData.amount),
      });
    }
  };

  // =========================================================
  // HANDLE CLOSE
  // =========================================================

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  // =========================================================
  // MODAL STATE
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="elm-overlay">
      <div className="elm-container">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="elm-header">
          <h2>Edit Loan Record</h2>

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

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="elm-body">
          <div className="elm-form-grid">
            {/* =================================================
                DATE
            ================================================= */}

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

            {/* =================================================
                LOAN TYPE
            ================================================= */}

            <div className="elm-form-group">
              <label htmlFor="edit-loan-type">LOAN TYPE</label>

              <select
                id="edit-loan-type"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="loan_given">Loan Given</option>

                <option value="loan_received">Loan Received</option>
              </select>
            </div>

            {/* =================================================
                NAME
            ================================================= */}

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

            {/* =================================================
                AMOUNT
            ================================================= */}

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
                  step="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* =================================================
                PAYMENT MODE
            ================================================= */}

            <div className="elm-form-group elm-full-width">
              <label>PAYMENT MODE / POOL</label>

              <div className="elm-payment-options">
                {/* =================================================
                    CASH
                ================================================= */}

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

                {/* =================================================
                    BANK
                ================================================= */}

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

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="elm-footer">
            {/* CANCEL */}

            <button
              type="button"
              className="elm-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            {/* UPDATE */}

            <button
              type="submit"
              className="elm-btn-submit"
              disabled={isSubmitting}
            >
              <Save size={16} />

              {isSubmitting ? "Updating..." : "Update Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLoanModal;
