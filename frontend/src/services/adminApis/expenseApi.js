import xiosInstance from "../axiosInstance";

// =========================================================
// CREATE EXPENSE
// =========================================================

export const createExpense = async (expenseData) => {
  const response = await xiosInstance.post(
    "/expense/createexpense",
    expenseData,
  );

  return response.data;
};

// =========================================================
// GET EXPENSE CATEGORIES
// =========================================================

export const getExpenseCategories = async () => {
  const response = await xiosInstance.get(
    "/expenseCategory/get",
  );

  return response.data;
};