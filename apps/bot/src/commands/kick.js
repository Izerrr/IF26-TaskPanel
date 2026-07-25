const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "kick",
  description: "Kick seorang member dari server",
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick seorang member dari server")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan melakukan kick").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return isSlash ? context.reply({ content: "You can't use that!", ephemeral: true }) : channel.send("You can't use that!");
    }
    if (!guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return isSlash ? context.reply({ content: "I don't have the right permissions.", ephemeral: true }) : channel.send("I don't have the right permissions.");
    }

    const targetMember = isSlash ? context.options.getMember("target") : context.mentions.members.first() || (await guild.members.fetch(args[0]).catch(() => null));

    if (!targetMember) {
      return isSlash ? context.reply({ content: "Can't seem to find this user. Sorry 'bout that :/", ephemeral: true }) : channel.send("Can't seem to find this user. Sorry 'bout that :/");
    }
    if (!targetMember.kickable) {
      return isSlash ? context.reply({ content: "This user can't be kicked.", ephemeral: true }) : channel.send("This user can't be kicked.");
    }
    if (targetMember.id === author.id) {
      return isSlash ? context.reply({ content: "Bruh, you can't kick yourself!", ephemeral: true }) : channel.send("Bruh, you can't kick yourself!");
    }

    let reason = isSlash ? context.options.getString("reason") : args.slice(1).join(" ");
    if (!reason) reason = "Unspecified";

    await targetMember.kick(reason).catch(() => {
      return isSlash ? context.reply({ content: "Something went wrong", ephemeral: true }) : channel.send("Something went wrong");
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle("Member Kicked")
      .setColor("#A9908A")
      .setThumbnail(targetMember.user.displayAvatarURL())
      .addFields({ name: "User Kicked", value: `${targetMember}` }, { name: "Kicked by", value: `${author}` }, { name: "Reason", value: reason })
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
