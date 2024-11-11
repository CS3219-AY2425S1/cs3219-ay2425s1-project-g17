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
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const settings = [
  { name: 'Dashboard', icon: <DashboardIcon /> },
  { name: 'Profile', icon: <AccountCircleIcon /> },
  { name: 'Logout', icon: <LogoutIcon /> },
];

interface NavbarProps {

  profileImageUrl: string;

}



const Navbar: React.FC<NavbarProps> = ({ profileImageUrl }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

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
    navigate('/');
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  }

  const handleNavigateDashboard = () => {
    navigate('/dashboard');
    handleCloseUserMenu();
  }

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={Logo} alt="Logo" style={{ height: '50px' }} />
          </div>
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
                    : name === 'Profile' ? handleNavigateProfile
                      : name === 'Dashboard' ? handleNavigateDashboard
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
