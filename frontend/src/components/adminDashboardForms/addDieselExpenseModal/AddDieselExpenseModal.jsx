import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import "./AddDieselExpenseModal.css";

const AddDieselExpenseModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    quantityLiters: "",
    amount: "",
    detailRemarks: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <div className="dem-overlay">
      <div className="dem-modal-container">
        {/* Header */}
        <div className="dem-header">
          <h2 className="dem-title">Add Diesel Expense</h2>
          <button className="dem-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="dem-form">
          {/* Row 1: Date */}
          <div className="dem-field">
            <label className="dem-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="dem-input"
              required
            />
          </div>

          {/* Row 2: Diesel Quantity & Amount */}
          <div className="dem-grid-2">
            <div className="dem-field">
              <label className="dem-label">Diesel Quantity (Liters)</label>
              <div className="dem-input-suffix-wrapper">
                <input
                  type="number"
                  step="0.01"
                  name="quantityLiters"
                  placeholder="0.00"
                  value={formData.quantityLiters}
                  onChange={handleChange}
                  className="dem-input dem-input-suffix"
                  required
                />
                <span className="dem-suffix">L</span>
              </div>
            </div>

            <div className="dem-field">
              <label className="dem-label">Amount (PKR)</label>
              <div className="dem-input-prefix-wrapper">
                <span className="dem-prefix">Rs.</span>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="dem-input dem-input-prefix"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Detail / Remarks */}
          <div className="dem-field">
            <label className="dem-label">Detail / Remarks</label>
            <textarea
              name="detailRemarks"
              placeholder="Add any operational notes or invoice details here..."
              value={formData.detailRemarks}
              onChange={handleChange}
              rows={3}
              className="dem-textarea"
            />
          </div>

          {/* Footer Actions */}
          <div className="dem-footer">
            <button type="button" className="dem-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dem-btn-submit">
              <CheckCircle2 size={18} />
              <span>Record Diesel Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDieselExpenseModal;
