import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const InvalidAccessPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} style={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Insufficient Access
        </Typography>
        <Typography variant="body1" paragraph>
          You do not have the required permissions to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleHomeClick}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default InvalidAccessPage;
