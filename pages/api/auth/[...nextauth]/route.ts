import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "GOOGLE_CLIENT_ID_REMOVED",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "GOOGLE_CLIENT_SECRET_REMOVED",
    }),
  ],
});

export { handler as GET, handler as POST };