import { Suspense, useState, useRef, useEffect } from "react";
import DeepgramTranscription from "../components/Transcription";
import ResponsiveVoiceScript from "../components/ResponsiveVoiceScript";
import { LanguageSelect } from "../components/LanguageSelect";

export default function Deepgram() {
    const [isListening, setIsListening] = useState(false);
    const [caption, setCaption] = useState("");
    const [permissionError, setPermissionError] = useState(false);
    const captionBuffer = useRef("");
    const lastFinalCaption = useRef("");
    const captionTimeout = useRef();
    const lastSpeechTime = useRef(Date.now());
    const [translation, setTranslation] = useState("");
    const translationTimeout = useRef();
    const lastTranslatedText = useRef("");
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [error, setError] = useState(null);
    const [isResponsiveVoiceReady, setIsResponsiveVoiceReady] = useState(false);
    const audioContext = useRef(null);
    const lastPlayedTranslation = useRef("");
    const pendingTranslation = useRef("");
    const [sourceLanguage, setSourceLanguage] = useState("en");
    const [targetLanguage, setTargetLanguage] = useState("pt");
    const [captions, setCaptions] = useState([]);
    const [translations, setTranslations] = useState([]);
    const maxSentences = 5; // Keep last 5 sentences

    const MAX_CAPTION_LENGTH = 500;
    const NEW_SPEECH_THRESHOLD = 2000; // 2 seconds threshold to consider it a new speech

    const voiceMapping = {
        en: "UK English Female",
        pt: "Portuguese Female",
        es: "Spanish Latin American Female",
        fr: "French Female",
        de: "Deutsch Female",
        hi: "Hindi Female",
        "zh-cn": "Chinese Female",
        ja: "Japanese Female",
        ko: "Korean Female",
    };

    // Language mappings for Deepgram
    const deepgramLanguages = {
        en: "en-US",
        pt: "pt-PT",
        es: "es-419",
        fr: "fr-CA",
        de: "de-DK",
        hi: "hi",
        "zh-cn": "zh-CN",
        ja: "ja",
        ko: "ko-KR",
    };

    // Add language options for the UI
    const languageOptions = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "pt", name: "Portuguese", flag: "🇵🇹" },
        { code: "es", name: "Spanish", flag: "🇪🇸" },
        { code: "fr", name: "French", flag: "🇫🇷" },
        { code: "de", name: "German", flag: "🇩🇪" },
        { code: "hi", name: "Hindi", flag: "🇮🇳" },
        { code: "zh-cn", name: "Chinese", flag: "🇨🇳" },
        { code: "ja", name: "Japanese", flag: "🇯🇵" },
        { code: "ko", name: "Korean", flag: "🇰🇷" },
    ];

    const handleSourceLanguageChange = (newLanguage) => {
        if (isListening) {
            setIsListening(false); // Stop current recording before changing language
        }
        setSourceLanguage(newLanguage);
    };

    const handleTargetLanguageChange = (newLanguage) => {
        if (isListening) {
            setIsListening(false); // Stop current recording before changing language
        }
        setTargetLanguage(newLanguage);
    }
    // Initialize ResponsiveVoice

    const translateText = async (text) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    sourceLanguage: sourceLanguage,
                    targetLanguage: targetLanguage,
                }),
            });

            if (!response.ok) throw new Error('Translation failed');

            const data = await response.json();
            return data.translation;
        } catch (error) {
            console.error('Translation error:', error);
            setError("Translation failed");
            return null;
        }
    };

    const handleTranscriptionUpdate = async (newCaption, isFinal, speechFinal) => {
        clearTimeout(captionTimeout.current);

        const currentTime = Date.now();
        const timeSinceLastSpeech = currentTime - lastSpeechTime.current;

        if (timeSinceLastSpeech > NEW_SPEECH_THRESHOLD) {
            captionBuffer.current = "";
            lastFinalCaption.current = "";
            pendingTranslation.current = "";
        }

        lastSpeechTime.current = currentTime;

        if (isFinal) {
            if (newCaption !== lastFinalCaption.current) {
                let updatedCaption = captionBuffer.current + " " + newCaption;

                if (updatedCaption.length > MAX_CAPTION_LENGTH) {
                    updatedCaption = updatedCaption.slice(-MAX_CAPTION_LENGTH);
                    updatedCaption = updatedCaption.slice(updatedCaption.indexOf(' ') + 1);
                }

                captionBuffer.current = updatedCaption;
                setCaption(updatedCaption);
                lastFinalCaption.current = newCaption;

                // Add to captions history
                setCaptions(prev => {
                    const newCaptions = [...prev, updatedCaption].slice(-maxSentences);
                    return newCaptions;
                });

                // Get translation but don't play it yet
                const translatedText = await translateText(updatedCaption);
                if (translatedText) {
                    setTranslation(translatedText);
                    pendingTranslation.current = translatedText;

                    // Add to translations history
                    setTranslations(prev => {
                        const newTranslations = [...prev, translatedText].slice(-maxSentences);
                        return newTranslations;
                    });
                }
            }
        } else {
            const currentTranscription = captionBuffer.current + " " + newCaption;
            setCaption(currentTranscription);
        }

        if (speechFinal && pendingTranslation.current) {
            // Use selected target language
            handlePlayTranslation(pendingTranslation.current, targetLanguage);
            pendingTranslation.current = "";
        }

        if (speechFinal) {
            captionTimeout.current = setTimeout(() => {
                captionBuffer.current = "";
                lastPlayedTranslation.current = "";
                pendingTranslation.current = "";
                setCaption("");
                setTranslation("");
            }, 3000);
        }
    };

    const handlePlayTranslation = async (text, targetLanguage) => {
        // Don't play if it's the same text we just played
        if (text === lastPlayedTranslation.current) {
            console.log("Skipping duplicate translation playback");
            return;
        }

        if (!isResponsiveVoiceReady || !window.responsiveVoice) {
            console.error("ResponsiveVoice not ready");
            return;
        }

        if (!text || text.trim() === "") {
            console.error("Empty text provided for playback");
            return;
        }

        const voice = voiceMapping[targetLanguage];
        if (!voice) {
            console.error("No voice mapping found for language:", targetLanguage);
            return;
        }

        try {
            if (audioContext.current?.state === 'suspended') {
                await audioContext.current.resume();
            }

            if (window.responsiveVoice.isPlaying()) {
                window.responsiveVoice.cancel();
            }

            lastPlayedTranslation.current = text;

            window.responsiveVoice.speak(text, voice, {
                onstart: () => {
                    console.log("Playback started");
                    setIsPlayingAudio(true);
                },
                onend: () => {
                    console.log("Playback completed");
                    setIsPlayingAudio(false);
                },
                onerror: (error) => {
                    console.error("Playback error:", error);
                    setIsPlayingAudio(false);
                    setError("Audio playback failed");
                    lastPlayedTranslation.current = "";
                },
                rate: 0.9,
                pitch: 1,
                volume: 1
            });
        } catch (error) {
            console.error("Error playing translation:", error);
            setIsPlayingAudio(false);
            setError("Failed to play audio");
            lastPlayedTranslation.current = "";
        }
    };

    const handleMicrophoneToggle = async () => {
        if (!isListening) {
            // Check if we already have permission
            const permissions = await navigator.permissions.query({ name: 'microphone' });
            if (permissions.state === 'denied') {
                setPermissionError(true);
                return;
            }
        }
        setIsListening(!isListening);
    };

    const handlePermissionDenied = () => {
        setPermissionError(true);
        setIsListening(false);
    };

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            }
        >
            <div className="min-h-screen bg-gradient-to-b p-4">
                {/* Top Controls */}
                <div className="w-full max-w-6xl mx-auto mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <LanguageSelect
                                value={sourceLanguage}
                                onChange={handleSourceLanguageChange}
                                options={languageOptions}
                                label="Speak"
                            />

                            <div className="hidden sm:flex items-center justify-center px-2">
                                <svg
                                    className="w-6 h-6 text-white/40"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </div>

                            <LanguageSelect
                                value={targetLanguage}
                                onChange={handleTargetLanguageChange}
                                options={languageOptions}
                                label="Translate"
                            />
                        </div>

                        <button
                            onClick={handleMicrophoneToggle}
                            className={`px-6 py-2 rounded-full 
                            transition-all duration-200 shadow-lg
                            ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white font-medium`}
                        >
                            {isListening ? 'Stop Microphone' : 'Start Microphone'}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Speech Recognition Section */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-[400px] flex flex-col">
                        <div className="text-white/80 mb-4 font-medium border-b border-white/10 pb-2">
                            Speech Recognition
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {captions.map((text, index) => (
                                <div key={index} className="transition-all duration-300 ease-in-out mb-4">
                                    <span className="bg-black/50 p-4 rounded-lg inline-block
                                    shadow-lg border border-white/10 text-white opacity-60">
                                        {text}
                                    </span>
                                </div>
                            ))}
                            {caption && (
                                <div className="transition-all duration-300 ease-in-out mb-4">
                                    <span className="bg-black/50 p-4 rounded-lg inline-block
                                    shadow-lg border border-white/10 text-white">
                                        {caption}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Translation Section */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-[400px] flex flex-col">
                        <div className="text-white/80 mb-4 font-medium border-b border-white/10 pb-2">
                            Translation
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {translations.map((text, index) => (
                                <div key={index} className="transition-all duration-300 ease-in-out mb-4">
                                    <span className="bg-blue-900/50 p-4 rounded-lg inline-block
                                    shadow-lg border border-blue-400/20 text-white opacity-60">
                                        {text}
                                    </span>
                                </div>
                            ))}
                            {translation && (
                                <div className="transition-all duration-300 ease-in-out mb-4">
                                    <span className="bg-blue-900/50 p-4 rounded-lg inline-block
                                    shadow-lg border border-blue-400/20 text-white">
                                        {translation}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Messages */}
                {permissionError && (
                    <div className="fixed top-4 right-4 p-4 bg-red-500/90 backdrop-blur-md 
                    text-white rounded-lg shadow-lg border border-red-400 max-w-sm">
                        Microphone access denied. Please enable microphone access in your browser settings.
                    </div>
                )}
                <DeepgramTranscription
                    isListening={isListening}
                    onTranscriptionUpdate={handleTranscriptionUpdate}
                    onPermissionDenied={handlePermissionDenied}
                    language={deepgramLanguages[sourceLanguage]}
                />

                <ResponsiveVoiceScript />
            </div>
        </Suspense>
    );
}