import React, { useState } from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ContactForm from './ContactUsForm';
import PrivacyPolicy from "../privacyPolicy/pricavy";

const ContactUs = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="containerCo">
        <div className="boxCo">
          <h3 className="titleCo">تواصل معنا</h3>
          <div className="grid-containerCo">
            <div className="paperCo">
              <h5 className="paper-titleCo text-end">معلومات الاتصال</h5>
              <p className="paper-textCo text-end">
              يرجى ملء الحقول التالية وإرسال رسالتك إلينا
              </p>
              <ContactForm />

              <Typography
                onClick={() => setOpen(true)}
                className="text-btn  my-4 hover:cursor-pointer"
                style={{
                  textAlign: 'start', // محاذاة النص إلى المركز
                  direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
                }}
              >
                اطلع على سياسة الخصوصية لدينا
              </Typography>

              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle className='text-center !font-bold'>سياسة الخصوصية</DialogTitle>
                <DialogContent>
                  <PrivacyPolicy />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                  اغلق
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;

