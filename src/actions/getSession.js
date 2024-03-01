import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Retrieves the session from the server.
 * @returns {Promise} A promise that resolves with the session data.
 */
export default async function getSession() {
  return await getServerSession(authOptions);
}
