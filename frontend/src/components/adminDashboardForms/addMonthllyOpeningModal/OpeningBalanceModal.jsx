import React, { useState, useRef, useMemo } from "react";
import { X, Wallet, Building2, Calendar, CheckCircle2 } from "lucide-react";

import { createOpeningBalance } from "../../../services/adminApis/cashBankApi";

import "./OpeningBalanceModal.css";

// =========================================================
// BALANCE TYPES
// =========================================================

const balanceTypes = [
  {
    id: "cash-in-hand",
    label: "Cash In Hand",
    icon: Wallet,
    apiValue: "cash_in_hand",
  },
  {
    id: "cash-in-bank",
    label: "Cash In Bank",
    icon: Building2,
    apiValue: "cash_in_bank",
  },
];

// =========================================================
// GET CURRENT MONTH
// =========================================================

const getCurrentMonth = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}-01`;
};

// =========================================================
// GET MONTH OPTIONS
// =========================================================

const getMonthOptions = () => {
  const currentDate = new Date();

  const months = [];

  // Previous 6 months
  for (let i = -6; i <= 6; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + i,
      1,
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    months.push(`${year}-${month}-01`);
  }

  return months;
};

// =========================================================
// FORMAT MONTH LABEL
// =========================================================

const formatMonthLabel = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

// =========================================================
// COMPONENT
// =========================================================

const OpeningBalanceModal = ({ isOpen = false, onClose, onSuccess }) => {
  // =========================================================
  // DEFAULT CURRENT MONTH
  // =========================================================

  const currentMonth = getCurrentMonth();

  // =========================================================
  // STATES
  // =========================================================

  const [selectedType, setSelectedType] = useState("cash-in-hand");

  const [targetMonth, setTargetMonth] = useState(currentMonth);

  const [effectiveDate, setEffectiveDate] = useState(currentMonth);

  const [openingAmount, setOpeningAmount] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const dateInputRef = useRef(null);

  // =========================================================
  // DYNAMIC MONTH OPTIONS
  // =========================================================

  const monthOptions = useMemo(() => {
    return getMonthOptions();
  }, []);

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (isSaving) return;

    setError("");

    if (onClose) {
      onClose();
    }
  };

  // =========================================================
  // OPEN CALENDAR
  // =========================================================

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  // =========================================================
  // AMOUNT CHANGE
  // =========================================================

  const handleAmountChange = (e) => {
    let value = e.target.value;

    // Remove everything except numbers
    value = value.replace(/[^0-9]/g, "");

    if (!value) {
      setOpeningAmount("");
      return;
    }

    // Format amount with commas
    setOpeningAmount(Number(value).toLocaleString("en-PK"));
  };

  // =========================================================
  // TARGET MONTH CHANGE
  // =========================================================

  const handleTargetMonthChange = (e) => {
    const selectedMonth = e.target.value;

    setTargetMonth(selectedMonth);

    /*
      When target month changes, automatically move
      effective date to the first day of that month.
    */
    setEffectiveDate(selectedMonth);

    setError("");
  };

  // =========================================================
  // EFFECTIVE DATE CHANGE
  // =========================================================

  const handleEffectiveDateChange = (e) => {
    setEffectiveDate(e.target.value);

    setError("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =======================================================
    // VALIDATE AMOUNT
    // =======================================================

    const numericAmount = Number(String(openingAmount).replace(/,/g, ""));

    if (!targetMonth) {
      setError("Please select target month.");
      return;
    }

    if (!effectiveDate) {
      setError("Please select effective date.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid opening amount.");
      return;
    }

    // =======================================================
    // FIND BALANCE TYPE
    // =======================================================

    const selectedBalanceType = balanceTypes.find(
      (type) => type.id === selectedType,
    );

    if (!selectedBalanceType) {
      setError("Please select balance type.");
      return;
    }

    // =======================================================
    // API BODY
    // =======================================================

    const openingBalanceData = {
      balanceType: selectedBalanceType.apiValue,
      targetMonth: targetMonth,
      date: effectiveDate,
      amount: numericAmount,
    };

    console.log("Opening Balance Request:", openingBalanceData);

    // =======================================================
    // API CALL
    // =======================================================

    try {
      setIsSaving(true);

      const response = await createOpeningBalance(openingBalanceData);

      console.log("Opening Balance Response:", response);

      // =====================================================
      // SUCCESS
      // =====================================================

      if (onSuccess) {
        onSuccess(response);
      }

      if (onClose) {
        onClose();
      }

      // Reset form after successful submission
      setSelectedType("cash-in-hand");
      setTargetMonth(getCurrentMonth());
      setEffectiveDate(getCurrentMonth());
      setOpeningAmount("");
      setError("");
    } catch (error) {
      console.error("Opening Balance Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save opening balance.";

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // DON'T RENDER WHEN CLOSED
  // =========================================================

  if (!isOpen) return null;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ===================================================
            HEADER
        ==================================================== */}

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
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* =================================================
              BALANCE TYPE
          ================================================== */}

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
                    onClick={() => {
                      setSelectedType(type.id);
                      setError("");
                    }}
                  >
                    <IconComponent size={18} className="type-icon" />

                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              TARGET MONTH & EFFECTIVE DATE
          ================================================== */}

          <div className="form-row-2col">
            {/* TARGET MONTH */}

            <div className="form-group">
              <label className="form-label">
                Target Month <span className="required-asterisk">*</span>
              </label>

              <div className="input-with-icon">
                <Calendar size={18} className="input-icon select-icon" />

                <select
                  className="form-control select-control"
                  value={targetMonth}
                  onChange={handleTargetMonthChange}
                >
                  {monthOptions.map((month) => {
                    const isCurrentMonth = month === currentMonth;

                    return (
                      <option key={month} value={month}>
                        {formatMonthLabel(month)}
                        {isCurrentMonth ? " (Active)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* EFFECTIVE DATE */}

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
                  onChange={handleEffectiveDateChange}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              OPENING AMOUNT
          ================================================== */}

          <div className="form-group">
            <label className="form-label">
              Opening Amount (Pakistani Rupee){" "}
              <span className="required-asterisk">*</span>
            </label>

            <div className="amount-input-wrapper">
              <span className="currency-prefix">PKR</span>

              <input
                type="text"
                inputMode="numeric"
                className="amount-input"
                value={openingAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && <div className="form-error">{error}</div>}

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button type="submit" className="btn-submit" disabled={isSaving}>
              <CheckCircle2 size={18} />

              <span>{isSaving ? "Saving..." : "Save & Add to Dashboard"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpeningBalanceModal;
