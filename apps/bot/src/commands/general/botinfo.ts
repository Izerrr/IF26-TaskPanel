import { EmbedBuilder, SlashCommandBuilder, version } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";
import { BRAND_COLOR } from "../../lib/constants.js";

const command: Command = {
  name: "botinfo",
  description: "Menampilkan informasi teknis dan statistik bot",
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Menampilkan informasi teknis dan statistik bot"),

  async run(client, context) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const embed = new EmbedBuilder()
      .setTitle("ℹ️ Bot Statistics")
      .setColor(BRAND_COLOR)
      .setThumbnail(client.user?.displayAvatarURL() ?? null)
      .addFields(
        { name: "🤖 Bot Name", value: client.user?.username ?? "Unknown", inline: true },
        { name: "🆔 Bot ID", value: client.user?.id ?? "Unknown", inline: true },
        { name: "⏱️ Uptime", value: uptimeString, inline: true },
        { name: "📦 Node.js", value: process.version, inline: true },
        { name: "🛡️ Discord.js", value: `v${version}`, inline: true },
        {
          name: "💾 Memory Usage",
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          inline: true,
        },
        { name: "👥 Total Users", value: `${client.users.cache.size}`, inline: true },
        { name: "🌐 Total Guilds", value: `${client.guilds.cache.size}`, inline: true }
      )
      .setTimestamp();

    await reply(context, { embeds: [embed] });
  },
};

export default command;
