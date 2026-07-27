import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { KyselyAdapter } from "@auth/kysely-adapter";
import { db } from "./kysely";
import { validateCredentials } from "@/entities/user/lib/validateCredentials";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_ID");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_SECRET");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: KyselyAdapter(db as any),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        return await validateCredentials(
          credentials.email as string,
          credentials.password as string,
        );
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
