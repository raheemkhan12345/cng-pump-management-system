import React, { useState } from "react";
import {
  FaArrowRightArrowLeft,
  FaXmark,
  FaCircleInfo,
  FaCheck,
} from "react-icons/fa6";

import "./CashTransferModal.css";

const CashTransferModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  // =========================================================
  // CURRENT DATE
  // =========================================================

  const today = new Date().toISOString().split("T")[0];

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    date: today,
    transferType: "cash_to_bank",
    amount: "",
  });

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  if (!isOpen) return null;

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
  // HANDLE TRANSFER TYPE
  // =========================================================

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      transferType: type,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(formData.amount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // =======================================================
    // API PAYLOAD
    // =======================================================

    const payload = {
      date: formData.date,
      transferType: formData.transferType,
      amount,
    };

    console.log(
      "Cash Bank Transfer Payload:",
      JSON.stringify(payload, null, 2),
    );

    try {
      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (error) {
      console.error("Transfer submission failed:", error);
    }
  };

  return (
    <div className="ct-overlay">
      <div className="ct-modal">
        {/* ===================================================
            MODAL HEADER
        =================================================== */}

        <div className="ct-header">
          <div className="ct-title-group">
            <div className="ct-header-icon-box">
              <FaArrowRightArrowLeft className="ct-header-icon" />
            </div>

            <h2 className="ct-title">Cash Transfer</h2>
          </div>

          <button
            type="button"
            className="ct-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FaXmark />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="ct-form">
          <div className="ct-body">
            {/* =================================================
                DATE
            ================================================= */}

            <div className="ct-form-group">
              <label className="ct-label" htmlFor="date">
                Date
              </label>

              <input
                type="date"
                id="date"
                name="date"
                className="ct-input"
                value={formData.date}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* =================================================
                TRANSFER TYPE
            ================================================= */}

            <div className="ct-form-group">
              <label className="ct-label">Transfer Type</label>

              <div className="ct-type-selector">
                {/* CASH TO BANK */}

                <button
                  type="button"
                  className={`ct-type-btn ${
                    formData.transferType === "cash_to_bank"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTypeSelect("cash_to_bank")
                  }
                  disabled={isSubmitting}
                >
                  Cash to Bank
                </button>

                {/* BANK TO CASH */}

                <button
                  type="button"
                  className={`ct-type-btn ${
                    formData.transferType === "bank_to_cash"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTypeSelect("bank_to_cash")
                  }
                  disabled={isSubmitting}
                >
                  Bank to Cash
                </button>
              </div>
            </div>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <div className="ct-form-group">
              <label className="ct-label" htmlFor="amount">
                Amount
              </label>

              <div className="ct-amount-wrapper">
                <span className="ct-currency-prefix">Rs.</span>

                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="ct-input ct-amount-input"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="any"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="ct-info-box">
              <FaCircleInfo className="ct-info-icon" />

              <p className="ct-info-text">
                Transfers are recorded immediately. Ensure physical
                cash deposits align with this digital transfer before
                end-of-day reconciliation.
              </p>
            </div>
          </div>

          {/* ===================================================
              MODAL FOOTER
          =================================================== */}

          <div className="ct-footer">
            <button
              type="button"
              className="ct-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ct-btn-submit"
              disabled={isSubmitting}
            >
              <FaCheck className="ct-submit-icon" />

              <span>
                {isSubmitting ? "Transferring..." : "Transfer"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashTransferModal;

