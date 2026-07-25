const { EmbedBuilder, SlashCommandBuilder } = require("discord.js"); // Tambahkan SlashCommandBuilder di sini

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "serverinfo",
  description: "Menampilkan statistik dan informasi server AVIVIION",
  category: "extra",
  // Wajib ditambahkan agar slash command-nya terdaftar dengan rapi di Discord API
  data: new SlashCommandBuilder().setName("serverinfo").setDescription("Menampilkan statistik dan informasi server AVIVIION"),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;

    // Seleksi user pengaju perintah: Slash pakai .user, Prefix pakai .author
    const user = isSlash ? context.user : context.author;

    await guild.members.fetch(); // Fetch all members to get accurate count

    const owner = await guild.fetchOwner();
    const onlineMembers = guild.members.cache.filter((m) => m.presence?.status === "online").size;

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor("#A9908A")
      .setTitle(`${guild.name} Server Stats`)
      .addFields(
        { name: "➤ Owner", value: owner.user.tag, inline: true },
        { name: "➤ Members", value: `${guild.memberCount} users`, inline: true },
        { name: "➤ Members Online", value: `${onlineMembers} online`, inline: true },
        { name: "➤ Total Bots", value: `${guild.members.cache.filter((m) => m.user.bot).size} bots`, inline: true },
        { name: "➤ Creation Date", value: guild.createdAt.toLocaleDateString("en-US"), inline: true },
        { name: "➤ Roles Count", value: `${guild.roles.cache.size} roles`, inline: true },
        { name: "➤ Verified", value: guild.verified ? "Yes ✅" : "No ❌", inline: true },
        { name: "➤ Boosters", value: guild.premiumSubscriptionCount >= 1 ? `${guild.premiumSubscriptionCount} boosters` : "No boosters", inline: true },
        { name: "➤ Emojis", value: guild.emojis.cache.size >= 1 ? `${guild.emojis.cache.size} emojis` : "No emojis", inline: true },
      )
      .setImage("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .setTimestamp()
      // Ganti message.author.tag menjadi user.tag yang dinamis
      .setFooter({ text: `insyaallah halal | Command requested by: ${user.tag}`, iconURL: FOOTER_ICON });

    // Arahkan cara merespons berdasarkan jalurnya (Slash vs Prefix)
    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await context.channel.send({ embeds: [embed] });
    }
  },
};
