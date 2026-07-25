const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "clear",
  aliases: ["purge", "nuke"],
  category: "moderation",
  description: "Clear/hapus pesan di channel",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear/hapus pesan di channel")
    .addIntegerOption((option) => option.setName("amount").setDescription("Jumlah pesan yang ingin dihapus (1-100)").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Otomatis mengunci slash command hanya untuk admin

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const channel = context.channel;
    const member = context.member;

    // 1. Cek Permission User (Wajib untuk jalur Prefix)
    if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const msg = "You can't delete messages....";
      return isSlash ? context.reply({ content: msg, ephemeral: true }) : context.reply(msg);
    }

    // 2. Ambil Input Jumlah Pesan (Hybrid)
    const amountInput = isSlash ? context.options.getInteger("amount") : parseInt(args[0]);

    if (isNaN(amountInput) || amountInput <= 0) {
      const msg = "Yeah.... That's not a valid number.";
      return isSlash ? context.reply({ content: msg, ephemeral: true }) : context.reply(msg);
    }

    // 3. Cek Permission Bot
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const msg = "Sorryy... I can't delete messages.";
      return isSlash ? context.reply({ content: msg, ephemeral: true }) : context.reply(msg);
    }

    const deleteAmount = Math.min(amountInput, 100);

    // Hapus pesan perintah asli (hanya untuk jalur Prefix, karena Slash tidak ada pesan teksnya)
    if (!isSlash) {
      await context.delete().catch(() => {});
    }

    // 4. Eksekusi Bulk Delete
    try {
      const deleted = await channel.bulkDelete(deleteAmount, true);
      const replyMsg = `I deleted \`${deleted.size}\` messages.`;

      if (isSlash) {
        await context.reply({ content: replyMsg });
      } else {
        await channel.send(replyMsg);
      }
    } catch (err) {
      const errMsg = `Something went wrong... ${err}`;
      if (isSlash) {
        await context.reply({ content: errMsg, ephemeral: true });
      } else {
        await channel.send(errMsg);
      }
    }
  },
};
