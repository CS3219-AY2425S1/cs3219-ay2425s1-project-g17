import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Container, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { loginUser, verifyToken } from '../../services/user-service/UserService';
import { AuthContext } from '../../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const navigate = useNavigate();
    const authContext = React.useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { login } = authContext;
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInputs()) {
            const data = new FormData(event.currentTarget);
            try {
                const response = await loginUser(data.get('email') as string, data.get('password') as string);
                const token = response?.data?.accessToken;

                // Verify the token before navigating
                const verified = await verifyToken(token);
                if (verified) {
                    setLoading(true);
                    setTimeout(() => {
                        login(response?.data.username as string, response?.data.email as string, token, response?.data.id as string, response?.data.profilePic as string, response?.data.isAdmin as string)
                        navigate('/dashboard');
                    }, 1000);
                } else {
                    alert('Token verification failed.');
                }
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Please enter a valid password.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
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
                    sx={{ textAlign: 'center', marginBottom: '20px', color: '#9AC143' }}
                >
                    Sign in
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
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
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                            </Box>
                            <TextField
                                size="small"
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                            </Box>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••••••••"
                                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            color="secondary"
                            fullWidth
                            variant="contained"
                            sx={{ color: 'white' }}
                        >
                            Sign in
                        </Button>
                        <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
                            Don&apos;t have an account?{' '}
                            <span
                                onClick={() => navigate('/register')}
                                style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}
                            >
                                Sign up
                            </span>
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container >
    );
}
