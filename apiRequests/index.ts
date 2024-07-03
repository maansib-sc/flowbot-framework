import { axiosPDFInstance, axiosConvInstance } from "@/utils/axiosInstance";

type CHAT_ID = string | string[] | undefined

export const getPDFList = async (chatId: CHAT_ID) => {
    try {
        const response = await axiosPDFInstance.get(`/data/list?chatbot_id=${chatId}`);
        return response.data.data;
    } catch (error) {

    }
}

export const uploadPDF = async (chatId: CHAT_ID, data: any) => {
    try {
        await axiosPDFInstance.post(`/data/upload?chatbot_id=${chatId}`, data);
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
        return await axiosPDFInstance.get(`/data/progress?file_name=${filename}`);
    } catch (error) {
        console.log(`something went wrong during checking the data progress ${error}`);
        return false;
    }
}

export const getConvList = async (chatId: CHAT_ID) => {
    try {
        const response = await axiosConvInstance.get(`/training/training_ids?namespace=${chatId}`);
        return response.data;
    } catch (error) {

    }
}

export const uploadConv = async (chatId: CHAT_ID, data: any) => {
    try {
        await axiosConvInstance.post(`/training/chats?chat_id=${chatId}&book_type=whatsapp-conversation`, data);
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
        return await axiosConvInstance.get(`/training/progress?training_id=${filename}`);
    } catch (error) {

    }
}


export const getDefaultPromptTemplate = async (chatId: CHAT_ID) => {
    try {
        return await axiosConvInstance.get(`/prompt_template?chat_id=${chatId}`);
    } catch (error) {

    }
}

export const resetPromptTemplate = async (chatId: CHAT_ID) => {
    try {
        return await axiosConvInstance.post(`/prompt_template/reset?chat_id=${chatId}`);
    } catch (error) {

    }
}

export const submitPromptTemplate = async (chatId: CHAT_ID, data: any) => {
    try {
        return await axiosConvInstance.post(`/prompt_template?chat_id=${chatId}`, data);
    } catch (error) {

    }
}
