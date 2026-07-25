const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "pat",
  category: "extra",
  description: "Mengelus kepala seseorang (pat)",
  data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Mengelus kepala seseorang menggunakan gif anime")
    .addUserOption((option) => option.setName("target").setDescription("User yang ingin dielus").setRequired(true)),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    const target = isSlash ? context.options.getUser("target") : context.mentions.users.first();
    if (!target) {
      const noTarget = "Please mention someone to pat!";
      return isSlash ? context.reply({ content: noTarget, ephemeral: true }) : channel.send(noTarget);
    }

    let data;
    try {
      const response = await axios.get("https://some-random-api.com/animu/pat");
      data = response.data;
    } catch (e) {
      const errMsg = "An error occurred fetching the gif!";
      return isSlash ? context.reply({ content: errMsg, ephemeral: true }) : channel.send(errMsg);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle(`${author.username} pats ${target.username}!`)
      .setDescription("Cuteness Overload")
      .setImage(data.link)
      .setColor("#A9908A")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
