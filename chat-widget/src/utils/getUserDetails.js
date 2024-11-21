import {
  UserDetails_API,
  fieldsToRemoveFromHubuserData,
  removeFieldsFromHubuserData,
} from "./const";

const getUserDetails = async () => {
  const has_user_details = localStorage.getItem("user-details");
  if (has_user_details === "false") {
    try {
      const user_token = localStorage.getItem("hubid-api-clients");

      let Items = await fetch(UserDetails_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Private-Key": "private_5d265de1d9204f6235830ce2",
          Authorization: `Bearer ${user_token}`,
        },
      });
      const hubUserData = await Items.json();

      const filteredHubUserData = removeFieldsFromHubuserData(
        hubUserData,
        fieldsToRemoveFromHubuserData
      );

      localStorage.setItem("hubUserData", JSON.stringify(filteredHubUserData));
      return filteredHubUserData;
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Already has user details");
  }
};

export default getUserDetails;
