const getToken = () => localStorage.getItem('token');

// Function to apply JWT interceptors to any Axios instance
export const applyInterceptors = (axiosInstance: any) => {
    // Request interceptor: Add JWT token to headers
    axiosInstance.interceptors.request.use(
        (config: any) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 Unauthorized (token expiration)
    axiosInstance.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
            if (error.response && error.response.status === 401) {
                // Handle token expiration
                console.error('JWT token expired or invalid. Logging out.');
                localStorage.removeItem('token');
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );
};

export default applyInterceptors;
