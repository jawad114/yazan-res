import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Button } from '@material-tailwind/react';
import AxiosRequest from '../../../../Components/AxiosRequest';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateEmail = () => {
  const location = useLocation();
  
  // Extract email from the location state
  const email = location.state?.email ;
  
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await AxiosRequest.post('/update-owner-email', {
        email,
        newEmail
      });
      if (response.data.status === "ok") {
        setSuccess('!تم تحديث البريد الإلكتروني بنجاح');
        toast.success(<div style={{direction:'rtl'}}>!تم تحديث البريد الإلكتروني بنجاح</div>);
        navigate('/login-owner');
      } else {
        setError(response.data.error || 'Failed to update email');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      toast.error(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false);
    }
  };

  // Redirect or show an error if email is not available
  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">No email provided. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Email</h1>
        <div className="mb-4">
          <input
            name="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email"
            className="mb-4 border-2 w-full border-black rounded"
            required
          />
        </div>
        <div className="flex flex-col items-center justify-between">
          <Button
            type="submit"
            variant="filled"
            disabled={loading}
            color="black"
            size='md'
            className="mt-2"
          >
            {loading ? <CircularProgress size={24} /> : 'Update Email'}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
      </form>
    </div>
  );
};

export default UpdateEmail;
