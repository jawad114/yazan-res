import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import axios from 'axios';
import AxiosRequest from '../../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    try {
      if (!email) {
        setLoading(false);
        setError('Please provide an email');
        return;
      }
      const response = await AxiosRequest.post('/forgot-password', { email });
      setVerificationCode(response.data.verificationCode);
      setSuccessMessage('تم إرسال رمز التحقق بنجاح') && setError(null);
      toast.info(<div style={{direction:'rtl'}}>قد تم ارسال رمز الى بريدك الإلكتروني إذا لم يصلك رمز التحقق، يرجى الانتظار لمدة 1 إلى 2 دقيقة حتى يصل إلى بريدك الإلكتروني تأكد من فحص صندوق الوارد</div>,{autoClose:7000});
      navigate("/reset-password",{state:{email}});

    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">استرجاع كلمة المرور</h1>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={handleEmailChange}
          style={{
            textAlign: 'start', // محاذاة النص إلى المركز
            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
          }}
          size={'medium'}
          className="border-2 w-full border-black rounded"
        />
        <div className='flex items-center text-center justify-center'>
          <Button
            color='black'
            size='md'
            rounded={false}
            block
            className="mt-10 mb-2"
            onClick={handleSendVerificationCode}
            disabled={loading}
          >
            {loading ? 'Sending Verification Code...' : 'إرسال رمز التحقق'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </div>
    </div>
  );
}

export default Forgot;
