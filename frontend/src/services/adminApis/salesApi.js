import axiosInstance from "../axiosInstance";

// =========================================================
// ADD NEW SALE
// =========================================================

export const addSale = async (saleData) => {
  const response = await axiosInstance.post("/sales/addSale", saleData);

  return response.data;
};

// =========================================================
// GET ALL SALES
// =========================================================

export const getAllSales = async () => {
  const response = await axiosInstance.get("/sales/getAllSale");

  return response.data;
};

export const updateSale = async (id, saleData) => {
  const response = await axiosInstance.put(`/sales/updateSale/${id}`, saleData);

  return response.data;
};

export const deleteSale = async (id) => {
  const response = await axiosInstance.delete(`/sales/deleteSale/${id}`);

  return response.data;
};
