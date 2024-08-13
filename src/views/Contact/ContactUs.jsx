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
          <h3 className="titleCo">Contact Us</h3>
          <div className="grid-containerCo">
            <div className="paperCo">
              <h5 className="paper-titleCo">Contact Information</h5>
              <p className="paper-textCo">
                Please fill out the following fields and send us your message!
              </p>
              <ContactForm />

              <Typography
                onClick={() => setOpen(true)}
                className="text-btn my-4"
                style={{ cursor: 'pointer' }}
              >
                Read our Privacy Policy
              </Typography>

              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle className='text-center !font-bold'>Privacy Policy</DialogTitle>
                <DialogContent>
                  <PrivacyPolicy />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
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

