import React, { useState } from "react";
import {
  FaArrowRightArrowLeft,
  FaXmark,
  FaCircleInfo,
  FaCheck,
} from "react-icons/fa6";
import "./CashTransferModal.css";

const CashTransferModal = ({ isOpen, onClose, onSubmit }) => {
  // Current date in YYYY-MM-DD format for input default
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    transferType: "Cash to Bank", // Default selection
    amount: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      transferType: type,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset and close
    onClose();
  };

  return (
    <div className="ct-overlay">
      <div className="ct-modal">
        {/* Modal Header */}
        <div className="ct-header">
          <div className="ct-title-group">
            <div className="ct-header-icon-box">
              <FaArrowRightArrowLeft className="ct-header-icon" />
            </div>
            <h2 className="ct-title">Cash Transfer</h2>
          </div>
          <button type="button" className="ct-close-btn" onClick={onClose}>
            <FaXmark />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="ct-form">
          <div className="ct-body">
            {/* Date Field */}
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
                required
              />
            </div>

            {/* Transfer Type Selection */}
            <div className="ct-form-group">
              <label className="ct-label">Transfer Type</label>
              <div className="ct-type-selector">
                <button
                  type="button"
                  className={`ct-type-btn ${
                    formData.transferType === "Cash to Bank" ? "active" : ""
                  }`}
                  onClick={() => handleTypeSelect("Cash to Bank")}
                >
                  Cash to Bank
                </button>
                <button
                  type="button"
                  className={`ct-type-btn ${
                    formData.transferType === "Bank to Cash" ? "active" : ""
                  }`}
                  onClick={() => handleTypeSelect("Bank to Cash")}
                >
                  Bank to Cash
                </button>
              </div>
            </div>

            {/* Amount Field */}
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
                  required
                />
              </div>
            </div>

            {/* Information Alert Box */}
            <div className="ct-info-box">
              <FaCircleInfo className="ct-info-icon" />
              <p className="ct-info-text">
                Transfers are recorded immediately. Ensure physical cash
                deposits align with this digital transfer before end-of-day
                reconciliation.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="ct-footer">
            <button type="button" className="ct-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ct-btn-submit">
              <FaCheck className="ct-submit-icon" />
              <span>Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashTransferModal;
