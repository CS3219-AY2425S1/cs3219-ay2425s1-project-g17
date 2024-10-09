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
        if (!validatePassword(password)) {
            throw new Error('Password must be at least 6 characters long, contain at least one number, one uppercase, and one lowercase letter.');
        }

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
        const response = await api.get('/auth/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

async function getUserDetails(userid: string, token: string) {
    try {
        const response = await api.get(`/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

async function updateUsername(userid: string, token: string, username: string) {
    try {
        const response = await api.patch(`/users/${userid}`, 
        { username: username },
        { headers: { Authorization: `Bearer ${token}` }});
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

async function updateEmail(userid: string, token: string, email: string) {
    try {
        const response = await api.patch(`/users/${userid}`,
            { email: email },
            { headers: { Authorization: `Bearer ${token}` }});
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

async function updatePassword(userid: string, email: string, token: string, oldPassword: string, newPassword: string) {
    try {
        const verified = await loginUser(email, oldPassword);
        if (!verified) {
            throw new Error('Invalid current password.');
        }
        if (!validatePassword(newPassword)) {
            throw new Error('Password must be at least 6 characters long, contain at least one number, one uppercase, and one lowercase letter.');
        }
        const response = await api.patch(`/users/${userid}`, 
            { password: newPassword },
            { headers: { Authorization: `Bearer ${token}` }});
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

async function deleteUser(userid: string, token: string) {
    try {
        const response = await api.delete(`/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

// Update user profile picture by uploading to S3
async function updateProfilePicture(userid: string, file: File) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userid);
        const response = await api.post('/users/upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(handleAxiosError(error));
    }
}

async function getSignedImageURL(imageName: string, token: string) {
    try {
        const response = await api.get(`/users/profilePic/${imageName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response?.data
    } catch (error) {
        console.log(error)
        throw new Error(handleAxiosError(error));
    }
}

const validatePassword = (password: string) => {
    // Regular expression to validate the password:
    // - At least 6 characters long
    // - At least one number
    // - At least one uppercase letter
    // - At least one lowercase letter
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{6,}$/;

    if (!password) {
        return false;
    } else if (!passwordRegex.test(password)) {
        return false;
    } else {
        return true;
    }
};


export { createUser,
    loginUser,
    verifyToken,
    updateUsername,
    updateEmail,
    getUserDetails,
    updatePassword,
    deleteUser,
    updateProfilePicture,
    getSignedImageURL
 };
