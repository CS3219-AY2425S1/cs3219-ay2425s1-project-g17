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
import Logo from '../assets/Logo.png';
import { getSignedImageURL } from '../services/user-service/UserService';
import { AuthContext } from '../context/AuthContext';

const settings = ['Profile', 'Dashboard', 'Logout'];

function Navbar() {
  const username = localStorage.getItem('username');
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
        const response = await getSignedImageURL(imageName)
        setprofileImageUrl(response);
      } catch (err: any) {
        alert(err.message);
      }
    }
    getUserProfilePic(localStorage.getItem('profileImage') as string);

  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <a href="/">
            <img src={Logo} alt="Logo" style={{ height: '50px' }} />
          </a>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <Typography sx={{ paddingRight: "15px" }}>
              Hello {username}!
            </Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src={profileImageUrl}
                  sx={{ bgcolor: "white" }}
                />
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
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={setting === 'Logout' ? handleLogout
                    : setting === 'Profile' ? () => window.location.href = '/profile'
                      : setting === 'Dashboard' ? () => window.location.href = '/dashboard'
                        : handleCloseUserMenu}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
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

