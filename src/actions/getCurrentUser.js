import pool, { schema } from "@/libs/DBConnect";
import getSession from "./getSession";

export const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return null;

    const currentUser = await pool.query(
      `SELECT user_name, rol, email FROM ${schema}.user_hispam WHERE email = $1`,
      [session?.user?.email]
    );

    if (!currentUser) return null;

    return currentUser.rows[0];
  } catch (error) {
    console.log(
      "🚀 ~ file: getCurrentUser.js:20 ~ getCurrentUser ~ error:",
      error
    );
    return null;
  }
};
