import axios from 'axios';
import applyInterceptors from '../middleware/Interceptor';

const api = axios.create({
    baseURL: "http://localhost:4004/history",
    timeout: 5000, // Timeout after 5 seconds
});

applyInterceptors(api);

async function getHistoryById(id: string) {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

function handleAxiosError(error: any) {
    console.error('An error occurred:', error.message);
    return null;
}

export {
    getHistoryById
};