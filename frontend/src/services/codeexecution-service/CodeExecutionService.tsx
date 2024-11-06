import axios from 'axios';

export interface ExecutionResult {
    output: string;
    error: string;
    time: number;
    memory: number;
}

export const executeCode = async (code: string, language: string): Promise<ExecutionResult> => {
    const languageMap: { [key: string]: number } = {
        python: 71,
        cpp: 54,
        java: 62,
        javascript: 63,
    };

    const languageId = languageMap[language];
    if (!languageId) {
        return { output: '', error: 'Unsupported language', time: 0, memory: 0 };
    }

    try {
        const submissionResponse = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions',
            {
                source_code: code,
                language_id: languageId,
                stdin: "",
            },
            {
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
                params: {
                    wait: true,
                }
            }
        );


        const token = submissionResponse.data.token;

        // Poll for the result until it is ready
        while (true) {
            const resultResponse = await axios.get(
                `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                {
                    headers: {
                        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );

            const { stdout, stderr, status, time, memory } = resultResponse.data;

            // Check if execution has completed
            if (status.description === "Accepted") {
                return { output: stdout || '', error: stderr || '', time: time || 0, memory: memory || 0 };
            } else if (status.description === "Compilation Error") {
                return { output: '', error: "Error: Compilation Error", time: time || 0, memory: memory || 0 };
            } else if (status.description !== "In Queue" && status.description !== "Processing") {
                return { output: '', error: stderr || '', time: time || 0, memory: memory || 0 };
            }
            // Delay between polling attempts
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err: any) {
        if (err.response && err.response.status === 400) {
            return { output: '', error: "Error: Compilation Error", time: 0, memory: 0 };
        } else {
            return { output: '', error: err.message, time: 0, memory: 0 };
        }
    }
};
