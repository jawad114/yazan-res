// src/components/GoogleTranslate.jsx

import React from 'react';
import GoogleTranslate from 'react-google-translate';

const Translate = () => {
  return (
    <div>
      <GoogleTranslate 
        lang="ar"  // Default language (Arabic)
        apiKey="AIzaSyABj4U9mmJhzdKla8XxpTJ9U4oNkum069Y" // Optional: Add API key if needed
      />
    </div>
  );
};

export default Translate;
