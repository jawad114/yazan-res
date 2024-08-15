import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button, TextField, Typography } from '@mui/material';
import CustomModal from './modal/modal';
import './request.css';

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
    <><h3 id='credentials-Header'>طلب بيانات الاعتماد</h3><div className="owner-form-container">
      <CustomModal handleClose={handleClose} open={open} body={<div className="modal-body">
        <Typography variant="h5" align="center">لقد استلمنا رسالتك!</Typography>
        <Button onClick={() => window.location.replace('/')} className='btn-global mt-3'>تابع التسوق</Button>
      </div>} />


      <form id="owner-form" className="owner-form" ref={formRef} onSubmit={handleSendEmail}>

        <p id='parag-credit'>يرجى تقديم اسم مطعمك وعنوان بريدك الإلكتروني أدناه. سنقوم بمراجعة طلبك والرد عليك. إذا تم قبول طلبك، ستتلقى بيانات الاعتماد الخاصة بك عبر البريد الإلكتروني خلال 1-2 يوم عمل</p>


        <TextField
          className="form-field"
          type="text"
          name="user_name"
          value={form.user_name}
          onChange={handleChange}
          label="اسم المستخدم"
          variant="outlined"
          required />

        <TextField
          className="form-field"
          type="text"
          name="message"
          value={form.message}
          onChange={handleChange}
          label="اسم المتجر"
          variant="outlined"
          required />

        <TextField
          className="form-field"
          type="email"
          name="user_email"
          value={form.user_email}
          onChange={handleChange}
          label="البريد الإلكتروني المسجل"
          variant="outlined"
          required />

        <Button
          type='submit'
          className='btn-global'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'ارسل'}
        </Button>
      </form>
    </div></>
  );
}

export default Ownerform;
