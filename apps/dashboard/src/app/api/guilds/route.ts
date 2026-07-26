import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // 💡 Sesuai arsitektur authOptions kamu: Ambil JWT token dari cookie
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized", message: "Token missing. Please re-login." }, { status: 401 });
    }

    const accessToken = token.accessToken as string;

    // 1. Fetch User Guilds dari Discord API v10
    const userGuildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userGuildsRes.ok) {
      console.error("[Discord User Guilds Error]:", await userGuildsRes.text());
      return NextResponse.json({ guilds: [] });
    }

    const userGuilds = await userGuildsRes.json();

    // Filter server tempat User punya izin Admin (0x8) atau Manage Guild (0x20)
    const manageableGuilds = userGuilds.filter((g: any) => {
      const perms = BigInt(g.permissions || 0);
      return (perms & BigInt(0x8)) === BigInt(0x8) || (perms & BigInt(0x20)) === BigInt(0x20);
    });

    // 2. Fetch Bot Guilds
    const botGuildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    });

    if (!botGuildsRes.ok) {
      console.error("[Discord Bot Guilds Error]:", await botGuildsRes.text());
      return NextResponse.json({ guilds: [] });
    }

    const botGuilds = await botGuildsRes.json();
    const botGuildIds = new Set(botGuilds.map((g: any) => g.id));

    // 3. Irisan: User Admin DAN Bot IF26 sudah ada di server
    const commonGuilds = manageableGuilds
      .filter((g: any) => botGuildIds.has(g.id))
      .map((g: any) => ({
        id: g.id,
        name: g.name,
        iconUrl: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
      }));

    return NextResponse.json({ guilds: commonGuilds });
  } catch (err) {
    console.error("[GET /api/guilds Internal Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
