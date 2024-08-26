import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { IconButton } from '@mui/material';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showButton && (
        <IconButton
          onClick={scrollToTop}
        className="!fixed bottom-10 right-10 !bg-[#33CCF9] text-white border-none rounded-full cursor-pointer text-2xl  shadow-md"
        aria-label="back to top"
        >
          <ArrowUpwardIcon fontSize='large' />
        </IconButton>
      )}
    </>
  );
};



export default BackToTopButton;
