import axiosInstance from "../axiosInstance";

// =========================================================
// CREATE LOAN
// =========================================================

export const createLoan = async (loanData) => {
  const response = await axiosInstance.post("/loans/createLoan", loanData);

  return response.data;
};

export const getAllLoans = async () => {
  const response = await axiosInstance.get("/loans/getAllLoan");

  return response.data;
};

export const updateLoan = async (id, payload) => {
  return await axiosInstance.put(`/loans/updateLoan/${id}`, payload);
};
