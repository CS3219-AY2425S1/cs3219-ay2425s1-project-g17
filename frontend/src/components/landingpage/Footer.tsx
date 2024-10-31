import React from 'react';
import { Container, Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                padding: 1,
                backgroundColor: '#333',
                color: 'white'
            }}>
            <Box sx={{ display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
                }}>
                <Typography variant="caption">
                    © {new Date().getFullYear()} PeerPrep. All Rights Reserved.
                </Typography>

                <Box sx={{ display: 'flex', gap: 6 }}>
                    <Link color="inherit" underline="hover" variant="caption">
                        Privacy Policy
                    </Link>
                    <Typography variant="caption">|</Typography>
                    <Link color="inherit" underline="hover" variant="caption">
                        Terms of Service
                    </Link>
                    <Typography variant="caption">|</Typography>
                    <Link color="inherit" underline="hover" variant="caption">
                        Acceptable Use Guide
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="inherit" aria-label="Facebook">
                        <FacebookIcon fontSize='small'/>
                    </IconButton>
                    <IconButton color="inherit" aria-label="Twitter">
                        <TwitterIcon fontSize='small'/>
                    </IconButton>
                    <IconButton color="inherit" aria-label="Instagram">
                        <InstagramIcon fontSize='small'/>
                    </IconButton>
                    <IconButton color="inherit" aria-label="LinkedIn">
                        <LinkedInIcon fontSize='small'/>
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default Footer;
