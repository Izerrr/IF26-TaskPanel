const { EmbedBuilder, SlashCommandBuilder, version } = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "Menampilkan informasi teknis dan statistik bot",
  data: new SlashCommandBuilder().setName("botinfo").setDescription("Menampilkan informasi teknis dan statistik bot"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;

    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const embed = new EmbedBuilder()
      .setTitle("ℹ️ Bot Statistics")
      .setColor("#A9908A")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: "🤖 Bot Name", value: client.user.username, inline: true },
        { name: "🆔 Bot ID", value: client.user.id, inline: true },
        { name: "⏱️ Uptime", value: uptimeString, inline: true },
        { name: "📦 Node.js", value: process.version, inline: true },
        { name: "🛡️ Discord.js", value: `v${version}`, inline: true },
        { name: "💾 Memory Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: "👥 Total Users", value: `${client.users.cache.size}`, inline: true },
        { name: "🌐 Total Guilds", value: `${client.guilds.cache.size}`, inline: true },
      )
      .setTimestamp();

    if (isSlash) await context.reply({ embeds: [embed] });
    else await channel.send({ embeds: [embed] });
  },
};
