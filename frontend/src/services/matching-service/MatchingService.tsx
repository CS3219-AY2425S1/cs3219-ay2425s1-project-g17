import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:4002",
    timeout: 5000,
});

export async function sendMatchRequest(userId: string, category: string | null, difficulty: string) {
    try {
        const response = await api.post('/matching/match-request', {
            userId,
            category,
            difficulty,
        });
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

export async function pollMatchStatus(userId: string) {
    try {
        const response = await api.get(`/matching/check-match-status/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

export async function cancelMatchRequest(userId: string) {
    try {
        const response = await api.post(`/matching/cancel-match-request`, {userId});
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

export function handleAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        return error.response?.data?.message || 'An error occurred while processing your request';
    } else {
        console.error("Unexpected error:", error);
        return 'An unexpected error occurred';
    }
}
