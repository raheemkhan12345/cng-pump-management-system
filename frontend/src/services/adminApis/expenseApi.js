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
// GET EXPENSE CATEGORIES
// =========================================================

export const getExpenseCategories = async () => {
  const response = await axiosInstance.get(
    "/expenseCategory/get",
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