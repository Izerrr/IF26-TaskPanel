const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../handlers/jsonStore");

module.exports = {
  name: "deletewarns",
  description: "Hapus semua warnings seorang member",
  data: new SlashCommandBuilder()
    .setName("deletewarns")
    .setDescription("Menghapus total riwayat seluruh pelanggaran (warnings) seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin dibersihkan warning-nya").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const txt = "You can't use that.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const userTarget = isSlash ? context.options.getUser("target") : context.mentions.users.first() || (await client.users.fetch(args[0]).catch(() => null));
    if (!userTarget) {
      const txt = "Please specify a user via mention or ID";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }
    if (userTarget.bot) {
      const txt = "You can't manage bot warnings";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }
    if (userTarget.id === author.id) {
      const txt = "You can't clear your own warnings";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const key = `warnings_${guild.id}_${userTarget.id}`;
    const warnings = db.get(key);
    if (!warnings || warnings.length === 0) {
      const txt = `**${userTarget.username} has no warnings**`;
      return isSlash ? context.reply({ content: txt }) : channel.send(txt);
    }

    db.delete(key);
    const successTxt = `✅ Cleared all warnings for **${userTarget.username}**`;
    if (isSlash) {
      await context.reply({ content: successTxt });
    } else {
      await channel.send(successTxt);
    }
  },
};
