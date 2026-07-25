import { ChannelType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply, sendChannel } from "../../lib/context.js";
import { BRAND_COLOR } from "../../lib/constants.js";

const command: Command = {
  name: "ticket",
  category: "utility",
  description: "Membuat channel bantuan / tiket baru",
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Membuat channel bantuan / tiket baru")
    .addStringOption((option) => option.setName("alasan").setDescription("Alasan membuat tiket").setRequired(false)),

  async run(client, context, args) {
    const guild = context.guild;
    if (!guild || !client.user) return;

    const user = getAuthor(context);
    const reason = (isSlash(context) ? context.options.getString("alasan") : args.join(" ")) || "Tidak ada alasan spesifik";

    if (isSlash(context)) await context.deferReply({ ephemeral: true });

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

      const embed = new EmbedBuilder()
        .setTitle("🎟️ Tiket Bantuan Dibuat")
        .setDescription(`Halo ${user}, staf akan segera membantumu di sini.`)
        .addFields({ name: "Alasan", value: reason })
        .setColor(BRAND_COLOR)
        .setTimestamp();

      await ticketChannel.send({ embeds: [embed] });

      const replyMsg = `✅ Tiket kamu berhasil dibuat di ${ticketChannel}`;
      if (isSlash(context)) await context.editReply({ content: replyMsg });
      else await sendChannel(context.channel, { content: replyMsg });
    } catch (err) {
      console.error(err);
      const errMsg = "❌ Gagal membuat channel tiket. Pastikan bot punya izin administrator/manage channels.";
      if (isSlash(context)) await context.editReply({ content: errMsg });
      else await sendChannel(context.channel, { content: errMsg });
    }
  },
};

export default command;
