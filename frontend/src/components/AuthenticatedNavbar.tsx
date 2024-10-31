import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/Logo.png';
import { getSignedImageURL } from '../services/user-service/UserService';
import { AuthContext } from '../context/AuthContext';

const settings = [
  { name: 'Dashboard', icon: <DashboardIcon /> },
  { name: 'Profile', icon: <AccountCircleIcon /> },
  { name: 'Logout', icon: <LogoutIcon /> },
];

function Navbar() {
  const [profileImageUrl, setprofileImageUrl] = React.useState('');

  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { logout } = authContext;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    window.location.href = '/';
  };

  React.useEffect(() => {
    const getUserProfilePic = async (imageName: string) => {
      try {
        const response = await getSignedImageURL(imageName);
        setprofileImageUrl(response);
      } catch (err: any) {
        alert(err.message);
      }
    };
    getUserProfilePic(localStorage.getItem('profileImage') as string);
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <a href="/dashboard">
            <img src={Logo} alt="Logo" style={{ height: '50px' }} />
          </a>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={profileImageUrl} sx={{ bgcolor: "white" }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(({ name, icon }) => (
                <MenuItem
                  key={name}
                  onClick={name === 'Logout' ? handleLogout
                    : name === 'Profile' ? () => window.location.href = '/profile'
                      : name === 'Dashboard' ? () => window.location.href = '/dashboard'
                        : handleCloseUserMenu}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon}
                    <Typography sx={{ textAlign: 'center' }}>{name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
