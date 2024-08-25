// import React, { useEffect } from 'react';

// const AccessibilityButton: React.FC = () => {
//   useEffect(() => {
//     // Configuration object for the accessibility script
//     const interdeal = {
      // sitekey: "a830c94e1fa10dbd322863db50ac9ea1",
//       Position: "Left",
//       domains: {
//         js: "https://cdn.equalweb.com/",
//         acc: "https://access.equalweb.com/"
//       },
//       Menulang: "AR",
//       btnStyle: {
//         vPosition: ["80%", "20%"],
//         scale: ["0.5", "0.5"],
//         color: {
//           main: "#1876c9",
//           second: "#ffffff"
//         },
//         icon: {
//           type: 1,
//           shape: "semicircle"
//         }
//       }
//     };

//     // Create and configure the script element
//     const script = document.createElement('script');
//     script.src = `${interdeal.domains.js}core/5.0.4/accessibility.js`;
//     script.defer = true;
//     script.integrity = 'sha512-eTUQWRddyiuveqEbmMAHQ8v9FzTkrdWz0Tyr2rbZSUC6JOsmhmyQMXGo1lANZnpINLB1IFuN3u6s7FM296qwYA==';
//     script.crossOrigin = 'anonymous';
//     script.setAttribute('data-cfasync', 'true');

//     // Append the script to the document head
//     document.head.appendChild(script);

//     // Cleanup function to remove the script if the component unmounts
//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   return null; // This component doesn't render anything to the DOM
// };

// export default AccessibilityButton;

// import React, { useEffect } from 'react';

// const AccessibilityButton = () => {
//   useEffect(() => {
//     // Check if the EqualWeb script is already loaded
//     if (window.equalweb) {
//       return;
//     }

//     // Create and configure the script element
//     const script = document.createElement('script');
//     script.src = "https://cdn.equalweb.com/core/5.0.4/accessibility.js";
//     script.defer = true;
//     script.integrity = 'sha512-eTUQWRddyiuveqEbmMAHQ8v9FzTkrdWz0Tyr2rbZSUC6JOsmhmyQMXGo1lANZnpINLB1IFuN3u6s7FM296qwYA==';
//     script.crossOrigin = 'anonymous';
//     script.setAttribute('data-cfasync', 'true');

//     // Append the script to the document head
//     document.head.appendChild(script);

//     // Initialize EqualWeb after the script has loaded
//     script.onload = () => {
//       if (window.equalweb) {
//         window.equalweb.init({
//           sitekey: "a830c94e1fa10dbd322863db50ac9ea1",
//           Position: "Left",
//           domains: {
//             js: "https://cdn.equalweb.com/",
//             acc: "https://access.equalweb.com/"
//           },
//           Menulang: "AR",
//           btnStyle: {
//             vPosition: ["80%", "20%"],
//             scale: ["0.5", "0.5"],
//             color: {
//               main: "#1876c9",
//               second: "#ffffff"
//             },
//             icon: {
//               type: 1,
//               shape: "semicircle"
//             }
//           }
//         });
//       } else {
//         console.error('EqualWeb script loaded but window.equalweb is not defined');
//       }
//     };

//     // Cleanup function to remove the script if the component unmounts
//     return () => {
//       const script = document.querySelector('script[src="https://cdn.equalweb.com/core/5.0.4/accessibility.js"]');
//       if (script) {
//         document.head.removeChild(script);
//       }
//     };
//   }, []);

//   return null; // This component doesn't render anything to the DOM
// };

// export default AccessibilityButton;


import { useEffect } from 'react';

declare global {
  interface Window {
    interdeal: any;
  }
}

interface AccessibilityButtonProps {
  sitekey: string;
}

const AccessibilityButton = ({ sitekey }: AccessibilityButtonProps) => {
  useEffect(() => {
    // Set up the window.interdeal configuration
    window.interdeal = {
      sitekey: sitekey,
      Position: "Right",
      Menulang: "EN",
      domains: {
        js: "https://cdn.equalweb.com/",
        acc: "https://access.equalweb.com/",
      },
      btnStyle: {
        vPosition: ["80%", null],
        scale: ["0.8", "0.8"],
        color: {
          main: "#0a51f2",
          second: "",
        },
        icon: {
          type: 7,
          shape: "semicircle",
          outline: false,
        },
      },
    };

    // Create and configure the script element
    const script = document.createElement('script');
    script.src = 'https://cdn.equalweb.com/core/4.4.1/accessibility.js';
    script.defer = true;
    script.integrity = 'sha512-tq2wb4PBHqpUqBTfTG32Sl7oexERId9xGHX2O3yF91IYLII2OwM1gJVBXGbEPaLmfSQrIE+uAOzNOuEUZHHM+g==';
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-cfasync', 'true');

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup function to remove the script if the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [sitekey]); // Depend on sitekey to ensure the effect runs if it changes

  return null; // This component doesn't render anything to the DOM
};

export default AccessibilityButton;

