import axios from "axios";
import {
  UserDetails_API,
  UserMessage_API,
  fieldsToRemoveFromHubuserData,
  getUserId,
  removeFieldsFromHubuserData,
  user_Data,
} from "./const";
import Cookies from "js-cookie";

const handleSendMessage = async (textContent) => {
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

  try {
    const getCookieData = () => {
      return Cookies.get("hubculturecom");
    };
    const hubculturecom = getCookieData();

    let hubUserData = JSON.parse(localStorage.getItem("hubUserData"));
    let user_Id;

    if (hubculturecom) {
      Cookies.remove("zekeGuestUser");
      user_Id = getUserId(hubculturecom);
      user_Id = Number(user_Id);

      if (hubUserData?.data?.id !== user_Id) {
        const user_token = localStorage.getItem("hubid-api-clients");

        const data = await fetch(UserDetails_API, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Private-Key": "private_5d265de1d9204f6235830ce2",
            Authorization: `Bearer ${user_token}`,
          },
        });
        const updatedHubUserData = await data.json();

        const filteredHubUserData = removeFieldsFromHubuserData(
          updatedHubUserData,
          fieldsToRemoveFromHubuserData
        );

        // Update local storage data
        localStorage.setItem(
          "hubUserData",
          JSON.stringify(filteredHubUserData)
        );
      }
    }

    var ZekeSession = getCookie("zekeGuestUser");
    if (!ZekeSession) {
      ZekeSession = generateZekeSession(24);
      if (!hubculturecom) {
        setCookie("zekeGuestUser", ZekeSession);
      }
    }

    var apiHeaders = new Headers();

    apiHeaders.append("Content-Type", "application/json");
    apiHeaders.append(
      "Authorization",
      "Bearer e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );

    hubUserData = localStorage.getItem("hubUserData");
    var zekePayload = JSON.stringify({
      id: user_Id ? `${user_Id}` : `${ZekeSession}`,
      user_type: hubculturecom ? "user" : "guest",
      message: textContent,
      data: user_Id ? { hubUserData } : {},
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
    return data;
  } catch (e) {
    console.log(e);
  }
};

export default handleSendMessage;
