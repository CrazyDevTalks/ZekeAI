import { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import getUserDetails from "./utils/getUserDetails";
import Chat from "./component/Chat";

const App = () => {
  const [token, setToken] = useState("");
  const [isMdOrSmaller, setIsMdOrSmaller] = useState(window.innerWidth <= 768);
  const [filteredUserDetails, setFilteredUserDetails] = useState();

  useEffect(() => {
    const handleResize = () => setIsMdOrSmaller(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    const user_token = localStorage.getItem("hubid-api-clients");
    localStorage.setItem("user-details", false);

    const getUserinformation = async () => {
      const userDetailsData = await getUserDetails();
      setFilteredUserDetails(userDetailsData);
    };
    if (user_token) {
      setToken(user_token);
      const user_token = localStorage.getItem("hubid-api-clients");
      localStorage.setItem("user-details", false);

      if (user_token) {
        setToken(user_token);
        getUserinformation();
      } else {
        localStorage.setItem("user-details", false);
        localStorage.setItem("user-details", false);
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <Chat filteredUserDetails={filteredUserDetails} />;
};

export default App;
