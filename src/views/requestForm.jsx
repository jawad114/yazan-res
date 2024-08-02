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
    <><h3 id='credentials-Header'>Request credentials</h3><div className="owner-form-container">
      <CustomModal handleClose={handleClose} open={open} body={<div className="modal-body">
        <Typography variant="h5" align="center">We have received your message!</Typography>
        <Button onClick={() => window.location.replace('/')} className='btn-global mt-3'>Continue Shopping</Button>
      </div>} />


      <form id="owner-form" className="owner-form" ref={formRef} onSubmit={handleSendEmail}>

        <p id='parag-credit'>Please provide the name of your restaurant and your email address below. We will review your request and get back to you. If your request is accepted, you will receive your credentials within 1-2 working days via email.</p>


        <TextField
          className="form-field"
          type="text"
          name="user_name"
          value={form.user_name}
          onChange={handleChange}
          label="Your Name"
          variant="outlined"
          required />

        <TextField
          className="form-field"
          type="text"
          name="message"
          value={form.message}
          onChange={handleChange}
          label="Restaurant Name"
          variant="outlined"
          required />

        <TextField
          className="form-field"
          type="email"
          name="user_email"
          value={form.user_email}
          onChange={handleChange}
          label="Owner's Email Address"
          variant="outlined"
          required />

        <Button
          type='submit'
          className='btn-global'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </form>
    </div></>
  );
}

export default Ownerform;
