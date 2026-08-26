import React, { useState } from "react";
import { X, Calendar, Banknote, Building2, CheckCircle2 } from "lucide-react";
import "./ExpenseRecoveryModal.css";

const ExpenseRecoveryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    expenseCategory: "Recovery Expense",
    recoveryAmount: "",
    detailRemarks: "",
    paymentMode: "Cash", // Default selected: 'Cash' or 'Bank'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <div className="erm-overlay">
      <div className="erm-modal-container">
        {/* Header */}
        <div className="erm-header">
          <h2 className="erm-title">Expense Recovery</h2>
          <button className="erm-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="erm-form">
          {/* Row 1: Date & Expense Category */}
          <div className="erm-grid-2">
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

            <div className="erm-field">
              <label className="erm-label">Expense Category</label>
              <input
                type="text"
                name="expenseCategory"
                value={formData.expenseCategory}
                onChange={handleChange}
                className="erm-input"
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Recovery Amount (PKR) */}
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
                required
              />
            </div>
          </div>

          {/* Row 3: Detail / Remarks */}
          <div className="erm-field">
            <label className="erm-label">Detail / Remarks</label>
            <textarea
              name="detailRemarks"
              placeholder="Add any relevant notes..."
              value={formData.detailRemarks}
              onChange={handleChange}
              rows={3}
              className="erm-textarea"
            />
          </div>

          {/* Row 4: Payment Mode / Pool Selection */}
          <div className="erm-field">
            <label className="erm-label">Payment Mode / Pool</label>
            <div className="erm-payment-grid">
              {/* Cash Option Card */}
              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Cash" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Cash")}
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
                {formData.paymentMode === "Cash" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>

              {/* Bank Option Card */}
              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Bank" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Bank")}
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
                {formData.paymentMode === "Bank" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
