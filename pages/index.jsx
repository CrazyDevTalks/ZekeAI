import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Hero from "../components/Hero";
import Form from "../components/Form";
import Chat from "../components/Chat";

export default function Homepage() {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState("");
  const [chatId, setChatId] = useState("");
  const [userId, setUserId] = useState("");
  const mainContentRef = useRef(null);

  useEffect(() => {
    setUserId(localStorage.getItem("hubid-api-clients"));
  }, []);

  useEffect(() => {
    const container = mainContentRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatList]);

  useEffect(() => {
    if (gptResponse !== "") {
      const newState = chatList.map((obj) => {
        if (obj.id === chatId) {
          return { ...obj, answer: gptResponse };
        }

        return obj;
      });

      setChatList(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gptResponse]);

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays = 30) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function generateZekeSession(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const generateResponse = async (question) => {
    if (!question || loading) return;

    setGptResponse("");
    setChatId("");

    const id = uuidv4();
    setChatId(id);

    setLoading(true);
    setGptResponse("Zeke is answering...");
    setChatList([...chatList, { id, question, answer: "" }]);

    try {
      var ZekeSession = getCookie("zekeGuestUser");
      if (!ZekeSession) {
        ZekeSession = generateZekeSession(24);
        setCookie("zekeGuestUser", ZekeSession);
      }

      var apiHeaders = new Headers();

      apiHeaders.append("Content-Type", "application/json");
      apiHeaders.append(
        "Authorization",
        "Bearer e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      );

      var zekePayload = JSON.stringify({
        id: ZekeSession,
        user_type: userId ? "user" : "guest",
        message: question,
        data: {},
      });

      var zekeRequestOptions = {
        method: "POST",
        headers: apiHeaders,
        body: zekePayload,
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.zeke.ai/chat`,
        zekeRequestOptions
      );

      const data = await response.json();

      if (!data) return;

      setGptResponse(data.message?.trim());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col h-[calc(100%-72px)] md:h-[calc(100%-78px)] justify-start">
      <Hero />
      <div className={`flex h-[calc(100%-216px)] flex-col`}>
        {chatList.length > 0 && (
          <div className="p-2 md:p-0 my-2 md:my-10 w-full justify-center h-[calc(100vh-336px)] md:h-[calc(100%-206px)]">
            <div className="relative gradient-border rounded-3xl w-full h-full p-2">
              <div className="pink_gradient"></div>
              <div
                ref={mainContentRef}
                className="w-full h-full backdrop-blur-[4px] bg-white/10 rounded-3xl shadow-card flex p-5 overflow-y-auto main-content"
              >
                {chatList.length === 0 ? (
                  <></>
                ) : (
                  <div className="flex flex-col w-full h-full">
                    {chatList.map((chat) => (
                      <Chat
                        key={chat.id}
                        requestMessage={chat.question}
                        responseMessage={chat.answer}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="blue_gradient"></div>
            </div>
          </div>
        )}

        <Form generateResponse={generateResponse} />
      </div>
    </div>
  );
}
