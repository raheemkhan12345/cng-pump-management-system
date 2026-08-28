import React, { useState } from "react";
import { X, Calendar, User, Wallet, Landmark, Save } from "lucide-react";

import "./RecordLoanModel.css";

const RecordLoanModal = ({ isOpen, onClose, onSave }) => {
  // =========================================================
  // Form State
  // =========================================================

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    loanType: "Loan Given",
    personName: "",
    amount: "",
    paymentMode: "cash", // "cash" or "bank"
  });

  // =========================================================
  // Close Modal
  // =========================================================

  if (!isOpen) return null;

  // =========================================================
  // Handle Input Changes
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Handle Submit
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(formData);
    }

    onClose();
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* =====================================================
            Header
        ===================================================== */}

        <div className="modal-header">
          <h2>Record New Loan</h2>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            Form
        ===================================================== */}

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* =================================================
                Date
            ================================================= */}

            <div className="form-group">
              <label>DATE</label>

              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* =================================================
                Loan Type
            ================================================= */}

            <div className="form-group">
              <label>LOAN TYPE</label>

              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
              >
                <option value="Loan Given">Loan Given</option>
                <option value="Loan Received">Loan Received</option>
              </select>
            </div>

            {/* =================================================
                Person / Company
            ================================================= */}

            <div className="form-group">
              <label>NAME</label>

              <div className="input-with-icon">
                <User size={18} className="input-icon" />

                <input
                  type="text"
                  name="personName"
                  placeholder="Enter name ..."
                  value={formData.personName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* =================================================
                Amount
            ================================================= */}

            <div className="form-group">
              <label>AMOUNT (PKR)</label>

              <div className="amount-input-box">
                <span className="currency-prefix">Rs.</span>

                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* =================================================
                Payment Mode / Pool
            ================================================= */}

            <div className="form-group full-width">
              <label>PAYMENT MODE / POOL</label>

              <div className="payment-options">
                {/* Cash */}

                <div
                  className={`payment-card ${
                    formData.paymentMode === "cash" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMode: "cash",
                    }))
                  }
                >
                  <Wallet size={20} />

                  <div>
                    <strong>Cash Account</strong>
                    <p>Hand Pool</p>
                  </div>
                </div>

                {/* Bank */}

                <div
                  className={`payment-card ${
                    formData.paymentMode === "bank" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMode: "bank",
                    }))
                  }
                >
                  <Landmark size={20} />

                  <div>
                    <strong>Bank Account</strong>
                    <p>Reserve Pool</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              Footer Actions
          ===================================================== */}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-submit">
              <Save size={16} />
              Record Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordLoanModal;
