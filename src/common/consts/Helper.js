import { BASE_URL } from "./Config";

const Helper = (url, method, data, isFormData = false) => {
  return fetch(BASE_URL + url, {
    method: method,
    body: isFormData ? data : JSON.stringify(data),
    headers: getHeaders(isFormData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
};

const getHeaders = (isFormData) => {
  if (isFormData) {
    return {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    };
  } else {
    return {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
  }
};

export default Helper;
