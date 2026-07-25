const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "Unmute seorang member",
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Mengembalikan akses bicara seorang member (unmute)")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-unmute").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const txt = "You don't have permission to unmute members.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const targetUser = isSlash ? context.options.getUser("target") : context.mentions.users.first();
    if (!targetUser) {
      const txt = "Please mention a user to unmute.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const memberTarget = guild.members.cache.get(targetUser.id);
    if (!memberTarget) {
      const txt = "Can't find that member!";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const mainRole = guild.roles.cache.find((role) => role.name === "Visitor");
    const muteRole = guild.roles.cache.find((role) => role.name === "Inmate");

    if (!mainRole || !muteRole) {
      const txt = "Required roles (Visitor / Inmate) not found.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    if (!memberTarget.roles.cache.has(muteRole.id)) {
      const txt = `${targetUser.username} is not muted.`;
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    await memberTarget.roles.remove(muteRole.id);
    await memberTarget.roles.add(mainRole.id);

    const successTxt = `✅ <@${memberTarget.user.id}> has been unmuted.`;
    if (isSlash) {
      await context.reply({ content: successTxt });
    } else {
      await channel.send(successTxt);
    }
  },
};
