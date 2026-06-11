import { axiosTTTInstance } from "@/utils/axiosInstance"

export const uploadDocument = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosTTTInstance.post(`/v1/documents`, formData);
        return response?.data;
    } catch (error: any) {
        console.log(`something went wrong during uploading document`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}