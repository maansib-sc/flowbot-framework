import { axiosPDFInstance, axiosConvInstance } from "@/utils/axiosInstance";

type CHAT_ID = string | string[] | undefined

export const getPDFList = async (chatId: CHAT_ID) => {
    try {
        const response = await axiosPDFInstance.get(`/pdf/list?chatbot_id=${chatId}`);
        return response.data.data;
    } catch (error) {

    }
}

export const uploadPDF = async (chatId: CHAT_ID, data: any) => {
    try {
        await axiosPDFInstance.post(`/pdf/upload?chatbot_id=${chatId}`, data);
    } catch (error) {

    }
}

export const deletePDFList = async (chatId: CHAT_ID) => {
    try {
        await axiosPDFInstance.get(`/chatbot/untrain?chatbot_id=${chatId}`);
    } catch (error) {

    }
}

export const pdfFileProgress = async (filename: string) => {
    try {
        return await axiosPDFInstance.get(`/pdf/progress?file_name=${filename}`);
    } catch (error) {

    }
}

export const getConvList = async (chatId: CHAT_ID) => {
    try {
        const response = await axiosConvInstance.get(`/training/chats/training_ids?namespace=${chatId}`);
        return response.data;
    } catch (error) {

    }
}

export const uploadConv = async (chatId: CHAT_ID, data: any) => {
    try {
        await axiosConvInstance.post(`/training/chats?namespace=${chatId}`, data);
    } catch (error) {

    }
}

export const deleteConvList = async (chatId: CHAT_ID) => {
    try {
        await axiosConvInstance.delete(`/training/namespace?chat_id=${chatId}`);
    } catch (error) {

    }
}

export const whatsAppFileProgress = async (filename: string) => {
    try {
        return await axiosConvInstance.get(`/training/chats/progress?training_id=${filename}`);
    } catch (error) {

    }
}