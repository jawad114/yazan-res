import { Button, Dialog, Typography } from "@mui/material";
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
        placeholder="البريد الإلكتروني"
        className="input-fieldCo"
        style={{
          textAlign: 'start', // محاذاة النص إلى المركز
          direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
        }}
      />
      <input
       name="message" 
        value={form.message}
      onChange={handleChange}
        placeholder="اترك رسالة مع شرح واضح"
        className="textarea-fieldCo  p-5"
        style={{
          textAlign: 'start', // محاذاة النص إلى المركز
          direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
        }}
      />
      <Button className="btn-global text-light w-100" type="submit">ارسل</Button>
    </form>
    {/* <CustomModal handleClose={handleCloseContact} open={openContact} body={
          <div >
        <Typography className='text-end fs-4'>! لقد استلمنا رسالتك
          <br/>
        "احصل على ردود أذكى، قم بتحميل الملفات والصور، وأكثر"
        <br/>
               اشترك    </Typography>  
          <Button onClick={()=>{window.location.replace('/')}} className='btn-global fs-5 w-100 mt-5 text-light'>أستمر بالتسوق</Button>
          </div>
          }/>       */}
          <Dialog
      open={openContact}
      onClose={handleCloseContact}
      PaperProps={{
        className: 'bg-white p-6 rounded-lg shadow-lg'
      }}
    >
      <div className="p-2"style={{direction:'rtl'}}>
        <Typography variant="h6" className="!font-semibold text-end mb-4">
        شكرًا لك على رسالتك! لقد استلمناها وسنقوم بالرد عليك في أقرب وقت ممكن
        </Typography>
        <Button
          onClick={() => { window.location.replace('/'); }}
          variant="contained"
          color="primary"
          className="w-full mt-4 text-lg bg-blue-500 hover:bg-blue-600"
        >
          أستمر بالتسوق
        </Button>
      </div>
    </Dialog>
    </>
  );
};

export default ContactForm;
