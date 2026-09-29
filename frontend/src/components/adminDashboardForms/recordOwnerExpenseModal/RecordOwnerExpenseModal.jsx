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
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMode: "Cash",
    selectedOwner: "",
    status: "Paid",
    detailRemarks: "",
  });

  if (!isOpen) return null;

  // ==========================================
  // Get Owner Name Safely
  // ==========================================
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

  // ==========================================
  // Get Owner Value Safely
  // ==========================================
  const getOwnerValue = (owner) => {
    if (typeof owner === "string") {
      return owner;
    }

    return owner?._id || owner?.id || owner?.ownerId || getOwnerName(owner);
  };

  // ==========================================
  // Handle Input Changes
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Handle Payment Mode
  // ==========================================
  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
  };

  // ==========================================
  // Handle Form Submit
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedOwner) {
      window.alert("Please select an owner.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      window.alert("Please enter a valid amount.");
      return;
    }

    if (onSubmit) {
      onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
    }

    onClose();
  };

  return (
    <div className="roem-overlay">
      <div className="roem-modal-container">
        {/* ==========================================
            Header
        ========================================== */}
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
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================================
            Form Body
        ========================================== */}
        <form onSubmit={handleSubmit} className="roem-form">
          {/* ==========================================
              Row 1: Date & Amount
          ========================================== */}
          <div className="roem-grid-2">
            {/* Date */}
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
                />

                <Calendar size={18} className="roem-input-icon" />
              </div>
            </div>

            {/* Amount */}
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
                />
              </div>
            </div>
          </div>

          {/* ==========================================
              Row 2: Payment Mode / Pool
          ========================================== */}
          <div className="roem-field">
            <label className="roem-label">Payment Mode / Pool</label>

            <div className="roem-payment-grid">
              {/* Cash Option */}
              <div
                className={`roem-payment-card ${
                  formData.paymentMode === "Cash" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Cash")}
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

                {formData.paymentMode === "Cash" && (
                  <CheckCircle2 size={20} className="roem-check-icon" />
                )}
              </div>

              {/* Bank Option */}
              <div
                className={`roem-payment-card ${
                  formData.paymentMode === "Bank" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Bank")}
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

                {formData.paymentMode === "Bank" && (
                  <CheckCircle2 size={20} className="roem-check-icon" />
                )}
              </div>
            </div>
          </div>

          {/* ==========================================
              Row 3: Dynamic Owner Dropdown
          ========================================== */}
          <div className="roem-field">
            <label className="roem-label">Owner</label>

            <select
              name="selectedOwner"
              value={formData.selectedOwner}
              onChange={handleChange}
              className="roem-select"
              required
              disabled={ownersLoading}
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

            {/* API Error */}
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

            {/* No Owners Message */}
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

          {/* ==========================================
              Row 4: Status
          ========================================== */}
          <div className="roem-field">
            <label className="roem-label">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="roem-select"
              required
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* ==========================================
              Row 5: Detail / Remarks
          ========================================== */}
          <div className="roem-field">
            <label className="roem-label">Detail / Remarks</label>

            <textarea
              name="detailRemarks"
              placeholder="Enter any additional details about this expense..."
              value={formData.detailRemarks}
              onChange={handleChange}
              rows={3}
              className="roem-textarea"
            />
          </div>

          {/* ==========================================
              Footer Actions
          ========================================== */}
          <div className="roem-footer">
            <button type="button" className="roem-btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="roem-btn-submit"
              disabled={ownersLoading || owners.length === 0}
            >
              <Plus size={18} />

              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordOwnerExpenseModal;
