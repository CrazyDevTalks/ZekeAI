import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import CrossImg from "../assets/cross.png";
import VenImg from "../assets/ven2.png";
import GroupImg from "../assets/group_icon.png";
import { LogoImg } from "../utils/const";
import handleSendMessage from "../utils/userMessage";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

const Chat = ({ filteredUserDetails }) => {
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [isMdOrSmaller, setIsMdOrSmaller] = useState(window.innerWidth <= 768);
  const [userDetails, setUserDetails] = useState({});
  const [hubCultureCom, setHubCultureCom] = useState();
  const [hubUserData, setHubUserData] = useState();
  const [messages, setMessages] = useState([
    {
      message: "Hello, my name is Zeke, how can I help you?",
      direction: "incoming",
      id: -1,
    },
  ]);

  useEffect(() => {
    const getCookieData = () => {
      return Cookies.get("hubculturecom");
    };
    const cookieData = getCookieData();
    setHubCultureCom(cookieData);
    if (hubUserData && cookieData) {
      setUserDetails(hubUserData.data);
      setMessages([
        {
          message: `Hello ${hubUserData.data.name}, my name is Zeke, how can I help you? \n \nHere are a few quick links.`,
          direction: "incoming",
          id: 0,
        },
      ]);
    }
  }, [hubUserData]);

  useEffect(() => {
    setHubUserData(filteredUserDetails ? filteredUserDetails : null);
  }, [filteredUserDetails]);

  const handleChatWidgetOpener = () => {
    setIsChatBoxOpen(!isChatBoxOpen);
  };

  const handleNewUserMessage = async (textContent) => {
    setMessages((prev) => [
      ...prev,
      {
        message: textContent,
        direction: "outgoing",
        id: uuidv4(),
      },
    ]);

    try {
      const data = await handleSendMessage(textContent);

      if (data)
        setMessages((prev) => [
          ...prev,
          {
            message: data.message?.trim(),
            direction: "incoming",
            id: uuidv4(),
          },
        ]);
    } catch (error) {}
  };

  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        right: isMdOrSmaller && isChatBoxOpen ? 0 : "20px",
        bottom: isMdOrSmaller && isChatBoxOpen ? 0 : "20px",
        flexDirection: "column",
        justifyContent: isChatBoxOpen ? "space-between" : "flex-end",
        width:
          isMdOrSmaller && isChatBoxOpen
            ? "100%"
            : !isMdOrSmaller && isChatBoxOpen
            ? "370px"
            : "",
        height:
          isMdOrSmaller && isChatBoxOpen
            ? "100%"
            : !isMdOrSmaller && isChatBoxOpen
            ? "500px"
            : "",
        zIndex: "990",
        gap: "10px",
      }}
    >
      {isChatBoxOpen && (
        <MainContainer
          style={{
            opacity: "1",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: "opacity 0.2s ease 0s",
            fontSize: "16px",
          }}
        >
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Content userName="Zeke" />
              <ConversationHeader.Actions>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsChatBoxOpen(false)}
                >
                  <img style={{ width: "20px" }} src={CrossImg} alt="Close" />
                </div>
              </ConversationHeader.Actions>
            </ConversationHeader>

            <MessageList
              typingIndicator={
                typingIndicator && <TypingIndicator content="Zeke is typing" />
              }
            >
              {messages?.map((msg) => {
                return (
                  <Message
                    key={msg?.id}
                    model={{
                      message: `${msg?.message}`,
                      direction: `${msg?.direction}`,
                    }}
                  >
                    {msg?.id === 0 && (
                      <Message.CustomContent>
                        <p>{msg?.message}</p>
                        <Button
                          color="success"
                          size="small"
                          sx={{
                            borderRadius: "100px",
                            color: "#44a87a",
                            borderColor: "#44a87a",
                          }}
                          variant="outlined"
                          onClick={() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                message: `What is my Ven Balance ?`,
                                direction: "outgoing",
                                id: uuidv4(),
                              },
                            ]);
                            setTypingIndicator(true);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  message: `Your Ven Balance is $${userDetails.ven_balance.balance} `,
                                  direction: "incoming",
                                  id: uuidv4(),
                                },
                              ]);
                              setTypingIndicator(false);
                            }, 1000);
                          }}
                        >
                          {" "}
                          <img
                            style={{ width: "15px", height: "15px" }}
                            src={VenImg}
                            alt="Balance"
                          />{" "}
                          Balance
                        </Button>
                        <Button
                          color="success"
                          size="small"
                          sx={{
                            marginLeft: "2px",
                            borderRadius: "100px",
                            color: "#44a87a",
                            borderColor: "#44a87a",
                          }}
                          variant="outlined"
                          onClick={() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                message: `Show me all my memberships.`,
                                direction: "outgoing",
                                id: uuidv4(),
                              },
                            ]);
                            setTypingIndicator(true);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev,
                                {
                                  message: `Your memberships \n \n${userDetails.memberships.join(
                                    "\r\n"
                                  )} `,
                                  direction: "incoming",
                                  id: uuidv4(),
                                },
                              ]);
                              setTypingIndicator(false);
                            }, 1000);
                          }}
                        >
                          {" "}
                          <img
                            style={{ width: "15px", height: "15px" }}
                            src={GroupImg}
                            alt="Balance"
                          />{" "}
                          Groups
                        </Button>
                      </Message.CustomContent>
                    )}
                    {msg?.direction === "incoming" && (
                      <Avatar src={LogoImg} name="Zeke" />
                    )}
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput
              attachButton={false}
              placeholder="Type message here"
              onSend={handleNewUserMessage}
              autoFocus
            />
          </ChatContainer>
        </MainContainer>
      )}

      {isMdOrSmaller && isChatBoxOpen ? (
        <></>
      ) : (
        <button
          onClick={() => handleChatWidgetOpener()}
          style={{
            border: "none",
            outline: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            boxShadow: "rgb(181, 181, 181) 0px 2px 10px 1px",
            height: "100%",
            width: "100%",
            // backgroundImage: `url(${require("./assets/chat.png")})`,
            // backgroundSize: "contain",
            backgroundColor: "rgb(53, 204, 230)",
            cursor: "pointer",
            alignSelf: "flex-end",

            maxHeight: "60px",
            maxWidth: "60px",
            overflow: "hidden",
            padding: 0,
          }}
        >
          <img
            style={{ overflow: "hidden", height: "100%", width: "100%" }}
            src={LogoImg}
            alt="Chat"
          />
        </button>
      )}
    </div>
  );
};

export default Chat;
