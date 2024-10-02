import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:4000/questions",
    timeout: 5000, // Timeout after 5 seconds
});

const jsonApi = axios.create({
    baseURL: "http://localhost:4000/questions/upload",
    timeout: 5000, // Timeout after 5 seconds
});

interface ExampleProps {
    id: number;
    input: string;
    output: string;
    explanation: string;

}

interface QuestionProps {
    _id: string;
    question_id: number;
    question_title: string;
    question_description: string;
    question_example: ExampleProps[];
    question_categories: string[];
    question_complexity: string;
    question_popularity: number;
}

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
async function addQuestion(title: string, description: string, example: ExampleProps[], categories: string[], complexity: string, popularity: number) {
    try {
        const maxId = await getMaxId();
        const questionData = {
            question_id: maxId ? maxId + 1 : 0,
            question_title: title,
            question_description: description,
            question_example: example,
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
async function updateQuestion(id: number, title: string, description: string, example: ExampleProps[], categories: string[], complexity: string, popularity: number) {
    try {
        const questionData = {
            question_id: id,
            question_title: title,
            question_description: description,
            question_example: example,
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

// Function to check if title already exists
async function checkTitle(title: string) {
    try {
        const questions = await getAllQuestions();
        return questions.some((question: any) => question.question_title.toLowerCase() === title.toLowerCase());
    } catch (error) {
        handleAxiosError(error);
    }
}

// Function to filter questions based on categories, complexity, and search query
async function getFilteredQuestions(
    selectedCategories: string[] = [],
    selectedComplexity: string | null = null,
    searchQuery: string = ''
) {
    try {
        const questions = await getAllQuestions();
        let filteredQuestions = questions;

        // Filter by categories: Only show questions that have all selected categories
        if (selectedCategories.length > 0) {
            filteredQuestions = filteredQuestions.filter((question: any) =>
                selectedCategories.every((category) => question.question_categories.includes(category))
            );
        }

        // Filter by complexity, excluding "None" from the filter
        if (selectedComplexity && selectedComplexity.toUpperCase() !== 'NONE') {
            filteredQuestions = filteredQuestions.filter(
                (question: any) => question.question_complexity.toUpperCase() === selectedComplexity.toUpperCase()
            );
        }

        // Filter by search query: Match question title or description
        if (searchQuery.trim()) {
            filteredQuestions = filteredQuestions.filter((question: any) =>
                question.question_title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filteredQuestions;
    } catch (error) {
        handleAxiosError(error);
    }
}

async function sortQuestion(questions: QuestionProps[], sortDirection: String, sortField: String): Promise<QuestionProps[]> {
    const complexityOrder: { [key: string]: number } = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
    };

    try {
        const sortedQuestions = [...questions].sort((a, b) => {
            const isAsc = sortDirection === 'asc';
            switch (sortField) {
                case 'question_id':
                    return isAsc ? a.question_id - b.question_id : b.question_id - a.question_id;
                case 'question_title':
                    return isAsc ? a.question_title.localeCompare(b.question_title) : b.question_title.localeCompare(a.question_title);
                case 'question_complexity':
                    return isAsc
                        ? (complexityOrder[a.question_complexity] || 0) - (complexityOrder[b.question_complexity] || 0)
                        : (complexityOrder[b.question_complexity] || 0) - (complexityOrder[a.question_complexity] || 0);
                case 'question_popularity':
                    return isAsc ? a.question_popularity - b.question_popularity : b.question_popularity - a.question_popularity;
                default:
                    return 0;
            }
        });
        return sortedQuestions;

    } catch (error) {
        handleAxiosError(error);
        return [];
    }


}

// Function to upload JSON file with FormData
async function uploadJson(formData: FormData) {
    try {
        const response = await jsonApi.post("/", formData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export {
    getFilteredQuestions,
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    checkTitle,
    uploadJson,
    sortQuestion
}