const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "userinfo",
  category: "extra",
  description: "Menampilkan informasi statistik pengguna",
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Menampilkan informasi statistik pengguna")
    .addUserOption((option) => option.setName("target").setDescription("User yang ingin dicek statistiknya (kosongkan untuk diri sendiri)").setRequired(false)),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;

    // 1. Ambil Target Member (Penyesuaian Hybrid)
    const targetMember = isSlash ? context.options.getMember("target") || context.member : context.mentions.members.first() || guild.members.cache.get(args[0]) || context.member;

    // 2. Ambil User Pengaju Perintah (Slash pakai .user, Prefix pakai .author)
    const requester = isSlash ? context.user : context.author;

    const presence = targetMember.presence;
    let status = "Offline";
    if (presence) {
      switch (presence.status) {
        case "online":
          status = "Online";
          break;
        case "dnd":
          status = "Do Not Disturb";
          break;
        case "idle":
          status = "Idle";
          break;
        default:
          status = "Offline";
          break;
      }
    }

    const activity = presence?.activities?.[0]?.name ?? "User isn't doing anything!";

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle(`${targetMember.user.username} stats`)
      .setColor("#A9908A")
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "➤ Username", value: targetMember.user.username, inline: true },
        { name: "➤ ID", value: targetMember.user.id, inline: true },
        { name: "➤ Current Status", value: status, inline: true },
        { name: "➤ Activity", value: activity, inline: true },
        { name: "➤ Avatar link", value: `[Click Here](${targetMember.user.displayAvatarURL()})`, inline: true },
        { name: "➤ Account Created", value: targetMember.user.createdAt.toLocaleDateString("en-US"), inline: true },
        { name: "➤ Joined Server", value: targetMember.joinedAt?.toLocaleDateString("en-US") ?? "Unknown", inline: true },
        { name: "➤ Roles", value: targetMember.roles.cache.map((r) => r.toString()).join(", ") || "None", inline: false },
      )
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${requester.tag}`, iconURL: FOOTER_ICON });

    // 3. Respon Akhir
    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await context.channel.send({ embeds: [embed] });
    }
  },
};
