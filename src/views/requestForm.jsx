import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button, TextField, Typography } from '@mui/material';
import CustomModal from './modal/modal';

function Ownerform() {
  const [open, setOpen] = useState(false);
  const formRef = useRef();
  const [form, setForm] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await emailjs.sendForm(
        'service_r6fk6ik',
        'template_jy1mxj5',
        formRef.current,
        { publicKey: 'XkH847brND8tuxWpU' }
      );
      setOpen(true);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Failed to send email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className='max-w-xl flex flex-col mx-auto mt-8 p-6 bg-white shadow-lg mb-4 rounded-lg'>
    <div className="owner-form-container">
      <CustomModal handleClose={handleClose} open={open} body={<div className="modal-body">
        <Typography variant="h5" align="center">لقد استلمنا رسالتك!</Typography>
        <Button onClick={() => window.location.replace('/')} className='btn-global mt-3'>تابع التسوق</Button>
      </div>} />


      <form id="owner-form" className="flex flex-col gap-4 items-center justify-center" ref={formRef} onSubmit={handleSendEmail}>
      <div className=''>
      <h3 className='text-center'>طلب بيانات الاعتماد</h3>
      </div>

        <p className='text-end'>يرجى تقديم اسم مطعمك وعنوان بريدك الإلكتروني أدناه. سنقوم بمراجعة طلبك والرد عليك. إذا تم قبول طلبك، ستتلقى بيانات الاعتماد الخاصة بك عبر البريد الإلكتروني خلال 1-2 يوم عمل</p>


        <TextField
          type="text"
          name="user_name"
          value={form.user_name}
          onChange={handleChange}
          style={{
            textAlign: 'start', // محاذاة النص إلى المركز
            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
          }}
          sx={{
            '& .MuiOutlinedInput-input:focus': {
              outline: 'none', // Removes the focus ring
              boxShadow: 'none',
            },
          }}
          label="اسم المستخدم"
          variant="outlined"
          fullWidth
          required />

        <TextField
          type="text"
          name="message"
          value={form.message}
          onChange={handleChange}
          style={{
            textAlign: 'start', // محاذاة النص إلى المركز
            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
          }}
          sx={{
            '& .MuiOutlinedInput-input:focus': {
              outline: 'none', // Removes the focus ring
              boxShadow: 'none',
            },
          }}
          label="اسم المتجر"
          fullWidth
          variant="outlined"
          required />

        <TextField
          type="email"
          name="user_email"
          fullWidth
          value={form.user_email}
          style={{
            textAlign: 'start', // محاذاة النص إلى المركز
            direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
          }}
          sx={{
            '& .MuiOutlinedInput-input:focus': {
              outline: 'none', // Removes the focus ring
              boxShadow: 'none',
            },
          }}
          onChange={handleChange}
          label="البريد الإلكتروني المسجل"
          variant="outlined"
          required />
<div className='flex items-center justify-center'>
        <Button
          type='submit'
          className='btn-global text-white'
          disabled={loading}
          size='medium'
        >
          {loading ? 'Sending...' : 'ارسل'}
        </Button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Ownerform;
