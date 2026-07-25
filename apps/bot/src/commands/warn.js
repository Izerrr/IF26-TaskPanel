const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../handlers/jsonStore");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "warn",
  description: "Warn seorang member",
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan memberikan warn").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return isSlash ? context.reply({ content: "You can't use that.", ephemeral: true }) : channel.send("You can't use that.");
    }

    const targetUser = isSlash ? context.options.getUser("target") : context.mentions.users.first();
    if (!targetUser) {
      return isSlash ? context.reply({ content: "Please specify a user via mention", ephemeral: true }) : channel.send("Please specify a user via mention");
    }
    if (targetUser.bot) {
      return isSlash ? context.reply({ content: "You can't warn bots", ephemeral: true }) : channel.send("You can't warn bots");
    }
    if (targetUser.id === author.id) {
      return isSlash ? context.reply({ content: "You can't warn yourself", ephemeral: true }) : channel.send("You can't warn yourself");
    }

    const reason = (isSlash ? context.options.getString("reason") : args.slice(1).join(" ")) || "No reason provided";

    const key = `warnings_${guild.id}_${targetUser.id}`;
    const warnings = db.get(key) || [];
    warnings.push({ reason, by: author.tag, date: new Date().toLocaleDateString() });
    db.set(key, warnings);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle("Member Warned")
      .setColor("#A9908A")
      .addFields({ name: "User", value: `${targetUser}` }, { name: "Warned by", value: `${author}` }, { name: "Reason", value: reason }, { name: "Total Warnings", value: `${warnings.length}` })
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
