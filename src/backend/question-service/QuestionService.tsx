import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:4000" + "/questions", 
    timeout: 5000, // Timeout after 5 seconds
  });
  
//   api.interceptors.request.use(
//     (config) => {
//       config.headers["x-api-key"] = process.env.REACT_APP_API_KEY; 
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

  // Function to get all questions from the API
async function getAllQuestions() {
    try {
      const response = await api.get("/");
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
    getAllQuestions,
  }