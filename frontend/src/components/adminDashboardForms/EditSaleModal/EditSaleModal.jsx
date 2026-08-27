import React, { useEffect, useState } from "react";
import { ArrowLeft, Landmark, Banknote, CheckCircle2 } from "lucide-react";

import "./EditSaleModal.css";

const EditSaleModal = ({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  isSaving = false,
}) => {
  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    date: "",
    remarks: "",
    salesKg: "",
    totalAmount: "",
    paymentMode: "cash",
  });

  // =========================================================
  // NORMALIZE PAYMENT METHOD
  // =========================================================

  const normalizePaymentMethod = (method) => {
    const value = String(method || "")
      .trim()
      .toLowerCase();

    if (
      value === "bank" ||
      value === "bank transfer" ||
      value === "bank_transfer"
    ) {
      return "bank";
    }

    return "cash";
  };

  // =========================================================
  // LOAD SELECTED SALE DATA
  // =========================================================

  useEffect(() => {
    if (!isOpen || !initialData) {
      return;
    }

    setFormData({
      date: initialData.date || "",

      remarks: initialData.notes || initialData.remarks || "Daily Summary",

      salesKg:
        initialData.salesKg !== undefined ? String(initialData.salesKg) : "",

      totalAmount:
        initialData.totalAmount !== undefined
          ? String(initialData.totalAmount)
          : "",

      paymentMode: normalizePaymentMethod(initialData.paymentMethod),
    });
  }, [isOpen, initialData]);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!formData.date) {
      alert("Date is required.");
      return;
    }

    if (!formData.remarks.trim()) {
      alert("Remarks are required.");
      return;
    }

    if (!formData.salesKg || Number(formData.salesKg) <= 0) {
      alert("Please enter a valid sales KG.");
      return;
    }

    if (!formData.totalAmount || Number(formData.totalAmount) <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    if (!formData.paymentMode) {
      alert("Please select a payment method.");
      return;
    }

    // =======================================================
    // SEND DATA TO PARENT
    // =======================================================

    if (onSave) {
      onSave({
        id: initialData?.id,

        date: formData.date,

        cngVolume: Number(formData.salesKg),

        amount: Number(formData.totalAmount),

        paymentMethod: formData.paymentMode,

        // Single Remarks field
        notes: formData.remarks.trim(),
      });
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
      <div className="modal-card">
        {/* ===================================================
            MODAL HEADER
        =================================================== */}

        <div className="modal-header">
          <button
            type="button"
            className="btn-back"
            onClick={onClose}
            disabled={isSaving}
          >
            <ArrowLeft size={18} />
          </button>

          <h2 className="modal-title">Edit Record</h2>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* =================================================
              DATE
          ================================================= */}

          <div className="form-group">
            <label className="form-label">Date</label>

            <input
              type="date"
              value={formData.date}
              disabled
              className="form-input input-disabled"
            />

            <span className="helper-text">Identifier cannot be changed.</span>
          </div>

          {/* =================================================
              REMARKS
          ================================================= */}

          <div className="form-group">
            <label className="form-label">Remarks</label>

            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="form-input"
              disabled={isSaving}
              placeholder="Daily Summary"
              required
            />
          </div>

          {/* =================================================
              METRICS
          ================================================= */}

          <div className="section-divider">
            <span className="section-title">METRICS</span>
          </div>

          {/* =================================================
              SALES KG
          ================================================= */}

          <div className="form-group">
            <label className="form-label">Sales (KG)</label>

            <div className="input-with-prefix">
              <span className="input-prefix">KG</span>

              <input
                type="number"
                value={formData.salesKg}
                onChange={(e) => handleChange("salesKg", e.target.value)}
                className="form-input text-right font-bold"
                step="0.01"
                min="0"
                disabled={isSaving}
                required
              />
            </div>
          </div>

          {/* =================================================
              TOTAL AMOUNT
          ================================================= */}

          <div className="form-group">
            <label className="form-label">Total Amount</label>

            <div className="input-with-prefix">
              <span className="input-prefix">PKR</span>

              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleChange("totalAmount", e.target.value)}
                className="form-input text-right font-bold text-emerald"
                min="0"
                step="1"
                disabled={isSaving}
                required
              />
            </div>
          </div>

          {/* =================================================
              PAYMENT MODE
          ================================================= */}

          <div className="form-group">
            <label className="form-label">Payment Method</label>

            <div className="payment-mode-grid">
              {/* BANK TRANSFER */}

              <button
                type="button"
                className={`payment-card ${
                  formData.paymentMode === "bank" ? "active-bank" : ""
                }`}
                onClick={() => handleChange("paymentMode", "bank")}
                disabled={isSaving}
              >
                <Landmark size={20} />

                <span>Bank Transfer</span>
              </button>

              {/* CASH */}

              <button
                type="button"
                className={`payment-card ${
                  formData.paymentMode === "cash" ? "active-cash" : ""
                }`}
                onClick={() => handleChange("paymentMode", "cash")}
                disabled={isSaving}
              >
                <Banknote size={20} />

                <span>Cash</span>
              </button>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button type="submit" className="btn-save" disabled={isSaving}>
              <CheckCircle2 size={16} />

              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;
