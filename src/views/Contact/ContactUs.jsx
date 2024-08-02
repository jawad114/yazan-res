import { Button, Typography } from "@mui/material";
import "./ContactUs.css";
import ContactForm from "./ContactUsForm";
import { useRef, useState } from "react";
import CustomModal from "../modal/modal";

import PrivacyPolicy from "../privacyPolicy/pricavy";

const ContactUs = () => {
       


  const [open, setOpen] = useState(false);

  const handleClose = ()=>{setOpen(false)}
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
            
            <Typography onClick={()=>{setOpen(true)}} className="text-btn my-4">Read our Privacy Policy</Typography>
            <CustomModal handleClose={handleClose} body={<><PrivacyPolicy/> 
            <Button onClick={handleClose} className="mt-3 btn-global text-light w-100"> close </Button></>} open={open}/>
          </div>
        </div>
      </div>
    </div>
   
    </>
  );
};

export default ContactUs;
