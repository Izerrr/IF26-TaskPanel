const { SlashCommandBuilder } = require("discord.js");
const figlet = require("figlet");

module.exports = {
  name: "ascii",
  description: "Converts text to ASCII art",
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Mengubah teks biasa menjadi teks seni ASCII art")
    .addStringOption((option) => option.setName("teks").setDescription("Teks yang ingin diubah menjadi ASCII").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const msg = isSlash ? context.options.getString("teks") : args.join(" ");

    if (!msg) {
      return isSlash ? context.reply({ content: "Teks tidak boleh kosong!", ephemeral: true }) : channel.send("Please provide some text");
    }

    figlet.text(msg, async (err, data) => {
      if (err) {
        const errMsg = "Something went wrong";
        return isSlash ? context.reply({ content: errMsg, ephemeral: true }) : channel.send(errMsg);
      }
      if (data.length > 2000) {
        const longMsg = "Text is too long!";
        return isSlash ? context.reply({ content: longMsg, ephemeral: true }) : channel.send(longMsg);
      }

      if (isSlash) {
        await context.reply("```" + data + "```");
      } else {
        await channel.send("```" + data + "```");
      }
    });
  },
};
