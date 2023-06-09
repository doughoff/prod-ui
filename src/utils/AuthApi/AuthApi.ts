import { ApiClient } from "../";
const api = ApiClient();

export const login = async () => {
  try {
    const response = await api.post("/auth/login", {
      email: "admin@hk.com",
      password: "123456",
    });
    localStorage.setItem("sessionID", response.data.session_id);
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("sessionID");
  } catch (error) {
    console.log(error);
  }
};
