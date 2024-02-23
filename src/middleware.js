import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "http://20.90.147.49:3000",
  },
});

export const config = {
  matcher: ["/devops/forms/:path*", "/settings/:path*"],
};
