import React, { useState } from "react";
import {
  FaXmark,
  FaCalendarDays,
  FaBuildingColumns,
  FaMoneyBillWave,
  FaFloppyDisk,
} from "react-icons/fa6";

import { addSale } from "../../../services/adminApis/salesApi";

import "./RecordNewSaleModel.css";

const RecordNewSaleModal = ({ isOpen, onClose, onSaleAdded }) => {
  // =========================================================
  // FORM STATES
  // =========================================================

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [cngVolume, setCngVolume] = useState("");
  const [amount, setAmount] = useState("");

  // Backend values:
  // "cash"
  // "bank transfer"
  const [paymentMode, setPaymentMode] = useState("cash");

  const [remarks, setRemarks] = useState("");

  // =========================================================
  // API / UI STATES
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);

    setCngVolume("");
    setAmount("");
    setPaymentMode("cash");
    setRemarks("");
    setError("");
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
  // SUBMIT SALE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!cngVolume || Number(cngVolume) <= 0) {
      setError("Please enter a valid CNG volume.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!paymentMode) {
      setError("Please select a payment method.");
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================================
      // BACKEND REQUEST BODY
      // =====================================================

      const saleData = {
        date,
        cngVolume: Number(cngVolume),
        amount: Number(amount),

        // "cash" OR "bank transfer"
        paymentMethod: paymentMode,

        notes: remarks.trim(),
      };

      console.log("Adding New Sale:", saleData);

      // =====================================================
      // API CALL
      // =====================================================

      const response = await addSale(saleData);

      console.log("Add Sale API Response:", response);

      // =====================================================
      // SUCCESS
      // =====================================================

      /*
        Backend response:

        {
          message: "Sale recorded successfully"
        }

        Backend success field return nahi kar raha,
        isliye response.success check nahi karna.
      */

      console.log("Sale recorded successfully:", response?.message);

      // =====================================================
      // SEND SALE DATA TO PARENT
      // =====================================================

      /*
        API response mein sale details nahi aa rahi,
        isliye original saleData parent ko send kar rahe hain.

        CngSales.jsx is data se stats update karega.
      */

      if (onSaleAdded) {
        onSaleAdded(saleData);
      }

      // =====================================================
      // RESET FORM
      // =====================================================

      resetForm();

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      onClose();
    } catch (error) {
      console.error("Add Sale Error:", error);

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      console.error("Backend Error Response:", error?.response?.data);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Failed to record sale.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // DON'T RENDER
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="modal-header">
          <h2>Record New Sale</h2>

          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FaXmark />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* =================================================
              DATE
          ================================================= */}

          <div className="form-group">
            <label htmlFor="sale-date">Date</label>

            <div className="input-icon-wrapper">
              <FaCalendarDays className="field-icon" />

              <input
                id="sale-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* =================================================
              VOLUME + AMOUNT
          ================================================= */}

          <div className="form-row">
            {/* CNG VOLUME */}

            <div className="form-group">
              <label htmlFor="cng-volume">CNG Volume (KG)</label>

              <div className="input-icon-wrapper">
                <span className="custom-icon">⚖️</span>

                <input
                  id="cng-volume"
                  type="number"
                  placeholder="0.00"
                  value={cngVolume}
                  onChange={(e) => setCngVolume(e.target.value)}
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* AMOUNT */}

            <div className="form-group">
              <label htmlFor="sale-amount">Amount (PKR)</label>

              <div className="input-prefix-wrapper">
                <span className="prefix">Rs.</span>

                <input
                  id="sale-amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {/* =================================================
              PAYMENT METHOD
          ================================================= */}

          <div className="form-group">
            <label>Payment Method</label>

            <div className="payment-toggle-grid">
              {/* =============================================
                  BANK TRANSFER
              ============================================= */}

              <button
                type="button"
                className={`payment-btn ${
                  paymentMode === "bank transfer" ? "active" : ""
                }`}
                onClick={() => setPaymentMode("bank transfer")}
                disabled={isSubmitting}
              >
                <FaBuildingColumns />

                <span>Bank Transfer</span>
              </button>

              {/* =============================================
                  CASH
              ============================================= */}

              <button
                type="button"
                className={`payment-btn ${
                  paymentMode === "cash" ? "active" : ""
                }`}
                onClick={() => setPaymentMode("cash")}
                disabled={isSubmitting}
              >
                <FaMoneyBillWave />

                <span>Cash</span>
              </button>
            </div>
          </div>

          {/* =================================================
              REMARKS / NOTES
          ================================================= */}

          <div className="form-group">
            <label htmlFor="sale-notes">Detail / Remarks</label>

            <textarea
              id="sale-notes"
              rows="3"
              placeholder="Add any relevant notes..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* =================================================
              API ERROR
          ================================================= */}

          {error && <div className="login-error">{error}</div>}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              <FaFloppyDisk />

              <span>{isSubmitting ? "Recording..." : "Record Sale"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordNewSaleModal;
