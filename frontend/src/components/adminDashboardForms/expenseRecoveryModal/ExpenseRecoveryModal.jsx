import { useState } from "react";
import { X, Calendar, Banknote, Building2, CheckCircle2 } from "lucide-react";

import "./ExpenseRecoveryModal.css";

const ExpenseRecoveryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    category: "68a123456789abcdef123456",
    recoveryAmount: "",
    remarks: "",
    paymentMode: "Cash Account",
  });

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE PAYMENT MODE
  // =========================================================

  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date) {
      return;
    }

    if (!formData.recoveryAmount) {
      return;
    }

    const recoveryExpenseData = {
      date: formData.date,
      category: formData.category,
      recoveryAmount: Number(formData.recoveryAmount),
      remarks: formData.remarks,
      paymentMode: formData.paymentMode,
    };

    console.log("Recovery Expense Payload:", recoveryExpenseData);

    if (onSubmit) {
      onSubmit(recoveryExpenseData);
    }
  };

  return (
    <div className="erm-overlay">
      <div className="erm-modal-container">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="erm-header">
          <h2 className="erm-title">Expense Recovery</h2>

          <button
            type="button"
            className="erm-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="erm-form">
          {/* ===================================================
              DATE & CATEGORY
          ==================================================== */}

          <div className="erm-grid-2">
            {/* Date */}

            <div className="erm-field">
              <label className="erm-label">Date</label>

              <div className="erm-input-icon-wrapper">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="erm-input"
                  required
                />

                <Calendar size={18} className="erm-input-icon" />
              </div>
            </div>

            {/* Expense Category */}

            <div className="erm-field">
              <label className="erm-label">Expense Category</label>

              <input
                type="text"
                value="Recovery Expense"
                className="erm-input"
                readOnly
              />
            </div>
          </div>

          {/* ===================================================
              RECOVERY AMOUNT
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Recovery Amount (PKR)</label>

            <div className="erm-amount-input-wrapper">
              <span className="erm-currency-prefix">Rs.</span>

              <input
                type="number"
                name="recoveryAmount"
                placeholder="0.00"
                value={formData.recoveryAmount}
                onChange={handleChange}
                className="erm-input erm-amount-input"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* ===================================================
              DETAILS / REMARKS
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Detail / Remarks</label>

            <textarea
              name="remarks"
              placeholder="Text here..."
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="erm-textarea"
            />
          </div>

          {/* ===================================================
              PAYMENT MODE
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Payment Mode / Pool</label>

            <div className="erm-payment-grid">
              {/* Cash Account */}

              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Cash Account" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Cash Account")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePaymentModeSelect("Cash Account");
                  }
                }}
              >
                <div className="erm-payment-card-left">
                  <div className="erm-pm-icon-box">
                    <Banknote size={20} />
                  </div>

                  <div className="erm-pm-text">
                    <span className="erm-pm-title">Cash Account</span>

                    <span className="erm-pm-sub">Hand Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Cash Account" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>

              {/* Bank Account */}

              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Bank Account" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Bank Account")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePaymentModeSelect("Bank Account");
                  }
                }}
              >
                <div className="erm-payment-card-left">
                  <div className="erm-pm-icon-box">
                    <Building2 size={20} />
                  </div>

                  <div className="erm-pm-text">
                    <span className="erm-pm-title">Bank Account</span>

                    <span className="erm-pm-sub">Reserve Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Bank Account" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>
            </div>
          </div>

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <div className="erm-footer">
            <button type="button" className="erm-btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="erm-btn-submit">
              <CheckCircle2 size={18} />

              <span>Record Recovery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseRecoveryModal;
