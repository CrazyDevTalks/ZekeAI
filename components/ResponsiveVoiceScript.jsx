'use client'

import { useEffect } from 'react'

const ResponsiveVoiceScript = () => {
  useEffect(() => {
    const loadResponsiveVoice = () => {
      if (window.responsiveVoice) {
        console.log("ResponsiveVoice already loaded");
        return;
      }

      window.addEventListener('load', () => {
        if (window.responsiveVoice) {
          console.log("ResponsiveVoice initialized");
          window.responsiveVoice.init();
        }
      });

      const script = document.createElement('script');
      script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${process.env.NEXT_PUBLIC_RESPONSIVE_VOICE_KEY}`;
      script.async = true;
      script.onload = () => {
        console.log("ResponsiveVoice script loaded");
        if (window.responsiveVoice) {
          window.responsiveVoice.init();
        }
      };

      document.head.appendChild(script);
    };

    loadResponsiveVoice();

    return () => {
      // Cleanup if needed
      const script = document.querySelector('script[src*="responsivevoice.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default ResponsiveVoiceScript;