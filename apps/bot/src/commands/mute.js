const ms = require("ms");
const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "mute",
  description: "Mute seorang member",
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-mute").setRequired(true))
    .addStringOption((option) => option.setName("duration").setDescription("Durasi mute (Contoh: 1h, 30m, 10s)").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return isSlash ? context.reply({ content: "You don't have permission to mute members.", ephemeral: true }) : channel.send("You don't have permission to mute members.");
    }

    const targetUser = isSlash ? context.options.getUser("target") : context.mentions.users.first();
    if (!targetUser) {
      return isSlash ? context.reply({ content: "Please specify a user to mute.", ephemeral: true }) : channel.send("Please mention a user to mute.");
    }

    const memberTarget = guild.members.cache.get(targetUser.id);
    if (!memberTarget) {
      return isSlash ? context.reply({ content: "Can't find that member!", ephemeral: true }) : channel.send("Can't find that member!");
    }

    const mainRole = guild.roles.cache.find((role) => role.name === "Visitor");
    const muteRole = guild.roles.cache.find((role) => role.name === "Inmate");

    if (!mainRole || !muteRole) {
      return isSlash ? context.reply({ content: "Required roles (Visitor / Inmate) not found. Please set them up first.", ephemeral: true }) : channel.send("Required roles (Visitor / Inmate) not found. Please set them up first.");
    }

    await memberTarget.roles.remove(mainRole.id);
    await memberTarget.roles.add(muteRole.id);

    const durationInput = isSlash ? context.options.getString("duration") : args[1];

    if (!durationInput) {
      const replyText = `<@${memberTarget.user.id}> has been muted`;
      return isSlash ? context.reply({ content: replyText }) : channel.send(replyText);
    }

    const duration = ms(durationInput);
    if (!duration) {
      return isSlash ? context.reply({ content: "Invalid time format. Example: `1h`, `30m`, `10s`", ephemeral: true }) : channel.send("Invalid time format. Example: `1h`, `30m`, `10s`");
    }

    const timedReply = `<@${memberTarget.user.id}> has been muted for **${ms(duration)}**`;
    if (isSlash) await context.reply({ content: timedReply });
    else channel.send(timedReply);

    setTimeout(async () => {
      await memberTarget.roles.remove(muteRole.id).catch(() => {});
      await memberTarget.roles.add(mainRole.id).catch(() => {});
      channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
    }, duration);
  },
};
