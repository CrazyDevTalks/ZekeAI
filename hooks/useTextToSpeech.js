import { useEffect, useState } from 'react';

export const useTextToSpeech = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkVoiceReady = () => {
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        console.log("Voice support confirmed");
        setIsReady(true);
      }
    };

    // Initial check
    if (window.responsiveVoice) {
      checkVoiceReady();
    }

    // Set up interval to check until ready
    const interval = setInterval(() => {
      if (window.responsiveVoice) {
        checkVoiceReady();
        clearInterval(interval);
      }
    }, 100);

    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const speak = (text, voice, options = {}) => {
    if (!isReady || !window.responsiveVoice) {
      console.warn('ResponsiveVoice not ready');
      return;
    }

    try {
      window.responsiveVoice.speak(text, voice, {
        ...options,
        onstart: () => {
          console.log('Started speaking');
          options.onstart?.();
        },
        onend: () => {
          console.log('Finished speaking');
          options.onend?.();
        },
        onerror: (error) => {
          console.error('Speech error:', error);
          options.onerror?.(error);
        }
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      options.onerror?.(error);
    }
  };

  const cancel = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
  };

  return { speak, cancel, isReady };
}; 