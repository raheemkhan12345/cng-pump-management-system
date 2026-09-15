import axiosInstance from "../axiosInstance";

// =========================================================
// CREATE INVENTORY ITEM
// =========================================================

export const createInventory = async (inventoryData) => {
  const response = await axiosInstance.post(
    "/inventory/createInventory",
    inventoryData,
  );

  return response.data;
};

export const getAllInventory = async () => {
  const response = await axiosInstance.get("/inventory/getAllInventoryItem");

  return response.data;
};

// UPDATE INVENTORY ITEM
export const updateInventory = async (id, inventoryData) => {
  const response = await axiosInstance.put(
    `/inventory/updateItem/${id}`,
    inventoryData,
  );

  return response.data;
};