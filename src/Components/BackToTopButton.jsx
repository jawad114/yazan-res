import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { IconButton } from '@mui/material';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // Logic to toggle the visibility of the button based on scroll position
  const handleScroll = () => {
    if (window.pageYOffset > 300) { // Show after 300px of scrolling down
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

  // Scroll back to the top of the page when button is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showButton && (
        <IconButton
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10 bg-black text-white p-3 hover:bg-gray-800 transition-all"
          aria-label="back to top"
          style={{
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <ArrowUpwardIcon fontSize="large" />
        </IconButton>
      )}
    </>
  );
};

export default BackToTopButton;
