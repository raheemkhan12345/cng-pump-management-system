import axiosInstance from "../axiosInstance";

export const getDashboard = async () => {
  const response = await axiosInstance.get("/dashboard/getDashboard");

  return response.data;
};