const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const queue = require("../handlers/musicQueue");

module.exports = {
  name: "leave",
  description: "Mengeluarkan bot musik dari voice channel",
  data: new SlashCommandBuilder().setName("leave").setDescription("Mengeluarkan bot musik dari voice channel"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const channel = context.channel;
    const member = context.member;

    if (!member.voice.channel) {
      const text = "❌ Anda harus berada di voice channel untuk mengusir bot!";
      return isSlash ? context.reply({ content: text, ephemeral: true }) : channel.send(text);
    }

    const connection = getVoiceConnection(guild.id);
    if (!connection) {
      const text = "❌ Bot tidak sedang tersambung ke voice channel mana pun.";
      return isSlash ? context.reply({ content: text, ephemeral: true }) : channel.send(text);
    }

    connection.destroy();
    queue.delete(guild.id);

    const successText = "👋 Berhasil keluar dari voice channel dan mereset antrean musik.";
    if (isSlash) await context.reply({ content: successText });
    else await channel.send(successText);
  },
};
