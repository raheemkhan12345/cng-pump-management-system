import { useState } from "react";
import { X, Calendar, User, Wallet, Landmark, Save } from "lucide-react";

import "./RecordLoanModel.css";

const RecordLoanModal = ({ isOpen, onClose, onSave, isSubmitting }) => {
  // =========================================================
  // DEFAULT FORM
  // =========================================================

  const getDefaultFormData = () => ({
    date: new Date().toISOString().split("T")[0],
    loanType: "loan_given",
    personName: "",
    amount: "",
    paymentMode: "cash",
  });

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState(getDefaultFormData());

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
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date || !formData.personName.trim() || !formData.amount) {
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData(getDefaultFormData());
  };

  // =========================================================
  // HANDLE CLOSE
  // =========================================================

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  // =========================================================
  // MODAL STATE
  // =========================================================

  if (!isOpen) return null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="modal-header">
          <h2>Record New Loan</h2>

          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* =================================================
                DATE
            ================================================= */}

            <div className="form-group">
              <label>DATE</label>

              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* =================================================
                LOAN TYPE
            ================================================= */}

            <div className="form-group">
              <label>LOAN TYPE</label>

              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="loan_given">Loan Given</option>
                <option value="loan_received">Loan Received</option>
              </select>
            </div>

            {/* =================================================
                PERSON / COMPANY
            ================================================= */}

            <div className="form-group">
              <label>NAME</label>

              <div className="input-with-icon">
                <User size={18} className="input-icon" />

                <input
                  type="text"
                  name="personName"
                  placeholder="Enter name ..."
                  value={formData.personName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <div className="form-group">
              <label>AMOUNT (PKR)</label>

              <div className="amount-input-box">
                <span className="currency-prefix">Rs.</span>

                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* =================================================
                PAYMENT MODE / POOL
            ================================================= */}

            <div className="form-group full-width">
              <label>PAYMENT MODE / POOL</label>

              <div className="payment-options">
                {/* CASH */}

                <button
                  type="button"
                  className={`payment-card ${
                    formData.paymentMode === "cash" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMode: "cash",
                    }))
                  }
                  disabled={isSubmitting}
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
                    formData.paymentMode === "bank" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMode: "bank",
                    }))
                  }
                  disabled={isSubmitting}
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

          {/* =====================================================
              FOOTER ACTIONS
          ===================================================== */}

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
              <Save size={16} />

              {isSubmitting ? "Recording..." : "Record Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordLoanModal;
