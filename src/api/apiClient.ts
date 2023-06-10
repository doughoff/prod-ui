import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:3088",
});

export function initializeApi() {
  const sessionID = localStorage.getItem("sessionID");

  if (sessionID) {
    api.defaults.headers.common["x-session"] = sessionID;
    console.log("loop infinitio");
  }
}
