export const LogoImg = "https://developers.hubculture.com/chat-zeke/logo.png";

export const UserDetails_API = `https://id.hubculture.com/user`;

export const UserMessage_API = "https://api.zeke.ai/chat";

// Getting user Id from hubculturecom
export const getUserId = (inputString) => {
  const match = inputString.match(/^(\d+)/);
  const extractedInteger = match ? parseInt(match[1], 10) : null;
  return extractedInteger;
};

// Filter hubUserData
export const removeFieldsFromHubuserData = (obj, fieldsToRemove) => {
  const newData = { ...obj.data };

  fieldsToRemove.forEach((field) => {
    delete newData[field];
  });

  return { ...obj, data: newData };
};

// Fields to filter from hubUserData
export const fieldsToRemoveFromHubuserData = [
  "secondary_personas",
  "user_event_status",
  "profile",
  "hubColors",
];
