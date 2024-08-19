import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <button 
          onClick={scrollToTop} 
          style={styles.button}
        >
          ↑
        </button>
      )}
    </div>
  );
};

const styles = {
  button: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    backgroundColor: '#0C9',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default ScrollToTopButton;
