import { useEffect, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import "./AddDieselExpenseModal.css";

const initialFormData = {
  date: "",
  dieselQuantity: "",
  amount: "",
  remarks: "",
};

const AddDieselExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingExpense = null,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  // =========================================================
  // CHECK EDIT MODE
  // =========================================================

  const isEditMode = Boolean(editingExpense);

  // =========================================================
  // LOAD EDITING DATA
  // =========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingExpense) {
      setFormData({
        date: editingExpense?.date
          ? String(editingExpense.date).substring(0, 10)
          : "",

        dieselQuantity:
          editingExpense?.dieselQuantity ??
          editingExpense?.quantity ??
          editingExpense?.liters ??
          "",

        amount: editingExpense?.amount ?? "",

        remarks:
          editingExpense?.remarks ??
          editingExpense?.details ??
          editingExpense?.description ??
          "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, editingExpense]);

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

    // -------------------------------------------------------
    // Basic validation
    // -------------------------------------------------------

    if (!formData.date) {
      return;
    }

    if (!formData.dieselQuantity) {
      return;
    }

    if (!formData.amount) {
      return;
    }

    // -------------------------------------------------------
    // Backend API payload
    // -------------------------------------------------------

    const dieselExpenseData = {
      date: formData.date,

      dieselQuantity: Number(formData.dieselQuantity),

      amount: Number(formData.amount),

      remarks: formData.remarks.trim(),
    };

    console.log("========================================");
    console.log(
      isEditMode
        ? "Update Diesel Expense Payload:"
        : "Create Diesel Expense Payload:",
      dieselExpenseData,
    );
    console.log("Editing Expense:", editingExpense);
    console.log("========================================");

    // -------------------------------------------------------
    // Send data to parent
    // -------------------------------------------------------

    if (onSubmit) {
      onSubmit(dieselExpenseData);
    }
  };

  // =========================================================
  // HANDLE CLOSE
  // =========================================================

  const handleClose = () => {
    setFormData(initialFormData);

    if (onClose) {
      onClose();
    }
  };

  // =========================================================
  // MODAL CLOSED
  // =========================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="dem-overlay">
      <div className="dem-modal-container">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="dem-header">
          <h2 className="dem-title">
            {isEditMode ? "Edit Diesel Expense" : "Add Diesel Expense"}
          </h2>

          <button
            className="dem-close-btn"
            onClick={handleClose}
            type="button"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form onSubmit={handleSubmit} className="dem-form">
          {/* =================================================
              DATE
          ================================================== */}

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

          {/* =================================================
              DIESEL QUANTITY & AMOUNT
          ================================================== */}

          <div className="dem-grid-2">
            {/* Diesel Quantity */}

            <div className="dem-field">
              <label className="dem-label">Diesel Quantity (Liters)</label>

              <div className="dem-input-suffix-wrapper">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="dieselQuantity"
                  placeholder="0.00"
                  value={formData.dieselQuantity}
                  onChange={handleChange}
                  className="dem-input dem-input-suffix"
                  required
                />

                <span className="dem-suffix">L</span>
              </div>
            </div>

            {/* Amount */}

            <div className="dem-field">
              <label className="dem-label">Amount (PKR)</label>

              <div className="dem-input-prefix-wrapper">
                <span className="dem-prefix">Rs.</span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
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

          {/* =================================================
              REMARKS
          ================================================== */}

          <div className="dem-field">
            <label className="dem-label">Detail / Remarks</label>

            <textarea
              name="remarks"
              placeholder="Text here..."
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="dem-textarea"
            />
          </div>

          {/* =================================================
              FOOTER ACTIONS
          ================================================== */}

          <div className="dem-footer">
            <button
              type="button"
              className="dem-btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button type="submit" className="dem-btn-submit">
              <CheckCircle2 size={18} />

              <span>
                {isEditMode ? "Update Diesel Expense" : "Record Diesel Expense"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDieselExpenseModal;
