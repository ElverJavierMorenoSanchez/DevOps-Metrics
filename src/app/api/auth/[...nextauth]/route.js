import pool from "@/libs/DBConnect";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        const query = `
        SELECT *
        FROM "user_hispam"
        WHERE "email" = $1;
        `;

        const result = await pool.query(query, [credentials?.email]);

        const user = result?.rows[0];

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        console.log(credentials.password, user.hashedPassword);

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        console.log(isCorrectPassword);

        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
