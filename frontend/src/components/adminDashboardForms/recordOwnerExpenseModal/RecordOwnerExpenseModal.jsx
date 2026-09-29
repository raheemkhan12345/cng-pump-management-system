import { useState } from "react";
import {
  X,
  Calendar,
  Banknote,
  Building2,
  CheckCircle2,
  Plus,
} from "lucide-react";
import "./RecordOwnerExpenseModal.css";

const RecordOwnerExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  owners = [],
  ownersLoading = false,
  ownersError = "",
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMode: "Cash Account",
    selectedOwner: "",
    status: "Paid",
    detailRemarks: "",
  });

  if (!isOpen) return null;

  // =========================================================
  // GET OWNER NAME
  // =========================================================

  const getOwnerName = (owner) => {
    if (typeof owner === "string") {
      return owner;
    }

    return (
      owner?.ownerName ||
      owner?.name ||
      owner?.fullName ||
      owner?.owner ||
      owner?.title ||
      "Unnamed Owner"
    );
  };

  // =========================================================
  // GET OWNER ID
  // Backend expects owner ID
  // =========================================================

  const getOwnerValue = (owner) => {
    if (typeof owner === "string") {
      return owner;
    }

    return owner?._id || owner?.id || owner?.ownerId || "";
  };

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
  // HANDLE PAYMENT MODE
  // =========================================================

  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
  };

  // =========================================================
  // HANDLE FORM SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date) {
      window.alert("Please select a date.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      window.alert("Please enter a valid amount.");
      return;
    }

    if (!formData.selectedOwner) {
      window.alert("Please select an owner.");
      return;
    }

    // =======================================================
    // EXACT BACKEND PAYLOAD
    // =======================================================

    const ownerExpenseData = {
      date: formData.date,
      amount: Number(formData.amount),
      paymentMode: formData.paymentMode,
      owner: formData.selectedOwner,
      status: formData.status,
      remarks: formData.detailRemarks.trim(),
    };

    console.log("========================================");
    console.log("OWNER EXPENSE FORM SUBMIT");
    console.log(
      "OWNER EXPENSE PAYLOAD:",
      JSON.stringify(ownerExpenseData, null, 2),
    );
    console.log("========================================");

    if (onSubmit) {
      onSubmit(ownerExpenseData);
    }
  };

  return (
    <div className="roem-overlay">
      <div className="roem-modal-container">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="roem-header">
          <div className="roem-title-group">
            <div className="roem-header-icon-box">
              <Banknote size={20} />
            </div>

            <h2 className="roem-title">Record Owner Expense</h2>
          </div>

          <button
            className="roem-close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="roem-form">
          {/* ===================================================
              DATE & AMOUNT
          ==================================================== */}

          <div className="roem-grid-2">
            {/* DATE */}

            <div className="roem-field">
              <label className="roem-label">Date</label>

              <div className="roem-input-icon-wrapper">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="roem-input"
                  required
                  disabled={isSubmitting}
                />

                <Calendar size={18} className="roem-input-icon" />
              </div>
            </div>

            {/* AMOUNT */}

            <div className="roem-field">
              <label className="roem-label">Amount (PKR)</label>

              <div className="roem-amount-wrapper">
                <span className="roem-prefix">Rs.</span>

                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="roem-input roem-amount-input"
                  min="0"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* ===================================================
              PAYMENT MODE
          ==================================================== */}

          <div className="roem-field">
            <label className="roem-label">Payment Mode / Pool</label>

            <div className="roem-payment-grid">
              {/* CASH */}

              <div
                className={`roem-payment-card ${
                  formData.paymentMode === "Cash Account" ? "active" : ""
                }`}
                onClick={() =>
                  !isSubmitting && handlePaymentModeSelect("Cash Account")
                }
                role="button"
                tabIndex={0}
              >
                <div className="roem-payment-card-left">
                  <div className="roem-pm-icon">
                    <Banknote size={20} />
                  </div>

                  <div className="roem-pm-info">
                    <span className="roem-pm-title">Cash Account</span>

                    <span className="roem-pm-sub">Hand Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Cash Account" && (
                  <CheckCircle2 size={20} className="roem-check-icon" />
                )}
              </div>

              {/* BANK */}

              <div
                className={`roem-payment-card ${
                  formData.paymentMode === "Bank Account" ? "active" : ""
                }`}
                onClick={() =>
                  !isSubmitting && handlePaymentModeSelect("Bank Account")
                }
                role="button"
                tabIndex={0}
              >
                <div className="roem-payment-card-left">
                  <div className="roem-pm-icon">
                    <Building2 size={20} />
                  </div>

                  <div className="roem-pm-info">
                    <span className="roem-pm-title">Bank Account</span>

                    <span className="roem-pm-sub">Reserve Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Bank Account" && (
                  <CheckCircle2 size={20} className="roem-check-icon" />
                )}
              </div>
            </div>
          </div>

          {/* ===================================================
              OWNER
          ==================================================== */}

          <div className="roem-field">
            <label className="roem-label">Owner</label>

            <select
              name="selectedOwner"
              value={formData.selectedOwner}
              onChange={handleChange}
              className="roem-select"
              required
              disabled={ownersLoading || isSubmitting}
            >
              <option value="">
                {ownersLoading ? "Loading owners..." : "Select Owner"}
              </option>

              {!ownersLoading &&
                owners.length > 0 &&
                owners.map((owner, index) => {
                  const ownerName = getOwnerName(owner);

                  const ownerValue = getOwnerValue(owner);

                  return (
                    <option key={ownerValue || index} value={ownerValue}>
                      {ownerName}
                    </option>
                  );
                })}

              {!ownersLoading && owners.length === 0 && (
                <option value="" disabled>
                  No owners available
                </option>
              )}
            </select>

            {/* API ERROR */}

            {ownersError && (
              <small
                style={{
                  color: "#dc2626",
                  display: "block",
                  marginTop: "6px",
                }}
              >
                {ownersError}
              </small>
            )}

            {/* NO OWNERS */}

            {!ownersLoading && !ownersError && owners.length === 0 && (
              <small
                style={{
                  color: "#6b7280",
                  display: "block",
                  marginTop: "6px",
                }}
              >
                No owners found. Please add an owner first.
              </small>
            )}
          </div>

          {/* ===================================================
              STATUS
          ==================================================== */}

          <div className="roem-field">
            <label className="roem-label">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="roem-select"
              required
              disabled={isSubmitting}
            >
              <option value="Paid">Paid</option>

              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* ===================================================
              REMARKS
          ==================================================== */}

          <div className="roem-field">
            <label className="roem-label">Detail / Remarks</label>

            <textarea
              name="detailRemarks"
              placeholder="Enter any additional details about this expense..."
              value={formData.detailRemarks}
              onChange={handleChange}
              rows={3}
              className="roem-textarea"
              disabled={isSubmitting}
            />
          </div>

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <div className="roem-footer">
            <button
              type="button"
              className="roem-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="roem-btn-submit"
              disabled={ownersLoading || owners.length === 0 || isSubmitting}
            >
              <Plus size={18} />

              <span>{isSubmitting ? "Recording..." : "Record Expense"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordOwnerExpenseModal;
