import { useContext } from "react";
import Image from "next/image";

import { SidebarContext } from "../context/SidebarContext";

import NewChatEntry from "./NewChatEntry";

const Sidebar = () => {
 const { closeSidebar, isSidebarOpen, isScreenLarge } =
    useContext(SidebarContext);

  return (
    <div
      className={`absolute z-999 top-0 w-[270px] flex flex-col gap-5 transition-all delay-100 bg-[#161819] min-h-screen py-4 ${
        isSidebarOpen ? "right-0" : "right-[-270px]"
      }`}
    >
      <div className="flex gap-4 items-center pl-3 pr-5 justify-between text-white">
        <div className="flex gap-4 items-center">
          <Image width={40} height={40} src="/logo.png" alt="Logo" />
          <span className="text-2xl ">Zeke</span>
        </div>
        <button onClick={closeSidebar}>X</button>
      </div>

      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-3 p-3">
          <NewChatEntry image={"📠"} chatTitle={"Chat with me"} link={"/"} />
          <NewChatEntry
            image={"🌐"} // Added globe emoji for translator
            chatTitle={"Translator"}
            link={"/translator"} // You can change the link as needed
          />
          <NewChatEntry
            image={"🤔"}
            chatTitle={"Dreamscape"}
            link={"/dreamscape"}
          />
          <NewChatEntry image={"⛏"} chatTitle={"Mint"} link={"/mint"} />
          <NewChatEntry
            image={"👪"}
            chatTitle={"Membership"}
            link={"https://hubculture.com/membership"}
          />
          <NewChatEntry
            image={"❔"}
            chatTitle={"About"}
            link={"https://hubculture.com/aboutus"}
          />
          <NewChatEntry
            image={"📱"}
            chatTitle={"Contact"}
            link={"https://hubculture.com/contact"}
          />

          {/* <NewChatEntry
                onClick={toggleTheme}
                image={theme === "light" ? "🌙" : "☀"}
                chatTitle={theme === "light" ? "Dark Mode" : "Light Mode"}
              /> */}
          {/* <NewChatEntry
              image={"📱"}
              chatTitle={"Install Me"}
              link={"/installl"}
            /> */}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
