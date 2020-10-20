import axios from "axios";

const API_URL = "https://reqres.in/api/";

const register = (email, password) => {
  return axios.post(API_URL + "register", {
    email,
    password
  }).then(res => {
    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }

    return res.data;
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then(res => {
      if (res.data.token) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }

      return res.data;
    })
};

const logout = () => {
  localStorage.removeItem("user");
  document.location.href = "/";
};

export default {
  register,
  login,
  logout,
}