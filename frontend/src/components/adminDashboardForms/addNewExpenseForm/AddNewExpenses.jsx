import React, { useState } from "react";
import {
  X,
  Calendar,
  CreditCard,
  Building2,
  Plus,
  Banknote,
} from "lucide-react";

import { createExpense } from "../../../services/adminApis/expenseApi";

import "./AddNewExpenses.css";

const AddNewExpenses = ({ isOpen, onClose, onSuccess }) => {
  // =========================================================
  // FORM STATES
  // =========================================================

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("");

  const [paymentMode, setPaymentMode] = useState("cash");

  const [status, setStatus] = useState("Paid");

  const [remarks, setRemarks] = useState("");

  // =========================================================
  // SUBMIT LOADING
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setAmount("");
    setCategory("");
    setPaymentMode("cash");
    setStatus("Paid");
    setRemarks("");
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  // =========================================================
  // CREATE EXPENSE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =======================================================
    // BASIC VALIDATION
    // =======================================================

    if (!date) {
      console.error("Expense Error: Date is required.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      console.error("Expense Error: Please enter a valid amount.");
      return;
    }

    if (!category) {
      console.error("Expense Error: Category is required.");
      return;
    }

    // =======================================================
    // PAYMENT MODE
    // =======================================================

    const selectedPaymentMode =
      paymentMode === "cash" ? "Cash Account" : "Bank Account";

    // =======================================================
    // API PAYLOAD
    // =======================================================

    const expenseData = {
      date,
      amount: Number(amount),
      category,
      paymentMode: selectedPaymentMode,
      status,
      remarks,
    };

    console.log("Expense API Request:", expenseData);

    try {
      setIsSubmitting(true);

      // =====================================================
      // API CALL
      // =====================================================

      const response = await createExpense(expenseData);

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log("========================================");
      console.log("Expense added successfully!");
      console.log("Expense Response:", response);
      console.log("========================================");

      // Parent ko response bhejna
      if (onSuccess) {
        onSuccess(response);
      }

      // Form reset
      resetForm();

      // Modal close
      onClose();
    } catch (error) {
      // =====================================================
      // ERROR
      // =====================================================

      console.error("========================================");
      console.error("Failed to add expense.");
      console.error("Expense Error:", error);

      if (error?.response) {
        console.error("Status:", error.response.status);
        console.error("Server Response:", error.response.data);
      }

      console.error("========================================");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // MODAL
  // =========================================================

  if (!isOpen) return null;

  return (
    <div className="ane-modal-overlay">
      <div className="ane-modal-container">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="ane-modal-header">
          <div className="ane-header-info">
            <div className="ane-header-icon-box">
              <Banknote size={20} className="ane-header-icon" />
            </div>

            <div>
              <h2 className="ane-modal-title">Record New Expense</h2>

              <p className="ane-modal-subtitle">
                Log an outgoing payment or operational cost.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="ane-close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              BODY
          ================================================= */}

          <div className="ane-modal-body">
            {/* =================================================
                DATE & AMOUNT
            ================================================= */}

            <div className="ane-form-row">
              {/* DATE */}

              <div className="ane-form-group">
                <label className="ane-label">Date</label>

                <div className="ane-input-icon-wrapper">
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="ane-input"
                  />

                  <Calendar size={18} className="ane-input-icon" />
                </div>
              </div>

              {/* AMOUNT */}

              <div className="ane-form-group">
                <label className="ane-label">Amount (PKR)</label>

                <div className="ane-amount-wrapper">
                  <span className="ane-currency-prefix">Rs.</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    className="ane-input ane-input-amount"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                EXPENSE CATEGORY
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Expense Category</label>

              <select
                className="ane-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="" disabled>
                  Select a category...
                </option>

                <option value="68a123456789abcdef123456">Utility</option>

                <option value="supplies">Supplies</option>

                <option value="maintenance">Maintenance</option>

                <option value="staff">Staff</option>
              </select>
            </div>

            {/* =================================================
                PAYMENT MODE
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Payment Mode / Pool</label>

              <div className="ane-payment-grid">
                {/* CASH */}

                <div
                  className={`ane-payment-card ${
                    paymentMode === "cash" ? "ane-active" : ""
                  }`}
                  onClick={() => setPaymentMode("cash")}
                >
                  <div className="ane-card-left">
                    <CreditCard size={20} className="ane-card-icon" />

                    <div>
                      <span className="ane-card-title">Cash Account</span>

                      <span className="ane-card-sub">Hand Pool</span>
                    </div>
                  </div>

                  {paymentMode === "cash" && (
                    <div className="ane-check-badge">✓</div>
                  )}
                </div>

                {/* BANK */}

                <div
                  className={`ane-payment-card ${
                    paymentMode === "bank" ? "ane-active" : ""
                  }`}
                  onClick={() => setPaymentMode("bank")}
                >
                  <div className="ane-card-left">
                    <Building2 size={20} className="ane-card-icon" />

                    <div>
                      <span className="ane-card-title">Bank Account</span>

                      <span className="ane-card-sub">Reserve Pool</span>
                    </div>
                  </div>

                  {paymentMode === "bank" && (
                    <div className="ane-check-badge">✓</div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Status</label>

              <select
                className="ane-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Paid">Paid</option>

                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* =================================================
                REMARKS
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Detail / Remarks</label>

              <textarea
                rows="3"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter any additional details about this expense..."
                className="ane-textarea"
              />
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ane-modal-footer">
            <button
              type="button"
              className="ane-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ane-btn-submit"
              disabled={isSubmitting}
            >
              <Plus size={16} />

              <span>{isSubmitting ? "Recording..." : "Record Expense"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewExpenses;
