const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "nickname",
  aliases: ["nick"],
  description: "Ganti nickname seorang member",
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Mengubah nama panggilan (nickname) seorang member server")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin diganti namanya").setRequired(true))
    .addStringOption((option) => option.setName("name").setDescription("Nickname baru").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      const txt = "You don't have permission to change nicknames.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const targetMember = isSlash ? context.options.getMember("target") : guild.members.cache.get(context.mentions.users.first()?.id) || guild.members.cache.get(args[0]);
    if (!targetMember) {
      const txt = "Please mention a user or provide a valid ID.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const newNick = isSlash ? context.options.getString("name") : args.slice(1).join(" ");
    if (!newNick) {
      const txt = "Please provide a new nickname.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    if (!targetMember.manageable) {
      const txt = "I can't change this member's nickname (role hierarchy issue).";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    await targetMember.setNickname(newNick).catch(() => {
      const txt = "Failed to change nickname.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    });

    const successTxt = `✅ Changed **${targetMember.user.tag}**'s nickname to **${newNick}**`;
    if (isSlash) {
      await context.reply({ content: successTxt });
    } else {
      await channel.send(successTxt);
    }
  },
};
