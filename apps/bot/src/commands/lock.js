const { PermissionFlagsBits, ChannelType, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "lock",
  category: "moderation",
  description: "Lock/unlock semua channel di server",
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Mengunci atau membuka kunci pengiriman pesan untuk seluruh channel")
    .addStringOption((option) => option.setName("status").setDescription("Nyalakan (on) atau matikan (off) penguncian server").setRequired(true).addChoices({ name: "on (Lock All)", value: "on" }, { name: "off (Unlock All)", value: "off" }))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const txt = "You don't have permission to do that.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const statusInput = isSlash ? context.options.getString("status") : args[0];
    const channels = guild.channels.cache.filter((ch) => ch.type !== ChannelType.GuildCategory);

    if (statusInput === "on") {
      channels.forEach((ch) => {
        ch.permissionOverwrites
          .edit(guild.roles.everyone, {
            SendMessages: false,
          })
          .catch(() => {});
      });

      const txt = "🔒 Locked all channels.";
      return isSlash ? context.reply({ content: txt }) : channel.send(txt);
    } else if (statusInput === "off") {
      channels.forEach((ch) => {
        ch.permissionOverwrites
          .edit(guild.roles.everyone, {
            SendMessages: null,
          })
          .catch(() => {});
      });

      const txt = "🔓 Unlocked all channels.";
      return isSlash ? context.reply({ content: txt }) : channel.send(txt);
    } else {
      const txt = "Usage: `a!lock on` or `a!lock off`";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }
  },
};
