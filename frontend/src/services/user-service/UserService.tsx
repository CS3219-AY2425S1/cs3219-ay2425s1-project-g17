import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:4001",
    timeout: 5000, // Timeout after 5 seconds
});

// Centralized error handling for Axios
function handleAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        console.error("Axios error:", error.response?.data || error.message);
        return error.response?.data?.message || 'An error occurred while processing your request';
    } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
        return 'An unexpected error occurred';
    }
}

// Create User
async function createUser(username: string, email: string, password: string) {
    try {
        const response = await api.post("/users", {
            username: username,
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

// Login User
async function loginUser(email: string, password: string) {
    try {
        const response = await api.post("/auth/login", {
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

// Verify token
async function verifyToken(token: string | null) {
    try {
        const response = await axios.get('http://localhost:4001/auth/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

async function getUserProfile(userid: string, token: string) {
    try {
        const response = await api.patch(`/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}


export { createUser,
    loginUser,
    verifyToken
 };