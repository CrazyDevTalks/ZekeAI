import Image from "next/image";

import { FaUserCircle } from "react-icons/fa";

const Chat = ({ requestMessage, responseMessage }) => {
  return (
    <>
      <div className="w-full border-b border-black/10 group">
        <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
          <div className="w-[30px] flex flex-col items-start relative h-[30px] p-1 rounded-sm text-white justify-center">
            <FaUserCircle fontSize={20} />
          </div>

          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                {requestMessage}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-b border-black/10 group">
        <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
          <div className="w-[30px] flex flex-col relative items-end">
            <div className="relative h-[30px] p-1 rounded-sm text-white flex items-center justify-center">
              <Image width={30} height={30} src="/logo.png" alt="Zeke" />
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                <p className="">{responseMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
