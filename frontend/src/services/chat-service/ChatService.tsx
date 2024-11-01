import axios from 'axios';
import applyInterceptors from '../middleware/Interceptor';

const chatApi = axios.create({
    baseURL: process.env.REACT_APP_CHAT_URI ?? "http://localhost:4005/chat",
    timeout: 5000,
});

applyInterceptors(chatApi);

function handleAxiosError(error: any) {
    console.error('An error occurred:', error.message);
    return null;
}

// Function to get session messages
async function getSessionMessages(sessionId: string) {
    try {
        const response = await chatApi.get(`/${sessionId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to delete session messages
async function deleteSessionMessages(sessionId: string) {
    try {
        const response = await chatApi.delete(`/${sessionId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export { getSessionMessages, deleteSessionMessages }
