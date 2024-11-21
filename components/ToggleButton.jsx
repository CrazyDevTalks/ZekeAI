"use client";

// import { Mic, Loader2 } from "lucide-react";

const ToggleButton = ({
  isRecording,
  isProcessing,
  onClick,
  isSpeechRecognitionSupported,
}) => (
  <div className="flex justify-center">
    <button
      className="flex p-3 items-center rounded-md hover:bg-gray-500/10 hover:text-white transition-colors duration-200 text-white cursor-pointer text-sm flex-shrink-0 border border-white/20 bg-black focus:no-underline focus:text-white"
      onClick={onClick}
      disabled={isProcessing || !isSpeechRecognitionSupported}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      title={
        isSpeechRecognitionSupported
          ? "Click to start/stop recording"
          : "Speech recognition not supported"
      }
    >
      {isProcessing ? (
        <span>Loading...</span>
      ) : (
        <div className="flex gap-3">
          📠
          <span>{isRecording ? "Recording" : "Record"}</span>
        </div>
      )}
    </button>
  </div>
);

export default ToggleButton;
