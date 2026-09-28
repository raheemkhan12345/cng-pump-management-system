import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  CreditCard,
  Building2,
  Plus,
  Banknote,
  Tag,
} from "lucide-react";

import {
  createExpense,
  updateExpense,
  getExpenseCategories,
  createExpenseCategory,
} from "../../../services/adminApis/expenseApi";

import "./AddNewExpenses.css";

const AddNewExpenses = ({
  isOpen,
  onClose,
  onSuccess,
  editingExpense = null,
}) => {
  // =========================================================
  // EDIT MODE
  // =========================================================

  const isEditMode = Boolean(editingExpense);

  // =========================================================
  // FORM STATES
  // =========================================================

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [status, setStatus] = useState("Paid");
  const [remarks, setRemarks] = useState("");

  // =========================================================
  // CATEGORY STATES
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // =========================================================
  // NEW CATEGORY STATES
  // =========================================================

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // =========================================================
  // SUBMIT STATE
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    return item?.name || item?.title || item?.categoryName || item?.label || "";
  };

  const getPaymentModeValue = (value) => {
    if (!value) {
      return "cash";
    }

    let paymentValue = value;

    if (typeof value === "object") {
      paymentValue =
        value?.name ||
        value?.title ||
        value?.paymentMethod ||
        value?.paymentMode ||
        value?.label ||
        "";
    }

    const normalizedValue = String(paymentValue).toLowerCase();

    if (normalizedValue.includes("bank")) {
      return "bank";
    }

    return "cash";
  };

  const getExpenseDate = (expenseDate) => {
    if (!expenseDate) {
      return new Date().toISOString().split("T")[0];
    }

    const dateString = String(expenseDate);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    const parsedDate = new Date(expenseDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date().toISOString().split("T")[0];
    }

    return parsedDate.toISOString().split("T")[0];
  };

  const getExpenseRemarks = (expense) => {
    return expense?.remarks || expense?.details || expense?.description || "";
  };

  // =========================================================
  // GET EXPENSE CATEGORIES
  // =========================================================

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);

        const response = await getExpenseCategories();

        console.log("========================================");
        console.log("Expense Categories API Response:", response);
        console.log("========================================");

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

        console.log("Expense Categories:", categoryData);
      } catch (error) {
        console.log("========================================");
        console.log("Failed to fetch expense categories.");
        console.log("Category Error:", error);
        console.log("Status:", error?.response?.status);
        console.log("Server Response:", error?.response?.data);
        console.log("========================================");

        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  // =========================================================
  // PREFILL FORM WHEN EDITING
  // =========================================================

  useEffect(() => {
    if (!isOpen) return;

    if (!editingExpense) {
      resetForm();
      return;
    }

    console.log("========================================");
    console.log("Prefilling Expense For Edit:", editingExpense);
    console.log("========================================");

    // Date
    setDate(
      getExpenseDate(
        editingExpense?.date ||
          editingExpense?.expenseDate ||
          editingExpense?.createdAt,
      ),
    );

    // Amount
    setAmount(
      editingExpense?.amount ??
        editingExpense?.totalAmount ??
        editingExpense?.expenseAmount ??
        "",
    );

    // Category
    setCategory(getCategoryId(editingExpense?.category));

    // Payment Mode
    setPaymentMode(
      getPaymentModeValue(
        editingExpense?.paymentMethod || editingExpense?.paymentMode,
      ),
    );

    // Status
    setStatus(editingExpense?.status || "Paid");

    // Remarks
    setRemarks(getExpenseRemarks(editingExpense));

    // Close Add Category section
    setIsAddingCategory(false);
    setNewCategoryName("");
  }, [isOpen, editingExpense]);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setAmount("");
    setCategory("");
    setPaymentMode("cash");
    setStatus("Paid");
    setRemarks("");

    setIsAddingCategory(false);
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (isSubmitting || isCreatingCategory) return;

    resetForm();
    onClose();
  };

  // =========================================================
  // OPEN ADD CATEGORY
  // =========================================================

  const handleOpenAddCategory = () => {
    if (isSubmitting || isCreatingCategory) return;

    setIsAddingCategory(true);
    setNewCategoryName("");
  };

  // =========================================================
  // CANCEL ADD CATEGORY
  // =========================================================

  const handleCancelAddCategory = () => {
    if (isCreatingCategory) return;

    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  // =========================================================
  // CREATE NEW EXPENSE CATEGORY
  // =========================================================

  const handleAddCategory = async () => {
    const trimmedCategoryName = newCategoryName.trim();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!trimmedCategoryName) {
      console.error("Category Error: Category name is required.");
      return;
    }

    // =======================================================
    // DUPLICATE CHECK
    // =======================================================

    const categoryAlreadyExists = categories.some((item) => {
      const existingName = getCategoryName(item);

      return (
        existingName.trim().toLowerCase() === trimmedCategoryName.toLowerCase()
      );
    });

    if (categoryAlreadyExists) {
      console.error("Category Error: This category already exists.");
      return;
    }

    try {
      setIsCreatingCategory(true);

      const categoryData = {
        name: trimmedCategoryName,
      };

      console.log("========================================");
      console.log("Create Expense Category Request:", categoryData);
      console.log("========================================");

      const response = await createExpenseCategory(categoryData);

      console.log("========================================");
      console.log("Expense Category Created Successfully!");
      console.log("Create Category Response:", response);
      console.log("========================================");

      // =====================================================
      // GET CREATED CATEGORY
      // =====================================================

      const createdCategory =
        response?.expenseCategory ||
        response?.category ||
        response?.data?.expenseCategory ||
        response?.data?.category;

      const createdCategoryId = getCategoryId(createdCategory);

      // =====================================================
      // BACKEND RETURNS CREATED CATEGORY
      // =====================================================

      if (createdCategoryId) {
        setCategories((previousCategories) => [
          ...previousCategories,
          createdCategory,
        ]);

        setCategory(createdCategoryId);
      } else {
        // ===================================================
        // FALLBACK: FETCH CATEGORIES AGAIN
        // ===================================================

        const categoriesResponse = await getExpenseCategories();

        const updatedCategories = Array.isArray(
          categoriesResponse?.expenseCategories,
        )
          ? categoriesResponse.expenseCategories
          : Array.isArray(categoriesResponse?.categories)
            ? categoriesResponse.categories
            : Array.isArray(categoriesResponse?.data)
              ? categoriesResponse.data
              : Array.isArray(categoriesResponse)
                ? categoriesResponse
                : [];

        setCategories(updatedCategories);

        const newlyCreatedCategory = updatedCategories.find((item) => {
          const existingName = getCategoryName(item);

          return (
            existingName.trim().toLowerCase() ===
            trimmedCategoryName.toLowerCase()
          );
        });

        const newlyCreatedCategoryId = getCategoryId(newlyCreatedCategory);

        if (newlyCreatedCategoryId) {
          setCategory(newlyCreatedCategoryId);
        }
      }

      // =====================================================
      // CLOSE NEW CATEGORY INPUT
      // =====================================================

      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.log("========================================");
      console.log("Failed to create expense category.");
      console.log("Category Error:", error);
      console.log("Status:", error?.response?.status);
      console.log("Server Response:", error?.response?.data);
      console.log("Response Message:", error?.response?.data?.message);
      console.log("Response Error:", error?.response?.data?.error);
      console.log("========================================");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // =========================================================
  // CREATE / UPDATE EXPENSE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!date) {
      console.error("Expense Error: Date is required.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      console.error("Expense Error: Please enter a valid amount.");
      return;
    }

    if (!category) {
      console.error("Expense Error: Please select an expense category.");
      return;
    }

    // =======================================================
    // PAYMENT MODE
    // =======================================================

    const selectedPaymentMode =
      paymentMode === "cash" ? "Cash Account" : "Bank Account";

    // =======================================================
    // API PAYLOAD
    // =======================================================

    const expenseData = {
      date,
      amount: Number(amount),
      category,
      paymentMode: selectedPaymentMode,
      status,
      remarks,
    };

    console.log("========================================");
    console.log(
      isEditMode
        ? "UPDATE EXPENSE API REQUEST:"
        : "CREATE EXPENSE API REQUEST:",
    );
    console.log(expenseData);
    console.log("========================================");

    try {
      setIsSubmitting(true);

      let response;

      // =====================================================
      // UPDATE EXISTING EXPENSE
      // =====================================================

      if (isEditMode) {
        const expenseId =
          editingExpense?._id ||
          editingExpense?.id ||
          editingExpense?.expenseId;

        if (!expenseId) {
          console.error("Expense Error: Expense ID is missing. Cannot update.");

          return;
        }

        console.log("Updating Expense ID:", expenseId);

        response = await updateExpense(expenseId, expenseData);
      } else {
        // ===================================================
        // CREATE NEW EXPENSE
        // ===================================================

        response = await createExpense(expenseData);
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log("========================================");
      console.log(
        isEditMode
          ? "Expense updated successfully!"
          : "Expense added successfully!",
      );
      console.log("Expense Response:", response);
      console.log("========================================");

      if (onSuccess) {
        await onSuccess(response);
      }

      resetForm();

      onClose();
    } catch (error) {
      console.log("========================================");
      console.log(
        isEditMode ? "Failed to update expense." : "Failed to add expense.",
      );
      console.log("Expense Error:", error);
      console.log("Status:", error?.response?.status);
      console.log("Server Response:", error?.response?.data);
      console.log("Response Message:", error?.response?.data?.message);
      console.log("Response Error:", error?.response?.data?.error);
      console.log("========================================");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // MODAL
  // =========================================================

  if (!isOpen) return null;

  return (
    <div className="ane-modal-overlay">
      <div className="ane-modal-container">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="ane-modal-header">
          <div className="ane-header-info">
            <div className="ane-header-icon-box">
              <Banknote size={20} className="ane-header-icon" />
            </div>

            <div>
              <h2 className="ane-modal-title">
                {isEditMode ? "Edit Expense" : "Record New Expense"}
              </h2>

              <p className="ane-modal-subtitle">
                {isEditMode
                  ? "Update expense information."
                  : "Log an outgoing payment or operational cost."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="ane-close-btn"
            onClick={handleClose}
            disabled={isSubmitting || isCreatingCategory}
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="ane-modal-body">
            {/* =================================================
                DATE & AMOUNT
            ================================================= */}

            <div className="ane-form-row">
              {/* DATE */}

              <div className="ane-form-group">
                <label className="ane-label">Date</label>

                <div className="ane-input-icon-wrapper">
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="ane-input"
                    disabled={isSubmitting}
                  />

                  <Calendar size={18} className="ane-input-icon" />
                </div>
              </div>

              {/* AMOUNT */}

              <div className="ane-form-group">
                <label className="ane-label">Amount (PKR)</label>

                <div className="ane-amount-wrapper">
                  <span className="ane-currency-prefix">Rs.</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    className="ane-input ane-input-amount"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                EXPENSE CATEGORY
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Expense Category</label>

              <select
                className="ane-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={isCategoriesLoading || isSubmitting}
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

              {/* =================================================
                  ADD NEW CATEGORY BUTTON
              ================================================= */}

              {!isAddingCategory && (
                <button
                  type="button"
                  className="ane-add-category-btn"
                  onClick={handleOpenAddCategory}
                  disabled={isSubmitting || isCategoriesLoading}
                >
                  <Plus size={15} />

                  <span>Add New Category</span>
                </button>
              )}

              {/* =================================================
                  NEW CATEGORY INPUT
              ================================================= */}

              {isAddingCategory && (
                <div className="ane-new-category-box">
                  <div className="ane-new-category-input-wrapper">
                    <Tag size={15} className="ane-new-category-icon" />

                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(event) =>
                        setNewCategoryName(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();

                          if (!isCreatingCategory) {
                            handleAddCategory();
                          }
                        }
                      }}
                      placeholder="Enter new category name"
                      className="ane-new-category-input"
                      disabled={isCreatingCategory}
                      autoFocus
                    />
                  </div>

                  <div className="ane-new-category-actions">
                    <button
                      type="button"
                      className="ane-category-cancel-btn"
                      onClick={handleCancelAddCategory}
                      disabled={isCreatingCategory}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="ane-category-add-btn"
                      onClick={handleAddCategory}
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                    >
                      <Plus size={14} />

                      <span>
                        {isCreatingCategory ? "Adding..." : "Add Category"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                PAYMENT MODE
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Payment Mode / Pool</label>

              <div className="ane-payment-grid">
                {/* CASH */}

                <div
                  className={`ane-payment-card ${
                    paymentMode === "cash" ? "ane-active" : ""
                  }`}
                  onClick={() => {
                    if (!isSubmitting) {
                      setPaymentMode("cash");
                    }
                  }}
                >
                  <div className="ane-card-left">
                    <CreditCard size={20} className="ane-card-icon" />

                    <div>
                      <span className="ane-card-title">Cash Account</span>

                      <span className="ane-card-sub">Hand Pool</span>
                    </div>
                  </div>

                  {paymentMode === "cash" && (
                    <div className="ane-check-badge">✓</div>
                  )}
                </div>

                {/* BANK */}

                <div
                  className={`ane-payment-card ${
                    paymentMode === "bank" ? "ane-active" : ""
                  }`}
                  onClick={() => {
                    if (!isSubmitting) {
                      setPaymentMode("bank");
                    }
                  }}
                >
                  <div className="ane-card-left">
                    <Building2 size={20} className="ane-card-icon" />

                    <div>
                      <span className="ane-card-title">Bank Account</span>

                      <span className="ane-card-sub">Reserve Pool</span>
                    </div>
                  </div>

                  {paymentMode === "bank" && (
                    <div className="ane-check-badge">✓</div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Status</label>

              <select
                className="ane-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                disabled={isSubmitting}
              >
                <option value="Paid">Paid</option>

                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* =================================================
                REMARKS
            ================================================= */}

            <div className="ane-form-group">
              <label className="ane-label">Detail / Remarks</label>

              <textarea
                rows="3"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter any additional details about this expense..."
                className="ane-textarea"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ane-modal-footer">
            <button
              type="button"
              className="ane-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting || isCreatingCategory}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ane-btn-submit"
              disabled={
                isSubmitting || isCategoriesLoading || isCreatingCategory
              }
            >
              <Plus size={16} />

              <span>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Recording..."
                  : isEditMode
                    ? "Update Expense"
                    : "Record Expense"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewExpenses;
