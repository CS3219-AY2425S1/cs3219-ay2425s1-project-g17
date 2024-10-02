import * as React from 'react';
import {
    Container,
    Box,
    TextField,
    Typography,
    Paper,
    Avatar,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../context/AuthContext';
import { updateUsername, updateEmail, updatePassword } from '../../services/user-service/UserService';

export default function ProfilePage() {
    const authContext = React.useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { token, updateUserData } = authContext;

    // User data states
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');

    // Edit states
    const [isEditingUsername, setIsEditingUsername] = React.useState(false);
    const [isEditingEmail, setIsEditingEmail] = React.useState(false);
    const [isEditingPassword, setIsEditingPassword] = React.useState(false);

    // Temporary states
    const [tempUsername, setTempUsername] = React.useState('');
    const [tempEmail, setTempEmail] = React.useState('');

    // Password states
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    // Error states
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    // Fetch user data from the server on component mount
    React.useEffect(() => {
        async function fetchUserData() {
            const username = localStorage.getItem('username') || '';
            const email = localStorage.getItem('email') || '';
            setUsername(username);
            setEmail(email);
        }
        fetchUserData();
    }, [token]);

    const handleEditClick = (field: 'username' | 'email' | 'password') => {
        if (field === 'username') {
            setTempUsername(username);
            setIsEditingUsername(true);
        } else if (field === 'email') {
            setTempEmail(email);
            setIsEditingEmail(true);
        } else if (field === 'password') {
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsEditingPassword(true);
        }
    };

    const handleCancelClick = (field: 'username' | 'email' | 'password') => {
        if (field === 'username') {
            setTempUsername('');
            setIsEditingUsername(false);
        } else if (field === 'email') {
            setTempEmail('');
            setIsEditingEmail(false);
            setEmailError(false);
        } else if (field === 'password') {
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsEditingPassword(false);
            setPasswordError(false);
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordError(true);
            setPasswordErrorMessage('New passwords do not match.');
            return false;
        }
        if (newPassword.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('New password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    const handleSaveClick = async (field: 'username' | 'email' | 'password') => {
        const id = localStorage.getItem('id') || '';
        const token = localStorage.getItem('token') || '';

        if (field === 'username') {
            setUsername(tempUsername);
            setIsEditingUsername(false);
            try {
                await updateUsername(id, token, tempUsername);
                await updateUserData();
            } catch (err: any) {
                alert(err.message);
            }
        } else if (field === 'email') {
            if (!validateEmail(tempEmail)) {
                setEmailError(true);
                setEmailErrorMessage('Please enter a valid email address.');
                return;
            }
            setEmail(tempEmail);
            setIsEditingEmail(false);
            setEmailError(false);
            await updateEmail(id, token, tempEmail);
            await updateUserData();
        } else if (field === 'password') {
            if (!validatePassword()) {
                return;
            }
            try {
                await updatePassword(id, email, token, oldPassword, newPassword);
                setIsEditingPassword(false);
                alert('Password updated successfully!');
            } catch (err: any) {
                alert(err.message);
            }
        }
        window.location.reload();
    };

    return (
        <Container
            sx={{
                display: 'flex',
                minHeight: '80vh',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                }}
            >
                <Paper
                    sx={{
                        display: 'flex',
                        mt: '30px',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Avatar sx={{ height: "18vh", width: "18vh", padding: "5px" }} />
                    <Box>
                        <Typography variant="h5" sx={{ textAlign: "center", padding: "5px" }}>
                            <b>{username}</b>
                        </Typography>
                        <Typography variant="h6" sx={{ textAlign: "center", ppadding: "5px" }}>
                            {email}
                        </Typography>
                    </Box>
                </Paper>

                <Paper
                    component="form"
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 2,
                        mt: '30px',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h6'>
                            <b>Username</b>
                        </Typography>

                        {isEditingUsername ? (
                            <>
                                <TextField
                                    variant="outlined"
                                    value={tempUsername}
                                    onChange={(e) => setTempUsername(e.target.value)}
                                    size="small"
                                />
                                <IconButton onClick={() => handleSaveClick('username')} color="secondary">
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={() => handleCancelClick('username')} color="primary">
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography variant='h6'>{username}</Typography>
                                <IconButton onClick={() => handleEditClick('username')}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h6'>
                            <b>Email</b>
                        </Typography>

                        {isEditingEmail ? (
                            <>
                                <TextField
                                    variant="outlined"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    size="small"
                                    error={emailError}
                                    helperText={emailError ? emailErrorMessage : ''}
                                />
                                <IconButton onClick={() => handleSaveClick('email')} color="secondary">
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={() => handleCancelClick('email')} color="primary">
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography variant='h6'>{email}</Typography>
                                <IconButton onClick={() => handleEditClick('email')}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                        }}
                    >
                        <Typography variant='h6'>
                            <b>Password</b>
                        </Typography>

                        {isEditingPassword ? (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }
                                    }>
                                    <TextField
                                        type="password"
                                        variant="outlined"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        error={passwordError}
                                        size="small"
                                        placeholder="Old Password"
                                    />
                                    <TextField
                                        type="password"
                                        variant="outlined"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        error={passwordError}
                                        size="small"
                                        placeholder="New Password"
                                    />
                                    <TextField
                                        type="password"
                                        variant="outlined"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        error={passwordError}
                                        helperText={passwordError ? passwordErrorMessage : ''}
                                        size="small"
                                        placeholder="Confirm New Password"
                                    />

                                </Box>
                                <Box
                                    sx={
                                        {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 2,
                                            alignItems: 'center',
                                        }
                                    }>
                                    <IconButton onClick={() => handleSaveClick('password')} color="secondary" size="small">
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleCancelClick('password')} color="primary" size="small">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography variant='h6'>•••••••••</Typography>
                                <IconButton onClick={() => handleEditClick('password')}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}