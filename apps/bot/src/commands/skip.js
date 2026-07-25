const { SlashCommandBuilder } = require("discord.js");
const queue = require("../handlers/musicQueue");

module.exports = {
  name: "skip",
  description: "Melewati (skip) lagu musik yang sedang diputar",
  data: new SlashCommandBuilder().setName("skip").setDescription("Melewati (skip) lagu musik yang sedang diputar"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const channel = context.channel;
    const member = context.member;

    if (!member.voice.channel) {
      const text = "❌ Anda harus berada di voice channel untuk melewati lagu!";
      return isSlash ? context.reply({ content: text, ephemeral: true }) : channel.send(text);
    }

    const serverQueue = queue.get(guild.id);
    if (!serverQueue) {
      const text = "❌ Tidak ada lagu yang sedang diputar saat ini.";
      return isSlash ? context.reply({ content: text, ephemeral: true }) : channel.send(text);
    }

    // Menghentikan player memicu event Idle untuk menghapus koneksi atau memutar lagu berikutnya
    serverQueue.player.stop();

    const successText = "⏭️ Lagu berhasil dilewati!";
    if (isSlash) await context.reply({ content: successText });
    else await channel.send(successText);
  },
};
