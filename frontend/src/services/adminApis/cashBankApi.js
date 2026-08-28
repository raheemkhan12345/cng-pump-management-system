import axiosInstance from "../axiosInstance";

// =========================================================
// GET CASH & BANK DATA
// =========================================================

export const getCashBank = async () => {
  const response = await axiosInstance.get("/cashBank/getCashBank");

  return response.data;
};
