const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../handlers/jsonStore");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "warnings",
  description: "Cek warnings seorang member",
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Cek daftar warnings seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin dicek warnings-nya").setRequired(true))
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

    const key = `warnings_${guild.id}_${userTarget.id}`;
    const warnings = db.get(key) || [];

    if (warnings.length === 0) {
      const txt = `**${userTarget.username} has no warnings**`;
      return isSlash ? context.reply({ content: txt }) : channel.send(txt);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle(`Warnings for ${userTarget.username}`)
      .setColor("#A9908A")
      .setDescription(warnings.map((w, i) => `**${i + 1}.** ${w.reason} - by ${w.by} (${w.date})`).join("\n"))
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
