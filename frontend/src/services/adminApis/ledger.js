import axiosInstance from "../axiosInstance";

export const getLedger = async (currentPage, pageSize) => {
    const response = await axiosInstance.get("/ledger/getLedger", {
        params: {
            page: currentPage,
            limit: pageSize,
        },
    });

    return response.data;
};