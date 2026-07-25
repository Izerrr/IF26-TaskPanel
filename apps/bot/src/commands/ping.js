const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Cek latensi bot",
  data: new SlashCommandBuilder().setName("ping").setDescription("Cek latensi bot"),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();

    // Baik message maupun interaction sama-sama memiliki createdTimestamp
    const latency = Date.now() - context.createdTimestamp;
    const replyMsg = `🏓 | This Bot's Latency is: **${latency}ms.**`;

    if (isSlash) {
      await context.reply({ content: replyMsg });
    } else {
      await context.channel.send(replyMsg);
    }
  },
};
