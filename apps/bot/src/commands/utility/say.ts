import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, reply, sendChannel } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "say",
  category: "utility",
  description: "Bot kirim pesan",
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Membuat bot mengirimkan pesan teks")
    .addStringOption((option) => option.setName("message").setDescription("Isi pesan yang ingin dikirim").setRequired(true))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Target channel (kosongkan untuk channel saat ini)")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageMessages))) return;

    // Hapus chat asli (Hanya berlaku untuk sistem Prefix)
    if (!isSlash(context)) {
      await context.delete().catch(() => {});
    }

    const targetChannel = (
      isSlash(context) ? context.options.getChannel("channel") : context.mentions.channels.first()
    ) as TextChannel | null;

    if (targetChannel) {
      const msg = isSlash(context) ? context.options.getString("message") : args.slice(1).join(" ");
      if (!msg) {
        if (isSlash(context)) await reply(context, { content: "Pesan tidak boleh kosong!", ephemeral: true });
        return;
      }
      await targetChannel.send(msg);
      if (isSlash(context)) await reply(context, { content: `Pesan sukses terkirim ke ${targetChannel}!`, ephemeral: true });
    } else {
      const msg = isSlash(context) ? context.options.getString("message") : args.join(" ");
      if (!msg) {
        if (isSlash(context)) await reply(context, { content: "Pesan tidak boleh kosong!", ephemeral: true });
        return;
      }
      await sendChannel(context.channel, { content: msg });
      if (isSlash(context)) await reply(context, { content: "Pesan sukses terkirim!", ephemeral: true });
    }
  },
};

export default command;
