import axios from 'axios';
import applyInterceptors from '../middleware/Interceptor';

const collabApi = axios.create({
    baseURL: "http://localhost:4003/collaboration",
    timeout: 5000,
});

const questionApi = axios.create({
    baseURL: "http://localhost:4000/questions",
    timeout: 5000,
});

applyInterceptors(collabApi);
applyInterceptors(questionApi);

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

export {
    getSessionInfo,
    getQuestionInfo,
    shuffleQuestion
}
