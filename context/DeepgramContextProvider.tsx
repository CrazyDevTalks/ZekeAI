"use client";

import {
  createClient,
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";
import { getDeepgramKey } from "../utils/deepgramService";

interface DeepgramContextType {
  connection: LiveClient | null;
  connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: LiveConnectionState;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(
  undefined
);

interface DeepgramContextProviderProps {
  children: ReactNode;
}

const getApiKey = async (): Promise<string> => {
  try {
    const response = await fetch("/api/authenticate", {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.key) {
      throw new Error('No API key received');
    }

    return data.key;
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error;
  }
};

const DeepgramContextProvider: FunctionComponent<DeepgramContextProviderProps> = ({ 
  children 
}) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(
    LiveConnectionState.CLOSED
  );

  const connectToDeepgram = async (options: LiveSchema, endpoint?: string) => {
    try {
      // const key = await getDeepgramKey();
      const key = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
      const deepgram = createClient(key);
      const conn = deepgram.listen.live(options, endpoint);

      conn.addListener(LiveTranscriptionEvents.Open, () => {
        console.log('Connection opened');
        setConnectionState(LiveConnectionState.OPEN);
      });

      conn.addListener(LiveTranscriptionEvents.Close, () => {
        console.log('Connection closed');
        setConnectionState(LiveConnectionState.CLOSED);
      });

      conn.addListener(LiveTranscriptionEvents.Error, (error) => {
        console.error('Deepgram connection error:', error);
        setConnectionState(LiveConnectionState.CLOSED);
      });

      setConnection(conn);
    } catch (error) {
      console.error('Failed to connect to Deepgram:', error);
      setConnectionState(LiveConnectionState.CLOSED);
      throw error;
    }
  };

  const disconnectFromDeepgram = () => {
    if (connection) {
      try {
        connection.finish();
      } catch (error) {
        console.error('Error disconnecting from Deepgram:', error);
      } finally {
        setConnection(null);
        setConnectionState(LiveConnectionState.CLOSED);
      }
    }
  };

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        disconnectFromDeepgram,
        connectionState,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram(): DeepgramContextType {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error(
      "useDeepgram must be used within a DeepgramContextProvider"
    );
  }
  return context;
}

export {
  DeepgramContextProvider,
  useDeepgram,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
};