import axios from "axios";

export const getToken = () => sessionStorage.getItem("CC_Token");

export const Axios = axios.create({
  baseURL: "http://localhost:8000",
});
