import React from 'react';
import { Box } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { getHistoryById } from '../../services/history-service/HistoryService';
import { getQuestionById } from '../../services/question-service/QuestionService';

const complexities = [
    { label: 'None', color: '#FFFFFF' },
    { label: 'Easy', color: '#5AB8B9' },
    { label: 'Medium', color: '#F2BA40' },
    { label: 'Hard', color: '#E24A42' },
];

interface HistoryEntry {
    title: string;
    complexity: string;
}

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

interface QuestionsProps {
    questions: QuestionProps[];
}

interface BackendData {
    userId: string;
    partnerId: string;
    questionId: string;
    startTime: string;
    attempt: string;
    endTime: string;
}

const fetchHistoryById = async (id: string) => {
    try {
        const data = await getHistoryById(id);
        return data;
    } catch (error) {
        console.error(`Failed to fetch history with id: ${id}`, error);
    }
};

const fetchQuestionDetails = async (questionId: string) => {
    try {
        const data = await getQuestionById(questionId);
        return data;
    } catch (error) {
        console.error(`Failed to fetch question with id: ${questionId}`, error);
    }
};

const AttemptedProgress: React.FC<QuestionsProps> = ({ questions }) => {

    const [historyData, setHistoryData] = React.useState<HistoryEntry[]>([]);
    const userId = localStorage.getItem('id');

    React.useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                await processBackendData(userId);
            }
        };

        const processBackendData = async (id: string) => {
            const historyData = await fetchHistoryById(id);
            const processedData = await Promise.all(
                (historyData?.data || []).map(async (item: BackendData, index: number) => {
                    const questionDetails = await fetchQuestionDetails(item.questionId);

                    return {
                        title: questionDetails?.question_title || "Unknown",
                        complexity: questionDetails?.question_complexity || "Unknown",
                    };
                })
            );
        
            setHistoryData(processedData);
        };

        fetchData();
    
    }, [userId]);


    const totalQuestions = questions?.reduce(
        (acc, question) => {
            switch (question.question_complexity) {
                case 'EASY':
                    acc.easy += 1;
                    break;
                case 'MEDIUM':
                    acc.medium += 1;
                    break;
                case 'HARD':
                    acc.hard += 1;
                    break;
                default:
                    break;
            }
            return acc;
        },
        { easy: 0, medium: 0, hard: 0 }
    );

    const attempts = historyData?.reduce(
        (acc, item) => {
            const uniqueTitles = new Set(historyData.map(entry => entry.title));
            uniqueTitles.forEach(title => {
                const uniqueItem = historyData.find(entry => entry.title === title);
                if (uniqueItem) {
                    switch (uniqueItem.complexity) {
                        case 'EASY':
                            acc.easy += 1;
                            break;
                        case 'MEDIUM':
                            acc.medium += 1;
                            break;
                        case 'HARD':
                            acc.hard += 1;
                            break;
                        default:
                            break;
                    }
                }
            });
            return acc;
        },
        { easy: 0, medium: 0, hard: 0 }
    );

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                color: 'white',
                width: "50%",
                height: "40vh",
                alignContent: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgressWithLabel attempts={attempts} total={totalQuestions} complexities={complexities} />
        </Box>
    );
};

export default AttemptedProgress;
