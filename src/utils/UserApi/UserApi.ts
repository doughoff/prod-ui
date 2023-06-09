import { ApiClient } from "../";
const api = ApiClient();

export const getAllUser = async () => {
  try {
    const response = await api.get("/users");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
