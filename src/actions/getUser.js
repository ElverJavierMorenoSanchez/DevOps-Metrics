import axios from "axios";

export const getUser = async (email) => {
  try {
    const user = await axios.get(`/api/register/${email}`);
    return user.data;
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error);
    return null;
  }
};
