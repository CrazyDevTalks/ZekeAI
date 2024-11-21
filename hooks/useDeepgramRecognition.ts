import { useEffect, useRef, useState, useCallback } from "react";
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

export const useDeepgramRecognition = () => {
  const [caption, setCaption] = useState<string | undefined>("Powered by Deepgram");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<NodeJS.Timeout | null>(null);
  const keepAliveInterval = useRef<NodeJS.Timeout | null>(null);
  const onTranscriptCallback = useRef<((transcript: string) => void) | null>(null);

  const setOnTranscriptCallback = useCallback((callback: (transcript: string) => void) => {
    onTranscriptCallback.current = callback;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting recording...");
      console.log("Initial state:", { microphone, microphoneState, connectionState });

      if (!microphone) {
        console.log("Setting up microphone...");
        await setupMicrophone();
      }
      
      if (microphoneState === MicrophoneState.Ready) {
        console.log("Connecting to Deepgram...");
        await connectToDeepgram({
          model: "nova-2",
          interim_results: true,
          smart_format: true,
          filler_words: true,
          utterance_end_ms: 3000,
          endpointing: 3000
        });
      }

      // Wait for connection to be ready
      if (connectionState === LiveConnectionState.OPEN) {
        console.log("Starting microphone...");
        startMicrophone();
        setIsRecording(true);
        setTranscript("");
      } else {
        console.log("Connection not open:", connectionState);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  }, [microphone, microphoneState, connectionState, setupMicrophone, connectToDeepgram, startMicrophone]);

  const stopRecording = useCallback(() => {
    try {
      console.log("Stopping recording...");
      stopMicrophone();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }, [stopMicrophone]);

  useEffect(() => {
    if (!microphone || !connection) {
      console.log("Missing requirements:", { microphone: !!microphone, connection: !!connection });
      return;
    }

    console.log("Setting up effect with state:", { 
      connectionState,
      microphoneState,
      isRecording 
    });

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0 && connection) {
        console.log("Sending audio data...");
        connection.send(e.data);
      }
    };

    const onTranscript = (event: LiveTranscriptionEvent) => {
      console.log("Received transcript event:", event);

      if (!event.channel?.alternatives?.[0]) return;

      const { is_final: isFinal, speech_final: speechFinal } = event;
      const thisCaption = event.channel.alternatives[0].transcript;

      if (thisCaption && thisCaption.trim() !== "") {
        console.log("Processing transcript:", { thisCaption, isFinal, speechFinal });
        setCaption(thisCaption);
        
        if (isFinal && speechFinal) {
          console.log("Final transcript received:", thisCaption);
          setTranscript(prev => `${prev} ${thisCaption}`.trim());
          
          if (onTranscriptCallback.current) {
            console.log("Calling transcript callback");
            onTranscriptCallback.current(thisCaption);
          }

          if (captionTimeout.current) {
            clearTimeout(captionTimeout.current);
          }
          captionTimeout.current = setTimeout(() => {
            setCaption(undefined);
          }, 3000);
        }
      }
    };

    // Only set up listeners if we're actually recording
    if (connectionState === LiveConnectionState.OPEN && isRecording) {
      console.log("Adding Deepgram listeners");
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
    }

    return () => {
      console.log("Cleaning up Deepgram listeners");
      if (connection) {
        connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      }
      if (microphone) {
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      }
      if (captionTimeout.current) {
        clearTimeout(captionTimeout.current);
      }
    };
  }, [connection, connectionState, microphone, isRecording]);

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
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    }

    return () => {
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, [microphoneState, connectionState, connection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (captionTimeout.current) {
        clearTimeout(captionTimeout.current);
      }
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, []);

  return { 
    caption, 
    isRecording, 
    startRecording, 
    stopRecording,
    microphoneState,
    connectionState,
    setOnTranscriptCallback
  };
};

export default useDeepgramRecognition;
