
import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Banknote,
  Building2,
  CheckCircle2,
} from "lucide-react";

import { getExpenseCategories } from "../../../services/adminApis/expenseApi";

import "./ExpenseRecoveryModal.css";

const ExpenseRecoveryModal = ({ isOpen, onClose, onSubmit }) => {
  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    date: "",
    category: "",
    recoveryAmount: "",
    remarks: "",
    paymentMode: "Cash Account",
  });

  // =========================================================
  // CATEGORY STATE
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // =========================================================
  // CATEGORY HELPERS
  // =========================================================

  const getCategoryId = (item) => {
    if (!item) return "";

    if (typeof item === "string") {
      return item;
    }

    return item?._id || item?.id || item?.categoryId || "";
  };

  const getCategoryName = (item) => {
    if (!item) return "";

    if (typeof item === "string") {
      return item;
    }

    return (
      item?.name ||
      item?.title ||
      item?.categoryName ||
      item?.label ||
      ""
    );
  };

  // =========================================================
  // FETCH EXPENSE CATEGORIES
  // =========================================================

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);

        const response = await getExpenseCategories();

        const categoryData = Array.isArray(response?.expenseCategories)
          ? response.expenseCategories
          : Array.isArray(response?.categories)
            ? response.categories
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];

        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch expense categories:", error);
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

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
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date) {
      window.alert("Please select a date.");
      return;
    }

    if (!formData.category) {
      window.alert("Please select an expense category.");
      return;
    }

    if (!formData.recoveryAmount || Number(formData.recoveryAmount) <= 0) {
      window.alert("Please enter a valid recovery amount.");
      return;
    }

    const recoveryExpenseData = {
      date: formData.date,
      category: formData.category,
      recoveryAmount: Number(formData.recoveryAmount),
      remarks: formData.remarks,
      paymentMode: formData.paymentMode,
    };

    if (onSubmit) {
      onSubmit(recoveryExpenseData);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    setFormData({
      date: "",
      category: "",
      recoveryAmount: "",
      remarks: "",
      paymentMode: "Cash Account",
    });

    onClose();
  };

  // =========================================================
  // MODAL
  // =========================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="erm-overlay">
      <div className="erm-modal-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="erm-header">
          <h2 className="erm-title">Expense Recovery</h2>

          <button
            type="button"
            className="erm-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="erm-form">

          {/* ===================================================
              DATE & CATEGORY
          ==================================================== */}

          <div className="erm-grid-2">

            {/* DATE */}

            <div className="erm-field">
              <label className="erm-label">Date</label>

              <div className="erm-input-icon-wrapper">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="erm-input"
                  required
                />

                <Calendar size={18} className="erm-input-icon" />
              </div>
            </div>

            {/* EXPENSE CATEGORY */}

            <div className="erm-field">
              <label className="erm-label">Expense Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="erm-input"
                disabled={isCategoriesLoading}
                required
              >
                <option value="" disabled>
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : "Select a category..."}
                </option>

                {categories.map((item) => {
                  const categoryId = getCategoryId(item);
                  const categoryName = getCategoryName(item);

                  if (!categoryId) {
                    return null;
                  }

                  return (
                    <option key={categoryId} value={categoryId}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

          {/* ===================================================
              RECOVERY AMOUNT
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Recovery Amount (PKR)</label>

            <div className="erm-amount-input-wrapper">
              <span className="erm-currency-prefix">Rs.</span>

              <input
                type="number"
                name="recoveryAmount"
                placeholder="0.00"
                value={formData.recoveryAmount}
                onChange={handleChange}
                className="erm-input erm-amount-input"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* ===================================================
              DETAILS / REMARKS
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Detail / Remarks</label>

            <textarea
              name="remarks"
              placeholder="Text here..."
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="erm-textarea"
            />
          </div>

          {/* ===================================================
              PAYMENT MODE
          ==================================================== */}

          <div className="erm-field">
            <label className="erm-label">Payment Mode / Pool</label>

            <div className="erm-payment-grid">

              {/* CASH ACCOUNT */}

              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Cash Account" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Cash Account")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePaymentModeSelect("Cash Account");
                  }
                }}
              >
                <div className="erm-payment-card-left">
                  <div className="erm-pm-icon-box">
                    <Banknote size={20} />
                  </div>

                  <div className="erm-pm-text">
                    <span className="erm-pm-title">Cash Account</span>
                    <span className="erm-pm-sub">Hand Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Cash Account" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>

              {/* BANK ACCOUNT */}

              <div
                className={`erm-payment-card ${
                  formData.paymentMode === "Bank Account" ? "active" : ""
                }`}
                onClick={() => handlePaymentModeSelect("Bank Account")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePaymentModeSelect("Bank Account");
                  }
                }}
              >
                <div className="erm-payment-card-left">
                  <div className="erm-pm-icon-box">
                    <Building2 size={20} />
                  </div>

                  <div className="erm-pm-text">
                    <span className="erm-pm-title">Bank Account</span>
                    <span className="erm-pm-sub">Reserve Pool</span>
                  </div>
                </div>

                {formData.paymentMode === "Bank Account" && (
                  <CheckCircle2 size={20} className="erm-check-icon" />
                )}
              </div>

            </div>
          </div>

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <div className="erm-footer">

            <button
              type="button"
              className="erm-btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="erm-btn-submit"
              disabled={isCategoriesLoading || categories.length === 0}
            >
              <CheckCircle2 size={18} />

              <span>Record Recovery</span>
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ExpenseRecoveryModal;
