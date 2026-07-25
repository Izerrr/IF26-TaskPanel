const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  name: "stay",
  description: "Membuat bot masuk dan standby di Voice Channel secara permanen",
  category: "utility",
  run: async (client, context, args) => {
    // VARIABEL DETEKTOR
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const TARGET_VOICE_ID = "1420739800268279928";

    try {
      // Masuk ke Voice Channel
      joinVoiceChannel({
        channelId: TARGET_VOICE_ID,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true, // Hemat resource panel Pterodactyl
        selfMute: true,
      });

      const replyMsg = "🔊 **Bot Stay Mode:** Berhasil masuk dan standby di Voice Channel.";

      // PENGIRIMAN OUTPUT RESUPON
      if (isSlash) {
        await context.reply({ content: replyMsg, ephemeral: false });
      } else {
        await context.channel.send(replyMsg);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = "❌ Gagal memasuki Voice Channel. Pastikan bot punya izin!";

      if (isSlash) {
        await context.reply({ content: errorMsg, ephemeral: true });
      } else {
        await context.channel.send(errorMsg);
      }
    }
  },
};
