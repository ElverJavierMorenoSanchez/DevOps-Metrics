import axios from "axios";

const getUsers = async () => {
  try {
    const users = await axios.get("/api/register");
    return users.data;
  } catch (error) {
    console.log("🚀 ~ getUsers ~ error:", error);
    return [];
  }
};

export default getUsers;
