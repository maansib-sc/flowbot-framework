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

export const getJobProgress = async (jobId: string) => {
    try {
        const response = await axiosTTTInstance.get(`/v1/jobs/${encodeURIComponent(jobId)}`);
        return response?.data;
    } catch (error: any) {
        console.log(`Error fetching job progress for ${jobId}`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}

export const cancelDocumentProcessing = async (jobId: string) => {
    try {
        const response = await axiosTTTInstance.post(`/v1/jobs/${encodeURIComponent(jobId)}/cancel`);
        return response?.data;
    } catch (error: any) {
        console.log(`Error in cancelling the document processing with jobid: ${jobId}`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}

export const getDocumentTreeJSon = async (graphId: string) => {
    try {
        const response = await axiosTTTInstance.get('/v1/tree/json', {
            params: {
                graph_id: graphId,
            },
        });
        return response?.data;
    } catch (error: any) {
        console.log(`Error in fetching document tree json with graphId: ${graphId}`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}

export const listPublicNamespaces = async () => {
    try {
        const response = await axiosTTTInstance.get(`/public/namespaces`);
        return response?.data;
    } catch (error: any) {
        console.log(`something went wrong while listing public namespaces`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}

export const listPublicNamespaceDocuments = async (namespace: string, limit = 50, offset = 0) => {
    try {
        const response = await axiosTTTInstance.get(`/public/namespaces/${encodeURIComponent(namespace)}/documents`, {
            params: { limit, offset }
        });
        return response?.data;
    } catch (error: any) {
        console.log(`something went wrong while listing documents for namespace ${namespace}`, {
            message: error?.message,
            status: error?.response?.status,
            responseData: error?.response?.data
        });
        return false;
    }
}
