import axios from 'axios';
import config from '@/config/constants';

const backendConnectorHost = config.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST
const backendConnectorKey = config.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY
const whatsAppbackendConnectorHost = config.NEXT_PUBLIC_BACKEND_TEXT_SIMILARITY

export const axiosPDFInstance = axios.create({
    baseURL: `${backendConnectorHost}`,
    headers: {
        'API-KEY': backendConnectorKey
    },
});


export const axiosConvInstance = axios.create({
    baseURL: `${whatsAppbackendConnectorHost}`,
    headers: {
        'API-KEY': backendConnectorKey
    },
});