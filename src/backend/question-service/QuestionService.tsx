import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:4000/questions",
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
        const questions = response.data;
        questions.sort((a: { question_id: number }, b: { question_id: number }) => a.question_id - b.question_id);

        return questions;
    } catch (error) {
        handleAxiosError(error);
    }
}
// Function to find the highest id in the questions array
async function getMaxId() {
    try {
        const questions = await getAllQuestions();
        const maxId = Math.max(...questions.map((question: any) => question.question_id));
        return maxId;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to add question to the API
async function addQuestion(title: string, description: string, categories: string[], complexity: string, popularity: number) {
    try {
        const maxId = await getMaxId();
        const questionData = {
            question_id: maxId ? maxId + 1 : 0,
            question_title: title,
            question_description: description,
            question_categories: categories,
            question_complexity: complexity,
            question_popularity: popularity,
        }
        const response = await api.post("/", questionData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to update question to API
async function updateQuestion(id: number, title: string, description: string, categories: string[], complexity: string, popularity: number) {
    try {
        const questionData = {
            question_id: id,
            question_title: title,
            question_description: description,
            question_categories: categories,
            question_complexity: complexity,
            question_popularity: popularity,
        }
        const response = await api.put(`/${id}`, questionData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to delete question from API
async function deleteQuestion(id: number) {
    try {
        const response = await api.delete(`/${id}`);
        const remainingQuestions = await getAllQuestions();
        remainingQuestions.forEach(async (question: any, index: number) => {
            if (question.question_id > id) {
                const updatedQuestionData = {
                    question_id: question.question_id - 1,
                    question_title: question.question_title,
                    question_description: question.question_description,
                    question_categories: question.question_categories,
                    question_complexity: question.question_complexity,
                    question_popularity: question.question_popularity,
                };
                await api.put(`/${question.question_id}`, updatedQuestionData);
            }
        });
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
    addQuestion,
    updateQuestion,
    deleteQuestion
}