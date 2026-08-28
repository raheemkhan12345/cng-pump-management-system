import axiosInstance from "../axiosInstance";

// =========================================================
// GET CASH & BANK DATA
// =========================================================

export const getCashBank = async () => {
  const response = await axiosInstance.get("/cashBank/getCashBank");

  return response.data;
};

// CREATE CASH & BANK TRANSFER

export const createCashBankTransfer = async (transferData) => {
  const response = await axiosInstance.post("/cashBank/transfer", transferData);
  return response.data;
};
