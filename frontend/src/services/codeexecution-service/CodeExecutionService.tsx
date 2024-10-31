import axios from 'axios';

export interface ExecutionResult {
    output: string;
    error: string;
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
        return { output: '', error: 'Unsupported language' };
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

            const { stdout, stderr, status } = resultResponse.data;

            // Check if execution has completed
            if (status.description === "Accepted") {
                return { output: stdout || '', error: stderr || '' };
            } else if (status.description !== "In Queue" && status.description !== "Processing") {
                return { output: '', error: `Error: ${status.description}` };
            }
            // Delay between polling attempts
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err: any) {
        return { output: '', error: err.message };
    }
};
