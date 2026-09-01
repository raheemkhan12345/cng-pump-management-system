import expenseAxiosInstance from "../expenseAxiosInstance";

// =========================================================
// CREATE EXPENSE
// =========================================================

export const createExpense = async (expenseData) => {
  const response = await expenseAxiosInstance.post(
    "/expense/createexpense",
    expenseData,
  );

  return response.data;
};
