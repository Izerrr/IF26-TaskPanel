const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "dm",
  description: "Mengirimkan pesan langsung (DM) ke user tertentu lewat bot",
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Mengirimkan pesan langsung (DM) ke user tertentu")
    .addUserOption((option) => option.setName("target").setDescription("User target").setRequired(true))
    .addStringOption((option) => option.setName("pesan").setDescription("Isi pesan yang ingin dikirim").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const member = context.member;

    if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const noPerm = "❌ Anda tidak memiliki izin untuk menggunakan perintah ini.";
      return isSlash ? context.reply({ content: noPerm, ephemeral: true }) : channel.send(noPerm);
    }

    const targetUser = isSlash ? context.options.getUser("target") : context.mentions.users.first() || client.users.cache.get(args[0]);
    const messageContent = isSlash ? context.options.getString("pesan") : args.slice(1).join(" ");

    if (!targetUser) {
      const noUser = "❌ User tidak ditemukan. Berikan mention atau ID yang valid.";
      return isSlash ? context.reply({ content: noUser, ephemeral: true }) : channel.send(noUser);
    }
    if (!messageContent) {
      const noMsg = "❌ Mohon tulis isi pesan yang ingin dikirim.";
      return isSlash ? context.reply({ content: noMsg, ephemeral: true }) : channel.send(noMsg);
    }

    try {
      await targetUser.send(messageContent);
      const successText = `✅ Sukses mengirimkan DM ke **${targetUser.tag}**.`;
      if (isSlash) await context.reply({ content: successText, ephemeral: true });
      else await channel.send(successText);
    } catch (err) {
      const failText = `❌ Gagal mengirimkan DM ke ${targetUser.tag} (Mungkin DM mereka ditutup).`;
      if (isSlash) await context.reply({ content: failText, ephemeral: true });
      else await channel.send(failText);
    }
  },
};
