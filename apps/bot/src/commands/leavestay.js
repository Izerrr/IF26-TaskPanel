const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "leavestay",
  description: "Mengeluarkan bot dari Voice Channel tempat ia standby",
  category: "utility",
  run: async (client, context, args) => {
    // VARIABEL DETEKTOR
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;

    // Cari koneksi voice bot di server ini
    const connection = getVoiceConnection(guild.id);

    if (connection) {
      connection.destroy();
      const replyMsg = "👋 **Bot Stay Mode:** Berhasil keluar dari Voice Channel.";

      // PENGIRIMAN OUTPUT RESUPON
      if (isSlash) {
        await context.reply({ content: replyMsg, ephemeral: false });
      } else {
        await context.channel.send(replyMsg);
      }
    } else {
      const errorMsg = "❌ Bot sedang tidak berada di Voice Channel mana pun.";

      if (isSlash) {
        await context.reply({ content: errorMsg, ephemeral: true });
      } else {
        await context.channel.send(errorMsg);
      }
    }
  },
};
