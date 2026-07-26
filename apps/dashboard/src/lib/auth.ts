import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@if26/database";

// `identify` = basic profile. `guilds` = lets us list the servers the user
// is in via Discord's REST API, so the dashboard can offer a guild switcher
// without needing the bot to be a member of every guild up front.
const DISCORD_SCOPES = "identify guilds";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: DISCORD_SCOPES } },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only present on the initial sign-in request, not on every session read.
      if (account && profile) {
        token.discordId = account.providerAccountId;
        token.accessToken = account.access_token;

        // Keep our User table in sync with Discord's profile on every login.
        // RULES.md #3 style state sync — dashboard and bot read the same table.
        await prisma.user.upsert({
          where: { id: account.providerAccountId },
          create: {
            id: account.providerAccountId,
            username: (profile as { username?: string }).username ?? "unknown",
            avatar: (profile as { image_url?: string }).image_url ?? null,
          },
          update: {
            username: (profile as { username?: string }).username ?? "unknown",
            avatar: (profile as { image_url?: string }).image_url ?? null,
          },
        });
      }
      return token;
    },
    async session({ session, token }) {
      // NOTE: accessToken is deliberately NOT attached here — this object is
      // sent to the browser via useSession()/getSession(). Server-only code
      // that needs the Discord access token (e.g. the /api/guilds route)
      // reads it with getToken() from next-auth/jwt instead.
      if (session.user) {
        session.user.id = token.discordId as string;
      }
      return session;
    },
  },
};
