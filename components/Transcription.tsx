"use client";

import { useEffect, useRef } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";

interface DeepgramTranscriptionProps {
  isListening: boolean;
  onTranscriptionUpdate: (caption: string, isFinal: boolean, speechFinal: boolean) => void;
  onPermissionDenied: () => void;
  language: string;
}

const DeepgramTranscription: React.FC<DeepgramTranscriptionProps> = ({ 
  isListening, 
  onTranscriptionUpdate,
  onPermissionDenied,
  language
}) => {
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const keepAliveInterval = useRef<any>();
  const isInitialized = useRef(false);

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isListening && microphoneState === MicrophoneState.Ready && !isInitialized.current) {
      console.log('Connecting to Deepgram...');
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 1000,
        language: language,
      });
      isInitialized.current = true;
    } else if (!isListening) {
      isInitialized.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, microphoneState, language]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "") {
        onTranscriptionUpdate(thisCaption, isFinal, speechFinal);
      }
    };

    if (connectionState === LiveConnectionState.OPEN && isListening) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
      startMicrophone();
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    };
  }, [connectionState, isListening]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  return (
    <div className="flex h-full antialiased">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full">
          <div className="relative w-full h-full">
            {/* Add any visualization or other UI components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepgramTranscription;