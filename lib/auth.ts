import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const isProduction = process.env.NODE_ENV === "production";

/**
 * NextAuth config.
 * Security: NEXTAUTH_SECRET must be set in env (strong random string). In production use NEXTAUTH_URL over HTTPS and useSecureCookies.
 * Session: Uses JWT strategy. Cookie is httpOnly, sameSite=lax, secure in production. Session duration follows NextAuth default unless overridden.
 */

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        (session.user as { username?: string }).username =
          session.user.name ?? session.user.email ?? token.sub ?? "";
      }
      return session;
    },
  },
  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: isProduction,
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
};
