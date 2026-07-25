const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "ship",
  description: "Ship dua orang!",
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Menghitung tingkat kecocokan (match percentage) antara dua orang user")
    .addUserOption((option) => option.setName("user1").setDescription("Orang pertama").setRequired(true))
    .addUserOption((option) => option.setName("user2").setDescription("Orang kedua").setRequired(true)),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const channel = context.channel;

    let firstUser, secondUser;

    if (isSlash) {
      firstUser = context.options.getMember("user1");
      secondUser = context.options.getMember("user2");
    } else {
      if (!args[0]) return channel.send("You forgot to mention someone!");
      if (!args[1]) return channel.send("You need to mention someone else!");

      firstUser = context.mentions.members.first() || guild.members.cache.get(args[0]);
      secondUser = context.mentions.members.at(1) || guild.members.cache.get(args[1]);
    }

    if (!firstUser) {
      const msg = `I couldn't find someone named **${isSlash ? "user1" : args[0]}**!`;
      return isSlash ? context.reply({ content: msg, ephemeral: true }) : channel.send(msg);
    }
    if (!secondUser) {
      const msg = `I couldn't find someone named **${isSlash ? "user2" : args[1]}**!`;
      return isSlash ? context.reply({ content: msg, ephemeral: true }) : channel.send(msg);
    }

    const firstSliced = firstUser.user.username.slice(0, Math.ceil(firstUser.user.username.length / 2));
    const secondSliced = secondUser.user.username.slice(Math.floor(secondUser.user.username.length / 2));

    const percentage = Math.floor(Math.random() * 101);
    const replyText = `💕 ${firstUser.user.username} + ${secondUser.user.username} = **${firstSliced}${secondSliced}** (${percentage}% match)`;

    if (isSlash) {
      await context.reply({ content: replyText });
    } else {
      await channel.send(replyText);
    }
  },
};
