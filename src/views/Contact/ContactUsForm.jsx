import { Button, Typography } from "@mui/material";
import CustomModal from "../modal/modal";
import "./ContactUs.css";
import { useRef, useState } from "react";
import emailjs from '@emailjs/browser';

const ContactForm = () => {

  const formRef = useRef();
  const [form, setForm] = useState({
 
    user_email: '',
    message:''
  
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm({ ...form, [name]: value });
  };
  
  
  
  const handleSendEmail = (e) => {
    console.log('triggereed')
    e.preventDefault();
  
    emailjs
      .sendForm('service_r6fk6ik', 'template_jy1mxj5', 
   
    formRef.current
     ,
      {
        publicKey: 'XkH847brND8tuxWpU',
      })
      .then(
        () => {
         setOpenContact(true)
          console.log('SUCCESS!');
     
        },
        (error) => {
          alert('email not sent')
  
          console.log('FAILED...', error.text);
        },
      );
  };


  const [openContact, setOpenContact] = useState(false);
  
  const handleCloseContact = ()=>{setOpenContact(false)}
  
  return (
    <>
    <form
    ref={formRef}
     onSubmit={handleSendEmail} className="contact-formCo">
      <input
       name="user_email" 
      value={form.user_email}
      onChange={handleChange}
        type="email"
        placeholder="Your email"
        className="input-fieldCo"
      />
      <input
       name="message" 
        value={form.message}
      onChange={handleChange}
        placeholder="Your Message"
        className="textarea-fieldCo  p-5"
      />
      <Button className="btn-global text-light w-100" type="submit">Send</Button>
    </form>
    <CustomModal handleClose={handleCloseContact} open={openContact} body={
          <div >
        <Typography className='text-center fs-4'>We have receiver your message!</Typography>  
          <Button onClick={()=>{window.location.replace('/')}} className='btn-global fs-5 w-100 mt-5 text-light'>Continue Shopping </Button>
          </div>
          }/>      
    </>
  );
};

export default ContactForm;
