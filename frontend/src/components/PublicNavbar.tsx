import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Logo from '../assets/Logo.png'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={Logo} alt="Logo" style={{ height: '50px' }} />
          </div>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={() => navigate('/learn')}>
              About Us
            </Button>
            <Button
              variant='contained'
              color='secondary'
              sx={{ color: 'white' }}
              onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;