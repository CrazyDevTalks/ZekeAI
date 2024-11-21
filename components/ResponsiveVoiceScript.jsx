'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const ResponsiveVoiceScript = () => {
  useEffect(() => {
    const initVoice = () => {
      if (typeof window !== 'undefined' && window.responsiveVoice) {
        try {
          // First try to initialize audio context
          const AudioContext = window.AudioContext || (window).webkitAudioContext;
          const audioContext = new AudioContext();
          
          // Test voice with a silent message
          window.responsiveVoice.speak('', 'UK English Female', {
            volume: 0,
            pitch: 1,
            rate: 1,
            onstart: () => {
              console.log('Voice initialization started');
              // Resume audio context if suspended
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
            },
            onend: () => console.log('Voice initialization completed'),
            onerror: (e) => console.error('Voice initialization error:', e)
          });
        } catch (error) {
          console.error('Error initializing ResponsiveVoice:', error);
        }
      }
    };

    // Initialize on first user interaction
    const handleInteraction = () => {
      console.log('User interaction detected, initializing voice...');
      initVoice();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="responsive-voice"
      src="https://code.responsivevoice.org/responsivevoice.js?key=bVsaYCVM"
      strategy="beforeInteractive"
      onReady={() => {
        console.log('ResponsiveVoice is ready to initialize');
      }}
      onLoad={() => {
        console.log('ResponsiveVoice script loaded');
      }}
      onError={(e) => {
        console.error('Error loading ResponsiveVoice:', e);
      }}
    />
  );
};

export default ResponsiveVoiceScript;