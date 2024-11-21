"use client";

import { useState, useCallback, useEffect } from "react";

const languageMap = {
  en: "en-US",
  es: "es-ES",
  ar: "ar-SA",
  cn: "zh-CN",
};

// Real-time speech recognition using Web Speech API
const useSpeechRecognition = ({
  onResult,
  language,
  isPlayingAudio = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch (e) {
        console.error("Error cleaning up recognition:", e);
      }
    }

    // Stop recognition when audio is playing
    // if (isPlayingAudio) {
    //   try {
    //     recognition?.stop();
    //     setIsRecording(false);
    //   } catch (e) {
    //     console.error("Error stopping recognition:", e);
    //   }
    //   return;
    // }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      const locale = languageMap[language] || "en-US";
      newRecognition.lang = locale;

      setRecognition(newRecognition);
    }
  }, [language]);

  const startRecording = useCallback(() => {
    if (!recognition) {
      const error = "Speech recognition is not supported in this browser";
      console.error(error);
      setError(error);
      return;
    }

    try {
      // First check if already recording
      if (isRecording) {
        console.log("Recognition is already active");
        return;
      }

      // Reset any existing recognition state
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;

      // Make sure any existing recognition is properly stopped
      try {
        recognition.stop();
      } catch (e) {
        console.log("No active recognition to stop");
      }

      // Add a small delay to ensure the previous instance is fully stopped
      setTimeout(() => {
        try {
          const locale = languageMap[language] || "en-US";
          recognition.lang = locale;
          recognition.start(); // Start recognition here
          setIsRecording(true);
          setError(null);
        } catch (err) {
          const errorMessage = err.message || "Failed to start recording";
          console.error("Speech recognition start error:", errorMessage);
          setError(errorMessage);
          setIsRecording(false);
        }
      }, 100);
    } catch (err) {
      const errorMessage = err.message || "Failed to start recording";
      console.error("Speech recognition start error:", errorMessage);
      setError(errorMessage);
      setIsRecording(false);
    }
  }, [recognition, language, isRecording]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      setIsRecording(false);
    }
  }, [recognition]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = event => {
      const results = Array.from(event.results);

      if (results[results.length - 1].isFinal) {
        onResult(results[results.length - 1][0].transcript);
      }
    };

    const handleError = event => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    const handleEnd = () => {
      console.log("Speech recognition ended");

      // Only attempt to restart if we're still supposed to be recording
      // and we're not playing audio
      if (isRecording && !isPlayingAudio) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            console.error("Error restarting recognition:", e);
            setIsRecording(false);
          }
        }, 100);
      } else {
        setIsRecording(false);
      }
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, onResult, isRecording, isPlayingAudio]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
};

export default useSpeechRecognition;
