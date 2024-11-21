"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const TranscriptDisplay = ({
  transcripts,
  playTranslation,
  isPlayingAudio,
}) => {
  const mainContentRef = useRef(null);

  const handlePlayTranslation = transcript => {
    if (
      !transcript.translated ||
      transcript.translated === "Translating..." ||
      transcript.translated === "Translation failed"
    ) {
      return;
    }

    // Call the playTranslation function with the translated text and target language
    playTranslation(transcript.translated, transcript.targetLanguage);
  };

  useEffect(() => {
    const container = mainContentRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div className="p-2 md:p-0 my-2 md:my-10 w-full justify-center h-[calc(100vh-336px)] md:h-[calc(100%-206px)] max-h-80 overflow-y">
      <div className="relative gradient-border rounded-3xl w-full h-full p-2">
        <div className="pink_gradient"></div>
        <div
          ref={mainContentRef}
          className="w-full max-h-80 backdrop-blur-[4px] bg-white/10 rounded-3xl shadow-card flex p-5 overflow-y-auto main-content"
        >
          {transcripts.length === 0 ? (
            <></>
          ) : (
            <div className="flex flex-col w-full h-full">
              {transcripts.map((transcript, id) => (
                <div key={id}>
                  <div className="w-full border-b border-black/10 group">
                    <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
                      <div className="w-[30px] flex flex-col items-start relative h-[30px] p-1 rounded-sm text-white justify-center">
                        <FaUserCircle fontSize={20} />
                      </div>

                      <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                          <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                            {transcript.original}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-b border-black/10 group">
                    <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
                      <div className="w-[30px] flex flex-col relative items-end">
                        <div className="relative h-[30px] p-1 rounded-sm text-white flex items-center justify-center">
                          <Image
                            width={30}
                            height={30}
                            src="/logo.png"
                            alt="Zeke"
                          />
                        </div>
                      </div>
                      <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                          <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                            <p className="">{transcript.translated}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="blue_gradient"></div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
