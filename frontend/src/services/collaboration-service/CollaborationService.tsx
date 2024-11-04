import axios from 'axios';
import applyInterceptors from '../middleware/Interceptor';

const collabApi = axios.create({
    baseURL: process.env.REACT_APP_COLLABORATION_URI ?? "http://localhost:4003/collaboration",
    timeout: 5000,
});

const questionApi = axios.create({
    baseURL: process.env.REACT_APP_QUESTION_URI ?? "http://localhost:4000/questions",
    timeout: 5000,
});

const historyApi = axios.create({
    baseURL: process.env.REACT_APP_HISTORY_URI ?? "http://localhost:4004/history",
    timeout: 5000,
});

applyInterceptors(collabApi);
applyInterceptors(questionApi);
applyInterceptors(historyApi);

function handleAxiosError(error: any) {
    console.error('An error occurred:', error.message);
    return null;
}

// Function to get session details
async function getSessionInfo(id: string) {
    try {
        const response = await collabApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to get question details
async function getQuestionInfo(id: string) {
    try {
        const response = await questionApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to shuffle question
async function shuffleQuestion(id: string) {
    try {
        const response = await collabApi.get(`/shuffle/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to disconnect user
async function disconnectUser(sessionId: string) {
    try {
        const response = await collabApi.post(`/disconnect`, {sessionId});
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to get cached code
async function getCacheCode(id: string, language: string) {
    try {
        const response = await collabApi.get(`/cache/${id}/${language}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to cache the code
async function cacheCode(sessionId: string, code: string, language: string, newLanguage: string) {
    try {
        const response = await collabApi.post(`/cache`, {sessionId, code ,language, newLanguage});
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to cache the code
async function createHistory(userId: string, partnerId: string, questionId: string, startTime: Date, attempt: string) {
    try {
        const response = await historyApi.post(`/`, {userId, partnerId ,questionId, startTime, attempt});
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}
// Function to store in history service

export {
    getSessionInfo,
    getQuestionInfo,
    shuffleQuestion,
    disconnectUser,
    getCacheCode,
    cacheCode,
    createHistory
}
