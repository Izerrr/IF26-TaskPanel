const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "say",
  description: "Bot kirim pesan",
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Membuat bot mengirimkan pesan teks")
    .addStringOption((option) => option.setName("message").setDescription("Isi pesan yang ingin dikirim").setRequired(true))
    .addChannelOption((option) => option.setName("channel").setDescription("Target channel (kosongkan untuk channel saat ini)").addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const member = context.member;
    const channel = context.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return isSlash ? context.reply({ content: "You do not have **MANAGE_MESSAGES** permission!", ephemeral: true }) : channel.send("You do not have **MANAGE_MESSAGES** permission!");
    }

    // Hapus chat asli (Hanya berlaku untuk sistem Prefix)
    if (!isSlash) {
      await context.delete().catch(() => {});
    }

    const textChannel = isSlash ? context.options.getChannel("channel") : context.mentions.channels.first();

    if (textChannel) {
      const msg = isSlash ? context.options.getString("message") : args.slice(1).join(" ");
      if (!msg) {
        if (isSlash) return context.reply({ content: "Pesan tidak boleh kosong!", ephemeral: true });
        return;
      }
      await textChannel.send(msg);
      if (isSlash) await context.reply({ content: `Pesan sukses terkirim ke ${textChannel}!`, ephemeral: true });
    } else {
      const msg = isSlash ? context.options.getString("message") : args.join(" ");
      if (!msg) {
        if (isSlash) return context.reply({ content: "Pesan tidak boleh kosong!", ephemeral: true });
        return;
      }
      await channel.send(msg);
      if (isSlash) await context.reply({ content: "Pesan sukses terkirim!", ephemeral: true });
    }
  },
};
