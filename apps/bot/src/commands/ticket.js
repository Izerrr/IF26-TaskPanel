const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  name: "ticket",
  description: "Membuat channel bantuan / tiket baru",
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Membuat channel bantuan / tiket baru")
    .addStringOption((option) => option.setName("alasan").setDescription("Alasan membuat tiket").setRequired(false)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const channel = context.channel;
    const member = context.member;
    const user = isSlash ? context.user : context.author;

    const reason = (isSlash ? context.options.getString("alasan") : args.join(" ")) || "Tidak ada alasan spesifik";

    if (isSlash) await context.deferReply({ ephemeral: true });

    try {
      const ticketChannel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ],
      });

      const embed = new EmbedBuilder().setTitle("🎟️ Tiket Bantuan Dibuat").setDescription(`Halo ${user}, staf akan segera membantumu di sini.`).addFields({ name: "Alasan", value: reason }).setColor("#A9908A").setTimestamp();

      await ticketChannel.send({ embeds: [embed] });

      const replyMsg = `✅ Tiket kamu berhasil dibuat di ${ticketChannel}`;
      if (isSlash) await context.editReply({ content: replyMsg });
      else await channel.send(replyMsg);
    } catch (err) {
      console.error(err);
      const errMsg = "❌ Gagal membuat channel tiket. Pastikan bot punya izin administrator/manage channels.";
      if (isSlash) await context.editReply({ content: errMsg });
      else await channel.send(errMsg);
    }
  },
};
