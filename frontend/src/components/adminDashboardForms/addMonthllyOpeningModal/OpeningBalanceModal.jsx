import React, { useState, useRef } from "react";
import {
  X,
  Wallet,
  Building2,
  TrendingUp,
  HandCoins,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import "./OpeningBalanceModal.css";

const balanceTypes = [
  { id: "cash-in-hand", label: "Cash In Hand", icon: Wallet },
  { id: "cash-in-bank", label: "Cash In Bank", icon: Building2 },
  { id: "loan-to-others", label: "Loan To Others", icon: TrendingUp },
  { id: "loan-given", label: "Loan Given", icon: HandCoins },
];

const OpeningBalanceModal = ({ isOpen = true, onClose }) => {
  const [selectedType, setSelectedType] = useState("cash-in-hand");
  const [targetMonth, setTargetMonth] = useState("September 2026 (Active)");
  const [effectiveDate, setEffectiveDate] = useState("2026-09-01");
  const [openingAmount, setOpeningAmount] = useState("125,000");

  const dateInputRef = useRef(null);

  if (!isOpen) return null;

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      selectedType,
      targetMonth,
      effectiveDate,
      openingAmount,
    };
    console.log("Saved Balance Entry:", formData);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="title-wrapper">
            <h2 className="modal-title">Add Monthly Opening Balance</h2>
            <p className="modal-subtitle">
              Record physical vault cash carried forward from previous month or
              outstanding carry-forward loans.
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Balance Type Selection */}
          <div className="form-group">
            <div className="label-row">
              <label className="form-label">
                Select Balance Type <span className="required-asterisk">*</span>
              </label>
              <span className="helper-text">
                Cash carried forward from prior closing
              </span>
            </div>

            <div className="balance-options-grid">
              {balanceTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    className={`type-card-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <IconComponent size={18} className="type-icon" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Month & Effective Date Row */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">
                Target Month <span className="required-asterisk">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon select-icon" />
                <select
                  className="form-control select-control"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                >
                  <option value="September 2026 (Active)">
                    September 2026 (Active)
                  </option>
                  <option value="October 2026">October 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Effective Date <span className="required-asterisk">*</span>
              </label>
              <div className="input-with-icon">
                <button
                  type="button"
                  className="calendar-icon-btn"
                  onClick={handleOpenCalendar}
                  title="Open Calendar"
                >
                  <Calendar size={18} className="input-icon interactive-icon" />
                </button>
                <input
                  ref={dateInputRef}
                  type="date"
                  className="form-control date-control"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Opening Amount Input */}
          <div className="form-group">
            <label className="form-label">
              Opening Amount (Pakistani Rupee){" "}
              <span className="required-asterisk">*</span>
            </label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">PKR</span>
              <input
                type="text"
                className="amount-input"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Actions Bar */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <CheckCircle2 size={18} />
              <span>Save & Add to Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpeningBalanceModal;
