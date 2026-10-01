import axiosInstance from "../axiosInstance";

export const getDashboard = async (year, month, date) => {
  const response = await axiosInstance.get("/dashboard/getDashboard", {
    params: {
      year,
      month,
      ...(date ? { date } : {}),
    },
  });

  return response.data;
};