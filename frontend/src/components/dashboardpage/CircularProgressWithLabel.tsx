import React from 'react';
import { Box, CircularProgress, Typography, Paper, LinearProgress } from '@mui/material';

interface ComplexityOption {
    label: string;
    color: string;
}

interface CircularProgressWithComplexityProps {
    attempts: { easy: number; medium: number; hard: number };
    total: { easy: number; medium: number; hard: number };
    complexities: ComplexityOption[];
}

const CircularProgressWithLabel: React.FC<CircularProgressWithComplexityProps> = ({ attempts, total, complexities }) => {
    const { easy, medium, hard } = attempts;
    const totalQuestions = (total.easy + total.medium + total.hard) as number;
    const easyPercent = (easy / totalQuestions) * 100;
    const mediumPercent = (medium / totalQuestions) * 100;
    const hardPercent = (hard / totalQuestions) * 100;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={150}
                    sx={{ color: '#E0E0E0' }}
                />

                {/* Easy Section */}
                <CircularProgress
                    variant="determinate"
                    value={easyPercent}
                    size={150}
                    sx={{
                        color: complexities[1].color,
                        position: 'absolute',
                    }}
                    style={{ transform: 'rotate(-90deg)' }}
                />

                {/* Medium Section */}
                <CircularProgress
                    variant="determinate"
                    value={mediumPercent}
                    size={150}
                    sx={{
                        color: complexities[2].color,
                        position: 'absolute',
                    }}
                    style={{ transform: `rotate(${(easyPercent / 100) * 360 - 90}deg)` }}
                />

                {/* Hard Section */}
                <CircularProgress
                    variant="determinate"
                    value={hardPercent}
                    size={150}
                    sx={{
                        color: complexities[3].color,
                        position: 'absolute',
                    }}
                    style={{ transform: `rotate(${((easyPercent + mediumPercent) / 100) * 360 - 90}deg)` }}
                />

                {/* Label in the center of the circle */}
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h6" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {`${Math.round(((easy + medium + hard) / totalQuestions) * 100)}%`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {`${easy + medium + hard}/${totalQuestions} Attempted`}
                    </Typography>
                </Box>
            </Box>

            {/* Labels on the right */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {complexities.slice(1).map((complexity, index) => {
                    const attemptCount = attempts[complexity.label.toLowerCase() as keyof typeof attempts];
                    const totalCount = total[complexity.label.toLowerCase() as keyof typeof total];
                    const progress = (attemptCount / totalCount) * 100;

                    return (
                        <Paper key={index} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography
                                variant="body2"
                                color={complexity.color} // Set color based on complexity
                                sx={{ fontWeight: 'bold' }} // Make text bold
                            >
                                {complexity.label}: {attemptCount}/{totalCount}
                            </Typography>
                            <Box
                                sx={{
                                    color: complexity.color,
                                }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    color="inherit"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 5,
                                        marginTop: 1,
                                    }}
                                />
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default CircularProgressWithLabel;
