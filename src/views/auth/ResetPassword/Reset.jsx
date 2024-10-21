import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@material-tailwind/react';
import AxiosRequest from '../../../Components/AxiosRequest';
import { useLocation } from 'react-router-dom';

const Reset = () => {
    const location = useLocation();
    const [state, setState] = useState({
        email: location.state?.email,
        verificationCode: '',
        newPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!state.email){
                setError('يرجى تقديم بريد إلكتروني');
                setSuccess(null)
                return;
            }
            if(!state.verificationCode){
                setError('يرجى تقديم رمز التحقق');
                setSuccess(null)
                return;
            }
            if(!state.newPassword){
                setError('يرجى تقديم كلمة مرور جديدة');
                setSuccess(null)
                return;
            }
            const response = await AxiosRequest.post('/reset-password', state);
            setSuccess(response.data.message);
            setError('');
            window.location.replace("/login-client");
        } catch (err) {
            setError(err.response.data.error);
            setSuccess('');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">استرجاع كلمة المرور الخاصة بك</h1>

                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        value={state.email}
                        style={{
                            textAlign: 'start', // محاذاة النص إلى المركز
                            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
                          }}
                        onChange={handleChange}
                        placeholder="البريد الإلكتروني"
                        className="mb-4 border-2 w-full border-black rounded"
                        />
                    <input
                        type="text"
                        name="verificationCode"
                        value={state.verificationCode}
                        style={{
                            textAlign: 'start', // محاذاة النص إلى المركز
                            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
                          }}
                        onChange={handleChange}
                        placeholder="الرجاء ادخال رمز التحقق المرسل الى بريدك الإلكتروني"
                        className="mb-4 border-2 w-full border-black rounded"
                        />
                    <input
                        type="password"
                        name="newPassword"
                        value={state.newPassword}
                        style={{
                            textAlign: 'start', // محاذاة النص إلى المركز
                            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
                          }}
                        onChange={handleChange}
                        placeholder="كلمة مرور جديدة"
                        className="mb-4 border-2 w-full border-black rounded"
                        />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <Button 
                    type="submit" 
                    color="black" 
                    size='md' 
                    rounded={false}
                    block
                    className="mb-2"
                    >تعين كلمة المرور</Button>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                </div>
            </form>
        </div>
    );
};

export default Reset;
