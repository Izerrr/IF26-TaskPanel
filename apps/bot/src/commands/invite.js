const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Mendapatkan tautan undangan resmi untuk bot ini",
  data: new SlashCommandBuilder().setName("invite").setDescription("Mendapatkan tautan undangan resmi untuk bot ini"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;

    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder().setTitle("🔗 Invite AVIVIION Helper").setDescription(`Klik [Di Sini](${inviteLink}) untuk mengundang bot ini ke server kamu!`).setColor("#A9908A").setTimestamp();

    if (isSlash) await context.reply({ embeds: [embed] });
    else await channel.send({ embeds: [embed] });
  },
};
