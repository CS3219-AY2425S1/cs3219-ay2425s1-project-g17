import React from 'react';
import { Container, Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import collaborationImage from '../../assets/collaboration-space-screenshot.png';
import questionCodeImage from '../../assets/question-and-code-screenshot.png';
import dashboardImage from '../../assets/dashboard-screenshot.png';


const screenshots = [
  {
    src: collaborationImage,
    alt: 'Collaboration Space',
    description: 'Real-time collaboration allows users to work together seamlessly.',
    icon: <GroupIcon fontSize="large" />,
  },
  {
    src: questionCodeImage,
    alt: 'Question and Code',
    description: 'Access a comprehensive question bank with relevant code examples.',
    icon: <CodeIcon fontSize="large" />,
  },
  {
    src: dashboardImage,
    alt: 'Dashboard',
    description: 'An intuitive dashboard for managing your statistic effectively.',
    icon: <DashboardIcon fontSize="large" />,
  },
];

const Showcase = () => {

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h2" 
        component="h2" 
        sx={{ 
          color: '#9AC143', 
          textAlign: 'center', 
          mb: 6, 
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Showcase
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4,
        justifyContent: 'center'
      }}>
        {screenshots.map((screenshot, index) => (
          <Box key={index} sx={{ gap: 5, maxWidth: { xs: '100%', md: '30%' } }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={screenshot.src}
                  alt={screenshot.alt}
                  sx={{
                    filter: 'brightness(0.9)',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: '#9AC143' }}>
                    {screenshot.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {screenshot.alt}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {screenshot.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Showcase;