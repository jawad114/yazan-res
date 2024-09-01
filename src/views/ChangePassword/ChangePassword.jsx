import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Alert } from '@material-tailwind/react';
import { TextField, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const receivedEmail = localStorage.getItem('email');
  const [email, setEmail] = useState(receivedEmail);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const isClient = localStorage.getItem('isClient');

    if (!isClient) {
      navigate('/forbidden'); // Replace with your actual page link
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await AxiosRequest.post('/change-password', {
        email,
        oldPassword,
        newPassword,
      });

      toast.success(<div style={{direction:'rtl'}}>{response.data.message}</div>);
      setNewPassword('');
      setOldPassword('');
    } catch (err) {
      toast.error(<div style={{direction:'rtl'}}>{err.response?.data?.error}</div>);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 m-4 bg-white shadow-lg rounded-lg">
        <Typography variant="h4" className="mb-6 text-center text-black">
          تغيير كلمة المرور
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              margin="dense"
              inputProps={{
                autoComplete: 'off'
              }}
              style={{
                textAlign: 'start',
                direction: 'rtl',
              }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              type={showOldPassword ? 'text' : 'password'}
              placeholder="كلمة المرور القديمة"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              margin="dense"
              inputProps={{
                autoComplete: 'off'
              }}
              style={{
                textAlign: 'start',
                direction: 'rtl',
              }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showOldPassword ? (
                      <VisibilityOff 
                        onClick={() => setShowOldPassword(!showOldPassword)} 
                        style={{ cursor: 'pointer' }} 
                      />
                    ) : (
                      <Visibility 
                        onClick={() => setShowOldPassword(!showOldPassword)} 
                        style={{ cursor: 'pointer' }} 
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="mb-6">
            <TextField
              type={showNewPassword ? 'text' : 'password'}
              placeholder="كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              margin="dense"
              inputProps={{
                autoComplete: 'off'
              }}
              style={{
                textAlign: 'start',
                direction: 'rtl',
              }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showNewPassword ? (
                      <VisibilityOff 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        style={{ cursor: 'pointer' }} 
                      />
                    ) : (
                      <Visibility 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        style={{ cursor: 'pointer' }} 
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {/* {message && <Alert color="green" className="mb-4">{message}</Alert>}
          {error && <Alert color="red" className="mb-4">{error}</Alert>} */}
          <Button type="submit" color="blue" fullWidth className="mt-4">
            تغيير كلمة المرور
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
