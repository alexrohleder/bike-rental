import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export default NextAuth({
  // Use the Prisma adapter to store user data in the database so we can manage
  // user accounts and their permissions.
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Use the JWT strategy for storying user sessions. This is required for
  // the Next.js' middleware for authentication to work.
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Append the user's role to the user object in the JWT payload. This is
    // used to avoid database roundtrips and specially for it to work on the
    // Next.js' middleware for authentication.
    async jwt({ token }) {
      if (typeof token.role === "undefined") {
        const user = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        });

        if (user) {
          token.role = user.role;
        }
      }

      return token;
    },

    // Append the user's role to the user object in the session. This is used
    // by the front-end exclusively.
    async session({ session, token }) {
      session.user.role = (token.role as UserRole) ?? UserRole.USER_ROLE_CLIENT;

      return session;
    },
  },
});
