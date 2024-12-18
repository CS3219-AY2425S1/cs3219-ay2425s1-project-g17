import * as React from 'react';
import {
    Container,
    Box,
    TextField,
    Typography,
    Paper,
    Avatar,
    IconButton,
    Button,
    Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../context/AuthContext';
import { updateUsername, updateEmail, updatePassword, deleteUser, updateProfilePicture, getSignedImageURL } from '../../services/user-service/UserService';
import { useNavigate } from 'react-router-dom';
import HistoryTable from '../../components/profilepage/HistoryTable';

interface ProfilePageProps {

    setHeaderProfileImageUrl: (url: string) => void;

}



const ProfilePage: React.FC<ProfilePageProps> = ({ setHeaderProfileImageUrl }) => {
    const navigate = useNavigate();
    const authContext = React.useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { token, updateUserData, logout } = authContext;

    // User data states
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [profileImageUrl, setProfileImageUrl] = React.useState('');

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

    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => setDeleteOpen(false);

    const handleDelete = async () => {
        try {
            await deleteUser(localStorage.getItem('id') || '', token || '');
            logout();
            navigate('/');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const getUserProfilePic = React.useCallback(async (imageName: string) => {
        try {
            const response = await getSignedImageURL(imageName);
            setProfileImageUrl(response);
            setHeaderProfileImageUrl(response);
        } catch (err: any) {
            alert(err.message);
        }
    }, [setHeaderProfileImageUrl]);

    React.useEffect(() => {
        const fetchUserData = async () => {
            await updateUserData();
            const username = localStorage.getItem('username') || '';
            const email = localStorage.getItem('email') || '';
            const profileImage = localStorage.getItem('profileImage') || '';
            setUsername(username);
            setEmail(email);
            getUserProfilePic(profileImage);
        };

        fetchUserData();

        return () => {
            setUsername('');
            setEmail('');
            setProfileImageUrl('');
        };
    }, [updateUserData, getUserProfilePic]);


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

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordError(true);
            setPasswordErrorMessage('New passwords do not match.');
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long, contain at least one number, one uppercase, and one lowercase letter.');
            return false;
        }

        setPasswordError(false);
        setPasswordErrorMessage('');
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
            try {
                await updateEmail(id, token, tempEmail);
                await updateUserData();
            } catch (err: any) {
                alert(err.message);
            }
        } else if (field === 'password') {
            if (!validatePassword()) return;
            try {
                await updatePassword(id, email, token, oldPassword, newPassword);
                setIsEditingPassword(false);
                alert('Password updated successfully!');
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const response = await updateProfilePicture(localStorage.getItem('id') || '', file);
                localStorage.setItem('profileImage', response?.fileName);
                getUserProfilePic(response?.fileName);
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    return (
        <>
            <Container
                sx={{
                    display: 'flex',
                    minHeight: '85vh',
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

                        <Box
                            position="relative"
                            display="inline-block"
                        >
                            <Avatar
                                src={profileImageUrl}
                                sx={{ height: "18vh", width: "18vh" }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label
                                htmlFor="icon-button-file"
                            >
                                <IconButton
                                    color="secondary"
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: 'white', '&:hover': {
                                            backgroundColor: 'lightgray',
                                        }
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </label>
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ textAlign: "center", padding: "5px" }}>
                                <b>{username}</b>
                            </Typography>
                            <Typography variant="body1" sx={{ textAlign: "center", ppadding: "5px" }}>
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
                            <Typography variant='body1'>
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
                                    <Typography variant='body1'>{username}</Typography>
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
                            <Typography variant='body1'>
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
                                    <Typography variant='body1'>{email}</Typography>
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
                            <Typography variant='body1'>
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
                                    <Typography variant='body1'>•••••••••</Typography>
                                    <IconButton onClick={() => handleEditClick('password')}>
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
                            <Button variant="outlined" color="error" onClick={handleDeleteOpen}>Delete Account</Button>
                        </Box>
                    </Paper>
                </Box>

                <Box>
                    <HistoryTable
                        userId={localStorage.getItem('id') || ''}
                        token={localStorage.getItem('token') || ''}
                    />
                </Box>
            </Container>

            {/* Delete Modal */}
            <Modal open={deleteOpen} onClose={handleDeleteClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="body1" component="h2" sx={{ mb: 2, color: "white" }}>
                        Delete Account?
                    </Typography>
                    <Typography sx={{ mb: 3, color: "white" }}>
                        This action can't be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                        <Button variant="outlined" onClick={handleDeleteClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default ProfilePage;
