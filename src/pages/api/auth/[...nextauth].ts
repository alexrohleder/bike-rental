import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use the Prisma adapter to store user data in the database so we can manage
  // user accounts and their permissions.
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
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
          token.id = user.id;
          token.role = user.role;
        }
      }

      return token;
    },

    // Append the user's role to the user object in the session. This is used
    // by the front-end exclusively.
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as UserRole) ?? UserRole.USER_ROLE_CLIENT;

      return session;
    },
  },
};

export default NextAuth(authOptions);
