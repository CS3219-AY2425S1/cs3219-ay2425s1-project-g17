import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { createUser } from '../../services/user-service/UserService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
    const navigate = useNavigate();

    // TODO: Handle registration logic (User Service)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInputs()) {
            const data = new FormData(event.currentTarget);
            try {
                const response = await createUser(data.get('username') as string, data.get('email') as string, data.get('password') as string);
                alert('User created successfully');
                navigate('/login');
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const validateInputs = () => {
        const username = document.getElementById('username') as HTMLInputElement;
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

        let isValid = true;

        // Username validation
        if (!username.value || username.value.length < 3) {
            setUsernameError(true);
            setUsernameErrorMessage('Username must be at least 3 characters long.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        // Email validation
        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // Password validation
        const validatePassword = (password: string) => {
            // Regular expression to validate the password:
            // - At least 6 characters long
            // - At least one number
            // - At least one uppercase letter
            // - At least one lowercase letter
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

            if (!password) {
                setPasswordError(true);
                setPasswordErrorMessage('Please enter a valid password.');
                return false;
            } else if (!passwordRegex.test(password)) {
                setPasswordError(true);
                setPasswordErrorMessage('Password must be at least 6 characters long, contain at least one number, one uppercase, and one lowercase letter.');
                return false;
            } else {
                setPasswordError(false);
                setPasswordErrorMessage('');
                return true;
            }
        };

        // Use the validation function within your form validation
        isValid = validatePassword(password.value);

        // Confirm password validation
        if (password.value !== confirmPassword.value) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '90vh',
            }}
        >
            <Box
                sx={{
                    width: { xs: '90%', sm: '60%', md: '40%' },
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ textAlign: 'center', marginBottom: '20px' }}
                >
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {/* Username Field */}
                    <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <TextField
                            error={usernameError}
                            helperText={usernameErrorMessage}
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    {/* Email Field */}
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    {/* Password Field */}
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    {/* Confirm Password Field */}
                    <FormControl>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <TextField
                            error={confirmPasswordError}
                            helperText={confirmPasswordErrorMessage}
                            name="confirmPassword"
                            placeholder="••••••••••••"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        color="secondary"
                        fullWidth
                        variant="contained"
                        sx={{ padding: '10px 0', fontSize: '16px' }}
                    >
                        Sign Up
                    </Button>

                    {/* Redirect to Sign In */}
                    <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
                        Already have an account?{' '}
                        <Link href="/login" variant="body2">
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
