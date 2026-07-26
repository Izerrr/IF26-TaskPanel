import { prisma } from "@if26/database";

interface DiscordGuildMember {
  user: { id: string; username: string; avatar: string | null };
  nick: string | null;
}

/**
 * Pulls the member list for a guild using the BOT's token (not the
 * signed-in user's) — the user's OAuth token only has `guilds` scope,
 * which doesn't include member lists. The bot is already in every guild
 * this dashboard manages, so its token has that access.
 */
export async function fetchGuildMembers(guildId: string): Promise<DiscordGuildMember[]> {
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members?limit=1000`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
  });

  if (!res.ok) return [];
  return (await res.json()) as DiscordGuildMember[];
}

/** Upserts every fetched member into our User table so tasks can be assigned to them. */
export async function syncGuildMembers(guildId: string): Promise<DiscordGuildMember[]> {
  const members = await fetchGuildMembers(guildId);

  await Promise.all(
    members
      .filter((m) => !!m.user)
      .map((m) =>
        prisma.user.upsert({
          where: { id: m.user.id },
          create: {
            id: m.user.id,
            username: m.nick ?? m.user.username,
            avatar: m.user.avatar
              ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png`
              : null,
          },
          update: {
            username: m.nick ?? m.user.username,
            avatar: m.user.avatar
              ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png`
              : null,
          },
        })
      )
  );

  return members;
}
