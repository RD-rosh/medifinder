import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/`, {
            username: credentials.username,
            password: credentials.password,
          });

          if (res.data) {
            return {
              ...res.data, 
            };
          }
          return null;
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        console.log("Token:", token.accessToken);
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; 
      console.log("session token:", session.accessToken);// Add accessToken to the session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});