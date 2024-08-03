import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { Button } from '@material-tailwind/react';
import AxiosRequest from '../../../../Components/AxiosRequest';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(30);

  useEffect(() => {
    // Clear resend timeout on unmount
    return () => clearTimeout(resendTimeout);
  }, []);

  useEffect(() => {
    if (!canResend) {
      // Start countdown timer when canResend changes to false
      const countdownInterval = setInterval(() => {
        setResendCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear countdown interval when canResend changes to true
      if (resendCountdown === 0) {
        clearInterval(countdownInterval);
        setResendCountdown(30);
      }

      return () => clearInterval(countdownInterval);
    }
  }, [canResend, resendCountdown]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await AxiosRequest.post(`/verify-code/${email}`, {
        verificationCode: verificationCode
      });
      if (response.data.status === "ok") {
        setSuccess('Verification successful!');
        window.location.replace('/login-client');
      }
    } catch (err) {
      if (error.response && error.response.status === 402) {
        setError('Verification code has expired');
      } else {
        setError(err.response.data.error || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const response = await AxiosRequest.post(`/resend-verification-code`, { email });
      if (response.data.message) {
        setSuccess(response.data.message);
        setCanResend(false);
        // Set a 30-second cooldown before allowing resend again
        const timeout = setTimeout(() => {
          setCanResend(true);
        }, 30000);
        setResendTimeout(timeout);
      }
    } catch (err) {
      setError(err.response.data.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Verify Account</h1>
        <div className="mb-4">
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 border-2 border-black rounded"
          />
          <input
            name="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Verification Code"
            className="mb-4 border-2 border-black rounded"
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
            {loading ? <CircularProgress size={24} /> : 'Verify Code'}
          </Button>
          <Button
            onClick={handleResendCode}
            disabled={loading || !canResend}
            color="black"
            size='md'
            className="mt-2"
          >
            {loading ? <CircularProgress size={24} /> : canResend ? 'Send Verification Code' : `Resend Verification Code (${resendCountdown})`}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
      </form>
    </div>
  );
};

export default Verify;
