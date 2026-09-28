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
// CREATE EXPENSE CATEGORY
// =========================================================

export const createExpenseCategory = async (categoryData) => {
  const response = await axiosInstance.post(
    "/expenseCategory/create",
    categoryData,
  );

  return response.data;
};