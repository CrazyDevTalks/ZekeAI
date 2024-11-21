import { createContext, useEffect, useState } from "react";

export const SidebarContext = createContext(null);

function Context({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScreenLarge, setIsScreenLarge] = useState(true);

  useEffect(() => {
    // add a resize listener to update the screen width state
    const handleResize = () => setIsScreenLarge(window.innerWidth <= 1024);

    if (typeof window !== "undefined") {
      setIsScreenLarge(window.innerWidth <= 1024);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScreenLarge && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isScreenLarge]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <SidebarContext.Provider
      value={{ openSidebar, closeSidebar, isSidebarOpen, isScreenLarge }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default Context;
