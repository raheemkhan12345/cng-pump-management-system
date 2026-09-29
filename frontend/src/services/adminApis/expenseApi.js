import axiosInstance from "../axiosInstance";

// =========================================================
// CREATE EXPENSE
// =========================================================

export const createExpense = async (expenseData) => {
  const response = await axiosInstance.post(
    "/expense/createexpense",
    expenseData,
  );

  return response.data;
};

// =========================================================
// GET ALL EXPENSES
// =========================================================

export const getExpenses = async () => {
  const response = await axiosInstance.get("/expense/getexpense");

  return response.data;
};

// =========================================================
// GET EXPENSE CATEGORIES
// =========================================================

export const getExpenseCategories = async () => {
  const response = await axiosInstance.get(
    "/expenseCategory/get",
  );

  return response.data;
};

// =========================================================
// UPDATE EXPENSE
// PUT /expense/:id
// =========================================================

export const updateExpense = async (expenseId, expenseData) => {
  const response = await axiosInstance.put(
    `/expense/${expenseId}`,
    expenseData,
  );

  return response.data;
};

// =========================================================
// DELETE EXPENSE
// DELETE /expense/:id
// =========================================================

export const deleteExpense = async (expenseId) => {
  const response = await axiosInstance.delete(
    `/expense/${expenseId}`,
  );

  return response.data;
};

// =========================================================
// CREATE EXPENSE CATEGORY
// =========================================================

export const createExpenseCategory = async (categoryData) => {
  const response = await axiosInstance.post(
    "/expenseCategory/create",
    categoryData,
  );

  return response.data;
};


// =========================================================
// CREATE RECOVERY EXPENSE
// POST /recoveryExpense/create
// =========================================================

export const createRecoveryExpense = async (recoveryExpenseData) => {
  const response = await axiosInstance.post(
    "/recoveryExpense/create",
    recoveryExpenseData,
  );

  return response.data;
};


// GET ALL RECOVERY EXPENSES
export const getRecoveryExpenses = async () => {
  const response = await axiosInstance.get("/recoveryExpense/get");
  return response.data;
};