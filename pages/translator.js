"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import LanguageSelector from "../components/LanguageSelector";
import TranscriptDisplay from "../components/TranscriptDisplay";
import ToggleButton from "../components/ToggleButton";
import ResponsiveVoiceScript from "../components/ResponsiveVoiceScript";

export default function Translator() {
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("pt");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechSynthesis = useRef(null);
  const [voices, setVoices] = useState([]);
  const voicesLoaded = useRef(false);
  const [isResponsiveVoiceReady, setIsResponsiveVoiceReady] = useState(false);
  const initialized = useRef(false);

  const inputLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  ];

  const outputLanguages = [
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "zh-cn", name: "Chinese", flag: "🇨🇳" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    speechSynthesis.current = synth;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        voicesLoaded.current = true;
        console.log("Voices loaded:", availableVoices.length);
      }
    };

    loadVoices();

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        let attempts = 0;
        while (!window.responsiveVoice && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (window.responsiveVoice) {
          // Modified initialization approach
          const initAudio = () => {
            if (!initialized.current) {
              // Try to speak a silent message to initialize
              window.responsiveVoice.speak("", "UK English Female", {
                volume: 0,
              });
              initialized.current = true;
              document.removeEventListener("click", initAudio);
            }
          };

          document.addEventListener("click", initAudio);
          console.log("ResponsiveVoice available");
          setIsResponsiveVoiceReady(true);
        } else {
          console.error("ResponsiveVoice not available");
        }
      } catch (error) {
        console.error("Error initializing ResponsiveVoice:", error);
      }
    };

    initializeAudio();
  }, []);

  const voiceMapping = {
    en: "UK English Female",
    pt: "Portuguese Female",
    es: "Spanish Latin American Female",
    fr: "French Female",
    de: "Deutsch Female",
    hi: "Hindi Female",
    "zh-cn": "Chinese Female",
    ar: "Arabic Female",
    ja: "Japanese Female",
    ko: "Korean Female",
  };

  const handlePlayTranslation = (text, language) => {
    console.log("Attempting playback:", { text, language });

    // Check if text is valid
    if (!text || text.trim() === "") {
      console.error("Empty text provided for playback");
      return;
    }


    const voice = voiceMapping[language];
    if (!voice) {
      console.error("No voice mapping found for language:", language);
      setError(`Audio not supported for ${language}`);
      return;
    }
  
    try {
      window.responsiveVoice.cancel();
  
      // Set a timeout for voice
      const timeout = setTimeout(() => {
        window.responsiveVoice.speak(text, "UK English Female", {
          onstart: () => setIsPlayingAudio(true),
          onend: () => setIsPlayingAudio(false),
          onerror: () => {
            setIsPlayingAudio(false);
            setError("Audio playback failed completely");
          },
        });
      }, 3000); // 3 seconds timeout
  
      window.responsiveVoice.speak(text, voice, {
        onstart: () => {
          clearTimeout(timeout); // Clear timeout if playback starts
          console.log("Playback started");
          setIsPlayingAudio(true);
          setError(null);
        },
        onend: () => {
          console.log("Playback completed");
          setIsPlayingAudio(false);
        },
        onerror: error => {
          console.error("Playback error:", error);
          setIsPlayingAudio(false);
          setError("Audio playback failed - trying again...");
        },
        rate: 0.9,
        pitch: 1,
        volume: 1,
      });
    } catch (error) {
      console.error("Playback error:", error);
      setIsPlayingAudio(false);
      setError("Audio playback error - please try again");
    }
  };

  const handleTranscriptResult = useCallback(
    async transcript => {
      // Log the incoming transcript for debugging
      console.log(
        "Received transcript:",
        transcript,
        "Source language:",
        sourceLanguage
      );

      // Sanitize input but preserve non-English characters
      const sanitizedText = transcript
        .trim()
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters but keep non-English

      if (!sanitizedText) {
        console.log("Empty transcript after sanitization");
        return;
      }

      try {
        setIsProcessing(true);
        setError(null);

        const newTranscript = {
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          original: sanitizedText,
          translated: "Translating...",
          sourceLanguage,
          targetLanguage,
        };

        setTranscripts(prev => [...prev, newTranscript]);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/translate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              text: sanitizedText,
              sourceLanguage,
              targetLanguage,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Translation failed:", data);
          throw new Error(data.error || "Translation failed");
        }

        console.log("Translation successful:", data);

        setTranscripts(prev =>
          prev.map(t =>
            t.id === newTranscript.id
              ? { ...t, translated: data.translation }
              : t
          )
        );

        handlePlayTranslation(data.translation, targetLanguage);
      } catch (err) {
        console.error("Error in handleTranscriptResult:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to process the speech. Please try again.";
        setError(errorMessage);

        setTranscripts(prev =>
          prev.map(t =>
            t.translated === "Translating..."
              ? { ...t, translated: "Translation failed" }
              : t
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [sourceLanguage, targetLanguage]
  );

  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recognitionError,
  } = useSpeechRecognition({
    onResult: handleTranscriptResult,
    language: sourceLanguage,
    isPlayingAudio: isPlayingAudio,
  });

  const handleLanguageChange = newLanguage => {
    // Stop any ongoing recording when language changes
    if (isRecording) {
      stopRecording();
    }
    setSourceLanguage(newLanguage);
    // Add a small delay before allowing new recording
    setTimeout(() => {
      setError(null);
    }, 300);
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <div className="w-full max-w-4xl px-4 md:mx-auto pb-4 sm:pb-8 md:mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <LanguageSelector
            languages={inputLanguages}
            value={sourceLanguage}
            onChange={handleLanguageChange}
            label="Input"
            disabled={isRecording || isProcessing}
          />
          <LanguageSelector
            languages={outputLanguages}
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="Output"
            disabled={isRecording || isProcessing}
          />
        </div>

        <div className="mb-4">
          <ToggleButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                setError(null);
                startRecording();
              }
            }}
            isSpeechRecognitionSupported={true}
          />
        </div>
        <div className="mb-4">
          <TranscriptDisplay
            transcripts={transcripts}
            playTranslation={handlePlayTranslation}
            isPlayingAudio={isPlayingAudio}
          />
        </div>
        <ResponsiveVoiceScript />
      </div>
    </Suspense>
  );
}
