import { useEffect, useState } from "react";
import { X, Calendar, Landmark, Wallet, Save } from "lucide-react";

import "./EditSaleModal.css";

const EditSaleModal = ({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  isSaving = false,
}) => {
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
      value === "bank_transfer" ||
      value === "bankaccount" ||
      value === "bank account"
    ) {
      return "bank";
    }

    return "cash";
  };

  // =========================================================
  // GET INITIAL FORM DATA
  // =========================================================

  const getInitialFormData = (data) => {
    if (!data) {
      return {
        date: "",
        remarks: "",
        salesKg: "",
        totalAmount: "",
        paymentMode: "cash",
      };
    }

    return {
      // DATE
      date: data?.date ? String(data.date).slice(0, 10) : "",

      // REMARKS
      remarks: data?.notes || data?.remarks || data?.detail || "Daily Summary",

      // SALES KG
      salesKg:
        data?.salesKg !== undefined && data?.salesKg !== null
          ? String(data.salesKg)
          : data?.cngVolume !== undefined && data?.cngVolume !== null
            ? String(data.cngVolume)
            : data?.volume !== undefined && data?.volume !== null
              ? String(data.volume)
              : "",

      // TOTAL AMOUNT
      totalAmount:
        data?.totalAmount !== undefined && data?.totalAmount !== null
          ? String(data.totalAmount)
          : data?.amount !== undefined && data?.amount !== null
            ? String(data.amount)
            : "",

      // PAYMENT METHOD
      paymentMode: normalizePaymentMethod(
        data?.paymentMethod || data?.paymentMode,
      ),
    };
  };

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialData),
  );

  // =========================================================
  // LOAD SELECTED SALE DATA
  // =========================================================

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(getInitialFormData(initialData));
    }
  }, [initialData, isOpen]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // SELECT PAYMENT MODE
  // =========================================================

  const handlePaymentModeChange = (paymentMode) => {
    if (isSaving) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      paymentMode,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

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

    // -------------------------------------------------------
    // SEND DATA TO PARENT
    // -------------------------------------------------------

    if (onSave) {
      onSave({
        id: initialData?.id,

        date: formData.date,

        cngVolume: Number(formData.salesKg),

        amount: Number(formData.totalAmount),

        paymentMethod: formData.paymentMode,

        notes: formData.remarks.trim(),
      });
    }
  };

  // =========================================================
  // HANDLE CLOSE
  // =========================================================

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    onClose();
  };

  // =========================================================
  // MODAL STATE
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="modal-header">
          <h2 className="modal-title">Edit Sale Record</h2>

          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* =================================================
                DATE
            ================================================= */}

            <div className="form-group">
              <label htmlFor="edit-sale-date">DATE</label>

              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />

                <input
                  id="edit-sale-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  disabled
                  onChange={handleChange}
                  required
                />
              </div>

              <span className="helper-text">Identifier cannot be changed.</span>
            </div>

            {/* =================================================
                REMARKS
            ================================================= */}

            <div className="form-group">
              <label htmlFor="edit-sale-remarks">REMARKS</label>

              <input
                id="edit-sale-remarks"
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Daily Summary"
                disabled={isSaving}
                required
              />
            </div>

            {/* =================================================
                SALES KG
            ================================================= */}

            <div className="form-group">
              <label htmlFor="edit-sale-kg">SALES (KG)</label>

              <div className="amount-box">
                <span className="currency-prefix">KG</span>

                <input
                  id="edit-sale-kg"
                  type="number"
                  name="salesKg"
                  value={formData.salesKg}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  disabled={isSaving}
                  required
                />
              </div>
            </div>

            {/* =================================================
                TOTAL AMOUNT
            ================================================= */}

            <div className="form-group">
              <label htmlFor="edit-sale-amount">TOTAL AMOUNT (PKR)</label>

              <div className="amount-box">
                <span className="currency-prefix">Rs.</span>

                <input
                  id="edit-sale-amount"
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  disabled={isSaving}
                  required
                />
              </div>
            </div>

            {/* =================================================
                PAYMENT MODE
            ================================================= */}

            <div className="form-group full-width">
              <label>PAYMENT MODE / POOL</label>

              <div className="payment-mode-grid">
                {/* CASH */}

                <button
                  type="button"
                  className={`payment-card ${
                    formData.paymentMode === "cash" ? "active-cash" : ""
                  }`}
                  onClick={() => handlePaymentModeChange("cash")}
                  disabled={isSaving}
                  aria-pressed={formData.paymentMode === "cash"}
                >
                  <Wallet size={20} />

                  <div>
                    <strong>Cash Account</strong>

                    <p>Hand Pool</p>
                  </div>
                </button>

                {/* BANK */}

                <button
                  type="button"
                  className={`payment-card ${
                    formData.paymentMode === "bank transfer" ? "active-bank" : ""
                  }`}
                  onClick={() => handlePaymentModeChange("bank transfer")}
                  disabled={isSaving}
                  aria-pressed={formData.paymentMode === "bank transfer"}
                >
                  <Landmark size={20} />

                  <div>
                    <strong>Bank Account</strong>

                    <p>Reserve Pool</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="modal-footer">
            {/* CANCEL */}

            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            {/* UPDATE */}

            <button type="submit" className="btn-save" disabled={isSaving}>
              <Save size={16} />

              <span>{isSaving ? "Updating..." : "Update Sale"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;
