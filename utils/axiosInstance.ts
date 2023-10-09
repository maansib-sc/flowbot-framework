import axios from 'axios';

const backendConnectorHost = process.env.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST
const backendConnectorKey = process.env.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY || ''
const whatsAppbackendConnectorHost = process.env.NEXT_PUBLIC_BACKEND_CONNECTOR_WHATSAPPHOST

export const axiosPDFInstance = axios.create({
    baseURL: `https://${backendConnectorHost}`,
    headers: {
        'API-KEY': backendConnectorKey || '',
    },
});


export const axiosConvInstance = axios.create({
    baseURL: `https://${whatsAppbackendConnectorHost}`,
    headers: {
        'API-KEY': backendConnectorKey || '',
    },
});