import axios, { AxiosInstance } from "axios";

const ApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: "http://127.0.0.1:3088",
  });

  const sessionID = localStorage.getItem("sessionID");
  if (sessionID) {
    api.defaults.headers.common["x-session"] = sessionID;
  }

  return api;
};

export default ApiClient;
