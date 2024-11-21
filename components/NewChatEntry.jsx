import Link from "next/link";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";

const classNames =
  "flex p-3 items-center rounded-md hover:bg-gray-500/10 hover:text-white transition-colors duration-200 text-white cursor-pointer text-sm flex-shrink-0 border border-white/20 bg-black focus:no-underline focus:text-white";

const NewChatEntry = ({ link, image, chatTitle, onClick }) => {
  const { closeSidebar, isSidebarOpen } = useContext(SidebarContext);

  return link ? (
    <Link
      onClick={isSidebarOpen && closeSidebar}
      target={link[0] === "/" ? "_self" : "_blank"}
      href={`${link}`}
      className={`${classNames} gap-3`}
    >
      <span>{image}</span>
      <p className="overflow-hidden">{chatTitle}</p>
    </Link>
  ) : (
    <button
      onClick={() => {
        isSidebarOpen && closeSidebar();
        onClick();
      }}
      className={`${classNames} ${chatTitle ? "gap-3" : ""}`}
    >
      <span>{image}</span>
      <p className="overflow-hidden">{chatTitle}</p>
    </button>
  );
};
export default NewChatEntry;
